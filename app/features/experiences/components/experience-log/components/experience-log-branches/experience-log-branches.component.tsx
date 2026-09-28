import type { LogBranch } from "../../../../data/experience-log";
import { useBranchHover } from "../../../../hooks/use-branch-hover.hook";
import * as styles from "./experience-log-branches.css";

export interface ExperienceLogBranchesProps {
  branches: LogBranch[];
  /** Branch under the pointer, shared with the log. */
  litBranch: string | null;
  onLitBranchChange: (slug: string | null) => void;
}

/** `git branch -v` over the work history: one bar per employer, sized by tenure. */
export function ExperienceLogBranches({
  branches,
  litBranch,
  onLitBranchChange,
}: ExperienceLogBranchesProps) {
  const scale = Math.max(1, ...branches.map((branch) => branch.tenureSegments));
  const hover = useBranchHover(onLitBranchChange);

  return (
    <div className={styles.branchesStyle}>
      <p className={styles.promptStyle} aria-hidden="true">
        netoun branch -v
      </p>
      <ul className={styles.listStyle} aria-label="Employers by tenure">
        {branches.map((branch) => (
          <li
            key={branch.slug}
            className={styles.rowStyle({ domain: branch.domain })}
            data-lit={litBranch === branch.slug ? "" : undefined}
            {...hover(branch.slug)}
          >
            <span className={styles.starStyle} aria-hidden="true">
              {branch.isOpen ? "*" : ""}
            </span>
            <span className={styles.nameStyle}>{branch.slug}</span>
            <span className={styles.meterStyle} aria-hidden="true">
              {Array.from({ length: scale }, (_, index) => (
                <span
                  // Positions are fixed: the scale never reorders.
                  // oxlint-disable-next-line react/no-array-index-key
                  key={index}
                  className={styles.segmentStyle({ lit: index < branch.tenureSegments })}
                />
              ))}
            </span>
            <span className={styles.monthsStyle}>{String(branch.months).padStart(2, "0")} MO</span>
            <span className={styles.statusStyle}>
              {branch.isOpen ? "open · HEAD" : `merged ${branch.end}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
