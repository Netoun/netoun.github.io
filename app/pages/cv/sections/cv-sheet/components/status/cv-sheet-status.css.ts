import { style } from "@vanilla-extract/css";
import { vars } from "@styles/theme.css";
import { label, u } from "../../cv-sheet-metrics";

// The footer's status strip, at the foot of the sheet: when this page was built, from what.
export const status = style({
  ...label,
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: u(12),
  marginTop: "auto",
  paddingTop: u(8),
  borderTop: `1px solid ${vars.colors.cardBorder}`,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: vars.colors.mutedForeground,
  fontVariantNumeric: "tabular-nums",
});

export const line = style({
  margin: 0,
});

export const link = style({
  color: "inherit",
  textDecoration: "none",
  ":hover": { textDecoration: "underline", textUnderlineOffset: u(3) },
});
