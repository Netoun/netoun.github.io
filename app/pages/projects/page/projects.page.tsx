import { Container } from "@/components/layouts/container/container.component";
import { Section } from "@/components/layouts/sections/section.component";
import {
  FeatureHeader,
  FeatureHeaderTitle,
  FeatureHeaderDescription,
} from "@/components/feature-header/feature-header.component";
import { projects } from "../data/projects-data";
import { ProjectCard } from "../sections/project-card.component";
import * as styles from "./projects.css";

export function meta() {
  return [
    { title: "Netoun - Projects" },
    {
      name: "description",
      content: "Explore my open-source tools, games, and creative experiments in web development",
    },
  ];
}

export default function ProjectsPage() {
  return (
    <>
      <div className={styles.blobLayerStyle}>
        <div className={`${styles.blobStyle} ${styles.blobGoldStyle}`} />
        <div className={`${styles.blobStyle} ${styles.blobCyanStyle}`} />
        <div className={`${styles.blobStyle} ${styles.blobVioletStyle}`} />
      </div>

      <Section className={styles.pageStyle}>
        <Container>
          <FeatureHeader as="page">
            <FeatureHeaderTitle>MY PROJECTS</FeatureHeaderTitle>
            <FeatureHeaderDescription>
              _OPEN SOURCE TOOLS, GAMES & EXPERIMENTS_
            </FeatureHeaderDescription>
          </FeatureHeader>

          {projects.length === 0 ? (
            <div className={styles.emptyStateStyle}>
              No projects yet. Add entries in app/pages/projects/data/projects-data.ts
            </div>
          ) : (
            <div className={styles.gridStyle}>
              {projects.map(({ slug, ...project }) => (
                <ProjectCard key={slug} {...project} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
