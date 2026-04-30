import { memo } from "react";
import * as styles from "./character-grid.css";

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
        // biome-ignore lint/suspicious/noArrayIndexKey: positions are stable, only values change
        <div key={index} className={styles.characterGridItemStyles}>
          {char}
        </div>
      ))}
    </div>
  );
});
