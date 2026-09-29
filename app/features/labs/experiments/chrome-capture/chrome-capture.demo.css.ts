import { style } from "@vanilla-extract/css";
import { motion } from "@styles/motion.css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

const machine = {
  fontFamily: vars.fontFamily.doto,
  ...weight(800),
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontVariantNumeric: "tabular-nums",
} as const;

export const stage = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: `${vars.spacing.lg} 3rem`,
  width: "100%",
});

// The surface the pointer lights: useChromeReflection listens here, and the manual light
// writes the same two vars here.
export const light = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "1 1 22rem",
  maxWidth: "34rem",
  minWidth: 0,
  padding: vars.spacing.lg,
});

export const holder = style({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  perspective: "60rem",
});

export const capture = style({
  width: "100%",
  selectors: {
    "&[data-size='sm']": { maxWidth: "14rem" },
  },
});

export const xray = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  width: "18rem",
  maxWidth: "100%",
  animation: `labs-row ${motion.duration.base} ${motion.easing.signature} both`,
});

export const kicker = style({
  ...machine,
  ...weight(900),
  margin: 0,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.14em",
  color: `color-mix(in oklab, ${vars.colors.secondary} 70%, ${vars.colors.foreground})`,
});

export const layers = style({
  display: "flex",
  flexDirection: "column",
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const layer = style({
  display: "grid",
  gridTemplateColumns: "1.5rem minmax(0, 1fr)",
  columnGap: "0.5rem",
  rowGap: "0.125rem",
  padding: `${vars.spacing.sm} 0`,
  borderTop: `1px solid color-mix(in srgb, ${vars.colors.foreground} 10%, transparent)`,
});

export const layerDepth = style({
  ...machine,
  ...weight(900),
  gridRow: "1 / 3",
  fontSize: vars.fontSize.xs,
  color: vars.colors.mutedForeground,
});

export const layerName = style({
  ...machine,
  ...weight(900),
  fontSize: vars.fontSize.xs,
});

export const layerCode = style({
  fontFamily: vars.fontFamily.mono,
  fontSize: "0.6875rem",
  lineHeight: 1.45,
  color: vars.colors.mutedForeground,
  overflowWrap: "anywhere",
});

export const note = style({
  ...machine,
  margin: 0,
  fontSize: "0.6875rem",
  lineHeight: 1.4,
  textTransform: "none",
  color: vars.colors.mutedForeground,
});

export const captureRow = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
});
