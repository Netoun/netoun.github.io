import type { CvProject } from "../../../../data/cv-sheet.data";
import * as styles from "./cv-sheet-processes.css";

const STATUS_LABEL = { live: "LIVE", source: "SRC" } as const;

interface CvSheetProcessesProps {
  projects: CvProject[];
}

export function CvSheetProcesses({ projects }: CvSheetProcessesProps) {
  return (
    <ul className={styles.grid}>
      {projects.map((project) => (
        <li key={project.slug} className={styles.process}>
          <div className={styles.head}>
            <span className={styles.pid} aria-hidden="true">
              {project.pid}
            </span>
            <h3 className={styles.title}>{project.title}</h3>
            <span className={styles.status}>
              <span className={styles.leds[project.status]} aria-hidden="true" />
              {STATUS_LABEL[project.status]}
            </span>
          </div>
          <p className={styles.text}>{project.text}</p>
          <p className={styles.foot}>
            <a href={project.url} className={styles.address}>
              {project.address} ↗
            </a>
            <span className={styles.date}>{project.yearMonth}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}
