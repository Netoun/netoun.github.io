import { useState } from "react";
import {
  BANDS,
  BASE_VALUES,
  DRIFT_SEQUENCES,
  METRICS,
  PULSE_EVERY,
  SYSTEM_METRICS_DEFAULTS,
  SystemMetricsPanel,
  bandOf,
  isPulsing,
  metricsAt,
} from "@/components/misc/system-metrics-panel/system-metrics-panel.component";
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
} from "../../components/labs-readout/labs-readout.component";
import { LabsScreen } from "../../components/labs-screen/labs-screen.component";
import * as styles from "./system-metrics.demo.css";

const STATES = ["paused", "running"] as const;
type PlayState = (typeof STATES)[number];

const sign = (step: number) => (step > 0 ? "+" : step < 0 ? "−" : "0");

/** Each meter's base, its drift sequence at this step, and the bump when it pulses. */
function XrayReadout({ tick, tickMs }: { tick: number; tickMs: number }) {
  const values = metricsAt(tick);
  const step = tick % 8;
  return (
    <LabsReadout title="drift">
      <ReadoutFigure>tick {String(tick).padStart(4, "0")}</ReadoutFigure>
      <ReadoutLine>
        every {tickMs} ms · step {step + 1} of 8 · loops every 24 ticks
      </ReadoutLine>
      <ReadoutLine code>
        base + Σ drift[0…{step}] + (tick + i·3) % {PULSE_EVERY} == 0
      </ReadoutLine>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Meter</th>
            <th scope="col">Base</th>
            <th scope="col">Drift</th>
            <th scope="col">Now</th>
          </tr>
        </thead>
        <tbody>
          {METRICS.map((metric, index) => {
            const pulse = isPulsing(index, tick);
            return (
              <tr key={metric} className={pulse ? styles.pulsing : undefined}>
                <th scope="row">{metric}</th>
                <td>{BASE_VALUES[index]}</td>
                <td>
                  <span className={styles.steps}>
                    {DRIFT_SEQUENCES[index].map((drift, position) => (
                      <span
                        // Eight fixed slots: the position is the identity.
                        // oxlint-disable-next-line react/no-array-index-key
                        key={position}
                        className={styles.step}
                        data-now={position === step || undefined}
                      >
                        {sign(drift)}
                      </span>
                    ))}
                  </span>
                </td>
                <td>
                  {values[index]}
                  {pulse ? " +1" : ""} · {bandOf(values[index])}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ReadoutLine>
        bands: low &lt; {BANDS.mid} ≤ mid &lt; {BANDS.high} ≤ high
      </ReadoutLine>
    </LabsReadout>
  );
}

export function SystemMetricsDemo() {
  const xray = useLabsXray();
  const [state, setState] = useState<PlayState>("running");
  const [tickMs, setTickMs] = useState<number>(SYSTEM_METRICS_DEFAULTS.tickMs);
  const [tick, setTick] = useState(0);

  const running = state === "running";

  const reset = () => {
    setState("running");
    setTickMs(SYSTEM_METRICS_DEFAULTS.tickMs);
  };

  return (
    <LabsDemoLayout
      mounted={`<SystemMetricsPanel isAnimating={${running}} tickMs={${tickMs}} />`}
      stage={
        <div className={styles.stage}>
          <LabsScreen>
            <SystemMetricsPanel
              isAnimating={running}
              tickMs={tickMs}
              xray={xray}
              // The readout listens only while it is on screen.
              onTick={xray ? setTick : undefined}
            />
          </LabsScreen>
          {xray && <XrayReadout tick={tick} tickMs={tickMs} />}
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
          <ControlGroup title="Clock">
            <SliderControl
              label="Tick"
              value={tickMs}
              min={100}
              max={2000}
              step={20}
              onChange={setTickMs}
              format={(value) => `${value} ms`}
            />
          </ControlGroup>
          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
