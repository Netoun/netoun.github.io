import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

// Mesh layer, exactly the visible frame. Its own background is a static CSS
// approximation of the shader (gold low left, violet high right, a trace of
// mint top left): the colour identity holds before the canvas is ready, without
// WebGL, and without JS.
export const welcomeMeshContainerStyles = style({
  position: "absolute",
  inset: 0,
  zIndex: 1,
  pointerEvents: "none",
  contain: "strict",
  backgroundColor: vars.colors.foreground,
  backgroundImage: `
    radial-gradient(ellipse 62% 78% at 20% 88%, color-mix(in srgb, ${vars.colors.primary} 24%, transparent), transparent 70%),
    radial-gradient(ellipse 55% 65% at 100% 0%, color-mix(in srgb, ${vars.colors.tertiary} 42%, transparent), transparent 70%),
    radial-gradient(ellipse 24% 22% at 14% -6%, color-mix(in srgb, ${vars.colors.secondary} 16%, transparent), transparent 72%)
  `,
});

export const welcomeShaderCanvasStyles = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  display: "block",
  zIndex: 5,
  opacity: 0,
  transition: "opacity 0.5s ease-in",
  selectors: {
    '&[data-ready="true"]': {
      opacity: 1,
    },
  },
});
