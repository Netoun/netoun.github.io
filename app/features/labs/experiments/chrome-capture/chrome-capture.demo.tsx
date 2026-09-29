import { assignInlineVars } from "@vanilla-extract/dynamic";
import { useRef, useState } from "react";
import { ChromeCapture } from "@/components/misc/chrome-capture/chrome-capture.component";
import { chromeLayerGap } from "@/components/misc/chrome-capture/chrome-capture.css";
import { projects } from "@/features/projects/data/projects-data";
import { useChromeReflection } from "@/hooks/use-chrome-reflection.hook";
import { chromeReflection } from "@/hooks/use-chrome-reflection.css";
import {
  LabsDemoLayout,
  useLabsXray,
} from "../../components/labs-experiment-frame/labs-experiment-frame.component";
import {
  ButtonGroupControl,
  ControlButton,
  ControlGroup,
  ControlPanel,
  ControlReadout,
  ResetButton,
  SliderControl,
} from "../../components/labs-control/labs-control.component";
import * as styles from "./chrome-capture.demo.css";

const LIGHTS = ["pointer", "manual"] as const;
type Light = (typeof LIGHTS)[number];
const SIZES = ["md", "sm"] as const;
type Size = (typeof SIZES)[number];

// The rest angle the CSS falls back to (`0.35` for the bezel, the glint centred).
const DEFAULT_LIGHT = { x: 35, y: 50 };
const DEFAULT_GAP = 60;
const GAP_PX = 72;

interface ChromeXrayProps {
  x: number;
  y: number;
  light: Light;
}

/** The four layers, top down, and what each one reads from the two light vars. */
function ChromeXray({ x, y, light }: ChromeXrayProps) {
  const angle = Math.round((x / 100) * 360);
  const rows = [
    {
      name: "glint",
      code: `linear-gradient(115deg…) · 260 % · at ${x} % ${y} % · mix-blend-mode: screen`,
    },
    { name: "glass", code: "top sheen 16 % white → 0 · inset 0 1px 3px black 45 %" },
    { name: "screen", code: "the capture · 16:10 · object-fit: cover" },
    { name: "bezel", code: `conic-gradient(from ${angle}deg) · 9 silver stops · 5 px` },
  ];
  return (
    <div className={styles.xray}>
      <p className={styles.kicker}>_xray / 4 layers · 2 vars</p>
      <ol className={styles.layers}>
        {rows.map((row, index) => (
          <li key={row.name} className={styles.layer}>
            <span className={styles.layerDepth}>{3 - index}</span>
            <span className={styles.layerName}>{row.name}</span>
            <code className={styles.layerCode}>{row.code}</code>
          </li>
        ))}
      </ol>
      <p className={styles.note}>
        {light === "pointer"
          ? "Pointer light: the values above are the manual rest; move over the capture to take over."
          : `x = ${(x / 100).toFixed(2)} · y = ${(y / 100).toFixed(2)}, written as chromeReflection.x / .y`}
      </p>
    </div>
  );
}

export function ChromeCaptureDemo() {
  const xray = useLabsXray();
  const lightRef = useRef<HTMLDivElement>(null);
  const [light, setLight] = useState<Light>("pointer");
  const [point, setPoint] = useState(DEFAULT_LIGHT);
  const [size, setSize] = useState<Size>("md");
  const [gap, setGap] = useState(DEFAULT_GAP);
  const [captureIndex, setCaptureIndex] = useState(0);
  const [sweeps, setSweeps] = useState(0);

  // The site's own hook, on the surface around the capture (the monitor puts it on its window).
  useChromeReflection(lightRef, light === "pointer");

  const project = projects[captureIndex];
  const manual = light === "manual";

  const reset = () => {
    setLight("pointer");
    setPoint(DEFAULT_LIGHT);
    setSize("md");
    setGap(DEFAULT_GAP);
    setCaptureIndex(0);
  };

  return (
    <LabsDemoLayout
      mounted={`<ChromeCapture src="${project.image}" size="${size}" sweep${xray ? " xray" : ""} /> · useChromeReflection(${manual ? "off" : "on"})`}
      stage={
        <div className={styles.stage}>
          <div
            ref={lightRef}
            className={styles.light}
            // Manual light: the demo writes the vars the hook would.
            style={
              manual || xray
                ? assignInlineVars({
                    ...(manual && {
                      [chromeReflection.x]: String(point.x / 100),
                      [chromeReflection.y]: String(point.y / 100),
                    }),
                    ...(xray && { [chromeLayerGap]: `${(gap / 100) * GAP_PX}px` }),
                  })
                : undefined
            }
          >
            {/* Holds the glint on under the manual light (the hook owns the attribute above). */}
            <div className={styles.holder} data-chrome={manual ? "on" : undefined}>
              <ChromeCapture
                // A new capture, or Sweep again: remounted, it plays its one glint.
                key={`${project.slug}-${sweeps}`}
                src={project.image}
                size={size}
                sweep
                xray={xray}
                className={styles.capture}
              />
            </div>
          </div>
          {xray && <ChromeXray x={point.x} y={point.y} light={light} />}
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="Capture">
            <div className={styles.captureRow}>
              <ControlReadout>{project.title}</ControlReadout>
              <ControlButton
                onPress={() => setCaptureIndex((index) => (index + 1) % projects.length)}
              >
                Next
              </ControlButton>
            </div>
            <ButtonGroupControl
              options={SIZES}
              value={size}
              onChange={setSize}
              formatOption={(option) => option.toUpperCase()}
            />
            <ControlButton onPress={() => setSweeps((count) => count + 1)}>
              Sweep again
            </ControlButton>
          </ControlGroup>
          <ControlGroup title="Light">
            <ButtonGroupControl
              options={LIGHTS}
              value={light}
              onChange={setLight}
              formatOption={(option) => option[0].toUpperCase() + option.slice(1)}
            />
            {manual && (
              <>
                <SliderControl
                  label="X"
                  value={point.x}
                  min={0}
                  max={100}
                  onChange={(x) => setPoint((prev) => ({ ...prev, x }))}
                  format={(value) => (value / 100).toFixed(2)}
                />
                <SliderControl
                  label="Y"
                  value={point.y}
                  min={0}
                  max={100}
                  onChange={(y) => setPoint((prev) => ({ ...prev, y }))}
                  format={(value) => (value / 100).toFixed(2)}
                />
              </>
            )}
          </ControlGroup>
          {xray && (
            <ControlGroup title="Xray">
              <SliderControl
                label="Layers"
                value={gap}
                min={0}
                max={100}
                onChange={setGap}
                format={(value) => `${Math.round((value / 100) * GAP_PX)} px`}
              />
            </ControlGroup>
          )}
          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
