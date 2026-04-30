import { animate } from "animejs";
import { useEffect, useRef, useState } from "react";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import type { ExperienceType } from "../hooks/use-experiences.hook.types";
import * as styles from "./experience-card.css";

type TagColor = "pink" | "green" | "purple" | "yellow" | "blue" | "default";

const TAG_COLOR_MAP: Record<string, TagColor> = {
  React: "blue",
  TypeScript: "blue",
  TS: "blue",
  JavaScript: "blue",
  JS: "blue",
  Remix: "pink",
  "Vanilla Extract": "purple",
  NestJS: "purple",
  Backend: "purple",
  Node: "green",
  "Node.js": "green",
  Vue: "green",
  PostgreSQL: "purple",
  Prisma: "purple",
  Python: "yellow",
  Rust: "yellow",
  TensorFlow: "yellow",
  DialogFlow: "yellow",
};

function getTagColor(tag: string): TagColor {
  return TAG_COLOR_MAP[tag] ?? "default";
}

export interface ExperienceCardProps {
  company: string;
  role: string;
  period: string;
  location: string;
  description?: string;
  projects: { title: string; description: string; stack?: string[] }[];
  stack: string[];
  type?: ExperienceType;
}

export function ExperienceCard({
  company,
  role,
  period,
  location,
  description,
  projects,
  stack,
  type = "project",
}: ExperienceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const shouldAnimate = useAnimationPriority({ priority: "medium", isVisible });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(card);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldAnimate || !cardRef.current) return;

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
        {type === "project" && <div className={styles.timelineDotPingStyle} />}
      </div>

      <div className={styles.cardStyle}>
        <div className={styles.cardBarStyle}>
          <div className={styles.cardBarLeftStyle}>
            <div className={styles.terminalButtonsStyle}>
              <span className={styles.terminalButtonStyle} />
              <span className={styles.terminalButtonStyle} />
              <span className={styles.terminalButtonStyle} />
            </div>
            <span className={styles.companyStyle}>{company}</span>
            {type === "project" && <span className={styles.currentBadgeStyle}>ACTIVE</span>}
          </div>
          <span className={styles.periodStyle}>{period}</span>
        </div>

        <div className={styles.cardBodyStyle}>
          <div className={styles.roleRowStyle}>
            <span className={styles.promptStyle}>⤘</span>
            <span className={styles.roleStyle}>{role}</span>
            <span className={styles.locationStyle}>{location}</span>
          </div>
          {description && <p className={styles.descriptionStyle}>{description}</p>}
          {projects.length > 0 && (
            <div className={styles.projectsStyle}>
              {projects.map((project) => (
                <div key={project.title} className={styles.projectStyle}>
                  <span className={styles.projectTitleStyle}>{project.title}</span>
                  <span className={styles.projectDescStyle}>{project.description}</span>
                  {project.stack && project.stack.length > 0 && (
                    <div className={styles.projectStackStyle}>
                      {project.stack.map((tech) => (
                        <span key={tech} className={styles.tagStyle({ color: getTagColor(tech) })}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className={styles.stackStyle}>
            {stack.map((tech) => (
              <span key={tech} className={styles.tagStyle({ color: getTagColor(tech) })}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}