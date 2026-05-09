import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const ping = keyframes({
  "0%": { transform: "scale(1)", opacity: 0.8 },
  "75%, 100%": { transform: "scale(2.2)", opacity: 0 },
});

export const entryStyle = style({
  position: "relative",
  opacity: 0,
  height: "100%",

  "::after": {
    content: "''",
    position: "absolute",
    height: "100%",
    left: "-26px",
    width: "1px",
    top: 12,
    background: `linear-gradient(${vars.colors.kirby}, ${vars.colors.primary}, ${vars.colors.kirby})`,
  },

  "@media": {
    [breakpoints.md]: {
      "::after": {
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
  left: "-26px",
  top: "16px",
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: vars.colors.kirby,
  border: `2px solid color-mix(in srgb, ${vars.colors.kirby} 460%, transparent)`,
  boxShadow: `0 0 0 2px color-mix(in srgb, ${vars.colors.kirby} 40%, transparent)`,

  "@media": {
    [breakpoints.md]: {
      left: "-35px",
      width: "14px",
      height: "14px",
      top: "12px",
    },
  },
});

export const timelineDotPingStyle = style({
  position: "absolute",
  inset: "-2px",
  borderRadius: "50%",
  backgroundColor: vars.colors.kirby,
  opacity: 0.4,
  animation: `${ping} 2s cubic-bezier(0, 0, 0.2, 1) infinite`,
});

export const cardStyle = style({
  borderRadius: vars.radius.md,
  border: "1px solid oklch(0.88 0.02 80 / 0.5)",
  backgroundColor: "oklch(1 0 0 / 0.55)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  overflow: "hidden",
  boxShadow: `0 4px 24px color-mix(in srgb, ${vars.colors.primary} 10%, transparent), 0 1px 4px oklch(0 0 0 / 0.05)`,
  transition: "box-shadow 0.3s ease",
  marginBottom: "2rem",
});

globalStyle(`${cardStyle}:hover`, {
  boxShadow: `0 8px 32px color-mix(in srgb, ${vars.colors.primary} 16%, transparent), 0 0 0 1px color-mix(in srgb, ${vars.colors.primary} 22%, transparent)`,
});

export const cardBarStyle = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
  padding: "10px 16px 8px",
  backgroundColor: "oklch(1 0 0 / 0.3)",
  borderBottom: "1px solid oklch(0.88 0.02 80 / 0.5)",
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.12em",
});

export const cardBarLeftStyle = style({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

export const companyStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.15em",
  color: vars.colors.foreground,
  fontWeight: 500,
  textTransform: "uppercase",
});

export const currentBadgeStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: "9px",
  letterSpacing: "0.14em",
  backgroundColor: vars.colors.primary,
  color: "oklch(0.25 0.05 85)",
  padding: "2px 7px",
  borderRadius: vars.radius.sm,
  fontWeight: vars.fontWeight.bold,
});

export const periodStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.1em",
  color: vars.colors.foreground,
});

export const cardBodyStyle = style({
  padding: "16px 18px 18px",
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
});

export const roleRowStyle = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
});

export const promptStyle = style({
  fontFamily: vars.fontFamily.doto,
  color: vars.colors.primary,
  fontSize: vars.fontSize.sm,
  flexShrink: 0,
});

export const roleStyle = style({
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontWeight: vars.fontWeight.semibold,
  fontSize: vars.fontSize.lg,
  color: vars.colors.foreground,
});

export const locationStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.1em",
  color: "oklch(0.6 0.03 80)",
  marginLeft: "auto",
});

export const descriptionStyle = style({
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.relaxed,
  color: "oklch(0.38 0.01 80)",
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
  gap: vars.spacing.sm,
  padding: `${vars.spacing.sm} 0`,
  borderTop: "1px solid oklch(0.88 0.02 80 / 0.3)",
  borderBottom: "1px solid oklch(0.88 0.02 80 / 0.3)",
});

export const projectStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "2px",

  "@media": {
    [breakpoints.md]: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: vars.spacing.md,
    },
  },
});

export const projectTitleStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.1em",
  color: vars.colors.secondary,
  fontWeight: vars.fontWeight.medium,

  "@media": {
    [breakpoints.md]: {
      minWidth: "140px",
    },
  },
});

export const projectDescStyle = style({
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: vars.fontSize.sm,
  color: "oklch(0.42 0.01 80)",
  lineHeight: vars.lineHeight.relaxed,
});

export const projectStackStyle = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "4px",
  marginTop: "4px",
});

export const stackStyle = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
});

const tagVariant = recipe({
  base: {
    fontFamily: vars.fontFamily.doto,
    fontSize: "9.5px",
    letterSpacing: "0.08em",
    padding: "3px 10px",
    borderRadius: vars.radius.full,
  },
  variants: {
    color: {
      pink: {
        backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 18%, transparent)`,
        color: "oklch(0.38 0.1 166)",
      },
      green: {
        backgroundColor: `color-mix(in srgb, #22c55e 18%, transparent)`,
        color: "oklch(0.38 0.12 150)",
      },
      purple: {
        backgroundColor: `color-mix(in srgb, ${vars.colors.tertiary} 18%, transparent)`,
        color: "oklch(0.38 0.1 280)",
      },
      yellow: {
        backgroundColor: `color-mix(in srgb, #eab308 18%, transparent)`,
        color: "oklch(0.38 0.1 80)",
      },
      blue: {
        backgroundColor: `color-mix(in srgb, #3b82f6 18%, transparent)`,
        color: "oklch(0.38 0.1 220)",
      },
      default: {
        backgroundColor: "oklch(0.92 0.02 80 / 0.5)",
        color: "oklch(0.38 0.01 80)",
      },
    },
  },
});

export const tagStyle = tagVariant;
