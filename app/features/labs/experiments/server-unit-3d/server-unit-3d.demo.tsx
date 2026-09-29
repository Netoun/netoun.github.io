import { assignInlineVars } from "@vanilla-extract/dynamic";
import { Fragment, useState } from "react";
import {
  RACK_UNITS,
  ServerUnitRack,
  generateStatusLeds,
  serverUnitCode,
} from "@/components/misc/server-unit/server-unit.component";
import { serverLedTiming } from "@/components/misc/server-unit/server-unit.css";
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
import * as styles from "./server-unit-3d.demo.css";

type ServerUnitSize = "xs" | "sm" | "md" | "lg";

const SIZE_OPTIONS: readonly ServerUnitSize[] = ["xs", "sm", "md", "lg"];
const DEFAULT_ROTATE = { x: 4, y: -24, z: 0 };
const DEFAULT_SEED = 42;
const DEFAULT_PULL = 60;

const { periodS, spreadS, offsetS } = serverLedTiming;

/** Every status LED of the rack: its phase from the seed, and the breath it gives. */
function ServerRackXray({ seed }: { seed: number }) {
  return (
    <div className={styles.xray}>
      <p className={styles.kicker}>_xray / 3 units · 12 status leds</p>
      <p className={styles.formula}>
        phase = fract(sin(s·127.1 + 311.7)·43758.5453)
        <br />
        breath = {periodS} s + phase·{spreadS} s, from −phase·{offsetS} s
      </p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">LED</th>
            <th scope="col">s</th>
            <th scope="col">Phase</th>
            <th scope="col">Breath</th>
          </tr>
        </thead>
        <tbody>
          {RACK_UNITS.map(({ variant, seedOffset }) => {
            const unitSeed = seed + seedOffset;
            return (
              <Fragment key={variant}>
                <tr className={styles.unitRow}>
                  <th scope="rowgroup" colSpan={4}>
                    {serverUnitCode(variant, unitSeed)} · seed {seed} + {seedOffset}
                  </th>
                </tr>
                {generateStatusLeds(unitSeed).map((led) => (
                  <tr key={led.label}>
                    <th scope="row">
                      <span className={styles.led} data-status={led.label} aria-hidden="true" />
                      {led.label}
                    </th>
                    <td>{led.input}</td>
                    <td>{led.seed.toFixed(2)}</td>
                    <td>{(periodS + led.seed * spreadS).toFixed(2)} s</td>
                  </tr>
                ))}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ServerUnit3dDemo() {
  const xray = useLabsXray();
  const [rotate, setRotate] = useState(DEFAULT_ROTATE);
  const [scale, setScale] = useState(1);
  const [seed, setSeed] = useState(DEFAULT_SEED);
  const [size, setSize] = useState<ServerUnitSize>("md");
  const [pull, setPull] = useState(DEFAULT_PULL);

  const reset = () => {
    setRotate(DEFAULT_ROTATE);
    setScale(1);
    setSeed(DEFAULT_SEED);
    setSize("md");
    setPull(DEFAULT_PULL);
  };

  return (
    <LabsDemoLayout
      mounted={`<ServerUnitRack seed={${seed}} size="${size}"${xray ? ` xray pull={${(pull / 100).toFixed(2)}}` : ""} />`}
      stage={
        <div className={styles.stage}>
          <div
            className={styles.stageInner}
            style={assignInlineVars({
              [styles.stageScale]: String(scale),
              [styles.stageRotateX]: `${rotate.x}deg`,
              [styles.stageRotateY]: `${rotate.y}deg`,
              [styles.stageRotateZ]: `${rotate.z}deg`,
            })}
          >
            <div className={styles.wrapper3d}>
              <ServerUnitRack seed={seed} size={size} xray={xray} pull={pull / 100} />
            </div>
          </div>
          {xray && <ServerRackXray seed={seed} />}
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="Size">
            <ButtonGroupControl
              options={SIZE_OPTIONS}
              value={size}
              onChange={setSize}
              formatOption={(option) => option.toUpperCase()}
            />
          </ControlGroup>

          <ControlGroup title="Rotation">
            <SliderControl
              label="X"
              value={rotate.x}
              min={-180}
              max={180}
              onChange={(value) => setRotate((prev) => ({ ...prev, x: value }))}
              format={(value) => `${value}°`}
            />
            <SliderControl
              label="Y"
              value={rotate.y}
              min={-180}
              max={180}
              onChange={(value) => setRotate((prev) => ({ ...prev, y: value }))}
              format={(value) => `${value}°`}
            />
            <SliderControl
              label="Z"
              value={rotate.z}
              min={-180}
              max={180}
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

          <ControlGroup title="LEDs">
            <SliderControl
              label="Seed"
              value={seed}
              min={0}
              max={100}
              onChange={setSeed}
              format={(value) => `#${value}`}
            />
          </ControlGroup>

          {xray && (
            <ControlGroup title="Xray">
              <SliderControl
                label="Pull out"
                value={pull}
                min={0}
                max={100}
                onChange={setPull}
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
