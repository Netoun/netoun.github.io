import { useSyncExternalStore } from "react";

const subscribeNever = () => () => {};

/**
 * `false` while React hydrates, `true` from the next render on. The 404 is the SPA fallback,
 * whose body is empty: what renders there waits for this so hydration finds nothing to match.
 */
export function useIsHydrated() {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}
