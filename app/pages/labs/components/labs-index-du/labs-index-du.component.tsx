import type { LabGroupStats, LabsStats } from "@/features/labs/data/labs-stats";
import * as styles from "./labs-index-du.css";

interface LabsIndexDuProps {
  groups: readonly LabGroupStats[];
  totals: LabsStats;
}

const count = (value: number) => value.toLocaleString("en-US");

/** `du -sh ~/labs/*`: each group's size, experiments and lines, counted from the sources. */
export function LabsIndexDu({ groups, totals }: LabsIndexDuProps) {
  return (
    <table className={styles.tableStyle}>
      <caption className={styles.captionStyle}>netoun du -sh ~/labs/*</caption>
      <tbody>
        {groups.map((group) => (
          <tr key={group.dir}>
            <td className={styles.sizeStyle}>{group.size}</td>
            <th scope="row" className={styles.dirStyle}>
              {group.dir}
            </th>
            <td className={styles.countStyle}>
              {group.experiments} exp · {count(group.lines)} lines
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className={styles.totalStyle}>
          <td className={styles.sizeStyle}>{totals.size}</td>
          <th scope="row" className={styles.dirStyle}>
            total
          </th>
          <td className={styles.countStyle}>{count(totals.lines)} lines</td>
        </tr>
      </tfoot>
    </table>
  );
}
