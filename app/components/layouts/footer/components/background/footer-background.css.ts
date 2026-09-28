import { style, styleVariants } from "@vanilla-extract/css";
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

/** Where each blurred shape sits in the panel, keyed by the shape's id. */
export const footerMeshShapePlacements = styleVariants({
  "footer-mesh-1": { top: "0%", left: "0%", width: "55%", height: "50%" },
  "footer-mesh-2": { bottom: "0", left: "0%", width: "20%", height: "30%" },
  "footer-mesh-3": { top: "40%", left: "50%", width: "35%", height: "55%" },
});

/** Holds the shared blur filter only: never painted. */
export const footerSvgDefsStyle = style({
  position: "absolute",
  visibility: "hidden",
});
