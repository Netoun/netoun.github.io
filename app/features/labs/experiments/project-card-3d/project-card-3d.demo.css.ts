import { style } from "@vanilla-extract/css";

/** Centers the card in the stage area at a comfortable max-width. */
export const stageInner = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  padding: "2rem 1rem",
});

export const cardWrapper = style({
  width: "360px",
  maxWidth: "100%",
});
