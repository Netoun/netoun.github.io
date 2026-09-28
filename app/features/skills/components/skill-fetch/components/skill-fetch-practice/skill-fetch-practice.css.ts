import { arrival } from "@styles/motion.css";
import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { globalStyle, style } from "@vanilla-extract/css";
import { insetVar, machine } from "../../skill-fetch.css";
import { weight } from "@styles/weight";

const CHECK_START = arrival.output + 400;
const CHECK_STEP = 70;
const CHECKS = 4;

const rule = `1px solid color-mix(in srgb, ${vars.colors.cardBorder} 70%, transparent)`;

// The white card of the section: the practice is lifted off the paper, the stack stays printed.
export const cardStyle = style({
  overflow: "hidden",
  borderRadius: vars.radius.md,
  border: vars.border.strong,
  backgroundColor: vars.colors.card,
  // Discreet, as the monitor window: a lamp from the top-left, paper warming towards the foot.
  backgroundImage: `
    radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, white 55%, transparent), transparent 60%),
    linear-gradient(180deg, transparent 40%, color-mix(in srgb, ${vars.colors.cardBorder} 22%, transparent))
  `,
  boxShadow: vars.boxShadow.restCard,
});

export const barStyle = style({
  ...machine,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.md,
  minHeight: "3rem",
  // Flush with the card's inner edge: the bar's text and the checks start on one line.
  padding: `0 calc(${insetVar} - 1px)`,
  borderBottom: rule,
  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, white 45%, transparent), transparent)`,
});

export const titleStyle = style({
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  font: "inherit",
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.06em",
  "@media": {
    [breakpoints.lg]: {
      fontSize: vars.fontSize.base,
    },
  },
});

// Gold is allowed here: it sits on ink.
export const pillStyle = style({
  padding: "0.125rem 0.5rem",
  borderRadius: vars.radius.xs,
  backgroundColor: vars.colors.foreground,
  color: vars.colors.primary,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.14em",
});

export const countStyle = style({
  color: vars.colors.mutedForeground,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.12em",
});

// Shared with the stack: one column set for both 2 × 2 grids.
export const checksStyle = style({
  margin: 0,
  listStyle: "none",
  display: "grid",
  rowGap: vars.spacing.xl,
  padding: `${vars.spacing.lg} calc(${insetVar} - 1px) ${vars.spacing.xl}`,
  "@media": {
    [breakpoints.lg]: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      columnGap: vars.spacing["3xl"],
      rowGap: "2.5rem",
      padding: `2.5rem calc(${insetVar} - 1px) 2.75rem`,
    },
  },
});

// Phones and tablets: the tick sits beside the title and the text runs the card's full width.
// From lg the tick gets its own column, as in the stack.
export const checkStyle = style({
  display: "grid",
  gridTemplateColumns: "1.5rem minmax(0, 1fr)",
  columnGap: "0.75rem",
  rowGap: vars.spacing.sm,
  alignItems: "center",
  "@media": {
    [breakpoints.lg]: {
      gridTemplateColumns: "1.75rem minmax(0, 1fr)",
      columnGap: vars.spacing.md,
      alignItems: "start",
    },
  },
});

globalStyle(`[data-reveal="idle"] ${checkStyle}`, {
  opacity: 0,
});

for (let index = 0; index < CHECKS; index += 1) {
  globalStyle(`[data-reveal="revealed"] ${checkStyle}:nth-child(${index + 1})`, {
    animation: `fetch-check 300ms cubic-bezier(0.22, 1, 0.36, 1) ${CHECK_START + index * CHECK_STEP}ms both`,
  });
}

// ✓ in gold on an ink square: the practice's mark, never a fourth domain colour.
export const tickStyle = style({
  ...machine,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1.5rem",
  height: "1.5rem",
  borderRadius: "0.3125rem",
  backgroundColor: vars.colors.foreground,
  "@media": {
    [breakpoints.lg]: {
      marginTop: "0.125rem",
    },
  },
  color: vars.colors.primary,
  fontSize: "0.9375rem",
});

export const checkBodyStyle = style({
  display: "contents",
  "@media": {
    [breakpoints.lg]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.spacing.sm,
      minWidth: 0,
    },
  },
});

// Below lg, everything after the title spans both columns.
export const fullRowStyle = style({
  gridColumn: "1 / -1",
});

// 20px at every width, as the client projects in the work log.
export const checkTitleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.xl,
  ...weight(vars.fontWeight.semibold),
  lineHeight: 1.2,
  textWrap: "balance",
});

export const checkTextStyle = style({
  margin: 0,
  maxWidth: "34em",
  fontSize: vars.fontSize.base,
  lineHeight: 1.45,
  textWrap: "pretty",
});

export const proofsStyle = style({
  ...machine,
  margin: 0,
  marginTop: vars.spacing.xs,
  display: "flex",
  flexDirection: "column",
  gap: "0.1875rem",
  fontSize: "0.8125rem",
  letterSpacing: "0.06em",
  color: `color-mix(in srgb, ${vars.colors.foreground} 72%, transparent)`,
});

export const proofTermStyle = style({
  display: "inline",
});

export const proofValueStyle = style({
  display: "inline",
  margin: 0,
  color: vars.colors.foreground,
});

export const proofLinkStyle = style({
  color: vars.colors.foreground,
  textDecoration: "underline",
  textDecorationThickness: "1px",
  textUnderlineOffset: "0.2em",
  borderRadius: vars.radius.xs,
  transition: "text-decoration-thickness 150ms ease-out",
  selectors: {
    "&:hover": {
      textDecorationThickness: "2px",
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.colors.foreground}`,
      outlineOffset: "2px",
    },
  },
});
