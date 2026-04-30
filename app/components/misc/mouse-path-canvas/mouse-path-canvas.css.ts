import { style } from "@vanilla-extract/css";

export const mousePathCanvasStyles = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  zIndex: 10,
  pointerEvents: "none",
  // GPU acceleration
  transform: "translateZ(0)",
  willChange: "contents",
});
