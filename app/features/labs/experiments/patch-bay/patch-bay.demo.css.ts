import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

export const stage = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: vars.spacing.sm,
  width: "100%",
});

export const hint = style({
  margin: 0,
  fontFamily: vars.fontFamily.doto,
  ...weight(800),
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  textAlign: "center",
  color: vars.colors.mutedForeground,
});
