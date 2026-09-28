// Injected by `define` in vite.config.ts: the UTC day the build ran, `YYYY-MM-DD`.
declare const __BUILD_DATE__: string;

// Injected by `define` in vite.config.ts: the short commit the build ran on, or "" when unknown.
declare const __BUILD_COMMIT__: string;

// Injected by `define` in vite.config.ts: how many paths the build prerenders.
declare const __PRERENDERED_ROUTES__: number;

// Injected by `define` in vite.config.ts: each Lab's tags, by slug, read from its descriptor.
declare const __LAB_TAGS__: Record<string, string[]>;

// Injected by `define` in vite.config.ts: the site's package.json dependency names (sorted)
// and its package manager (`bun`).
declare const __SITE_PACKAGES__: { dependencies: string[]; packageManager: string };
