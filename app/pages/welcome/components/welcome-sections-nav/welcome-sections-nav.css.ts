import { globalStyle, style } from "@vanilla-extract/css";
import { motion } from "@/styles/motion.css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";

// Scroll-status menu, remix.run style: fixed bottom-left, wavy neon progress
// track + section labels. Hidden while the hero is in view, slides in once
// the hero has been scrolled past. Hidden below `md` (mobile handled later).
export const navStyle = style({
  display: "none",

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
      // At rest the menu is marks in the margin, not a floating card: the
      // panel chrome only materialises once it is hovered or focused.
      border: "1px solid transparent",
      backgroundColor: "transparent",

      // Hidden until the hero is scrolled past; visibility keeps the links
      // out of the tab order while hidden.
      opacity: 0,
      visibility: "hidden",
      pointerEvents: "none",
      transform: "translateY(16px)",
      transitionProperty: "opacity, transform, visibility, background-color, border-color",
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
});

// Crisp neon line, lit up to the current scroll progress.
export const trackNeonStyle = style({
  fill: "none",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeDasharray: 1,
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

// Collapsed by default: the index alone, ~26px of marginalia. The section name
// slides open on hover / focus-within, so the menu only covers content while
// the reader is actually pointing at it.
export const linkIndexStyle = style({
  display: "inline-block",
});

export const linkNameStyle = style({
  display: "inline-block",
  verticalAlign: "bottom",
  overflow: "hidden",
  whiteSpace: "nowrap",
  maxWidth: 0,
  opacity: 0,
  transitionProperty: "max-width, opacity",
  transitionDuration: motion.duration.base,
  transitionTimingFunction: motion.easing.signature,

  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transitionDuration: "0.01ms",
    },
  },
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

// Expansion: names slide open and the panel chrome fades in, together, only
// while the menu is pointed at or keyboard-focused.
globalStyle(`${navStyle}:hover ${linkNameStyle}, ${navStyle}:focus-within ${linkNameStyle}`, {
  // Longest label (" / EXPERIENCE") measures ~77px in Doto at this size;
  // 6rem leaves headroom so a font swap can never clip a name mid-word.
  maxWidth: "6rem",
  opacity: 1,
});

// Opaque once open: expanded, the menu sits over project imagery, and a
// half-transparent panel made small grey Doto labels unreadable against a
// bright card. Same paper stock and resting elevation as the cards.
globalStyle(`${navStyle}:hover, ${navStyle}:focus-within`, {
  borderColor: `color-mix(in srgb, ${vars.colors.cardBorder} 50%, transparent)`,
  backgroundColor: vars.colors.card,
  boxShadow: vars.boxShadow.restCard,
});
