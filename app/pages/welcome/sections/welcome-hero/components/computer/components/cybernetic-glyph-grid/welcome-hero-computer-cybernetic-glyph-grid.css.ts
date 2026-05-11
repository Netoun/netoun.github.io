import { keyframes, style } from "@vanilla-extract/css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";

const pulseKeyframes = keyframes({
  "0%": { opacity: 0.54, transform: "translate3d(0, 0, 0)" },
  "45%": { opacity: 0.86, transform: "translate3d(0, -0.2px, 0)" },
  "100%": { opacity: 0.54, transform: "translate3d(0, 0, 0)" },
});

const glitchFlashKeyframes = keyframes({
  "0%": { opacity: 0.48, transform: "translate3d(0, 0, 0)" },
  "20%": { opacity: 0.95, transform: "translate3d(-0.45px, 0, 0)" },
  "55%": { opacity: 0.72, transform: "translate3d(0.35px, 0, 0)" },
  "100%": { opacity: 0.58, transform: "translate3d(0, 0, 0)" },
});

const scanlineKeyframes = keyframes({
  "0%": { transform: "translateY(-130%)" },
  "100%": { transform: "translateY(200%)" },
});

export const rootStyles = style({
  position: "relative",
  isolation: "isolate",
  contain: "layout paint style",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  borderRadius: vars.radius.sm,
  background:
    "linear-gradient(180deg, oklch(0.13 0.03 210 / 0.92) 0%, oklch(0.095 0.02 225 / 0.96) 100%)",
  boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${vars.colors.secondary} 12%, transparent), inset 0 0 22px color-mix(in srgb, ${vars.colors.secondary} 8%, transparent)`,
});

export const noiseOverlayStyles = style({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  opacity: 0.1,
  zIndex: 2,
  backgroundImage:
    "repeating-linear-gradient(0deg, transparent 0 2px, oklch(1 0 0 / 0.05) 2px 3px)",
});

export const scanlineStyles = style({
  position: "absolute",
  left: 0,
  right: 0,
  top: "-45%",
  height: "42%",
  pointerEvents: "none",
  zIndex: 2,
  opacity: 0.22,
  background: "linear-gradient(180deg, transparent 0%, oklch(1 0 0 / 0.14) 48%, transparent 100%)",
  animation: `${scanlineKeyframes} 8.2s linear infinite`,
  selectors: {
    ':global([data-quality="high"]) &': {
      opacity: 0.3,
      animationDuration: "6.4s",
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
      opacity: 0.1,
    },
  },
});

export const gridStyles = style({
  position: "relative",
  zIndex: 1,
  width: "100%",
  height: "100%",
  display: "grid",
  gap: "2px",
  padding: vars.spacing.xs,
  alignContent: "stretch",
  justifyContent: "stretch",
});

export const cellStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  userSelect: "none",
  fontFamily: vars.fontFamily.doto,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.none,
  fontSize: "clamp(0.46rem, 0.72vw, 0.78rem)",
  letterSpacing: "0.08em",
  color: `color-mix(in srgb, ${vars.colors.secondary} 64%, ${vars.colors.primary} 36%)`,
  textShadow: `0 0 7px color-mix(in srgb, ${vars.colors.primary} 12%, transparent)`,
  opacity: 0.62,
  transform: "translate3d(0, 0, 0)",
  animation: `${pulseKeyframes} 2.9s ease-in-out infinite`,
  animationDelay: "var(--pulse-delay)",
  willChange: "transform, opacity",
  contain: "layout paint style",
  selectors: {
    '&[data-accent="true"]': {
      color: `color-mix(in srgb, ${vars.colors.tertiary} 46%, ${vars.colors.kirby} 54%)`,
      opacity: 0.85,
      textShadow: `0 0 10px color-mix(in srgb, ${vars.colors.primary} 18%, transparent)`,
    },
    '&[data-glitch="true"]': {
      animation: `${glitchFlashKeyframes} 190ms steps(2, end)`,
      color: `color-mix(in srgb, ${vars.colors.tertiary} 34%, ${vars.colors.primary} 66%)`,
      textShadow: `0 0 12px color-mix(in srgb, ${vars.colors.tertiary} 20%, transparent)`,
    },
  },
  "@media": {
    [breakpoints.md]: {
      fontSize: "clamp(0.5rem, 0.62vw, 0.8rem)",
    },
    [breakpoints.xl]: {
      fontSize: "clamp(0.56rem, 0.5vw, 0.86rem)",
    },
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
      opacity: 0.72,
      transform: "none",
    },
  },
});
