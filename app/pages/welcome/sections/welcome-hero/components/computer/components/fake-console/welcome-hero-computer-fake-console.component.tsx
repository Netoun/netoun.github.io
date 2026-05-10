import { useEffect, useMemo, useRef, useState } from "react";
import * as styles from "./welcome-hero-computer-fake-console.css";

export interface WelcomeHeroComputerFakeConsoleProps {
  isAnimating: boolean;
  className?: string;
}

const INITIAL_ROWS_COUNT = 10;
const MIN_ROWS_COUNT = 6;
const MAX_ROWS_COUNT = 30;

const TOKENS_A = [
  "PROCESS",
  "GRID",
  "SYNC",
  "ION",
  "RET",
  "NODE",
  "CORE",
  "MUX",
];
const TOKENS_B = [
  "ONLINE",
  "IDLE",
  "TRACE",
  "LOCK",
  "FLOW",
  "READY",
  "SHIFT",
  "LINK",
];
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

export const WelcomeHeroComputerFakeConsole = ({
  isAnimating,
  className,
}: WelcomeHeroComputerFakeConsoleProps) => {
  const [rowsCount, setRowsCount] = useState(INITIAL_ROWS_COUNT);
  const [{ lines }, setConsoleState] = useState(() => {
    const [initialLines, initialSeed] = createLines(
      0x1a2b3c4d,
      INITIAL_ROWS_COUNT,
    );
    return { lines: initialLines, seed: initialSeed };
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const [pendingLine, setPendingLine] = useState<string | null>(null);
  const [isShifting, setIsShifting] = useState(false);
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

  useEffect(() => {
    const rootElement = rootRef.current;
    if (!rootElement) return;

    const updateRowsCount = () => {
      const lineElement = rootElement.querySelector("p");
      const measuredLineHeight =
        lineElement?.getBoundingClientRect().height ?? 12;
      const lineGap = 2;
      const nextRowsCount = Math.max(
        MIN_ROWS_COUNT,
        Math.min(
          MAX_ROWS_COUNT,
          Math.floor(
            rootElement.clientHeight / (measuredLineHeight + lineGap),
          ) + 2,
        ),
      );

      setRowsCount((previousRowsCount) => {
        return previousRowsCount === nextRowsCount
          ? previousRowsCount
          : nextRowsCount;
      });
    };

    updateRowsCount();
    const resizeObserver = new ResizeObserver(updateRowsCount);
    resizeObserver.observe(rootElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    setConsoleState((previousState) => {
      if (previousState.lines.length === rowsCount) return previousState;

      if (previousState.lines.length > rowsCount) {
        return {
          lines: previousState.lines.slice(
            previousState.lines.length - rowsCount,
          ),
          seed: previousState.seed,
        };
      }

      const missingLinesCount = rowsCount - previousState.lines.length;
      const [newLines, nextSeed] = createLines(
        previousState.seed,
        missingLinesCount,
      );

      return {
        lines: [...previousState.lines, ...newLines],
        seed: nextSeed,
      };
    });
  }, [rowsCount]);

  const rootClassName = useMemo(() => {
    return className ? `${styles.rootStyles} ${className}` : styles.rootStyles;
  }, [className]);

  const shouldReelAnimate = isAnimating && !prefersReducedMotion;

  useEffect(() => {
    if (!shouldReelAnimate || isShifting) return;

    const lineElement = reelRef.current?.querySelector("p");
    if (lineElement) {
      const lineHeight = lineElement.getBoundingClientRect().height;
      shiftDistanceRef.current = lineHeight + 2;
    }

    const tick = window.setTimeout(() => {
      setConsoleState((previousState) => {
        const [newLine, nextSeed] = generateLine(previousState.seed);
        setPendingLine(newLine);
        setIsShifting(true);
        return {
          lines: previousState.lines,
          seed: nextSeed,
        };
      });
    }, 340);

    return () => {
      window.clearTimeout(tick);
    };
  }, [shouldReelAnimate, isShifting]);

  useEffect(() => {
    if (!isShifting) return;

    const finishShift = window.setTimeout(() => {
      setConsoleState((previousState) => {
        if (!pendingLine) return previousState;
        return {
          lines: [...previousState.lines.slice(1), pendingLine],
          seed: previousState.seed,
        };
      });
      setPendingLine(null);
      setIsShifting(false);
    }, 250);

    return () => {
      window.clearTimeout(finishShift);
    };
  }, [isShifting, pendingLine]);

  useEffect(() => {
    if (shouldReelAnimate) return;
    setPendingLine(null);
    setIsShifting(false);
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
      setPendingLine(null);
      setIsShifting(false);
      shiftDistanceRef.current = 0;
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
              <p
                key={`${line}-${index}`}
                className={styles.lineStyles}
                data-dim={isDim}
              >
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};
