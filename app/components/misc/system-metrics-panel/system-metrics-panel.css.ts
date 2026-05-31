import { keyframes, style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";
import { breakpoints } from "@/styles/responsive.css";

const scanlineKeyframes = keyframes({
  "0%": { transform: "translateY(-120%)" },
  "100%": { transform: "translateY(210%)" },
});

const pulseKeyframes = keyframes({
  "0%": { opacity: 0.35 },
  "50%": { opacity: 0.8 },
  "100%": { opacity: 0.35 },
});

export const rootStyles = style({
  position: "relative",
  isolation: "isolate",
  contain: "layout paint style",
  height: "100%",
  padding: vars.spacing.sm,
  display: "grid",
  gridTemplateRows: "auto 1fr",
  overflow: "hidden",
  borderRadius: vars.radius.sm,
  fontFamily: vars.fontFamily.doto,
  background:
    "linear-gradient(180deg, oklch(0.14 0.02 227 / 0.94) 0%, oklch(0.1 0.015 232 / 0.96) 100%)",
  boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${vars.colors.secondary} 22%, transparent), inset 0 0 18px color-mix(in srgb, ${vars.colors.secondary} 10%, transparent)`,
  color: `color-mix(in srgb, ${vars.colors.secondary} 76%, ${vars.colors.foreground})`,
  "@media": {
    [breakpoints.md]: {
      gap: vars.spacing.xs,
    },
  },
});

export const textureStyles = style({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  opacity: 0.22,
  backgroundImage:
    "repeating-linear-gradient(0deg, transparent 0 2px, oklch(1 0 0 / 0.05) 2px 3px)",
});

export const scanlineStyles = style({
  position: "absolute",
  top: "-40%",
  left: 0,
  right: 0,
  height: "40%",
  pointerEvents: "none",
  opacity: 0.2,
  background: "linear-gradient(180deg, transparent 0%, oklch(1 0 0 / 0.16) 52%, transparent 100%)",
  animation: `${scanlineKeyframes} 7.1s linear infinite`,
  selectors: {
    ':global([data-quality="high"]) &': {
      opacity: 0.3,
      animationDuration: "5.4s",
    },
    ':global([data-reduced-motion="true"]) &': {
      animation: "none",
      opacity: 0.08,
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
      opacity: 0.08,
    },
  },
});

export const headerStyles = style({
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "clamp(0.3rem, 0.54rem + 0.2vw, 0.64rem)",
  letterSpacing: "0.08em",
  lineHeight: 1,
});

export const headerLabelStyles = style({
  opacity: 0.86,
});

export const headerTickStyles = style({
  opacity: 0.58,
  fontSize: "clamp(0.3rem, 0.5rem + 0.2vw, 0.6rem)",
});

export const metricsListStyles = style({
  position: "relative",
  zIndex: 1,
  display: "grid",
  alignContent: "start",
  "@media": {
    [breakpoints.md]: {
      gap: "3px",
    },
  },
});

export const metricRowStyles = style({
  display: "grid",
  gridTemplateColumns: "28px 26px 1fr",
  alignItems: "center",
  minHeight: "12px",
  "@media": {
    [breakpoints.md]: {
      gap: "4px",
    },
  },
});

export const metricKeyStyles = style({
  fontSize: "clamp(0.2rem, 0.5rem + 0.2vw, 0.6rem)",
  letterSpacing: "0.09em",
  opacity: 0.75,
});

export const metricValueStyles = style({
  fontSize: "clamp(0.2rem, 0.52rem + 0.2vw, 0.64rem)",
  textAlign: "right",
  letterSpacing: "0.05em",
  color: `color-mix(in srgb, ${vars.colors.secondary} 82%, ${vars.colors.foreground} 18%)`,
});

export const metricBarStyles = style({
  position: "relative",
  display: "block",
  height: "2px",
  borderRadius: "2px",
  background: "oklch(0.24 0.02 230 / 0.75)",
  overflow: "hidden",
  selectors: {
    '&[data-pulse="true"]::after': {
      animation: `${pulseKeyframes} 1.8s ease-in-out infinite`,
    },
    '&[data-band="high"]::before': {
      background: `linear-gradient(90deg, color-mix(in srgb, ${vars.colors.tertiary} 24%, transparent) 0%, color-mix(in srgb, ${vars.colors.tertiary} 75%, ${vars.colors.secondary} 25%) 100%)`,
    },
    '&[data-band="mid"]::before': {
      background: `linear-gradient(90deg, color-mix(in srgb, ${vars.colors.secondary} 30%, transparent) 0%, color-mix(in srgb, ${vars.colors.secondary} 84%, ${vars.colors.foreground} 16%) 100%)`,
    },
    '&[data-band="low"]::before': {
      background: `linear-gradient(90deg, color-mix(in srgb, ${vars.colors.primary} 42%, transparent) 0%, color-mix(in srgb, ${vars.colors.primary} 70%, ${vars.colors.secondary} 30%) 100%)`,
    },
  },
  "::before": {
    content: "",
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "var(--metric-fill)",
    borderRadius: "2px",
    boxShadow: "0 0 6px oklch(0.75 0.06 210 / 0.22)",
  },
  "::after": {
    content: "",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(90deg, transparent 0%, oklch(1 0 0 / 0.22) 50%, transparent 100%)",
    opacity: 0.35,
    pointerEvents: "none",
  },
  "@media": {
    [breakpoints.md]: {
      height: "5px",
    },
    "(prefers-reduced-motion: reduce)": {
      selectors: {
        '&[data-pulse="true"]::after': {
          animation: "none",
          opacity: 0.12,
        },
      },
    },
  },
});
