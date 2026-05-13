import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const footerMeshContainerStyle = style({
  position: "absolute",
  inset: "-50% 0 0 0",
  width: "150%",
  height: "150%",
  zIndex: 1,
  pointerEvents: "none",
  willChange: "transform",
  contain: "layout style paint",
});

export const footerShaderCanvasStyle = style({
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

export const footerMeshShapeStyle = style({
  position: "absolute",
  backfaceVisibility: "hidden",
});

export const footerNoiseOverlayStyle = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  zIndex: 10,
  height: "100%",
  pointerEvents: "none",
  opacity: 0.25,
});

export const footerMeshGradientPathStyle = style({
  backfaceVisibility: "hidden",
  fill: "currentColor",
  selectors: {
    '&[data-mesh-index="1"]': {
      fill: `color-mix(in srgb, ${vars.colors.primary} 20%, transparent)`,
    },
    '&[data-mesh-index="2"]': {
      fill: `color-mix(in srgb, ${vars.colors.secondary} 20%, transparent)`,
    },
    '&[data-mesh-index="3"]': {
      fill: `color-mix(in srgb, ${vars.colors.tertiary} 20%, transparent)`,
    },
  },
});
