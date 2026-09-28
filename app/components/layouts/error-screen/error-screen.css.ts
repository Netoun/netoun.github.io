import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { weight } from "@styles/weight";

// Doto at the legible floor (DESIGN.md › Legible Dot-Matrix).
const machine = {
  fontFamily: vars.fontFamily.doto,
  ...weight(vars.fontWeight.extrabold),
  fontVariantNumeric: "tabular-nums",
} as const;

export const pageStyle = style({
  display: "grid",
  alignItems: "center",
  minHeight: "100svh",
  paddingBlock: vars.spacing["3xl"],
});

export const contentStyle = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.md,
});

export const shellStyle = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.sm,
  maxWidth: "100%",
  marginBottom: vars.spacing.xl,
});

// A small terminal on the paper, like the work log's: an object, not a third dark panel.
export const terminalStyle = style({
  ...machine,
  margin: 0,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6em",
  maxWidth: "100%",
  minHeight: "2.5rem",
  padding: `0 ${vars.spacing.md}`,
  boxSizing: "border-box",
  borderRadius: vars.radius.sm,
  backgroundColor: vars.colors.foreground,
  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 84%, ${vars.colors.background}), ${vars.colors.foreground} 70%)`,
  boxShadow: `inset 0 1px 0 color-mix(in srgb, ${vars.colors.background} 14%, transparent), ${vars.boxShadow.restCard}`,
  color: vars.colors.background,
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.04em",
  "@media": {
    [breakpoints.lg]: {
      minHeight: "2.75rem",
      fontSize: vars.fontSize.base,
    },
  },
});

// Gold is allowed here: it sits on ink.
export const promptStyle = style({
  color: vars.colors.primary,
});

// A mistyped address can be long: it wraps rather than pushing the page sideways.
export const commandStyle = style({
  minWidth: 0,
  overflowWrap: "anywhere",
});

export const cursorStyle = style({
  marginLeft: "-0.35em",
  color: vars.colors.primary,
  animation: "blink 1s step-end infinite",
  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});

export const outputStyle = style({
  ...machine,
  margin: 0,
  paddingInline: vars.spacing.md,
  overflowWrap: "anywhere",
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.04em",
  color: vars.colors.mutedForeground,
});

export const codeStyle = style({
  ...machine,
  margin: 0,
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.12em",
});

export const titleStyle = style({
  margin: 0,
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: vars.fontSize["5xl"],
  ...weight(vars.fontWeight.semibold),
  lineHeight: vars.lineHeight.none,
  letterSpacing: "-0.02em",
  textWrap: "balance",
  "@media": {
    [breakpoints.md]: { fontSize: vars.fontSize["7xl"] },
  },
});

export const detailsStyle = style({
  maxWidth: "36rem",
  fontSize: vars.fontSize.lg,
  lineHeight: vars.lineHeight.normal,
  color: vars.colors.mutedForeground,
  textWrap: "pretty",
});

export const linksStyle = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: vars.spacing.lg,
  marginTop: vars.spacing.lg,
});

export const linkStyle = recipe({
  base: {
    ...machine,
    display: "inline-flex",
    alignItems: "center",
    minHeight: "2.75rem",
    fontSize: vars.fontSize.sm,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: vars.colors.foreground,
    textDecoration: "none",
    ":hover": {
      textDecoration: "underline",
      textUnderlineOffset: "4px",
    },
    ":focus-visible": {
      outline: `2px solid ${vars.colors.ring}`,
      outlineOffset: "2px",
      borderRadius: vars.radius.xs,
    },
  },
  variants: {
    primary: {
      true: {
        padding: `0 ${vars.spacing.lg}`,
        borderRadius: vars.radius.full,
        backgroundColor: vars.colors.foreground,
        color: vars.colors.background,
        ":hover": { textDecoration: "none", color: vars.colors.primary },
      },
      false: {},
    },
  },
});

export const stackStyle = style({
  width: "100%",
  marginTop: vars.spacing.xl,
  padding: vars.spacing.md,
  overflowX: "auto",
  fontSize: vars.fontSize.xs,
});
