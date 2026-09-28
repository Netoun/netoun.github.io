import { globalStyle, style } from "@vanilla-extract/css";
import { breakpoints } from "@/styles/responsive.css";
import { motion } from "@/styles/motion.css";
import { vars } from "@/styles/theme.css";
import * as plate from "../footer/components/patch-plate/footer-patch-plate.css";

const paper = (percent: number) =>
  `color-mix(in srgb, ${vars.colors.background} ${percent}%, transparent)`;
const accent = (color: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`;

// Film grain as a tiny SVG turbulence tile: the slim panel carries no canvas at all.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// The Labs close on the same dark bookend as the home, cut down to its contact line: no rack,
// no cable, no glass plate, and no shader. The mesh's three lights are held still as radials.
export const footerStyle = style({
  paddingTop: vars.spacing["2xl"],
  paddingBottom: vars.spacing.sm,
});

export const panelStyle = style({
  // Dark panel: every focus ring inside it is gold.
  vars: { [vars.colors.ring]: vars.colors.primary },
  position: "relative",
  isolation: "isolate",
  overflow: "hidden",
  marginInline: vars.spacing.sm,
  borderRadius: vars.radius.md,
  paddingTop: vars.spacing.xl,
  paddingBottom: vars.spacing.md,
  background: [
    `radial-gradient(52% 70% at 20% 8%, ${accent(vars.colors.primary, 17)}, transparent 72%)`,
    `radial-gradient(26% 60% at 6% 100%, ${accent(vars.colors.secondary, 18)}, transparent 70%)`,
    `radial-gradient(38% 90% at 74% 78%, ${accent(vars.colors.tertiary, 24)}, transparent 72%)`,
    `color-mix(in srgb, ${vars.colors.foreground} 98%, ${vars.colors.accent})`,
  ].join(", "),
  boxShadow: `
    inset 0 0 200px color-mix(in srgb, ${vars.colors.foreground} 80%, transparent),
    inset 0 0 40px color-mix(in srgb, ${vars.colors.foreground} 60%, transparent),
    inset 0 1px 0 ${paper(8)}
  `,

  selectors: {
    "&::before": {
      content: "",
      position: "absolute",
      inset: 0,
      zIndex: -1,
      opacity: 0.35,
      mixBlendMode: "overlay",
      pointerEvents: "none",
      backgroundImage: GRAIN,
    },
  },

  "@media": {
    [breakpoints.md]: {
      borderRadius: vars.radius.xl,
      paddingTop: "2.5rem",
      paddingBottom: vars.spacing.xl,
    },
  },
});

// On the page column, padded like the home footer's content.
export const contentStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,
  paddingInline: vars.spacing.sm,

  "@media": {
    [breakpoints.md]: { paddingInline: vars.spacing["3xl"] },
  },
});

// Stacked like the home plate's list below xl; one row of three from xl, where the full
// LinkedIn path has room (the middle column is the wide one).
export const portRowStyle = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",

  "@media": {
    [breakpoints.xl]: {
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.45fr) minmax(0, 1fr)",
    },
  },
});

export const portItemStyle = style({
  minWidth: 0,

  "@media": {
    [breakpoints.xl]: {
      selectors: {
        // Etched divider between ports, the plate's line turned upright.
        "&:not(:last-child)": {
          borderRight: "1px solid rgba(255, 255, 255, 0.07)",
          boxShadow: "1px 0 0 rgba(0, 0, 0, 0.3)",
        },
      },
    },
  },
});

// The port is the plate's own row (socket, plug and LED keyed on `data-plugged`); in a row the
// etched line under it gives way to the upright divider on its item, and the corners round.
export const portStyle = style({
  "@media": {
    [breakpoints.xl]: {
      selectors: {
        [`${portItemStyle} &`]: {
          borderBottom: "none",
          boxShadow: "none",
          borderRadius: vars.radius.sm,
          paddingRight: vars.spacing.md,
        },
      },
    },
  },
});

// No cable to wait for here: the LED lights as soon as the plug is seated.
globalStyle(`${portItemStyle} ${plate.portStyle}[data-plugged="true"] ${plate.socketLedStyle}`, {
  transitionDelay: motion.duration.fast,
});
