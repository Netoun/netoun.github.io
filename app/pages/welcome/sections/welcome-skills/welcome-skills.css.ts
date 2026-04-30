import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { globalStyle, style } from "@vanilla-extract/css";

export const sectionStyle = style({
  position: "relative",
  overflow: "hidden",
  backgroundColor: vars.colors.background,
  paddingTop: vars.spacing["3xl"],
  paddingBottom: vars.spacing["3xl"],
});

export const blobStyle = style({
  position: "absolute",
  borderRadius: "50%",
  pointerEvents: "none",
});

export const blobGoldStyle = style({
  width: "500px",
  height: "400px",
  top: "-100px",
  right: "-80px",
  background: vars.colors.primary,
  opacity: 0.1,
  filter: "blur(110px)",
});

export const blobVioletStyle = style({
  width: "400px",
  height: "350px",
  bottom: "-80px",
  left: "-60px",
  background: vars.colors.tertiary,
  opacity: 0.07,
  filter: "blur(110px)",
});

export const contentStyle = style({
  position: "relative",
  zIndex: 1,
});

export const headerStyle = style({
  marginBottom: vars.spacing.xl,
  opacity: 0,
});

export const titleStyle = style({
  fontFamily: vars.fontFamily.ttAlientzGrotesk,
  fontSize: vars.fontSize["5xl"],
  color: vars.colors.foreground,
  marginBottom: vars.spacing.sm,
  textShadow: `0 0 40px color-mix(in srgb, ${vars.colors.secondary} 30%, transparent)`,
});

export const prefixStyle = style({
  color: vars.colors.secondary,
  marginRight: vars.spacing.sm,
  filter: "brightness(0.8)",
});

export const cursorStyle = style({
  color: vars.colors.secondary,
  animation: "blink 1s step-end infinite",
});

export const subtitleStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.sm,
  color: "oklch(0.5 0.04 80)",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
});

/* ── Legend / Key ── */

export const keyStyle = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: vars.spacing.md,
  marginBottom: vars.spacing["2xl"],
  padding: `10px 16px`,
  borderRadius: vars.radius.md,
  border: "1px solid oklch(0.88 0.02 80 / 0.5)",
  backgroundColor: "oklch(1 0 0 / 0.45)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.12em",
  color: "oklch(0.45 0.02 80)",
});

export const keyItemStyle = style({
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

export const keyLabelStyle = style({
  color: "oklch(0.6 0.02 80)",
});

export const keyDividerStyle = style({
  width: "1px",
  height: "16px",
  backgroundColor: "oklch(0.85 0.02 80)",

  "@media": {
    [breakpoints.md]: {
      display: "block",
    },
  },
});

export const keyScaleStyle = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
});

export const keyScaleRowStyle = style({
  display: "flex",
  alignItems: "center",
  gap: "4px",
});

export const keyDotStyle = style({
  opacity: 0.4,
});

/* ── Symbols ── */

export const symWorkStyle = style({
  color: vars.colors.secondary,
  fontSize: "1rem",
  lineHeight: 1,
  filter: "brightness(0.85)",
});

export const symPersoStyle = style({
  color: vars.colors.primary,
  fontSize: "1rem",
  lineHeight: 1,
  filter: "brightness(0.85)",
});

/* ── Grid ── */

export const skillsGridStyle = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: vars.spacing.xl,

  "@media": {
    [breakpoints.md]: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
});

export const skillGroupStyle = style({
  borderRadius: vars.radius.md,
  border: "1px solid oklch(0.88 0.02 80 / 0.5)",
  backgroundColor: "oklch(1 0 0 / 0.55)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  overflow: "hidden",
  opacity: 0,
  boxShadow: `0 4px 20px color-mix(in srgb, ${vars.colors.primary} 8%, transparent)`,
});

export const skillGroupTitleStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: vars.colors.secondary,
  filter: "brightness(0.8)",
  padding: "10px 16px 8px",
  borderBottom: "1px solid oklch(0.88 0.02 80 / 0.5)",
  backgroundColor: "oklch(1 0 0 / 0.3)",
});

export const skillGroupColsStyle = style({
  display: "grid",
  gridTemplateColumns: "1fr 80px 80px",
  padding: "6px 16px 4px",
  borderBottom: "1px solid oklch(0.9 0 0 / 0.6)",
});

export const colHeadStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: "9px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "oklch(0.65 0.02 80)",
  textAlign: "center",
});

export const skillRowStyle = style({
  display: "grid",
  gridTemplateColumns: "1fr 80px 80px",
  alignItems: "center",
  padding: "7px 16px",
  borderBottom: "1px solid oklch(0.9 0 0 / 0.5)",

  selectors: {
    "&:last-child": {
      borderBottom: "none",
    },
  },
});

export const skillNameStyle = style({
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: vars.fontSize.sm,
  color: vars.colors.foreground,
  letterSpacing: "-0.01em",
});

export const skillCellStyle = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "2px",
  cursor: "default",
});

export const skillCellEmptyStyle = style({
  opacity: 0.18,
});

export const cellTooltipStyle = style({
  position: "absolute",
  bottom: "calc(100% + 6px)",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "oklch(0.12 0.01 80)",
  color: "oklch(0.9 0 0)",
  fontFamily: vars.fontFamily.doto,
  fontSize: "9px",
  letterSpacing: "0.1em",
  padding: "3px 8px",
  borderRadius: vars.radius.sm,
  whiteSpace: "nowrap",
  opacity: 0,
  pointerEvents: "none",
  transition: "opacity 0.15s ease",
  zIndex: 10,
});

globalStyle(`${skillCellStyle}:hover ${cellTooltipStyle}`, {
  opacity: 1,
});
