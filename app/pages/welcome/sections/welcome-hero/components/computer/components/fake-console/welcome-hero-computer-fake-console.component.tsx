import { useEffect, useReducer, useRef, useState, useCallback } from "react";
import * as styles from "./welcome-hero-computer-fake-console.css";

export interface WelcomeHeroComputerFakeConsoleProps {
  isAnimating: boolean;
  className?: string;
}

const INITIAL_ROWS_COUNT = 10;
const MIN_ROWS_COUNT = 6;
const MAX_ROWS_COUNT = 30;

const TOKENS_A = ["PROCESS", "GRID", "SYNC", "ION", "RET", "NODE", "CORE", "MUX"];
const TOKENS_B = ["ONLINE", "IDLE", "TRACE", "LOCK", "FLOW", "READY", "SHIFT", "LINK"];
const HEX = "0123456789ABCDEF";

const lcg = (seed: number) => (seed * 1664525 + 1013904223) >>> 0;

const intFromSeed = (seed: number, max: number): [number, number] => {
  const next = lcg(seed);
  return [next % max, next];
};

const hexChunk = (seed: number, size: number): [string, number] => {
  let current = seed;
  let value = "";
  for (let index = 0; index < size; index += 1) {
    const [digit, next] = intFromSeed(current, HEX.length);
    value += HEX[digit];
    current = next;
  }
  return [value, current];
};

const generateLine = (seed: number): [string, number] => {
  let current = seed;
  const [leftIdx, seedA] = intFromSeed(current, TOKENS_A.length);
  const [rightIdx, seedB] = intFromSeed(seedA, TOKENS_B.length);
  const [progress, seedC] = intFromSeed(seedB, 100);
  const [shortHex, seedD] = hexChunk(seedC, 4);
  const [shortHexTail, nextSeed] = hexChunk(seedD, 3);

  const line = `${TOKENS_A[leftIdx]} ${String(leftIdx + 1).padStart(2, "0")}  ${TOKENS_B[rightIdx]} ${String(progress).padStart(2, "0")}%  ${shortHex}-${shortHexTail}`;
  return [line, nextSeed];
};

const createLines = (seed: number, count: number): [string[], number] => {
  const lines: string[] = [];
  let current = seed;

  for (let index = 0; index < count; index += 1) {
    const [line, next] = generateLine(current);
    lines.push(line);
    current = next;
  }

  return [lines, current];
};

interface ConsoleState {
  lines: string[];
  seed: number;
  pendingLine: string | null;
  isShifting: boolean;
}

type ConsoleAction =
  | { type: "INIT"; lines: string[]; seed: number }
  | { type: "TICK" }
  | { type: "SHIFT" }
  | { type: "RESIZE"; rowsCount: number }
  | { type: "STOP" };

function consoleReducer(state: ConsoleState, action: ConsoleAction): ConsoleState {
  switch (action.type) {
    case "INIT":
      return { ...state, lines: action.lines, seed: action.seed };
    case "TICK": {
      const [newLine, nextSeed] = generateLine(state.seed);
      return { ...state, seed: nextSeed, pendingLine: newLine, isShifting: true };
    }
    case "SHIFT": {
      if (!state.pendingLine) return state;
      return {
        ...state,
        lines: [...state.lines.slice(1), state.pendingLine],
        pendingLine: null,
        isShifting: false,
      };
    }
    case "RESIZE": {
      const { rowsCount } = action;
      if (state.lines.length === rowsCount) return state;
      if (state.lines.length > rowsCount) {
        return { ...state, lines: state.lines.slice(state.lines.length - rowsCount) };
      }
      const missingCount = rowsCount - state.lines.length;
      const [newLines, nextSeed] = createLines(state.seed, missingCount);
      return { ...state, lines: [...state.lines, ...newLines], seed: nextSeed };
    }
    case "STOP":
      return { ...state, pendingLine: null, isShifting: false };
    default:
      return state;
  }
}

const initialConsoleState: ConsoleState = {
  lines: [],
  seed: 0x1a2b3c4d,
  pendingLine: null,
  isShifting: false,
};

export function WelcomeHeroComputerFakeConsole({
  isAnimating,
  className,
}: WelcomeHeroComputerFakeConsoleProps) {
  const [rowsCount, setRowsCount] = useState(INITIAL_ROWS_COUNT);
  const [{ lines, pendingLine, isShifting }, dispatch] = useReducer(
    consoleReducer,
    initialConsoleState,
    () => {
      const [initialLines, initialSeed] = createLines(0x1a2b3c4d, INITIAL_ROWS_COUNT);
      return { lines: initialLines, seed: initialSeed, pendingLine: null, isShifting: false };
    },
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const shiftDistanceRef = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setPrefersReducedMotion(mediaQuery.matches);

    updateMotion();
    mediaQuery.addEventListener("change", updateMotion);

    return () => {
      mediaQuery.removeEventListener("change", updateMotion);
    };
  }, []);

  // Cache for line height - initialized once
  const lineHeightRef = useRef(12);
  const rafIdRef = useRef<number | null>(null);
  const shiftRafIdRef = useRef<number | null>(null);

  const calculateLineHeight = useCallback((lineElement: Element): number => {
    const computed = window.getComputedStyle(lineElement);
    const parsedLineHeight = Number.parseFloat(computed.lineHeight);
    return Number.isFinite(parsedLineHeight) && parsedLineHeight > 0 ? parsedLineHeight : 12;
  }, []);

  useEffect(() => {
    const rootElement = rootRef.current;
    if (!rootElement) return;

    const lineGap = 2;

    const updateRowsCount = (height: number) => {
      const nextRowsCount = Math.max(
        MIN_ROWS_COUNT,
        Math.min(MAX_ROWS_COUNT, Math.floor(height / (lineHeightRef.current + lineGap)) + 2),
      );

      setRowsCount((previousRowsCount) => {
        return previousRowsCount === nextRowsCount ? previousRowsCount : nextRowsCount;
      });
    };

    // Batch DOM reads in requestAnimationFrame
    const initializeLayout = () => {
      rafIdRef.current = requestAnimationFrame(() => {
        const lineElement = rootElement.querySelector("p");
        if (lineElement) {
          lineHeightRef.current = calculateLineHeight(lineElement);
        }
        updateRowsCount(rootElement.clientHeight);
      });
    };

    initializeLayout();

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      // Batch resize in RAF as well
      rafIdRef.current = requestAnimationFrame(() => {
        updateRowsCount(entry.contentRect.height);
      });
    });
    resizeObserver.observe(rootElement);

    return () => {
      resizeObserver.disconnect();
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [calculateLineHeight]);

  useEffect(() => {
    dispatch({ type: "RESIZE", rowsCount });
  }, [rowsCount]);

  const rootClassName = className ? `${styles.rootStyles} ${className}` : styles.rootStyles;

  const shouldReelAnimate = isAnimating && !prefersReducedMotion;

  // Cache for shift distance - recalculated only when necessary
  const cachedShiftDistanceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldReelAnimate || isShifting) return;

    // Recalculate shift distance only if not cached
    if (cachedShiftDistanceRef.current === null) {
      const lineElement = reelRef.current?.querySelector("p");
      if (lineElement) {
        // Batch in RAF to avoid forced reflow
        shiftRafIdRef.current = requestAnimationFrame(() => {
          const lineHeight = lineElement.getBoundingClientRect().height;
          cachedShiftDistanceRef.current = lineHeight + 2;
          shiftDistanceRef.current = cachedShiftDistanceRef.current;
        });
      }
    } else {
      shiftDistanceRef.current = cachedShiftDistanceRef.current;
    }

    // Increased tick interval from 340ms to 500ms to reduce main thread work
    const tick = window.setTimeout(() => {
      dispatch({ type: "TICK" });
    }, 500);

    return () => {
      window.clearTimeout(tick);
      if (shiftRafIdRef.current) {
        cancelAnimationFrame(shiftRafIdRef.current);
        shiftRafIdRef.current = null;
      }
    };
  }, [shouldReelAnimate, isShifting]);

  useEffect(() => {
    if (!isShifting) return;

    const finishShift = window.setTimeout(() => {
      dispatch({ type: "SHIFT" });
    }, 250);

    return () => {
      window.clearTimeout(finishShift);
    };
  }, [isShifting, pendingLine]);

  useEffect(() => {
    if (shouldReelAnimate) return;
    dispatch({ type: "STOP" });
    // Reset cache when animation stops to allow recalculation on next start
    cachedShiftDistanceRef.current = null;
  }, [shouldReelAnimate]);

  const renderLines = pendingLine ? [...lines, pendingLine] : lines;

  const reelDataAnimating = shouldReelAnimate ? "true" : "false";

  useEffect(() => {
    if (!shouldReelAnimate) {
      shiftDistanceRef.current = 0;
    }
  }, [shouldReelAnimate]);

  useEffect(() => {
    return () => {
      dispatch({ type: "STOP" });
      shiftDistanceRef.current = 0;
      cachedShiftDistanceRef.current = null;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={rootClassName}
      data-reduced-motion={prefersReducedMotion}
      aria-hidden="true"
    >
      <div className={styles.noiseOverlayStyles} />
      <div className={styles.scanlineStyles} />
      <div className={styles.bottomRevealStyles} />

      <div className={styles.linesWrapperStyles}>
        <div
          ref={reelRef}
          className={styles.reelStyles}
          data-animating={reelDataAnimating}
          data-shifting={isShifting ? "true" : "false"}
        >
          {renderLines.map((line, index) => {
            const isDim = index < rowsCount - 3;
            return (
              <p key={line} className={styles.lineStyles} data-dim={isDim}>
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
