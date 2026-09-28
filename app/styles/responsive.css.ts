// In em, not px: a media query's em is the browser's default text size, so a visitor who sets
// it to 200 % gets the layout of a screen half as wide instead of rem tracks overflowing px
// breakpoints (WCAG 1.4.4). At the 16px default they are the usual 640 / 768 / 1024 / 1280 / 1920.
export const breakpoints = {
  sm: "screen and (min-width: 40em)",
  md: "screen and (min-width: 48em)",
  lg: "screen and (min-width: 64em)",
  xl: "screen and (min-width: 80em)",
  "2k": "screen and (min-width: 120em)",
};
