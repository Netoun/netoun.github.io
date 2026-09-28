import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";
import { style } from "@vanilla-extract/css";

// The game keeps the width its server was drawn for (660px), beside the message from `xl`
// and under it below.
export const sectionStyle = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "41.25rem",
});

export const headingStyle = style({
  margin: 0,
  display: "flex",
  alignItems: "baseline",
  gap: "0.75rem",
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: vars.fontSize["3xl"],
  ...weight(vars.fontWeight.bold),
  lineHeight: vars.lineHeight.tight,
  "@media": { [breakpoints.md]: { fontSize: vars.fontSize["4xl"] } },
});

// Games sit in the gold creative domain; on paper the prompt mixes gold 50 % with ink.
export const promptStyle = style({
  fontFamily: vars.fontFamily.doto,
  ...weight(vars.fontWeight.extrabold),
  color: `color-mix(in srgb, ${vars.colors.primary} 50%, ${vars.colors.foreground})`,
});

export const leadStyle = style({
  margin: `${vars.spacing.sm} 0 0`,
  maxWidth: "34rem",
  fontSize: vars.fontSize.base,
  lineHeight: 1.45,
  color: vars.colors.mutedForeground,
  textWrap: "pretty",
});

// The bays' three colours, drawn as the lit handle bar they take on the black cartridges.
export const legendStyle = style({
  display: "flex",
  flexWrap: "wrap",
  gap: `${vars.spacing.xs} ${vars.spacing.md}`,
  margin: `${vars.spacing.md} 0 0`,
  padding: 0,
  listStyle: "none",
});

export const legendItemStyle = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  fontFamily: vars.fontFamily.doto,
  ...weight(vars.fontWeight.extrabold),
  fontSize: "0.6875rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: vars.colors.mutedForeground,
});

export const swatchStyle = style({
  display: "block",
  width: "1.5rem",
  height: "0.625rem",
  borderRadius: "3px",
  background: "#16161a",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
  position: "relative",
  "::after": {
    content: '""',
    position: "absolute",
    left: "3px",
    right: "3px",
    top: "3px",
    bottom: "3px",
    borderRadius: "2px",
  },
  selectors: {
    '&[data-score="right"]::after': {
      background: vars.colors.secondary,
      boxShadow: `0 0 6px color-mix(in srgb, ${vars.colors.secondary} 70%, transparent)`,
    },
    '&[data-score="elsewhere"]::after': {
      background: vars.colors.primary,
      boxShadow: `0 0 6px color-mix(in srgb, ${vars.colors.primary} 70%, transparent)`,
    },
    '&[data-score="absent"]::after': {
      background: `repeating-linear-gradient(135deg, color-mix(in srgb, ${vars.colors.background} 55%, transparent) 0 2px, transparent 2px 4px)`,
      boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${vars.colors.background} 45%, transparent)`,
    },
  },
});

export const serverStyle = style({
  marginTop: vars.spacing.md,
});

export const benchStyle = style({
  display: "grid",
  gap: vars.spacing.lg,
  marginTop: vars.spacing.xl,
  "@media": {
    [breakpoints.md]: {
      gridTemplateColumns: "minmax(0, 20rem) minmax(0, 1fr)",
      gap: vars.spacing.xl,
      alignItems: "start",
    },
  },
});

export const liveStyle = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
});
