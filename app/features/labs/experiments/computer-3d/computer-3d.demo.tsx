import { assignInlineVars } from "@vanilla-extract/dynamic";
import { useState, type ReactNode } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-aria-components";
import {
  COMPUTER_EXPLODE_PX,
  Computer,
  type ComputerFaceId,
  type ComputerFrame,
} from "@/components/misc/computer/computer.component";
import {
  computerFaceTransforms,
  computerFrameTransforms,
  type ComputerFace,
} from "@/components/misc/computer/computer.css";
import { CyberneticGlyphGrid } from "@/components/misc/cybernetic-glyph-grid/cybernetic-glyph-grid.component";
import { FakeConsole } from "@/components/misc/fake-console/fake-console.component";
import { GlitchSignalMap } from "@/components/misc/glitch-signal-map/glitch-signal-map.component";
import { SystemMetricsPanel } from "@/components/misc/system-metrics-panel/system-metrics-panel.component";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import {
  LabsDemoLayout,
  useLabsXray,
} from "../../components/labs-experiment-frame/labs-experiment-frame.component";
import {
  ButtonGroupControl,
  ControlGroup,
  ControlPanel,
  ResetButton,
  SliderControl,
} from "../../components/labs-control/labs-control.component";
import * as styles from "./computer-3d.demo.css";

// The home hero's resting pose (its 3deg tilt vars × 1.8), so the Lab opens on
// the laptop as the homepage draws it.
const DEFAULT_ROTATE = { x: -5.4, y: 5.4, z: 0 };
const DEFAULT_SCALE = 1;
const DEFAULT_EXPLODE = 60;
const DEFAULT_FACE = { frame: "lid", face: "back" } as const;

const STATES = ["paused", "running"] as const;
type PlayState = (typeof STATES)[number];

// The home's four zones, each its own Lab.
const ZONES: { label: string; render: (isAnimating: boolean) => ReactNode }[] = [
  { label: "Fake Console", render: (on) => <FakeConsole isAnimating={on} /> },
  { label: "Signal Map", render: (on) => <GlitchSignalMap isAnimating={on} /> },
  { label: "Glyph Grid", render: (on) => <CyberneticGlyphGrid isAnimating={on} /> },
  { label: "Metrics", render: (on) => <SystemMetricsPanel isAnimating={on} /> },
];

const FRAMES: ComputerFrame[] = ["lid", "chassis"];
const FACES = Object.keys(computerFaceTransforms) as ComputerFace[];

interface LitFace {
  frame: ComputerFrame;
  face: ComputerFace;
}

const faceId = ({ frame, face }: LitFace): ComputerFaceId => `${frame}-${face}`;
const FACE_IDS = FRAMES.flatMap((frame) => FACES.map((face) => ({ frame, face })));

// What each face is, read off computer.css.ts and computer.component.tsx.
const FACE_NOTES: Record<ComputerFace, Record<ComputerFrame, string>> = {
  front: {
    lid: "The screen's face: the only one left in the accessibility tree, it hosts the four zones.",
    chassis: "The deck: keyboard and trackpad, sized in cqi on this face's width.",
  },
  back: {
    lid: "The lid's shell: one full face, 10 px behind the screen.",
    chassis: "The underside: one full face, 10 px below the deck.",
  },
  bottom: {
    lid: "A 10 px strip turned 90° on X, dropped to the lower edge.",
    chassis: "A 10 px strip turned 90° on X, at the deck's far edge.",
  },
  top: {
    lid: "A 10 px strip turned 90° on X, lifted to the upper edge.",
    chassis: "A 10 px strip turned 90° on X, at the deck's near edge.",
  },
  left: {
    lid: "A 10 px strip turned 90° on Y, set on the right-hand edge.",
    chassis: "A 10 px strip turned 90° on Y, set on the right-hand edge.",
  },
  right: {
    lid: "A 10 px strip turned 90° on Y, set on the left-hand edge.",
    chassis: "A 10 px strip turned 90° on Y, set on the left-hand edge.",
  },
};

interface ComputerXrayProps {
  lit: LitFace;
  onLit: (face: LitFace) => void;
  explode: number;
}

/** Both frames and their six faces; the picked face lights up on the laptop. */
function ComputerXray({ lit, onLit, explode }: ComputerXrayProps) {
  const { frame: litFrame, face: litFace } = lit;
  const transform = computerFaceTransforms[litFace];
  const travel = Math.round((explode / 100) * COMPUTER_EXPLODE_PX);

  return (
    <div className={styles.xray}>
      <p className={styles.kicker}>
        _xray / 2 frames · 12 faces
        <span className={styles.kickerLine}>10 px deep · each face {travel} px out</span>
      </p>
      {FRAMES.map((frame) => (
        <div key={frame} className={styles.frameBlock}>
          <p className={styles.frameName}>{frame}</p>
          <code className={styles.frameTransform}>{computerFrameTransforms[frame]}</code>
          <ToggleButtonGroup
            aria-label={`${frame} faces`}
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={litFrame === frame ? [faceId(lit)] : []}
            onSelectionChange={(keys) => {
              const picked = FACE_IDS.find((entry) => keys.has(faceId(entry)));
              if (picked) onLit(picked);
            }}
            className={styles.faces}
          >
            {FACES.map((face) => (
              <ToggleButton key={face} id={`${frame}-${face}`} className={styles.faceButton}>
                {face}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
      ))}
      <div className={styles.card} aria-live="polite">
        <p className={styles.cardTitle}>
          {litFrame} · {litFace}
        </p>
        <code className={styles.cardCode}>
          {transform === "none" ? "no transform (z = 0)" : transform}
        </code>
        <p className={styles.cardNote}>{FACE_NOTES[litFace][litFrame]}</p>
      </div>
    </div>
  );
}

export function Computer3dDemo() {
  const xray = useLabsXray();
  const [rotate, setRotate] = useState(DEFAULT_ROTATE);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [state, setState] = useState<PlayState>("running");
  const [explode, setExplode] = useState(DEFAULT_EXPLODE);
  const [lit, setLit] = useState<LitFace>(DEFAULT_FACE);
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    rootMargin: "100px",
  });

  const animating = state === "running" && isIntersecting;

  const reset = () => {
    setRotate(DEFAULT_ROTATE);
    setScale(DEFAULT_SCALE);
    setState("running");
    setExplode(DEFAULT_EXPLODE);
    setLit(DEFAULT_FACE);
  };

  return (
    <LabsDemoLayout
      mounted={`<Computer${xray ? ` xray explode={${(explode / 100).toFixed(2)}}` : ""}> + 4 zones · rotate(${rotate.x}°, ${rotate.y}°, ${rotate.z}°) · scale ${scale.toFixed(2)}`}
      stage={
        <div className={styles.stage}>
          <div
            ref={ref}
            className={styles.stageInner}
            style={assignInlineVars({
              [styles.stageScale]: String(scale),
              [styles.stageRotateX]: `${rotate.x}deg`,
              [styles.stageRotateY]: `${rotate.y}deg`,
              [styles.stageRotateZ]: `${rotate.z}deg`,
            })}
          >
            <div className={styles.wrapper3d}>
              <Computer xray={xray} explode={explode / 100} litFace={faceId(lit)}>
                <div className={styles.screenGrid}>
                  {ZONES.map(({ label, render }, index) => (
                    <div key={label} className={styles.zone} data-zone={index + 1}>
                      {xray && (
                        <span className={styles.zoneLabel} aria-hidden="true">
                          Z{index + 1} · {label}
                        </span>
                      )}
                      {render(animating)}
                    </div>
                  ))}
                </div>
              </Computer>
            </div>
          </div>
          {xray && <ComputerXray lit={lit} onLit={setLit} explode={explode} />}
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="Rotation">
            <SliderControl
              label="X"
              value={rotate.x}
              min={-180}
              max={180}
              step={0.1}
              onChange={(value) => setRotate((prev) => ({ ...prev, x: value }))}
              format={(value) => `${value}°`}
            />
            <SliderControl
              label="Y"
              value={rotate.y}
              min={-180}
              max={180}
              step={0.1}
              onChange={(value) => setRotate((prev) => ({ ...prev, y: value }))}
              format={(value) => `${value}°`}
            />
            <SliderControl
              label="Z"
              value={rotate.z}
              min={-180}
              max={180}
              step={0.1}
              onChange={(value) => setRotate((prev) => ({ ...prev, z: value }))}
              format={(value) => `${value}°`}
            />
          </ControlGroup>

          <ControlGroup title="Scale">
            <SliderControl
              label="Zoom"
              value={scale}
              min={0.1}
              max={3}
              step={0.1}
              onChange={setScale}
              format={(value) => `${value.toFixed(2)}x`}
            />
          </ControlGroup>

          <ControlGroup title="Screen">
            <ButtonGroupControl
              options={STATES}
              value={state}
              onChange={setState}
              formatOption={(option) => option[0].toUpperCase() + option.slice(1)}
            />
          </ControlGroup>

          {xray && (
            <ControlGroup title="Xray">
              <SliderControl
                label="Explode"
                value={explode}
                min={0}
                max={100}
                onChange={setExplode}
                format={(value) => `${value} %`}
              />
            </ControlGroup>
          )}

          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
