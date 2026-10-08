import { createVar, style, styleVariants } from "@vanilla-extract/css";
import { motion } from "@styles/motion.css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

/** A plug's centre on the stage (percent of its box) and its turn; the loop writes them. */
export const plugX = createVar();
export const plugY = createVar();
export const plugAngle = createVar();

const cableBody = createVar();
const cableHighlight = createVar();

// The stage keeps the solver's 808 × 460 coordinates and scales with its column.
export const stage = style({
  position: "relative",
  width: "100%",
  maxWidth: "50.5rem",
  aspectRatio: "808 / 460",
  // Plugs are sized on the stage's width (cqi), so they shrink with the rack on a phone.
  containerType: "inline-size",
  touchAction: "none",
  // A drag must not select the jack numbers.
  userSelect: "none",
  WebkitUserSelect: "none",
});

export const svg = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  overflow: "visible",
});

// ---- the rack --------------------------------------------------------------------------

export const panel = style({
  fill: "oklch(0.13 0.004 80)",
  stroke: "oklch(0.3 0.004 80)",
  strokeWidth: 1,
  filter: "drop-shadow(0 10px 14px oklch(0 0 0 / 0.35))",
});

const machineSvg = {
  fontFamily: vars.fontFamily.doto,
  ...weight(800),
  letterSpacing: "0.1em",
} as const;

export const panelLabel = style({
  ...machineSvg,
  fontSize: "13px",
  fill: vars.colors.mutedForegroundOnDark,
});

export const jackNumber = style({
  ...machineSvg,
  fontSize: "11px",
  textAnchor: "middle",
  fill: vars.colors.mutedForegroundOnDark,
});

export const socket = style({
  fill: "oklch(0.2 0.004 80)",
  stroke: "oklch(0.34 0.004 80)",
  strokeWidth: 1,
});

export const opening = style({
  fill: "oklch(0.05 0 0)",
  stroke: "oklch(0.28 0.004 80)",
  strokeWidth: 0.75,
});

export const led = style({
  selectors: {
    "&[data-accent='primary']": {
      fill: vars.colors.primary,
      filter: `drop-shadow(0 0 4px ${vars.colors.primary})`,
    },
    "&[data-accent='secondary']": {
      fill: vars.colors.secondary,
      filter: `drop-shadow(0 0 4px ${vars.colors.secondary})`,
    },
    "&[data-accent='kirby']": {
      fill: vars.colors.kirby,
      filter: `drop-shadow(0 0 4px ${vars.colors.kirby})`,
    },
    "&:not([data-accent])": {
      fill: `color-mix(in srgb, ${vars.colors.background} 12%, black)`,
    },
  },
});

export const floor = style({
  stroke: `color-mix(in srgb, ${vars.colors.foreground} 18%, transparent)`,
  strokeWidth: 1,
  strokeDasharray: "4 6",
  display: "none",
  selectors: { [`${stage}[data-xray] &`]: { display: "inline" } },
});

// ---- the cables: the footer's four strokes ------------------------------------------------

const accent = (color: string) => ({
  vars: {
    [cableBody]: `color-mix(in oklab, ${color} 58%, #121214)`,
    [cableHighlight]: `color-mix(in oklab, ${color} 65%, white)`,
  },
});

export const cableAccents = styleVariants({
  primary: accent(vars.colors.primary),
  secondary: accent(vars.colors.secondary),
  kirby: accent(vars.colors.kirby),
});

const stroke = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const cableLayers = styleVariants({
  shadow: { ...stroke, stroke: "oklch(0 0 0 / 0.5)", strokeWidth: 7, transform: "translateY(7px)" },
  outline: { ...stroke, stroke: "#050506", strokeWidth: 7 },
  sheath: { ...stroke, stroke: cableBody, strokeWidth: 5 },
  highlight: {
    ...stroke,
    stroke: cableHighlight,
    strokeWidth: 1.1,
    opacity: 0.55,
    transform: "translate(-0.6px, -1.2px)",
  },
});

export const boot = style({
  fill: cableBody,
  stroke: "#050506",
  strokeWidth: 1,
});

// ---- xray: the solver's own drawing ----------------------------------------------------

export const xrayLayer = style({
  display: "none",
  selectors: { [`${stage}[data-xray] &`]: { display: "inline" } },
});

export const constraint = style({
  fill: "none",
  stroke: vars.colors.foreground,
  strokeWidth: 0.75,
  strokeDasharray: "2 3",
});

export const verletPoint = style({
  fill: vars.colors.card,
  stroke: vars.colors.foreground,
  strokeWidth: 1.25,
  selectors: { "&[data-pinned]": { fill: vars.colors.foreground } },
});

export const handles = style({
  fill: "none",
  stroke: `color-mix(in oklab, ${vars.colors.tertiary} 80%, ${vars.colors.foreground})`,
  strokeWidth: 1,
});

// ---- plugs: the handles you drag -------------------------------------------------------

export const plug = style({
  // An ink control: its focus ring is gold.
  vars: { [vars.colors.ring]: vars.colors.primary },
  position: "absolute",
  left: plugX,
  top: plugY,
  width: "2.75rem",
  height: "2.75rem",
  margin: 0,
  padding: 0,
  border: "none",
  borderRadius: vars.radius.sm,
  background: "transparent",
  transform: `translate(-50%, -50%) rotate(${plugAngle})`,
  cursor: "grab",
  touchAction: "none",
  selectors: {
    "&[data-held]": { cursor: "grabbing", zIndex: 2 },
  },
});

// The plug body: ink, an accent band, a latch; lifted a little while held.
export const plugBody = style({
  position: "absolute",
  left: "50%",
  top: "50%",
  width: "2.25cqi",
  height: "4cqi",
  transform: "translate(-50%, -50%)",
  borderRadius: "0.5cqi",
  backgroundImage: `linear-gradient(90deg, oklch(0.16 0.004 80), oklch(0.3 0.004 80) 45%, oklch(0.12 0.004 80))`,
  boxShadow: `inset 0 0 0 1px #050506, 0 4px 8px -2px oklch(0 0 0 / 0.6)`,
  transition: `transform ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    "&::before": {
      content: "",
      position: "absolute",
      insetInline: "0.25cqi",
      top: "1cqi",
      height: "0.6cqi",
      borderRadius: "1px",
      backgroundColor: "currentColor",
    },
    "&::after": {
      content: "",
      position: "absolute",
      left: "50%",
      top: "-0.5cqi",
      width: "1cqi",
      height: "0.6cqi",
      transform: "translateX(-50%)",
      borderRadius: "1px 1px 0 0",
      backgroundColor: "oklch(0.4 0.004 80)",
    },
    [`${plug}[data-accent='primary'] &`]: { color: vars.colors.primary },
    [`${plug}[data-accent='secondary'] &`]: { color: vars.colors.secondary },
    [`${plug}[data-accent='kirby'] &`]: { color: vars.colors.kirby },
    [`${plug}[data-held] &`]: { transform: "translate(-50%, -50%) scale(1.08)" },
  },
});

export const readout = style({
  position: "absolute",
  right: 0,
  bottom: 0,
  display: "none",
  fontFamily: vars.fontFamily.doto,
  ...weight(800),
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontVariantNumeric: "tabular-nums",
  color: vars.colors.foreground,
  selectors: { [`${stage}[data-xray] &`]: { display: "inline" } },
});

export const srOnly = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  margin: 0,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
});
