import { assignInlineVars } from "@vanilla-extract/dynamic";
import clsx from "clsx";
import { useState } from "react";
import type { RendererType } from "@/components/misc/canvas-renderer/canvas-renderer.types";
import { MeshBackgroundCanvas } from "@/components/misc/mesh-background/mesh-background-canvas.component";
import { SHADER_CONFIG } from "@/components/misc/shaders/mesh-background/mesh-background.shader";
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
import {
  LabsReadout,
  ReadoutFigure,
  ReadoutLine,
  ReadoutRow,
  ReadoutRows,
} from "../../components/labs-readout/labs-readout.component";
import * as styles from "./mesh-background.demo.css";

const STATES = ["paused", "running"] as const;
type PlayState = (typeof STATES)[number];

const DEFAULT_QUALITY = SHADER_CONFIG.defaultQuality;

const rgb = ([r, g, b]: readonly [number, number, number]) =>
  `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`;

// `blobFast` reaches zero where |d|² · softness · 0.12 = 1, and half strength (x² = ½) at
// 1 − 1/√2 of that: both radii in uv, per axis.
const BLOBS = (["blob1", "blob2", "blob3"] as const).map((name) => {
  const blob = SHADER_CONFIG[name];
  const edge = 1 / Math.sqrt(0.12 * blob.softness);
  const half = Math.sqrt((1 - Math.SQRT1_2) / (0.12 * blob.softness));
  return {
    name,
    color: rgb(blob.color),
    // uv has y up; the overlay's y runs down.
    cx: blob.centerX,
    cy: 1 - blob.centerY,
    edge: { rx: blob.scaleX * edge, ry: blob.scaleY * edge },
    half: { rx: blob.scaleX * half, ry: blob.scaleY * half },
    move: { rx: blob.moveX, ry: blob.moveY },
    blob,
  };
});

/** The blobs' reach and half strength, their drift, the vignette's two rings. */
function MeshOverlay() {
  return (
    <>
      <svg
        className={styles.overlay}
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {[SHADER_CONFIG.vignetteStart, SHADER_CONFIG.vignetteEnd].map((radius) => (
          <ellipse
            key={radius}
            className={styles.vignetteRing}
            cx={0.5}
            cy={0.5}
            rx={radius}
            ry={radius}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {BLOBS.map((blob) => (
          <g key={blob.name} style={assignInlineVars({ [styles.blobColor]: blob.color })}>
            <ellipse
              className={styles.blobEdge}
              cx={blob.cx}
              cy={blob.cy}
              rx={blob.edge.rx}
              ry={blob.edge.ry}
              vectorEffect="non-scaling-stroke"
            />
            <ellipse
              className={styles.blobHalf}
              cx={blob.cx}
              cy={blob.cy}
              rx={blob.half.rx}
              ry={blob.half.ry}
              vectorEffect="non-scaling-stroke"
            />
            <ellipse
              className={styles.blobOrbit}
              cx={blob.cx}
              cy={blob.cy}
              rx={blob.move.rx}
              ry={blob.move.ry}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </svg>
      {BLOBS.map((blob) => (
        <span
          key={blob.name}
          className={clsx(styles.label, styles.labelAt)}
          style={assignInlineVars({
            [styles.blobColor]: blob.color,
            [styles.labelX]: `${blob.cx * 100}%`,
            [styles.labelY]: `${blob.cy * 100}%`,
          })}
          aria-hidden="true"
        >
          {blob.name}
        </span>
      ))}
    </>
  );
}

function XrayReadout({ renderer, quality }: { renderer: RendererType; quality: number }) {
  return (
    <LabsReadout title="one fragment shader">
      <ReadoutFigure>{renderer === "pending" ? "…" : renderer}</ReadoutFigure>
      <ReadoutLine>
        {renderer === "webgpu"
          ? "WGSL, from the same config as the GLSL fallback"
          : renderer === "webgl"
            ? "GLSL: WebGPU missing or slower than 250 ms to start"
            : renderer === "svg"
              ? "no GPU: the host's CSS fallback shows"
              : "starting"}
      </ReadoutLine>
      <ReadoutLine code>x = max(0, 1 − |(uv − c) / scale|² · softness · 0.12) → x²</ReadoutLine>
      <ReadoutRows>
        {BLOBS.map(({ name, blob }) => (
          <ReadoutRow
            key={name}
            label={name}
            value={`× ${blob.intensity}`}
            rule={`c (${blob.centerX}, ${blob.centerY}) ± ${blob.moveX} · scale ${blob.scaleX} × ${blob.scaleY} · soft ${blob.softness}`}
            swatchClassName={styles.blobSwatches[name]}
          />
        ))}
      </ReadoutRows>
      <ReadoutLine>
        vignette {SHADER_CONFIG.vignetteStart} → {SHADER_CONFIG.vignetteEnd} · grain reseeded 18×/s
        · quality {quality.toFixed(2)}
      </ReadoutLine>
    </LabsReadout>
  );
}

export function MeshBackgroundDemo() {
  const xray = useLabsXray();
  const [quality, setQuality] = useState<number>(DEFAULT_QUALITY);
  const [state, setState] = useState<PlayState>("running");
  const [renderer, setRenderer] = useState<RendererType>("pending");

  const reset = () => {
    setQuality(DEFAULT_QUALITY);
    setState("running");
  };

  return (
    <LabsDemoLayout
      mounted={`<MeshBackgroundCanvas quality={${quality.toFixed(2)}} animate={${state === "running"}} /> · ${renderer}`}
      stage={
        <div className={styles.stage}>
          <div className={styles.stageInner}>
            <div className={styles.meshBox}>
              <MeshBackgroundCanvas
                quality={quality}
                animate={state === "running"}
                onRendererReady={setRenderer}
              />
              {xray && <MeshOverlay />}
            </div>
          </div>
          {xray && <XrayReadout renderer={renderer} quality={quality} />}
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="Animation">
            <ButtonGroupControl
              options={STATES}
              value={state}
              onChange={setState}
              formatOption={(option) => option[0].toUpperCase() + option.slice(1)}
            />
          </ControlGroup>

          <ControlGroup title="Film grain">
            <SliderControl
              label="Quality"
              value={quality}
              min={0}
              max={1}
              step={0.05}
              onChange={setQuality}
              format={(value) => value.toFixed(2)}
            />
          </ControlGroup>

          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
