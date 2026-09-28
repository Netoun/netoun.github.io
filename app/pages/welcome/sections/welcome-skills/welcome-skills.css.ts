import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const sectionStyle = style({
  position: "relative",
  paddingTop: vars.spacing["3xl"],
  paddingBottom: vars.spacing["3xl"],
  // Clears the fixed sections nav so anchor jumps don't hide the section header under it.
  scrollMarginTop: vars.spacing["3xl"],
});

export const contentStyle = style({
  position: "relative",
  zIndex: 1,
});
