import { globalStyle } from "@vanilla-extract/css";

import { GRAIN_TILE } from "@/components/misc/shaders/grain/grain.shader";

import { dockClearance } from "./dock.css";
import { vars } from "./theme.css";
import "./animations.css";
import { weight } from "./weight";

// 1. Use a more-intuitive box-sizing model
globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
});

// 2. Remove default margin
globalStyle("*", {
  margin: 0,
});

// 3. Enable keyword animations + smooth anchor scrolling (sections nav)
globalStyle("html", {
  // Focus and scrollIntoView keep what they bring into view clear of the sections dock.
  scrollPaddingBottom: dockClearance,
  "@media": {
    "(prefers-reduced-motion: no-preference)": {
      scrollBehavior: "smooth",
    },
  },
});

// 4. Add accessible line-height and improve text rendering
globalStyle("body", {
  lineHeight: 1.5,
  WebkitFontSmoothing: "antialiased",
  backgroundColor: vars.colors.background,
});

// Film grain on the paper: `grain.shader.ts` baked into a tile by `bun run generate-grain-tile`
// (one cell per device pixel with the @2x file). Opaque cards and the dark panels cover it.
// `usePaperGrain` sets the attribute after `load`, so the tile never competes with the hero's
// font for the first paint.
globalStyle("html[data-grain] body", {
  backgroundImage: [
    "url(/images/grain-tile@1x.webp)",
    "image-set(url(/images/grain-tile@1x.webp) 1x, url(/images/grain-tile@2x.webp) 2x)",
  ],
  backgroundSize: `${GRAIN_TILE.size}px ${GRAIN_TILE.size}px`,
});

// 5. Improve media defaults
globalStyle("img, picture, video, canvas, svg", {
  display: "block",
  maxWidth: "100%",
});

// 6. Inherit fonts for form controls
globalStyle("input, button, textarea, select", {
  font: "inherit",
});

// 7. Avoid text overflows
globalStyle("p, h1, h2, h3, h4, h5, h6", {
  overflowWrap: "break-word",
});

// 8. Improve line wrapping
globalStyle("p", {
  textWrap: "pretty",
});

globalStyle("h1, h2, h3, h4, h5, h6", {
  textWrap: "balance",
});

// Font family for html and body
globalStyle("html, body", {
  fontFamily: vars.fontFamily.ppNeueMontreal,
  ...weight(vars.fontWeight.normal),
});

// The user agent's bold elements, for WebKit's weight axis (see `weight`). Zero specificity:
// a component's own weight wins.
globalStyle(":where(h1, h2, h3, h4, h5, h6, b, strong, th)", {
  ...weight(vars.fontWeight.bold),
});

// 10. Visible keyboard focus: ink on paper, gold where a dark surface remaps `ring`.
// Zero specificity, so a component's own ring (inset offset, colour) always wins.
globalStyle(":where(a, button, [tabindex]):where(:focus-visible)", {
  outline: `2px solid ${vars.colors.ring}`,
  outlineOffset: "2px",
  borderRadius: vars.radius.xs,
});

// 11. Respect reduced-motion for decorative CSS animations/transitions
globalStyle("*, *::before, *::after", {
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animationDuration: "0.01ms !important",
      animationIterationCount: "1 !important",
      transitionDuration: "0.01ms !important",
    },
  },
});
