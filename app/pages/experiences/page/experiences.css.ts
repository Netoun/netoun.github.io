import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const blobLayerStyle = style({
  position: "fixed",
  inset: 0,
  zIndex: 0,
  pointerEvents: "none",
  overflow: "hidden",
  backgroundColor: "oklch(0.96 0.015 80)",
});

export const blobStyle = style({
  position: "absolute",
  borderRadius: "50%",
  pointerEvents: "none",
});

export const blobGoldStyle = style({
  width: "700px",
  height: "600px",
  top: "-200px",
  left: "-150px",
  background: vars.colors.primary,
  opacity: 0.18,
  filter: "blur(120px)",
});

export const blobCyanStyle = style({
  width: "500px",
  height: "460px",
  bottom: "-100px",
  right: "10%",
  background: vars.colors.secondary,
  opacity: 0.14,
  filter: "blur(120px)",
});

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