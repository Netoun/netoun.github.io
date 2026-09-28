import { assignInlineVars } from "@vanilla-extract/dynamic";
import { memo } from "react";
import { BOARD_COLS, DRUM, type BoardState } from "./split-flap-drum";
import * as styles from "./split-flap-board.css";

// The board's terminal marks print in gold, like the site's `_❯`.
const isMark = (glyph: string) => glyph === "_" || glyph === "❯";

interface HalfProps {
  glyph: string;
  className: string;
  /** Which half of the glyph this card shows. */
  half: "top" | "bottom";
}

function Half({ glyph, className, half }: HalfProps) {
  return (
    <span className={className}>
      <span className={styles.glyph} data-half={half} data-mark={isMark(glyph) || undefined}>
        {glyph}
      </span>
    </span>
  );
}

interface FlapProps {
  current: number;
  previous: number;
  flips: number;
  /** Steps from where the message started to its target, printed under the flap in xray. */
  steps?: number;
  moving: boolean;
}

/**
 * One character: four half-cards. The static halves show the new glyph on top and the old one
 * below; the two leaves, hinged on the middle line, carry the old top down and the new bottom
 * in. Each step flips the parity, which swaps the leaves to an identical pair of keyframes and
 * so restarts them.
 */
const Flap = memo(function Flap({ current, previous, flips, steps, moving }: FlapProps) {
  const next = DRUM[current];
  const old = DRUM[previous];
  const parity = flips === 0 ? undefined : flips % 2 === 0 ? "b" : "a";

  return (
    <span className={styles.cell}>
      <span className={styles.flap} data-parity={parity}>
        <Half glyph={next} half="top" className={styles.staticTop} />
        <span className={styles.staticBottom}>
          <span className={styles.glyph} data-half="bottom" data-mark={isMark(old) || undefined}>
            {old}
          </span>
          <span className={styles.shade} />
        </span>
        <Half glyph={old} half="top" className={styles.leafTop} />
        <Half glyph={next} half="bottom" className={styles.leafBottom} />
        <span className={styles.hinge} />
      </span>
      {steps !== undefined && (
        <span className={styles.steps} data-moving={moving || undefined}>
          {String(steps).padStart(2, "0")}
        </span>
      )}
    </span>
  );
});

export interface SplitFlapBoardProps {
  state: BoardState;
  targets: readonly number[];
  flipMs: number;
  /** Per flap, steps from the message's start to its target: shown under the flaps (xray). */
  steps?: readonly number[];
  /** The lines as they read once landed, for assistive tech (the flaps are decorative). */
  label: string;
}

/** A departure board in CSS 3D: rows of flaps, sized on the board's own width. */
export function SplitFlapBoard({ state, targets, flipMs, steps, label }: SplitFlapBoardProps) {
  const rows = Math.ceil(state.current.length / BOARD_COLS);

  return (
    <div
      className={styles.board}
      style={assignInlineVars({ [styles.flipDuration]: `${flipMs}ms` })}
    >
      <span className={styles.srOnly}>{label}</span>
      {Array.from({ length: rows }, (_, row) => (
        <span key={row} className={styles.row} aria-hidden="true">
          {state.current.slice(row * BOARD_COLS, (row + 1) * BOARD_COLS).map((current, col) => {
            const index = row * BOARD_COLS + col;
            return (
              <Flap
                // A flap is its position on the board.
                // oxlint-disable-next-line react/no-array-index-key
                key={index}
                current={current}
                previous={state.previous[index]}
                flips={state.flips[index]}
                steps={steps?.[index]}
                moving={current !== targets[index]}
              />
            );
          })}
        </span>
      ))}
    </div>
  );
}
