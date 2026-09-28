import { breakpoints } from "@styles/responsive.css";
import { motion } from "@styles/motion.css";
import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

// The man page is printed on the paper, not boxed: headings in the left margin, a hairline
// between entries, gold only on the entry whose lines the source viewer shows.
const label = {
  fontFamily: vars.fontFamily.doto,
  ...weight(900),
  letterSpacing: "0.14em",
  textTransform: "uppercase",
} as const;
const hairline = `inset 0 1px 0 color-mix(in srgb, ${vars.colors.cardBorder} 80%, transparent)`;

export const manual = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,
});

export const head = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.md,
});

// Ink pill, the work-log / tree command family.
export const command = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6em",
  maxWidth: "100%",
  minHeight: "2.5rem",
  margin: 0,
  padding: "0 1.125rem",
  boxSizing: "border-box",
  borderRadius: vars.radius.sm,
  whiteSpace: "nowrap",
  fontFamily: vars.fontFamily.doto,
  ...weight(900),
  fontSize: vars.fontSize.base,
  letterSpacing: "0.04em",
  backgroundColor: vars.colors.foreground,
  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 84%, ${vars.colors.background}), ${vars.colors.foreground} 70%)`,
  boxShadow: `inset 0 1px 0 color-mix(in srgb, ${vars.colors.background} 14%, transparent), ${vars.boxShadow.restCard}`,
  color: vars.colors.background,
});

// Gold is legal here: it sits on ink.
export const prompt = style({ color: vars.colors.primary });

export const cursor = style({
  marginLeft: "-0.35em",
  color: vars.colors.primary,
  animation: "blink 1s step-end infinite",
});

export const legend = style({
  ...label,
  ...weight(800),
  margin: 0,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.12em",
  color: vars.colors.mutedForeground,
});

export const page = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  rowGap: vars.spacing.sm,
  "@media": {
    [breakpoints.lg]: {
      gridTemplateColumns: "11.5rem minmax(0, 1fr)",
      columnGap: vars.spacing.xl,
    },
  },
});

export const heading = style({
  ...label,
  margin: `${vars.spacing.md} 0 0`,
  fontSize: vars.fontSize.xs,
  lineHeight: "1.25rem",
  "@media": {
    [breakpoints.lg]: { margin: 0, paddingTop: "1rem" },
  },
});

export const name = style({
  margin: 0,
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.relaxed,
  "@media": {
    [breakpoints.lg]: { paddingTop: "0.875rem", fontSize: "1.0625rem" },
  },
});

export const notes = style({
  display: "flex",
  flexDirection: "column",
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const note = style({
  display: "grid",
  gridTemplateColumns: "2rem minmax(0, 1fr)",
  columnGap: vars.spacing.sm,
  rowGap: vars.spacing.sm,
  alignItems: "start",
  margin: `0 calc(${vars.spacing.sm} * -1)`,
  padding: `0.875rem ${vars.spacing.sm}`,
  borderRadius: "0.625rem",
  transition: `background-color ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    "& + &": { boxShadow: hairline },
    "&[data-cited]": {
      backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 9%, transparent)`,
    },
  },
  "@media": {
    [breakpoints.lg]: {
      gridTemplateColumns: "2.5rem minmax(0, 1fr) auto",
      columnGap: vars.spacing.md,
      margin: `0 calc(${vars.spacing.md} * -1 + 0.25rem)`,
      padding: "0.875rem 0.75rem",
    },
  },
});

export const noteNumber = style({
  ...label,
  paddingTop: "0.125rem",
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.08em",
  color: vars.colors.mutedForeground,
});

export const noteText = style({
  margin: 0,
  maxWidth: "46rem",
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.relaxed,
  textWrap: "pretty",
  "@media": {
    [breakpoints.lg]: { fontSize: "1.0625rem" },
  },
});

export const lead = style({
  ...weight(600),
});

export const code = style({
  padding: "0.0625rem 0.3125rem",
  borderRadius: "0.25rem",
  backgroundColor: `color-mix(in srgb, ${vars.colors.foreground} 7%, transparent)`,
  fontFamily: vars.fontFamily.mono,
  fontSize: "0.875em",
  overflowWrap: "anywhere",
});

export const refs = style({
  gridColumn: "2",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.375rem",
  "@media": {
    [breakpoints.lg]: { gridColumn: "3", justifyContent: "flex-end" },
  },
});

export const ref = style({
  ...label,
  display: "inline-flex",
  alignItems: "center",
  minHeight: "2rem",
  padding: "0 0.625rem",
  border: "none",
  borderRadius: "0.4375rem",
  backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 22%, transparent)`,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.08em",
  color: vars.colors.foreground,
  whiteSpace: "nowrap",
  cursor: "pointer",
  transition: `background-color ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    "&[data-hovered]": {
      backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 45%, transparent)`,
    },
    [`${note}[data-cited] &`]: { backgroundColor: vars.colors.primary },
  },
});

export const refArrow = style({ marginLeft: "0.25em" });

export const srOnly = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
});

export const seeAlso = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
  margin: 0,
  padding: 0,
  listStyle: "none",
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.relaxed,
  "@media": {
    [breakpoints.lg]: { paddingTop: "0.875rem", fontSize: "1.0625rem" },
  },
});

export const seeAlsoLink = style({
  ...weight(600),
  color: vars.colors.foreground,
  textUnderlineOffset: "0.25em",
});
