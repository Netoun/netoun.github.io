import { Container } from "@/components/layouts/container/container.component";
import {
  FeatureHeader,
  FeatureHeaderTitle,
  FeatureHeaderDescription,
} from "@/components/feature-header/feature-header.component";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import { projects } from "@/pages/projects/data/projects-data";
import { ProjectCard } from "@/pages/projects/sections/project-card.component";
import * as styles from "./welcome-projects.css";

export function WelcomeProjectsSection() {
  const { ref: sectionRef } = useIntersectionObserver<HTMLElement>({
    threshold: 0,
  });

  return (
    <section ref={sectionRef} className={styles.sectionStyle}>
      <Container className={styles.contentStyle}>
        <FeatureHeader>
          <FeatureHeaderTitle>PROJECTS</FeatureHeaderTitle>
          <FeatureHeaderDescription>
            _SIDE PROJECTS · OPEN SOURCE · EXPERIMENTS_
          </FeatureHeaderDescription>
        </FeatureHeader>

        <div className={styles.gridStyle}>
          {projects.map(({ slug, ...project }) => (
            <div key={slug} data-card>
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
