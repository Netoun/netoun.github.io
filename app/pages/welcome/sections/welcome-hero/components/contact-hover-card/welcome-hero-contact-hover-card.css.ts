import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { motion } from "@/styles/motion.css";
import { vars } from "@/styles/theme.css";
import { breakpoints } from "@/styles/responsive.css";
import {
  iconGradientEndStopStyles,
  iconGradientMiddleStopStyles,
  iconGradientStartStopStyles,
} from "@/components/primitives/icons/contact-icon.css";

// Note: Les styles du beam SVG ont été déplacés dans
// components/beam/welcome-hero-contact-hover-card-beam.css.ts

export const wrapperStyles = style({
  position: "relative",
  display: "inline-block",
  width: "fit-content",

  selectors: {
    "&[data-mobile=true]": {
      width: "fit-content",
    },
  },
});

export const welcomeHeroContactHoverCardTriggerStyles = style({
  position: "relative",
  display: "inline-flex",
  width: "fit-content",
  // Magnetic CTA : suit le curseur de ±4px max via use-magnetic.hook
  transform: "translate3d(var(--magnet-x, 0px), var(--magnet-y, 0px), 0)",
  transition: `transform ${motion.duration.fast} ${motion.easing.out}`,
});

const popoverEnter = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateY(14px) scale(0.96)",
    filter: "blur(8px)",
  },
  "65%": {
    opacity: 1,
    transform: "translateY(-2px) scale(1.01)",
    filter: "blur(0)",
  },
  "100%": {
    opacity: 1,
    transform: "translateY(0) scale(1)",
    filter: "blur(0)",
  },
});

const popoverEnterFromRight = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateX(-14px) scaleX(0.6) scaleY(0.92) skewX(-10deg)",
    filter: "blur(9px)",
  },
  "55%": {
    opacity: 1,
    transform: "translateX(2px) scaleX(1.03) scaleY(1.01) skewX(2deg)",
    filter: "blur(0)",
  },
  "100%": {
    opacity: 1,
    transform: "translateX(0) scaleX(1) scaleY(1) skewX(0)",
    filter: "blur(0)",
  },
});

const popoverEnterFromLeft = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateX(14px) scaleX(0.6) scaleY(0.92) skewX(10deg)",
    filter: "blur(9px)",
  },
  "55%": {
    opacity: 1,
    transform: "translateX(-2px) scaleX(1.03) scaleY(1.01) skewX(-2deg)",
    filter: "blur(0)",
  },
  "100%": {
    opacity: 1,
    transform: "translateX(0) scaleX(1) scaleY(1) skewX(0)",
    filter: "blur(0)",
  },
});

const popoverEnterFromTop = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateY(14px) scaleY(0.7) scaleX(0.95) skewY(-4deg)",
    filter: "blur(9px)",
  },
  "55%": {
    opacity: 1,
    transform: "translateY(-2px) scaleY(1.03) scaleX(1.01) skewY(1deg)",
    filter: "blur(0)",
  },
  "100%": {
    opacity: 1,
    transform: "translateY(0) scaleY(1) scaleX(1) skewY(0)",
    filter: "blur(0)",
  },
});

const popoverExit = keyframes({
  "0%": {
    opacity: 1,
    transform: "translateY(0) scale(1)",
    filter: "blur(0)",
  },
  "100%": {
    opacity: 0,
    transform: "translateY(8px) scale(0.98)",
    filter: "blur(4px)",
  },
});

const scanline = keyframes({
  "0%": {
    transform: "translateY(-100%)",
    opacity: 0,
  },
  "10%": {
    opacity: 0.2,
  },
  "100%": {
    transform: "translateY(180%)",
    opacity: 0,
  },
});

export const popoverStyles = style({
  position: "relative",
  overflow: "hidden",
  borderRadius: vars.radius.lg,
  backdropFilter: "blur(3px)",
  background: `color-mix(in srgb, ${vars.colors.background} 20%, transparent)`,
  boxShadow: `
    0 16px 44px color-mix(in srgb, ${vars.colors.foreground} 60%, transparent),
    0 0 24px color-mix(in srgb, ${vars.colors.primary} 14%, transparent),
    inset 0 0 0 1px color-mix(in srgb, ${vars.colors.background} 18%, transparent)
  `,
  outline: "none",
  transformOrigin: "left center",
  willChange: "transform, opacity, filter",

  selectors: {
    "&::before": {
      content: "",
      position: "absolute",
      inset: 1,
      borderRadius: `calc(${vars.radius.lg} - 2px)`,
      border: `1px solid color-mix(in srgb, ${vars.colors.secondary} 38%, transparent)`,
      pointerEvents: "none",
      opacity: 0.55,
    },
    "&::after": {
      content: "",
      position: "absolute",
      left: 0,
      right: 0,
      height: "36%",
      background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.secondary} 26%, transparent), transparent)`,
      mixBlendMode: "screen",
      pointerEvents: "none",
      animation: `${scanline} 2.8s cubic-bezier(0.2, 0.8, 0.2, 1) infinite`,
    },
    "&[data-placement=top]": {
      marginBottom: "6px",
      transformOrigin: "bottom center",
    },
    "&[data-placement=right]": {
      marginLeft: "8px",
      transformOrigin: "left center",
    },
    "&[data-placement=left]": {
      marginRight: "8px",
      transformOrigin: "right center",
    },
    "&[data-entering]": {
      animation: `${popoverEnter} 280ms cubic-bezier(0.16, 1, 0.3, 1) both`,
    },
    "&[data-placement=right][data-entering]": {
      animation: `${popoverEnterFromRight} 320ms cubic-bezier(0.2, 0.95, 0.22, 1) both`,
    },
    "&[data-placement=left][data-entering]": {
      animation: `${popoverEnterFromLeft} 320ms cubic-bezier(0.2, 0.95, 0.22, 1) both`,
    },
    "&[data-placement=top][data-entering]": {
      animation: `${popoverEnterFromTop} 300ms cubic-bezier(0.2, 0.95, 0.22, 1) both`,
    },
    "&[data-exiting]": {
      animation: `${popoverExit} 180ms ease-out both`,
    },
  },
});

export const arrowStyles = style({
  display: "block",
  fill: "color-mix(in srgb, var(--highlight-background) 92%, transparent)",
  stroke: "color-mix(in srgb, var(--highlight-border) 78%, transparent)",
  paintOrder: "stroke",
  strokeWidth: "2px",
  filter: `drop-shadow(0 2px 8px color-mix(in srgb, ${vars.colors.primary} 30%, transparent))`,
});

export const cardInnerStyles = style({
  position: "relative",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  minWidth: "13.5rem",
  padding: vars.spacing.md,
  backgroundImage: `linear-gradient(90deg, color-mix(in srgb, ${vars.colors.background} 7%, transparent) 1px, transparent 1px), linear-gradient(180deg, color-mix(in srgb, ${vars.colors.background} 5%, transparent) 1px, transparent 1px)`,
  backgroundSize: "14px 14px",
});

export const linkStyles = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
  padding: `${vars.spacing.xs} ${vars.spacing.xs}`,
  borderRadius: vars.radius.sm,
  color: vars.colors.background,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.extrabold,
  textTransform: "uppercase",
  textDecoration: "none",
  letterSpacing: "0.04em",
  transition: "background-color 150ms ease, color 150ms ease",

  ":hover": {
    backgroundColor: "color-mix(in srgb, var(--highlight-background) 88%, transparent)",
    color: vars.colors.secondary,
    textShadow: vars.textShadow.glowSm,
  },

  "@media": {
    [breakpoints.md]: {
      fontSize: vars.fontSize.lg,
      padding: `${vars.spacing.xs} ${vars.spacing.sm}`,
    },
  },
});

export const iconStyles = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
  flexShrink: 0,
});

globalStyle(`.${linkStyles}:hover .${iconGradientStartStopStyles}`, {
  stopColor: `color-mix(in srgb, ${vars.colors.secondary} 78%, ${vars.colors.background})`,
});

globalStyle(`.${linkStyles}:hover .${iconGradientMiddleStopStyles}`, {
  stopColor: `color-mix(in srgb, ${vars.colors.secondary} 34%, ${vars.colors.background})`,
});

globalStyle(`.${linkStyles}:hover .${iconGradientEndStopStyles}`, {
  stopColor: `color-mix(in srgb, ${vars.colors.secondary} 92%, ${vars.colors.tertiary})`,
});

globalStyle(`${iconStyles} svg`, {
  width: "1.25rem",
  minWidth: "1.25rem",
  height: "1.25rem",
  minHeight: "1.25rem",
  display: "block",
  flexShrink: 0,
});
