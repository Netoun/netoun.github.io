import { style } from "@vanilla-extract/css";

/** Root stacking context: z-indices inside the app never compete with overlays portaled to `body`. */
export const appContent = style({
  position: "relative",
  zIndex: 1,
});
