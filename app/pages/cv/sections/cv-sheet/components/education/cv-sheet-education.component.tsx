import type { CvEducation } from "../../../../data/cv-copy.data";
import * as styles from "./cv-sheet-education.css";

interface CvSheetEducationProps {
  education: CvEducation[];
}

export function CvSheetEducation({ education }: CvSheetEducationProps) {
  return (
    <ul className={styles.list}>
      {education.map((entry) => (
        <li key={`${entry.school}-${entry.degree}`}>
          <h3 className={styles.degree}>{entry.degree}</h3>
          <p className={styles.school}>
            {entry.school} · {entry.place}
          </p>
        </li>
      ))}
    </ul>
  );
}
