import { ContentSection } from "@/components/layouts/content-section/content-section.component";
import { ProjectMonitor } from "@/features/projects/components/project-monitor/project-monitor.component";
import { projects } from "@/features/projects/data/projects-data";
import * as styles from "./welcome-projects.css";

export function WelcomeProjectsSection() {
  return (
    <ContentSection
      id="projects"
      title="PROJECTS"
      description="Side projects, open source &amp; experiments"
      variant="tertiary"
      index={1}
      className={styles.sectionStyle}
      contentClassName={styles.contentStyle}
    >
      {({ shouldAnimate }) => (
        // Rises with the header, then plays its own arrival (command, meters, rows).
        <div data-reveal-item>
          <ProjectMonitor projects={projects} isOnScreen={shouldAnimate} />
        </div>
      )}
    </ContentSection>
  );
}
