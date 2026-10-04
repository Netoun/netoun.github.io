import { assignInlineVars } from "@vanilla-extract/dynamic";
import type { StackDomain } from "@/features/skills/data/skills-data.types";
import type { CvStackGroup } from "../../../../data/cv-sheet.data";
import { joinTools } from "../../cv-sheet-metrics";
import * as styles from "./cv-sheet-stack.css";

const DOMAIN_LABEL: Record<StackDomain, string> = {
  frontend: "Frontend",
  backend: "Backend",
  creative: "Creative",
  systems: "Systems & AI",
  tooling: "Tooling",
};

interface CvSheetStackProps {
  groups: CvStackGroup[];
}

export function CvSheetStack({ groups }: CvSheetStackProps) {
  return (
    <dl className={styles.groups}>
      {groups.map((group) => (
        <div key={group.domain}>
          <dt className={styles.meterRow}>
            <span>{DOMAIN_LABEL[group.domain]}</span>
            <span
              className={styles.meters[group.domain]}
              style={assignInlineVars({ [styles.shareVar]: String(group.share) })}
              aria-hidden="true"
            />
            <span className={styles.count} aria-hidden="true">
              {String(group.tools.length).padStart(2, "0")}
            </span>
          </dt>
          <dd className={styles.tools}>{joinTools(group.tools)}</dd>
        </div>
      ))}
    </dl>
  );
}
