import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const sectionStyle = style({
  position: "relative",
  overflow: "hidden",
  paddingTop: vars.spacing["3xl"],
  paddingBottom: vars.spacing["3xl"],
});

export const contentStyle = style({
  position: "relative",
  zIndex: 1,
});

export const gridStyle = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
  gap: vars.spacing.xl,
});


