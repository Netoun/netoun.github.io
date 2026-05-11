import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const iconGradientStartStopStyles = style({
  stopColor: vars.colors.secondary,
});

export const iconGradientMiddleStopStyles = style({
  stopColor: vars.colors.background,
});

export const iconGradientEndStopStyles = style({
  stopColor: vars.colors.tertiary,
});
