import { style } from "@vanilla-extract/css";

/** Canvas fills its positioned parent absolutely. */
export const grainCanvas = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  display: "block",
});
