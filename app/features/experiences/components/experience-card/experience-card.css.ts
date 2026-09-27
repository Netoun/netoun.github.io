import { motion } from "@styles/motion.css";
import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";

const ping = keyframes({
  "0%": { transform: "scale(1)", opacity: 0.8 },
  "75%, 100%": { transform: "scale(2.2)", opacity: 0 },
});

export const entryStyle = style({
  position: "relative",
  opacity: 1,
  height: "100%",

  "::after": {
    position: "absolute",
    height: "100%",
    left: "-26px",
    width: "1px",
    top: 12,
    // The connector is structure, not signal: a quiet hairline that fades at
    // both ends. It used to be a pink→gold→pink gradient, which put the most
    // saturated colour on the page onto a plain rule — and pink is reserved
    // for the Kirby component.
    background: `linear-gradient(
      transparent,
      ${vars.colors.cardBorder} 12%,
      ${vars.colors.cardBorder} 88%,
      transparent
    )`,
  },

  "@media": {
    [breakpoints.md]: {
      "::after": {
        content: "''",
        left: "-29px",
      },
    },
  },
});

globalStyle(`${entryStyle}:last-child::after`, {
  display: "none",
});

export const timelineDotStyle = style({
  position: "absolute",
  display: "none",
  left: "-26px",
  top: vars.spacing.md,
  width: "12px",
  height: "12px",
  borderRadius: vars.radius.full,
  // Gold station mark on a neutral rail — the accent marks the entry, the rail
  // stays quiet. (The old border used a 460% colour-mix, which is out of range
  // and simply clamped to solid pink.)
  backgroundColor: vars.colors.primary,
  boxShadow: `0 0 0 3px ${vars.colors.background}`,

  "@media": {
    [breakpoints.md]: {
      display: "block",
      left: "-35px",
      width: "10px",
      height: "10px",
      top: "14px",
    },
  },
});

export const timelineDotPingStyle = style({
  position: "absolute",
  inset: "-2px",
  borderRadius: vars.radius.full,
  backgroundColor: vars.colors.primary,
  opacity: 0.35,
  animation: `${ping} 2s cubic-bezier(0, 0, 0.2, 1) infinite`,
});

globalStyle(`${entryStyle}[data-anim-disabled='true'] ${timelineDotPingStyle}`, {
  animation: "none",
});

export const cardStyle = style({
  borderRadius: vars.radius.md,
  border: vars.border.subtle,
  backgroundColor: vars.colors.card,
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  overflow: "hidden",
  boxShadow: vars.boxShadow.restCard,
  transition: `box-shadow ${motion.duration.base} ${motion.easing.signature}`,
  marginBottom: vars.spacing["2xl"],
});

globalStyle(`${cardStyle}:hover`, {
  boxShadow: vars.boxShadow.hoverCard,
});

export const cardBarStyle = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
  padding: `
    calc(${vars.spacing.sm} * 1.25)
    ${vars.spacing.md}
    calc(${vars.spacing.sm} * 1)
  `,
  borderBottom: vars.border.subtle,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.12em",
});

export const cardBarLeftStyle = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
});

export const companyStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.15em",
  color: vars.colors.foreground,
  fontWeight: 500,
  textTransform: "uppercase",
});

// Same demotion as the project card status: annotation + lit dot, not a pill.
export const currentBadgeStyle = style({
  display: "inline-flex",
  alignItems: "center",
  gap: `calc(${vars.spacing.xs} * 1.5)`,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize["2xs"],
  letterSpacing: "0.14em",
  color: vars.colors.mutedForeground,
  fontWeight: vars.fontWeight.medium,

  "::before": {
    content: '""',
    width: "5px",
    height: "5px",
    borderRadius: vars.radius.full,
    backgroundColor: vars.colors.primary,
    boxShadow: `0 0 6px color-mix(in srgb, ${vars.colors.primary} 60%, transparent)`,
  },
});

export const periodStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.1em",
  color: vars.colors.foreground,
  fontWeight: vars.fontWeight.bold,
});

export const cardBodyStyle = style({
  padding: vars.spacing.lg,
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
});

export const roleRowStyle = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  flexWrap: "wrap",
});

export const promptStyle = style({
  fontFamily: vars.fontFamily.doto,
  color: vars.colors.primary,
  fontWeight: vars.fontWeight.bold,
  fontSize: vars.fontSize.sm,
  flexShrink: 0,
});

export const roleStyle = style({
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontWeight: vars.fontWeight.semibold,
  fontSize: vars.fontSize.xl,
  color: vars.colors.foreground,
});

export const locationStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.1em",
  color: vars.colors.mutedForeground,
  fontWeight: vars.fontWeight.bold,
  marginLeft: "auto",
});

export const descriptionStyle = style({
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.relaxed,
  color: vars.colors.mutedForeground,
  margin: 0,

  "@media": {
    [breakpoints.md]: {
      maxWidth: "640px",
    },
  },
});

export const projectsStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,
  padding: `${vars.spacing.sm} 0`,
  borderTop: `1px solid color-mix(in srgb, ${vars.colors.cardBorder} 30%, transparent)`,
});

export const projectStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,

  "@media": {
    [breakpoints.md]: {
      alignItems: "baseline",
    },
  },
});

export const projectTitleStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.1em",
  fontWeight: 900,
  color: `color-mix(in oklch, ${vars.colors.secondary} 80%, ${vars.colors.foreground})`,

  // Le même style sert aussi de <span> non interactif : états réservés aux <a>
  selectors: {
    "&:is(a)": {
      textDecoration: "none",
      borderRadius: vars.radius.sm,
      outline: "2px solid transparent",
      outlineOffset: "2px",
      transition: `color ${motion.duration.fast} ${motion.easing.out}`,
    },
    "&:is(a):hover": {
      color: vars.colors.foreground,
      textDecoration: "underline",
      textUnderlineOffset: "3px",
    },
    "&:is(a):focus-visible": {
      outlineColor: vars.colors.foreground,
    },
  },

  "@media": {
    [breakpoints.md]: {
      minWidth: "140px",
    },
  },
});

export const projectDescStyle = style({
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: vars.fontSize.sm,
  color: vars.colors.mutedForeground,
  maxWidth: "640px",
  lineHeight: vars.lineHeight.relaxed,
});

export const projectStackStyle = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.xs,
  marginTop: vars.spacing.xs,
});

export const stackStyle = style({
  display: "flex",
  flexWrap: "wrap",
  gap: `calc(${vars.spacing.sm} * 0.75)`,
});
