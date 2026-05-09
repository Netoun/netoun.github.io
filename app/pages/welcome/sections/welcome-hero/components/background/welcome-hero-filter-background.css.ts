import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

// Container for mesh background layers
export const welcomeMeshContainerStyles = style({
  position: "absolute",
  inset: "-50% 0 0 0",
  width: "150%",
  height: "150%",
  zIndex: 1,
  pointerEvents: "none",
});

// Individual mesh shape SVG (positioned absolutely within container)
export const welcomeMeshShapeStyles = style({
  position: "absolute",
  backfaceVisibility: "hidden",
});

// Noise overlay covers entire container
export const welcomeNoiseOverlayStyles = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  zIndex: 10,
  height: "100%",
  pointerEvents: "none",
  opacity: 0.25,
});

export const welcomeMeshGradientPathStyles = style({
  backfaceVisibility: "hidden",
  fill: "currentColor",
  selectors: {
    '&[data-mesh-index="1"]': {
      fill: `color-mix(in srgb, ${vars.colors.primary} 25%, transparent)`,
    },
    '&[data-mesh-index="2"]': {
      fill: `color-mix(in srgb, ${vars.colors.secondary} 25%, transparent)`,
    },
    '&[data-mesh-index="3"]': {
      fill: `color-mix(in srgb, ${vars.colors.tertiary} 25%, transparent)`,
    },
  },
});

export const welcomeMousePathContainerStyles = style({
  position: "absolute",
  inset: 0,
  zIndex: 10,
  pointerEvents: "none", // Avoid blocking interactions
});

export const welcomeMousePathStyles = style({
  fill: `color-mix(in srgb, ${vars.colors.foreground} 50%, transparent)`,
  opacity: 1,
  filter: "blur(10px)",
  willChange: "d", // Helps when animating the path shape
  selectors: {
    ':global([data-quality="high"]) &': {
      backdropFilter: "blur(10px)",
    },
  },
});
