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
  display: "grid",
  justifyContent: "end",
  alignContent: "end",
});

export const shapeSvgStyle = style({
  gridArea: "1/1",
  right: "1rem",
  bottom: "0rem",
  width: "2rem",
  height: "2rem",
  opacity: 0.78,
  pointerEvents: "none",
  filter: `drop-shadow(0 0 6px color-mix(in srgb, var(--block-accent) 14%, transparent))`,
});
