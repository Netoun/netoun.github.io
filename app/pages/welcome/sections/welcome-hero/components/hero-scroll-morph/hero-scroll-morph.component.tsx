import { useHeroMorphProgress } from "../../hooks/use-hero-morph-progress.hook";
import * as styles from "./hero-scroll-morph.css";

interface HeroScrollMorphProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLElement | null>;
}

export function HeroScrollMorph({ children, containerRef }: HeroScrollMorphProps) {
  const { stageRef } = useHeroMorphProgress({
    containerRef,
  });

  return (
    <div className={styles.heroScrollMorphWrapper}>
      <div ref={stageRef} className={styles.heroMorphStage}>
        <div className={styles.heroMorphFrame}>
          <div className={styles.heroMorphContent}>{children}</div>
        </div>
      </div>
    </div>
  );
}
