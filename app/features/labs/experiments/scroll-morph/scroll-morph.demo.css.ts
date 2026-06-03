import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const stageInner = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minHeight: "16rem",
});

export const morphCard = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "20rem",
  height: "12rem",
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.colors.cardBorder}`,
  background: `linear-gradient(135deg, color-mix(in srgb, ${vars.colors.tertiary} 28%, ${vars.colors.card}), ${vars.colors.card})`,
  color: vars.colors.foreground,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize["2xl"],
  willChange: "transform",
  transition: "transform 0.08s linear",
});
