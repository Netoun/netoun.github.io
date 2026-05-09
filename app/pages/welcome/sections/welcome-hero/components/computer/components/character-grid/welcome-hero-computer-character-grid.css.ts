import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const characterGridContentStyles = style({
  width: "50%",
  height: "50%",
  display: "grid",
  gridAutoFlow: "row",
  gridTemplateColumns: "repeat(var(--grid-columns, auto-fill), 12px)",
  gap: 0,
  overflow: "hidden",
  fontSize: vars.fontSize.xs,
  alignContent: "start",
  justifyContent: "start",
  boxShadow: vars.boxShadow.sm,
  background: "black",
  borderRadius: vars.radius.sm,
});

export const characterGridItemStyles = style({
  width: "12px",
  height: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
  willChange: "opacity, transform",
  fontSize: "10px",
  lineHeight: 1,
});
