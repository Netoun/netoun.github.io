import { useState } from "react";
import {
  FAKE_CONSOLE_DEFAULTS,
  FakeConsole,
  type FakeConsoleTrace,
} from "@/components/misc/fake-console/fake-console.component";
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
  ReadoutSection,
} from "../../components/labs-readout/labs-readout.component";
import { LabsScreen } from "../../components/labs-screen/labs-screen.component";
import * as styles from "./fake-console.demo.css";

const STATES = ["paused", "running"] as const;
type PlayState = (typeof STATES)[number];

const hex = (value: number) => `0x${value.toString(16).padStart(8, "0")}`;

interface XrayReadoutProps {
  trace: FakeConsoleTrace | null;
  tickMs: number;
  shiftMs: number;
}

/** The newest line taken apart: which draw gave which field, and the reel it rolls into. */
function XrayReadout({ trace, tickMs, shiftMs }: XrayReadoutProps) {
  const parts = trace?.parts;
  return (
    <LabsReadout title="reel">
      <ReadoutFigure>line {String(trace?.lines ?? 0).padStart(4, "0")}</ReadoutFigure>
      <ReadoutLine>
        every {tickMs} ms · rolls {Math.round(trace?.rowPx ?? 0)} px in {shiftMs} ms
      </ReadoutLine>
      <ReadoutLine code>
        {hex(trace?.seedIn ?? FAKE_CONSOLE_DEFAULTS.seed)} → 10 × lcg →{" "}
        {hex(trace?.seedOut ?? FAKE_CONSOLE_DEFAULTS.seed)}
      </ReadoutLine>
      <ReadoutRows>
        <ReadoutRow
          label="Process"
          value={parts?.process ?? "—"}
          rule="(lcg >>> 16) % 8 · numbered 01–08"
          swatchClassName={styles.swatches.field}
        />
        <ReadoutRow
          label="State"
          value={parts?.state ?? "—"}
          rule="(lcg >>> 16) % 8"
          swatchClassName={styles.swatches.field}
        />
        <ReadoutRow
          label="Load"
          value={parts?.load ?? "—"}
          rule="(lcg >>> 16) % 100"
          swatchClassName={styles.swatches.field}
        />
        <ReadoutRow
          label="Hash"
          value={parts ? `${parts.hex}-${parts.tail}` : "—"}
          rule="7 × (lcg >>> 16) % 16 → HEX"
          swatchClassName={styles.swatches.field}
        />
      </ReadoutRows>
      <ReadoutSection>
        <ReadoutRows>
          <ReadoutRow
            label="Window"
            value={trace ? `${trace.rowsCount - 2} rows` : "—"}
            rule="the clip the reel rolls behind"
            swatchClassName={styles.swatches.window}
          />
          <ReadoutRow
            label="Pending"
            value="+1"
            rule="drawn at rest below it, then the reel moves"
            swatchClassName={styles.swatches.pending}
          />
        </ReadoutRows>
      </ReadoutSection>
    </LabsReadout>
  );
}

export function FakeConsoleDemo() {
  const xray = useLabsXray();
  const [state, setState] = useState<PlayState>("running");
  const [tickMs, setTickMs] = useState<number>(FAKE_CONSOLE_DEFAULTS.tickMs);
  const [shiftMs, setShiftMs] = useState<number>(FAKE_CONSOLE_DEFAULTS.shiftMs);
  const [trace, setTrace] = useState<FakeConsoleTrace | null>(null);

  const running = state === "running";

  const reset = () => {
    setState("running");
    setTickMs(FAKE_CONSOLE_DEFAULTS.tickMs);
    setShiftMs(FAKE_CONSOLE_DEFAULTS.shiftMs);
  };

  return (
    <LabsDemoLayout
      mounted={`<FakeConsole isAnimating={${running}} tickMs={${tickMs}} shiftMs={${shiftMs}} />`}
      stage={
        <div className={styles.stage}>
          <LabsScreen>
            <FakeConsole
              isAnimating={running}
              tickMs={tickMs}
              shiftMs={shiftMs}
              xray={xray}
              // The readout listens only while it is on screen.
              onTick={xray ? setTrace : undefined}
            />
          </LabsScreen>
          {xray && <XrayReadout trace={trace} tickMs={tickMs} shiftMs={shiftMs} />}
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
              label="Line"
              value={tickMs}
              min={100}
              max={2000}
              step={50}
              onChange={setTickMs}
              format={(value) => `${value} ms`}
            />
            <SliderControl
              label="Roll"
              value={shiftMs}
              min={50}
              max={1500}
              step={50}
              onChange={setShiftMs}
              format={(value) => `${value} ms`}
            />
          </ControlGroup>
          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
