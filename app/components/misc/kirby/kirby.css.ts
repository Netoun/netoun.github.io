import { globalKeyframes, style } from "@vanilla-extract/css";

globalKeyframes("bounce", {
  "0%, 20%, 50%, 80%, 100%": {
    transform: "translateY(0)",
  },
  "40%": {
    transform: "translateY(-10px)",
  },
  "60%": {
    transform: "translateY(-5px)",
  },
});

export const kirbyStyle = style({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animation: "bounce 2s infinite ease-in-out",
});
