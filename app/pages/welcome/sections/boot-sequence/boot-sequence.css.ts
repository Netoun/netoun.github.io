import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const bootSection = style({
  height: "400vh",
});

export const bootContainer = style({
  position: "sticky",
  top: 0,
});

export const bootSequence = style({
  overflow: "hidden",
  backgroundColor: vars.colors.foreground,
  padding: vars.spacing.xl,
});

export const bootLine = style({
  display: "block",
  marginBottom: "2px",
  opacity: 0,
  color: "#00ff00",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  transition: "opacity 0.2s ease",
  fontSize: "14px",
  lineHeight: "1.4",
});

export const bootLineVisible = style({
  opacity: 1,
});

export const bootLineError = style({
  color: "#ff4444",
});

export const bootLineSuccess = style({
  color: "#44ff44",
});

export const bootLineWarning = style({
  color: "#ffaa00",
});

export const bootLineInfo = style({
  color: "#4488ff",
});

export const bootLineSystem = style({
  color: "#888",
});

export const cursor = style({
  display: "inline-block",
  width: "8px",
  height: "16px",
  background: "#00ff00",
  marginLeft: "2px",
  animation: "blink 1s infinite",
});

export const parallaxBackground = style({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: -1,
  background: `
    radial-gradient(circle at 20% 80%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 255, 0, 0.05) 0%, transparent 50%),
    linear-gradient(45deg, transparent 30%, rgba(0, 255, 0, 0.02) 50%, transparent 70%)
  `,
});

export const floatingElements = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  background: "#00ff00",
  borderRadius: "50%",
  opacity: 0.3,
  animation: "float 8s infinite linear",
});

// Les animations sont maintenant dans animations.css.ts
