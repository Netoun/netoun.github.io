import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const stageInner = style({
  width: "100%",
  maxWidth: "40rem",
});

export const meshBox = style({
  position: "relative",
  width: "100%",
  height: "22rem",
  borderRadius: vars.radius.md,
  overflow: "hidden",
  border: `1px solid ${vars.colors.cardBorder}`,
});
