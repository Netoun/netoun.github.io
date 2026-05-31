import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const stageInner = style({
  width: "100%",
  maxWidth: "34rem",
});

// Light, tonal surface — the grain shader paints dark specks, so it only reads
// over a bright background (this mirrors how it's used over the light site).
export const grainBox = style({
  position: "relative",
  width: "100%",
  height: "20rem",
  borderRadius: vars.radius.md,
  overflow: "hidden",
  border: `1px solid ${vars.colors.cardBorder}`,
  background: "linear-gradient(135deg, oklch(0.96 0.03 95), oklch(0.82 0.05 75))",
});
