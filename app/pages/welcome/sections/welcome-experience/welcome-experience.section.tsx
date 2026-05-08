import { animate } from "animejs";
import { useEffect, useRef } from "react";
import { Container } from "@/components/layouts/container/container.component";
import {
  FeatureHeader,
  FeatureHeaderTitle,
  FeatureHeaderDescription,
} from "@/components/feature-header/feature-header.component";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import { experiences } from "@/pages/experiences/data/experiences-data";
import { ExperienceCard } from "@/pages/experiences/sections/experience-card.component";
import * as styles from "./welcome-experience.css";

export function WelcomeExperienceSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const { ref: sectionRef, isIntersecting } = useIntersectionObserver<HTMLElement>({
    threshold: 0,
  });
  const shouldAnimate = useAnimationPriority({
    priority: "medium",
    isVisible: isIntersecting,
  });

  useEffect(() => {
    if (!shouldAnimate || !timelineRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    animate(timelineRef.current, {
      opacity: [0, 1],
      translateY: [20, 0],
      ease: "outQuad",
      duration: 600,
    });
  }, [shouldAnimate]);

  return (
    <section ref={sectionRef} className={styles.sectionStyle}>
      <Container className={styles.contentStyle}>
        <FeatureHeader>
          <FeatureHeaderTitle>EXPERIENCE</FeatureHeaderTitle>
          <FeatureHeaderDescription>
            _WORK HISTORY · PROFESSIONAL EXPERIENCE_
          </FeatureHeaderDescription>
        </FeatureHeader>

        <div className={styles.timelineStyle}>
          {experiences.map((experience) => (
            <ExperienceCard key={experience.slug} experience={experience} data-entry />
          ))}
        </div>
      </Container>
    </section>
  );
}
