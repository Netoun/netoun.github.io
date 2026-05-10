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

export const filterContainerStyle = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  justifyContent: "center",
  marginBottom: vars.spacing.xl,
});

export const filterButtonBase = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  padding: "6px 16px",
  borderRadius: "999px",
  border: "1px solid oklch(0.88 0.02 80 / 0.5)",
  background: "oklch(1 0 0 / 0.4)",
  color: "oklch(0.45 0.03 80)",
  cursor: "pointer",
  transition: "all 0.2s ease",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  ":hover": {
    background: "oklch(1 0 0 / 0.7)",
    color: vars.colors.foreground,
    borderColor: vars.colors.primary,
  },
});

export const filterButtonActive = style({
  background: vars.colors.primary,
  color: "oklch(0.2 0.05 85)",
  borderColor: vars.colors.primary,
  fontWeight: vars.fontWeight.bold,
});

export const emptyStateStyle = style({
  textAlign: "center",
  padding: `${vars.spacing["3xl"]} 0`,
  color: vars.colors.mutedForeground,
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: vars.fontSize.lg,
});
