import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { ANALYTICS_ORIGIN } from "@/features/site/data/analytics.data";
import { RESUME_HREF } from "@/features/site/data/resume.data";

interface Click {
  /** The event's name in GoatCounter. */
  name: string;
  title?: string;
}

/** The host without `www.`, then the path: the rule of the `path` callback in the snippet. */
export function analyticsPath(path: string): string {
  return window.location.host.replace(/^www\./, "") + path;
}

/** The click worth counting on a link, if any: the résumé, the mailbox, or a link out. */
export function describeClick(link: HTMLAnchorElement): Click | undefined {
  const url = new URL(link.href, window.location.href);
  if (url.protocol === "mailto:") return { name: "contact-email" };
  if (!url.protocol.startsWith("http")) return undefined;
  if (url.origin !== window.location.origin) {
    return { name: `outbound-${url.hostname}`, title: url.href };
  }
  if (url.pathname === RESUME_HREF) {
    return { name: "cv-download", title: window.location.pathname };
  }
  return undefined;
}

/**
 * Counts what `count.js` cannot see in a single-page app: each client-side navigation, and the
 * clicks `describeClick` names, through one delegated listener so no link needs wiring. The page a
 * visit starts on is counted by the snippet in the layout (analytics-snippet.data.ts), so the first
 * render counts nothing here. Without `ANALYTICS_ORIGIN`, or without `window.goatcounter.count`
 * (another host, `count.js` not in yet, Do Not Track), nothing is counted.
 */
export function useAnalytics() {
  const { pathname } = useLocation();
  const isFirstView = useRef(true);

  useEffect(() => {
    if (!ANALYTICS_ORIGIN) return;
    if (isFirstView.current) {
      isFirstView.current = false;
      return;
    }
    window.goatcounter?.count?.({ path: analyticsPath(pathname) });
  }, [pathname]);

  useEffect(() => {
    if (!ANALYTICS_ORIGIN) return;
    const onClick = (event: MouseEvent) => {
      // `auxclick` also fires for the context menu: only the middle button opens a link.
      if (event.type === "auxclick" && event.button !== 1) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement)) return;
      const click = describeClick(link);
      if (!click) return;
      window.goatcounter?.count?.({
        event: true,
        path: analyticsPath(`/${click.name}`),
        title: click.title,
      });
    };
    document.addEventListener("click", onClick);
    document.addEventListener("auxclick", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("auxclick", onClick);
    };
  }, []);
}
