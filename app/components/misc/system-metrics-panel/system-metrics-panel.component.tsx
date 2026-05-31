import { memo, useEffect, useRef, useState } from "react";
import * as styles from "./system-metrics-panel.css";

export interface SystemMetricsPanelProps {
  isAnimating: boolean;
  className?: string;
}

const METRICS = ["RKU", "WAV", "RQM", "ION", "FLX", "MUX"] as const;
const BASE_VALUES = [58, 43, 72, 34, 66, 49] as const;
const DRIFT_SEQUENCES = [
  [0, 1, 0, -1, 0, 1, 0, -1],
  [0, 0, 1, 0, -1, 0, 1, -1],
  [1, 0, -1, 0, 1, 0, -1, 0],
  [0, -1, 0, 1, 0, -1, 0, 1],
  [0, 1, 1, 0, -1, 0, 1, -1],
  [0, -1, 0, 1, 1, 0, -1, 0],
] as const;

const UPDATE_INTERVAL_MS = 620;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const buildInitialValues = () => {
  return BASE_VALUES.map((value, index) => {
    const sequence = DRIFT_SEQUENCES[index % DRIFT_SEQUENCES.length] ?? [0];
    const offset = sequence[0] ?? 0;
    return clamp(value + offset, 8, 96);
  });
};

export const SystemMetricsPanel = memo(
  ({ isAnimating, className }: SystemMetricsPanelProps) => {
    const [values, setValues] = useState<number[]>(() => buildInitialValues());
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const shouldAnimateRef = useRef(isAnimating);
    const tickRef = useRef(0);

    shouldAnimateRef.current = isAnimating;

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

      const updateValues = () => {
        if (!shouldAnimateRef.current) return;
        tickRef.current += 1;
        const tick = tickRef.current;

        setValues((previous) => {
          return previous.map((value, index) => {
            const sequence = DRIFT_SEQUENCES[index % DRIFT_SEQUENCES.length] ?? [0];
            const drift = sequence[tick % sequence.length] ?? 0;
            const pulse = (tick + index * 3) % 12 === 0 ? 1 : 0;
            return clamp(value + drift + pulse, 8, 96);
          });
        });
      };

      const intervalId = window.setInterval(updateValues, UPDATE_INTERVAL_MS);

      return () => {
        window.clearInterval(intervalId);
      };
    }, [isAnimating, prefersReducedMotion]);

    const rootClassName = className ? `${styles.rootStyles} ${className}` : styles.rootStyles;

    const shouldPulse = isAnimating && !prefersReducedMotion;

    return (
      <div
        className={rootClassName}
        data-reduced-motion={prefersReducedMotion ? "true" : "false"}
        aria-hidden="true"
      >
        <div className={styles.textureStyles} />
        <div className={styles.scanlineStyles} />

        <div className={styles.headerStyles}>
          <span className={styles.headerLabelStyles}>SYS.M</span>
          <span className={styles.headerTickStyles}>
            T+{String(112 + tickRef.current).padStart(3, "0")}
          </span>
        </div>

        <div className={styles.metricsListStyles}>
          {METRICS.map((metric, index) => {
            const value = values[index] ?? 0;
            const band = value >= 70 ? "high" : value >= 40 ? "mid" : "low";

            return (
              <div key={metric} className={styles.metricRowStyles}>
                <span className={styles.metricKeyStyles}>{metric}</span>
                <span className={styles.metricValueStyles}>{String(value).padStart(2, "0")}%</span>
                <span
                  className={styles.metricBarStyles}
                  data-band={band}
                  data-pulse={shouldPulse ? "true" : "false"}
                  style={{ ["--metric-fill" as string]: `${value}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  },
  (previousProps, nextProps) => {
    return (
      previousProps.isAnimating === nextProps.isAnimating &&
      previousProps.className === nextProps.className
    );
  },
);
