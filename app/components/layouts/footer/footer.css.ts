import { vars } from "@styles/theme.css";
import { style, keyframes } from "@vanilla-extract/css";
import { motion } from "@/styles/motion.css";
import { breakpoints } from "@/styles/responsive.css";

const pulse = keyframes({
  "0%, 100%": { transform: "scale(1)", opacity: 1 },
  "50%": { transform: "scale(1.2)", opacity: 0.8 },
});

export const footerStyle = style({
  paddingTop: vars.spacing["3xl"],
  paddingBottom: vars.spacing.xl,
  backgroundColor: "transparent",
});

export const footerVisualContainerStyle = style({
  position: "relative",
  overflow: "hidden",
  borderRadius: vars.radius.md,
  backgroundColor: `color-mix(in srgb, ${vars.colors.foreground} 98%, ${vars.colors.accent})`,
  padding: vars.spacing.md,
  paddingTop: vars.spacing.xl,
  boxShadow: `
    inset 0 0 200px color-mix(in srgb, ${vars.colors.foreground} 80%, transparent),
    inset 0 0 40px color-mix(in srgb, ${vars.colors.foreground} 60%, transparent)
  `,

  ":after": {
    content: "",
    position: "absolute",
    inset: 0,
    zIndex: 10,
    opacity: 0.2,
    backgroundImage: `
      radial-gradient(at 0% 10%, ${vars.colors.foreground} 0, transparent 50%),
      radial-gradient(at 0% 1%, ${vars.colors.foreground} 0, transparent 50%)
    `,
  },

  "@media": {
    [breakpoints.md]: {
      borderRadius: vars.radius.xl,
      padding: vars.spacing["3xl"],
    },
  },
});

export const footerContentStyle = style({
  position: "relative",
  zIndex: 20,
  display: "grid",
  gridTemplateColumns: "1fr 2fr",
  gap: vars.spacing.xl,
  alignItems: "center",

  "@media": {
    "screen and (max-width: 767px)": {
      gridTemplateColumns: "1fr",
      gridTemplateRows: "auto auto",
      gap: vars.spacing.lg,
    },
  },
});

export const rackWrapperStyle = style({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  transformStyle: "preserve-3d",
  transform: "rotateX(4deg) rotateY(24deg)",

  "@media": {
    "screen and (max-width: 767px)": {
      justifyContent: "center",
    },
  },
});

export const messageWrapperStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  textAlign: "right",

  "@media": {
    "screen and (max-width: 767px)": {
      textAlign: "center",
    },
  },
});

export const headingStyle = style({
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: vars.fontSize["2xl"],
  fontWeight: vars.fontWeight.semibold,
  color: vars.colors.background,
  margin: 0,
});

export const sparkleStyle = style({
  color: vars.colors.primary,
  marginLeft: vars.spacing.xs,

  display: "inline-block",
  animation: `${pulse} 2s ease-in-out infinite`,
});

export const subtextStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.base,
  color: vars.colors.kirby,
  margin: 0,
});

export const copyrightStyle = style({
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: vars.fontSize.sm,
  color: vars.colors.mutedForeground,
  margin: 0,
  marginTop: vars.spacing.md,
});

export const labsLinkStyle = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.spacing.xs,
  alignSelf: "flex-end",
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.08em",
  color: vars.colors.background,
  textDecoration: "none",
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,
  borderRadius: vars.radius.sm,
  outline: "2px solid transparent",
  outlineOffset: "4px",
  selectors: {
    "&:hover": {
      color: vars.colors.primary,
    },
    // fond sombre du footer : le ring primary y est très contrasté
    "&:focus-visible": {
      color: vars.colors.primary,
      outlineColor: vars.colors.primary,
    },
  },

  "@media": {
    "screen and (max-width: 767px)": {
      alignSelf: "center",
    },
  },
});
