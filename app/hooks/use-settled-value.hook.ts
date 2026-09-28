import { useEffect, useState } from "react";

/**
 * `value` once it has held still for `delay` ms. A pointer sweeping a list settles on one
 * row: what is expensive to start (a WebGL demo) waits for that, not for every row it crossed.
 */
export function useSettledValue<T>(value: T, delay: number): T {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return settled;
}
