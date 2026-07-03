import { style } from "@vanilla-extract/css";
import { motion } from "@/styles/motion.css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";

// Scroll-status menu, remix.run style: fixed bottom-left, wavy neon progress
// track + section labels. Hidden while the hero is in view, slides in once
// the hero has been scrolled past. Hidden below `md` (mobile handled later).
export const navStyle = style({
  display: "none",
  vars: {
    "--scroll-progress": "0",
  },

  "@media": {
    [breakpoints.md]: {
      display: "flex",
      alignItems: "stretch",
      gap: vars.spacing.md,
      position: "fixed",
      bottom: vars.spacing.lg,
      left: vars.spacing.lg,
      // Above all page content (cards go up to z 3), below only the hero
      // morph stage (z 41): mid-hero the menu is already there, and the
      // panel's bottom edge uncovers it as the hero scrolls away.
      zIndex: 40,
      padding: vars.spacing.md,
      borderRadius: vars.radius.md,
      border: vars.border.subtle,
      backdropFilter: "blur(8px)",
      backgroundColor: `color-mix(in srgb, ${vars.colors.accent} 50%, transparent)`,

      // Hidden until the hero is scrolled past; visibility keeps the links
      // out of the tab order while hidden.
      opacity: 0,
      visibility: "hidden",
      pointerEvents: "none",
      transform: "translateY(16px)",
      transitionProperty: "opacity, transform, visibility",
      transitionDuration: motion.duration.base,
      transitionTimingFunction: motion.easing.signature,
    },
    "(prefers-reduced-motion: reduce)": {
      transitionDuration: "0.01ms",
    },
  },

  selectors: {
    "&[data-visible]": {
      "@media": {
        [breakpoints.md]: {
          opacity: 1,
          visibility: "visible",
          pointerEvents: "auto",
          transform: "translateY(0)",
          transitionDuration: motion.duration.slow,
        },
        "(prefers-reduced-motion: reduce)": {
          transitionDuration: "0.01ms",
        },
      },
    },
  },
});

// The wavy path needs lateral room; blur halo overflows on purpose.
export const trackStyle = style({
  position: "relative",
  width: "12px",
});

export const trackSvgStyle = style({
  display: "block",
  width: "100%",
  height: "100%",
  overflow: "visible",
});

// Dim base: the unlit remainder of the track.
export const trackBaseStyle = style({
  fill: "none",
  stroke: `color-mix(in srgb, ${vars.colors.cardBorder} 50%, transparent)`,
  strokeWidth: 2,
  strokeLinecap: "round",
});

// Soft halo under the crisp line — static blur, only dashoffset moves.
export const trackHaloStyle = style({
  fill: "none",
  strokeWidth: 7,
  strokeLinecap: "round",
  opacity: 0.4,
  filter: "blur(3px)",
  strokeDasharray: 1,
  strokeDashoffset: "calc(1 - var(--scroll-progress))",
});

// Crisp neon line, lit up to the current scroll progress.
export const trackNeonStyle = style({
  fill: "none",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeDasharray: 1,
  strokeDashoffset: "calc(1 - var(--scroll-progress))",
});

export const gradientStopTopStyle = style({
  stopColor: vars.colors.primary,
});

export const gradientStopMidStyle = style({
  stopColor: vars.colors.secondary,
});

export const gradientStopBottomStyle = style({
  stopColor: vars.colors.tertiary,
});

export const listStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
  listStyle: "none",
  padding: 0,
  margin: 0,
});

export const linkStyle = style({
  display: "inline-block",
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize["2xs"],
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  // Inactive: the muted gray used by section subtitles.
  color: vars.colors.mutedForeground,
  textDecoration: "none",
  borderRadius: vars.radius.sm,
  outline: "2px solid transparent",
  outlineOffset: "2px",
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,

  selectors: {
    "&:hover": {
      color: `color-mix(in srgb, ${vars.colors.primary} 90%, transparent)`,
    },
    '&[aria-current="true"]': {
      color: vars.colors.foreground,
      textShadow: `0 0 12px color-mix(in srgb, ${vars.colors.primary} 35%, transparent)`,
    },
    "&:focus-visible": {
      outlineColor: vars.colors.foreground,
    },
  },
});
