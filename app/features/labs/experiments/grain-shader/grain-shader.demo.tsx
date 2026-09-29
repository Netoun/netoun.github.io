import { assignInlineVars } from "@vanilla-extract/dynamic";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { GrainCanvas } from "@/components/misc/grain-canvas/grain-canvas.component";
import { GRAIN_CONFIG, GRAIN_TILE, grainCell } from "@/components/misc/shaders/grain/grain.shader";
import {
  LabsDemoLayout,
  useLabsXray,
} from "../../components/labs-experiment-frame/labs-experiment-frame.component";
import {
  ControlGroup,
  ControlPanel,
  ResetButton,
  SliderControl,
} from "../../components/labs-control/labs-control.component";
import {
  LabsReadout,
  ReadoutFigure,
  ReadoutLine,
} from "../../components/labs-readout/labs-readout.component";
import * as styles from "./grain-shader.demo.css";

const BAKED = {
  strength: GRAIN_CONFIG.filmGrainStrength,
  gamma: GRAIN_CONFIG.filmGrainGamma,
  steps: GRAIN_TILE.alphaSteps,
};

interface GrainParams {
  strength: number;
  gamma: number;
  steps: number;
}

/** How one 128 × 128 tile's cells fall into the weight levels, darken on the left. */
function useHistogram({ gamma, steps }: GrainParams) {
  return useMemo(() => {
    const levels = new Map<number, { darken: number; lighten: number }>();
    const size = GRAIN_TILE.size;
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const { lighten, weight } = grainCell(x, y, { gamma, steps });
        const level = steps > 0 ? weight : Math.round(weight * 10) / 10;
        const counts = levels.get(level) ?? { darken: 0, lighten: 0 };
        counts[lighten ? "lighten" : "darken"] += 1;
        levels.set(level, counts);
      }
    }
    const total = size * size;
    return [...levels.entries()]
      .toSorted(([a], [b]) => b - a)
      .map(([level, { darken, lighten }]) => ({ level, darken, lighten, total }));
  }, [gamma, steps]);
}

function XrayReadout(params: GrainParams) {
  const rows = useHistogram(params);
  const peak = Math.max(...rows.map((row) => Math.max(row.darken, row.lighten)));
  const zero = rows.find((row) => row.level === 0);
  const silent = zero ? ((zero.darken + zero.lighten) / zero.total) * 100 : 0;

  return (
    <LabsReadout title="film grain">
      <ReadoutFigure>{Math.round(silent)} % silent</ReadoutFigure>
      <ReadoutLine>
        of one tile's {GRAIN_TILE.size}×{GRAIN_TILE.size} cells, drawn at alpha 0
      </ReadoutLine>
      <ReadoutLine code>
        n = hash12(x, y) − 0.5 · α = round(|2n|^{params.gamma.toFixed(1)} × {params.steps || "∞"}) /{" "}
        {params.steps || "∞"} × {params.strength.toFixed(3)}
      </ReadoutLine>
      <table className={styles.histogram}>
        <thead>
          <tr>
            <th scope="col">Weight</th>
            <th scope="col">Darken</th>
            <th scope="col">Lighten</th>
            <th scope="col">Cells</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.level}>
              <th scope="row">{row.level.toFixed(2)}</th>
              <td>
                <span
                  className={clsx(styles.bar, styles.barFill)}
                  data-side="darken"
                  style={assignInlineVars({ [styles.share]: `${(row.darken / peak) * 100}%` })}
                />
                <span className={styles.srOnly}>{row.darken}</span>
              </td>
              <td>
                <span
                  className={clsx(styles.bar, styles.barFill)}
                  data-side="lighten"
                  style={assignInlineVars({ [styles.share]: `${(row.lighten / peak) * 100}%` })}
                />
                <span className={styles.srOnly}>{row.lighten}</span>
              </td>
              <td>{row.darken + row.lighten}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </LabsReadout>
  );
}

export function GrainShaderDemo() {
  const xray = useLabsXray();
  const [strength, setStrength] = useState<number>(BAKED.strength);
  const [gamma, setGamma] = useState<number>(BAKED.gamma);
  const [steps, setSteps] = useState<number>(BAKED.steps);
  const [zoom, setZoom] = useState(1);

  const differs = strength !== BAKED.strength || gamma !== BAKED.gamma || steps !== BAKED.steps;
  const tile = `${GRAIN_TILE.size * zoom}px`;

  const reset = () => {
    setStrength(BAKED.strength);
    setGamma(BAKED.gamma);
    setSteps(BAKED.steps);
    setZoom(1);
  };

  return (
    <LabsDemoLayout
      mounted={`<GrainCanvas strength={${strength}} gamma={${gamma}} steps={${steps}}${xray ? " xray" : ""} /> beside grain-tile.webp · loupe ${zoom}×`}
      stage={
        <div className={styles.stage}>
          <div
            className={styles.panes}
            style={assignInlineVars({ [styles.zoom]: String(zoom), [styles.tileSize]: tile })}
          >
            <figure className={styles.pane}>
              <div className={styles.paper}>
                <div className={styles.magnify}>
                  <GrainCanvas strength={strength} gamma={gamma} steps={steps} xray={xray} />
                </div>
                {xray && <span className={styles.seams} aria-hidden="true" />}
              </div>
              <figcaption className={styles.caption}>
                <span className={styles.captionName}>Live · WebGL</span>
                {differs && <span className={styles.differs}>≠ baked</span>}
              </figcaption>
            </figure>
            <figure className={styles.pane}>
              <div className={styles.paper}>
                <div className={clsx(styles.magnify, styles.baked)} />
              </div>
              <figcaption className={styles.caption}>
                <span className={styles.captionName}>Baked · grain-tile.webp</span>
                <span>
                  {BAKED.strength} · γ {BAKED.gamma} · {BAKED.steps} steps
                </span>
              </figcaption>
            </figure>
          </div>
          {xray && <XrayReadout strength={strength} gamma={gamma} steps={steps} />}
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="Grain">
            <SliderControl
              label="Strength"
              value={strength}
              min={0}
              max={0.3}
              step={0.005}
              onChange={setStrength}
              format={(value) => value.toFixed(3)}
            />
            <SliderControl
              label="Gamma"
              value={gamma}
              min={0.5}
              max={3}
              step={0.1}
              onChange={setGamma}
              format={(value) => value.toFixed(1)}
            />
            <SliderControl
              label="Steps"
              value={steps}
              min={0}
              max={10}
              onChange={setSteps}
              format={(value) => (value === 0 ? "off" : String(value))}
            />
          </ControlGroup>
          <ControlGroup title="Loupe">
            <SliderControl
              label="Zoom"
              value={zoom}
              min={1}
              max={16}
              onChange={setZoom}
              format={(value) => `${value}×`}
            />
          </ControlGroup>
          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
