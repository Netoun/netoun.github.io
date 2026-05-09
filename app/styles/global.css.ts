import { globalStyle } from "@vanilla-extract/css";

import { vars } from "./theme.css";

// 1. Use a more-intuitive box-sizing model
globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
});

// 2. Remove default margin
globalStyle("*", {
  margin: 0,
});

// 3. Enable keyword animations
globalStyle("html", {
  "@media": {
    "(prefers-reduced-motion: no-preference)": {},
  },
});

// 4. Add accessible line-height and improve text rendering
globalStyle("body", {
  lineHeight: 1.5,
  WebkitFontSmoothing: "antialiased",
  backgroundColor: vars.colors.background,
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

// 9. Create a root stacking context
globalStyle("#root, #__next", {
  isolation: "isolate",
});

// Font family for html and body
globalStyle("html, body", {
  fontFamily: vars.fontFamily.ppNeueMontreal,
});
