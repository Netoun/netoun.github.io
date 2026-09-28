import type { DomainMeter } from "../../../../data/project-processes";
import { ProjectMonitorBox } from "../project-monitor-box/project-monitor-box.component";
import * as styles from "./project-monitor-meters.css";

const TONES = { frontend: "mint", backend: "violet", creative: "gold", systems: "azure" } as const;

const LABELS: Record<DomainMeter["domain"], string> = {
  frontend: "FRONTEND",
  backend: "BACKEND",
  creative: "CREATIVE",
  systems: "SYSTEMS & AI",
};

export interface ProjectMonitorMetersProps {
  meters: DomainMeter[];
}

/** htop-style bar meters: one segment per tag, every bar on the same scale. */
export function ProjectMonitorMeters({ meters }: ProjectMonitorMetersProps) {
  const scale = Math.max(1, ...meters.map((meter) => meter.count));

  return (
    <ul className={styles.metersStyle} aria-label="Tags per domain">
      {meters.map((meter) => (
        <li key={meter.domain} className={styles.meterStyle}>
          <ProjectMonitorBox
            kind="cube"
            tone={TONES[meter.domain]}
            className={styles.meterCubeStyle}
          />
          <span className={styles.meterLabelStyle}>{LABELS[meter.domain]}</span>
          <span aria-hidden="true">[</span>
          <span className={styles.meterTrackStyle} aria-hidden="true">
            {Array.from({ length: scale }, (_, index) => {
              const lit = index < meter.count;
              return (
                <span
                  // Positions are fixed: the scale never reorders.
                  // oxlint-disable-next-line react/no-array-index-key
                  key={index}
                  className={`${styles.segmentStyle({ domain: meter.domain, lit })}${lit ? ` ${styles.litSegmentStyle}` : ""}`}
                />
              );
            })}
          </span>
          <span aria-hidden="true">]</span>
          <span className={styles.meterValueStyle}>
            {String(meter.count).padStart(2, "0")} tags
          </span>
        </li>
      ))}
    </ul>
  );
}
