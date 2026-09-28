import { createVar, style } from "@vanilla-extract/css";

/** Set inline from the controls; the rotation vars inherit down to the 3D wrapper. */
export const stageScale = createVar();
export const stageRotateX = createVar();
export const stageRotateY = createVar();
export const stageRotateZ = createVar();

export const stageInner = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transform: `scale(${stageScale})`,
});

export const wrapper3d = style({
  transformStyle: "preserve-3d",
  transform: `rotateX(${stageRotateX}) rotateY(${stageRotateY}) rotateZ(${stageRotateZ})`,
});
