import { createVar, style, styleVariants } from "@vanilla-extract/css";
import { SHADER_CONFIG } from "@/components/misc/shaders/mesh-background/mesh-background.shader";
import { swatch } from "../../components/labs-readout/labs-readout.css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

export const stage = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: `${vars.spacing.lg} 2.75rem`,
  width: "100%",
});

export const stageInner = style({
  flex: "1 1 24rem",
  minWidth: 0,
  maxWidth: "40rem",
});

export const meshBox = style({
  position: "relative",
  width: "100%",
  height: "22rem",
  borderRadius: vars.radius.md,
  overflow: "hidden",
  border: `1px solid ${vars.colors.cardBorder}`,
});

// Xray: the shader's own geometry, drawn from SHADER_CONFIG over the canvas.
export const overlay = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  overflow: "visible",
  pointerEvents: "none",
});

/** A blob's colour, from its `color` in SHADER_CONFIG. */
export const blobColor = createVar();

export const blobEdge = style({
  fill: "none",
  stroke: blobColor,
  strokeWidth: 1,
  strokeDasharray: "4 4",
});

export const blobHalf = style({
  fill: "none",
  stroke: blobColor,
  strokeWidth: 1.5,
});

export const blobOrbit = style({
  fill: blobColor,
  stroke: "white",
  strokeWidth: 1,
});

export const vignetteRing = style({
  fill: "none",
  stroke: "white",
  strokeOpacity: 0.45,
  strokeWidth: 1,
  strokeDasharray: "2 5",
});

export const label = style({
  position: "absolute",
  transform: "translate(-50%, -150%)",
  padding: "0 4px",
  borderRadius: "2px",
  fontFamily: vars.fontFamily.doto,
  ...weight(900),
  fontSize: "0.625rem",
  lineHeight: 1.5,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  color: vars.colors.foreground,
  backgroundColor: blobColor,
});

/** Where a label sits, in % of the canvas. */
export const labelX = createVar();
export const labelY = createVar();

export const labelAt = style({ left: labelX, top: labelY });

const rgb = ([r, g, b]: readonly [number, number, number]) =>
  `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`;

/** The readout's swatches, in each blob's `color`. */
export const blobSwatches = styleVariants(
  { blob1: SHADER_CONFIG.blob1, blob2: SHADER_CONFIG.blob2, blob3: SHADER_CONFIG.blob3 },
  (blob) => [swatch, { backgroundColor: rgb(blob.color) }],
);
