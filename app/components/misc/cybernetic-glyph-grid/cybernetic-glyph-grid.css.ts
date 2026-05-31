import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

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

export const canvasStyles = style({
  position: "relative",
  zIndex: 1,
  display: "block",
  width: "100%",
  height: "100%",
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
