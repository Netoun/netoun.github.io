/**
 * The 404 game: le compte est bon, played like Tusmo. Five numbers, four operators, nine bays.
 * The server reads the bays as an accumulator from U1 to U9: U1 loads a number, then each
 * operator bay applies itself to the running total with the number in the bay after it.
 * Division must fall exact. Each draw has solutions that use all five numbers; after a run,
 * every bay says whether its part is where the nearest of them has it, elsewhere in it, or not
 * in it. Any chain that reaches 404 wins.
 */

export const TARGET = 404;

export type OperatorId = "add" | "subtract" | "multiply" | "divide";

export interface OperatorInfo {
  id: OperatorId;
  /** Printed on the cartridge. */
  symbol: string;
  /** The console's mnemonic. */
  mnemonic: string;
  /** What screen readers say. */
  label: string;
}

export const OPERATORS: readonly OperatorInfo[] = [
  { id: "add", symbol: "+", mnemonic: "ADD", label: "addition" },
  { id: "subtract", symbol: "−", mnemonic: "SUB", label: "subtraction" },
  { id: "multiply", symbol: "×", mnemonic: "MUL", label: "multiplication" },
  { id: "divide", symbol: "÷", mnemonic: "DIV", label: "division" },
];

/** A bay holds a number (by its index in the draw), an operator, or nothing. */
export type Bay =
  | { kind: "number"; index: number }
  | { kind: "operator"; operator: OperatorId }
  | null;

export const BAY_COUNT = 9;
export const NUMBER_BAYS = [0, 2, 4, 6, 8] as const;
export const OPERATOR_BAYS = [1, 3, 5, 7] as const;
export const EMPTY_BAYS: readonly Bay[] = Array.from({ length: BAY_COUNT }, () => null);

/** An operator plugs at most this many times, and no solution uses one more often. */
export const MAX_SAME_OPERATOR = 3;

/** How many times each operator sits in the bays. */
export function operatorCounts(bays: readonly Bay[]): Record<OperatorId, number> {
  const counts: Record<OperatorId, number> = { add: 0, subtract: 0, multiply: 0, divide: 0 };
  for (const bay of bays) if (bay?.kind === "operator") counts[bay.operator] += 1;
  return counts;
}

const withinLimit = (chain: readonly Bay[]) =>
  Object.values(operatorCounts(chain)).every((count) => count <= MAX_SAME_OPERATOR);

/** Nicolas's example, and the draw used when no random draw can be solved. */
export const FALLBACK_NUMBERS = [42, 10, 32, 8, 19] as const;

export type RunLine =
  | { kind: "step"; bay: number; mnemonic: string; value: number; acc: number }
  | { kind: "warn"; bay: number; text: string }
  | { kind: "error"; bay: number; text: string }
  | { kind: "result"; acc: number; ok: boolean };

export interface Run {
  lines: RunLine[];
  ok: boolean;
  /** The total the server reached, `null` when it stopped on an error. */
  acc: number | null;
  /** The bay that stopped the run. */
  failAt: number | null;
}

export function apply(acc: number, operator: OperatorId, value: number): number | null {
  if (operator === "add") return acc + value;
  if (operator === "subtract") return acc - value;
  if (operator === "multiply") return acc * value;
  return acc % value === 0 ? acc / value : null;
}

const operatorInfo = (id: OperatorId) => OPERATORS.find((op) => op.id === id) ?? OPERATORS[0];

/** Runs the bays; the console prints the lines one by one. */
export function evaluateChain(bays: readonly Bay[], numbers: readonly number[]): Run {
  const lines: RunLine[] = [];
  const fail = (bay: number, text: string): Run => {
    lines.push({ kind: "error", bay, text });
    return { lines, ok: false, acc: null, failAt: bay };
  };

  const first = bays[0];
  if (first?.kind !== "number") return fail(0, "no number in U1");
  let acc = numbers[first.index];
  lines.push({ kind: "step", bay: 0, mnemonic: "LOAD", value: acc, acc });

  for (const bay of OPERATOR_BAYS) {
    const op = bays[bay];
    const next = bays[bay + 1];
    if (op?.kind !== "operator") {
      if (bays.slice(bay + 1).some(Boolean)) {
        lines.push({ kind: "warn", bay, text: "empty, the chain stops here" });
      }
      break;
    }
    const info = operatorInfo(op.operator);
    if (next?.kind !== "number") return fail(bay + 1, `${info.mnemonic} needs a number here`);
    const value = numbers[next.index];
    const result = apply(acc, op.operator, value);
    if (result === null) return fail(bay + 1, `EDIV ${acc} ÷ ${value} is not whole`);
    acc = result;
    lines.push({ kind: "step", bay: bay + 1, mnemonic: info.mnemonic, value, acc });
  }

  const ok = acc === TARGET;
  lines.push({ kind: "result", acc, ok });
  return { lines, ok, acc, failAt: null };
}

/**
 * Every chain that uses all the numbers, reaches the target and repeats no operator more than
 * `MAX_SAME_OPERATOR` times: at most 30,720 chains to try.
 */
export function fullSolutions(numbers: readonly number[]): Bay[][] {
  const found: Bay[][] = [];
  const used = numbers.map(() => false);
  const chain: Bay[] = [];

  const search = (acc: number, depth: number) => {
    if (depth === numbers.length) {
      if (acc === TARGET && withinLimit(chain)) found.push(chain.slice());
      return;
    }
    for (let index = 0; index < numbers.length; index++) {
      if (used[index]) continue;
      used[index] = true;
      for (const { id } of OPERATORS) {
        const next = apply(acc, id, numbers[index]);
        if (next === null) continue;
        chain.push({ kind: "operator", operator: id }, { kind: "number", index });
        search(next, depth + 1);
        chain.length -= 2;
      }
      used[index] = false;
    }
  };

  for (let index = 0; index < numbers.length; index++) {
    used[index] = true;
    chain.push({ kind: "number", index });
    search(numbers[index], 1);
    chain.length = 0;
    used[index] = false;
  }
  return found;
}

function pick(random: () => number, from: number, to: number, count: number): number[] {
  const pool = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/** Two numbers in 2–10 and three in 11–50, all distinct, in a shuffled order. */
export function drawNumbers(random: () => number): number[] {
  const numbers = [...pick(random, 2, 10, 2), ...pick(random, 11, 50, 3)];
  return pick(random, 0, numbers.length - 1, numbers.length).map((i) => numbers[i]);
}

export interface Puzzle {
  numbers: number[];
  /**
   * The chains the bays are scored against: nine bays, all five numbers. Orders that give the
   * same total are all in it (8 + 19 and 19 + 8, − 42 − 10 and − 10 − 42), so swapping two
   * parts that commute never costs a colour.
   */
  solutions: Bay[][];
}

const usesDivision = (chain: readonly Bay[]) =>
  chain.some((bay) => bay?.kind === "operator" && bay.operator === "divide");

/**
 * The solutions a player can be steered to: all five numbers, no division (the calculations
 * that bored: "les calculs sont trop complexes"). Without ÷ the running totals stay under 1,000
 * on their own; ÷ stays among the spares as a decoy.
 */
export function readableSolutions(numbers: readonly number[]): Bay[][] {
  return fullSolutions(numbers).filter((chain) => !usesDivision(chain));
}

/**
 * A draw with a readable solution. About a third of draws qualify (34 % of 2,000, six
 * solutions each on average), so 400 attempts all failing is out of reach in practice
 * (0.66^400); it still falls back on the example rather than loop.
 */
export function createPuzzle(random: () => number = Math.random, attempts = 400): Puzzle {
  for (let i = 0; i < attempts; i++) {
    const numbers = drawNumbers(random);
    const solutions = readableSolutions(numbers);
    if (solutions.length > 0) return { numbers, solutions };
  }
  return { numbers: [...FALLBACK_NUMBERS], solutions: readableSolutions(FALLBACK_NUMBERS) };
}

/** Where a plugged part stands against a solution: its bay, another bay, or nowhere. */
export type Feedback = "right" | "elsewhere" | "absent";

const tokenOf = (bay: Bay) =>
  bay === null ? null : bay.kind === "number" ? `n${bay.index}` : `o${bay.operator}`;

/**
 * Scores a run the way Tusmo scores a word: exact matches first, then each remaining part is
 * "elsewhere" as long as the solution still holds one of it (operators can repeat). Empty bays
 * get no score.
 */
export function scoreBays(bays: readonly Bay[], solution: readonly Bay[]): (Feedback | null)[] {
  const tokens = bays.map(tokenOf);
  const wanted = solution.map(tokenOf);
  const scores: (Feedback | null)[] = tokens.map((token, bay) =>
    token === null ? null : token === wanted[bay] ? "right" : "absent",
  );
  const left = new Map<string, number>();
  wanted.forEach((token, bay) => {
    if (token !== null && scores[bay] !== "right") left.set(token, (left.get(token) ?? 0) + 1);
  });
  tokens.forEach((token, bay) => {
    if (token === null || scores[bay] === "right") return;
    const count = left.get(token) ?? 0;
    if (count > 0) {
      scores[bay] = "elsewhere";
      left.set(token, count - 1);
    }
  });
  return scores;
}

const RANK: Record<Feedback, number> = { absent: 0, elsewhere: 1, right: 2 };
const total = (scores: readonly (Feedback | null)[]) =>
  scores.reduce((sum, score) => sum + (score === null ? 0 : 10 ** RANK[score]), 0);

/** Scores the bays against the solution they come closest to: most right, then most elsewhere. */
export function scoreNearest(bays: readonly Bay[], solutions: readonly Bay[][]) {
  let best: (Feedback | null)[] = scoreBays(bays, solutions[0] ?? EMPTY_BAYS);
  for (const solution of solutions.slice(1)) {
    const scores = scoreBays(bays, solution);
    if (total(scores) > total(best)) best = scores;
  }
  return best;
}

/** What the runs so far say about each spare: the best score it ever got, like Tusmo's keys. */
export function knowledgeOf(
  runs: readonly { bays: readonly Bay[]; scores: readonly (Feedback | null)[] }[],
) {
  const known = new Map<string, Feedback>();
  for (const { bays, scores } of runs) {
    bays.forEach((bay, index) => {
      const token = tokenOf(bay);
      const score = scores[index];
      if (token === null || score === null) return;
      const before = known.get(token);
      if (before === undefined || RANK[score] > RANK[before]) known.set(token, score);
    });
  }
  return {
    number: (index: number) => known.get(`n${index}`) ?? null,
    operator: (id: OperatorId) => known.get(`o${id}`) ?? null,
  };
}
