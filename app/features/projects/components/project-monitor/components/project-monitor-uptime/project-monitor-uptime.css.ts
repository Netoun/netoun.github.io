import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const uptimeStyle = style({
  flexShrink: 0,
  color: vars.colors.mutedForeground,
  letterSpacing: "0.1em",
  fontVariantNumeric: "tabular-nums",
});
