import { breakpoints } from "@styles/responsive.css";
import { motion } from "@styles/motion.css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";
import { createVar, style } from "@vanilla-extract/css";

const reduced = "(prefers-reduced-motion: reduce)";
const machine = {
  fontFamily: vars.fontFamily.doto,
  ...weight(vars.fontWeight.extrabold),
  fontVariantNumeric: "tabular-nums",
} as const;
// Silkscreen on the black chassis: paper at 58 %, above 4.5:1 on its darkest steel.
const silk = `color-mix(in srgb, ${vars.colors.background} 58%, transparent)`;
const lcd = {
  background: "linear-gradient(180deg, #030304, #0c0c0f)",
  boxShadow: "inset 0 2px 4px #000",
} as const;
const goldGlow = `0 0 6px color-mix(in srgb, ${vars.colors.primary} 55%, transparent)`;
const screw = (y: string) =>
  `radial-gradient(circle at 50% ${y}, #a2a2aa 0 1px, #2a2a30 2.6px, rgba(0, 0, 0, 0.5) 3.2px, transparent 3.6px)`;

// One-point perspective: the eye sits above the unit, so the lid recedes to a vanishing point
// over its centre. The front is never transformed: every bay stays a plain rectangle to tap.
export const stageStyle = style({
  position: "relative",
  paddingTop: "2.5rem",
  perspective: "900px",
  perspectiveOrigin: "50% -420px",
  "@media": {
    [breakpoints.md]: {
      paddingTop: "4rem",
      perspective: "1400px",
      perspectiveOrigin: "50% -620px",
    },
  },
});

export const bodyStyle = style({
  position: "relative",
  transformStyle: "preserve-3d",
});

export const lidStyle = style({
  position: "absolute",
  left: 0,
  top: "-5.25rem",
  width: "100%",
  height: "5.25rem",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  paddingTop: "1rem",
  boxSizing: "border-box",
  transformOrigin: "50% 100%",
  transform: "rotateX(90deg)",
  borderRadius: "5px 5px 0 0",
  background:
    "repeating-linear-gradient(90deg, transparent 0 14px, rgba(0, 0, 0, 0.5) 14px 17px) 18% 70% / 64% 40% no-repeat, linear-gradient(180deg, #3a3a41, #24242a)",
  "@media": {
    [breakpoints.md]: { top: "-9.375rem", height: "9.375rem", paddingTop: "1.75rem" },
  },
});

export const engravingStyle = style({
  ...machine,
  fontSize: "0.75rem",
  letterSpacing: "0.3em",
  color: `color-mix(in srgb, ${vars.colors.background} 30%, transparent)`,
  "@media": { [breakpoints.md]: { fontSize: vars.fontSize.xl } },
});

// The chassis: steel with an ear at each side (two screws on each), the bays, their U labels
// and the control strip. It is a dark object, so its focus ring turns gold.
export const chassisStyle = style({
  vars: { [vars.colors.ring]: vars.colors.primary },
  position: "relative",
  paddingInline: "0.875rem",
  borderRadius: "5px",
  background: "linear-gradient(180deg, #2a2a30, #151518 45%, #0f0f12)",
  boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.14), inset 0 0 0 1px rgba(0, 0, 0, 0.7), ${vars.boxShadow.restCard}`,
  "::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "0.875rem",
    borderRadius: "5px 0 0 5px",
    background: `${screw("18px")}, ${screw("calc(100% - 18px)")}, linear-gradient(90deg, #303036, #1e1e23)`,
    boxShadow: "inset -1px 0 0 #000, inset -2px 0 0 rgba(255, 255, 255, 0.05)",
  },
  "::after": {
    content: '""',
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "0.875rem",
    borderRadius: "0 5px 5px 0",
    background: `${screw("18px")}, ${screw("calc(100% - 18px)")}, linear-gradient(90deg, #1e1e23, #303036)`,
    boxShadow: "inset 1px 0 0 #000, inset 2px 0 0 rgba(255, 255, 255, 0.05)",
  },
  "@media": {
    [breakpoints.md]: { paddingInline: "1.375rem" },
  },
});

// Numbers take three parts of the row, operators two: 42 / 26 px on a phone, 72 / 48 at 660.
const columns = "repeat(4, minmax(0, 3fr) minmax(0, 2fr)) minmax(0, 3fr)";

export const baysStyle = style({
  display: "grid",
  gridTemplateColumns: columns,
  gap: "2px",
  paddingTop: "0.75rem",
  "@media": { [breakpoints.md]: { gap: vars.spacing.sm } },
});

const bayBox = {
  position: "relative",
  height: "5.75rem",
  boxSizing: "border-box",
  borderRadius: "3px",
  "@media": { [breakpoints.md]: { height: "8.5rem" } },
} as const;

export const emptyBayStyle = style({
  ...bayBox,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#050506",
  boxShadow: "inset 0 3px 8px #000, inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
});

export const emptyLabelStyle = style({
  ...machine,
  writingMode: "vertical-rl",
  transform: "rotate(180deg)",
  fontSize: "0.625rem",
  letterSpacing: "0.18em",
  color: `color-mix(in srgb, ${vars.colors.background} 34%, transparent)`,
});

// A plugged cartridge: black hardware, its value on a gold LCD (numbers) or in mint (operators).
export const cartridgeStyle = style({
  ...bayBox,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.375rem",
  padding: "7px 4px 8px",
  border: 0,
  cursor: "pointer",
  background: "linear-gradient(90deg, #2c2c33, #3c3c44 45%, #1d1d22)",
  boxShadow:
    "inset 0 1px 0 rgba(255, 255, 255, 0.14), inset 0 -1px 0 rgba(0, 0, 0, 0.6), 0 2px 0 rgba(0, 0, 0, 0.5)",
  animation: `rack-drop 280ms ${motion.easing.signature} both`,
  transition: `filter ${motion.duration.fast} ease`,
  selectors: {
    "&[data-hovered]": { filter: "brightness(1.18)" },
    "&[data-focus-visible]": { outline: `2px solid ${vars.colors.ring}`, outlineOffset: "2px" },
    // Not in the solution: the whole cartridge steps back, so the one wrong part stands out
    // among lit ones (a dark bar alone vanished on the black).
    '&[data-led="absent"]': { opacity: 0.45, filter: "saturate(0.2)" },
    '&[data-led="absent"][data-hovered]': { opacity: 0.7 },
    '&[data-kind="operator"]': {
      background:
        "radial-gradient(circle, #050506 1px, transparent 1.4px) 0 0 / 5px 5px, linear-gradient(90deg, #26262c, #34343b 45%, #1b1b20)",
    },
  },
  "@media": {
    [breakpoints.md]: { height: "8.5rem" },
    [reduced]: { animation: "none" },
  },
});

export const ledStyle = style({
  flexShrink: 0,
  display: "block",
  width: "6px",
  height: "4px",
  borderRadius: "1px",
  background: `color-mix(in srgb, ${vars.colors.primary} 40%, #050506)`,
  selectors: {
    '&[data-led="active"]': {
      background: vars.colors.primary,
      boxShadow: goldGlow,
      animation: "rack-activity 460ms steps(2) infinite",
    },
    '&[data-led="won"], &[data-led="right"]': {
      background: vars.colors.secondary,
      boxShadow: `0 0 6px ${vars.colors.secondary}`,
    },
    '&[data-led="elsewhere"]': { background: vars.colors.primary, boxShadow: goldGlow },
    '&[data-led="absent"]': { background: "#1a1a1f" },
    '&[data-led="fault"]': {
      background: vars.colors.destructive,
      boxShadow: `0 0 6px ${vars.colors.destructive}`,
    },
  },
  "@media": { [reduced]: { animation: "none" } },
});

export const windowStyle = style({
  ...lcd,
  ...machine,
  position: "relative",
  flexGrow: 1,
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "2px",
  fontSize: "1.1875rem",
  lineHeight: 1,
  "::before": {
    content: '"88"',
    position: "absolute",
    color: `color-mix(in srgb, ${vars.colors.primary} 10%, transparent)`,
  },
  "@media": { [breakpoints.md]: { fontSize: "1.875rem" } },
});

export const numberStyle = style({
  position: "relative",
  color: vars.colors.primary,
  textShadow: goldGlow,
});

export const symbolStyle = style({
  ...machine,
  fontSize: "1.125rem",
  lineHeight: 1,
  color: vars.colors.secondary,
  textShadow: `0 0 6px color-mix(in srgb, ${vars.colors.secondary} 45%, transparent)`,
  "@media": { [breakpoints.md]: { fontSize: "1.75rem" } },
});

// The handle carries the run's score as a lit bar, Tusmo's tile colour on the hardware: mint
// for the right bay, gold for elsewhere in the solution, dark for not in it.
export const handleStyle = style({
  flexShrink: 0,
  display: "block",
  width: "70%",
  height: "7px",
  borderRadius: "4px",
  background: "linear-gradient(180deg, #e8e8ec, #7c7c84)",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
  selectors: {
    '[data-led="right"] &, [data-led="won"] &': {
      width: "86%",
      background: vars.colors.secondary,
      boxShadow: `0 0 8px color-mix(in srgb, ${vars.colors.secondary} 70%, transparent)`,
    },
    '[data-led="elsewhere"] &': {
      width: "86%",
      background: vars.colors.primary,
      boxShadow: `0 0 8px color-mix(in srgb, ${vars.colors.primary} 70%, transparent)`,
    },
    '[data-led="absent"] &': {
      width: "86%",
      background: `repeating-linear-gradient(135deg, color-mix(in srgb, ${vars.colors.background} 55%, transparent) 0 2px, transparent 2px 4px)`,
      boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${vars.colors.background} 45%, transparent)`,
    },
  },
});

export const totalsStyle = style({
  display: "grid",
  gridTemplateColumns: columns,
  gap: "2px",
  minHeight: "0.9375rem",
  paddingTop: "0.375rem",
  "@media": { [breakpoints.md]: { gap: vars.spacing.sm } },
});

export const totalStyle = style({
  ...machine,
  overflow: "hidden",
  textAlign: "center",
  whiteSpace: "nowrap",
  fontSize: "0.6875rem",
  lineHeight: "0.9375rem",
  color: `color-mix(in srgb, ${vars.colors.primary} 88%, transparent)`,
  textShadow: `0 0 5px color-mix(in srgb, ${vars.colors.primary} 40%, transparent)`,
  "@media": { [breakpoints.md]: { fontSize: "0.8125rem" } },
});

export const labelsStyle = style({
  display: "grid",
  gridTemplateColumns: columns,
  gap: "2px",
  padding: `0.375rem 0 ${vars.spacing.sm}`,
  "@media": { [breakpoints.md]: { gap: vars.spacing.sm } },
});

export const labelStyle = style({
  ...machine,
  textAlign: "center",
  fontSize: "0.6875rem",
  lineHeight: "0.9375rem",
  letterSpacing: "0.02em",
  color: silk,
});

// The control strip: the accumulator, the status LEDs, the unit's name, the power button.
export const controlStyle = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  height: "4rem",
  paddingInline: "0.625rem",
  boxShadow: "inset 0 1px 0 #000, inset 0 2px 0 rgba(255, 255, 255, 0.05)",
  "@media": { [breakpoints.md]: { height: "5rem", gap: "0.75rem" } },
});

export const accStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "3px",
});

export const silkStyle = style({
  ...machine,
  fontSize: "0.6875rem",
  letterSpacing: "0.16em",
  color: silk,
});

export const nameStyle = style([silkStyle, { flexGrow: 1, textAlign: "right" }]);

export const lcdStyle = style({
  ...lcd,
  ...machine,
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  width: "5.5rem",
  height: "2rem",
  boxSizing: "border-box",
  paddingRight: vars.spacing.sm,
  borderRadius: "3px",
  fontSize: "1.375rem",
  letterSpacing: "0.04em",
  "::before": {
    content: '"8888"',
    position: "absolute",
    right: vars.spacing.sm,
    color: `color-mix(in srgb, ${vars.colors.primary} 10%, transparent)`,
  },
  "@media": {
    [breakpoints.md]: { width: "7.5rem", height: "2.5rem", fontSize: "1.875rem" },
  },
});

// Live while the bays are being filled: gold, mint once they make 404, red on a division that
// does not fall exact.
export const accValueStyle = style({
  position: "relative",
  whiteSpace: "pre",
  color: vars.colors.primary,
  textShadow: goldGlow,
  selectors: {
    '&[data-phase="failed"]': {
      color: `color-mix(in oklab, ${vars.colors.destructive} 72%, white)`,
      textShadow: "none",
    },
    '&[data-ready], &[data-phase="won"]': {
      color: vars.colors.secondary,
      textShadow: `0 0 6px color-mix(in srgb, ${vars.colors.secondary} 55%, transparent)`,
    },
    "&[data-fault]": {
      color: `color-mix(in oklab, ${vars.colors.destructive} 72%, white)`,
      textShadow: "none",
    },
  },
});

export const statusStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const statusItemStyle = style([
  silkStyle,
  { display: "inline-flex", alignItems: "center", gap: "6px", letterSpacing: "0.12em" },
]);

export const statusLedStyle = style({
  display: "block",
  width: "7px",
  height: "7px",
  borderRadius: vars.radius.full,
  background: `color-mix(in srgb, ${vars.colors.background} 10%, #050506)`,
  boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.6)",
  selectors: {
    '&[data-lit="pwr"]': {
      background: vars.colors.secondary,
      boxShadow: `0 0 0 1px rgba(0, 0, 0, 0.6), 0 0 6px ${vars.colors.secondary}`,
    },
    '&[data-lit="err"]': {
      background: vars.colors.destructive,
      boxShadow: `0 0 0 1px rgba(0, 0, 0, 0.6), 0 0 6px ${vars.colors.destructive}`,
    },
  },
});

const ring = createVar();

// Its ring says where the run is: gold at rest (breathing, "press me"), gold while it runs,
// mint once 404 is reached, red on a fault.
export const powerStyle = style({
  vars: { [ring]: `color-mix(in srgb, ${vars.colors.primary} 60%, #050506)` },
  position: "relative",
  flexShrink: 0,
  width: "2.875rem",
  height: "2.875rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  border: 0,
  borderRadius: vars.radius.full,
  cursor: "pointer",
  color: vars.colors.background,
  background: "radial-gradient(circle at 35% 30%, #4a4a52, #16161a 72%)",
  boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 0 0 3px #08080a, 0 0 0 5px ${ring}`,
  transition: `transform ${motion.duration.fast} ease`,
  "::after": {
    content: '""',
    position: "absolute",
    inset: "-5px",
    borderRadius: vars.radius.full,
    boxShadow: `0 0 14px color-mix(in srgb, ${ring} 55%, transparent)`,
    opacity: 0,
  },
  selectors: {
    "&[data-pressed]": { transform: "scale(0.95)" },
    "&[data-focus-visible]": { outline: `2px solid ${vars.colors.ring}`, outlineOffset: "7px" },
    '&[data-phase="idle"]::after': { opacity: 1, animation: "rack-idle 2.4s ease-in-out infinite" },
    // The bays make 404: the ring turns mint and breathes faster, press me.
    "&[data-ready]": { vars: { [ring]: vars.colors.secondary } },
    "&[data-ready]::after": { opacity: 1, animation: "rack-idle 1.2s ease-in-out infinite" },
    // It stays enabled while the run prints (a press is ignored), so keyboard focus stays on it.
    '&[data-phase="running"]': { cursor: "progress", vars: { [ring]: vars.colors.primary } },
    '&[data-phase="running"]::after, &[data-phase="won"]::after, &[data-phase="failed"]::after': {
      opacity: 1,
    },
    '&[data-phase="won"]': { vars: { [ring]: vars.colors.secondary } },
    '&[data-phase="failed"]': { vars: { [ring]: vars.colors.destructive } },
  },
  "@media": {
    [breakpoints.md]: { width: "3.5rem", height: "3.5rem" },
    [reduced]: { transition: "none", selectors: { "&::after": { animation: "none" } } },
  },
});

export const powerIconStyle = style({
  width: "1.375rem",
  height: "1.375rem",
});
