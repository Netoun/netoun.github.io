import { assignInlineVars } from "@vanilla-extract/dynamic";
import { memo, useEffect, useState } from "react";
import * as styles from "./system-metrics-panel.css";

export interface SystemMetricsPanelProps {
  isAnimating: boolean;
  className?: string;
  /** Milliseconds between two ticks. */
  tickMs?: number;
  /** The Lab's xray: the band thresholds on every bar, the pulsing meter marked. */
  xray?: boolean;
  /** After each tick (and once when the xray opens). */
  onTick?: (tick: number) => void;
}

export const METRICS = ["RKU", "WAV", "RQM", "ION", "FLX", "MUX"] as const;
export const BASE_VALUES = [58, 43, 72, 34, 66, 49] as const;
// Each sums to zero over its eight steps: a meter wanders around its base, never away from it.
export const DRIFT_SEQUENCES = [
  [0, 1, 0, -1, 0, 1, 0, -1],
  [0, 0, 1, 0, -1, 0, 1, -1],
  [1, 0, -1, 0, 1, 0, -1, 0],
  [0, -1, 0, 1, 0, -1, 0, 1],
  [0, 1, 1, 0, -1, 0, 0, -1],
  [0, -1, 0, 1, 1, 0, -1, 0],
] as const;

const UPDATE_INTERVAL_MS = 620;
/** A meter's one-tick bump comes round every PULSE_EVERY ticks, three ticks after the one above. */
export const PULSE_EVERY = 12;
export const BANDS = { mid: 40, high: 70 } as const;

export const SYSTEM_METRICS_DEFAULTS = { tickMs: UPDATE_INTERVAL_MS } as const;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const isPulsing = (index: number, tick: number) => (tick + index * 3) % PULSE_EVERY === 0;

/**
 * Every meter at a tick, from nothing but the tick: its base, plus its drift sequence summed up
 * to this step, plus the bump if it pulses now. The pulse is never kept, so the panel loops
 * every 24 ticks instead of creeping to the top.
 */
export function metricsAt(tick: number): number[] {
  return BASE_VALUES.map((base, index) => {
    const sequence = DRIFT_SEQUENCES[index];
    let walk = 0;
    for (let step = 0; step <= tick % sequence.length; step += 1) walk += sequence[step];
    return clamp(base + walk + (isPulsing(index, tick) ? 1 : 0), 8, 96);
  });
}

export const bandOf = (value: number) =>
  value >= BANDS.high ? "high" : value >= BANDS.mid ? "mid" : "low";

export const SystemMetricsPanel = memo(
  ({
    isAnimating,
    className,
    tickMs = UPDATE_INTERVAL_MS,
    xray = false,
    onTick,
  }: SystemMetricsPanelProps) => {
    const [tick, setTick] = useState(0);
    const values = metricsAt(tick);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const updateMotion = () => setPrefersReducedMotion(mediaQuery.matches);

      updateMotion();
      mediaQuery.addEventListener("change", updateMotion);

      return () => {
        mediaQuery.removeEventListener("change", updateMotion);
      };
    }, []);

    useEffect(() => {
      if (!isAnimating || prefersReducedMotion) return;

      const intervalId = window.setInterval(() => setTick((current) => current + 1), tickMs);

      return () => {
        window.clearInterval(intervalId);
      };
    }, [isAnimating, prefersReducedMotion, tickMs]);

    useEffect(() => {
      onTick?.(tick);
    }, [onTick, tick]);

    const rootClassName = className ? `${styles.rootStyles} ${className}` : styles.rootStyles;

    const shouldPulse = isAnimating && !prefersReducedMotion;

    return (
      <div
        className={rootClassName}
        data-reduced-motion={prefersReducedMotion ? "true" : "false"}
        data-xray={xray || undefined}
        aria-hidden="true"
      >
        <div className={styles.textureStyles} />
        <div className={styles.scanlineStyles} />

        <div className={styles.headerStyles}>
          <span className={styles.headerLabelStyles}>SYS.M</span>
          <span className={styles.headerTickStyles}>T+{String(112 + tick).padStart(3, "0")}</span>
        </div>

        <div className={styles.metricsListStyles}>
          {METRICS.map((metric, index) => {
            const value = values[index] ?? 0;
            const band = bandOf(value);

            return (
              <div
                key={metric}
                className={styles.metricRowStyles}
                data-pulsing={xray && isPulsing(index, tick) ? "true" : undefined}
              >
                <span className={styles.metricKeyStyles}>{metric}</span>
                <span className={styles.metricValueStyles}>{String(value).padStart(2, "0")}%</span>
                <span
                  className={styles.metricBarStyles}
                  data-band={band}
                  data-pulse={shouldPulse ? "true" : "false"}
                  style={assignInlineVars({ [styles.metricFill]: `${value}%` })}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
