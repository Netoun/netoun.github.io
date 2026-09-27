import { Tag } from "@/components/primitives/tag/tag.component";
import { memo, useMemo } from "react";
import type { SkillBlock } from "../../data/skills-data.types";
import { ACCENT_VARS } from "../../data/skills-data";
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

      {/* The decorative WebGL shape that used to sit here filled the block's
          leftover space with a gradient sticker — six GPU contexts for six
          ornaments, and the loudest thing on an otherwise quiet page. The
          block now sizes to its content instead of padding it out. */}
      <div className={styles.blockBodyStyle}>
        <div className={styles.tagsWrapStyle}>{tags}</div>
      </div>
    </div>
  );
}

export const BlockCard = memo(BlockCardComponent);
