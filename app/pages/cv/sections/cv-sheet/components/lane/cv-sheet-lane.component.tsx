import clsx from "clsx";
import type { StackDomain } from "@/features/experiences/data/experience-log";
import * as styles from "./cv-sheet-lane.css";

// Doto's `*`, dot by dot (5 × 5 cells).
const STAR: [number, number][] = [
  [2, 0],
  [0, 1],
  [2, 1],
  [4, 1],
  [1, 2],
  [2, 2],
  [3, 2],
  [0, 3],
  [2, 3],
  [4, 3],
  [2, 4],
];

interface CvSheetLaneProps {
  domain: StackDomain;
  /** The first commit: the lane stops at its star. */
  isRoot?: boolean;
  className?: string;
}

export function CvSheetLane({ domain, isRoot = false, className }: CvSheetLaneProps) {
  return (
    <span
      className={clsx(styles.lane, styles.domain[domain], className)}
      data-root={isRoot || undefined}
      aria-hidden="true"
    >
      <svg className={styles.node} viewBox="-1.5 -3 7 10" focusable="false">
        {STAR.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={0.45} />
        ))}
      </svg>
      <span className={styles.line} />
    </span>
  );
}
