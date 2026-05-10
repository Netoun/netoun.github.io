import { style } from "@vanilla-extract/css";

export const holographicOverlayStyles = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 100,
  opacity: 0.8,
  mixBlendMode: "normal",
  backdropFilter: "blur(20px) saturate(1.2) brightness(1.08)",
  WebkitBackdropFilter: "blur(20px) saturate(1.2) brightness(1.08)",
  borderRadius: "inherit",
  boxShadow:
    "inset 0 0 0 0.75px rgba(255,255,255,0.62), inset 0 1px 0 rgba(255,255,255,0.72), inset 0 10px 24px rgba(255,255,255,0.2), inset 0 -10px 16px rgba(132,149,173,0.1)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.13) 46%, rgba(238,244,255,0.1) 100%)",
});
