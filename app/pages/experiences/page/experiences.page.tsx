import { Container } from "@/components/layouts/container/container.component";
import { Section } from "@/components/layouts/sections/section.component";
import { ExperienceSectionHeader } from "../components/experience-section-header/experience-section-header.component";
import { useExperiences } from "../hooks/use-experiences.hook";
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
  const { experiences } = useExperiences();

  return (
    <>
      <div className={styles.blobLayerStyle}>
        <div className={`${styles.blobStyle} ${styles.blobGoldStyle}`} />
        <div className={`${styles.blobStyle} ${styles.blobCyanStyle}`} />
      </div>

      <Section className={styles.pageStyle}>
        <Container>
          <ExperienceSectionHeader />

          {experiences.length === 0 ? (
            <div className={styles.emptyStateStyle}>
              No experience entries yet. Add entries in app/pages/experiences/data/experiences-data.ts
            </div>
          ) : (
            <div className={styles.timelineStyle}>
              {experiences.map(({ slug, ...experience }) => (
                <ExperienceCard key={slug} {...experience} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}