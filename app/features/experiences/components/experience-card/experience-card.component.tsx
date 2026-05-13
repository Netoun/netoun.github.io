import { TerminalButtons } from "@/components/primitives/terminal-buttons/terminal-buttons.component";
import { Tag } from "@/components/primitives/tag/tag.component";
import * as styles from "./experience-card.css";
import type { Experience } from "../../hooks/use-experiences.hook.types";

export interface ExperienceCardProps {
  experience: Experience;
  animationsEnabled?: boolean;
}

export function ExperienceCard({ experience, animationsEnabled = true }: ExperienceCardProps) {
  return (
    <div className={styles.entryStyle} data-anim-disabled={animationsEnabled ? "false" : "true"}>
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
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.projectTitleStyle}
                    >
                      {project.title}
                    </a>
                  ) : (
                    <span className={styles.projectTitleStyle}>{project.title}</span>
                  )}
                  <p className={styles.projectDescStyle}>{project.description}</p>
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
          {experience.stack && experience.stack.length > 0 && (
            <div className={styles.stackStyle}>
              {experience.stack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
