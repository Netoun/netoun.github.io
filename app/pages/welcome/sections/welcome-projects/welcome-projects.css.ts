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

export const gridStyle = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
  gap: vars.spacing.xl,
});

export const footerStyle = style({
  display: "flex",
  justifyContent: "center",
  marginTop: vars.spacing["2xl"],
});

export const viewAllStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "oklch(0.5 0.04 80)",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  transition: "color 0.2s",

  ":hover": {
    color: vars.colors.foreground,
  },
});

export const viewAllArrowStyle = style({
  color: vars.colors.primary,
  transition: "transform 0.2s cubic-bezier(.22,1,.36,1)",

  selectors: {
    [`${viewAllStyle}:hover &`]: {
      transform: "translateX(4px)",
    },
  },
});
