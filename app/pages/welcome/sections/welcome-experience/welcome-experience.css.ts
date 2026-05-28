import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const sectionStyle = style({
  position: "relative",
  overflow: "hidden",
  paddingTop: vars.spacing["2xl"],
  paddingBottom: vars.spacing["2xl"],
});

export const contentStyle = style({
  position: "relative",
  zIndex: 1,
});

export const timelineStyle = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",

  "@media": {
    [breakpoints.md]: {
      paddingLeft: "48px",
    },
  },
});
