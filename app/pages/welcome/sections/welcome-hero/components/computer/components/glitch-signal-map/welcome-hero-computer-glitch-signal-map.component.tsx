import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import * as styles from "./welcome-hero-computer-glitch-signal-map.css";

export interface WelcomeHeroComputerGlitchSignalMapProps {
  isAnimating: boolean;
  className?: string;
}

const BASE_SEED = 0x5e2d91af;
const LCG_A = 1664525;
const LCG_C = 1013904223;
const TICK_MS = 180;
const UPDATE_RATIO = 0.08;

const lcg = (seed: number): number => (seed * LCG_A + LCG_C) >>> 0;

const buildBlockModel = (count: number) => {
  const seeds: number[] = [];
  const states: Array<"idle" | "active" | "recalibrating"> = [];
  let current = BASE_SEED;

  for (let index = 0; index < count; index += 1) {
    current = lcg(current ^ (index * 2654435761));
    seeds.push(current);
    states.push((current & 0x0f) < 2 ? "active" : "idle");
  }

  return { seeds, states };
};

const buildDots = (count: number) => {
  const dots: Array<{ top: string; left: string; accent: boolean }> = [];
  let seed = BASE_SEED ^ 0x00abc123;

  for (let index = 0; index < count; index += 1) {
    seed = lcg(seed);
    const top = `${8 + (seed % 84)}%`;
    seed = lcg(seed);
    const left = `${10 + (seed % 78)}%`;
    const accent = ((seed >>> 5) & 0x07) === 0;
    dots.push({ top, left, accent });
  }

  return dots;
};

export const WelcomeHeroComputerGlitchSignalMap = memo(
  ({ isAnimating, className }: WelcomeHeroComputerGlitchSignalMapProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const blockRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const seedsRef = useRef<number[]>([]);
    const statesRef = useRef<Array<"idle" | "active" | "recalibrating">>([]);
    const shouldAnimateRef = useRef(isAnimating);
    const prefersReducedMotionRef = useRef(false);

    const [grid, setGrid] = useState({ cols: 4, rows: 18 });
    const [blockCount, setBlockCount] = useState(72);

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

        const cols = Math.max(3, Math.min(6, Math.floor(width / 16)));
        const rows = Math.max(14, Math.floor(height / 10));
        const nextCount = cols * rows;

        setGrid((previous) => {
          if (previous.cols === cols && previous.rows === rows) return previous;
          return { cols, rows };
        });
        setBlockCount((previous) => (previous === nextCount ? previous : nextCount));
      };

      updateGrid();

      const resizeObserver = new ResizeObserver(updateGrid);
      resizeObserver.observe(element);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    useEffect(() => {
      const { seeds, states } = buildBlockModel(blockCount);
      seedsRef.current = seeds;
      statesRef.current = states;
      blockRefs.current = blockRefs.current.slice(0, blockCount);
    }, [blockCount]);

    useEffect(() => {
      let frameId = 0;
      let lastTick = 0;
      let frameStep = 0;
      let isRunning = false;

      const animate = (currentTime: number) => {
        // Only run animation if component is animating and visible
        if (!shouldAnimateRef.current || prefersReducedMotionRef.current) {
          isRunning = false;
          return;
        }

        frameId = requestAnimationFrame(animate);

        // Reduce tick rate to every 250ms instead of 180ms
        if (currentTime - lastTick < 250) return;

        lastTick = currentTime;
        frameStep += 1;

        const count = seedsRef.current.length;
        if (count === 0) return;

        // Reduce batch size to minimize DOM updates
        const batch = Math.max(1, Math.floor(count * 0.04));

        // Use DocumentFragment pattern to batch DOM reads/writes
        const updates: Array<{ index: number; state: string; accent: string; seed: number }> = [];

        for (let index = 0; index < batch; index += 1) {
          const blockIndex = (frameStep * 7 + index * 19 + 5) % count;
          const currentSeed = seedsRef.current[blockIndex] ?? BASE_SEED;
          const nextSeed = lcg(currentSeed);

          const shouldRecalibrate = (nextSeed & 0x7f) <= 4;
          const isActive = !shouldRecalibrate && ((nextSeed >>> 4) & 0x0f) < 5;
          const nextState = shouldRecalibrate ? "recalibrating" : isActive ? "active" : "idle";

          seedsRef.current[blockIndex] = nextSeed;
          statesRef.current[blockIndex] = nextState;

          updates.push({
            index: blockIndex,
            state: nextState,
            accent: ((nextSeed >>> 8) & 0x0f) === 0 ? "true" : "false",
            seed: nextSeed,
          });
        }

        // Batch DOM updates
        requestAnimationFrame(() => {
          for (const update of updates) {
            const node = blockRefs.current[update.index];
            if (!node) continue;

            node.dataset.state = update.state;
            node.dataset.accent = update.accent;

            if (update.state === "recalibrating") {
              const settleSeed = lcg(update.seed);
              setTimeout(() => {
                const liveNode = blockRefs.current[update.index];
                if (!liveNode) return;

                const settledState = ((settleSeed >>> 3) & 0x0f) < 4 ? "active" : "idle";
                liveNode.dataset.state = settledState;
                liveNode.dataset.accent = ((settleSeed >>> 7) & 0x0f) === 0 ? "true" : "false";
                seedsRef.current[update.index] = settleSeed;
                statesRef.current[update.index] = settledState;
              }, 120);
            }
          }
        });
      };

      // Start animation only when isAnimating becomes true
      if (isAnimating && !isRunning) {
        isRunning = true;
        frameId = requestAnimationFrame(animate);
      }

      return () => {
        isRunning = false;
        if (frameId) cancelAnimationFrame(frameId);
      };
    }, [isAnimating]);

    const rootClassName = className ? `${styles.rootStyles} ${className}` : styles.rootStyles;

    const initialBlocks = useMemo(() => {
      const { states } = buildBlockModel(blockCount);
      return states.map((state, index) => {
        const accent = (((BASE_SEED + index * 17) >>> 5) & 0x0f) === 0;
        const delay = `${((index * 11) % 240) / 80}s`;
        return { state, accent, delay };
      });
    }, [blockCount]);

    const dots = useMemo(() => {
      return buildDots(12);
    }, []);

    return (
      <div ref={rootRef} className={rootClassName} aria-hidden="true">
        <div className={styles.textureStyles} />
        <div className={styles.scanlineStyles} />

        <div
          className={styles.lanesStyles}
          style={{
            gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${grid.rows}, minmax(0, 1fr))`,
          }}
        >
          {initialBlocks.map((block, index) => {
            return (
              <span
                key={`signal-block-${block.delay}`}
                ref={(element) => {
                  blockRefs.current[index] = element;
                }}
                className={styles.blockStyles}
                data-state={block.state}
                data-accent={block.accent ? "true" : "false"}
                style={
                  {
                    "--block-delay": block.delay,
                  } as CSSProperties
                }
              />
            );
          })}
        </div>

        <div className={styles.dotsLayerStyles}>
          {dots.map((dot) => {
            return (
              <span
                key={`signal-dot-${dot.top}-${dot.left}`}
                className={styles.dotStyles}
                data-accent={dot.accent ? "true" : "false"}
                style={{ top: dot.top, left: dot.left }}
              />
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
