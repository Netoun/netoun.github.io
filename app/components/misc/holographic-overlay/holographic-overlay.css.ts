import { style } from "@vanilla-extract/css";

export const holographicOverlayStyles = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 100,
  opacity: 1,
  mixBlendMode: "plus-lighter",
});
