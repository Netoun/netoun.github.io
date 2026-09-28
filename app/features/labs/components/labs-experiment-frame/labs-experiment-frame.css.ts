import { breakpoints } from "@styles/responsive.css";
import { motion } from "@styles/motion.css";
import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

const rule = `1px solid color-mix(in srgb, ${vars.colors.cardBorder} 55%, transparent)`;
const inkWell = {
  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 84%, ${vars.colors.background}), ${vars.colors.foreground})`,
  boxShadow: `inset 0 1px 2px oklch(0 0 0 / 0.5), 0 1px 0 color-mix(in srgb, white 70%, transparent)`,
} as const;
const machine = {
  fontFamily: vars.fontFamily.doto,
  ...weight(800),
  fontVariantNumeric: "tabular-nums",
} as const;

export const frame = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing["2xl"],
  width: "100%",
  paddingTop: vars.spacing.lg,
});

export const frameHeader = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
});

// The page header's own bottom margin is for sections that follow it; here the tags do.
globalStyle(`${frameHeader} > :first-child`, { marginBottom: 0 });

export const description = style({
  margin: 0,
  maxWidth: "40rem",
  fontSize: vars.fontSize.lg,
  lineHeight: vars.lineHeight.relaxed,
  textWrap: "pretty",
});

export const tagRow = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: vars.spacing.xs,
});

export const meta = style({
  ...machine,
  marginLeft: vars.spacing.sm,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: vars.colors.mutedForeground,
});

// ---- bench ------------------------------------------------------------------

export const bench = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: vars.spacing.lg,
  "@media": {
    [breakpoints.lg]: {
      gridTemplateColumns: "minmax(0, 1fr) 20rem",
      alignItems: "stretch",
    },
  },
});

/** The bare stage, for a demo rendered outside the experiment page. */
export const stage = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "28rem",
  padding: vars.spacing.xl,
  borderRadius: vars.radius.md,
  border: vars.border.subtle,
  overflow: "hidden",
  backgroundColor: vars.colors.card,
});

// The stage is a window of the monitor's family: lit paper stock, a lamp from the top-left,
// a command bar over a hairline, then the screen the piece runs on.
export const stageWindow = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  overflow: "hidden",
  borderRadius: vars.radius.md,
  border: vars.border.strong,
  backgroundColor: vars.colors.card,
  backgroundImage: `
    radial-gradient(120% 70% at 0% 0%, color-mix(in srgb, white 55%, transparent), transparent 60%),
    linear-gradient(180deg, transparent 40%, color-mix(in srgb, ${vars.colors.cardBorder} 22%, transparent))
  `,
  boxShadow: vars.boxShadow.restCard,
});

export const stageBar = style({
  ...machine,
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
  minHeight: "3rem",
  padding: `${vars.spacing.xs} ${vars.spacing.sm} ${vars.spacing.xs} ${vars.spacing.lg}`,
  borderBottom: rule,
  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, white 45%, transparent), transparent)`,
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.06em",
  "@media": {
    [breakpoints.lg]: { fontSize: vars.fontSize.base },
  },
});

export const command = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5em",
  flex: 1,
  minWidth: 0,
  margin: 0,
  whiteSpace: "nowrap",
});

export const commandText = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const commandFlag = style({
  flexShrink: 0,
  color: `color-mix(in srgb, ${vars.colors.primary} 50%, ${vars.colors.foreground})`,
});

export const cursor = style({
  marginLeft: "-0.25em",
  animation: "blink 1s step-end infinite",
});

export const engine = style({
  flexShrink: 0,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: vars.colors.mutedForeground,
  display: "none",
  "@media": {
    [breakpoints.md]: { display: "inline" },
  },
});

export const viewToggle = style({
  ...inkWell,
  // An ink control: its focus ring is gold.
  vars: { [vars.colors.ring]: vars.colors.primary },
  flexShrink: 0,
  display: "flex",
  gap: "2px",
  padding: "3px",
  borderRadius: vars.radius.sm,
});

export const viewButton = style({
  ...machine,
  ...weight(900),
  minHeight: "2.25rem",
  padding: `0 ${vars.spacing.md}`,
  border: "none",
  borderRadius: "0.4375rem",
  background: "transparent",
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: `color-mix(in srgb, ${vars.colors.background} 62%, transparent)`,
  cursor: "pointer",
  transition: `background-color ${motion.duration.fast} ${motion.easing.out}, color ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    "&[data-hovered]:not([data-selected])": { color: vars.colors.background },
    "&[data-selected]": {
      backgroundColor: vars.colors.primary,
      color: vars.colors.primaryForeground,
      boxShadow: `inset 0 1px 0 color-mix(in srgb, white 45%, transparent), 0 1px 2px oklch(0 0 0 / 0.4)`,
    },
  },
  "@media": {
    [breakpoints.lg]: { minHeight: "1.75rem" },
  },
});

export const screen = style({
  position: "relative",
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "26rem",
  margin: `${vars.spacing.md} ${vars.spacing.md} 0`,
  padding: vars.spacing.lg,
  overflow: "hidden",
  borderRadius: "0.75rem",
  selectors: {
    // HUDs and shaders paint their own dark: they sit on ink glass.
    "&[data-surface='ink']": {
      vars: { [vars.colors.ring]: vars.colors.primary },
      border: `1px solid color-mix(in srgb, ${vars.colors.background} 10%, transparent)`,
      background: `
        radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, white 6%, transparent), transparent 55%),
        color-mix(in srgb, ${vars.colors.foreground} 98%, ${vars.colors.muted})`,
      boxShadow: `inset 0 2px 14px oklch(0 0 0 / 0.55), 0 1px 0 color-mix(in srgb, white 70%, transparent)`,
      color: vars.colors.background,
    },
    // CSS 3D objects sit on a lamp-lit drafting sheet.
    "&[data-surface='paper']": {
      border: vars.border.strong,
      backgroundColor: `color-mix(in srgb, white 40%, ${vars.colors.card})`,
      backgroundImage: `
        linear-gradient(color-mix(in srgb, ${vars.colors.secondary} 16%, transparent) 1px, transparent 1px),
        linear-gradient(90deg, color-mix(in srgb, ${vars.colors.secondary} 16%, transparent) 1px, transparent 1px)`,
      backgroundSize: "2.75rem 2.75rem",
      backgroundPosition: "-1px -1px",
      boxShadow: `inset 0 1px 3px color-mix(in srgb, ${vars.colors.foreground} 8%, transparent)`,
    },
  },
  "@media": {
    [breakpoints.lg]: { minHeight: "35rem" },
  },
});

export const mounted = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  minHeight: "2.5rem",
  margin: 0,
  padding: `0 ${vars.spacing.lg}`,
  overflow: "hidden",
  whiteSpace: "nowrap",
  color: vars.colors.mutedForeground,
});

export const mountedLabel = style({
  ...machine,
  flexShrink: 0,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
});

export const mountedCode = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontFamily: vars.fontFamily.mono,
  fontSize: vars.fontSize.xs,
});

// The controls card: a white panel screwed to the bench (four screw heads, one background).
const screw = (x: string, y: string) =>
  `radial-gradient(circle at ${x} ${y}, oklch(0.97 0 0) 0 1.5px, oklch(0.72 0.005 80) 3px, color-mix(in srgb, ${vars.colors.foreground} 30%, transparent) 3.5px, transparent 4px)`;

export const controlsCard = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  padding: `0 ${vars.spacing.lg} ${vars.spacing.lg}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.colors.border}`,
  backgroundColor: `color-mix(in srgb, white 60%, ${vars.colors.card})`,
  backgroundImage: `
    ${screw("13.5px", "13.5px")}, ${screw("calc(100% - 13.5px)", "13.5px")},
    ${screw("13.5px", "calc(100% - 13.5px)")}, ${screw("calc(100% - 13.5px)", "calc(100% - 13.5px)")},
    radial-gradient(120% 70% at 0% 0%, color-mix(in srgb, white 70%, transparent), transparent 60%),
    linear-gradient(180deg, transparent 50%, color-mix(in srgb, ${vars.colors.cardBorder} 20%, transparent))`,
  boxShadow: vars.boxShadow.restCard,
});

export const controlsTitle = style({
  ...machine,
  ...weight(900),
  display: "flex",
  alignItems: "center",
  minHeight: "2.75rem",
  margin: `0 calc(${vars.spacing.lg} * -1) ${vars.spacing.md}`,
  padding: `0 ${vars.spacing.lg} 0 1.75rem`,
  borderBottom: `1px solid color-mix(in srgb, ${vars.colors.cardBorder} 70%, transparent)`,
  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, white 45%, transparent), transparent)`,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
});

export const controlsBody = style({
  display: "flex",
  flexDirection: "column",
  flex: 1,
});
