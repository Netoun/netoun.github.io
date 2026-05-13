import { memo, useEffect, useRef, useState } from "react";
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

const CELL_BASE_W = 16;
const CELL_BASE_H = 13;
const GAP_PX = 2;

const MAX_DPR = 1.25;

const TICK_MS = 100;
const UPDATE_RATIO = 0.12;

const PULSE_PERIOD_S = 2.9;
const PULSE_RADIANS_PER_SECOND = (Math.PI * 2) / PULSE_PERIOD_S;

const GLITCH_DURATION_MS = 92;
const GLITCH_BASE_ALPHA = 0.58;

const FONT_FAMILY = "Doto, system-ui, sans-serif";

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

interface CellState {
  value: string;
  seed: number;
  accent: boolean;
  glitchUntil: number;
  settleValue: string;
  settleSeed: number;
  pulseDelay: number;
}

interface GridLayout {
  cols: number;
  rows: number;
  cellW: number;
  cellH: number;
}

type GlyphTone = "normal" | "accent" | "glitch";

interface GlyphBitmap {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

const TONE_STYLES: Record<
  GlyphTone,
  {
    color: string;
    glow: string;
    shadowBlur: number;
  }
> = {
  normal: {
    color: "oklch(0.82 0.15 130)",
    glow: "oklch(0.8858 0.182 95.69 / 0.12)",
    shadowBlur: 7,
  },
  accent: {
    color: "oklch(0.71 0.17 336)",
    glow: "oklch(0.8858 0.182 95.69 / 0.18)",
    shadowBlur: 10,
  },
  glitch: {
    color: "oklch(0.77 0.21 105)",
    glow: "oklch(0.5548 0.2575 312.98 / 0.2)",
    shadowBlur: 12,
  },
};

const buildCells = (count: number): CellState[] => {
  const cells: CellState[] = [];
  let seed = BASE_SEED;

  for (let index = 0; index < count; index += 1) {
    const [value, nextSeed] = hexPair(seed);
    const cellSeed = nextSeed ^ (index * 2654435761);

    cells.push({
      value,
      seed: cellSeed,
      accent: (((BASE_SEED + index * 13) >>> 2) & 0x0f) === 0,
      glitchUntil: 0,
      settleValue: value,
      settleSeed: cellSeed,
      pulseDelay: ((index * 17) % 240) / 70,
    });

    seed = nextSeed;
  }

  return cells;
};

const computeLayout = (w: number, h: number): GridLayout => {
  const cols = Math.max(8, Math.floor((w - GAP_PX) / (CELL_BASE_W + GAP_PX)));
  const rows = Math.max(6, Math.floor((h - GAP_PX) / (CELL_BASE_H + GAP_PX)));
  const cellW = (w - GAP_PX * (cols + 1)) / cols;
  const cellH = (h - GAP_PX * (rows + 1)) / rows;

  return { cols, rows, cellW, cellH };
};

const makeGlyphKey = (value: string, tone: GlyphTone, fontSize: number, dpr: number) =>
  `${value}:${tone}:${Math.round(fontSize * 100)}:${Math.round(dpr * 100)}`;

const createGlyphBitmap = (
  value: string,
  tone: GlyphTone,
  fontSize: number,
  dpr: number,
): GlyphBitmap => {
  const toneStyle = TONE_STYLES[tone];

  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");

  const font = `700 ${fontSize}px ${FONT_FAMILY}`;

  let textWidth = fontSize * 1.6;

  if (measureCtx) {
    measureCtx.font = font;
    textWidth = measureCtx.measureText(value).width;
  }

  const padding = Math.ceil(toneStyle.shadowBlur + 5);
  const cssWidth = Math.ceil(textWidth + padding * 2);
  const cssHeight = Math.ceil(fontSize * 1.65 + padding * 2);

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.ceil(cssWidth * dpr));
  canvas.height = Math.max(1, Math.ceil(cssHeight * dpr));

  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: true,
  });

  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = toneStyle.color;
    ctx.shadowColor = toneStyle.glow;
    ctx.shadowBlur = toneStyle.shadowBlur * dpr;

    ctx.fillText(value, cssWidth / 2, cssHeight / 2);
  }

  return {
    canvas,
    width: cssWidth,
    height: cssHeight,
  };
};

export const WelcomeHeroComputerCyberneticGlyphGrid = memo(
  ({ isAnimating, className }: WelcomeHeroComputerCyberneticGlyphGridProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const cellsRef = useRef<CellState[]>([]);
    const glyphAtlasRef = useRef<Map<string, GlyphBitmap>>(new Map());

    const layoutRef = useRef<GridLayout>({
      cols: 12,
      rows: 8,
      cellW: CELL_BASE_W,
      cellH: CELL_BASE_H,
    });

    const dprRef = useRef(1);
    const canvasWRef = useRef(0);
    const canvasHRef = useRef(0);
    const fontSizeRef = useRef(0);

    const rafRef = useRef<number | null>(null);
    const animStartRef = useRef(0);
    const lastTickRef = useRef(0);
    const tickStepRef = useRef(0);

    const isAnimatingRef = useRef(isAnimating);
    const reducedMotionRef = useRef(false);
    const mountedRef = useRef(false);

    const [reducedMotion, setReducedMotion] = useState(false);

    isAnimatingRef.current = isAnimating;
    reducedMotionRef.current = reducedMotion;

    const getGlyph = (
      value: string,
      tone: GlyphTone,
      fontSize: number,
      dpr: number,
    ): GlyphBitmap => {
      const key = makeGlyphKey(value, tone, fontSize, dpr);
      const cached = glyphAtlasRef.current.get(key);

      if (cached) return cached;

      const bitmap = createGlyphBitmap(value, tone, fontSize, dpr);
      glyphAtlasRef.current.set(key, bitmap);

      return bitmap;
    };

    const ensureCells = (count: number) => {
      if (cellsRef.current.length === count) return;
      cellsRef.current = buildCells(count);
    };

    const updateCells = (now: number) => {
      tickStepRef.current += 1;

      const cells = cellsRef.current;
      const count = cells.length;

      if (count === 0) return;

      const batch = Math.max(2, Math.floor(count * UPDATE_RATIO));
      const step = tickStepRef.current;

      for (let i = 0; i < batch; i += 1) {
        const ci = (step * 11 + i * 37 + 17) % count;
        const cell = cells[ci];

        if (!cell) continue;

        const shouldGlitch = ((cell.seed >>> 1) & 0x1f) <= 2;
        const [nextValue, nextSeed] = shouldGlitch ? glitchToken(cell.seed) : hexPair(cell.seed);

        cell.value = nextValue;
        cell.seed = nextSeed;

        if (shouldGlitch) {
          const settleSeed = lcg(nextSeed);
          const [settleValue, stableSeed] = hexPair(settleSeed);

          cell.glitchUntil = now + GLITCH_DURATION_MS;
          cell.settleValue = settleValue;
          cell.settleSeed = stableSeed;
        } else {
          cell.glitchUntil = 0;
        }
      }
    };

    const draw = (now: number) => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      const dpr = dprRef.current;
      const { cols, rows, cellW, cellH } = layoutRef.current;
      const cells = cellsRef.current;
      const w = canvasWRef.current;
      const h = canvasHRef.current;

      if (w <= 0 || h <= 0 || cells.length === 0) return;

      const running = isAnimatingRef.current && !reducedMotionRef.current;
      const elapsed = running ? (now - animStartRef.current) / 1000 : 0;
      const fontSize = fontSizeRef.current;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";

      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "oklch(0.13 0.03 210 / 0.92)");
      bg.addColorStop(1, "oklch(0.095 0.02 225 / 0.96)");

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const idx = row * cols + col;
          const cell = cells[idx];

          if (!cell) continue;

          if (cell.glitchUntil > 0 && now >= cell.glitchUntil) {
            cell.value = cell.settleValue;
            cell.seed = cell.settleSeed;
            cell.glitchUntil = 0;
          }

          const isGlitch = cell.glitchUntil > 0;
          const tone: GlyphTone = isGlitch ? "glitch" : cell.accent ? "accent" : "normal";

          let alpha: number;
          let offsetX = 0;

          if (isGlitch) {
            const phase = (now * 0.0053 + idx * 0.731) % 1;

            alpha = GLITCH_BASE_ALPHA + 0.37 * Math.abs(Math.sin(phase * Math.PI));
            offsetX = Math.sin(phase * 7.7) * 0.6;
          } else {
            alpha = running
              ? 0.54 +
                0.32 *
                  (Math.sin((elapsed + cell.pulseDelay) * PULSE_RADIANS_PER_SECOND - Math.PI / 2) *
                    0.5 +
                    0.5)
              : 0.62;
          }

          const cx = GAP_PX + col * (cellW + GAP_PX) + cellW / 2;
          const cy = GAP_PX + row * (cellH + GAP_PX) + cellH / 2;

          const glyph = getGlyph(cell.value, tone, fontSize, dpr);

          ctx.globalAlpha = alpha;
          ctx.drawImage(
            glyph.canvas,
            cx - glyph.width / 2 + offsetX,
            cy - glyph.height / 2,
            glyph.width,
            glyph.height,
          );
        }
      }

      ctx.globalAlpha = 1;
    };

    useEffect(() => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

      const update = () => {
        setReducedMotion(mq.matches);
      };

      update();
      mq.addEventListener("change", update);

      return () => {
        mq.removeEventListener("change", update);
      };
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      ctxRef.current = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true,
      });

      if (ctxRef.current) {
        ctxRef.current.imageSmoothingEnabled = false;
      }

      return () => {
        ctxRef.current = null;
      };
    }, []);

    useEffect(() => {
      const el = rootRef.current;
      const canvas = canvasRef.current;

      if (!el || !canvas) return;

      const resize = () => {
        const rect = el.getBoundingClientRect();
        const w = Math.floor(rect.width);
        const h = Math.floor(rect.height);

        if (w <= 0 || h <= 0) return;

        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        const layout = computeLayout(w, h);
        const fontSize = Math.max(7, layout.cellH * 0.72);
        const count = layout.cols * layout.rows;

        const dprChanged = dprRef.current !== dpr;
        const fontChanged = Math.abs(fontSizeRef.current - fontSize) > 0.25;

        dprRef.current = dpr;
        canvasWRef.current = w;
        canvasHRef.current = h;
        layoutRef.current = layout;
        fontSizeRef.current = fontSize;

        canvas.width = Math.max(1, Math.ceil(w * dpr));
        canvas.height = Math.max(1, Math.ceil(h * dpr));
        canvas.style.cssText = `width:${w}px;height:${h}px;`;

        if (dprChanged || fontChanged) {
          glyphAtlasRef.current.clear();
        }

        ensureCells(count);
        draw(performance.now());
      };

      resize();

      const ro = new ResizeObserver(resize);
      ro.observe(el);

      return () => {
        ro.disconnect();
      };
    }, []);

    useEffect(() => {
      let cancelled = false;

      document.fonts?.ready.then(() => {
        if (cancelled) return;

        glyphAtlasRef.current.clear();
        draw(performance.now());
      });

      return () => {
        cancelled = true;
      };
    }, []);

    useEffect(() => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (!isAnimating || reducedMotion) {
        draw(performance.now());
        return;
      }

      mountedRef.current = true;
      animStartRef.current = performance.now();
      lastTickRef.current = animStartRef.current;
      tickStepRef.current = 0;

      const loop = (now: number) => {
        if (!mountedRef.current) return;

        if (!document.hidden && now - lastTickRef.current >= TICK_MS) {
          lastTickRef.current = now;
          updateCells(now);
        }

        if (!document.hidden) {
          draw(now);
        }

        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);

      return () => {
        mountedRef.current = false;

        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      };
    }, [isAnimating, reducedMotion]);

    const rootClassName = className ? `${styles.rootStyles} ${className}` : styles.rootStyles;

    return (
      <div ref={rootRef} className={rootClassName} aria-hidden="true">
        <canvas ref={canvasRef} className={styles.canvasStyles} />
        <div className={styles.noiseOverlayStyles} />
      </div>
    );
  },
  (prev, next) => prev.isAnimating === next.isAnimating && prev.className === next.className,
);
