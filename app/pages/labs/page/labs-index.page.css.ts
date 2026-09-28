import { style } from "@vanilla-extract/css";
import { arrival } from "@styles/motion.css";
import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";

// Characters in `_❯ tree -d -L 2 ~/labs`: one typing step per character.
const COMMAND_STEPS = 22;
const XL_WITH_POINTER = `${breakpoints.xl} and (hover: hover) and (pointer: fine)`;

export const pageStyle = style({
  display: "flex",
  flexDirection: "column",
  paddingTop: vars.spacing.xl,
  "@media": {
    [breakpoints.lg]: { paddingTop: vars.spacing["2xl"] },
  },
});

export const headerStyle = style({
  display: "grid",
  gap: vars.spacing.xl,
  "@media": {
    [breakpoints.lg]: {
      gridTemplateColumns: "minmax(0, 1fr) auto",
      alignItems: "end",
      gap: vars.spacing["2xl"],
    },
  },
});

export const introStyle = style({
  maxWidth: "40rem",
  margin: `calc(-1 * ${vars.spacing.lg}) 0 0`,
  fontSize: vars.fontSize.base,
  lineHeight: "1.5",
  color: vars.colors.mutedForeground,
  textWrap: "pretty",
});

// `du -sh` is a desktop aside: phones read the same totals on the summary line.
export const duStyle = style({
  display: "none",
  "@media": {
    [breakpoints.lg]: { display: "block", paddingBottom: vars.spacing.xs },
  },
});

export const commandRowStyle = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: `${vars.spacing.sm} ${vars.spacing.lg}`,
  marginBlock: `${vars.spacing["2xl"]} ${vars.spacing.lg}`,
});

// A small terminal on the paper, the work log's command family: an object, not a panel.
export const commandStyle = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6em",
  maxWidth: "100%",
  minHeight: "2.25rem",
  margin: 0,
  padding: `0 ${vars.spacing.md}`,
  boxSizing: "border-box",
  borderRadius: vars.radius.sm,
  whiteSpace: "nowrap",
  fontFamily: vars.fontFamily.doto,
  ...weight(900),
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.04em",
  backgroundColor: vars.colors.foreground,
  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 84%, ${vars.colors.background}), ${vars.colors.foreground} 70%)`,
  boxShadow: `inset 0 1px 0 color-mix(in srgb, ${vars.colors.background} 14%, transparent), ${vars.boxShadow.restCard}`,
  color: vars.colors.background,
  "@media": {
    [breakpoints.lg]: {
      minHeight: "2.5rem",
      padding: "0 1.125rem",
      fontSize: vars.fontSize.base,
    },
  },
});

// Gold is legal here: it sits on ink.
export const promptStyle = style({
  color: vars.colors.primary,
});

export const commandTextStyle = style({
  overflow: "hidden",
  animation: `labs-type ${arrival.commandDuration}ms steps(${COMMAND_STEPS}) ${arrival.commandDelay}ms both`,
});

export const cursorStyle = style({
  marginLeft: "-0.35em",
  color: vars.colors.primary,
  animation: "blink 1s step-end infinite",
});

const label = {
  margin: 0,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  ...weight(800),
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: vars.colors.mutedForeground,
} as const;

export const summaryStyle = style(label);

export const legendStyle = style({
  ...label,
  display: "none",
  "@media": {
    [XL_WITH_POINTER]: { display: "block", marginLeft: "auto" },
  },
});

// The tree and its loupe. The loupe narrows first, so the rows keep their titles at 1024px.
export const bodyStyle = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  "@media": {
    [breakpoints.lg]: {
      gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)",
      alignItems: "start",
      gap: vars.spacing.xl,
    },
    [breakpoints.xl]: {
      gridTemplateColumns: "minmax(0, 1fr) 32.5rem",
      gap: "2.5rem",
    },
  },
});

export const loupeColumnStyle = style({
  display: "none",
  "@media": {
    [breakpoints.lg]: {
      display: "block",
      position: "sticky",
      top: vars.spacing.lg,
    },
  },
});
