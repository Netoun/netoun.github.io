import type { CvTool } from "../../../../data/cv-sheet.data";
import * as styles from "./cv-sheet-tools.css";

interface CvSheetToolsProps {
  tools: CvTool[];
  label: string;
}

/** A stack line: each tool after a dot in its domain's colour. */
export function CvSheetTools({ tools, label }: CvSheetToolsProps) {
  return (
    <ul className={styles.tools} aria-label={label}>
      {tools.map((tool) => (
        <li key={tool.name} className={styles.tool}>
          <span className={styles.ticks[tool.domain]} aria-hidden="true" />
          {tool.name}
        </li>
      ))}
    </ul>
  );
}
