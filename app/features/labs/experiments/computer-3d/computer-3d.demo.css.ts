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
  // Full row width, so the laptop's `maxWidth` shrinks it on a phone.
  width: "100%",
  transform: `scale(${stageScale})`,
});

export const wrapper3d = style({
  // The hero's desktop width: the perspective is in px, so a smaller laptop
  // reads flatter than the homepage's.
  width: "40rem",
  maxWidth: "100%",
  transformStyle: "preserve-3d",
  transform: `rotateX(${stageRotateX}) rotateY(${stageRotateY}) rotateZ(${stageRotateZ})`,
});
