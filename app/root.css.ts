import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

/** Root stacking context: z-indices inside the app never compete with overlays portaled to `body`. */
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
