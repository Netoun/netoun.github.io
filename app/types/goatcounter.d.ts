// GoatCounter on `window`: the config the snippet in analytics-snippet.data.ts sets, and `count`,
// which `count.js` adds once it has run. Before that, or off the production hosts, `count` is
// missing (or the whole object is).
interface Window {
  goatcounter?: {
    no_onload?: boolean;
    path?: () => string;
    count?: (vars?: { path?: string; title?: string; event?: boolean }) => void;
  };
}

interface ImportMetaEnv {
  /** Origin of the self-hosted GoatCounter (analytics.data.ts); unset where nothing is measured. */
  readonly VITE_ANALYTICS_ORIGIN?: string;
}
