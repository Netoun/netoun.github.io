import { useState } from "react";
import clsx from "clsx";
import { Container } from "@/components/layouts/container/container.component";
import { Section } from "@/components/layouts/sections/section.component";
import {
  FeatureHeader,
  FeatureHeaderTitle,
  FeatureHeaderDescription,
} from "@/components/layouts/feature-header/feature-header.component";
import { projects } from "@/features/projects/data/projects-data";
import { ProjectCard } from "@/features/projects/components/project-card/project-card.component";
import type { Project } from "@/features/projects/hooks/use-projects.hook.types";
import * as styles from "./projects.css";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "open-source", label: "Open Source" },
  { id: "experiments", label: "Experiments" },
  { id: "web-apps", label: "Web Apps" },
] as const;

const FILTER_IDS = FILTERS.map((f) => f.id);
type FilterId = (typeof FILTER_IDS)[number];

function getProjectCategory(project: Project): FilterId {
  if (project.tags.includes("Open Source")) return "open-source";
  if (project.tags.some((t) => ["Game", "Creative"].includes(t))) return "experiments";
  return "web-apps";
}

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
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "all") return true;
    return getProjectCategory(project) === activeFilter;
  });

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

          <div className={styles.filterContainerStyle}>
            {FILTERS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveFilter(id)}
                className={clsx(
                  styles.filterButtonBase,
                  activeFilter === id && styles.filterButtonActive,
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {filteredProjects.length === 0 ? (
            <div className={styles.emptyStateStyle}>
              No projects yet. Add entries in app/features/projects/data/projects-data.ts
            </div>
          ) : (
            <div className={styles.gridStyle}>
              {filteredProjects.map(({ slug, ...project }) => (
                <ProjectCard key={slug} {...project} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
