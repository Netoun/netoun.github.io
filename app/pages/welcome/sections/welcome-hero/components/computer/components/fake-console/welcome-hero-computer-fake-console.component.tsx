import { memo, useEffect, useMemo, useRef } from "react";
import * as styles from "./welcome-hero-computer-fake-console.css";

export interface WelcomeHeroComputerFakeConsoleProps {
  isAnimating: boolean;
  className?: string;
}

const INITIAL_ROWS_COUNT = 10;
const MIN_ROWS_COUNT = 6;
const MAX_ROWS_COUNT = 30;
const EXTRA_PENDING_ROW = 1;

const LINE_GAP = 2;
const TICK_INTERVAL_MS = 500;
const SHIFT_DURATION_MS = 250;

const INITIAL_SEED = 0x1a2b3c4d;

const TOKENS_A = ["PROCESS", "GRID", "SYNC", "ION", "RET", "NODE", "CORE", "MUX"];
const TOKENS_B = ["ONLINE", "IDLE", "TRACE", "LOCK", "FLOW", "READY", "SHIFT", "LINK"];
const HEX = "0123456789ABCDEF";

const TOKEN_A_LABELS = TOKENS_A.map(
  (token, index) => `${token} ${String(index + 1).padStart(2, "0")}`,
);

const PERCENT_LABELS = Array.from(
  { length: 100 },
  (_, index) => `${String(index).padStart(2, "0")}%`,
);

const HIDDEN_LINE_STYLE = { display: "none" } as const;

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
  const [leftIdx, seedA] = intFromSeed(seed, TOKEN_A_LABELS.length);
  const [rightIdx, seedB] = intFromSeed(seedA, TOKENS_B.length);
  const [progress, seedC] = intFromSeed(seedB, PERCENT_LABELS.length);
  const [shortHex, seedD] = hexChunk(seedC, 4);
  const [shortHexTail, nextSeed] = hexChunk(seedD, 3);

  return [
    `${TOKEN_A_LABELS[leftIdx]}  ${TOKENS_B[rightIdx]} ${PERCENT_LABELS[progress]}  ${shortHex}-${shortHexTail}`,
    nextSeed,
  ];
};

const createLines = (seed: number, count: number): [string[], number] => {
  // oxlint-disable-next-line unicorn/no-new-array
  const lines = new Array<string>(count);
  let current = seed;

  for (let index = 0; index < count; index += 1) {
    const [line, next] = generateLine(current);
    lines[index] = line;
    current = next;
  }

  return [lines, current];
};

const clampRowsCount = (rowsCount: number) =>
  Math.max(MIN_ROWS_COUNT, Math.min(MAX_ROWS_COUNT, rowsCount));

export const WelcomeHeroComputerFakeConsole = memo(function WelcomeHeroComputerFakeConsole({
  isAnimating,
  className,
}: WelcomeHeroComputerFakeConsoleProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  const initialConsoleRef = useRef<{ lines: string[]; seed: number } | null>(null);

  if (!initialConsoleRef.current) {
    const [lines, seed] = createLines(INITIAL_SEED, INITIAL_ROWS_COUNT);
    initialConsoleRef.current = { lines, seed };
  }

  const rowsCountRef = useRef(INITIAL_ROWS_COUNT);
  const linesRef = useRef(initialConsoleRef.current.lines);
  const seedRef = useRef(initialConsoleRef.current.seed);
  const pendingLineRef = useRef<string | null>(null);

  const isAnimatingPropRef = useRef(isAnimating);
  const prefersReducedMotionRef = useRef(false);
  const isShiftingRef = useRef(false);

  const lineHeightRef = useRef(12);
  const shiftDistanceRef = useRef(14);

  const layoutRafRef = useRef<number | null>(null);
  const shiftRafRef = useRef<number | null>(null);
  const tickTimeoutRef = useRef<number | null>(null);
  const shiftTimeoutRef = useRef<number | null>(null);

  const updateAnimationStateRef = useRef<(() => void) | null>(null);

  isAnimatingPropRef.current = isAnimating;

  const lineIndexes = useMemo(
    () => Array.from({ length: MAX_ROWS_COUNT + EXTRA_PENDING_ROW }, (_, index) => index),
    [],
  );

  const syncLineNodeRef = useRef<(node: HTMLParagraphElement, index: number) => void>(() => {});

  syncLineNodeRef.current = (node, index) => {
    const rowsCount = rowsCountRef.current;
    const pendingLine = pendingLineRef.current;
    const lines = linesRef.current;

    const isPendingIndex = pendingLine !== null && index === rowsCount;
    const isActive = index < rowsCount || isPendingIndex;
    const nextText = isPendingIndex ? pendingLine : (lines[index] ?? "");

    if (node.textContent !== nextText) {
      node.textContent = nextText;
    }

    const nextDisplay = isActive ? "" : "none";
    if (node.style.display !== nextDisplay) {
      node.style.display = nextDisplay;
    }

    const nextDim = index < rowsCount - 3 ? "true" : "false";
    if (node.dataset.dim !== nextDim) {
      node.dataset.dim = nextDim;
    }
  };

  const lineRefCallbacks = useMemo(
    () =>
      Array.from({ length: MAX_ROWS_COUNT + EXTRA_PENDING_ROW }, (_, index) => {
        return (node: HTMLParagraphElement | null) => {
          lineRefs.current[index] = node;

          if (node) {
            syncLineNodeRef.current(node, index);
          }
        };
      }),
    [],
  );

  useEffect(() => {
    const rootElement = rootRef.current;
    const reelElement = reelRef.current;

    if (!rootElement || !reelElement) return;

    const clearLayoutRaf = () => {
      if (layoutRafRef.current !== null) {
        cancelAnimationFrame(layoutRafRef.current);
        layoutRafRef.current = null;
      }
    };

    const clearShiftRaf = () => {
      if (shiftRafRef.current !== null) {
        cancelAnimationFrame(shiftRafRef.current);
        shiftRafRef.current = null;
      }
    };

    const clearTickTimeout = () => {
      if (tickTimeoutRef.current !== null) {
        window.clearTimeout(tickTimeoutRef.current);
        tickTimeoutRef.current = null;
      }
    };

    const clearShiftTimeout = () => {
      if (shiftTimeoutRef.current !== null) {
        window.clearTimeout(shiftTimeoutRef.current);
        shiftTimeoutRef.current = null;
      }
    };

    const shouldAnimate = () => isAnimatingPropRef.current && !prefersReducedMotionRef.current;

    const paintLines = () => {
      for (let index = 0; index < lineRefs.current.length; index += 1) {
        const node = lineRefs.current[index];

        if (node) {
          syncLineNodeRef.current(node, index);
        }
      }
    };

    const resetReelTransform = () => {
      reelElement.style.cssText = "transition:none;transform:translate3d(0,0,0)";
      reelElement.dataset.shifting = "false";
    };

    const resizeLines = (nextRowsCount: number) => {
      const previousLines = linesRef.current;

      if (previousLines.length === nextRowsCount) return;

      pendingLineRef.current = null;
      isShiftingRef.current = false;
      resetReelTransform();

      if (previousLines.length > nextRowsCount) {
        linesRef.current = previousLines.slice(previousLines.length - nextRowsCount);
        return;
      }

      const missingCount = nextRowsCount - previousLines.length;
      const [newLines, nextSeed] = createLines(seedRef.current, missingCount);

      seedRef.current = nextSeed;
      linesRef.current = previousLines.concat(newLines);
    };

    const measureLineMetrics = () => {
      const lineElement = lineRefs.current[0];

      if (!lineElement) return;

      const computed = window.getComputedStyle(lineElement);
      const parsedLineHeight = Number.parseFloat(computed.lineHeight);

      lineHeightRef.current =
        Number.isFinite(parsedLineHeight) && parsedLineHeight > 0
          ? parsedLineHeight
          : lineElement.getBoundingClientRect().height || 12;

      shiftDistanceRef.current = lineHeightRef.current + LINE_GAP;
    };

    const scheduleTick = () => {
      if (!shouldAnimate()) return;
      if (tickTimeoutRef.current !== null) return;
      if (isShiftingRef.current) return;

      tickTimeoutRef.current = window.setTimeout(() => {
        tickTimeoutRef.current = null;

        if (!shouldAnimate()) return;
        if (isShiftingRef.current) return;

        const [nextLine, nextSeed] = generateLine(seedRef.current);

        seedRef.current = nextSeed;
        pendingLineRef.current = nextLine;
        isShiftingRef.current = true;

        paintLines();

        reelElement.dataset.shifting = "true";
        reelElement.style.cssText = "transition:none;transform:translate3d(0,0,0)";

        clearShiftRaf();
        clearShiftTimeout();

        shiftRafRef.current = requestAnimationFrame(() => {
          shiftRafRef.current = null;

          if (!shouldAnimate()) {
            pendingLineRef.current = null;
            isShiftingRef.current = false;
            resetReelTransform();
            paintLines();
            return;
          }

          reelElement.style.cssText = `transition:transform ${SHIFT_DURATION_MS}ms linear;transform:translate3d(0,-${shiftDistanceRef.current}px,0)`;

          shiftTimeoutRef.current = window.setTimeout(() => {
            shiftTimeoutRef.current = null;

            const pendingLine = pendingLineRef.current;
            const lines = linesRef.current;
            const rowsCount = rowsCountRef.current;

            if (pendingLine) {
              for (let index = 0; index < rowsCount - 1; index += 1) {
                lines[index] = lines[index + 1];
              }

              lines[rowsCount - 1] = pendingLine;
            }

            pendingLineRef.current = null;
            isShiftingRef.current = false;

            resetReelTransform();
            paintLines();
            scheduleTick();
          }, SHIFT_DURATION_MS);
        });
      }, TICK_INTERVAL_MS);
    };

    const stopAnimation = () => {
      clearTickTimeout();
      clearShiftTimeout();
      clearShiftRaf();

      pendingLineRef.current = null;
      isShiftingRef.current = false;

      resetReelTransform();
      paintLines();
    };

    const updateAnimationState = () => {
      const nextShouldAnimate = shouldAnimate();

      reelElement.dataset.animating = nextShouldAnimate ? "true" : "false";

      if (nextShouldAnimate) {
        scheduleTick();
      } else {
        stopAnimation();
      }
    };

    const updateRowsCountFromHeight = (height: number) => {
      const nextRowsCount = clampRowsCount(
        Math.floor(height / (lineHeightRef.current + LINE_GAP)) + 2,
      );

      if (rowsCountRef.current === nextRowsCount) return;

      clearTickTimeout();
      clearShiftTimeout();
      clearShiftRaf();

      rowsCountRef.current = nextRowsCount;
      resizeLines(nextRowsCount);
      paintLines();
      updateAnimationState();
    };

    const scheduleLayoutUpdate = (height: number) => {
      clearLayoutRaf();

      layoutRafRef.current = requestAnimationFrame(() => {
        layoutRafRef.current = null;

        measureLineMetrics();
        updateRowsCountFromHeight(height);
      });
    };

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateReducedMotion = () => {
      prefersReducedMotionRef.current = mediaQuery.matches;
      rootElement.dataset.reducedMotion = mediaQuery.matches ? "true" : "false";
      updateAnimationState();
    };

    updateAnimationStateRef.current = updateAnimationState;

    paintLines();
    scheduleLayoutUpdate(rootElement.clientHeight);
    updateReducedMotion();

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) return;

      scheduleLayoutUpdate(entry.contentRect.height);
    });

    resizeObserver.observe(rootElement);

    mediaQuery.addEventListener("change", updateReducedMotion);

    return () => {
      updateAnimationStateRef.current = null;

      resizeObserver.disconnect();
      mediaQuery.removeEventListener("change", updateReducedMotion);

      clearLayoutRaf();
      clearTickTimeout();
      clearShiftTimeout();
      clearShiftRaf();

      pendingLineRef.current = null;
      isShiftingRef.current = false;
      resetReelTransform();
    };
  }, []);

  useEffect(() => {
    updateAnimationStateRef.current?.();
  }, [isAnimating]);

  const rootClassName = className ? `${styles.rootStyles} ${className}` : styles.rootStyles;

  return (
    <div ref={rootRef} className={rootClassName} data-reduced-motion="false" aria-hidden="true">
      <div className={styles.noiseOverlayStyles} />
      <div className={styles.scanlineStyles} />
      <div className={styles.bottomRevealStyles} />

      <div className={styles.linesWrapperStyles}>
        <div
          ref={reelRef}
          className={styles.reelStyles}
          data-animating="false"
          data-shifting="false"
        >
          {lineIndexes.map((value, index) => (
            <p
              key={`line-${value}`}
              ref={lineRefCallbacks[index]}
              className={styles.lineStyles}
              data-dim={index < INITIAL_ROWS_COUNT - 3 ? "true" : "false"}
              style={index > INITIAL_ROWS_COUNT ? HIDDEN_LINE_STYLE : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
