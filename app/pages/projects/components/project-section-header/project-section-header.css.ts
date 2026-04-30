import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const containerStyle = style({
  marginBottom: vars.spacing["2xl"],
});

export const titleStyle = style({
  fontSize: vars.fontSize["5xl"],
  color: vars.colors.foreground,
  marginBottom: vars.spacing.sm,
  textShadow: `0 0 40px color-mix(in srgb, ${vars.colors.primary} 25%, transparent)`,
});

export const prefixStyle = style({
  color: vars.colors.primary,
  marginRight: vars.spacing.sm,
  filter: "brightness(0.75)",
});

export const cursorStyle = style({
  color: vars.colors.primary,
  animation: "blink 1s step-end infinite",
});

export const subtitleStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.sm,
  color: "oklch(0.5 0.04 80)",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
});
