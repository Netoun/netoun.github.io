import { keyframes, style } from "@vanilla-extract/css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";

const scanlineKeyframes = keyframes({
  "0%": { transform: "translateY(-100%)" },
  "100%": { transform: "translateY(220%)" },
});

const bottomRevealKeyframes = keyframes({
  "0%": { opacity: 0.08 },
  "25%": { opacity: 0.22 },
  "100%": { opacity: 0.08 },
});

export const rootStyles = style({
  position: "relative",
  isolation: "isolate",
  contain: "layout paint style",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  overflow: "hidden",
  borderRadius: vars.radius.sm,
  padding: vars.spacing.xs,
  fontFamily: vars.fontFamily.doto,
  fontSize: "clamp(0.56rem, 0.68vw, 0.82rem)",
  lineHeight: vars.lineHeight.tight,
  letterSpacing: "0.04em",
  color: `color-mix(in srgb, ${vars.colors.secondary} 70%, ${vars.colors.muted})`,
  background:
    "linear-gradient(180deg, oklch(0.14 0.03 210 / 0.92) 0%, oklch(0.1 0.02 225 / 0.94) 100%)",
  boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${vars.colors.secondary} 18%, transparent), inset 0 0 24px color-mix(in srgb, ${vars.colors.secondary} 10%, transparent)`,
  selectors: {
    '&[data-reduced-motion="true"]::after': {
      animation: "none",
      opacity: 0.25,
    },
  },
  "@media": {
    [breakpoints.md]: {
      fontSize: "clamp(0.5rem, 0.58vw, 0.86rem)",
    },
    [breakpoints.xl]: {
      fontSize: "clamp(0.66rem, 0.45vw, 0.9rem)",
    },
  },
});

export const noiseOverlayStyles = style({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  opacity: 0.13,
  backgroundImage:
    "repeating-linear-gradient(0deg, transparent 0 2px, oklch(1 0 0 / 0.06) 2px 3px)",
});

export const scanlineStyles = style({
  position: "absolute",
  left: 0,
  right: 0,
  top: "-45%",
  height: "45%",
  pointerEvents: "none",
  opacity: 0.28,
  background: "linear-gradient(180deg, transparent 0%, oklch(1 0 0 / 0.14) 45%, transparent 100%)",
  animation: `${scanlineKeyframes} 6.8s linear infinite`,
  selectors: {
    ':global([data-quality="high"]) &': {
      opacity: 0.38,
      animationDuration: "5.2s",
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
});

export const bottomRevealStyles = style({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: "18%",
  pointerEvents: "none",
  zIndex: 2,
  background:
    "linear-gradient(0deg, oklch(1 0 0 / 0.14) 0%, oklch(1 0 0 / 0.02) 60%, transparent 100%)",
  animation: `${bottomRevealKeyframes} 620ms ease-out infinite`,
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
      opacity: 0.1,
    },
  },
});

export const linesWrapperStyles = style({
  position: "relative",
  zIndex: 1,
  flex: 1,
  overflow: "hidden",
  display: "flex",
  alignItems: "flex-end",
});

export const reelStyles = style({
  display: "grid",
  gap: "2px",
  whiteSpace: "nowrap",
  width: "100%",
  willChange: "transform",
  transform: "translate3d(0, 0, 0)",
  transition: "transform 250ms linear",
  selectors: {
    '&[data-animating="false"]': {
      transition: "none",
    },
    '&[data-shifting="false"]': {
      transition: "none",
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});

const appearLines = keyframes({
  "0%": {
    opacity: 0,
    color: vars.colors.primary,
    transform: "translate3d(-10px, 0, 0) scaleY(0.8)",
  },
  "100%": {
    opacity: 1,
    transform: "translate3d(0, 0, 0) scaleY(1)",
  },
});

export const lineStyles = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: `color-mix(in srgb, ${vars.colors.secondary} 74%, ${vars.colors.foreground} 26%)`,
  textShadow: `0 0 8px color-mix(in srgb, ${vars.colors.secondary} 18%, transparent)`,
  selectors: {
    '&[data-dim="true"]': {
      opacity: 0.72,
    },
  },
  ":last-child": {
    animation: `${appearLines} 1000ms ease-out`,
  },
});
