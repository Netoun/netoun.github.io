import { memo } from "react";
import * as styles from "./welcome-hero-computer-character-grid.css";

interface CharacterGridProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  gridColumns: number;
  characters: string[];
}

export const CharacterGrid = memo(function CharacterGrid({
  contentRef,
  gridColumns,
  characters,
}: CharacterGridProps) {
  return (
    <div
      ref={contentRef}
      className={styles.characterGridContentStyles}
      style={
        {
          "--grid-columns": gridColumns || 1,
        } as React.CSSProperties
      }
    >
      {characters.map((char, index) => (
        <div key={index} className={styles.characterGridItemStyles}>
          {char}
        </div>
      ))}
    </div>
  );
});
