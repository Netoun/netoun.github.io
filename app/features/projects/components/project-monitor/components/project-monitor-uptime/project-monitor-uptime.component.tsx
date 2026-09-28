import { formatUptime, useSessionUptime } from "../../../../hooks/use-session-uptime.hook";
import * as styles from "./project-monitor-uptime.css";

export interface ProjectMonitorUptimeProps {
  isTicking: boolean;
}

/** Its own component so the once-a-second tick re-renders this label only. */
export function ProjectMonitorUptime({ isTicking }: ProjectMonitorUptimeProps) {
  const seconds = useSessionUptime(isTicking);
  return <span className={styles.uptimeStyle}>UP {formatUptime(seconds)}</span>;
}
