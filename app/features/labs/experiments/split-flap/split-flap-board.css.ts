import { createVar, keyframes, style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

/** One flip, both leaves: the top falls in its first half, the bottom lands in its second. */
export const flipDuration = createVar();

// Sixteen flaps fill the board's own width (a container), 2.625rem at most: a phone gets the
// whole message, smaller.
const GAP = "clamp(0.1875rem, 0.8cqi, 0.375rem)";
const FLAP_W = `min(2.625rem, calc((100cqi - 15 * ${GAP}) / 16))`;
const HALF_FLIP = `calc(${flipDuration} / 2)`;

// Two identical pairs of keyframes: a flap swaps between them on every step (its parity), and
// a changed animation name restarts the animation.
const leafFallA = keyframes({
  from: { transform: "rotateX(0deg)" },
  to: { transform: "rotateX(-90deg)" },
});
const leafFallB = keyframes({
  from: { transform: "rotateX(0deg)" },
  to: { transform: "rotateX(-90deg)" },
});
const leafLandA = keyframes({
  from: { transform: "rotateX(90deg)" },
  to: { transform: "rotateX(0deg)" },
});
const leafLandB = keyframes({
  from: { transform: "rotateX(90deg)" },
  to: { transform: "rotateX(0deg)" },
});
const shadeA = keyframes({ "0%": { opacity: 0 }, "45%": { opacity: 0.6 }, "100%": { opacity: 0 } });
const shadeB = keyframes({ "0%": { opacity: 0 }, "45%": { opacity: 0.6 }, "100%": { opacity: 0 } });

const FALL = "cubic-bezier(0.55, 0, 0.85, 0.35)";
const LAND = "cubic-bezier(0.15, 0.6, 0.35, 1)";

const topCard = `linear-gradient(180deg, oklch(0.25 0.004 80), oklch(0.18 0.004 80))`;
const bottomCard = `linear-gradient(180deg, oklch(0.16 0.004 80), oklch(0.12 0.004 80))`;
const radius = "0.3125rem";

export const board = style({
  containerType: "inline-size",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: `calc(${GAP} * 2)`,
  width: "100%",
  maxWidth: "46rem",
});

export const srOnly = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
});

export const row = style({
  display: "flex",
  justifyContent: "center",
  gap: GAP,
});

export const cell = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.25rem",
});

export const flap = style({
  position: "relative",
  width: FLAP_W,
  aspectRatio: "42 / 62",
  perspective: "16rem",
  borderRadius: radius,
  boxShadow: `0 1px 0 color-mix(in srgb, white 6%, transparent), 0 6px 10px -6px oklch(0 0 0 / 0.85)`,
});

const half = {
  position: "absolute",
  left: 0,
  width: "100%",
  height: "50%",
  overflow: "hidden",
} as const;

const top = {
  ...half,
  top: 0,
  borderRadius: `${radius} ${radius} 0 0`,
  backgroundImage: topCard,
  boxShadow: `inset 0 1px 0 color-mix(in srgb, white 9%, transparent)`,
} as const;

const bottom = {
  ...half,
  top: "50%",
  borderRadius: `0 0 ${radius} ${radius}`,
  backgroundImage: bottomCard,
} as const;

export const staticTop = style(top);
export const staticBottom = style(bottom);

export const leafTop = style({
  ...top,
  transformOrigin: "50% 100%",
  backfaceVisibility: "hidden",
  selectors: {
    [`${flap}[data-parity='a'] &`]: { animation: `${leafFallA} ${HALF_FLIP} ${FALL} both` },
    [`${flap}[data-parity='b'] &`]: { animation: `${leafFallB} ${HALF_FLIP} ${FALL} both` },
  },
});

export const leafBottom = style({
  ...bottom,
  transformOrigin: "50% 0",
  backfaceVisibility: "hidden",
  selectors: {
    [`${flap}[data-parity='a'] &`]: {
      animation: `${leafLandA} ${HALF_FLIP} ${LAND} ${HALF_FLIP} both`,
    },
    [`${flap}[data-parity='b'] &`]: {
      animation: `${leafLandB} ${HALF_FLIP} ${LAND} ${HALF_FLIP} both`,
    },
  },
});

// The falling leaf's shadow on the old bottom half.
export const shade = style({
  position: "absolute",
  inset: 0,
  opacity: 0,
  backgroundImage: "linear-gradient(180deg, oklch(0 0 0 / 0.9), oklch(0 0 0 / 0.25))",
  selectors: {
    [`${flap}[data-parity='a'] &`]: { animation: `${shadeA} ${flipDuration} linear both` },
    [`${flap}[data-parity='b'] &`]: { animation: `${shadeB} ${flipDuration} linear both` },
  },
});

export const glyph = style({
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "200%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: vars.fontFamily.ppNeueMontreal,
  ...weight(700),
  fontSize: `calc(${FLAP_W} * 0.95)`,
  lineHeight: 1,
  color: vars.colors.background,
  selectors: {
    "&[data-half='bottom']": { top: "-100%" },
    "&[data-mark]": { color: vars.colors.primary },
  },
});

// The split line, and the axle pins it turns on.
export const hinge = style({
  position: "absolute",
  left: 0,
  right: 0,
  top: "calc(50% - 1px)",
  height: "2px",
  backgroundColor: "oklch(0.04 0 0)",
  selectors: {
    "&::before, &::after": {
      content: "",
      position: "absolute",
      top: "-0.1875rem",
      width: "0.1875rem",
      height: "0.5rem",
      borderRadius: "1px",
      backgroundImage: "linear-gradient(180deg, oklch(0.52 0 0), oklch(0.3 0 0))",
    },
    "&::before": { left: "-0.1875rem" },
    "&::after": { right: "-0.1875rem" },
  },
});

export const steps = style({
  fontFamily: vars.fontFamily.doto,
  ...weight(800),
  fontSize: `clamp(0.5625rem, 1.6cqi, 0.75rem)`,
  lineHeight: 1.2,
  letterSpacing: "0.04em",
  fontVariantNumeric: "tabular-nums",
  color: vars.colors.mutedForeground,
  selectors: {
    "&[data-moving]": {
      color: `color-mix(in oklab, ${vars.colors.secondary} 70%, ${vars.colors.foreground})`,
    },
  },
});
