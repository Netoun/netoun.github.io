import { vars } from "@styles/theme.css";
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
  boxShadow: `
    inset 0 0 0 0.75px color-mix(in srgb, ${vars.colors.background} 62%, transparent),
    inset 0 1px 0 color-mix(in srgb, ${vars.colors.background} 72%, transparent),
    inset 0 10px 24px color-mix(in srgb, ${vars.colors.background} 20%, transparent),
    inset 0 -10px 16px color-mix(in srgb, ${vars.colors.secondary} 10%, transparent)
  `,
  background: `
    linear-gradient(180deg,
      color-mix(in srgb, ${vars.colors.background} 24%, transparent) 0%,
      color-mix(in srgb, ${vars.colors.background} 13%, transparent) 46%,
      color-mix(in srgb, ${vars.colors.background} 10%, transparent) 100%
    )
  `,
});
