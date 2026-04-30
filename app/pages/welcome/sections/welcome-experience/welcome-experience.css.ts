import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";

const ping = keyframes({
  "0%": { transform: "scale(1)", opacity: 0.8 },
  "75%, 100%": { transform: "scale(2.2)", opacity: 0 },
});

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

export const blobCyanStyle = style({
  width: "500px",
  height: "420px",
  bottom: "-120px",
  right: "-60px",
  background: vars.colors.secondary,
  opacity: 0.1,
  filter: "blur(110px)",
});

export const blobGoldStyle = style({
  width: "380px",
  height: "320px",
  top: "-80px",
  left: "30%",
  background: vars.colors.primary,
  opacity: 0.09,
  filter: "blur(100px)",
});

export const contentStyle = style({
  position: "relative",
  zIndex: 1,
});

export const headerStyle = style({
  marginBottom: vars.spacing["2xl"],
  opacity: 0,
});

export const titleStyle = style({
  fontSize: vars.fontSize["5xl"],
  color: vars.colors.foreground,
  marginBottom: vars.spacing.sm,
  fontFamily: vars.fontFamily.ttAlientzGrotesk,
  textShadow: `0 0 40px color-mix(in srgb, ${vars.colors.primary} 25%, transparent)`,
});

export const prefixStyle = style({
  color: vars.colors.primary,
  marginRight: vars.spacing.sm,
  filter: "brightness(0.75)",
});

export const cursorStyle = style({
  color: vars.colors.primary,
  animation: "blink 1s step-end infinite",
});

export const subtitleStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.sm,
  color: "oklch(0.5 0.04 80)",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
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

export const timelineLineStyle = style({
  position: "absolute",
  left: "11px",
  top: "12px",
  bottom: "12px",
  width: "2px",
  backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 30%, transparent)`,
  borderRadius: vars.radius.full,

  "@media": {
    [breakpoints.md]: {
      left: "19px",
    },
  },
});

export const entryStyle = style({
  position: "relative",
  opacity: 0,
});

export const timelineDotStyle = style({
  position: "absolute",
  left: "-32px",
  top: "16px",
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: vars.colors.primary,
  border: `2px solid oklch(0.96 0.015 80)`,
  boxShadow: `0 0 0 2px color-mix(in srgb, ${vars.colors.primary} 40%, transparent)`,

  "@media": {
    [breakpoints.md]: {
      left: "-48px",
      width: "14px",
      height: "14px",
      top: "15px",
    },
  },
});

export const timelineDotPingStyle = style({
  position: "absolute",
  inset: "-2px",
  borderRadius: "50%",
  backgroundColor: vars.colors.primary,
  opacity: 0.4,
  animation: `${ping} 2s cubic-bezier(0, 0, 0.2, 1) infinite`,
});

export const cardStyle = style({
  borderRadius: vars.radius.md,
  border: "1px solid oklch(0.88 0.02 80 / 0.5)",
  backgroundColor: "oklch(1 0 0 / 0.55)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  overflow: "hidden",
  boxShadow: `0 4px 24px color-mix(in srgb, ${vars.colors.primary} 10%, transparent), 0 1px 4px oklch(0 0 0 / 0.05)`,
  transition: "box-shadow 0.3s ease",
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

export const terminalButtonsStyle = style({
  display: "flex",
  gap: "5px",
});

export const terminalButtonStyle = style({
  width: 10,
  height: 10,
  borderRadius: "50%",
  backgroundColor: "oklch(0.85 0.04 80)",
});

globalStyle(`${terminalButtonsStyle} > ${terminalButtonStyle}:nth-child(1)`, {
  backgroundColor: "#ff5f57",
});
globalStyle(`${terminalButtonsStyle} > ${terminalButtonStyle}:nth-child(2)`, {
  backgroundColor: "#febc2e",
});
globalStyle(`${terminalButtonsStyle} > ${terminalButtonStyle}:nth-child(3)`, {
  backgroundColor: "#28c840",
});

export const companyStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.15em",
  color: "oklch(0.35 0.04 80)",
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
  color: "oklch(0.6 0.03 80)",
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

export const stackStyle = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
});

export const stackTagStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: "9.5px",
  letterSpacing: "0.08em",
  padding: "3px 10px",
  borderRadius: vars.radius.full,
  backgroundColor: `color-mix(in srgb, ${vars.colors.secondary} 18%, transparent)`,
  color: "oklch(0.38 0.1 166)",
});
