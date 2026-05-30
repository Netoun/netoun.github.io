import { Container } from "@/components/layouts/container/container.component";
import {
  FeatureHeader,
  FeatureHeaderTitle,
  FeatureHeaderDescription,
} from "@/components/layouts/feature-header/feature-header.component";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import { experiences } from "@/features/experiences/data/experiences-data";
import { ExperienceCard } from "@/features/experiences/components/experience-card/experience-card.component";
import * as styles from "./welcome-experience.css";

export function WelcomeExperienceSection() {
  const { ref: sectionRef, isIntersecting } = useIntersectionObserver<HTMLElement>({
    threshold: 0,
  });
  const shouldAnimate = useAnimationPriority({
    priority: "medium",
    isVisible: isIntersecting,
  });

  return (
    <section
      ref={sectionRef}
      className={styles.sectionStyle}
      data-anim-disabled={shouldAnimate ? "false" : "true"}
    >
      <Container className={styles.contentStyle}>
        <FeatureHeader>
          <FeatureHeaderTitle>EXPERIENCE</FeatureHeaderTitle>
          <FeatureHeaderDescription>
            Work history &amp; professional experience
          </FeatureHeaderDescription>
        </FeatureHeader>

        <div className={styles.timelineStyle}>
          {experiences.map((experience) => (
            <ExperienceCard
              key={experience.slug}
              experience={experience}
              animationsEnabled={shouldAnimate}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
