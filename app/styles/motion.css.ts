// Shared motion vocabulary — durations and named easings.
// `signature` is the house curve: one easing for reveals and hovers, shared by CSS and JS.

/** Control points of the signature curve — shared by CSS and JS (anime.js `cubicBezier`). */
export const SIGNATURE_CURVE = [0.22, 1, 0.36, 1] as const;

export const motion = {
  duration: {
    fast: "150ms",
    base: "300ms",
    slow: "600ms",
  },
  easing: {
    signature: `cubic-bezier(${SIGNATURE_CURVE.join(", ")})`,
    out: "ease-out",
  },
  // Section reveal stagger: 70ms per element, capped by the consumer (~400ms).
  staggerStep: "70ms",
} as const;

/**
 * Arrival of a section's procedure (monitor, log, fetch), in ms from the section reveal: the
 * command types, then its output prints from `output`. Three sections arrive this way in a
 * row, so none holds its content back for more than ~600 ms.
 */
export const arrival = {
  commandDelay: 100,
  commandDuration: 450,
  output: 600,
} as const;
