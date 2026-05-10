import { style } from "@vanilla-extract/css";

export const bodyGrainOverlayStyles = style({
  position: "fixed",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 0,
  opacity: 1,
});
