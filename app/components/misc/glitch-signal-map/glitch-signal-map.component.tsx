import { memo, useEffect, useRef } from "react";
import * as styles from "./glitch-signal-map.css";

/** What a cell is showing: its state, or the accent flag drawn over it. */
export type GlitchCellKind = "idle" | "active" | "accent" | "recal";

/** The grid after a tick, for an xray readout. */
export interface GlitchSignalMapStats {
  tick: number;
  /** Cells rewritten by this tick. */
  rewritten: number;
  cells: number;
  counts: Record<GlitchCellKind, number>;
}

export interface GlitchSignalMapCell {
  index: number;
  row: number;
  col: number;
  seed: number;
  kind: GlitchCellKind;
}

export interface GlitchSignalMapProps {
  isAnimating: boolean;
  className?: string;
  /** Milliseconds between two rewrites of the grid. */
  tickMs?: number;
  /** Share of the cells rewritten per tick (0–1). */
  updateRatio?: number;
  /** Start of the generator every value comes from. */
  seed?: number;
  /** Draw the mechanism: cells by state, the ones this tick rewrote ringed in gold. */
  xray?: boolean;
  /** Changing it while paused advances the grid by one tick. */
  stepToken?: number;
  onTick?: (stats: GlitchSignalMapStats) => void;
  onHoverCell?: (cell: GlitchSignalMapCell | null) => void;
}

const BASE_SEED = 0x5e2d91af;
const LCG_A = 1664525;
const LCG_C = 1013904223;

const PAD_PX = 4;
const GAP_PX = 2;

const MAX_DPR = 1.5;
const TARGET_FRAME_MS = 1000 / 30;

const TICK_MS = 250;
const UPDATE_RATIO = 0.04;
const RECALIBRATE_DURATION_MS = 120;

const DOT_COUNT = 12;

/** The tuning the home runs with: what the props default to. */
export const GLITCH_SIGNAL_MAP_DEFAULTS = {
  tickMs: TICK_MS,
  updateRatio: UPDATE_RATIO,
  seed: BASE_SEED,
} as const;

const PULSE_PERIOD_S = 3.4;
const PULSE_RADIANS_PER_SECOND = (Math.PI * 2) / PULSE_PERIOD_S;

const STATE_IDLE = 0;
const STATE_ACTIVE = 1;
const STATE_RECALIBRATING = 2;

type BlockState = typeof STATE_IDLE | typeof STATE_ACTIVE | typeof STATE_RECALIBRATING;

interface BlockCell {
  state: BlockState;
  seed: number;
  accent: boolean;
  recalUntil: number;
  settleState: BlockState;
  settleSeed: number;
  pulseDelay: number;
}

interface DotMeta {
  topPct: number;
  leftPct: number;
  accent: boolean;
}

interface DotCell {
  x: number;
  y: number;
  accent: boolean;
}

interface RectCell {
  x: number;
  y: number;
}

interface GridLayout {
  cols: number;
  rows: number;
  bx: number;
  by: number;
  bw: number;
  bh: number;
}

const lcg = (seed: number): number => (seed * LCG_A + LCG_C) >>> 0;

const buildBlocks = (count: number, base: number = BASE_SEED): BlockCell[] => {
  const cells: BlockCell[] = [];
  let current = base;

  for (let index = 0; index < count; index += 1) {
    current = lcg(current ^ (index * 2654435761));

    cells[index] = {
      state: (current & 0x0f) < 2 ? STATE_ACTIVE : STATE_IDLE,
      seed: current,
      accent: ((current >>> 8) & 0x0f) === 0,
      recalUntil: 0,
      settleState: STATE_IDLE,
      settleSeed: current,
      pulseDelay: ((index * 11) % 240) / 80,
    };
  }

  return cells;
};

const buildDots = (count: number, base: number = BASE_SEED): DotMeta[] => {
  const dots: DotMeta[] = [];
  let seed = base ^ 0x00abc123;

  for (let index = 0; index < count; index += 1) {
    seed = lcg(seed);
    const topPct = 8 + (seed % 84);

    seed = lcg(seed);
    const leftPct = 10 + (seed % 78);

    dots[index] = {
      topPct,
      leftPct,
      accent: ((seed >>> 5) & 0x07) === 0,
    };
  }

  return dots;
};

const DOT_META = buildDots(DOT_COUNT);

const computeLayout = (width: number, height: number): GridLayout => {
  const innerW = Math.max(1, width - PAD_PX * 2);
  const innerH = Math.max(1, height - PAD_PX * 2);

  const cols = Math.max(3, Math.min(6, Math.floor(innerW / 16)));
  const rows = Math.max(14, Math.floor(innerH / 10));

  const bw = (innerW - GAP_PX * (cols - 1)) / cols;
  const bh = (innerH - GAP_PX * (rows - 1)) / rows;

  return {
    cols,
    rows,
    bx: PAD_PX,
    by: PAD_PX,
    bw,
    bh,
  };
};

const buildRects = ({ cols, rows, bx, by, bw, bh }: GridLayout): RectCell[] => {
  const rects: RectCell[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      rects[row * cols + col] = {
        x: bx + col * (bw + GAP_PX),
        y: by + row * (bh + GAP_PX),
      };
    }
  }

  return rects;
};

const buildDotCells = (width: number, height: number, meta: DotMeta[]): DotCell[] => {
  const innerW = Math.max(1, width - PAD_PX * 2);
  const innerH = Math.max(1, height - PAD_PX * 2);

  return meta.map((dot) => ({
    x: PAD_PX + (innerW * dot.leftPct) / 100,
    y: PAD_PX + (innerH * dot.topPct) / 100,
    accent: dot.accent,
  }));
};

const cellKind = (block: BlockCell): GlitchCellKind => {
  if (block.recalUntil > 0) return "recal";
  if (block.accent) return "accent";
  return block.state === STATE_ACTIVE ? "active" : "idle";
};

const countKinds = (blocks: BlockCell[]): Record<GlitchCellKind, number> => {
  const counts = { idle: 0, active: 0, accent: 0, recal: 0 };
  for (const block of blocks) counts[cellKind(block)] += 1;
  return counts;
};

const XRAY_FILL: Record<GlitchCellKind, string> = {
  idle: "oklch(0.79 0.16 167)",
  active: "oklch(0.79 0.16 167)",
  accent: "oklch(0.71 0.17 335)",
  recal: "oklch(0.76 0.21 178)",
};

/** Placeholder grid until the first measure; replaced, never mutated. */
const INITIAL_LAYOUT: GridLayout = { cols: 4, rows: 18, bx: PAD_PX, by: PAD_PX, bw: 10, bh: 6 };

export const GlitchSignalMap = memo(function GlitchSignalMap({
  isAnimating,
  className,
  tickMs = TICK_MS,
  updateRatio = UPDATE_RATIO,
  seed = BASE_SEED,
  xray = false,
  stepToken = 0,
  onTick,
  onHoverCell,
}: GlitchSignalMapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isAnimatingRef = useRef(isAnimating);
  const runningRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const layoutRef = useRef<GridLayout>(INITIAL_LAYOUT);

  const blocksRef = useRef<BlockCell[]>(buildBlocks(INITIAL_LAYOUT.cols * INITIAL_LAYOUT.rows));
  const rectsRef = useRef<RectCell[]>(buildRects(INITIAL_LAYOUT));
  const dotsRef = useRef<DotCell[]>([]);

  const cssWidthRef = useRef(0);
  const cssHeightRef = useRef(0);
  const dprRef = useRef(1);

  const rafRef = useRef<number | null>(null);
  const resizeRafRef = useRef<number | null>(null);

  const animStartRef = useRef(0);
  const lastFrameRef = useRef(0);
  const lastTickRef = useRef(0);
  const tickStepRef = useRef(0);

  const hoverIdxRef = useRef(-1);

  const tickMsRef = useRef(tickMs);
  const updateRatioRef = useRef(updateRatio);
  const seedRef = useRef(seed);
  const xrayRef = useRef(xray);
  const onTickRef = useRef(onTick);
  const onHoverCellRef = useRef(onHoverCell);
  const dotMetaRef = useRef<DotMeta[]>(DOT_META);
  const touchedRef = useRef<Set<number>>(new Set());

  const startLoopRef = useRef<() => void>(() => {});
  const stepOnceRef = useRef<() => void>(() => {});
  const reseedRef = useRef<() => void>(() => {});
  const reportStatsRef = useRef<() => void>(() => {});
  const stopLoopRef = useRef<() => void>(() => {});
  const drawOnceRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;

    if (!root || !canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });

    if (!ctx) return;

    const cancelMainRaf = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const cancelResizeRaf = () => {
      if (resizeRafRef.current !== null) {
        cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }
    };

    const shouldRun = () => isAnimatingRef.current && !reducedMotionRef.current;

    const computeHoverIndex = (mx: number, my: number) => {
      const { cols, rows, bx, by, bw, bh } = layoutRef.current;

      const innerX = mx - bx;
      const innerY = my - by;

      const col = Math.floor(innerX / (bw + GAP_PX));
      const row = Math.floor(innerY / (bh + GAP_PX));

      if (col < 0 || col >= cols || row < 0 || row >= rows) {
        return -1;
      }

      const localX = innerX - col * (bw + GAP_PX);
      const localY = innerY - row * (bh + GAP_PX);

      if (localX < 0 || localX > bw || localY < 0 || localY > bh) {
        return -1;
      }

      return row * cols + col;
    };

    const resizeCanvas = () => {
      const rect = root.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width <= 0 || height <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      cssWidthRef.current = width;
      cssHeightRef.current = height;
      dprRef.current = dpr;

      const pixelWidth = Math.max(1, Math.round(width * dpr));
      const pixelHeight = Math.max(1, Math.round(height * dpr));

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      const layout = computeLayout(width, height);
      layoutRef.current = layout;

      const count = layout.cols * layout.rows;

      if (blocksRef.current.length !== count) {
        blocksRef.current = buildBlocks(count, seedRef.current);
      }

      rectsRef.current = buildRects(layout);
      dotsRef.current = buildDotCells(width, height, dotMetaRef.current);

      drawOnceRef.current();
    };

    const updateBlocks = (now: number, force = false) => {
      if (!force && now - lastTickRef.current < tickMsRef.current) return;

      lastTickRef.current = now;
      tickStepRef.current += 1;

      const blocks = blocksRef.current;
      const count = blocks.length;

      const batch = Math.max(1, Math.floor(count * updateRatioRef.current));
      const step = tickStepRef.current;
      const touched = new Set<number>();

      for (let index = 0; index < batch; index += 1) {
        const blockIndex = (step * 7 + index * 19 + 5) % count;
        const block = blocks[blockIndex];

        if (!block) continue;
        touched.add(blockIndex);

        const nextSeed = lcg(block.seed);
        const shouldRecalibrate = (nextSeed & 0x7f) <= 4;
        const isActive = !shouldRecalibrate && ((nextSeed >>> 4) & 0x0f) < 5;

        block.seed = nextSeed;
        block.state = shouldRecalibrate
          ? STATE_RECALIBRATING
          : isActive
            ? STATE_ACTIVE
            : STATE_IDLE;

        block.accent = ((nextSeed >>> 8) & 0x0f) === 0;

        if (shouldRecalibrate) {
          const settleSeed = lcg(nextSeed);

          block.recalUntil = now + RECALIBRATE_DURATION_MS;
          block.settleState = ((settleSeed >>> 3) & 0x0f) < 4 ? STATE_ACTIVE : STATE_IDLE;
          block.settleSeed = settleSeed;
        } else {
          block.recalUntil = 0;
        }
      }

      touchedRef.current = touched;
      onTickRef.current?.({
        tick: step,
        rewritten: touched.size,
        cells: count,
        counts: countKinds(blocks),
      });
    };

    // The mechanism, legible: every cell at full strength in its state's colour (idle as an
    // outline), the cells this tick rewrote ringed in gold, no pulse, no jitter, no dots.
    const drawXray = (now: number) => {
      const { bw, bh } = layoutRef.current;
      const blocks = blocksRef.current;
      const rects = rectsRef.current;
      const touched = touchedRef.current;
      const hoverIdx = hoverIdxRef.current;

      for (let index = 0; index < blocks.length; index += 1) {
        const block = blocks[index];
        const rect = rects[index];
        if (!block || !rect) continue;

        if (block.recalUntil > 0 && now >= block.recalUntil) {
          block.state = block.settleState;
          block.seed = block.settleSeed;
          block.recalUntil = 0;
        }

        const kind = cellKind(block);
        ctx.globalAlpha = 1;
        if (kind === "idle") {
          ctx.globalAlpha = 0.45;
          ctx.strokeStyle = XRAY_FILL.idle;
          ctx.lineWidth = 1;
          ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, bw - 1, bh - 1);
        } else {
          ctx.fillStyle = XRAY_FILL[kind];
          ctx.fillRect(rect.x, rect.y, bw, bh);
        }

        if (touched.has(index) || index === hoverIdx) {
          ctx.globalAlpha = 1;
          ctx.strokeStyle =
            index === hoverIdx ? "oklch(0.93 0.03 80)" : "oklch(0.8858 0.182 95.69)";
          ctx.lineWidth = index === hoverIdx ? 2 : 1.5;
          ctx.strokeRect(rect.x - 1, rect.y - 1, bw + 2, bh + 2);
        }
      }

      ctx.globalAlpha = 1;
    };

    const draw = (now: number) => {
      const width = cssWidthRef.current;
      const height = cssHeightRef.current;
      const dpr = dprRef.current;

      if (width <= 0 || height <= 0) return;

      const { bw, bh } = layoutRef.current;
      const blocks = blocksRef.current;
      const rects = rectsRef.current;
      const dots = dotsRef.current;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      ctx.globalAlpha = 1;
      ctx.fillStyle = "oklch(0.105 0.022 225 / 0.96)";
      ctx.fillRect(0, 0, width, height);

      if (xrayRef.current) {
        drawXray(now);
        return;
      }

      const running = shouldRun();
      const elapsed = running ? (now - animStartRef.current) / 1000 : 0;
      const hoverIdx = hoverIdxRef.current;

      for (let index = 0; index < blocks.length; index += 1) {
        const block = blocks[index];
        const rect = rects[index];

        if (!block || !rect) continue;

        if (block.recalUntil > 0 && now >= block.recalUntil) {
          block.state = block.settleState;
          block.seed = block.settleSeed;
          block.recalUntil = 0;
        }

        const isHovered = index === hoverIdx;
        const isRecalibrating = block.recalUntil > 0;

        let alpha = 0.4;
        let ox = 0;

        if (isHovered) {
          alpha = 0.95;
          ctx.fillStyle = "oklch(0.84 0.17 128)";
        } else if (isRecalibrating) {
          const phase = (now * 0.0043 + index * 0.617) % 1;

          alpha = 0.72 + 0.2 * Math.abs(Math.sin(phase * Math.PI));
          ox = Math.sin(phase * 9.3) * 0.45;

          ctx.fillStyle = "oklch(0.76 0.21 178)";
        } else if (block.accent) {
          const pulse = running
            ? Math.sin((elapsed + block.pulseDelay) * PULSE_RADIANS_PER_SECOND - Math.PI / 2) *
                0.5 +
              0.5
            : 0.5;

          alpha = 0.48 + 0.24 * pulse;
          ctx.fillStyle = "oklch(0.71 0.17 335)";
        } else if (block.state === STATE_ACTIVE) {
          const pulse = running
            ? Math.sin((elapsed + block.pulseDelay) * PULSE_RADIANS_PER_SECOND - Math.PI / 2) *
                0.5 +
              0.5
            : 0.5;

          alpha = 0.48 + 0.2 * pulse;
          ctx.fillStyle = "oklch(0.79 0.16 167)";
        } else {
          alpha = 0.34;
          ctx.fillStyle = "oklch(0.79 0.16 167)";
        }

        ctx.globalAlpha = alpha;
        ctx.fillRect(rect.x + ox, rect.y, bw, bh);
      }

      if (hoverIdx >= 0) {
        const hoverRect = rects[hoverIdx];

        if (hoverRect) {
          ctx.globalAlpha = 0.75;
          ctx.strokeStyle = "oklch(0.8858 0.182 95.69 / 0.75)";
          ctx.lineWidth = 1;
          ctx.strokeRect(hoverRect.x - 1, hoverRect.y - 1, bw + 2, bh + 2);
        }
      }

      ctx.globalAlpha = 1;

      for (let index = 0; index < dots.length; index += 1) {
        const dot = dots[index];

        if (!dot) continue;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.35, 0, Math.PI * 2);
        ctx.globalAlpha = dot.accent ? 0.66 : 0.3;
        ctx.fillStyle = dot.accent ? "oklch(0.68 0.19 331)" : "oklch(0.47 0.09 167)";
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      rafRef.current = null;

      if (!runningRef.current) return;

      if (!shouldRun()) {
        runningRef.current = false;
        draw(now);
        return;
      }

      const shouldDrawFrame = now - lastFrameRef.current >= TARGET_FRAME_MS;

      if (shouldDrawFrame) {
        lastFrameRef.current = now;

        updateBlocks(now);
        draw(now);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (!shouldRun()) {
        runningRef.current = false;
        cancelMainRaf();
        draw(performance.now());
        return;
      }

      if (runningRef.current) return;

      runningRef.current = true;
      animStartRef.current = performance.now();
      lastFrameRef.current = 0;
      lastTickRef.current = 0;

      cancelMainRaf();
      rafRef.current = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      runningRef.current = false;
      cancelMainRaf();
      draw(performance.now());
    };

    const drawOnce = () => {
      if (runningRef.current) return;

      cancelMainRaf();
      rafRef.current = requestAnimationFrame((now) => {
        rafRef.current = null;
        draw(now);
      });
    };

    let settleTimer = 0;
    const stepOnce = () => {
      const now = performance.now();
      updateBlocks(now, true);
      lastTickRef.current = now;
      draw(now);
      // A recalibrating cell settles 120 ms later: draw it settled.
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(drawOnce, RECALIBRATE_DURATION_MS + 10);
    };

    const reseed = () => {
      blocksRef.current = buildBlocks(blocksRef.current.length, seedRef.current);
      dotMetaRef.current =
        seedRef.current === BASE_SEED ? DOT_META : buildDots(DOT_COUNT, seedRef.current);
      dotsRef.current = buildDotCells(
        cssWidthRef.current,
        cssHeightRef.current,
        dotMetaRef.current,
      );
      touchedRef.current = new Set();
      tickStepRef.current = 0;
      if (!runningRef.current) drawOnce();
    };

    const reportStats = () => {
      const blocks = blocksRef.current;
      onTickRef.current?.({
        tick: tickStepRef.current,
        rewritten: touchedRef.current.size,
        cells: blocks.length,
        counts: countKinds(blocks),
      });
    };

    startLoopRef.current = startLoop;
    stopLoopRef.current = stopLoop;
    drawOnceRef.current = drawOnce;
    stepOnceRef.current = stepOnce;
    reseedRef.current = reseed;
    reportStatsRef.current = reportStats;

    const resizeObserver = new ResizeObserver(() => {
      cancelResizeRaf();

      resizeRafRef.current = requestAnimationFrame(() => {
        resizeRafRef.current = null;
        resizeCanvas();
      });
    });

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateReducedMotion = () => {
      reducedMotionRef.current = motionQuery.matches;

      if (motionQuery.matches) {
        stopLoop();
      } else {
        startLoop();
      }
    };

    const reportHover = (index: number) => {
      const report = onHoverCellRef.current;
      if (!report) return;
      const block = blocksRef.current[index];
      if (index < 0 || !block) {
        report(null);
        return;
      }
      const { cols } = layoutRef.current;
      report({
        index,
        row: Math.floor(index / cols),
        col: index % cols,
        seed: block.seed,
        kind: cellKind(block),
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = event.clientX - rect.left;
      const my = event.clientY - rect.top;
      const hoverIndex = computeHoverIndex(mx, my);

      if (hoverIndex === hoverIdxRef.current) return;

      hoverIdxRef.current = hoverIndex;
      reportHover(hoverIndex);

      if (!runningRef.current) {
        drawOnce();
      }
    };

    const handleMouseLeave = () => {
      if (hoverIdxRef.current === -1) return;

      hoverIdxRef.current = -1;
      reportHover(-1);

      if (!runningRef.current) {
        drawOnce();
      }
    };

    resizeCanvas();

    resizeObserver.observe(root);

    motionQuery.addEventListener("change", updateReducedMotion);
    canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave);

    updateReducedMotion();

    return () => {
      startLoopRef.current = () => {};
      stopLoopRef.current = () => {};
      drawOnceRef.current = () => {};

      runningRef.current = false;

      resizeObserver.disconnect();
      motionQuery.removeEventListener("change", updateReducedMotion);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);

      cancelMainRaf();
      cancelResizeRaf();
      window.clearTimeout(settleTimer);
    };
  }, []);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
    if (!isAnimating) return;
    startLoopRef.current();
    return () => {
      stopLoopRef.current();
    };
  }, [isAnimating]);

  // Tuning props are read by the loop through refs: no restart when they change.
  useEffect(() => {
    tickMsRef.current = tickMs;
    updateRatioRef.current = updateRatio;
    onTickRef.current = onTick;
    onHoverCellRef.current = onHoverCell;
  });

  useEffect(() => {
    if (seedRef.current === seed) return;
    seedRef.current = seed;
    reseedRef.current();
  }, [seed]);

  useEffect(() => {
    xrayRef.current = xray;
    if (!runningRef.current) drawOnceRef.current();
    // An xray readout opening mid-run gets the grid as it is, not after the next tick.
    if (xray) reportStatsRef.current();
  }, [xray]);

  useEffect(() => {
    if (stepToken === 0 || runningRef.current) return;
    stepOnceRef.current();
  }, [stepToken]);

  const rootClassName = className ? `${styles.rootStyles} ${className}` : styles.rootStyles;

  return (
    <div ref={rootRef} className={rootClassName} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvasStyles} />
      <div className={styles.textureStyles} />
    </div>
  );
});
