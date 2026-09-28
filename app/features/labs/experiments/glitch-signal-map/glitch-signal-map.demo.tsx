import { useState } from "react";
import {
  GLITCH_SIGNAL_MAP_DEFAULTS,
  GlitchSignalMap,
  type GlitchCellKind,
  type GlitchSignalMapCell,
  type GlitchSignalMapStats,
} from "@/components/misc/glitch-signal-map/glitch-signal-map.component";
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
import { LabsScreen } from "../../components/labs-screen/labs-screen.component";
import * as styles from "./glitch-signal-map.demo.css";

const STATES = ["paused", "running"] as const;
type PlayState = (typeof STATES)[number];

// The home's seed first, then three more: the grid is exactly as random as its seed.
const SEEDS = [GLITCH_SIGNAL_MAP_DEFAULTS.seed, 0x1b873593, 0x3c6ef372, 0x9e3779b9];
const DEFAULT_RATIO = GLITCH_SIGNAL_MAP_DEFAULTS.updateRatio * 100;

const hex = (value: number) => `0x${value.toString(16).padStart(8, "0")}`;

// The bit tests of `updateBlocks`, as the readout prints them next to each state.
const KINDS: { kind: GlitchCellKind; label: string; rule: string }[] = [
  { kind: "idle", label: "Idle", rule: "otherwise" },
  { kind: "active", label: "Active", rule: "(seed >>> 4) & 0xf < 5 · 5/16" },
  { kind: "accent", label: "Accent", rule: "(seed >>> 8) & 0xf == 0 · 1/16" },
  { kind: "recal", label: "Recal", rule: "seed & 0x7f <= 4 · 5/128 · 120 ms" },
];

interface XrayReadoutProps {
  stats: GlitchSignalMapStats | null;
  cell: GlitchSignalMapCell | null;
  tickMs: number;
}

/** The mechanism, printed next to the screen: the clock, the walk, the states and their rules. */
function XrayReadout({ stats, cell, tickMs }: XrayReadoutProps) {
  const cells = stats?.cells ?? 0;
  return (
    <div className={styles.readout}>
      <p className={styles.kicker}>_xray / state machine</p>
      <p className={styles.tick}>tick {String(stats?.tick ?? 0).padStart(4, "0")}</p>
      <p className={styles.line}>
        every {tickMs} ms · {stats?.rewritten ?? 0} of {cells} rewritten
      </p>
      <p className={styles.walk}>
        <code>
          ({stats?.tick ?? 0}·7 + i·19 + 5) mod {cells}
        </code>
      </p>
      <ul className={styles.kinds}>
        {KINDS.map(({ kind, label, rule }) => (
          <li key={kind} className={styles.kind}>
            <span className={styles.swatch} data-kind={kind} aria-hidden="true" />
            <span className={styles.kindLabel}>{label}</span>
            <span className={styles.kindCount}>{stats?.counts[kind] ?? "—"}</span>
            <code className={styles.kindRule}>{rule}</code>
          </li>
        ))}
        <li className={styles.kind}>
          <span className={styles.swatch} data-kind="touched" aria-hidden="true" />
          <span className={styles.kindLabel}>Rewritten this tick</span>
        </li>
      </ul>
      <p className={styles.cell}>
        {cell
          ? `cell ${String(cell.index).padStart(3, "0")} · r${cell.row + 1} c${cell.col + 1} · ${hex(cell.seed)} · ${cell.kind}`
          : "Point a cell to read its seed"}
      </p>
    </div>
  );
}

export function GlitchSignalMapDemo() {
  const xray = useLabsXray();
  const [state, setState] = useState<PlayState>("running");
  const [tickMs, setTickMs] = useState<number>(GLITCH_SIGNAL_MAP_DEFAULTS.tickMs);
  const [ratio, setRatio] = useState(DEFAULT_RATIO);
  const [seedIndex, setSeedIndex] = useState(0);
  const [stepToken, setStepToken] = useState(0);
  const [stats, setStats] = useState<GlitchSignalMapStats | null>(null);
  const [cell, setCell] = useState<GlitchSignalMapCell | null>(null);

  const running = state === "running";
  const seed = SEEDS[seedIndex];

  const reset = () => {
    setState("running");
    setTickMs(GLITCH_SIGNAL_MAP_DEFAULTS.tickMs);
    setRatio(DEFAULT_RATIO);
    setSeedIndex(0);
  };

  return (
    <LabsDemoLayout
      mounted={`<GlitchSignalMap isAnimating={${running}} tickMs={${tickMs}} updateRatio={${(ratio / 100).toFixed(2)}} seed={${hex(seed)}} />`}
      stage={
        <div className={styles.stage}>
          <LabsScreen>
            <GlitchSignalMap
              isAnimating={running}
              tickMs={tickMs}
              updateRatio={ratio / 100}
              seed={seed}
              xray={xray}
              stepToken={stepToken}
              // The readout listens only while it is on screen.
              onTick={xray ? setStats : undefined}
              onHoverCell={xray ? setCell : undefined}
            />
          </LabsScreen>
          {xray && <XrayReadout stats={stats} cell={cell} tickMs={tickMs} />}
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
            <ControlButton onPress={() => setStepToken((token) => token + 1)} isDisabled={running}>
              {running ? "Pause to step" : "Step one tick"}
            </ControlButton>
          </ControlGroup>
          <ControlGroup title="Clock">
            <SliderControl
              label="Tick"
              value={tickMs}
              min={60}
              max={1000}
              step={10}
              onChange={setTickMs}
              format={(value) => `${value} ms`}
            />
            <SliderControl
              label="Rewrite"
              value={ratio}
              min={1}
              max={20}
              onChange={setRatio}
              format={(value) => `${value} %`}
            />
          </ControlGroup>
          <ControlGroup title="Seed">
            <div className={styles.seedRow}>
              <ControlReadout>{hex(seed)}</ControlReadout>
              <ControlButton onPress={() => setSeedIndex((index) => (index + 1) % SEEDS.length)}>
                Next seed
              </ControlButton>
            </div>
          </ControlGroup>
          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
