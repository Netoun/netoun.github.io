import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  gap: 5,
});

export const red = style({
  width: 10,
  height: 10,
  borderRadius: "50%",
  backgroundColor: "#ff5f57",
});

export const yellow = style({
  width: 10,
  height: 10,
  borderRadius: "50%",
  backgroundColor: "#febc2e",
});

export const green = style({
  width: 10,
  height: 10,
  borderRadius: "50%",
  backgroundColor: "#28c840",
});
