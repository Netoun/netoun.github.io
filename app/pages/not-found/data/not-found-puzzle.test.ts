import { describe, expect, it } from "vitest";
import {
  type Bay,
  createPuzzle,
  drawNumbers,
  EMPTY_BAYS,
  evaluateChain,
  FALLBACK_NUMBERS,
  fullSolutions,
  knowledgeOf,
  MAX_SAME_OPERATOR,
  operatorCounts,
  readableSolutions,
  scoreBays,
  scoreNearest,
  TARGET,
} from "./not-found-puzzle";

const n = (index: number): Bay => ({ kind: "number", index });
const add: Bay = { kind: "operator", operator: "add" };
const sub: Bay = { kind: "operator", operator: "subtract" };
const mul: Bay = { kind: "operator", operator: "multiply" };
const div: Bay = { kind: "operator", operator: "divide" };
const bays = (...plugged: Bay[]) => [...plugged, ...EMPTY_BAYS].slice(0, 9);

// A seeded generator (mulberry32), so the draws are the same on every run.
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("evaluateChain", () => {
  const numbers = [...FALLBACK_NUMBERS]; // 42 10 32 8 19

  it("reads the bays top to bottom as an accumulator", () => {
    // 32 − 8 = 24, × 19 = 456, − 42 = 414, − 10 = 404
    const run = evaluateChain(bays(n(2), sub, n(3), mul, n(4), sub, n(0), sub, n(1)), numbers);
    expect(run.ok).toBe(true);
    expect(run.acc).toBe(TARGET);
    expect(run.lines.filter((line) => line.kind === "step").map((line) => line.acc)).toEqual([
      32, 24, 456, 414, 404,
    ]);
  });

  it("reports the total it reached when it misses", () => {
    const run = evaluateChain(bays(n(0), mul, n(1), sub, n(2), add, n(3)), numbers);
    expect(run).toMatchObject({ ok: false, acc: 396, failAt: null });
    expect(run.lines.at(-1)).toEqual({ kind: "result", acc: 396, ok: false });
  });

  it("stops on a division that does not fall exact", () => {
    const run = evaluateChain(bays(n(0), div, n(3)), numbers);
    expect(run).toMatchObject({ ok: false, acc: null, failAt: 2 });
    expect(run.lines.at(-1)).toEqual({ kind: "error", bay: 2, text: "EDIV 42 ÷ 8 is not whole" });
  });

  it("stops on an operator with no number under it", () => {
    const run = evaluateChain(bays(n(0), add, null, sub, n(1)), numbers);
    expect(run).toMatchObject({ ok: false, failAt: 2 });
  });

  it("needs a number in U1", () => {
    expect(evaluateChain(EMPTY_BAYS, numbers)).toMatchObject({ ok: false, failAt: 0 });
  });

  it("warns when a gap cuts the chain short", () => {
    const run = evaluateChain(bays(n(0), null, n(1)), numbers);
    expect(run.lines.some((line) => line.kind === "warn" && line.bay === 1)).toBe(true);
    expect(run.acc).toBe(42);
  });
});

describe("fullSolutions", () => {
  it("finds every chain of all five numbers that reaches 404", () => {
    const solutions = fullSolutions(FALLBACK_NUMBERS);
    expect(solutions).toHaveLength(4);
    for (const chain of solutions) {
      expect(evaluateChain(chain, FALLBACK_NUMBERS).ok).toBe(true);
      expect(chain.filter((bay) => bay?.kind === "number")).toHaveLength(5);
    }
  });

  it("answers none when no chain reaches the target", () => {
    expect(fullSolutions([2, 3, 11, 13, 17])).toEqual([]);
  });
});

describe("scoreBays", () => {
  // Secret: 32 − 8 × 19 − 42 − 10
  const secret = bays(n(2), sub, n(3), mul, n(4), sub, n(0), sub, n(1));

  it("marks a part in its bay, in another bay, or not in the solution", () => {
    const scores = scoreBays(bays(n(3), sub, n(2), add, n(4)), secret);
    expect(scores).toEqual([
      "elsewhere",
      "right",
      "elsewhere",
      "absent",
      "right",
      null,
      null,
      null,
      null,
    ]);
  });

  it("counts a repeated operator only as often as the secret holds it", () => {
    // The secret has three SUB and one MUL: four MUL, one right and three with nowhere left.
    const scores = scoreBays(bays(n(2), mul, n(3), mul, n(4), mul, n(0), mul, n(1)), secret);
    expect(scores.filter((score) => score === "right")).toHaveLength(6);
    expect(scores.filter((score) => score === "absent")).toHaveLength(3);
  });

  it("scores against the nearest solution, so parts that commute can swap", () => {
    // 42 10 32 8 19 has 19 − 8 × 32 + 42 + 10 and its twin ending + 10 + 42.
    const solutions = fullSolutions(FALLBACK_NUMBERS);
    const twin = bays(n(4), sub, n(3), mul, n(2), add, n(1), add, n(0));
    expect(scoreNearest(twin, solutions).every((score) => score === "right")).toBe(true);
  });

  it("keeps the best score each spare ever got", () => {
    const first = bays(n(3), add, n(2));
    const second = bays(n(2), add, n(4));
    const known = knowledgeOf([
      { bays: first, scores: scoreBays(first, secret) },
      { bays: second, scores: scoreBays(second, secret) },
    ]);
    expect(known.number(2)).toBe("right");
    expect(known.number(3)).toBe("elsewhere");
    expect(known.operator("add")).toBe("absent");
    expect(known.operator("divide")).toBeNull();
  });
});

describe("createPuzzle", () => {
  it("draws two numbers in 2–10 and three in 11–50, all distinct", () => {
    const numbers = drawNumbers(seeded(1));
    expect(numbers).toHaveLength(5);
    expect(new Set(numbers).size).toBe(5);
    expect(numbers.filter((x) => x >= 2 && x <= 10)).toHaveLength(2);
    expect(numbers.filter((x) => x >= 11 && x <= 50)).toHaveLength(3);
  });

  it("keeps solutions that use all five numbers, reach 404 and repeat no operator 4 times", () => {
    for (let seed = 0; seed < 200; seed++) {
      const { numbers, solutions } = createPuzzle(seeded(seed));
      expect(solutions.length).toBeGreaterThan(0);
      for (const solution of solutions) {
        expect(evaluateChain(solution, numbers).acc).toBe(TARGET);
        expect(solution.every((bay) => bay !== null)).toBe(true);
        const counts = operatorCounts(solution);
        expect(Math.max(...Object.values(counts))).toBeLessThanOrEqual(MAX_SAME_OPERATOR);
        expect(counts.divide).toBe(0);
      }
    }
  });

  it("falls back on the example when no draw can be solved", () => {
    const { numbers, solutions } = createPuzzle(seeded(7), 0);
    expect(numbers).toEqual([...FALLBACK_NUMBERS]);
    expect(solutions).toEqual(readableSolutions(FALLBACK_NUMBERS));
  });
});
