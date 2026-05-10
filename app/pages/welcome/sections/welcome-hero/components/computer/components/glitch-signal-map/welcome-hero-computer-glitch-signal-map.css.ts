import { keyframes, style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

const scanKeyframes = keyframes({
  "0%": { transform: "translateY(-115%)" },
  "100%": { transform: "translateY(215%)" },
});

const lanePulseKeyframes = keyframes({
  "0%": { opacity: 0.52 },
  "45%": { opacity: 0.78 },
  "100%": { opacity: 0.52 },
});

const recalibrateKeyframes = keyframes({
  "0%": { opacity: 0.55, transform: "translate3d(0, 0, 0)" },
  "40%": { opacity: 0.96, transform: "translate3d(-0.45px, 0, 0)" },
  "75%": { opacity: 0.78, transform: "translate3d(0.4px, 0, 0)" },
  "100%": { opacity: 0.62, transform: "translate3d(0, 0, 0)" },
});

export const rootStyles = style({
  position: "relative",
  isolation: "isolate",
  contain: "layout paint style",
  pointerEvents: "auto",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  borderRadius: vars.radius.sm,
  background:
    "linear-gradient(180deg, oklch(0.13 0.03 215 / 0.92) 0%, oklch(0.1 0.02 230 / 0.96) 100%)",
  boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${vars.colors.secondary} 11%, transparent), inset 0 0 20px color-mix(in srgb, ${vars.colors.secondary} 8%, transparent)`,
});

export const textureStyles = style({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 1,
  opacity: 0.1,
  backgroundImage:
    "repeating-linear-gradient(0deg, transparent 0 2px, oklch(1 0 0 / 0.05) 2px 3px)",
});

export const scanlineStyles = style({
  position: "absolute",
  left: 0,
  right: 0,
  top: "-44%",
  height: "42%",
  pointerEvents: "none",
  zIndex: 2,
  opacity: 0.2,
  background: "linear-gradient(180deg, transparent 0%, oklch(1 0 0 / 0.12) 50%, transparent 100%)",
  animation: `${scanKeyframes} 9.2s linear infinite`,
  selectors: {
    ':global([data-quality="high"]) &': {
      opacity: 0.28,
      animationDuration: "6.8s",
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
      opacity: 0.1,
    },
  },
});

export const lanesStyles = style({
  position: "relative",
  zIndex: 1,
  width: "100%",
  height: "100%",
  display: "grid",
  gap: "2px",
  padding: vars.spacing.xs,
});

export const blockStyles = style({
  borderRadius: vars.radius.sm,
  cursor: "pointer",
  minHeight: "4px",
  opacity: 0.56,
  background: `color-mix(in srgb, ${vars.colors.secondary} 40%, transparent)`,
  boxShadow: `0 0 5px color-mix(in srgb, ${vars.colors.secondary} 14%, transparent)`,
  transition: "background-color 220ms ease, box-shadow 220ms ease, opacity 220ms ease",
  animation: `${lanePulseKeyframes} 3.4s ease-in-out infinite`,
  animationDelay: "var(--block-delay)",
  selectors: {
    "&:not(:hover)": {
      transitionDelay: "220ms",
    },
    '&[data-accent="true"]': {
      opacity: 0.78,
      background: `color-mix(in srgb, ${vars.colors.tertiary} 48%, ${vars.colors.kirby} 52%)`,
      boxShadow: `0 0 8px color-mix(in srgb, ${vars.colors.tertiary} 16%, transparent)`,
    },
    '&[data-state="recalibrating"]': {
      animation: `${recalibrateKeyframes} 230ms steps(2, end)`,
      opacity: 0.9,
      background: `color-mix(in srgb, ${vars.colors.primary} 62%, ${vars.colors.tertiary} 38%)`,
      boxShadow: `0 0 10px color-mix(in srgb, ${vars.colors.primary} 22%, transparent)`,
    },
    '&:hover, &[data-state="idle"]:hover, &[data-state="active"]:hover, &[data-state="recalibrating"]:hover':
      {
        opacity: 0.9,
        background: `color-mix(in srgb, ${vars.colors.primary} 54%, ${vars.colors.secondary} 46%)`,
        boxShadow: `0 0 10px color-mix(in srgb, ${vars.colors.primary} 24%, transparent)`,
        animation: "none",
        transitionDelay: "0ms",
      },
    ':global([data-quality="high"]) &[data-state="active"]': {
      opacity: 0.66,
    },
    ':global([data-quality="high"]) &[data-state="recalibrating"]': {
      opacity: 1,
      boxShadow: `0 0 12px color-mix(in srgb, ${vars.colors.primary} 30%, transparent)`,
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
      opacity: 0.66,
      transform: "none",
    },
  },
});

export const dotsLayerStyles = style({
  position: "absolute",
  inset: vars.spacing.xs,
  pointerEvents: "none",
  zIndex: 2,
});

export const dotStyles = style({
  position: "absolute",
  width: "2px",
  height: "2px",
  borderRadius: "50%",
  opacity: 0.34,
  backgroundColor: `color-mix(in srgb, ${vars.colors.secondary} 56%, ${vars.colors.foreground} 44%)`,
  selectors: {
    '&[data-accent="true"]': {
      opacity: 0.68,
      backgroundColor: `color-mix(in srgb, ${vars.colors.tertiary} 58%, ${vars.colors.kirby} 42%)`,
    },
    ':global([data-quality="high"]) &': {
      opacity: 0.5,
    },
  },
});
