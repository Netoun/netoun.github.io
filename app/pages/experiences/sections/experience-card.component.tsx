import { animate } from "animejs";
import { useEffect, useRef } from "react";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import { TerminalButtons } from "@/components/primitives/terminal-buttons/terminal-buttons.component";
import { Tag } from "@/components/primitives/tag/tag.component";
import * as styles from "./experience-card.css";
import type { Experience } from "../hooks/use-experiences.hook.types";

export interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const hasAnimated = useRef(false);
  const { ref: cardRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0,
    rootMargin: "0px 0px 80px 0px",
  });
  const shouldAnimate = useAnimationPriority({
    priority: "medium",
    isVisible: isIntersecting,
  });

  useEffect(() => {
    if (!shouldAnimate || !cardRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    animate(cardRef.current, {
      opacity: [0, 1],
      translateX: [-24, 0],
      ease: "outQuart",
      duration: 500,
    });
  }, [shouldAnimate]);

  return (
    <div ref={cardRef} className={styles.entryStyle}>
      <div className={styles.timelineDotStyle}>
        <div className={styles.timelineDotPingStyle} />
      </div>

      <div className={styles.cardStyle}>
        <div className={styles.cardBarStyle}>
          <div className={styles.cardBarLeftStyle}>
            <TerminalButtons />
            <span className={styles.companyStyle}>{experience.company}</span>
            {experience.active && <span className={styles.currentBadgeStyle}>ACTIVE</span>}
          </div>
          <span className={styles.periodStyle}>{experience.period}</span>
        </div>

        <div className={styles.cardBodyStyle}>
          <div className={styles.roleRowStyle}>
            <span className={styles.promptStyle}>⤘</span>
            <span className={styles.roleStyle}>{experience.role}</span>
            <span className={styles.locationStyle}>{experience.location}</span>
          </div>
          {experience.description && (
            <p className={styles.descriptionStyle}>{experience.description}</p>
          )}
          {experience.projects && experience.projects.length > 0 && (
            <div className={styles.projectsStyle}>
              {experience.projects.map((project) => (
                <div key={project.title} className={styles.projectStyle}>
                  <span className={styles.projectTitleStyle}>{project.title}</span>
                  <span className={styles.projectDescStyle}>{project.description}</span>
                  {project.stack && project.stack.length > 0 && (
                    <div className={styles.projectStackStyle}>
                      {project.stack.map((tech) => (
                        <Tag key={tech}>{tech}</Tag>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className={styles.stackStyle}>
            {experience.stack.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
