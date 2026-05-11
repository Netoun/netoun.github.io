import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  gap: vars.spacing.xs,
});

export const red = style({
  width: 10,
  height: 10,
  borderRadius: vars.radius.full,
  backgroundColor: `color-mix(in srgb, ${vars.colors.destructive} 75%, ${vars.colors.primary} 25%)`,
});

export const yellow = style({
  width: 10,
  height: 10,
  borderRadius: vars.radius.full,
  backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 68%, ${vars.colors.secondary} 32%)`,
});

export const green = style({
  width: 10,
  height: 10,
  borderRadius: vars.radius.full,
  backgroundColor: `color-mix(in srgb, ${vars.colors.secondary} 72%, ${vars.colors.primary} 28%)`,
});
