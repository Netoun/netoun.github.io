import { motion } from "@styles/motion.css";
import { vars } from "@styles/theme.css";
import { fallbackVar, globalStyle, style } from "@vanilla-extract/css";
import { chromeReflection } from "@/features/projects/hooks/use-chrome-reflection.css";

// Polished chrome: cool silvers, a hair of the brand mint in the glint. The pointer over the
// monitor turns the bezel (`chromeReflection.x`) and moves the glint (both axes),
// set by use-chrome-reflection.hook.ts; without it the chrome rests at a fixed angle.
const silver = {
  light: "oklch(0.95 0.004 250)",
  bright: "oklch(0.995 0 0)",
  mid: "oklch(0.7 0.01 250)",
  deep: "oklch(0.42 0.012 250)",
};

const BEZEL = `conic-gradient(from calc(${fallbackVar(chromeReflection.x, "0.35")} * 360deg) at 50% 50%,
  ${silver.light}, ${silver.deep} 9%, ${silver.bright} 19%, ${silver.mid} 29%, ${silver.deep} 41%,
  ${silver.bright} 54%, ${silver.mid} 66%, ${silver.deep} 78%, ${silver.bright} 90%, ${silver.light})`;

const GLINT = `linear-gradient(115deg,
  transparent 34%,
  color-mix(in srgb, white 38%, transparent) 44%,
  color-mix(in srgb, ${vars.colors.secondary} 16%, transparent) 48%,
  color-mix(in srgb, white 30%, transparent) 52%,
  transparent 62%)`;

// Glass over the screen: a faint sheen along the top edge, always there.
const GLASS = `linear-gradient(180deg, color-mix(in srgb, white 16%, transparent), transparent 38%)`;

export const captureStyle = style({
  position: "relative",
  display: "block",
  padding: "5px",
  borderRadius: "10px",
  background: BEZEL,
  boxShadow: `
    0 0 0 1px color-mix(in srgb, ${silver.deep} 55%, transparent),
    0 1px 2px color-mix(in srgb, ${vars.colors.foreground} 12%, transparent),
    0 10px 22px -12px color-mix(in srgb, ${vars.colors.foreground} 45%, transparent),
    inset 0 1px 0 color-mix(in srgb, white 70%, transparent)
  `,
});

export const frameStyle = style({
  position: "relative",
  display: "block",
  overflow: "hidden",
  aspectRatio: "16 / 10",
  borderRadius: "6px",
  backgroundColor: vars.colors.cardBorder,
  // Seated behind the bezel: a dark lip and the glass sheen over the capture.
  boxShadow: `0 0 0 1px color-mix(in srgb, ${silver.deep} 85%, transparent)`,
  "::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    pointerEvents: "none",
    backgroundImage: GLASS,
    boxShadow: `inset 0 1px 3px color-mix(in srgb, black 45%, transparent)`,
  },
});

export const imageStyle = style({
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

export const glintStyle = style({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  mixBlendMode: "screen",
  backgroundImage: GLINT,
  backgroundSize: "260% 260%",
  backgroundPosition: `calc(${fallbackVar(chromeReflection.x, "0.5")} * 100%) calc(${fallbackVar(chromeReflection.y, "0.5")} * 100%)`,
  opacity: 0,
  transition: `opacity ${motion.duration.base} ${motion.easing.out}`,
  "@media": {
    // No pointer to follow: the glint rests, faint, where the light would sit.
    "(hover: none)": {
      opacity: 0.45,
      backgroundPosition: "30% 20%",
    },
  },
});

// A new capture: one glint crosses it (keyed remount, see the component).
export const sweepStyle = style({
  animation: `monitor-chrome-sweep 900ms ${motion.easing.signature}`,
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
});

globalStyle(`[data-chrome="on"] ${glintStyle}`, {
  opacity: 0.9,
});
