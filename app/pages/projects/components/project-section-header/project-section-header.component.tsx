import { animate } from "animejs";
import { useEffect, useRef } from "react";
import * as styles from "./project-section-header.css";

interface ProjectSectionHeaderProps {
  as?: "h1" | "h2";
  subtitle?: string;
}

export function ProjectSectionHeader({
  as: Tag = "h1",
  subtitle = "_OPEN SOURCE TOOLS, GAMES & EXPERIMENTS_",
}: ProjectSectionHeaderProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      animate(titleRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        ease: "outQuad",
        duration: 600,
      });
    }
  }, []);

  return (
    <div className={styles.containerStyle}>
      <Tag ref={titleRef} className={styles.titleStyle}>
        <span className={styles.prefixStyle}>_❯</span>
        MY PROJECTS<span className={styles.cursorStyle}>▐</span>
      </Tag>
      <p className={styles.subtitleStyle}>{subtitle}</p>
    </div>
  );
}
