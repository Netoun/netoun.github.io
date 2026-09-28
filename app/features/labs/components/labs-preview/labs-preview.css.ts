import { createVar, style } from "@vanilla-extract/css";

/** Scale that fits the demo's stage into the preview screen, written by LabsPreview. */
export const previewScale = createVar();

// The stage is laid out at the experiment page's size, then scaled down as one piece: the
// demos keep their own fixed sizes and never learn they are being previewed.
export const STAGE_WIDTH = 760;
export const STAGE_HEIGHT = 384;

export const boxStyle = style({
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  pointerEvents: "none",
});

// Centred on the box whatever its size: the stage is wider than the screen before it is scaled.
export const viewportStyle = style({
  position: "absolute",
  top: "50%",
  left: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "none",
  width: `${STAGE_WIDTH}px`,
  height: `${STAGE_HEIGHT}px`,
  transform: `translate(-50%, -50%) scale(${previewScale})`,
  vars: { [previewScale]: "0" },
});
