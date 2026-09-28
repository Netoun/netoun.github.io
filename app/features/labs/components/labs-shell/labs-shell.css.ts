import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const shellStyle = style({
  display: "flex",
  flexDirection: "column",
  minHeight: "100svh",
});

// The dock steps away as soon as the footer shows, so the page only has to end a dock's height
// (1.5rem + 3.25rem at most) above the footer: this padding plus the footer's own 3rem top.
export const mainStyle = style({
  flex: 1,
  paddingBottom: vars.spacing.xl,
});
