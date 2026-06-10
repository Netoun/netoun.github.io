import { Tag } from "@/components/primitives/tag/tag.component";
import { memo, useMemo } from "react";
import type { SkillBlock } from "../../data/skills-data.types";
import { ACCENT_VARS } from "../../data/skills-data";
import { ShapeShader } from "../shape-shader/skills-shape-shader.component";
import * as styles from "./skills-block-card.css";

interface BlockCardProps {
  block: SkillBlock;
}

function BlockCardComponent({ block }: BlockCardProps) {
  const tags = useMemo(
    () =>
      block.tags.map((tag) => (
        <Tag size="medium" key={tag.name}>
          {tag.name}
        </Tag>
      )),
    [block.tags],
  );

  return (
    <div
      data-block
      data-reveal-item
      className={styles.blockStyle}
      style={{ "--block-accent": ACCENT_VARS[block.accent] } as React.CSSProperties}
    >
      <div className={styles.blockBarStyle}>
        <span className={styles.blockTitleStyle}>
          <span className={styles.blockTitlePromptStyle}>⸭</span>
          {block.title}
        </span>
      </div>

      <div className={styles.blockBodyStyle}>
        <div className={styles.tagsWrapStyle}>{tags}</div>
        <ShapeShader shape={block.shape} />
      </div>
    </div>
  );
}

export const BlockCard = memo(BlockCardComponent);
