import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const squareGridContentStyles = style({
  display: "grid",
  gridAutoFlow: "row",
  gridTemplateColumns: "repeat(var(--grid-columns, auto-fill), var(--square-size, 12px))",
  gap: 0,
  overflow: "hidden",
  fontSize: vars.fontSize.xs,
  alignContent: "start",
  justifyContent: "start",
  boxShadow: vars.boxShadow.sm,
  background: "black",
  borderRadius: vars.radius.sm,
});

export const squareGridItemStyles = style({
  width: "var(--square-size, 12px)",
  height: "var(--square-size, 12px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
  willChange: "opacity, transform",
  fontSize: "10px",
  lineHeight: 1,
  color: "white",
  selectors: {
    '&[data-filled="true"]': {
      opacity: 1,
    },
    '&[data-filled="false"]': {
      opacity: 0.3,
    },
  },
});
