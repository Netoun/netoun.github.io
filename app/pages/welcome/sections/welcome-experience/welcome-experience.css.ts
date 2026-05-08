import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const sectionStyle = style({
  position: "relative",
  overflow: "hidden",
  paddingTop: vars.spacing["3xl"],
  paddingBottom: vars.spacing["3xl"],
});

export const contentStyle = style({
  position: "relative",
  zIndex: 1,
});

export const timelineStyle = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  paddingLeft: "32px",

  "@media": {
    [breakpoints.md]: {
      paddingLeft: "48px",
    },
  },
});
