import type { CvPractice } from "../../../../data/cv-sheet.data";
import { joinTools } from "../../cv-sheet-metrics";
import * as styles from "./cv-sheet-practices.css";

// `✓` in Doto's dots (5 × 5 cells).
const CHECK: [number, number][] = [
  [4, 0],
  [4, 1],
  [3, 2],
  [0, 2],
  [1, 3],
  [2, 3],
  [1, 4],
];

interface CvSheetPracticesProps {
  practices: CvPractice[];
}

export function CvSheetPractices({ practices }: CvSheetPracticesProps) {
  return (
    <ul className={styles.list}>
      {practices.map((practice) => (
        <li key={practice.title} className={styles.practice}>
          <svg className={styles.check} viewBox="-1.5 -3 7 10" aria-hidden="true" focusable="false">
            {CHECK.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={0.45} />
            ))}
          </svg>
          <div>
            <h3 className={styles.title}>{practice.title}</h3>
            <p className={styles.tools}>{joinTools(practice.tools)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
