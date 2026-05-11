import { animate, stagger } from "animejs";
import { useEffect, useRef, useCallback } from "react";
import { Container } from "@/components/layouts/container/container.component";
import {
  FeatureHeader,
  FeatureHeaderTitle,
  FeatureHeaderDescription,
} from "@/components/layouts/feature-header/feature-header.component";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import { SKILL_BLOCKS } from "@/features/skills/data/skills-data";
import { BlockCard } from "@/features/skills/components/block-card/skills-block-card.component";
import * as styles from "./welcome-skills.css";

export function WelcomeSkillsSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  // Cache NodeList to avoid repeated querySelectorAll
  const blocksRef = useRef<NodeListOf<Element> | null>(null);
  const hasAnimatedRef = useRef(false);

  const { ref: sectionRef, isIntersecting } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
  });
  const shouldAnimate = useAnimationPriority({ priority: "medium", isVisible: isIntersecting });

  // Initialize blocks ref once when grid is available
  const initializeBlocks = useCallback(() => {
    if (gridRef.current && !blocksRef.current) {
      blocksRef.current = gridRef.current.querySelectorAll("[data-block]");
    }
  }, []);

  useEffect(() => {
    initializeBlocks();

    if (!shouldAnimate || !blocksRef.current || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;

    animate(blocksRef.current, {
      opacity: [0, 1],
      translateY: [20, 0],
      ease: "outQuart",
      duration: 450,
      delay: stagger(80, { start: 200 }),
    });
  }, [shouldAnimate, initializeBlocks]);

  return (
    <section ref={sectionRef} className={styles.sectionStyle}>
      <Container className={styles.contentStyle}>
        <FeatureHeader variant="secondary">
          <FeatureHeaderTitle>SKILLS</FeatureHeaderTitle>
          <FeatureHeaderDescription>TECH STACK · TOOLS · EXPERTISE</FeatureHeaderDescription>
        </FeatureHeader>

        <div ref={gridRef} className={styles.skillsGridStyle}>
          {SKILL_BLOCKS.map((block) => (
            <BlockCard key={block.title} block={block} />
          ))}
        </div>
      </Container>
    </section>
  );
}
