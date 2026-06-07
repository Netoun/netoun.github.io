import { style } from "@vanilla-extract/css";

/** SVG fills its parent box; tint comes from the parent's `color` (currentColor). */
export const icon = style({
  display: "block",
  width: "100%",
  height: "100%",
});
