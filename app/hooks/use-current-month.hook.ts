import { useSyncExternalStore } from "react";

const BUILD_MONTH = __BUILD_DATE__.slice(0, 7);

let visitMonth: string | undefined;

// The month never changes during a visit: nothing to subscribe to.
const subscribe = () => () => {};
const getSnapshot = () => (visitMonth ??= new Date().toISOString().slice(0, 7));
const getServerSnapshot = () => BUILD_MONTH;

/**
 * The current month, `YYYY-MM` (UTC). The prerender and the hydration pass both use the
 * build's month, so the markup matches; React then re-renders with the visitor's month
 * when it differs, instead of throwing a hydration mismatch.
 */
export function useCurrentMonth(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
