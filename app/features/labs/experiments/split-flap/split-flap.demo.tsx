import { useEffect, useMemo, useState } from "react";
import { Input, Label, TextField } from "react-aria-components";
import { useMediaQuery } from "@/hooks/use-media-query.hook";
import {
  LabsDemoLayout,
  useLabsXray,
} from "../../components/labs-experiment-frame/labs-experiment-frame.component";
import {
  ButtonGroupControl,
  ControlButton,
  ControlGroup,
  ControlPanel,
  ResetButton,
  SliderControl,
} from "../../components/labs-control/labs-control.component";
import { SplitFlapBoard } from "./split-flap-board.component";
import {
  BOARD_COLS,
  DRUM,
  advanceBoard,
  blankBoard,
  boardTargets,
  cleanLine,
  drumDistance,
  hasLanded,
  settledBoard,
  startDelay,
  type BoardState,
} from "./split-flap-drum";
import * as styles from "./split-flap.demo.css";

// The board's default lines are the site's own: the footer's call and this address.
const DEFAULT_LINES = ["ESTABLISH LINK", "NETOUN.COM/LABS"];
const DEFAULT_FLIP_MS = 70;
const DEFAULT_STAGGER_MS = 30;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const STATES = ["paused", "running"] as const;
type PlayState = (typeof STATES)[number];

const blankStart = () => blankBoard().current;
const name = (index: number) => (DRUM[index] === " " ? "blank" : DRUM[index]);
const two = (value: number) => String(value).padStart(2, "0");

interface XrayProps {
  board: BoardState;
  targets: readonly number[];
  start: readonly number[];
  flipMs: number;
  staggerMs: number;
}

/** One flap taken apart, and its drum: the first printed flap of line 1. */
function SplitFlapXray({ board, targets, start, flipMs, staggerMs }: XrayProps) {
  const index = Math.max(
    0,
    targets.slice(0, BOARD_COLS).findIndex((target) => target !== 0),
  );
  const current = board.current[index];
  const previous =
    board.previous[index] === current
      ? (current - 1 + DRUM.length) % DRUM.length
      : board.previous[index];
  const from = start[index];
  const target = targets[index];
  const distance = drumDistance(from, target);
  const halfMs = Math.round(flipMs / 2);

  const pieces = [
    { key: "static-top", glyph: current, half: "top", label: `static · new ${name(current)}` },
    {
      key: "static-bottom",
      glyph: previous,
      half: "bottom",
      label: `static · old ${name(previous)}`,
    },
    { key: "leaf-top", glyph: previous, half: "top", label: `leaf · 0 → −90°` },
    { key: "leaf-bottom", glyph: current, half: "bottom", label: `leaf · 90° → 0` },
  ] as const;

  return (
    <div className={styles.xray}>
      <div className={styles.specimen} aria-hidden="true">
        <div className={styles.specimenRig}>
          {pieces.map((piece) => (
            <span key={piece.key} className={styles.piece} data-piece={piece.key}>
              <span className={styles.pieceCard} data-half={piece.half}>
                <span className={styles.pieceGlyph} data-half={piece.half}>
                  {DRUM[piece.glyph]}
                </span>
              </span>
              <span className={styles.pieceLabel}>{piece.label}</span>
            </span>
          ))}
        </div>
      </div>
      <dl className={styles.facts}>
        <dt>specimen</dt>
        <dd>line 1 · col {two(index + 1)}</dd>
        <dt>step</dt>
        <dd>
          {name(previous)} → {name(current)}
        </dd>
        <dt>path</dt>
        <dd>
          {name(from)} → {name(target)} · {two(distance)} steps
        </dd>
        <dt>flip</dt>
        <dd>
          {flipMs} ms = {halfMs} + {flipMs - halfMs}
        </dd>
        <dt>delay</dt>
        <dd>{startDelay(index, staggerMs)} ms</dd>
      </dl>
      <ol className={styles.drum} aria-label={`Drum of ${DRUM.length} glyphs`}>
        {DRUM.map((glyph, position) => {
          const inPath = drumDistance(from, position) <= distance;
          return (
            <li
              key={glyph}
              className={styles.drumGlyph}
              data-path={inPath || undefined}
              data-current={position === current || undefined}
              data-target={position === target || undefined}
            >
              {glyph === " " ? "·" : glyph}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

interface LineFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function LineField({ label, value, onChange }: LineFieldProps) {
  return (
    <TextField className={styles.field} value={value} onChange={onChange} maxLength={BOARD_COLS}>
      <Label className={styles.fieldLabel}>{label}</Label>
      <Input className={styles.fieldInput} spellCheck={false} autoComplete="off" />
    </TextField>
  );
}

export function SplitFlapDemo() {
  const xray = useLabsXray();
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const [lines, setLines] = useState(DEFAULT_LINES);
  const [board, setBoard] = useState<BoardState>(() => settledBoard(boardTargets(DEFAULT_LINES)));
  const [start, setStart] = useState(() => boardTargets(DEFAULT_LINES));
  const [flipMs, setFlipMs] = useState(DEFAULT_FLIP_MS);
  const [staggerMs, setStaggerMs] = useState(DEFAULT_STAGGER_MS);
  const [state, setState] = useState<PlayState>("running");
  const [arrived, setArrived] = useState(false);

  const targets = useMemo(() => boardTargets(lines), [lines]);
  const landed = hasLanded(board, targets);
  const running = state === "running";

  // The board is prerendered printed. Once live, it clears and flips its message in, once.
  useEffect(() => {
    if (arrived || window.matchMedia(REDUCED_MOTION).matches) return;
    const timer = window.setTimeout(() => {
      setArrived(true);
      setBoard(blankBoard());
      setStart(blankStart());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [arrived]);

  // One timer for the whole board, only while something is still turning.
  useEffect(() => {
    if (!running || landed || reducedMotion) return;
    const timer = window.setInterval(() => {
      setBoard((current) => advanceBoard(current, targets, flipMs, staggerMs));
    }, flipMs);
    return () => window.clearInterval(timer);
  }, [running, landed, reducedMotion, targets, flipMs, staggerMs]);

  const setLine = (row: number, value: string) => {
    const next = lines.map((line, index) => (index === row ? cleanLine(value) : line));
    setLines(next);
    if (reducedMotion) {
      setBoard(settledBoard(boardTargets(next)));
      return;
    }
    // The new message starts from what the board shows now.
    setStart(board.current);
    setBoard({ ...board, elapsed: 0 });
  };

  const replay = () => {
    setState("running");
    if (reducedMotion) return;
    setBoard(blankBoard());
    setStart(blankStart());
  };

  const reset = () => {
    setLines(DEFAULT_LINES);
    setFlipMs(DEFAULT_FLIP_MS);
    setStaggerMs(DEFAULT_STAGGER_MS);
    setState("running");
    if (reducedMotion) {
      setBoard(settledBoard(boardTargets(DEFAULT_LINES)));
      return;
    }
    setBoard(blankBoard());
    setStart(blankStart());
  };

  const steps = xray
    ? targets.map((target, index) => drumDistance(start[index], target))
    : undefined;
  const label = lines
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" / ");

  return (
    <LabsDemoLayout
      mounted={`<SplitFlapBoard flipMs={${flipMs}} /> · advanceBoard() every ${flipMs} ms, ${staggerMs} ms a column`}
      stage={
        <div className={styles.stage}>
          <SplitFlapBoard
            state={board}
            targets={targets}
            flipMs={flipMs}
            steps={steps}
            label={label}
          />
          {xray && (
            <SplitFlapXray
              board={board}
              targets={targets}
              start={start}
              flipMs={flipMs}
              staggerMs={staggerMs}
            />
          )}
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="Message">
            <LineField label="Line 1" value={lines[0]} onChange={(value) => setLine(0, value)} />
            <LineField label="Line 2" value={lines[1]} onChange={(value) => setLine(1, value)} />
            <p className={styles.hint}>A–Z 0–9 . / - _ · type &gt; for ❯ · 16 max</p>
          </ControlGroup>
          <ControlGroup title="Timing">
            <SliderControl
              label="Flip"
              value={flipMs}
              min={40}
              max={200}
              step={10}
              onChange={setFlipMs}
              format={(value) => `${value} ms`}
            />
            <SliderControl
              label="Stagger"
              value={staggerMs}
              min={0}
              max={80}
              step={5}
              onChange={setStaggerMs}
              format={(value) => `${value} ms`}
            />
          </ControlGroup>
          <ControlGroup title="Animation">
            <ButtonGroupControl
              options={STATES}
              value={state}
              onChange={setState}
              formatOption={(option) => option[0].toUpperCase() + option.slice(1)}
            />
            <ControlButton onPress={replay} isDisabled={reducedMotion}>
              Flip again
            </ControlButton>
          </ControlGroup>
          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
