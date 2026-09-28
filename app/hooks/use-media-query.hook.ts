import { useCallback, useSyncExternalStore } from "react";

/**
 * Whether a media query matches, kept in sync with it. `false` while prerendering and hydrating
 * (the server has no screen), so what depends on it only turns on in the browser.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
