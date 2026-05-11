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

export const skillsGridStyle = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: vars.spacing.md,

  "@media": {
    [breakpoints.md]: {
      gap: vars.spacing.xl,
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
});


