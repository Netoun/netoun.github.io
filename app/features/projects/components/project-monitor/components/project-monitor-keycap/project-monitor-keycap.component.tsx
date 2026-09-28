import * as styles from "./project-monitor-keycap.css";

export interface ProjectMonitorKeycapProps {
  label: string;
  wide?: boolean;
  /** The matching key is held down in the projects grid. */
  isDown?: boolean;
}

/** A CSS-3D keycap for the key bar. Decorative: the control's accessible name says what it does. */
export function ProjectMonitorKeycap({
  label,
  wide = false,
  isDown = false,
}: ProjectMonitorKeycapProps) {
  const plates = wide ? styles.widePlateStyle : styles.keyPlateStyle;

  return (
    <span
      className={styles.keycapStyle({ width: wide ? "wide" : "key" })}
      data-down={isDown ? "" : undefined}
      aria-hidden="true"
    >
      <span className={styles.shadowStyle} />
      <span className={styles.bodyStyle}>
        <span className={`${styles.plateStyle} ${plates.right} ${styles.rightShadeStyle}`} />
        <span className={`${styles.plateStyle} ${plates.front} ${styles.frontShadeStyle}`} />
        <span className={`${styles.plateStyle} ${plates.top} ${styles.topShadeStyle}`}>
          {label}
        </span>
      </span>
    </span>
  );
}
