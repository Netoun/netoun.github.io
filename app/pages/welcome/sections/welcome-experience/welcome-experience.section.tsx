import { ContentSection } from "@/components/layouts/content-section/content-section.component";
import { experiences } from "@/features/experiences/data/experiences-data";
import { ExperienceCard } from "@/features/experiences/components/experience-card/experience-card.component";
import * as styles from "./welcome-experience.css";

export function WelcomeExperienceSection() {
  return (
    <ContentSection
      id="experience"
      title="EXPERIENCE"
      description="Work history &amp; professional experience"
      index={2}
      className={styles.sectionStyle}
      contentClassName={styles.contentStyle}
      threshold={0}
    >
      {({ shouldAnimate }) => (
        <div className={styles.timelineStyle}>
          {experiences.map((experience) => (
            <ExperienceCard
              key={experience.slug}
              experience={experience}
              animationsEnabled={shouldAnimate}
            />
          ))}
        </div>
      )}
    </ContentSection>
  );
}
