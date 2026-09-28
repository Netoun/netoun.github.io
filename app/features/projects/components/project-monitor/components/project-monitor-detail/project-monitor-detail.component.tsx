import type { ProjectProcess } from "../../../../data/project-processes";
import { ChromeCapture } from "@/components/misc/chrome-capture/chrome-capture.component";
import * as styles from "./project-monitor-detail.css";

export interface ProjectMonitorDetailProps {
  process: ProjectProcess;
}

/**
 * On-screen echo of the selected row. Hidden from assistive tech (the row already carries
 * every value, description included) and out of the tab order (the row's name is the link).
 */
export function ProjectMonitorDetail({ process }: ProjectMonitorDetailProps) {
  const linkLabel = process.status === "source" ? "_SOURCE_" : "_LIVE_";

  return (
    <div className={styles.detailStyle} aria-hidden="true">
      <ChromeCapture
        // Remounted per project: the new capture arrives with one chrome glint.
        key={process.id}
        src={process.image}
        sweep
      />
      <div className={styles.bodyStyle}>
        <span className={styles.inspectStyle}>_❯ inspect {process.id}</span>
        <p className={styles.titleStyle}>{process.title}</p>
        <p className={styles.descriptionStyle}>{process.description}</p>
        <p className={styles.stackStyle}>{process.stack}</p>
        <a
          href={process.url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          className={styles.linkStyle}
        >
          {linkLabel} ↗
        </a>
      </div>
    </div>
  );
}
