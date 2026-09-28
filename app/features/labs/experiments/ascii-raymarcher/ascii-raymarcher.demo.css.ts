import { style } from "@vanilla-extract/css";
import { motion } from "@styles/motion.css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

// The lookup table prints on the stage's ink, under the screen.
const machine = {
  fontFamily: vars.fontFamily.doto,
  ...weight(800),
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontVariantNumeric: "tabular-nums",
} as const;
const dim = vars.colors.mutedForegroundOnDark;

export const stage = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: vars.spacing.md,
  width: "100%",
});

export const lookup = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  width: "100%",
  maxWidth: "48.5rem",
  color: vars.colors.background,
  animation: `labs-row ${motion.duration.base} ${motion.easing.signature} both`,
});

export const lookupTitle = style({
  ...machine,
  ...weight(900),
  margin: 0,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.14em",
  color: vars.colors.primary,
});

export const buckets = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(3.25rem, 1fr))",
  gap: "0.375rem",
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const bucket = style({
  display: "grid",
  gridTemplateRows: "1.875rem auto auto auto auto",
  justifyItems: "center",
  gap: "0.125rem",
  padding: "0.375rem 0.25rem",
  borderRadius: "0.375rem",
  boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${vars.colors.background} 12%, transparent)`,
  selectors: {
    "&[data-probed]": { boxShadow: `inset 0 0 0 2px ${vars.colors.primary}` },
  },
});

export const bar = style({
  position: "relative",
  alignSelf: "stretch",
  width: "0.5rem",
  justifySelf: "center",
  borderRadius: "1px",
  backgroundColor: `color-mix(in srgb, ${vars.colors.background} 8%, transparent)`,
});

const levels = Object.fromEntries(
  Array.from({ length: 11 }, (_, level) => [level, { height: `${Math.max(level * 10, 4)}%` }]),
);

export const barFill = style({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: "1px",
  backgroundColor: vars.colors.secondary,
  transition: `height ${motion.duration.fast} ${motion.easing.out}`,
  selectors: Object.fromEntries(
    Object.entries(levels).map(([level, value]) => [`&[data-level='${level}']`, value]),
  ),
});

export const glyph = style({
  fontFamily: vars.fontFamily.doto,
  ...weight(900),
  fontSize: vars.fontSize.lg,
  lineHeight: 1.1,
  color: vars.colors.secondary,
  selectors: { "&[data-word]": { fontSize: vars.fontSize.xs } },
});

export const bucketIndex = style({ ...machine, ...weight(900), fontSize: vars.fontSize.xs });

export const threshold = style({
  fontFamily: vars.fontFamily.mono,
  fontSize: "0.625rem",
  color: dim,
});

export const count = style({ ...machine, fontSize: "0.6875rem", color: dim });

export const probe = style({
  minHeight: "1.125rem",
  margin: 0,
  fontFamily: vars.fontFamily.mono,
  fontSize: vars.fontSize.xs,
  color: dim,
});
