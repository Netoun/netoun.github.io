import { useEffect, useReducer } from "react";
import {
  type Bay,
  createPuzzle,
  EMPTY_BAYS,
  evaluateChain,
  type Feedback,
  knowledgeOf,
  MAX_SAME_OPERATOR,
  NUMBER_BAYS,
  operatorCounts,
  OPERATOR_BAYS,
  type OperatorId,
  type Puzzle,
  type Run,
  type RunLine,
  scoreNearest,
} from "../data/not-found-puzzle";

/** Pace of the console: one line of the run per tick. */
export const LINE_INTERVAL_MS = 460;

export type GamePhase = "idle" | "running" | "won" | "failed";
/**
 * What a bay's LED shows: empty, resting, the step being computed, the fault, a win, or once a
 * run has printed, how its part scored against the nearest solution (Tusmo's colours).
 */
export type BayLed = "off" | "rest" | "active" | "fault" | "won" | Feedback;

/** One press of power: the bays as they were, what the server printed, how each bay scored. */
export interface Attempt {
  /** 1 for the draw's first run. */
  number: number;
  bays: Bay[];
  run: Run;
  scores: (Feedback | null)[];
}

interface GameState {
  numbers: number[];
  solutions: Bay[][];
  bays: Bay[];
  attempts: Attempt[];
  /** Lines of the run already printed. */
  shown: number;
  phase: GamePhase;
  /** The racks moved since the last run: its output is kept, dimmed. */
  stale: boolean;
  /** Draws this visit, from 1. */
  draw: number;
}

type Action =
  | { type: "plugNumber"; index: number }
  | { type: "plugOperator"; operator: OperatorId }
  | { type: "eject"; bay: number }
  | { type: "ejectAll" }
  | { type: "reroll"; puzzle: Puzzle }
  | { type: "power"; instant: boolean }
  | { type: "tick" };

const lastRun = (state: GameState) => state.attempts.at(-1)?.run ?? null;

function edit(state: GameState, bays: Bay[]): GameState {
  return { ...state, bays, phase: "idle", stale: state.attempts.length > 0 };
}

function plug(state: GameState, slots: readonly number[], bay: Bay): GameState {
  const free = slots.find((slot) => state.bays[slot] === null);
  if (free === undefined) return state;
  const bays = state.bays.slice();
  bays[free] = bay;
  return edit(state, bays);
}

function done(run: Run): GamePhase {
  return run.ok ? "won" : "failed";
}

function gameReducer(state: GameState, action: Action): GameState {
  if (state.phase === "running" && action.type !== "tick" && action.type !== "reroll") {
    return state;
  }
  switch (action.type) {
    case "plugNumber": {
      const inUse = state.bays.some((bay) => bay?.kind === "number" && bay.index === action.index);
      return inUse ? state : plug(state, NUMBER_BAYS, { kind: "number", index: action.index });
    }
    case "plugOperator": {
      const used = operatorCounts(state.bays)[action.operator];
      if (used >= MAX_SAME_OPERATOR) return state;
      return plug(state, OPERATOR_BAYS, { kind: "operator", operator: action.operator });
    }
    case "eject": {
      if (state.bays[action.bay] === null) return state;
      const bays = state.bays.slice();
      bays[action.bay] = null;
      return edit(state, bays);
    }
    case "ejectAll":
      return state.bays.some(Boolean) ? edit(state, EMPTY_BAYS.slice()) : state;
    case "reroll":
      return initialState(action.puzzle, state.draw + 1);
    case "power": {
      if (state.phase === "won") return state;
      const run = evaluateChain(state.bays, state.numbers);
      const attempt = {
        number: state.attempts.length + 1,
        bays: state.bays,
        run,
        scores: scoreNearest(state.bays, state.solutions),
      };
      const attempts = [...state.attempts, attempt];
      if (action.instant) {
        return { ...state, attempts, shown: run.lines.length, phase: done(run), stale: false };
      }
      return { ...state, attempts, shown: 0, phase: "running", stale: false };
    }
    case "tick": {
      const run = lastRun(state);
      if (state.phase !== "running" || run === null) return state;
      const shown = state.shown + 1;
      return shown >= run.lines.length
        ? { ...state, shown: run.lines.length, phase: done(run) }
        : { ...state, shown };
    }
    default:
      return state;
  }
}

function initialState({ numbers, solutions }: Puzzle, draw = 1): GameState {
  return {
    numbers,
    solutions,
    bays: EMPTY_BAYS.slice(),
    attempts: [],
    shown: 0,
    phase: "idle",
    stale: false,
    draw,
  };
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

const tries = (count: number) => `${count} ${count === 1 ? "try" : "tries"}`;

function describeScores(scores: readonly (Feedback | null)[]) {
  const count = (score: Feedback) => scores.filter((s) => s === score).length;
  return `${count("right")} in the right bay, ${count("elsewhere")} elsewhere, ${count("absent")} not in the solution`;
}

function describeResult(phase: GamePhase, attempts: readonly Attempt[]) {
  const attempt = attempts.at(-1);
  if (attempt === undefined) return "";
  if (phase === "won") return `404 reached in ${tries(attempts.length)}: the count is right.`;
  if (phase !== "failed") return "";
  const { run, scores } = attempt;
  const head = `Try ${attempts.length}: ${describeScores(scores)}.`;
  const error = run.lines.find((line) => line.kind === "error");
  if (error?.kind === "error") return `${head} Stopped at U${error.bay + 1}: ${error.text}.`;
  if (run.acc === null) return head;
  const gap = Math.abs(run.acc - 404);
  return `${head} The server reached ${run.acc}, ${gap} ${run.acc < 404 ? "short of" : "over"} 404.`;
}

/**
 * The 404 game's state: the draw and its solutions, the bays, every run so far and the one the
 * console is printing. Rendered on the client only (the 404 is the SPA fallback), so the first
 * draw can be random.
 */
export function useNotFoundGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => initialState(createPuzzle()));
  const { numbers, bays, attempts, shown, phase, stale, draw } = state;
  const run = lastRun(state);
  const last = attempts.at(-1);
  // A run's scores show once it has printed, like Tusmo turning its tiles.
  const scored = phase === "running" ? attempts.slice(0, -1) : attempts;
  const known = knowledgeOf(scored);

  useEffect(() => {
    if (phase !== "running") return;
    const timer = window.setInterval(() => dispatch({ type: "tick" }), LINE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [phase]);

  const lines: RunLine[] = run ? run.lines.slice(0, shown) : [];
  const lastStep = lines.findLast((line) => line.kind === "step");

  // The rack computes as it is filled: every number bay shows the total so far, so nobody has
  // to do the sums in their head ("on s'ennuie, les calculs sont trop complexes").
  const live = evaluateChain(bays, numbers);
  const liveSteps = live.lines.filter((line) => line.kind === "step");
  const liveFault = live.lines.some(
    (line) => line.kind === "error" && line.text.startsWith("EDIV"),
  );
  const liveAcc = liveFault ? null : (liveSteps.at(-1)?.acc ?? null);
  const chain = new Set<number>();
  if (phase === "won" && run) {
    for (const line of run.lines) {
      if (line.kind === "step") {
        chain.add(line.bay);
        if (line.bay > 0) chain.add(line.bay - 1);
      }
    }
  }
  const ledOf = (bay: number): BayLed => {
    const part = bays[bay];
    if (part === null) return "off";
    if (phase === "running") {
      return lastStep && (lastStep.bay === bay || lastStep.bay - 1 === bay) ? "active" : "rest";
    }
    if (chain.has(bay)) return "won";
    if (phase === "failed" && run?.failAt === bay) return "fault";
    // The last run's score, while the bay still holds the part it scored.
    const before = last?.bays[bay];
    const same =
      before !== undefined &&
      before !== null &&
      before.kind === part.kind &&
      (part.kind === "number"
        ? before.kind === "number" && before.index === part.index
        : before.kind === "operator" && before.operator === part.operator);
    return (same && last?.scores[bay]) || "rest";
  };

  return {
    numbers,
    bays,
    leds: bays.map((_, bay) => ledOf(bay)),
    /** For each number of the draw, the bay it sits in, or -1. */
    placedAt: numbers.map((_, index) =>
      bays.findIndex((bay) => bay?.kind === "number" && bay.index === index),
    ),
    /** What the runs so far say about each spare (`null`: never scored). */
    numberKnowledge: numbers.map((_, index) => known.number(index)),
    operatorKnowledge: known.operator,
    /** Plugs left for each operator (at most `MAX_SAME_OPERATOR` of one in the bays). */
    operatorsLeft: (id: OperatorId) => MAX_SAME_OPERATOR - operatorCounts(bays)[id],
    numbersFull: NUMBER_BAYS.every((bay) => bays[bay] !== null),
    operatorsFull: OPERATOR_BAYS.every((bay) => bays[bay] !== null),
    hasRun: run !== null,
    /** Every run before the one on screen, for the console's history. */
    history: attempts.slice(0, -1),
    /** How the run on screen scored, bay by bay. */
    scores: last?.scores ?? [],
    tries: attempts.length,
    lines,
    phase,
    stale,
    draw,
    /** What the ACC display shows: the total being printed, or the live one while building. */
    acc: phase === "running" ? (lastStep?.acc ?? null) : liveAcc,
    /** The total after each number bay, live (`null` for operators, gaps and past a fault). */
    totals: bays.map((_, bay) => liveSteps.find((step) => step.bay === bay)?.acc ?? null),
    /** The bays as they stand already make 404: only power is left to press. */
    isReady: phase !== "running" && phase !== "won" && live.ok,
    liveFault,
    result: describeResult(phase, attempts),
    plugNumber: (index: number) => dispatch({ type: "plugNumber", index }),
    plugOperator: (operator: OperatorId) => dispatch({ type: "plugOperator", operator }),
    eject: (bay: number) => dispatch({ type: "eject", bay }),
    ejectAll: () => dispatch({ type: "ejectAll" }),
    reroll: () => dispatch({ type: "reroll", puzzle: createPuzzle() }),
    power: () => dispatch({ type: "power", instant: prefersReducedMotion() }),
  };
}

export type NotFoundGame = ReturnType<typeof useNotFoundGame>;
