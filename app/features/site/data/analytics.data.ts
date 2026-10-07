import { SITE_URL } from "./site";

/**
 * The self-hosted GoatCounter that measures this site (cookieless; one GoatCounter "site" serves
 * several of Nicolas's sites, told apart by the host in each path, see `analyticsPath`). Its
 * `count.js` is loaded from here, never from the vendor's CDN. Read from `VITE_ANALYTICS_ORIGIN`
 * at build time: set it (no trailing path) in the Pages production environment. Unset, as in local
 * development and previews, the site measures nothing.
 */
export const ANALYTICS_ORIGIN: string | undefined =
  import.meta.env.VITE_ANALYTICS_ORIGIN?.replace(/\/$/, "") || undefined;

const SITE_HOST = new URL(SITE_URL).hostname.replace(/^www\./, "");

/** The only hosts that load the script: not `localhost`, not a `*.pages.dev` preview. */
export const ANALYTICS_HOSTS: readonly string[] = [SITE_HOST, `www.${SITE_HOST}`];
