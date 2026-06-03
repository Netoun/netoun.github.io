import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

/** Portrait "computer screen" frame the hero HUD widgets are designed to fill. */
export const screen = style({
  position: "relative",
  width: "18rem",
  maxWidth: "100%",
  height: "24rem",
  borderRadius: vars.radius.md,
  overflow: "hidden",
});
