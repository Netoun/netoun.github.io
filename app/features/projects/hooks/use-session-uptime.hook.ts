import { useEffect, useState } from "react";

const TICK_MS = 1000;

/**
 * Seconds this visit has been running (since navigation start), like htop's uptime.
 * `null` until the client takes over, so the prerendered HTML and the first client render
 * agree; it only ticks while `enabled` (the section is on screen).
 */
export function useSessionUptime(enabled: boolean): number | null {
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const read = () => setSeconds(Math.floor(performance.now() / 1000));
    const first = requestAnimationFrame(read);
    const interval = window.setInterval(read, TICK_MS);
    return () => {
      cancelAnimationFrame(first);
      window.clearInterval(interval);
    };
  }, [enabled]);

  return seconds;
}

export function formatUptime(seconds: number | null): string {
  if (seconds === null) return "--:--:--";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return [hours, minutes, seconds % 60].map((part) => String(part).padStart(2, "0")).join(":");
}
