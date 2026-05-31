import { useState } from "react";
import { ProjectCard } from "@/features/projects/components/project-card/project-card.component";
import { LabsDemoLayout } from "../../components/labs-experiment-frame/labs-experiment-frame.component";
import {
  ButtonGroupControl,
  ControlGroup,
  ControlPanel,
  ResetButton,
  SliderControl,
} from "../../components/labs-control/labs-control.component";
import * as styles from "./project-card-3d.demo.css";

// Real project entry reused from projects-data — "My website"
const SAMPLE_PROJECT = {
  title: "My website",
  description:
    "My personal portfolio with a neo-retro futuristic design system, built with React Router v7 and Vanilla Extract.",
  date: "2026-04-27",
  tags: ["React", "TypeScript", "Vanilla Extract", "React Router"],
  image: "/images/projects/website-card.webp",
  url: "https://github.com/netoun/netoun.github.io",
};

const FEATURED_OPTIONS = ["off", "on"] as const;
type FeaturedOption = (typeof FEATURED_OPTIONS)[number];

const DEFAULT_FEATURED: FeaturedOption = "on";
const DEFAULT_ROTATE = 0;

export function ProjectCard3dDemo() {
  const [featured, setFeatured] = useState<FeaturedOption>(DEFAULT_FEATURED);
  const [rotate, setRotate] = useState(DEFAULT_ROTATE);

  const reset = () => {
    setFeatured(DEFAULT_FEATURED);
    setRotate(DEFAULT_ROTATE);
  };

  return (
    <LabsDemoLayout
      stage={
        <div className={styles.stageInner}>
          <div className={styles.cardWrapper}>
            <ProjectCard
              title={SAMPLE_PROJECT.title}
              description={SAMPLE_PROJECT.description}
              date={SAMPLE_PROJECT.date}
              tags={SAMPLE_PROJECT.tags}
              image={SAMPLE_PROJECT.image}
              url={SAMPLE_PROJECT.url}
              featured={featured === "on"}
              type="personal"
              rotate={rotate}
              animationsEnabled={true}
            />
          </div>
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="Card">
            <ButtonGroupControl
              label="Featured"
              options={FEATURED_OPTIONS}
              value={featured}
              onChange={setFeatured}
            />
          </ControlGroup>

          <ControlGroup title="Rotation">
            <SliderControl
              label="Rotate"
              value={rotate}
              min={-15}
              max={15}
              step={1}
              onChange={setRotate}
              format={(v) => `${v}°`}
            />
          </ControlGroup>

          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
