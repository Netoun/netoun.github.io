import { Container } from "@/components/layouts/container/container.component";
import { Section } from "@/components/layouts/sections/section.component";
import {
  FeatureHeader,
  FeatureHeaderTitle,
  FeatureHeaderDescription,
} from "@/components/feature-header/feature-header.component";
import { experiences } from "../data/experiences-data";
import { ExperienceCard } from "../sections/experience-card.component";
import * as styles from "./experiences.css";

export function meta() {
  return [
    { title: "Netoun - Experience" },
    {
      name: "description",
      content: "My professional work history and experience in web development",
    },
  ];
}

export default function ExperiencesPage() {
  return (
    <>
      <Section className={styles.pageStyle}>
        <Container>
          <FeatureHeader as="page">
            <FeatureHeaderTitle>EXPERIENCE</FeatureHeaderTitle>
            <FeatureHeaderDescription>
              _WORK HISTORY · PROFESSIONAL EXPERIENCE_
            </FeatureHeaderDescription>
          </FeatureHeader>

          {experiences.length === 0 ? (
            <div className={styles.emptyStateStyle}>
              No experience entries yet. Add entries in
              app/pages/experiences/data/experiences-data.ts
            </div>
          ) : (
            <div className={styles.timelineStyle}>
              {experiences.map((experience) => (
                <ExperienceCard key={experience.slug} experience={experience} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
