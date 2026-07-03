import { vars } from "@styles/theme.css";
import { createVar, style, styleVariants, keyframes } from "@vanilla-extract/css";
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

// Terminal "connection" block: header prompt + one row per link, each with an
// identity-accent LED that lights up on hover — echoes the rack next to it.
export const contactNavStyle = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: vars.spacing.sm,
  marginTop: vars.spacing.md,

  "@media": {
    "screen and (max-width: 767px)": {
      alignItems: "center",
    },
  },
});

export const contactHeaderStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.12em",
  color: `color-mix(in srgb, ${vars.colors.background} 55%, transparent)`,
});

const cursorBlink = keyframes({
  "0%, 49%": { opacity: 1 },
  "50%, 100%": { opacity: 0 },
});

export const contactCursorStyle = style({
  display: "inline-block",
  marginLeft: vars.spacing.xs,
  color: vars.colors.primary,
  animation: `${cursorBlink} 1.2s step-end infinite`,

  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
});

export const contactListStyle = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: vars.spacing.xs,
  listStyle: "none",
  margin: 0,
  padding: 0,

  "@media": {
    "screen and (max-width: 767px)": {
      alignItems: "center",
    },
  },
});

// Per-link accent, consumed by the label hover color and the LED.
const contactAccentVar = createVar();

export const contactLinkStyle = style({
  vars: { [contactAccentVar]: vars.colors.kirby },
  display: "inline-flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: `color-mix(in srgb, ${vars.colors.background} 75%, transparent)`,
  textDecoration: "none",
  borderRadius: vars.radius.sm,
  outline: "2px solid transparent",
  outlineOffset: "4px",
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,

  selectors: {
    "&:hover": {
      color: contactAccentVar,
    },
    // fond sombre du footer : le ring primary y est très contrasté
    "&:focus-visible": {
      color: contactAccentVar,
      outlineColor: vars.colors.primary,
    },
  },
});

export const contactLinkAccentStyles = styleVariants({
  primary: { vars: { [contactAccentVar]: vars.colors.primary } },
  secondary: { vars: { [contactAccentVar]: vars.colors.secondary } },
  tertiary: { vars: { [contactAccentVar]: vars.colors.tertiary } },
  kirby: { vars: { [contactAccentVar]: vars.colors.kirby } },
});

// The prompt arrow slides in when the row is hovered/focused.
export const contactArrowStyle = style({
  display: "inline-block",
  opacity: 0,
  transform: "translateX(-4px)",
  transition: `opacity ${motion.duration.fast} ${motion.easing.out}, transform ${motion.duration.fast} ${motion.easing.out}`,
  color: contactAccentVar,

  selectors: {
    [`${contactLinkStyle}:hover &, ${contactLinkStyle}:focus-visible &`]: {
      opacity: 1,
      transform: "translateX(0)",
    },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
      transform: "none",
    },
  },
});

// Square status LED, dimmed at rest, lit with a soft glow on hover.
export const contactLedStyle = style({
  width: "8px",
  height: "8px",
  borderRadius: "2px",
  backgroundColor: `color-mix(in srgb, ${contactAccentVar} 35%, transparent)`,
  transition: `background-color ${motion.duration.fast} ${motion.easing.out}, box-shadow ${motion.duration.fast} ${motion.easing.out}`,

  selectors: {
    [`${contactLinkStyle}:hover &, ${contactLinkStyle}:focus-visible &`]: {
      backgroundColor: contactAccentVar,
      boxShadow: `0 0 10px color-mix(in srgb, ${contactAccentVar} 70%, transparent)`,
    },
  },
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
