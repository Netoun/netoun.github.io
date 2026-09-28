import * as styles from "./project-monitor-capture.css";

export interface ProjectMonitorCaptureProps {
  src: string;
  /** Grid placement from the parent. */
  className?: string;
  /** Plays one chrome glint when mounted (the parent remounts it when the capture changes). */
  sweep?: boolean;
}

/** A project capture set in a polished chrome bezel. Decorative: the title names the project. */
export function ProjectMonitorCapture({
  src,
  className,
  sweep = false,
}: ProjectMonitorCaptureProps) {
  return (
    <span className={`${styles.captureStyle}${className ? ` ${className}` : ""}`}>
      <span className={styles.frameStyle}>
        <img
          src={src}
          alt=""
          width={1350}
          height={760}
          loading="lazy"
          decoding="async"
          className={styles.imageStyle}
        />
        <span
          className={`${styles.glintStyle}${sweep ? ` ${styles.sweepStyle}` : ""}`}
          aria-hidden="true"
        />
      </span>
    </span>
  );
}
