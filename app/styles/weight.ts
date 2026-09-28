/** WebKit only: Chromium and Firefox answer false (checked 2026-09-28). */
const WEBKIT = "(font: -apple-system-body)";

/**
 * Sets a weight. WebKit never maps `font-weight` onto PP Neue Montreal's weight axis (the file
 * has no STAT table and a non-standard `ital` axis), so every weight draws Thin there; it does
 * honour `font-variation-settings`, which this pins in WebKit alone. That setting inherits, so
 * every weight in the codebase goes through here (a test enforces it): a child that sets its
 * own weight must also reset the axis it inherited.
 */
export function weight(value: string | number) {
  return {
    fontWeight: value,
    "@supports": { [WEBKIT]: { fontVariationSettings: `"wght" ${value}` } },
  } as const;
}
