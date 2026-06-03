import { style } from "@vanilla-extract/css";

/** Fills its positioned parent. Parent must be position: relative/absolute/fixed. */
export const meshCanvas = style({
  position: "absolute",
  inset: 0,
  display: "block",
  width: "100%",
  height: "100%",
});
