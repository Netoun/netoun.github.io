import { createVar, globalStyle, style } from "@vanilla-extract/css";
import { motion } from "@styles/motion.css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

/** Set inline from the controls; the rotation vars inherit down to the 3D wrapper. */
export const stageScale = createVar();
export const stageRotateX = createVar();
export const stageRotateY = createVar();
export const stageRotateZ = createVar();

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

export const stageInner = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transform: `scale(${stageScale})`,
});

export const wrapper3d = style({
  transformStyle: "preserve-3d",
  transform: `rotateX(${stageRotateX}) rotateY(${stageRotateY}) rotateZ(${stageRotateZ})`,
});

export const xray = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  width: "19rem",
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

export const formula = style({
  margin: 0,
  fontFamily: vars.fontFamily.mono,
  fontSize: "0.6875rem",
  lineHeight: 1.5,
  color: vars.colors.mutedForeground,
});

export const table = style({
  ...machine,
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.6875rem",
});

globalStyle(`${table} th, ${table} td`, {
  padding: "0.3125rem 0.25rem",
  textAlign: "right",
  borderTop: `1px solid color-mix(in srgb, ${vars.colors.foreground} 10%, transparent)`,
});

globalStyle(`${table} thead th`, {
  ...weight(900),
  borderTop: "none",
  color: vars.colors.mutedForeground,
});

globalStyle(`${table} th:first-child, ${table} td:first-child`, { textAlign: "left" });

export const unitRow = style({});

globalStyle(`${unitRow} th`, {
  ...weight(900),
  paddingTop: vars.spacing.sm,
  color: vars.colors.foreground,
});

export const led = style({
  display: "inline-block",
  width: "0.5rem",
  height: "0.5rem",
  marginRight: "0.375rem",
  borderRadius: "50%",
  verticalAlign: "-0.0625rem",
  selectors: {
    "&[data-status='PWR'], &[data-status='LAN']": { backgroundColor: vars.colors.secondary },
    "&[data-status='HDD']": { backgroundColor: vars.colors.primary },
    "&[data-status='ERR']": { backgroundColor: vars.colors.destructive },
  },
});
