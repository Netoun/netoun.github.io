import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import * as styles from "./welcome-hero-computer-cybernetic-glyph-grid.css";

export interface WelcomeHeroComputerCyberneticGlyphGridProps {
  isAnimating: boolean;
  className?: string;
}

const HEX = "0123456789ABCDEF";
const GLYPH_GLITCH_TOKENS = [
  "  ",
  " .",
  ". ",
  "░░",
  "▒▒",
  "▓▓",
  "██",
  "█░",
  "░█",
  "▚▞",
  "▞▚",
  "▖▗",
  "▘▝",
  "▙▟",
  "▛▜",
  "◢◣",
  "◤◥",
  "◧◨",
  "◩◪",
  "▔▁",
  "▁▔",
  "▏▕",
  "▕▏",
  "╳╳",
  "╱╲",
  "╲╱",
  "┇┇",
  "┊┊",
  "╍╍",
  "⟦⟧",
  "⟨⟩",
  "◌◌",
  "◍◍",
  "◇◆",
  "◆◇",
  "◎◉",
  "◉◎",
];
const BASE_SEED = 0x2f6a91c3;
const LCG_A = 1664525;
const LCG_C = 1013904223;
const CELL_WIDTH_PX = 16;
const CELL_HEIGHT_PX = 13;
const GRID_GAP_PX = 2;
const TICK_MS = 92;
const UPDATE_RATIO = 0.12;

const lcg = (seed: number): number => (seed * LCG_A + LCG_C) >>> 0;

const hexPair = (seed: number): [string, number] => {
  const next = lcg(seed);
  const value = `${HEX[next & 0x0f]}${HEX[(next >>> 4) & 0x0f]}`;
  return [value, lcg(next)];
};

const glitchToken = (seed: number): [string, number] => {
  const next = lcg(seed);
  return [GLYPH_GLITCH_TOKENS[next % GLYPH_GLITCH_TOKENS.length] ?? "░░", lcg(next)];
};

const buildInitialValues = (count: number) => {
  const values: string[] = [];
  const seeds: number[] = [];
  let seed = BASE_SEED;

  for (let index = 0; index < count; index += 1) {
    const [value, nextSeed] = hexPair(seed);
    values.push(value);
    seeds.push(nextSeed ^ (index * 2654435761));
    seed = nextSeed;
  }

  return { values, seeds };
};

export const WelcomeHeroComputerCyberneticGlyphGrid = memo(
  ({ isAnimating, className }: WelcomeHeroComputerCyberneticGlyphGridProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const cellRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const valuesRef = useRef<string[]>([]);
    const seedsRef = useRef<number[]>([]);
    const shouldAnimateRef = useRef(isAnimating);
    const prefersReducedMotionRef = useRef(false);

    const [grid, setGrid] = useState({ cols: 12, rows: 8 });
    const [cellCount, setCellCount] = useState(96);

    shouldAnimateRef.current = isAnimating;

    useEffect(() => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const updateMotion = () => {
        prefersReducedMotionRef.current = mediaQuery.matches;
      };

      updateMotion();
      mediaQuery.addEventListener("change", updateMotion);

      return () => {
        mediaQuery.removeEventListener("change", updateMotion);
      };
    }, []);

    useEffect(() => {
      const element = rootRef.current;
      if (!element) return;

      const updateGrid = () => {
        const { width, height } = element.getBoundingClientRect();
        const cols = Math.max(
          8,
          Math.floor((width - GRID_GAP_PX) / (CELL_WIDTH_PX + GRID_GAP_PX)),
        );
        const rows = Math.max(
          6,
          Math.floor((height - GRID_GAP_PX) / (CELL_HEIGHT_PX + GRID_GAP_PX)),
        );

        const nextCount = cols * rows;

        setGrid((previous) => {
          if (previous.cols === cols && previous.rows === rows) return previous;
          return { cols, rows };
        });
        setCellCount((previous) => (previous === nextCount ? previous : nextCount));
      };

      updateGrid();

      const resizeObserver = new ResizeObserver(() => {
        updateGrid();
      });
      resizeObserver.observe(element);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    useEffect(() => {
      const { values, seeds } = buildInitialValues(cellCount);
      valuesRef.current = values;
      seedsRef.current = seeds;
      cellRefs.current = cellRefs.current.slice(0, cellCount);
    }, [cellCount]);

    useEffect(() => {
      let frameId = 0;
      let lastTick = 0;
      let frameStep = 0;

      const animate = (currentTime: number) => {
        frameId = requestAnimationFrame(animate);

        if (!shouldAnimateRef.current) return;
        if (prefersReducedMotionRef.current) return;
        if (currentTime - lastTick < TICK_MS) return;

        lastTick = currentTime;
        frameStep += 1;

        const count = valuesRef.current.length;
        if (count === 0) return;

        const batch = Math.max(2, Math.floor(count * UPDATE_RATIO));

        for (let index = 0; index < batch; index += 1) {
          const cellIndex = (frameStep * 11 + index * 37 + 17) % count;
          const currentSeed = seedsRef.current[cellIndex] ?? BASE_SEED;
          const cellNode = cellRefs.current[cellIndex];

          const shouldGlitch = ((currentSeed >>> 1) & 0x1f) <= 2;

          const [nextValue, nextSeed] = shouldGlitch
            ? glitchToken(currentSeed)
            : hexPair(currentSeed);

          valuesRef.current[cellIndex] = nextValue;
          seedsRef.current[cellIndex] = nextSeed;

          if (!cellNode) continue;
          cellNode.textContent = nextValue;
          cellNode.dataset.accent = ((nextSeed >>> 3) & 0x07) === 0 ? "true" : "false";
          cellNode.dataset.glitch = shouldGlitch ? "true" : "false";

          if (shouldGlitch) {
            const settleSeed = lcg(nextSeed);
            const [settleValue, stableSeed] = hexPair(settleSeed);

            window.setTimeout(() => {
              const liveNode = cellRefs.current[cellIndex];
              if (!liveNode) return;
              liveNode.textContent = settleValue;
              liveNode.dataset.glitch = "false";
              liveNode.dataset.accent = ((stableSeed >>> 4) & 0x07) === 0 ? "true" : "false";
              valuesRef.current[cellIndex] = settleValue;
              seedsRef.current[cellIndex] = stableSeed;
            }, 92);
          }
        }
      };

      frameId = requestAnimationFrame(animate);

      return () => {
        if (frameId) cancelAnimationFrame(frameId);
      };
    }, []);

    const rootClassName = useMemo(() => {
      return className ? `${styles.rootStyles} ${className}` : styles.rootStyles;
    }, [className]);

    const initialCells = useMemo(() => {
      const { values } = buildInitialValues(cellCount);

      return values.map((value, index) => {
        const accent = (((BASE_SEED + index * 13) >>> 2) & 0x0f) === 0;
        const pulseDelay = `${((index * 17) % 240) / 70}s`;

        return {
          value,
          accent,
          pulseDelay,
        };
      });
    }, [cellCount]);

    return (
      <div ref={rootRef} className={rootClassName} aria-hidden="true">
        <div className={styles.noiseOverlayStyles} />
        <div className={styles.scanlineStyles} />
        <div
          className={styles.gridStyles}
          style={{
            gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${grid.rows}, minmax(0, 1fr))`,
          }}
        >
          {initialCells.map((cell, index) => {
            return (
              <span
                key={`glyph-${index}`}
                ref={(element) => {
                  cellRefs.current[index] = element;
                }}
                className={styles.cellStyles}
                data-accent={cell.accent ? "true" : "false"}
                data-glitch="false"
                style={{
                  "--pulse-delay": cell.pulseDelay,
                } as CSSProperties}
              >
                {cell.value}
              </span>
            );
          })}
        </div>
      </div>
    );
  },
  (previousProps, nextProps) => {
    return (
      previousProps.isAnimating === nextProps.isAnimating &&
      previousProps.className === nextProps.className
    );
  },
);
