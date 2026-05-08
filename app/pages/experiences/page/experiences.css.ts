import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const pageStyle = style({
  position: "relative",
  zIndex: 1,
  paddingTop: vars.spacing["3xl"],
  paddingBottom: vars.spacing["3xl"],
  minHeight: "100vh",
  width: "100%",
});

export const timelineStyle = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xl,
  paddingLeft: "32px",

  "@media": {
    [breakpoints.md]: {
      paddingLeft: "48px",
    },
  },
});

export const emptyStateStyle = style({
  textAlign: "center",
  padding: `${vars.spacing["3xl"]} 0`,
  color: vars.colors.mutedForeground,
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: vars.fontSize.lg,
});
