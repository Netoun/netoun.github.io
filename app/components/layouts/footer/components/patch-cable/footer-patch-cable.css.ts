import { createVar, keyframes, style, styleVariants } from "@vanilla-extract/css";
import { breakpoints } from "@/styles/responsive.css";
import { motion } from "@/styles/motion.css";
import { vars } from "@/styles/theme.css";

const cableBodyVar = createVar();
const cableHighlightVar = createVar();

// The cable draws from the rack to the port (dash grows from 0 to the whole path, pathLength
// = 1); once drawn no dash is left on the stroke, so it can never break up when repainted.
// Its boots land once it has arrived.
const draw = keyframes({
  from: { strokeDasharray: "0 1" },
  to: { strokeDasharray: "1 0" },
});

const land = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const DRAW = `${draw} 560ms ${motion.easing.signature} backwards`;

export const cableLayerStyle = style({
  display: "none",
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  overflow: "visible",
  pointerEvents: "none",
  zIndex: 30,

  "@media": {
    [breakpoints.xl]: { display: "block" },
  },
});

const accent = (color: string) => ({
  vars: {
    [cableBodyVar]: `color-mix(in oklab, ${color} 58%, #121214)`,
    [cableHighlightVar]: `color-mix(in oklab, ${color} 65%, white)`,
  },
});

export const cableAccentStyles = styleVariants({
  primary: accent(vars.colors.primary),
  secondary: accent(vars.colors.secondary),
  tertiary: accent(vars.colors.tertiary),
  kirby: accent(vars.colors.kirby),
});

const strokeBase = style({
  fill: "none",
  strokeLinecap: "round",
  animation: DRAW,

  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});

export const cableShadowStyle = style([
  strokeBase,
  { stroke: "rgba(0, 0, 0, 0.55)", strokeWidth: 7, transform: "translateY(7px)" },
]);

export const cableOutlineStyle = style([strokeBase, { stroke: "#050506", strokeWidth: 7 }]);

export const cableSheathStyle = style([strokeBase, { stroke: cableBodyVar, strokeWidth: 5 }]);

// A thin catch of light along the top of the sheath.
export const cableHighlightStyle = style([
  strokeBase,
  {
    stroke: cableHighlightVar,
    strokeWidth: 1.1,
    opacity: 0.55,
    transform: "translate(-0.6px, -1.2px)",
  },
]);

export const cableBootStyle = style({
  fill: cableBodyVar,
  stroke: "#050506",
  strokeWidth: 1,
  animation: `${land} 180ms ${motion.easing.out} 420ms both`,

  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});
