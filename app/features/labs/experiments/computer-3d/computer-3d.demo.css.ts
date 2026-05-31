import { style } from "@vanilla-extract/css";

export const stageInner = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const wrapper3d = style({
  width: "22rem",
  maxWidth: "100%",
  transformStyle: "preserve-3d",
});
