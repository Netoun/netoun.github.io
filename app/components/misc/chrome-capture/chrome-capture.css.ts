import { motion } from "@styles/motion.css";
import { vars } from "@styles/theme.css";
import { createVar, fallbackVar, globalStyle, style } from "@vanilla-extract/css";
import { chromeReflection } from "@/hooks/use-chrome-reflection.css";
import { weight } from "@styles/weight";

// Polished chrome: cool silvers, a hair of the brand mint in the glint. The pointer over the
// surface that runs use-chrome-reflection.hook.ts (the monitor, the Labs loupe) turns the bezel
// (`chromeReflection.x`) and moves the glint (both axes); without it the chrome rests at a
// fixed angle.
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

/**
 * The screen's own ground behind a `contain` capture (ink glass, lit paper), set by the
 * consumer's `screenClassName` through these vars: a class never has to out-rank the frame's.
 */
export const chromeScreen = {
  color: createVar(),
  image: createVar(),
};

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
  selectors: {
    '&[data-size="sm"]': {
      padding: "3px",
      borderRadius: "6px",
    },
  },
});

export const frameStyle = style({
  position: "relative",
  display: "block",
  overflow: "hidden",
  aspectRatio: "16 / 10",
  borderRadius: "6px",
  backgroundColor: fallbackVar(chromeScreen.color, vars.colors.cardBorder),
  backgroundImage: fallbackVar(chromeScreen.image, "none"),
  // Seated behind the bezel: a dark lip and the glass sheen over the capture.
  boxShadow: `0 0 0 1px color-mix(in srgb, ${silver.deep} 85%, transparent)`,
  selectors: {
    [`${captureStyle}[data-size="sm"] &`]: {
      borderRadius: "3px",
    },
  },
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
  selectors: {
    // A cut-out specimen (transparent WebP) sits whole on the screen's own ground.
    '&[data-fit="contain"]': {
      objectFit: "contain",
      padding: "6%",
      boxSizing: "border-box",
    },
  },
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

/** Xray only: the depth between two layers of the stack (a length, set by the Lab). */
export const chromeLayerGap = createVar();
const gap = fallbackVar(chromeLayerGap, "0px");

// Xray (the Lab): the capture laid down and its four layers lifted apart — bezel, screen,
// glass, glint — so each reads alone. The frame stops clipping (clipping would flatten the
// stack into one plane). Nothing else sets `data-xray`.
const xray = `${captureStyle}[data-xray]`;
const settle = `transform 420ms ${motion.easing.signature}`;

globalStyle(xray, {
  transformStyle: "preserve-3d",
  transform: "rotateX(52deg) rotateZ(-30deg)",
  transition: settle,
});

globalStyle(`${xray} ${frameStyle}`, {
  overflow: "visible",
  transformStyle: "preserve-3d",
  transform: `translateZ(${gap})`,
  transition: settle,
});

globalStyle(`${xray} ${frameStyle}::after`, {
  transform: `translateZ(${gap})`,
  backgroundColor: "color-mix(in srgb, white 12%, transparent)",
  outline: `1px dashed color-mix(in srgb, ${vars.colors.foreground} 45%, transparent)`,
  transition: settle,
});

globalStyle(`${xray} ${glintStyle}`, {
  opacity: 0.9,
  transform: `translateZ(calc(2 * ${gap}))`,
  outline: `1px dashed ${vars.colors.secondary}`,
  transition: settle,
});

// Each layer names itself in its corner (the glass is the frame's own ::after: it has no room
// for a label, the Lab's panel names it).
const layerLabel = (text: string) =>
  ({
    content: `"${text}"`,
    position: "absolute",
    zIndex: 1,
    top: "-1.375rem",
    left: 0,
    padding: "1px 5px",
    borderRadius: "2px",
    fontFamily: vars.fontFamily.doto,
    ...weight(800),
    fontSize: "10px",
    lineHeight: 1.4,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    color: vars.colors.foreground,
    backgroundColor: vars.colors.primary,
  }) as const;

globalStyle(`${xray}::before`, { ...layerLabel("0 · bezel"), top: "auto", bottom: "-1.375rem" });
globalStyle(`${xray} ${frameStyle}::before`, layerLabel("1 · screen"));
globalStyle(`${xray} ${glintStyle}::before`, {
  ...layerLabel("3 · glint"),
  left: "auto",
  right: 0,
});

globalStyle(`${xray}, ${xray} ${frameStyle}, ${xray} ${frameStyle}::after, ${xray} ${glintStyle}`, {
  "@media": { "(prefers-reduced-motion: reduce)": { transition: "none" } },
});
