import { useState } from "react";
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
import { AsciiRaymarcher, type AsciiPalette, type AsciiProbe } from "./ascii-raymarcher.component";
import { RAMPS, type AsciiRamp, type AsciiShape } from "./ascii-raymarcher-scene";
import * as styles from "./ascii-raymarcher.demo.css";

const STATES = ["paused", "running"] as const;
const SHAPES = ["box", "torus"] as const satisfies readonly AsciiShape[];
const RAMP_NAMES = ["classic", "netoun"] as const satisfies readonly AsciiRamp[];
const PALETTES = ["phosphor", "ink"] as const satisfies readonly AsciiPalette[];
const DEFAULTS = { cellPx: 14, light: 35 };
const capitalize = (value: string) => value[0].toUpperCase() + value.slice(1);

interface LookupProps {
  ramp: AsciiRamp;
  counts: number[] | null;
  probe: AsciiProbe | null;
}

/** The ramp as a lookup table: each bucket's threshold, glyph and live count. */
function Lookup({ ramp, counts, probe }: LookupProps) {
  const buckets = RAMPS[ramp];
  const most = Math.max(1, ...(counts ?? [1]));
  const probed = probe && probe.bucket >= 0 ? probe : null;
  return (
    <div className={styles.lookup}>
      <p className={styles.lookupTitle}>_xray / luminance → bucket → glyph</p>
      <ol className={styles.buckets}>
        {buckets.map((bucket, index) => (
          <li
            key={bucket.from}
            className={styles.bucket}
            data-probed={probed?.bucket === index || undefined}
          >
            <span className={styles.bar} aria-hidden="true">
              <span
                className={styles.barFill}
                data-level={Math.round(((counts?.[index] ?? 0) / most) * 10)}
              />
            </span>
            <span className={styles.glyph} data-word={bucket.glyph.length > 1 || undefined}>
              {bucket.glyph === " " ? "sp" : bucket.glyph}
            </span>
            <span className={styles.bucketIndex}>{index}</span>
            <span className={styles.threshold}>≥ {bucket.from.toFixed(2)}</span>
            <span className={styles.count}>{counts?.[index] ?? "—"}</span>
          </li>
        ))}
      </ol>
      <p className={styles.probe}>
        {probed
          ? `cell ${probed.col},${probed.row} · L ${probed.luminance.toFixed(3)} → bucket ${probed.bucket} → ${buckets[probed.bucket].glyph === " " ? "space" : buckets[probed.bucket].glyph}`
          : probe
            ? `cell ${probe.col},${probe.row} · the ray misses: space`
            : "Point the screen to follow one ray"}
      </p>
    </div>
  );
}

export function AsciiRaymarcherDemo() {
  const xray = useLabsXray();
  const [state, setState] = useState<(typeof STATES)[number]>("running");
  const [shape, setShape] = useState<AsciiShape>("box");
  const [ramp, setRamp] = useState<AsciiRamp>("classic");
  const [palette, setPalette] = useState<AsciiPalette>("phosphor");
  const [cellPx, setCellPx] = useState(DEFAULTS.cellPx);
  const [light, setLight] = useState(DEFAULTS.light);
  const [counts, setCounts] = useState<number[] | null>(null);
  const [probe, setProbe] = useState<AsciiProbe | null>(null);

  const reset = () => {
    setState("running");
    setShape("box");
    setRamp("classic");
    setPalette("phosphor");
    setCellPx(DEFAULTS.cellPx);
    setLight(DEFAULTS.light);
  };

  return (
    <LabsDemoLayout
      mounted={`<AsciiRaymarcher shape="${shape}" ramp="${ramp}" cellPx={${cellPx}} light={${light}} palette="${palette}" />`}
      stage={
        <div className={styles.stage}>
          <AsciiRaymarcher
            shape={shape}
            ramp={ramp}
            cellPx={cellPx}
            light={light}
            palette={palette}
            playing={state === "running"}
            xray={xray}
            onCounts={xray ? setCounts : undefined}
            onProbe={xray ? setProbe : undefined}
          />
          {xray && <Lookup ramp={ramp} counts={counts} probe={probe} />}
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="Animation">
            <ButtonGroupControl
              options={STATES}
              value={state}
              onChange={setState}
              formatOption={capitalize}
            />
          </ControlGroup>
          <ControlGroup title="Scene">
            <ButtonGroupControl
              options={SHAPES}
              value={shape}
              onChange={setShape}
              formatOption={capitalize}
            />
            <SliderControl
              label="Light"
              value={light}
              min={0}
              max={355}
              step={5}
              onChange={setLight}
              format={(value) => `${value}°`}
            />
          </ControlGroup>
          <ControlGroup title="Print">
            <ButtonGroupControl
              options={RAMP_NAMES}
              value={ramp}
              onChange={setRamp}
              formatOption={capitalize}
            />
            <SliderControl
              label="Cell"
              value={cellPx}
              min={10}
              max={18}
              onChange={setCellPx}
              format={(value) => `${value} px`}
            />
            <ButtonGroupControl
              options={PALETTES}
              value={palette}
              onChange={setPalette}
              formatOption={capitalize}
            />
          </ControlGroup>
          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
