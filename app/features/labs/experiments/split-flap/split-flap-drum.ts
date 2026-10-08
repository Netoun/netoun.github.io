// A departure board's mechanics, apart from its looks: what a flap can print, where each flap
// must land, and one tick of the whole board.

/** The glyphs on every flap's drum, in the order it turns. Index 0 is the blank. */
export const DRUM = [..." ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./-_", "❯"];

export const BOARD_COLS = 16;
const BOARD_ROWS = 2;

/** What the board can print: accents dropped, upper case, `>` typed as `❯`, anything else blank. */
export function cleanLine(value: string, cols = BOARD_COLS): string {
  return [
    ...value
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toUpperCase()
      .replace(/>/g, "❯"),
  ]
    .map((glyph) => (DRUM.includes(glyph) ? glyph : " "))
    .join("")
    .slice(0, cols);
}

/** The drum index each flap must land on, every line centred on the board. */
export function boardTargets(
  lines: readonly string[],
  cols = BOARD_COLS,
  rows = BOARD_ROWS,
): number[] {
  const targets: number[] = [];
  for (let row = 0; row < rows; row += 1) {
    const text = [...cleanLine(lines[row] ?? "", cols).trim()];
    const pad = Math.floor((cols - text.length) / 2);
    for (let col = 0; col < cols; col += 1) {
      const glyph = text[col - pad];
      targets.push(glyph === undefined ? 0 : DRUM.indexOf(glyph));
    }
  }
  return targets;
}

/** Steps a flap turns to go from one glyph to another: the drum only turns forward. */
export function drumDistance(from: number, to: number): number {
  return (to - from + DRUM.length) % DRUM.length;
}

export interface BoardState {
  /** Drum index each flap shows. */
  current: number[];
  /** What it showed before its last step (the leaves carry it away). */
  previous: number[];
  /** Steps taken since the board started, per flap: its parity restarts the flip keyframes. */
  flips: number[];
  /** Milliseconds since the message was set. */
  elapsed: number;
}

export function blankBoard(count = BOARD_COLS * BOARD_ROWS): BoardState {
  const zeros = () => Array.from({ length: count }, () => 0);
  return { current: zeros(), previous: zeros(), flips: zeros(), elapsed: 0 };
}

export function settledBoard(targets: readonly number[]): BoardState {
  return { current: [...targets], previous: [...targets], flips: targets.map(() => 0), elapsed: 0 };
}

/** When a flap may start turning: one stagger per column, the next line two columns later. */
export function startDelay(index: number, staggerMs: number, cols = BOARD_COLS): number {
  return ((index % cols) + Math.floor(index / cols) * 2) * staggerMs;
}

/**
 * One tick of the board, one flip time long: every flap past its start delay that is not on
 * its target turns one glyph forward.
 */
export function advanceBoard(
  state: BoardState,
  targets: readonly number[],
  flipMs: number,
  staggerMs: number,
): BoardState {
  const elapsed = state.elapsed + flipMs;
  const current = [...state.current];
  const previous = [...state.previous];
  const flips = [...state.flips];
  for (let index = 0; index < current.length; index += 1) {
    if (current[index] === targets[index] || elapsed < startDelay(index, staggerMs)) continue;
    previous[index] = current[index];
    current[index] = (current[index] + 1) % DRUM.length;
    flips[index] += 1;
  }
  return { current, previous, flips, elapsed };
}

export function hasLanded(state: BoardState, targets: readonly number[]): boolean {
  return state.current.every((glyph, index) => glyph === targets[index]);
}
