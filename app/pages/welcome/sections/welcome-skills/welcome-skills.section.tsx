import { useMemo } from "react";
import { ContentSection } from "@/components/layouts/content-section/content-section.component";
import {
  formatDuration,
  formatYearMonth,
  monthsBetween,
} from "@/features/experiences/data/experience-log";
import { experiences } from "@/features/experiences/data/experiences-data";
import { EXPERIMENT_SLUGS } from "@/features/labs/data/experiment-slugs";
import { projects } from "@/features/projects/data/projects-data";
import { SkillFetch } from "@/features/skills/components/skill-fetch/skill-fetch.component";
import { toStackGroups } from "@/features/skills/data/skill-fetch";
import { PRACTICES, STACK_TOOLS } from "@/features/skills/data/skills-data";
import type { FetchLine } from "@/features/skills/data/skills-data.types";
import { useCurrentMonth } from "@/hooks/use-current-month.hook";
import { sitePackages, skillEvidence } from "../../data/welcome-skills-evidence-data";
import * as styles from "./welcome-skills.css";

const HANDLE = "netoun";

export function WelcomeSkillsSection() {
  const now = useCurrentMonth();
  const groups = useMemo(() => toStackGroups(STACK_TOOLS, skillEvidence, sitePackages), []);
  const current = experiences.find((experience) => !experience.end) ?? experiences[0];
  const firstStart = experiences.map((experience) => experience.start).toSorted()[0];

  // Every value is read from the data: the current job, the first one, the counts. The datum
  // of each line is strong, its context muted.
  const lines = useMemo<FetchLine[]>(
    () => [
      { key: "Role", parts: [{ text: current.role, tone: "role" }] },
      {
        key: "Host",
        parts: [
          { text: current.company, tone: "strong" },
          { text: ` · ${current.location}`, tone: "muted" },
        ],
      },
      {
        key: "Uptime",
        parts: [
          { text: formatDuration(monthsBetween(firstStart, now)), tone: "strong" },
          { text: ` · since ${formatYearMonth(firstStart)}`, tone: "muted" },
        ],
      },
      {
        key: "Shipped",
        parts: [
          { text: String(projects.length), tone: "strong" },
          { text: " projects · " },
          { text: String(experiences.length), tone: "strong" },
          { text: " employers · " },
          { text: String(EXPERIMENT_SLUGS.length), tone: "strong" },
          { text: " labs" },
        ],
      },
      {
        key: "Stack",
        parts: [
          { text: String(STACK_TOOLS.length), tone: "strong" },
          { text: " tools in " },
          { text: String(groups.length), tone: "strong" },
          { text: " domains" },
        ],
      },
    ],
    [current, firstStart, now, groups.length],
  );

  return (
    <ContentSection
      id="skills"
      title="SKILLS"
      description="Stack &amp; practice"
      variant="secondary"
      index={3}
      className={styles.sectionStyle}
      contentClassName={styles.contentStyle}
      threshold={0}
    >
      {/* Rises with the header, then plays its own arrival (command, logo, readout, checks). */}
      <div data-reveal-item>
        <SkillFetch
          user={HANDLE}
          host={current.slug}
          lines={lines}
          practices={PRACTICES}
          groups={groups}
        />
      </div>
    </ContentSection>
  );
}
