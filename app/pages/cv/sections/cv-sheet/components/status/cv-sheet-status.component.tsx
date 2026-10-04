import * as styles from "./cv-sheet-status.css";

interface CvSheetStatusProps {
  host: string;
  /** `YYYY-MM-DD`, the day the build ran. */
  buildDate: string;
  /** Short commit; empty when the build did not know it. */
  commit: string;
  sourceUrl: string;
}

export function CvSheetStatus({ host, buildDate, commit, sourceUrl }: CvSheetStatusProps) {
  return (
    <footer className={styles.status}>
      <p className={styles.line}>
        {host} · built {buildDate}
        {commit && ` · commit ${commit}`}
      </p>
      <a href={sourceUrl} className={styles.link}>
        source ↗
      </a>
    </footer>
  );
}
