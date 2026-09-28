import { assignInlineVars } from "@vanilla-extract/dynamic";
import { Glyph } from "@/components/primitives/glyph/glyph.component";
import { TerminalButtons } from "@/components/primitives/terminal-buttons/terminal-buttons.component";
import {
  BAY_COUNT,
  type Feedback,
  OPERATORS,
  type RunLine,
} from "../../../../data/not-found-puzzle";
import {
  type Attempt,
  LINE_INTERVAL_MS,
  type GamePhase,
} from "../../../../hooks/use-not-found-game.hook";
import * as styles from "./not-found-game-console.css";

export interface NotFoundGameConsoleProps {
  numbers: readonly number[];
  /** The runs before this one, printed as a Tusmo grid. */
  history: readonly Attempt[];
  tries: number;
  /** How this run's bays scored against the nearest solution. */
  scores: readonly (Feedback | null)[];
  lines: readonly RunLine[];
  phase: GamePhase;
  hasRun: boolean;
  /** The racks moved since this run: its output stays, dimmed. */
  stale: boolean;
}

type Tone = keyof typeof styles.tone;
interface Segment {
  key: string;
  text: string;
  tone: Tone;
}

const bayTag = (bay: number): Segment => ({ key: "bay", text: `[U${bay + 1}] `, tone: "muted" });

function segments(line: RunLine): Segment[] {
  switch (line.kind) {
    case "step":
      return [
        bayTag(line.bay),
        { key: "op", text: line.mnemonic.padEnd(5, " "), tone: line.bay === 0 ? "muted" : "mint" },
        { key: "value", text: `${String(line.value).padStart(3, " ")}   `, tone: "paper" },
        { key: "label", text: "acc = ", tone: "muted" },
        { key: "acc", text: String(line.acc), tone: "gold" },
      ];
    case "warn":
      return [bayTag(line.bay), { key: "text", text: line.text, tone: "gold" }];
    case "error":
      return [bayTag(line.bay), { key: "text", text: line.text, tone: "fault" }];
    case "result":
      return line.ok
        ? [
            { key: "acc", text: "acc == 404  ", tone: "paper" },
            { key: "tick", text: "✓ ", tone: "mint" },
            { key: "text", text: "the count is right", tone: "paper" },
          ]
        : [
            { key: "acc", text: `acc = ${line.acc}  `, tone: "paper" },
            { key: "miss", text: "≠ 404 ✗  ", tone: "fault" },
            // How far it landed: enough to steer the next try, never the answer.
            { key: "gap", text: gap(line.acc), tone: "gold" },
          ];
    default:
      return [];
  }
}

const gap = (acc: number) => `${Math.abs(acc - 404)} ${acc < 404 ? "short" : "over"}`;

const count = (scores: readonly (Feedback | null)[], score: Feedback) =>
  scores.filter((s) => s === score).length;

/** Older runs beyond these fold into one line. */
const HISTORY_ROWS = 4;
const SCORE_TONE = { right: "mint", elsewhere: "gold", absent: "muted" } as const;

// One earlier run on one line: its parts in the colours they scored, then where it landed.
function historyRow(attempt: Attempt, numbers: readonly number[]) {
  const parts: Segment[] = [{ key: "try", text: `#${attempt.number} `, tone: "muted" }];
  for (let bay = 0; bay < BAY_COUNT; bay++) {
    const part = attempt.bays[bay];
    const score = attempt.scores[bay];
    if (part === null || score === null) continue;
    const text =
      part.kind === "number"
        ? String(numbers[part.index])
        : (OPERATORS.find((op) => op.id === part.operator)?.symbol ?? "?");
    parts.push({ key: `U${bay + 1}`, text: `${text} `, tone: SCORE_TONE[score] });
  }
  const { run } = attempt;
  parts.push(
    run.acc === null
      ? { key: "end", text: "→ fault", tone: "fault" }
      : { key: "end", text: `→ ${run.acc}`, tone: run.ok ? "mint" : "paper" },
  );
  return (
    <div key={`try-${attempt.number}`} className={styles.historyStyle}>
      {parts.map((part) => (
        <span key={part.key} className={styles.tone[part.tone]}>
          {part.text}
        </span>
      ))}
    </div>
  );
}

const lineKey = (line: RunLine) => (line.kind === "result" ? "result" : `${line.kind}-${line.bay}`);

/** A line types in one step per character, inside the tick that printed it. */
function renderLine(key: string, parts: Segment[]) {
  const length = parts.reduce((sum, part) => sum + part.text.length, 0);
  return (
    <div
      key={key}
      className={styles.lineStyle}
      style={assignInlineVars({
        [styles.lineSteps]: String(Math.max(1, length)),
        [styles.lineDuration]: String(Math.min(LINE_INTERVAL_MS - 60, 14 * length)),
      })}
    >
      {parts.map((part) => (
        <span key={part.key} className={styles.tone[part.tone]}>
          {part.text}
        </span>
      ))}
    </div>
  );
}

/**
 * The server's console, an ssh session on the paper: `power-on`, then the run one line per
 * tick. Drawn for the eye; the section announces the result in words.
 */
export function NotFoundGameConsole({
  numbers,
  history,
  tries,
  scores,
  lines,
  phase,
  hasRun,
  stale,
}: NotFoundGameConsoleProps) {
  const shownHistory = history.slice(-HISTORY_ROWS);
  const folded = history.length - shownHistory.length;
  const isDone = phase === "won" || phase === "failed" || (stale && hasRun);
  const won = lines.some((line) => line.kind === "result" && line.ok);

  return (
    <div className={styles.windowStyle} aria-hidden="true">
      <div className={styles.barStyle}>
        <TerminalButtons />
        <span>ssh netoun@rack-404</span>
      </div>
      <div className={styles.screenStyle} data-stale={stale || undefined}>
        {folded > 0 && (
          <div className={styles.tone.muted}>
            ⋯ {folded} earlier {folded === 1 ? "try" : "tries"}
          </div>
        )}
        {shownHistory.map((attempt) => historyRow(attempt, numbers))}
        {hasRun ? (
          <>
            <div>
              <Glyph className={styles.tone.gold}>_❯ </Glyph>
              power-on --target 404 <span className={styles.tone.muted}>#{tries}</span>
            </div>
            {lines.map((line) => renderLine(lineKey(line), segments(line)))}
            {phase === "running" && <span className={styles.cursorStyle}>▐</span>}
            {isDone &&
              !won &&
              renderLine("score", [
                { key: "right", text: `${count(scores, "right")} right`, tone: "mint" },
                { key: "sep1", text: " · ", tone: "muted" },
                { key: "elsewhere", text: `${count(scores, "elsewhere")} elsewhere`, tone: "gold" },
                { key: "sep2", text: " · ", tone: "muted" },
                { key: "absent", text: `${count(scores, "absent")} out`, tone: "paper" },
              ])}
            {isDone &&
              renderLine("exit", [
                {
                  key: "exit",
                  text: won
                    ? "exit 0 · the page is still missing. cd ~"
                    : "exit 1 · swap a rack, power again",
                  tone: "muted",
                },
              ])}
          </>
        ) : (
          <>
            <div>
              <span className={styles.tone.gold}>_❯ </span>
              <span className={styles.cursorStyle}>▐</span>
            </div>
            <div className={styles.tone.muted}>plug racks, then press power</div>
          </>
        )}
      </div>
    </div>
  );
}
