import { keyframes, style } from "@vanilla-extract/css";
import { breakpoints } from "@/styles/responsive.css";
import { motion } from "@/styles/motion.css";
import { vars } from "@/styles/theme.css";

const paper = (percent: number) =>
  `color-mix(in srgb, ${vars.colors.background} ${percent}%, transparent)`;

const screw = (x: string) =>
  `radial-gradient(circle 2.5px at ${x} 50%, #74747c 0, #26262b 60%, rgba(0, 0, 0, 0.7) 85%, transparent 100%)`;

// A machined strip: bevelled, screwed at both ends, like the rack's own status bar.
export const stripStyle = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.sm,
  padding: `0.875rem ${vars.spacing.md} ${vars.spacing.xs}`,
  borderRadius: vars.radius.sm,
  background: "linear-gradient(180deg, #121215, #09090b)",
  border: "1px solid rgba(255, 255, 255, 0.07)",
  boxShadow: `
    inset 0 1px 0 rgba(255, 255, 255, 0.07),
    inset 0 -1px 0 rgba(0, 0, 0, 0.5),
    0 6px 16px rgba(0, 0, 0, 0.35)
  `,
  fontFamily: vars.fontFamily.doto,
  fontWeight: vars.fontWeight.extrabold,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.14em",
  lineHeight: 1.6,
  color: vars.colors.mutedForegroundOnDark,
  position: "relative",

  // Screws on their own layer, never under the text.
  selectors: {
    "&::before": {
      content: "",
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      pointerEvents: "none",
      display: "none",
      backgroundImage: `${screw("7px")}, ${screw("calc(100% - 7px)")}`,
    },
  },

  "@media": {
    [breakpoints.md]: {
      selectors: { "&::before": { display: "block" } },
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      columnGap: "1.125rem",
      rowGap: vars.spacing.xs,
      minHeight: "2.5rem",
      padding: `${vars.spacing.sm} 1.25rem`,
    },
    [breakpoints.xl]: {
      flexWrap: "nowrap",
      columnGap: "0.875rem",
      padding: "0 1.25rem",
      letterSpacing: "0.1em",
    },
  },
});

export const ledsStyle = style({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
});

export const ledItemStyle = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
});

const lanTraffic = keyframes({
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0.4 },
});

const lens = (color: string) =>
  `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${color} 40%, white) 0 18%, ${color} 48%, color-mix(in srgb, ${color} 45%, black) 100%)`;

const lit = (color: string) =>
  `0 0 0 1px rgba(0, 0, 0, 0.6), 0 0 6px color-mix(in srgb, ${color} 55%, transparent)`;

export const ledStyle = style({
  display: "block",
  width: "7px",
  height: "7px",
  borderRadius: vars.radius.full,
  boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.6)",

  selectors: {
    '&[data-led="PWR"]': {
      background: lens(vars.colors.secondary),
      boxShadow: lit(vars.colors.secondary),
    },
    '&[data-led="HDD"]': { background: lens(vars.colors.primary), opacity: 0.5 },
    // A cable is always plugged, so the link is up; it blinks while a port is being picked.
    '&[data-led="LAN"]': {
      background: lens(vars.colors.secondary),
      boxShadow: lit(vars.colors.secondary),
    },
    '&[data-led="LAN"][data-busy="true"]': { animation: `${lanTraffic} 900ms steps(2) infinite` },
    '&[data-led="ERR"]': { background: lens(vars.colors.destructive), opacity: 0.28 },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": {
      selectors: { '&[data-led="LAN"][data-busy="true"]': { animation: "none" } },
    },
  },
});

// Between xl and 2k the strip holds one line, so the LEDs go bare, as on the rack's own units.
export const ledLabelStyle = style({
  "@media": {
    [breakpoints.xl]: { display: "none" },
    [breakpoints["2k"]]: { display: "inline" },
  },
});

// Engraved separator: a dark cut with a lit lip.
export const grooveStyle = style({
  display: "none",
  width: "2px",
  height: "18px",
  borderLeft: "1px solid rgba(0, 0, 0, 0.7)",
  borderRight: "1px solid rgba(255, 255, 255, 0.06)",

  "@media": {
    [breakpoints.xl]: { display: "block" },
  },
});

export const buildStyle = style({
  margin: 0,
  "@media": {
    // `white-space` here, not on the strip: the global `p { text-wrap: pretty }` would win.
    [breakpoints.xl]: { flexGrow: 1, whiteSpace: "nowrap" },
  },
});

export const sourceStyle = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.spacing.xs,
  minHeight: "2.75rem",
  textTransform: "uppercase",
  textDecoration: "none",
  color: paper(80),
  borderRadius: vars.radius.xs,
  outline: "2px solid transparent",
  outlineOffset: "2px",
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,

  selectors: {
    "&:hover": { color: vars.colors.primary },
    "&:focus-visible": { color: vars.colors.primary, outlineColor: vars.colors.primary },
  },

  "@media": {
    [breakpoints.md]: { minHeight: "2.5rem" },
  },
});

export const copyrightStyle = style({
  margin: 0,
  paddingBottom: vars.spacing.sm,
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontWeight: vars.fontWeight.normal,
  fontSize: "0.8125rem",
  letterSpacing: 0,
  color: vars.colors.mutedForegroundOnDark,

  "@media": {
    [breakpoints.md]: { paddingBottom: 0 },
    [breakpoints.xl]: { whiteSpace: "nowrap" },
  },
});
