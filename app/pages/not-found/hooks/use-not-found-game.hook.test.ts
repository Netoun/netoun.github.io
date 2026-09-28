import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FALLBACK_NUMBERS } from "../data/not-found-puzzle";
import { LINE_INTERVAL_MS, useNotFoundGame } from "./use-not-found-game.hook";

// Every draw is the example: 32 − 8 × 19 − 42 − 10, 19 − 8 × 32 + 42 + 10 and their twins.
vi.mock("../data/not-found-puzzle", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../data/not-found-puzzle")>();
  const solutions = actual.fullSolutions(actual.FALLBACK_NUMBERS);
  return {
    ...actual,
    createPuzzle: () => ({ numbers: [...actual.FALLBACK_NUMBERS], solutions }),
  };
});

function setReducedMotion(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        addEventListener() {},
        removeEventListener() {},
      }) as unknown as MediaQueryList,
  );
}

// 42 10 32 8 19: 32 − 8 × 19 − 42 − 10 = 404
function plugWinningChain(game: ReturnType<typeof useNotFoundGame>) {
  game.plugNumber(2);
  game.plugOperator("subtract");
  game.plugNumber(3);
  game.plugOperator("multiply");
  game.plugNumber(4);
  game.plugOperator("subtract");
  game.plugNumber(0);
  game.plugOperator("subtract");
  game.plugNumber(1);
}

describe("useNotFoundGame", () => {
  beforeEach(() => setReducedMotion(false));
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("plugs each number once, into the next free bay of its kind", () => {
    const { result } = renderHook(() => useNotFoundGame());
    expect(result.current.numbers).toEqual([...FALLBACK_NUMBERS]);
    act(() => result.current.plugNumber(2));
    act(() => result.current.plugNumber(2));
    act(() => result.current.plugOperator("add"));
    act(() => result.current.plugNumber(0));
    expect(result.current.bays.slice(0, 4)).toEqual([
      { kind: "number", index: 2 },
      { kind: "operator", operator: "add" },
      { kind: "number", index: 0 },
      null,
    ]);
    expect(result.current.placedAt).toEqual([2, -1, 0, -1, -1]);
  });

  it("types the run line by line, then lights the chain", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useNotFoundGame());
    act(() => plugWinningChain(result.current));
    act(() => result.current.power());
    expect(result.current.phase).toBe("running");
    expect(result.current.lines).toHaveLength(0);

    act(() => vi.advanceTimersByTime(LINE_INTERVAL_MS * 2));
    expect(result.current.lines).toHaveLength(2);
    expect(result.current.leds[2]).toBe("active");

    act(() => vi.advanceTimersByTime(LINE_INTERVAL_MS * 10));
    expect(result.current.phase).toBe("won");
    expect(result.current.acc).toBe(404);
    expect(result.current.leds).toEqual(Array(9).fill("won"));
    expect(result.current.result).toBe("404 reached in 1 try: the count is right.");
  });

  it("prints the whole run at once under reduced motion", () => {
    setReducedMotion(true);
    const { result } = renderHook(() => useNotFoundGame());
    act(() => result.current.plugNumber(0));
    act(() => result.current.plugOperator("divide"));
    act(() => result.current.plugNumber(3));
    act(() => result.current.power());
    expect(result.current.phase).toBe("failed");
    expect(result.current.leds[2]).toBe("fault");
    expect(result.current.result).toBe(
      "Try 1: 1 in the right bay, 1 elsewhere, 1 not in the solution. Stopped at U3: EDIV 42 ÷ 8 is not whole.",
    );
  });

  it("scores each bay against the nearest solution, like Tusmo, and remembers it on the spares", () => {
    setReducedMotion(true);
    const { result } = renderHook(() => useNotFoundGame());
    act(() => result.current.plugNumber(3)); // 8: every solution has it in U3
    act(() => result.current.plugOperator("subtract")); // U2 is SUB in every solution
    act(() => result.current.plugNumber(2)); // 32: in U1 or U5, never U3
    act(() => result.current.power());
    expect(result.current.leds.slice(0, 3)).toEqual(["elsewhere", "right", "elsewhere"]);
    expect(result.current.numberKnowledge[3]).toBe("elsewhere");
    expect(result.current.operatorKnowledge("subtract")).toBe("right");
    expect(result.current.operatorKnowledge("add")).toBeNull();

    act(() => result.current.ejectAll());
    act(() => result.current.plugNumber(2));
    act(() => result.current.power());
    expect(result.current).toMatchObject({ tries: 2 });
    expect(result.current.history).toHaveLength(1);
    expect(result.current.numberKnowledge[2]).toBe("right");
  });

  it("computes as the bays fill, and says when they already make 404", () => {
    const { result } = renderHook(() => useNotFoundGame());
    act(() => result.current.plugNumber(2)); // 32
    act(() => result.current.plugOperator("subtract"));
    act(() => result.current.plugNumber(3)); // − 8
    expect(result.current.acc).toBe(24);
    expect(result.current.totals.slice(0, 3)).toEqual([32, null, 24]);
    expect(result.current.isReady).toBe(false);

    act(() => result.current.plugOperator("multiply"));
    act(() => result.current.plugNumber(4)); // × 19
    act(() => result.current.plugOperator("subtract"));
    act(() => result.current.plugNumber(0)); // − 42
    act(() => result.current.plugOperator("subtract"));
    act(() => result.current.plugNumber(1)); // − 10
    expect(result.current.acc).toBe(404);
    expect(result.current.isReady).toBe(true);
  });

  it("flags a division that does not fall exact before power", () => {
    const { result } = renderHook(() => useNotFoundGame());
    act(() => result.current.plugNumber(0)); // 42
    act(() => result.current.plugOperator("divide"));
    act(() => result.current.plugNumber(3)); // ÷ 8
    expect(result.current).toMatchObject({ liveFault: true, acc: null });
  });

  it("plugs the same operator three times at most", () => {
    const { result } = renderHook(() => useNotFoundGame());
    for (let i = 0; i < 4; i++) act(() => result.current.plugOperator("multiply"));
    expect(result.current.bays.filter((bay) => bay?.kind === "operator")).toHaveLength(3);
    expect(result.current.operatorsLeft("multiply")).toBe(0);
    expect(result.current.operatorsLeft("add")).toBe(3);
  });

  it("keeps the last run, dimmed, once a rack moves", () => {
    setReducedMotion(true);
    const { result } = renderHook(() => useNotFoundGame());
    act(() => result.current.plugNumber(0));
    act(() => result.current.power());
    act(() => result.current.eject(0));
    expect(result.current).toMatchObject({ phase: "idle", stale: true, hasRun: true });
    act(() => result.current.ejectAll());
    expect(result.current.bays.every((bay) => bay === null)).toBe(true);
  });

  it("starts over on a new draw", () => {
    const { result } = renderHook(() => useNotFoundGame());
    act(() => result.current.plugNumber(0));
    act(() => result.current.reroll());
    expect(result.current).toMatchObject({ draw: 2, hasRun: false, phase: "idle" });
    expect(result.current.bays.every((bay) => bay === null)).toBe(true);
  });
});
