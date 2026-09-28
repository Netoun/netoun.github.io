import { createVar, style, styleVariants } from "@vanilla-extract/css";
import { breakpoints } from "@/styles/responsive.css";
import { motion } from "@/styles/motion.css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

/** Where the glass catches the light, in % of the plate; written by usePlateLight. */
export const plateGlass = { x: createVar(), y: createVar() };

// The plate is a pane of terminal glass on the dark panel: frosted over the panel's mesh,
// a bright rim with a faint gold/violet/mint fringe, scanlines, and a liquid highlight that
// follows the pointer (`plateGlass`, set by usePlateLight). Text on it is warm
// paper at reduced opacity (never graphite, 2.72:1 on the panel).
const paper = (percent: number) =>
  `color-mix(in srgb, ${vars.colors.background} ${percent}%, transparent)`;

const portAccentVar = createVar();
const portAccentTextVar = createVar();

// Standoff screws holding the pane.
const screw = (x: string, y: string) =>
  `radial-gradient(circle 3px at ${x} ${y}, #a2a2aa 0, #45454c 55%, rgba(0, 0, 0, 0.7) 85%, transparent 100%)`;

const glassBlur = "blur(18px) saturate(1.6) brightness(0.8)";

export const plateStyle = style({
  position: "relative",
  isolation: "isolate",
  padding: `${vars.spacing.sm} 0.75rem`,
  borderRadius: "14px",
  vars: { [plateGlass.x]: "6%", [plateGlass.y]: "50%" },
  background: [
    // The liquid highlight, where the light is.
    `radial-gradient(circle at ${plateGlass.x} ${plateGlass.y}, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.03) 18%, transparent 42%)`,
    // Terminal scanlines, barely there.
    "repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.022) 0 1px, transparent 1px 3px)",
    // Light falling across the pane from the top left.
    "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.015) 36%, rgba(0, 0, 0, 0.2))",
    "rgba(12, 12, 16, 0.46)",
  ].join(", "),
  backdropFilter: glassBlur,
  WebkitBackdropFilter: glassBlur,
  boxShadow: `
    0 20px 44px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 1px 0 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05),
    inset 0 0 28px rgba(255, 255, 255, 0.03)
  `,

  selectors: {
    // Rim: a 1px border drawn with a gradient, bright at the top left, with a hint of the
    // mesh's colours where glass would split the light.
    "&::after": {
      content: "",
      position: "absolute",
      inset: 0,
      zIndex: 1,
      padding: "1px",
      borderRadius: "inherit",
      pointerEvents: "none",
      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.45), color-mix(in srgb, ${vars.colors.primary} 22%, transparent) 22%, rgba(255, 255, 255, 0.04) 45%, color-mix(in srgb, ${vars.colors.tertiary} 30%, transparent) 72%, color-mix(in srgb, ${vars.colors.secondary} 28%, transparent) 88%, rgba(255, 255, 255, 0.2))`,
      mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
      maskComposite: "exclude",
      WebkitMaskComposite: "xor",
    },
    "&::before": {
      content: "",
      position: "absolute",
      inset: 0,
      zIndex: 1,
      borderRadius: "inherit",
      pointerEvents: "none",
      backgroundImage: [
        screw("10px", "10px"),
        screw("calc(100% - 10px)", "10px"),
        screw("10px", "calc(100% - 10px)"),
        screw("calc(100% - 10px)", "calc(100% - 10px)"),
      ].join(", "),
    },
  },

  "@media": {
    [breakpoints.md]: {
      padding: "0.875rem 1rem",
      borderRadius: "16px",
    },
  },
});

export const portListStyle = style({
  position: "relative",
  zIndex: 2,
  listStyle: "none",
  margin: 0,
  padding: 0,
});

const rowBase = style({
  display: "grid",
  gridTemplateColumns: "3.25rem minmax(0, 1fr) 1rem",
  alignItems: "center",
  minHeight: "4.5rem",
  padding: `0.75rem ${vars.spacing.xs}`,
  boxSizing: "border-box",
  borderRadius: "6px",
  textDecoration: "none",
  color: vars.colors.background,
  outline: "2px solid transparent",
  outlineOffset: "2px",
  transition: `background-color ${motion.duration.base} ${motion.easing.out}`,

  selectors: {
    // Dark plate: the gold ring reads.
    "&:focus-visible": { outlineColor: vars.colors.primary },
  },

  "@media": {
    [breakpoints.md]: {
      gridTemplateColumns: "3.75rem minmax(0, 1fr) auto",
      minHeight: "4.25rem",
      padding: `0 ${vars.spacing.sm}`,
    },
  },
});

export const portStyle = style([
  rowBase,
  {
    // Etched line under each port.
    borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
    boxShadow: "0 1px 0 rgba(0, 0, 0, 0.3)",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,

    selectors: {
      '&[data-plugged="true"]': {
        background: `linear-gradient(90deg, color-mix(in srgb, ${portAccentVar} 11%, transparent), transparent 70%)`,
      },
    },
  },
]);

export const portAccentStyles = styleVariants({
  primary: {
    vars: { [portAccentVar]: vars.colors.primary, [portAccentTextVar]: vars.colors.primary },
  },
  secondary: {
    vars: { [portAccentVar]: vars.colors.secondary, [portAccentTextVar]: vars.colors.secondary },
  },
  // Violet is lifted towards white for text: the raw accent is too dark on the plate.
  tertiary: {
    vars: {
      [portAccentVar]: vars.colors.tertiary,
      [portAccentTextVar]: `color-mix(in oklab, ${vars.colors.tertiary} 62%, white)`,
    },
  },
  kirby: { vars: { [portAccentVar]: vars.colors.kirby, [portAccentTextVar]: vars.colors.kirby } },
});

// The port number, as printed on the rack's jack; it leads the label so nothing sits left of
// the socket, where the cable comes in.
export const portNumberStyle = style({
  marginRight: "0.75em",
  color: paper(50),
});

// Keystone jack, the same part as the rack's patch unit, at plate scale.
export const socketStyle = style({
  position: "relative",
  display: "block",
  width: "36px",
  height: "27px",
  borderRadius: "4px",
  background: "linear-gradient(180deg, #3a3a42, #16161b 55%, #101014)",
  boxShadow: `
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    inset 0 -1px 0 rgba(0, 0, 0, 0.6),
    0 1px 0 rgba(255, 255, 255, 0.05),
    0 4px 10px rgba(0, 0, 0, 0.45)
  `,

  "@media": {
    [breakpoints.md]: { width: "40px", height: "30px" },
  },
});

export const socketCavityStyle = style({
  position: "absolute",
  inset: "4px",
  borderRadius: "2px",
  background: "linear-gradient(180deg, #030304, #0c0c0f)",
  boxShadow: "inset 0 2px 4px #000, inset 0 -1px 0 rgba(255, 255, 255, 0.05)",

  selectors: {
    "&::before": {
      content: "",
      position: "absolute",
      left: "4px",
      right: "4px",
      top: "3px",
      height: "7px",
      background: `repeating-linear-gradient(90deg, color-mix(in srgb, ${vars.colors.primary} 80%, #7a5a00) 0 1px, transparent 1px 2.7px)`,
      opacity: 0.9,
    },
    "&::after": {
      content: "",
      position: "absolute",
      left: "10px",
      right: "10px",
      bottom: 0,
      height: "6px",
      borderRadius: "1px 1px 0 0",
      background: "#000",
    },
  },
});

export const socketPlugStyle = style({
  display: "none",
  position: "absolute",
  inset: "1px",
  borderRadius: "3px",
  background: "linear-gradient(180deg, #34343c, #18181d 55%, #0f0f12)",
  border: `1.5px solid color-mix(in oklab, ${portAccentVar} 45%, #121214)`,
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 4px rgba(0, 0, 0, 0.6)",

  selectors: {
    [`${portStyle}[data-plugged="true"] &`]: { display: "block" },
    "&::before": {
      content: "",
      position: "absolute",
      left: "7px",
      right: "7px",
      top: "4px",
      height: "2px",
      borderRadius: "1px",
      background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent)",
    },
    "&::after": {
      content: "",
      position: "absolute",
      left: "11px",
      right: "11px",
      bottom: "3px",
      height: "6px",
      borderRadius: "1.5px",
      background: `color-mix(in oklab, ${portAccentVar} 58%, #121214)`,
      boxShadow: "inset 0 0 0 0.6px rgba(255, 255, 255, 0.18)",
    },
  },
});

// LED lens beside the jack. It lights once the cable has arrived (~480ms).
export const socketLedStyle = style({
  position: "absolute",
  right: "-10px",
  top: "1px",
  width: "5px",
  height: "3px",
  borderRadius: "1px",
  background: `color-mix(in srgb, ${portAccentVar} 28%, #000)`,
  boxShadow: "inset 0 0.5px 0 rgba(255, 255, 255, 0.25)",
  transition: `background-color ${motion.duration.fast} ${motion.easing.out}, box-shadow ${motion.duration.fast} ${motion.easing.out}`,

  selectors: {
    [`${portStyle}[data-plugged="true"] &`]: {
      background: portAccentVar,
      boxShadow: `0 0 6px ${portAccentVar}, inset 0 0.5px 0 rgba(255, 255, 255, 0.5)`,
      transitionDelay: "480ms",
    },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
});

export const portTextStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
  minWidth: 0,
});

export const portLabelStyle = style({
  fontFamily: vars.fontFamily.doto,
  ...weight(vars.fontWeight.extrabold),
  fontSize: "0.8125rem",
  lineHeight: "1rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: paper(66),
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,

  selectors: {
    [`${portStyle}[data-plugged="true"] &`]: { color: portAccentTextVar },
  },
});

export const portAddressStyle = style({
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: vars.fontSize.base,
  lineHeight: 1.35,
  color: paper(84),
  overflowWrap: "anywhere",
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,

  selectors: {
    [`${portStyle}[data-plugged="true"] &`]: { color: vars.colors.background },
  },

  "@media": {
    [breakpoints.md]: {
      fontSize: vars.fontSize.lg,
      lineHeight: "1.375rem",
    },
    // One line per port once the plate has the room (the full LinkedIn path fits).
    [breakpoints.xl]: {
      overflowWrap: "normal",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
});

export const portSchemeStyle = style({
  justifySelf: "end",
  fontFamily: vars.fontFamily.doto,
  ...weight(vars.fontWeight.extrabold),
  fontSize: "0.875rem",
  letterSpacing: "0.1em",
  color: paper(52),
});

// Phones keep the arrow only; the scheme joins it from md.
export const portSchemeNameStyle = style({
  display: "none",
  fontSize: vars.fontSize.xs,

  "@media": {
    [breakpoints.md]: { display: "inline" },
  },
});

export const uplinkStyle = style([
  rowBase,
  {
    position: "relative",
    zIndex: 2,
    selectors: {
      "&:hover": { background: "rgba(255, 255, 255, 0.025)" },
    },
  },
]);

export const uplinkLabelStyle = style([
  portLabelStyle,
  {
    selectors: {
      [`${uplinkStyle}:hover &, ${uplinkStyle}:focus-visible &`]: { color: vars.colors.primary },
    },
  },
]);

// The count on a small dot-matrix display: lit digits over their unlit "88".
export const uplinkDisplayStyle = style({
  position: "relative",
  display: "grid",
  placeItems: "center",
  width: "36px",
  height: "27px",
  borderRadius: "4px",
  background: "linear-gradient(180deg, #0c0c0e, #050506)",
  boxShadow:
    "inset 0 2px 5px #000, inset 0 0 0 1px rgba(255, 255, 255, 0.06), 0 1px 0 rgba(255, 255, 255, 0.05)",
  fontFamily: vars.fontFamily.doto,
  ...weight(vars.fontWeight.extrabold),
  fontSize: vars.fontSize.base,
  letterSpacing: "0.04em",

  "@media": {
    [breakpoints.md]: { width: "40px", height: "30px", fontSize: vars.fontSize.lg },
  },
});

export const uplinkGhostStyle = style({
  gridArea: "1 / 1",
  color: `color-mix(in srgb, ${vars.colors.primary} 10%, transparent)`,
});

export const uplinkCountStyle = style({
  gridArea: "1 / 1",
  color: vars.colors.primary,
  textShadow: `0 0 6px color-mix(in srgb, ${vars.colors.primary} 55%, transparent)`,
});
