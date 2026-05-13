import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

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

export const canvasStyles = style({
  position: "relative",
  zIndex: 1,
  display: "block",
  width: "100%",
  height: "100%",
});

export const textureStyles = style({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 2,
  opacity: 0.1,
  backgroundImage:
    "repeating-linear-gradient(0deg, transparent 0 2px, oklch(1 0 0 / 0.05) 2px 3px)",
});
