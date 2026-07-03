import { ContentSection } from "@/components/layouts/content-section/content-section.component";
import { SKILL_BLOCKS } from "@/features/skills/data/skills-data";
import { BlockCard } from "@/features/skills/components/block-card/skills-block-card.component";
import * as styles from "./welcome-skills.css";

export function WelcomeSkillsSection() {
  return (
    <ContentSection
      id="skills"
      title="SKILLS"
      description="Tech stack, tools &amp; expertise"
      variant="secondary"
      index={3}
      className={styles.sectionStyle}
      contentClassName={styles.contentStyle}
    >
      <div className={styles.legendStyle} data-reveal-item>
        <span className={styles.legendItemStyle}>
          <span className={styles.legendDotStyle({ domain: "frontend" })} />
          Frontend &amp; UI
        </span>
        <span className={styles.legendItemStyle}>
          <span className={styles.legendDotStyle({ domain: "backend" })} />
          Backend &amp; infra
        </span>
        <span className={styles.legendItemStyle}>
          <span className={styles.legendDotStyle({ domain: "creative" })} />
          Creative &amp; systems
        </span>
      </div>

      <div className={styles.skillsGridStyle}>
        {SKILL_BLOCKS.map((block) => (
          <BlockCard key={block.title} block={block} />
        ))}
      </div>
    </ContentSection>
  );
}
