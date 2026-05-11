import { TerminalButtons } from "@/components/primitives/terminal-buttons/terminal-buttons.component";
import { Tag } from "@/components/primitives/tag/tag.component";
import type { SkillBlock } from "../../data/skills-data.types";
import { ACCENT_VARS } from "../../data/skills-data";
import { ShapeShader } from "../shape-shader/skills-shape-shader.component";
import * as styles from "./skills-block-card.css";

interface BlockCardProps {
  block: SkillBlock;
}

export function BlockCard({ block }: BlockCardProps) {
  return (
    <div
      data-block
      className={styles.blockStyle}
      style={
        { "--block-accent": ACCENT_VARS[block.accent] } as React.CSSProperties
      }
    >
      <div className={styles.blockBarStyle}>
        <TerminalButtons />
        <span className={styles.blockTitleStyle}>
          <span className={styles.blockTitlePromptStyle}>⸭</span>
          {block.title}
        </span>
      </div>

      <div className={styles.blockBodyStyle}>
        <div className={styles.tagsWrapStyle}>
          {block.tags.map((tag) => (
            <Tag size="medium" key={tag.name}>
              {tag.name}
            </Tag>
          ))}
        </div>
        <ShapeShader shape={block.shape} accent={block.accent} />
      </div>
    </div>
  );
}
