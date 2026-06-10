// Vocabulaire motion partagé — durées et easings nommés.
// `signature` est la courbe historique des cards (cubic-bezier(.22,1,.36,1)),
// promue en token pour unifier reveals et hovers.
export const motion = {
  duration: {
    fast: "150ms",
    base: "300ms",
    slow: "600ms",
  },
  easing: {
    signature: "cubic-bezier(0.22, 1, 0.36, 1)",
    out: "ease-out",
  },
  // Stagger des reveals de section : 70ms par élément, plafonné côté consommateur (~400ms).
  staggerStep: "70ms",
} as const;
