import { ContentSection } from "@/components/layouts/content-section/content-section.component";
import { projects } from "@/features/projects/data/projects-data";
import { ProjectCard } from "@/features/projects/components/project-card/project-card.component";
import * as styles from "./welcome-projects.css";

export function WelcomeProjectsSection() {
  return (
    <ContentSection
      title="PROJECTS"
      description="Side projects, open source &amp; experiments"
      variant="tertiary"
      className={styles.sectionStyle}
      contentClassName={styles.contentStyle}
    >
      {({ shouldAnimate }) => (
        <div className={styles.gridStyle}>
          {projects.map(({ slug, ...project }) => (
            <div key={slug} data-card>
              <ProjectCard {...project} animationsEnabled={shouldAnimate} />
            </div>
          ))}
        </div>
      )}
    </ContentSection>
  );
}
