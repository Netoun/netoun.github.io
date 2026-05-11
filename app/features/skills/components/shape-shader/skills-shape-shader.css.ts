import { style } from "@vanilla-extract/css";

export const shapeShaderContainerStyle = style({
  position: "relative",
  width: "100%",
  height: "100%",
  marginTop: "auto",
  display: "flex",
  alignItems: "end",
});

export const shapeShaderIntersectionStyle = style({
  position: "relative",
  width: "100%",
  height: "100%",
  willChange: "transform",
  contain: "layout",
  display: "grid",
  justifyContent: "end",
  alignContent: "end",
});

export const shapeBaseStyle = style({
  gridArea: "1/1",
  right: "1rem",
  bottom: "0rem",
  width: "2rem",
  height: "2rem",
  opacity: 0.5,
  pointerEvents: "none",
  filter: "drop-shadow(0 0 10px color-mix(in srgb, var(--block-accent) 35%, transparent))",
  boxShadow: "inset 0 0 8px color-mix(in srgb, white 24%, transparent)",
  backgroundImage:
    "radial-gradient(circle at 28% 24%, color-mix(in srgb, white 40%, transparent) 0%, transparent 45%)",
  backgroundBlendMode: "screen",
});

export const shapeShaderCanvasStyle = style({
  gridArea: "1/1",

  right: "1rem",
  bottom: "0rem",
  width: "2rem",
  height: "2rem",
  pointerEvents: "none",
  opacity: 0.78,
  mixBlendMode: "screen",
  filter: "drop-shadow(0 0 6px color-mix(in srgb, var(--block-accent) 14%, transparent))",
});

export const shapeSparkleStyle = style({
  clipPath:
    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  backgroundColor: "var(--block-accent)",
});

export const shapeDiamondStyle = style({
  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
  backgroundColor: "var(--block-accent)",
});

export const shapeCubeStyle = style({
  borderRadius: "6px",
  backgroundColor: "var(--block-accent)",
});

export const shapeCircleStyle = style({
  borderRadius: "50%",
  backgroundColor: "var(--block-accent)",
});

export const shapeHexagonStyle = style({
  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
  backgroundColor: "var(--block-accent)",
});

export const shapeRingStyle = style({
  borderRadius: "50%",
  border: "3px solid var(--block-accent)",
  backgroundColor: "transparent",
});
