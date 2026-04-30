import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const sectionStyle = style({
  position: "relative",
  overflow: "hidden",
  backgroundColor: "oklch(0.96 0.015 80)",
  paddingTop: vars.spacing["3xl"],
  paddingBottom: vars.spacing["3xl"],
});

export const blobStyle = style({
  position: "absolute",
  borderRadius: "50%",
  pointerEvents: "none",
});

export const blobGoldStyle = style({
  width: "600px",
  height: "500px",
  top: "-150px",
  left: "-100px",
  background: vars.colors.primary,
  opacity: 0.15,
  filter: "blur(100px)",
});

export const blobCyanStyle = style({
  width: "450px",
  height: "400px",
  bottom: "-80px",
  right: "5%",
  background: vars.colors.secondary,
  opacity: 0.12,
  filter: "blur(100px)",
});

export const blobVioletStyle = style({
  width: "380px",
  height: "340px",
  top: "30%",
  right: "-60px",
  background: vars.colors.tertiary,
  opacity: 0.08,
  filter: "blur(100px)",
});

export const contentStyle = style({
  position: "relative",
  zIndex: 1,
});

export const gridStyle = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: vars.spacing.xl,

  "@media": {
    [breakpoints.md]: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    [breakpoints.lg]: {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
  },
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
