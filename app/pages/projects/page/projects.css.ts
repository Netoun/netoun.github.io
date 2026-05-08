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

export const blobVioletStyle = style({
  width: "450px",
  height: "400px",
  top: "20%",
  right: "-100px",
  background: vars.colors.tertiary,
  opacity: 0.1,
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

export const emptyStateStyle = style({
  textAlign: "center",
  padding: `${vars.spacing["3xl"]} 0`,
  color: vars.colors.mutedForeground,
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: vars.fontSize.lg,
});
