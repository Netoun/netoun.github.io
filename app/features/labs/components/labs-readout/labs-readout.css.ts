import { style } from "@vanilla-extract/css";
import { motion } from "@styles/motion.css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

// An xray readout printed on the stage's ink (HUDs, shaders): paper at set strengths, gold for
// the formulas. Glitch Signal Map's readout is the model.
const paper = (percent: number) =>
  `color-mix(in srgb, ${vars.colors.background} ${percent}%, transparent)`;
const dim = vars.colors.mutedForegroundOnDark;
const machine = {
  fontFamily: vars.fontFamily.doto,
  ...weight(800),
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontVariantNumeric: "tabular-nums",
} as const;

export const readout = style({
  display: "flex",
  flexDirection: "column",
  width: "18.75rem",
  maxWidth: "100%",
  color: vars.colors.background,
  animation: `labs-row ${motion.duration.base} ${motion.easing.signature} both`,
});

export const kicker = style({
  ...machine,
  ...weight(900),
  margin: 0,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.14em",
  color: vars.colors.primary,
});

export const figure = style({
  ...machine,
  ...weight(900),
  margin: `${vars.spacing.sm} 0 0`,
  fontSize: "1.75rem",
  lineHeight: 1.1,
  letterSpacing: "0.04em",
});

export const line = style({
  ...machine,
  margin: "0.375rem 0 0",
  fontSize: vars.fontSize.xs,
  color: dim,
});

export const code = style({
  margin: "0.25rem 0 0",
  fontFamily: vars.fontFamily.mono,
  fontSize: vars.fontSize.xs,
  lineHeight: 1.5,
  color: vars.colors.primary,
  overflowWrap: "anywhere",
});

export const rows = style({
  display: "flex",
  flexDirection: "column",
  margin: `${vars.spacing.md} 0 0`,
  padding: 0,
  listStyle: "none",
});

export const row = style({
  display: "grid",
  gridTemplateColumns: "1.375rem minmax(0, 1fr) auto",
  columnGap: "0.625rem",
  rowGap: "0.125rem",
  alignItems: "center",
  padding: `${vars.spacing.sm} 0`,
  borderTop: `1px solid ${paper(9)}`,
});

export const swatch = style({
  width: "1.375rem",
  height: "0.5625rem",
  borderRadius: "1px",
});

export const rowLabel = style({
  ...machine,
  ...weight(900),
  fontSize: vars.fontSize.xs,
});

export const rowValue = style({
  ...machine,
  ...weight(900),
  fontSize: vars.fontSize.sm,
});

export const rowRule = style({
  gridColumn: "2 / 4",
  fontFamily: vars.fontFamily.mono,
  fontSize: "0.6875rem",
  color: dim,
});

export const section = style({
  margin: `${vars.spacing.md} 0 0`,
  paddingTop: vars.spacing.sm,
  borderTop: `1px solid ${paper(9)}`,
});
