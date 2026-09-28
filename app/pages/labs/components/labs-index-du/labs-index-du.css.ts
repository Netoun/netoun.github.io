import { style } from "@vanilla-extract/css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";

// Printed on the paper in Doto 800, as `du` prints it: size, directory, then what it holds.
const machine = {
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  ...weight(800),
  letterSpacing: "0.06em",
  fontVariantNumeric: "tabular-nums",
} as const;

export const tableStyle = style({
  ...machine,
  borderCollapse: "collapse",
  color: vars.colors.foreground,
});

export const captionStyle = style({
  captionSide: "top",
  textAlign: "left",
  paddingBottom: vars.spacing.sm,
  color: vars.colors.mutedForeground,
  letterSpacing: "0.04em",
});

const cell = {
  height: "1.625rem",
  padding: 0,
  textAlign: "left",
  whiteSpace: "nowrap",
  borderTop: `1px solid ${vars.colors.border}`,
} as const;

export const sizeStyle = style({
  ...cell,
  minWidth: "3.5rem",
  paddingRight: vars.spacing.md,
  textAlign: "right",
});

export const dirStyle = style({
  ...cell,
  ...weight(800),
  paddingRight: vars.spacing.xl,
});

export const countStyle = style({
  ...cell,
  textAlign: "right",
  textTransform: "uppercase",
  color: vars.colors.mutedForeground,
});

// The total closes the table under a stronger rule.
export const totalStyle = style({
  boxShadow: `inset 0 1px 0 ${vars.colors.foreground}`,
});
