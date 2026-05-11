import { style, keyframes } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";
import { breakpoints } from "@/styles/responsive.css";

const beamDashFlow = keyframes({
  "0%": { strokeDashoffset: "24" },
  "100%": { strokeDashoffset: "0" },
});

const beamPulse = keyframes({
  "0%": { transform: "translate(0, 0)", opacity: 0.55 },
  "40%": { transform: "translate(10px, 0)", opacity: 0.25 },
  "100%": { transform: "translate(20px, 0)", opacity: 0.05 },
});

const beamGlow = keyframes({
  "0%": { opacity: 0.12, filter: "blur(1.5px)" },
  "50%": { opacity: 0.22, filter: "blur(2.5px)" },
  "100%": { opacity: 0.12, filter: "blur(1.5px)" },
});

export const beamStyles = style({
  position: "absolute",
  top: "50%",
  left: "calc(100% - 1px)",
  width: "1.25rem",
  height: "5rem",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  overflow: "visible",
  opacity: 0,
  zIndex: 1,
  transition: "opacity 300ms ease",
  filter: `blur(0.04rem)`,
  display: "none",

  selectors: {
    "&::before": {
      content: "",
      position: "absolute",
      inset: "-0.5rem 0",
      borderRadius: vars.radius.full,
      background: `radial-gradient(ellipse 100% 90% at 50% 50%, color-mix(in srgb, ${vars.colors.background} 88%, ${vars.colors.secondary}), transparent 70%)`,
      animation: `${beamGlow} 2.8s ease-in-out infinite`,
    },
    "[data-open=true] &": {
      opacity: 1,
    },
    "[data-open=false] &:hover": {
      opacity: 0.3,
    },
    "[data-mobile=true] &": {
      top: "auto",
      bottom: "100%",
      left: "50%",
      width: "5rem",
      height: "1.25rem",
      transform: "translateX(-50%)",
      opacity: 0,
    },
    "[data-mobile=true][data-open=true] &": {
      opacity: 0.7,
    },
  },

  "@media": {
    [breakpoints.md]: {
      display: "block",
    },
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
      transition: "none",
    },
  },
});

export const beamWireStyles = style({
  fill: "none",
  stroke: `color-mix(in srgb, ${vars.colors.background} 60%, ${vars.colors.secondary})`,
  strokeWidth: "1",
  strokeDasharray: "3 8",
  strokeLinecap: "round",
  animation: `${beamDashFlow} 2s linear infinite`,
});

export const beamWireDimStyles = style({
  fill: "none",
  stroke: `color-mix(in srgb, ${vars.colors.background} 38%, ${vars.colors.primary})`,
  strokeWidth: "0.7",
  strokeDasharray: "2 10",
  strokeLinecap: "round",
  animation: `${beamDashFlow} 2.8s linear infinite reverse`,
  opacity: 0.5,
});

export const beamFlowPrimaryStyles = style({
  fill: `color-mix(in srgb, ${vars.colors.background} 68%, ${vars.colors.secondary})`,
  filter: "blur(0.5px)",
  animation: `${beamPulse} 2.2s ease-in-out infinite`,
});

export const beamFlowSecondaryStyles = style({
  fill: `color-mix(in srgb, ${vars.colors.background} 55%, ${vars.colors.primary})`,
  filter: "blur(0.7px)",
  animation: `${beamPulse} 3s ease-in-out -1.4s infinite`,
});

export const beamPacketStyles = style({
  fill: vars.colors.primary,
  opacity: 0.95,
  filter: `drop-shadow(0 0 4px ${vars.colors.primary})`,
});
