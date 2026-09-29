import { createVar, style } from "@vanilla-extract/css";
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
  gap: vars.spacing.lg,
  width: "100%",
});

export const stageInner = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // Full row width, so the laptop's `maxWidth` shrinks it on a phone.
  flex: "1 1 24rem",
  minWidth: 0,
  maxWidth: "40rem",
  transform: `scale(${stageScale})`,
});

export const wrapper3d = style({
  // The hero's desktop width: the perspective is in px, so a smaller laptop
  // reads flatter than the homepage's.
  width: "40rem",
  maxWidth: "100%",
  transformStyle: "preserve-3d",
  transform: `rotateX(${stageRotateX}) rotateY(${stageRotateY}) rotateZ(${stageRotateZ})`,
});

// The home's screen layout (app/pages/welcome/…/welcome-hero-computer.css.ts): four zones on a
// 3 × 3 grid.
export const screenGrid = style({
  fontFamily: vars.fontFamily.doto,
  ...weight(700),
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridTemplateRows: "repeat(3, 1fr)",
  width: "100%",
  height: "100%",
  padding: vars.spacing.sm,
  gap: vars.spacing.xs,
  background: `color-mix(in srgb, ${vars.colors.background} 10%, transparent)`,
});

export const zone = style({
  position: "relative",
  overflow: "hidden",
  borderRadius: vars.radius.sm,
  background: `color-mix(in srgb, ${vars.colors.background} 10%, transparent)`,
  selectors: {
    "&[data-zone='1']": { gridColumn: "1 / 3", gridRow: "1 / 2" },
    "&[data-zone='2']": { gridColumn: "3 / 4", gridRow: "1 / 3" },
    "&[data-zone='3']": { gridColumn: "1 / 3", gridRow: "2 / 4" },
    "&[data-zone='4']": { gridColumn: "3 / 4", gridRow: "3 / 4" },
    "[data-xray] &": { outline: `1px dashed ${vars.colors.primary}`, outlineOffset: "-1px" },
  },
});

export const zoneLabel = style({
  ...machine,
  position: "absolute",
  zIndex: 1,
  top: "3px",
  left: "3px",
  padding: "0 4px",
  borderRadius: "2px",
  fontSize: "7px",
  lineHeight: 1.5,
  color: vars.colors.foreground,
  backgroundColor: vars.colors.primary,
  pointerEvents: "none",
});

// The mechanism, printed beside the laptop on the drafting sheet.
export const xray = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
  width: "17rem",
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

export const kickerLine = style({
  ...machine,
  display: "block",
  marginTop: "0.25rem",
  fontSize: "0.6875rem",
  color: vars.colors.mutedForeground,
});

export const frameBlock = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.375rem",
});

export const frameName = style({
  ...machine,
  ...weight(900),
  margin: 0,
  fontSize: vars.fontSize.xs,
});

export const frameTransform = style({
  fontFamily: vars.fontFamily.mono,
  fontSize: "0.6875rem",
  lineHeight: 1.4,
  color: vars.colors.mutedForeground,
});

export const faces = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "3px",
});

export const faceButton = style({
  ...machine,
  ...weight(900),
  minHeight: "2rem",
  padding: "0 0.375rem",
  border: `1px solid color-mix(in srgb, ${vars.colors.foreground} 14%, transparent)`,
  borderRadius: "0.375rem",
  backgroundColor: `color-mix(in srgb, white 55%, transparent)`,
  fontSize: "0.625rem",
  letterSpacing: "0.1em",
  color: vars.colors.foreground,
  cursor: "pointer",
  transition: `background-color ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    "&[data-hovered]:not([data-selected])": { backgroundColor: "white" },
    "&[data-selected]": {
      borderColor: vars.colors.foreground,
      backgroundColor: vars.colors.primary,
      color: vars.colors.primaryForeground,
    },
  },
});

export const card = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  padding: vars.spacing.sm,
  border: `1px solid ${vars.colors.primary}`,
  borderRadius: "0.5rem",
  backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 14%, white)`,
});

export const cardTitle = style({
  ...machine,
  ...weight(900),
  margin: 0,
  fontSize: vars.fontSize.xs,
});

export const cardCode = style({
  fontFamily: vars.fontFamily.mono,
  fontSize: "0.75rem",
  ...weight(600),
  overflowWrap: "anywhere",
});

export const cardNote = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  lineHeight: 1.4,
  color: vars.colors.mutedForeground,
});
