import { style } from "@vanilla-extract/css";

// Container for mesh background layers
export const welcomeMeshContainerStyles = style({
  position: "absolute",
  inset: "-50% 0 0 0",
  width: "150%",
  height: "150%",
  zIndex: 1,
  pointerEvents: "none",
  // Promote to own compositor layer to isolate repaints from foreground content
  willChange: "transform",
  contain: "layout style paint",
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
