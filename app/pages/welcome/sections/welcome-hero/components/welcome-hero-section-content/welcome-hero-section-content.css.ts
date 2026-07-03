import { keyframes, style } from "@vanilla-extract/css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";

export const welcomeContentStyle = style({
  position: "relative",
  zIndex: 20,
  color: vars.colors.background,
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,

  "@media": {
    [breakpoints.md]: {
      gap: vars.spacing["2xl"],
    },
    [breakpoints["2k"]]: {
      gap: vars.spacing["3xl"],
    },
  },
});

export const welcomeHeadingStyles = style({
  fontFeatureSettings: '"liga" 1, "clig" 1',
  fontStyle: "italic",
  fontWeight: vars.fontWeight.bold,
  fontSize: vars.fontSize["4xl"],
  letterSpacing: "-0.035em",
  lineHeight: "0.9",
  textShadow: vars.textShadow.glow,

  selectors: {
    "&::selection": {
      backgroundColor: vars.colors.primary,
      color: vars.colors.foreground,
      textShadow: "none",
    },
    '[data-text-selected="true"] &': {
      textShadow: "none",
    },
  },

  "@media": {
    [breakpoints.sm]: {
      fontSize: vars.fontSize["5xl"],
    },
    [breakpoints.md]: {
      maxWidth: "75%",
      fontSize: vars.fontSize["6xl"],
      letterSpacing: "-0.04em",
      lineHeight: "0.9",
    },
    [breakpoints.lg]: {
      maxWidth: "85%",
      fontSize: vars.fontSize["7xl"],
      letterSpacing: "-0.045em",
      lineHeight: "0.8",
    },
    [breakpoints["2k"]]: {
      maxWidth: "70%",
      fontSize: vars.fontSize["8xl"],
    },
  },
});

export const welcomeDescriptionStyles = style({
  fontSize: vars.fontSize.xl,
  maxWidth: "40rem",
  lineHeight: vars.lineHeight.tight,
  zIndex: 9999,
  position: "relative",
  textShadow: vars.textShadow.glowSm,

  "@media": {
    [breakpoints.md]: {
      fontSize: vars.fontSize["2xl"],
    },
    [breakpoints["2k"]]: {
      maxWidth: "48rem",
      fontSize: vars.fontSize["3xl"],
    },
  },
});

export const welcomeMetaStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
  marginTop: `-${vars.spacing.sm}`,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.base,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  opacity: 0.86,
  backgroundImage: `linear-gradient(90deg, color-mix(in srgb, ${vars.colors.primary} 70%, ${vars.colors.background}), color-mix(in srgb, ${vars.colors.kirby} 70%, ${vars.colors.background}), color-mix(in srgb, ${vars.colors.tertiary} 70%, ${vars.colors.background}), color-mix(in srgb, ${vars.colors.secondary} 70%, ${vars.colors.background}), color-mix(in srgb, ${vars.colors.primary} 70%, ${vars.colors.background}))`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
  textShadow: vars.textShadow.glowPrimary,

  "@media": {
    [breakpoints["2k"]]: {
      fontSize: vars.fontSize.lg,
    },
  },
});

const welcomeDescriptionCursorKeyframes = keyframes({
  "0%": { opacity: 1 },
  "50%": { opacity: 0 },
  "100%": { opacity: 1 },
});

export const welcomeDescriptionCursorStyles = style({
  animation: `${welcomeDescriptionCursorKeyframes} 800ms steps(1) infinite`,
});

export const welcomeLinkStyles = style({
  color: vars.colors.primary,
  textDecoration: "underline",
  textShadow: vars.textShadow.glowPrimary,

  // Dark hero surface: focus ring must be `primary`, not the global `foreground` default.
  selectors: {
    "&:focus-visible": {
      outlineColor: vars.colors.primary,
    },
  },
});
