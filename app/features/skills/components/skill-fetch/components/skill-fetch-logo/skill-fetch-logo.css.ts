import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { domainLights, LOGO_START, LOGO_STEP } from "../../skill-fetch.css";
import { weight } from "@styles/weight";

export const logoStyle = style({
  position: "relative",
  margin: 0,
  // Doto, then the system monospace: both advance 0.6em per glyph, so the disc stays round
  // even before Doto has loaded (logo-ascii.ts is generated for 0.6 × 1 cells).
  fontFamily: `Doto, ${vars.fontFamily.mono}`,
  ...weight(vars.fontWeight.extrabold),
  lineHeight: 1,
  letterSpacing: 0,
  whiteSpace: "pre",
  userSelect: "none",
  // The glass's bloom would paint over the clipped gradient: the logo glows by filter instead.
  textShadow: "none",
  filter: `drop-shadow(0 0 0.35em color-mix(in srgb, ${vars.colors.background} 22%, transparent))`,
  // 42 cells of 0.6em = 25.2em wide: about 200px on a phone, a mark rather than a poster.
  fontSize: "0.5rem",
  "@media": {
    [breakpoints.sm]: { fontSize: "0.625rem" },
    // Beside the readout from md: back down so both columns fit.
    [breakpoints.md]: { fontSize: "0.75rem" },
    [breakpoints.lg]: { fontSize: "1rem" },
    [breakpoints.xl]: { fontSize: "1.15625rem" },
  },
});

// The favicon's holo gradient, lit on the terminal's ink, drifting as the favicon's does. The text
// itself is transparent so the gradient shows through; pointing at a readout line fills it with
// that line's colour, over the gradient (one layer: no hidden copy of the art).
export const holoStyle = style({
  display: "block",
  backgroundImage: `linear-gradient(120deg, ${domainLights.frontend} 0%, ${domainLights.backend} 45%, ${domainLights.creative} 70%, ${domainLights.frontend} 100%)`,
  backgroundSize: "240% 100%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  animation: "fetch-holo 14s linear infinite alternate",
  transition: "color 250ms cubic-bezier(0.22, 1, 0.36, 1)",
  selectors: {
    // Off screen (the section's animation priority), the drift holds still.
    '[data-anim-disabled="true"] &': {
      animationPlayState: "paused",
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
      transition: "none",
    },
  },
});

export const litTones = styleVariants({
  none: {},
  practice: { color: vars.colors.background },
  frontend: { color: domainLights.frontend },
  backend: { color: domainLights.backend },
  creative: { color: domainLights.creative },
  systems: { color: domainLights.systems },
  tooling: { color: domainLights.tooling },
});

export const rowStyle = style({
  display: "block",
});

// The logo prints top to bottom, a row at a time, like the terminal writing it.
const ROWS = 25;

globalStyle(`[data-reveal="idle"] ${holoStyle} ${rowStyle}`, {
  opacity: 0,
});

for (let index = 0; index < ROWS; index += 1) {
  globalStyle(`[data-reveal="revealed"] ${holoStyle} ${rowStyle}:nth-child(${index + 1})`, {
    animation: `fetch-print 1ms linear ${LOGO_START + index * LOGO_STEP}ms both`,
  });
}
