import { arrival, motion } from "@styles/motion.css";
import { vars } from "@styles/theme.css";
import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { weight } from "@styles/weight";

// Segments light up one by one after the command has typed (ms from the section reveal).
const LIT_START = arrival.output - 200;
const LIT_STEP = 35;
const MAX_STAGGERED_SEGMENTS = 16;
const CUBE_STEP = 140;

// A lit segment reads as a small LED: brighter at the top, the domain colour below.
const led = (color: string) =>
  `linear-gradient(180deg, color-mix(in srgb, ${color} 62%, white), ${color} 70%)`;

export const metersStyle = style({
  margin: 0,
  padding: 0,
  listStyle: "none",
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  fontFamily: vars.fontFamily.doto,
  ...weight(vars.fontWeight.extrabold),
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.1em",
  fontVariantNumeric: "tabular-nums",
});

export const meterStyle = style({
  display: "grid",
  // The label column fits SYSTEMS & AI, the longest domain name.
  gridTemplateColumns: "1.25rem 7.25rem auto minmax(0, 1fr) auto 4.5rem",
  alignItems: "center",
  gap: "0.3rem",
});

export const meterCubeStyle = style({
  justifySelf: "center",
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
});

// Each domain cube turns once as its meter lights, then rests.
globalStyle(`[data-reveal="revealed"] ${meterCubeStyle}`, {
  animation: `monitor-cube-spin 900ms ${motion.easing.signature} both`,
  animationDelay: `${LIT_START}ms`,
});

for (let index = 0; index < 4; index += 1) {
  globalStyle(`[data-reveal="revealed"] ${meterStyle}:nth-child(${index + 1}) ${meterCubeStyle}`, {
    animationDelay: `${LIT_START + index * CUBE_STEP}ms`,
  });
}

export const meterLabelStyle = style({
  color: vars.colors.mutedForeground,
});

export const meterTrackStyle = style({
  display: "flex",
  gap: "3px",
  height: "0.875rem",
});

export const segmentStyle = recipe({
  base: {
    flex: 1,
    minWidth: "2px",
    borderRadius: "1px",
    backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 5%, transparent), color-mix(in srgb, ${vars.colors.foreground} 11%, transparent))`,
  },
  variants: {
    domain: {
      frontend: {},
      backend: {},
      creative: {},
      systems: {},
    },
    lit: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: { domain: "frontend", lit: true },
      style: { backgroundImage: led(vars.colors.secondary) },
    },
    {
      variants: { domain: "backend", lit: true },
      style: { backgroundImage: led(vars.colors.tertiary) },
    },
    {
      variants: { domain: "creative", lit: true },
      style: { backgroundImage: led(vars.colors.primary) },
    },
    {
      variants: { domain: "systems", lit: true },
      style: { backgroundImage: led(vars.colors.azure) },
    },
  ],
});

export const litSegmentStyle = style({});

globalStyle(`[data-reveal="idle"] ${litSegmentStyle}`, {
  opacity: 0.12,
});

globalStyle(`[data-reveal="revealed"] ${litSegmentStyle}`, {
  animation: `monitor-lit 160ms ${motion.easing.out} both`,
  animationDelay: `${LIT_START + MAX_STAGGERED_SEGMENTS * LIT_STEP}ms`,
});

for (let index = 0; index < MAX_STAGGERED_SEGMENTS; index += 1) {
  globalStyle(`[data-reveal="revealed"] ${litSegmentStyle}:nth-child(${index + 1})`, {
    animationDelay: `${LIT_START + index * LIT_STEP}ms`,
  });
}

export const meterValueStyle = style({
  textAlign: "right",
});
