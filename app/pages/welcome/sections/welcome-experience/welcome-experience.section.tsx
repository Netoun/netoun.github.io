import { useMemo, useState } from "react";
import { ContentSection } from "@/components/layouts/content-section/content-section.component";
import { ExperienceLogBranches } from "@/features/experiences/components/experience-log/components/experience-log-branches/experience-log-branches.component";
import { ExperienceLog } from "@/features/experiences/components/experience-log/experience-log.component";
import { logSummary, toBranches, toLogGroups } from "@/features/experiences/data/experience-log";
import { experiences } from "@/features/experiences/data/experiences-data";
import { useCurrentMonth } from "@/hooks/use-current-month.hook";
import * as styles from "./welcome-experience.css";

export function WelcomeExperienceSection() {
  const now = useCurrentMonth();
  const branches = useMemo(() => toBranches(experiences, now), [now]);
  const groups = useMemo(() => toLogGroups(branches), [branches]);
  const summary = useMemo(() => logSummary(branches, now), [branches, now]);
  // Shared by `branch -v` and the log: pointing at a branch in either filters both.
  const [litBranch, setLitBranch] = useState<string | null>(null);

  return (
    <ContentSection
      id="experience"
      title="EXPERIENCE"
      description="Work history &amp; professional experience"
      index={2}
      className={styles.sectionStyle}
      contentClassName={styles.contentStyle}
      threshold={0}
      aside={
        <div data-reveal-item>
          <ExperienceLogBranches
            branches={branches}
            litBranch={litBranch}
            onLitBranchChange={setLitBranch}
          />
        </div>
      }
    >
      {/* Rises with the header, then plays its own arrival (command, rows, tracks). */}
      <div data-reveal-item>
        <ExperienceLog
          groups={groups}
          summary={summary}
          litBranch={litBranch}
          onLitBranchChange={setLitBranch}
        />
      </div>
    </ContentSection>
  );
}
