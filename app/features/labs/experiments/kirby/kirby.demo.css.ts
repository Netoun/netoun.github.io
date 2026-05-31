import { style } from "@vanilla-extract/css";

/** Centered wrapper that holds the Kirby component at natural size. */
export const stageInner = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

/** Fixed-size box that scales and rotates with the user controls. */
export const kirbyWrapper = style({
  width: "12rem",
  maxWidth: "100%",
});
