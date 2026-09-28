import { assignInlineVars, setElementVars } from "@vanilla-extract/dynamic";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import {
  BOOT,
  JACKS,
  POINTS_PER_CABLE,
  STAGE,
  cableHandles,
  cablePath,
  endPin,
  isJackFree,
  jackById,
  layCable,
  nearestFreeJack,
  stepCable,
  stretchPercent,
  type Cable,
  type Jack,
  type SolverParams,
} from "./patch-bay-verlet";
import * as styles from "./patch-bay.css";

type Accent = "primary" | "secondary" | "kirby";
type End = 0 | 1;

// The rack's accents, as the footer's cable wears them.
const CABLES: { name: string; accent: Accent; from: string; to: string }[] = [
  { name: "Gold", accent: "primary", from: "A2", to: "B5" },
  { name: "Mint", accent: "secondary", from: "A6", to: "B1" },
  { name: "Pink", accent: "kirby", from: "A4", to: "A7" },
];

const SETTLE_STEPS = 320;
const REST_SPEED = 0.02;
const SNAP_DISTANCE = 56;
const r1 = (value: number) => Math.round(value * 10) / 10;

export const DEFAULT_SOLVER: SolverParams = { gravity: 1, damping: 0.985, slack: 45, passes: 8 };

/** The cables in their first jacks, already hanging at rest: the same on the server and the client. */
function restingCables(params: SolverParams = DEFAULT_SOLVER): Cable[] {
  const cables = CABLES.map(({ from, to }) => layCable(jackById(from), jackById(to)));
  for (let step = 0; step < SETTLE_STEPS; step += 1) {
    for (const cable of cables) stepCable(cable, [endPin(cable, 0), endPin(cable, 1)], params);
  }
  return cables;
}

interface Drag {
  cable: number;
  end: End;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
}

interface PlugGeometry {
  /** Centre of the plug body. */
  x: number;
  y: number;
  /** Degrees; 0 is upright in its jack. */
  angle: number;
  boot: string;
}

function plugGeometry(cable: Cable, end: End, held: boolean): PlugGeometry {
  const id = cable.ends[end];
  let x: number;
  let y: number;
  let ux = 0;
  let uy = 1;
  let ex: number;
  let ey: number;
  if (id && !held) {
    const jack = jackById(id);
    x = jack.x;
    y = jack.cy;
    ex = jack.x;
    ey = jack.anchorY;
  } else {
    const last = cable.points.length - 1;
    const tip = cable.points[end === 0 ? 0 : last];
    const next = cable.points[end === 0 ? 1 : last - 1];
    const length = Math.hypot(next.x - tip.x, next.y - tip.y) || 1;
    ux = (next.x - tip.x) / length;
    uy = (next.y - tip.y) / length;
    x = tip.x - ux * (BOOT + 21);
    y = tip.y - uy * (BOOT + 21);
    ex = tip.x;
    ey = tip.y;
  }
  // The boot: a taper from the plug body down to the cable.
  const nx = -uy;
  const ny = ux;
  const sx = x + ux * 21;
  const sy = y + uy * 21;
  const boot = [
    [sx + nx * 7, sy + ny * 7],
    [ex + nx * 5.5, ey + ny * 5.5],
    [ex - nx * 5.5, ey - ny * 5.5],
    [sx - nx * 7, sy - ny * 7],
  ]
    .map(([px, py]) => `${r1(px)},${r1(py)}`)
    .join(" ");
  const angle = id && !held ? 0 : (Math.atan2(uy, ux) * 180) / Math.PI - 90;
  return { x, y, angle, boot };
}

const plugVars = ({ x, y, angle }: PlugGeometry) => ({
  [styles.plugX]: `${(x / STAGE.width) * 100}%`,
  [styles.plugY]: `${(y / STAGE.height) * 100}%`,
  [styles.plugAngle]: `${r1(angle)}deg`,
});

const pointsAttr = (cable: Cable) =>
  cable.points.map((point) => `${r1(point.x)},${r1(point.y)}`).join(" ");

function handlesPath(cable: Cable): string {
  const points = cable.points;
  return cableHandles(points)
    .map(({ c1, c2, to }, index) => {
      const from = points[index];
      return `M ${r1(from.x)} ${r1(from.y)} L ${r1(c1.x)} ${r1(c1.y)} M ${r1(to.x)} ${r1(to.y)} L ${r1(c2.x)} ${r1(c2.y)}`;
    })
    .join(" ");
}

// Computed once: what the page prerenders, and what React keeps as its props afterwards (the
// loop writes the live values straight to the DOM, so a re-render never moves anything back).
const INITIAL = restingCables();
const INITIAL_PATHS = INITIAL.map((cable) => cablePath(cable.points));
const INITIAL_PLUGS = INITIAL.map((cable) => [
  plugGeometry(cable, 0, false),
  plugGeometry(cable, 1, false),
]);
const INITIAL_POINTS = INITIAL.map(pointsAttr);
const INITIAL_HANDLES = handlesPath(INITIAL[0]);
const LEDS_OFF = "color-mix(in srgb, oklch(0.93 0.03 80) 12%, black)";

const cloneCables = (cables: readonly Cable[]): Cable[] =>
  cables.map((cable) => ({
    ends: [...cable.ends],
    base: cable.base,
    points: cable.points.map((point) => ({ ...point })),
  }));

interface CableRefs {
  paths: (SVGPathElement | null)[];
  boots: (SVGPolygonElement | null)[];
  plugs: (HTMLButtonElement | null)[];
  xrayLine: SVGPolylineElement | null;
  xrayDots: (SVGCircleElement | null)[];
}

export interface PatchBayProps {
  params: SolverParams;
  xray: boolean;
  /** Changing it shakes every free point. */
  shakeToken: number;
  /** Changing it lays the cables back into their first jacks. */
  resetToken: number;
}

/**
 * Three patch cables on a rack: Verlet ropes you unplug, swing and replug. The solver runs in a
 * requestAnimationFrame loop that writes each cable's path and each plug's position straight
 * to the DOM, and sleeps once nothing moves; React only renders what plugging changes (LEDs,
 * labels, the announcement).
 */
export function PatchBay({ params, xray, shakeToken, resetToken }: PatchBayProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const handlesRef = useRef<SVGPathElement>(null);
  const refs = useRef<CableRefs[]>(
    CABLES.map(() => ({ paths: [], boots: [], plugs: [], xrayLine: null, xrayDots: [] })),
  );
  const sim = useRef({
    cables: cloneCables(INITIAL),
    drag: null as Drag | null,
    still: 0,
    running: false,
    frame: 0,
    seed: 0x5e2d91af,
  });
  const paramsRef = useRef(params);
  const xrayRef = useRef(xray);
  const wakeRef = useRef<() => void>(() => {});
  const refreshRef = useRef<() => void>(() => {});

  const [ends, setEnds] = useState(() => INITIAL.map((cable) => [...cable.ends]));
  const [held, setHeld] = useState<{ cable: number; end: End } | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const state = sim.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pins = (index: number): [ReturnType<typeof endPin>, ReturnType<typeof endPin>] => {
      const cable = state.cables[index];
      const drag = state.drag;
      return [0, 1].map((end) =>
        drag && drag.cable === index && drag.end === end
          ? { x: drag.x, y: drag.y }
          : endPin(cable, end as End),
      ) as [ReturnType<typeof endPin>, ReturnType<typeof endPin>];
    };

    const step = () => {
      let moved = 0;
      state.cables.forEach((cable, index) => {
        moved = Math.max(moved, stepCable(cable, pins(index), paramsRef.current));
      });
      return moved;
    };

    const draw = () => {
      state.cables.forEach((cable, index) => {
        const cableRefs = refs.current[index];
        const d = cablePath(cable.points);
        for (const path of cableRefs.paths) path?.setAttribute("d", d);
        ([0, 1] as const).forEach((end) => {
          const isHeld = Boolean(
            state.drag && state.drag.cable === index && state.drag.end === end,
          );
          const geometry = plugGeometry(cable, end, isHeld);
          cableRefs.boots[end]?.setAttribute("points", geometry.boot);
          const plug = cableRefs.plugs[end];
          if (plug) setElementVars(plug, plugVars(geometry));
        });
        if (xrayRef.current) {
          cableRefs.xrayLine?.setAttribute("points", pointsAttr(cable));
          cable.points.forEach((point, dot) => {
            cableRefs.xrayDots[dot]?.setAttribute("cx", String(r1(point.x)));
            cableRefs.xrayDots[dot]?.setAttribute("cy", String(r1(point.y)));
          });
        }
      });
      if (xrayRef.current) {
        handlesRef.current?.setAttribute("d", handlesPath(state.cables[0]));
        const worst = Math.max(
          ...state.cables.map((cable) => stretchPercent(cable, paramsRef.current.slack)),
        );
        if (readoutRef.current) {
          readoutRef.current.textContent = `${state.cables.length} cables · ${POINTS_PER_CABLE} points · ${paramsRef.current.passes} passes · stretch ${worst.toFixed(1)} % · ${state.running ? "awake" : "asleep"}`;
        }
      }
    };

    const loop = () => {
      const moved = step();
      state.still = !state.drag && moved < REST_SPEED ? state.still + 1 : 0;
      // Asleep once nothing has moved for 20 frames: no frame is asked for until a hand wakes it.
      state.running = state.still <= 20;
      draw();
      if (state.running) state.frame = requestAnimationFrame(loop);
    };

    wakeRef.current = () => {
      state.still = 0;
      if (reduced) {
        for (let index = 0; index < 240; index += 1) step();
        draw();
        return;
      }
      if (state.running) return;
      state.running = true;
      state.frame = requestAnimationFrame(loop);
    };
    refreshRef.current = draw;

    // A first swing on arrival.
    if (!reduced) {
      for (const cable of state.cables) {
        cable.points.forEach((point, index) => {
          if (index === 0 || index === cable.points.length - 1) return;
          point.px -= 4;
        });
      }
    }
    wakeRef.current();
    return () => {
      cancelAnimationFrame(state.frame);
      state.running = false;
    };
  }, []);

  useEffect(() => {
    paramsRef.current = params;
    wakeRef.current();
  }, [params]);

  useEffect(() => {
    xrayRef.current = xray;
    refreshRef.current();
  }, [xray]);

  useEffect(() => {
    if (shakeToken === 0) return;
    const state = sim.current;
    const random = () => {
      state.seed = (state.seed * 1664525 + 1013904223) >>> 0;
      return state.seed / 4294967296;
    };
    state.cables.forEach((cable) =>
      cable.points.forEach((point, index) => {
        if ((index === 0 && cable.ends[0]) || (index === cable.points.length - 1 && cable.ends[1]))
          return;
        point.px -= (random() - 0.5) * 8;
        point.py += random() * 4;
      }),
    );
    wakeRef.current();
  }, [shakeToken]);

  useEffect(() => {
    if (resetToken === 0) return;
    sim.current.cables = cloneCables(restingCables(paramsRef.current));
    sim.current.drag = null;
    setEnds(sim.current.cables.map((cable) => [...cable.ends]));
    setHeld(null);
    setStatus("Cables back in their jacks");
    wakeRef.current();
  }, [resetToken]);

  const publish = (message: string) => {
    setEnds(sim.current.cables.map((cable) => [...cable.ends]));
    setStatus(message);
    wakeRef.current();
  };

  const plugInto = (index: number, end: End, jack: Jack) => {
    const cable = sim.current.cables[index];
    cable.ends[end] = jack.id;
    const point = cable.points[end === 0 ? 0 : cable.points.length - 1];
    point.x = point.px = jack.x;
    point.y = point.py = jack.anchorY;
  };

  const toStage = (event: PointerEvent) => {
    const box = stageRef.current?.getBoundingClientRect();
    if (!box) return { x: 0, y: 0 };
    return {
      x: ((event.clientX - box.left) / box.width) * STAGE.width,
      y: ((event.clientY - box.top) / box.height) * STAGE.height,
    };
  };

  const plugName = (index: number, end: End) => `${CABLES[index].name} plug ${end + 1}`;

  const onPointerDown = (index: number, end: End) => (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const state = sim.current;
    const cable = state.cables[index];
    const tip = cable.points[end === 0 ? 0 : cable.points.length - 1];
    const at = toStage(event);
    const from = cable.ends[end];
    cable.ends[end] = null;
    state.drag = {
      cable: index,
      end,
      x: tip.x,
      y: tip.y,
      offsetX: tip.x - at.x,
      offsetY: tip.y - at.y,
    };
    setHeld({ cable: index, end });
    publish(`${plugName(index, end)} lifted${from ? ` from ${from}` : ""}`);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = sim.current.drag;
    if (!drag) return;
    const at = toStage(event);
    let x = Math.min(STAGE.width - 10, Math.max(10, at.x + drag.offsetX));
    let y = Math.min(STAGE.floor - 42, Math.max(10, at.y + drag.offsetY));
    // The other end holds the cable: a plug goes no farther than the cable reaches.
    const anchor = endPin(sim.current.cables[drag.cable], drag.end === 0 ? 1 : 0);
    if (anchor) {
      const reach =
        sim.current.cables[drag.cable].base * (1 + paramsRef.current.slack / 100) * 0.99;
      const distance = Math.hypot(x - anchor.x, y - anchor.y);
      if (distance > reach) {
        x = anchor.x + ((x - anchor.x) * reach) / distance;
        y = anchor.y + ((y - anchor.y) * reach) / distance;
      }
    }
    drag.x = x;
    drag.y = y;
    wakeRef.current();
  };

  const onPointerUp = () => {
    const state = sim.current;
    const drag = state.drag;
    if (!drag) return;
    state.drag = null;
    setHeld(null);
    const plug = plugGeometry(state.cables[drag.cable], drag.end, false);
    const jack = nearestFreeJack(
      state.cables,
      drag.cable,
      drag.end,
      plug,
      paramsRef.current.slack,
      SNAP_DISTANCE,
    );
    if (jack) plugInto(drag.cable, drag.end, jack);
    publish(
      jack
        ? `${plugName(drag.cable, drag.end)} in ${jack.id}`
        : `${plugName(drag.cable, drag.end)} hanging`,
    );
  };

  const onKeyDown = (index: number, end: End) => (event: KeyboardEvent<HTMLButtonElement>) => {
    const state = sim.current;
    const cable = state.cables[index];
    const slack = paramsRef.current.slack;
    const name = plugName(index, end);
    const current = cable.ends[end];

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (current) {
        cable.ends[end] = null;
        publish(`${name} unplugged from ${current}, hanging`);
        return;
      }
      const tip = plugGeometry(cable, end, false);
      const jack = nearestFreeJack(state.cables, index, end, tip, slack);
      if (jack) plugInto(index, end, jack);
      publish(jack ? `${name} in ${jack.id}` : `${name}: no jack in reach`);
      return;
    }

    const direction = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }[event.key];
    if (!direction) return;
    event.preventDefault();
    let target: Jack | undefined;
    if (!current) {
      target = nearestFreeJack(state.cables, index, end, plugGeometry(cable, end, false), slack);
    } else {
      const from = jackById(current);
      const free = (jack: Jack) => isJackFree(state.cables, index, end, jack, slack);
      if (direction[0] !== 0) {
        for (let col = from.col + direction[0]; col >= 0 && col < 8; col += direction[0]) {
          const jack = JACKS[from.row * 8 + col];
          if (free(jack)) {
            target = jack;
            break;
          }
        }
      } else {
        const row = from.row + direction[1];
        target = JACKS.filter((jack) => jack.row === row && free(jack)).toSorted(
          (a, b) => Math.abs(a.col - from.col) - Math.abs(b.col - from.col),
        )[0];
      }
    }
    if (!target) {
      publish(`${name} stays${current ? ` in ${current}` : ""}`);
      return;
    }
    plugInto(index, end, target);
    publish(`${name} in ${target.id}`);
  };

  const litBy = new Map<string, Accent>();
  ends.forEach((cableEnds, index) => {
    for (const id of cableEnds) if (id) litBy.set(id, CABLES[index].accent);
  });

  return (
    <div ref={stageRef} className={styles.stage} data-xray={xray || undefined}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id="patch-bay-shadow" x="-10%" y="-10%" width="120%" height="140%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        <rect className={styles.panel} x="96" y="28" width="616" height="196" rx="12" />
        <text className={styles.panelLabel} x="116" y="86">
          LINK A
        </text>
        <text className={styles.panelLabel} x="116" y="182">
          LINK B
        </text>
        {JACKS.map((jack) => (
          <g key={jack.id} transform={`translate(${jack.x - 27} ${jack.top})`}>
            <text className={styles.jackNumber} x="27" y="-6">
              {String(jack.col + 1).padStart(2, "0")}
            </text>
            <rect className={styles.socket} width="54" height="44" rx="4" />
            <rect className={styles.opening} x="11" y="10" width="32" height="24" rx="2" />
            <circle
              className={styles.led}
              data-accent={litBy.get(jack.id)}
              cx="49"
              cy="-9"
              r="2.6"
              fill={litBy.has(jack.id) ? undefined : LEDS_OFF}
            />
          </g>
        ))}
        <line className={styles.floor} x1="0" x2={STAGE.width} y1={STAGE.floor} y2={STAGE.floor} />

        {CABLES.map((spec, index) => (
          <g key={spec.name} className={styles.cableAccents[spec.accent]}>
            {(["shadow", "outline", "sheath", "highlight"] as const).map((layer, layerIndex) => (
              <path
                key={layer}
                ref={(element) => {
                  refs.current[index].paths[layerIndex] = element;
                }}
                className={styles.cableLayers[layer]}
                d={INITIAL_PATHS[index]}
                filter={layer === "shadow" ? "url(#patch-bay-shadow)" : undefined}
              />
            ))}
            {([0, 1] as const).map((end) => (
              <polygon
                key={end}
                ref={(element) => {
                  refs.current[index].boots[end] = element;
                }}
                className={styles.boot}
                points={INITIAL_PLUGS[index][end].boot}
              />
            ))}
          </g>
        ))}

        <g className={styles.xrayLayer}>
          {CABLES.map((spec, index) => (
            <g key={spec.name}>
              <polyline
                ref={(element) => {
                  refs.current[index].xrayLine = element;
                }}
                className={styles.constraint}
                points={INITIAL_POINTS[index]}
              />
              {INITIAL[index].points.map((point, dot) => (
                <circle
                  // A point is its position on the cable.
                  // oxlint-disable-next-line react/no-array-index-key
                  key={dot}
                  ref={(element) => {
                    refs.current[index].xrayDots[dot] = element;
                  }}
                  className={styles.verletPoint}
                  data-pinned={dot === 0 || dot === POINTS_PER_CABLE - 1 || undefined}
                  cx={r1(point.x)}
                  cy={r1(point.y)}
                  r="2.6"
                />
              ))}
            </g>
          ))}
          <path ref={handlesRef} className={styles.handles} d={INITIAL_HANDLES} />
        </g>
      </svg>

      {CABLES.map((spec, index) =>
        ([0, 1] as const).map((end) => {
          const jack = ends[index][end];
          const isHeld = held?.cable === index && held.end === end;
          return (
            // A drag handle, not a press: React Aria's press events would swallow the pointer
            // drag, so this is a native button with its own pointer and keyboard handling.
            <button
              key={`${spec.name}-${end}`}
              ref={(element) => {
                refs.current[index].plugs[end] = element;
              }}
              type="button"
              className={styles.plug}
              data-accent={spec.accent}
              data-held={isHeld || undefined}
              data-plugged={(jack && !isHeld) || undefined}
              aria-label={`${spec.name} cable, plug ${end + 1}, ${jack ? `in jack ${jack}` : "unplugged"}. Arrows move it, space unplugs or plugs it.`}
              style={assignInlineVars(plugVars(INITIAL_PLUGS[index][end]))}
              onPointerDown={onPointerDown(index, end)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={onKeyDown(index, end)}
            >
              <span className={styles.plugBody} aria-hidden="true" />
            </button>
          );
        }),
      )}

      <span ref={readoutRef} className={styles.readout} aria-hidden="true">
        3 cables · 16 points · 8 passes
      </span>
      <p className={styles.srOnly} aria-live="polite">
        {status}
      </p>
    </div>
  );
}
