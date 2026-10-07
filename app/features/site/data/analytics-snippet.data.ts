import { ANALYTICS_HOSTS, ANALYTICS_ORIGIN } from "./analytics.data";

/**
 * Inline script for the root layout's `<head>`: it configures GoatCounter, then adds the
 * instance's `count.js`, on the production hosts only (and not under Do Not Track or Global
 * Privacy Control). It waits for `load` so the script never competes with the hero's font: the
 * mobile LCP budget has 0.04 s to spare. `no_onload` because the router counts later views
 * (`useAnalytics`); the first one is counted here, once `count.js` is in. The `path` rule (host
 * without `www.`, then pathname) keeps this site apart from the others on the same instance.
 * Undefined, so the layout renders nothing, while `ANALYTICS_ORIGIN` is unset.
 */
export const ANALYTICS_SNIPPET: string | undefined = ANALYTICS_ORIGIN
  ? `(function () {
  if (${JSON.stringify(ANALYTICS_HOSTS)}.indexOf(location.hostname) < 0) return;
  if (navigator.doNotTrack === "1" || navigator.globalPrivacyControl) return;
  window.goatcounter = {
    no_onload: true,
    path: function () { return location.host.replace(/^www\\./, "") + location.pathname },
  };
  function load() {
    var s = document.createElement("script");
    s.async = true;
    s.dataset.goatcounter = ${JSON.stringify(`${ANALYTICS_ORIGIN}/count`)};
    s.src = ${JSON.stringify(`${ANALYTICS_ORIGIN}/count.js`)};
    s.onload = function () { window.goatcounter.count(); };
    document.head.appendChild(s);
  }
  if (document.readyState === "complete") load();
  else window.addEventListener("load", load);
})();`
  : undefined;
