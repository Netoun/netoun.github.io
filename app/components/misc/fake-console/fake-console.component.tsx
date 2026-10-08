import { setElementVars } from "@vanilla-extract/dynamic";
import { memo, useEffect, useRef } from "react";
import * as styles from "./fake-console.css";

export interface FakeConsoleProps {
  isAnimating: boolean;
  className?: string;
  /** Milliseconds between two lines. */
  tickMs?: number;
  /** How long the reel takes to roll up one line. */
  shiftMs?: number;
  /** The Lab's xray: the clip window outlined, the incoming line lit. */
  xray?: boolean;
  /** Each time a line is drawn (and once when the xray opens). */
  onTick?: (trace: FakeConsoleTrace) => void;
}

/** A line's five fields, as its ten `lcg` draws produced them. */
export interface ConsoleLineParts {
  process: string;
  state: string;
  load: string;
  hex: string;
  tail: string;
}

export interface FakeConsoleTrace {
  lines: number;
  /** The seed the newest line was drawn from, and the one it hands to the next. */
  seedIn: number;
  seedOut: number;
  parts: ConsoleLineParts;
  /** Lines in the reel: the window's rows plus two, so none pops in at the edge. */
  rowsCount: number;
  rowPx: number;
}

const INITIAL_ROWS_COUNT = 10;
const MIN_ROWS_COUNT = 6;
const MAX_ROWS_COUNT = 30;
const EXTRA_PENDING_ROW = 1;

const LINE_GAP = 2;
const TICK_INTERVAL_MS = 500;
const SHIFT_DURATION_MS = 250;

const INITIAL_SEED = 0x1a2b3c4d;

export const FAKE_CONSOLE_DEFAULTS = {
  tickMs: TICK_INTERVAL_MS,
  shiftMs: SHIFT_DURATION_MS,
  seed: INITIAL_SEED,
} as const;

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

const lcg = (seed: number) => (seed * 1664525 + 1013904223) >>> 0;

// Reads the draw's high bits: an LCG's low bits repeat fast (the lowest three every 8 draws),
// and `% 8` on them made the log loop every four lines.
const intFromSeed = (seed: number, max: number): [number, number] => {
  const next = lcg(seed);
  return [(next >>> 16) % max, next];
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

/** One line from one seed: five fields, ten `lcg` draws, and the seed for the next line. */
export const lineParts = (seed: number): [ConsoleLineParts, number] => {
  const [leftIdx, seedA] = intFromSeed(seed, TOKEN_A_LABELS.length);
  const [rightIdx, seedB] = intFromSeed(seedA, TOKENS_B.length);
  const [progress, seedC] = intFromSeed(seedB, PERCENT_LABELS.length);
  const [shortHex, seedD] = hexChunk(seedC, 4);
  const [shortHexTail, nextSeed] = hexChunk(seedD, 3);

  return [
    {
      process: TOKEN_A_LABELS[leftIdx],
      state: TOKENS_B[rightIdx],
      load: PERCENT_LABELS[progress],
      hex: shortHex,
      tail: shortHexTail,
    },
    nextSeed,
  ];
};

const formatLine = ({ process, state, load, hex, tail }: ConsoleLineParts) =>
  `${process}  ${state} ${load}  ${hex}-${tail}`;

const createLines = (seed: number, count: number): [string[], number] => {
  // oxlint-disable-next-line unicorn/no-new-array -- preallocated, every slot is written by the loop below
  const lines = new Array<string>(count);
  let current = seed;

  for (let index = 0; index < count; index += 1) {
    const [parts, next] = lineParts(current);
    lines[index] = formatLine(parts);
    current = next;
  }

  return [lines, current];
};

const clampRowsCount = (rowsCount: number) =>
  Math.max(MIN_ROWS_COUNT, Math.min(MAX_ROWS_COUNT, rowsCount));

const [INITIAL_LINES, INITIAL_LINES_SEED] = createLines(INITIAL_SEED, INITIAL_ROWS_COUNT);

const LINE_INDEXES = Array.from(
  { length: MAX_ROWS_COUNT + EXTRA_PENDING_ROW },
  (_, index) => index,
);

interface ConsoleState {
  rowsCount: number;
  lines: string[];
  seed: number;
  pendingLine: string | null;
}

/** Writes one line node from the reel state, touching the DOM only when a value changes. */
const syncLineNode = (node: HTMLElement, index: number, state: ConsoleState) => {
  const { rowsCount, pendingLine, lines } = state;
  const isPendingIndex = pendingLine !== null && index === rowsCount;
  const isActive = index < rowsCount || isPendingIndex;
  const nextText = isPendingIndex ? pendingLine : (lines[index] ?? "");

  if (node.textContent !== nextText) {
    node.textContent = nextText;
  }

  if (node.hidden === isActive) {
    node.hidden = !isActive;
  }

  const nextDim = index < rowsCount - 3 ? "true" : "false";
  if (node.dataset.dim !== nextDim) {
    node.dataset.dim = nextDim;
  }

  const nextPending = isPendingIndex ? "true" : "false";
  if (node.dataset.pending !== nextPending) {
    node.dataset.pending = nextPending;
  }
};

export const FakeConsole = memo(function FakeConsole({
  isAnimating,
  className,
  tickMs = TICK_INTERVAL_MS,
  shiftMs = SHIFT_DURATION_MS,
  xray = false,
  onTick,
}: FakeConsoleProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(isAnimating);
  const updateAnimationStateRef = useRef<(() => void) | null>(null);
  // Tuning props, read by the reel's timers through refs: no restart when they change.
  const tickMsRef = useRef(tickMs);
  const shiftMsRef = useRef(shiftMs);
  const onTickRef = useRef(onTick);
  const reportRef = useRef<(() => void) | null>(null);

  // The reel is driven imperatively (text, visibility, shift): React renders the
  // empty line nodes once and never re-renders them.
  useEffect(() => {
    const rootElement = rootRef.current;
    const reelElement = reelRef.current;

    if (!rootElement || !reelElement) return;

    const lineNodes = Array.from(reelElement.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement,
    );
    const state: ConsoleState = {
      rowsCount: INITIAL_ROWS_COUNT,
      lines: INITIAL_LINES,
      seed: INITIAL_LINES_SEED,
      pendingLine: null,
    };

    let prefersReducedMotion = false;
    let lineCount = state.lines.length;
    let lastSeedIn = INITIAL_SEED;
    let [lastParts] = lineParts(INITIAL_SEED);
    let isShifting = false;
    let shiftDistance = 14;
    let lineHeight = 12;

    let layoutRaf: number | null = null;
    let shiftRaf: number | null = null;
    let tickTimeout: number | null = null;
    let shiftTimeout: number | null = null;

    const clearLayoutRaf = () => {
      if (layoutRaf !== null) {
        cancelAnimationFrame(layoutRaf);
        layoutRaf = null;
      }
    };

    const clearShiftRaf = () => {
      if (shiftRaf !== null) {
        cancelAnimationFrame(shiftRaf);
        shiftRaf = null;
      }
    };

    const clearTickTimeout = () => {
      if (tickTimeout !== null) {
        window.clearTimeout(tickTimeout);
        tickTimeout = null;
      }
    };

    const clearShiftTimeout = () => {
      if (shiftTimeout !== null) {
        window.clearTimeout(shiftTimeout);
        shiftTimeout = null;
      }
    };

    const shouldAnimate = () => isAnimatingRef.current && !prefersReducedMotion;

    const paintLines = () => {
      lineNodes.forEach((node, index) => syncLineNode(node, index, state));
    };

    const resetReelTransform = () => {
      reelElement.dataset.shifting = "false";
    };

    const resizeLines = (nextRowsCount: number) => {
      const previousLines = state.lines;

      if (previousLines.length === nextRowsCount) return;

      state.pendingLine = null;
      isShifting = false;
      resetReelTransform();

      if (previousLines.length > nextRowsCount) {
        state.lines = previousLines.slice(previousLines.length - nextRowsCount);
        return;
      }

      const [newLines, nextSeed] = createLines(state.seed, nextRowsCount - previousLines.length);

      state.seed = nextSeed;
      state.lines = previousLines.concat(newLines);
    };

    const measureLineMetrics = () => {
      const lineElement = lineNodes[0];

      if (!lineElement) return;

      const parsedLineHeight = Number.parseFloat(window.getComputedStyle(lineElement).lineHeight);

      lineHeight =
        Number.isFinite(parsedLineHeight) && parsedLineHeight > 0
          ? parsedLineHeight
          : lineElement.getBoundingClientRect().height || 12;

      shiftDistance = lineHeight + LINE_GAP;
    };

    const scheduleTick = () => {
      if (!shouldAnimate()) return;
      if (tickTimeout !== null) return;
      if (isShifting) return;

      tickTimeout = window.setTimeout(() => {
        tickTimeout = null;

        if (!shouldAnimate()) return;
        if (isShifting) return;

        const seedIn = state.seed;
        const [parts, nextSeed] = lineParts(seedIn);
        const nextLine = formatLine(parts);

        lastSeedIn = seedIn;
        lastParts = parts;
        lineCount += 1;
        state.seed = nextSeed;
        report();
        state.pendingLine = nextLine;
        isShifting = true;

        paintLines();

        clearShiftRaf();
        clearShiftTimeout();

        shiftRaf = requestAnimationFrame(() => {
          shiftRaf = null;

          if (!shouldAnimate()) {
            state.pendingLine = null;
            isShifting = false;
            resetReelTransform();
            paintLines();
            return;
          }

          // The pending line is painted at rest; roll the reel on the next frame.
          setElementVars(reelElement, {
            [styles.reelShift]: `${shiftDistance}px`,
            [styles.reelShiftDuration]: `${shiftMsRef.current}ms`,
          });
          reelElement.dataset.shifting = "moving";

          shiftTimeout = window.setTimeout(() => {
            shiftTimeout = null;

            // A new array, never an in-place shift: the first lines are a shared constant.
            if (state.pendingLine) {
              state.lines = [...state.lines.slice(1, state.rowsCount), state.pendingLine];
            }

            state.pendingLine = null;
            isShifting = false;

            resetReelTransform();
            paintLines();
            scheduleTick();
          }, shiftMsRef.current);
        });
      }, tickMsRef.current);
    };

    function report() {
      onTickRef.current?.({
        lines: lineCount,
        seedIn: lastSeedIn,
        seedOut: state.seed,
        parts: lastParts,
        rowsCount: state.rowsCount,
        rowPx: shiftDistance,
      });
    }

    const stopAnimation = () => {
      clearTickTimeout();
      clearShiftTimeout();
      clearShiftRaf();

      state.pendingLine = null;
      isShifting = false;

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
      const nextRowsCount = clampRowsCount(Math.floor(height / (lineHeight + LINE_GAP)) + 2);

      if (state.rowsCount === nextRowsCount) return;

      clearTickTimeout();
      clearShiftTimeout();
      clearShiftRaf();

      state.rowsCount = nextRowsCount;
      resizeLines(nextRowsCount);
      paintLines();
      updateAnimationState();
    };

    const scheduleLayoutUpdate = (height: number) => {
      clearLayoutRaf();

      layoutRaf = requestAnimationFrame(() => {
        layoutRaf = null;

        measureLineMetrics();
        updateRowsCountFromHeight(height);
      });
    };

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateReducedMotion = () => {
      prefersReducedMotion = mediaQuery.matches;
      updateAnimationState();
    };

    updateAnimationStateRef.current = updateAnimationState;
    reportRef.current = report;

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
      reportRef.current = null;

      resizeObserver.disconnect();
      mediaQuery.removeEventListener("change", updateReducedMotion);

      clearLayoutRaf();
      clearTickTimeout();
      clearShiftTimeout();
      clearShiftRaf();

      resetReelTransform();
    };
  }, []);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
    updateAnimationStateRef.current?.();
  }, [isAnimating]);

  useEffect(() => {
    tickMsRef.current = tickMs;
    shiftMsRef.current = shiftMs;
    onTickRef.current = onTick;
  });

  // A readout opening gets the reel as it is, not after the next line.
  useEffect(() => {
    if (xray) reportRef.current?.();
  }, [xray]);

  const rootClassName = className ? `${styles.rootStyles} ${className}` : styles.rootStyles;

  return (
    <div ref={rootRef} className={rootClassName} data-xray={xray || undefined} aria-hidden="true">
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
          {LINE_INDEXES.map((index) => (
            <p
              key={index}
              className={styles.lineStyles}
              data-dim={index < INITIAL_ROWS_COUNT - 3 ? "true" : "false"}
              hidden={index >= INITIAL_ROWS_COUNT}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
