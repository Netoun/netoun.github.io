import { keyframes, style } from "@vanilla-extract/css";
import { morphGutter, morphMotion, morphRange, morphSupports } from "./scroll-morph.css";
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

export const page = style({
  position: "relative",
  // Lifts the scroller's timeline to here, so the bar under the page (outside the scroller) can
  // read it too.
  timelineScope: "--lab-morph",
  flex: "1 1 22rem",
  minWidth: 0,
  maxWidth: "32rem",
  border: vars.border.strong,
  borderRadius: vars.radius.md,
});

// The hero's ink panel, reduced to its column.
export const hero = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  gap: vars.spacing.sm,
  height: "100%",
  padding: `${vars.spacing.lg} calc(${morphGutter} + ${vars.spacing.md})`,
  backgroundImage: `radial-gradient(120% 90% at 80% 100%, color-mix(in srgb, ${vars.colors.secondary} 40%, transparent), transparent 70%), linear-gradient(${vars.colors.foreground}, ${vars.colors.foreground})`,
  color: vars.colors.background,
});

export const heroLine = style({
  ...machine,
  ...weight(900),
  margin: 0,
  fontSize: vars.fontSize.lg,
  letterSpacing: "0.02em",
});

export const heroNote = style({
  ...machine,
  margin: 0,
  fontSize: "0.6875rem",
  color: vars.colors.mutedForegroundOnDark,
});

// The pin's run (the hero's 20vh), then the sections that follow it, on the column.
export const spacer = style({ height: morphRange });

export const sections = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
  padding: `${vars.spacing.md} calc(${morphGutter} + ${vars.spacing.sm}) ${vars.spacing.xl}`,
});

export const section = style({
  height: "5rem",
  borderRadius: vars.radius.sm,
  border: `1px dashed color-mix(in srgb, ${vars.colors.foreground} 25%, transparent)`,
  backgroundColor: `color-mix(in srgb, white 40%, transparent)`,
});

// Xray: the content column the frame lands on, and its full box before the clip.
export const column = style({
  position: "absolute",
  top: 0,
  bottom: 0,
  width: 0,
  borderLeft: `1px dashed ${vars.colors.tertiary}`,
  pointerEvents: "none",
  zIndex: 2,
  selectors: {
    "&[data-side='left']": { left: `calc(${vars.spacing.sm} + ${morphGutter})` },
    "&[data-side='right']": { right: `calc(${vars.spacing.sm} + ${morphGutter})` },
  },
});

export const ghost = style({
  position: "absolute",
  inset: vars.spacing.sm,
  borderRadius: "inherit",
  outline: `1px dashed ${vars.colors.primary}`,
  outlineOffset: "-1px",
  pointerEvents: "none",
});

// The timeline itself, drawn by the timeline: a bar that fills over the same range.
const fill = keyframes({ from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } });

export const timeline = style({
  position: "absolute",
  left: vars.spacing.sm,
  right: vars.spacing.sm,
  bottom: "-0.875rem",
  height: "0.25rem",
  borderRadius: "1px",
  backgroundColor: `color-mix(in srgb, ${vars.colors.foreground} 12%, transparent)`,
  overflow: "hidden",
});

export const timelineFill = style({
  display: "block",
  height: "100%",
  transformOrigin: "left",
  transform: "scaleX(0)",
  backgroundColor: vars.colors.primary,
  "@supports": {
    [morphSupports]: {
      "@media": {
        [morphMotion]: {
          animationName: fill,
          animationTimingFunction: "linear",
          animationFillMode: "both",
          animationTimeline: "--lab-morph",
          animationRange: `0 ${morphRange}`,
        },
      },
    },
  },
});

export const note = style({
  ...machine,
  margin: `${vars.spacing.sm} 0 0`,
  fontSize: "0.6875rem",
  textTransform: "none",
  color: vars.colors.mutedForeground,
  display: "none",
  "@supports": {
    [`not ${morphSupports}`]: { display: "block" },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": { display: "block" },
  },
});

export const xray = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.375rem",
  width: "17rem",
  maxWidth: "100%",
});

export const kicker = style({
  ...machine,
  ...weight(900),
  margin: 0,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.14em",
  color: `color-mix(in oklab, ${vars.colors.secondary} 70%, ${vars.colors.foreground})`,
});

export const figure = style({
  ...machine,
  ...weight(900),
  margin: 0,
  fontSize: "1.75rem",
  lineHeight: 1.1,
});

export const line = style({
  ...machine,
  margin: 0,
  fontSize: "0.6875rem",
  color: vars.colors.mutedForeground,
});

export const code = style({
  margin: 0,
  fontFamily: vars.fontFamily.mono,
  fontSize: "0.75rem",
  lineHeight: 1.5,
  overflowWrap: "anywhere",
});
