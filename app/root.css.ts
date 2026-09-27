import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

/** Keeps page content above the fixed `BodyGrainOverlay` canvas. */
export const appContent = style({
  position: "relative",
  zIndex: 1,
});

export const errorPage = style({
  paddingBlock: `${vars.spacing["3xl"]} ${vars.spacing.md}`,
});

export const errorStack = style({
  width: "100%",
  padding: vars.spacing.md,
  overflowX: "auto",
});
