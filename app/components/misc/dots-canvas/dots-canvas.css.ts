import { style } from "@vanilla-extract/css";

export const dotsCanvasStyles = style({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 1,
  transform: "translateZ(0)",
  willChange: "contents",
});
