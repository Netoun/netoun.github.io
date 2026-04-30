import { animate, stagger } from "animejs";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layouts/container/container.component";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import * as styles from "./welcome-skills.css";

interface SkillItem {
  n: string;
  w: number;
  p: number;
}

interface SkillGroup {
  title: string;
  items: SkillItem[];
}

const SKILLS: SkillGroup[] = [
  {
    title: "Frontend",
    items: [
      { n: "React", w: 3, p: 0 },
      { n: "TypeScript", w: 3, p: 2 },
      { n: "CSS / Vanilla Extract", w: 3, p: 0 },
      { n: "Three.js", w: 0, p: 2 },
      { n: "Motion", w: 0, p: 2 },
    ],
  },
  {
    title: "Backend",
    items: [
      { n: "NestJS", w: 3, p: 0 },
      { n: "Node.js", w: 3, p: 0 },
      { n: "REST / GraphQL", w: 2, p: 0 },
      { n: "PostgreSQL", w: 2, p: 1 },
      { n: "Drizzle", w: 0, p: 2 },
    ],
  },
  {
    title: "Tooling",
    items: [
      { n: "Git / CI/CD", w: 3, p: 0 },
      { n: "Vite / Turbo", w: 2, p: 2 },
      { n: "Docker", w: 1, p: 0 },
      { n: "Ansible", w: 1, p: 0 },
      { n: "Vitest / Jest", w: 2, p: 1 },
    ],
  },
  {
    title: "Design",
    items: [
      { n: "Design Systems", w: 3, p: 0 },
      { n: "Figma", w: 2, p: 2 },
      { n: "Accessibility", w: 1, p: 0 },
    ],
  },
];

const LEVEL_LABELS = ["NOTIONS", "À L'AISE", "CŒUR DE MÉTIER"];
const levelLabel = (n: number) => LEVEL_LABELS[n - 1] ?? "";

export function WelcomeSkillsSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const shouldAnimate = useAnimationPriority({ priority: "medium", isVisible });

  useEffect(() => {
    const section = gridRef.current?.closest("section");
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldAnimate || !headerRef.current || !gridRef.current) return;

    animate(headerRef.current, {
      opacity: [0, 1],
      translateY: [20, 0],
      ease: "outQuad",
      duration: 600,
    });

    animate(gridRef.current.querySelectorAll("[data-group]"), {
      opacity: [0, 1],
      translateY: [20, 0],
      ease: "outQuart",
      duration: 450,
      delay: stagger(80, { start: 200 }),
    });
  }, [shouldAnimate]);

  const sortedGroups = SKILLS.map((g) => ({
    ...g,
    items: [...g.items].sort((a, b) => b.w + b.p - (a.w + a.p)),
  }));

  return (
    <section className={styles.sectionStyle}>
      <Container className={styles.contentStyle}>
        <div ref={headerRef} className={styles.headerStyle}>
          <h2 className={styles.titleStyle}>
            <span className={styles.prefixStyle}>_❯</span>
            SKILLS
            <span className={styles.cursorStyle}>▐</span>
          </h2>
          <p className={styles.subtitleStyle}>TECH STACK · TOOLS · EXPERTISE</p>
        </div>

        <div className={styles.keyStyle}>
          <div className={styles.keyItemStyle}>
            <span className={styles.symWorkStyle}>⬡</span>
            AU TRAVAIL
          </div>
          <div className={styles.keyItemStyle}>
            <span className={styles.symPersoStyle}>◈</span>
            PROJETS PERSO
          </div>
          <div className={styles.keyDividerStyle} />
          <div className={styles.keyItemStyle}>
            <span className={styles.keyLabelStyle}>NIVEAU&nbsp;:</span>
            <span className={styles.keyScaleStyle}>
              <span className={styles.keyScaleRowStyle}>
                <span className={styles.symWorkStyle}>⬡</span>
                <span>NOTIONS</span>
              </span>
              <span className={styles.keyDotStyle}>·</span>
              <span className={styles.keyScaleRowStyle}>
                <span className={styles.symWorkStyle}>⬡⬡</span>
                <span>À L'AISE</span>
              </span>
              <span className={styles.keyDotStyle}>·</span>
              <span className={styles.keyScaleRowStyle}>
                <span className={styles.symWorkStyle}>⬡⬡⬡</span>
                <span>CŒUR DE MÉTIER</span>
              </span>
            </span>
          </div>
        </div>

        <div ref={gridRef} className={styles.skillsGridStyle}>
          {sortedGroups.map((g) => (
            <div key={g.title} data-group className={styles.skillGroupStyle}>
              <div className={styles.skillGroupTitleStyle}>{g.title}</div>
              <div className={styles.skillGroupColsStyle}>
                <span />
                <span className={styles.colHeadStyle}>TRAVAIL</span>
                <span className={styles.colHeadStyle}>PERSO</span>
              </div>
              <div>
                {g.items.map((s) => (
                  <div key={s.n} className={styles.skillRowStyle}>
                    <span className={styles.skillNameStyle}>{s.n}</span>
                    <div
                      className={clsx(
                        styles.skillCellStyle,
                        s.w === 0 && styles.skillCellEmptyStyle,
                      )}
                    >
                      {s.w > 0 && (
                        <span className={styles.symWorkStyle}>
                          {"⬡".repeat(s.w)}
                        </span>
                      )}
                      {s.w > 0 && (
                        <div className={styles.cellTooltipStyle}>
                          {levelLabel(s.w)}
                        </div>
                      )}
                    </div>
                    <div
                      className={clsx(
                        styles.skillCellStyle,
                        s.p === 0 && styles.skillCellEmptyStyle,
                      )}
                    >
                      {s.p > 0 && (
                        <span className={styles.symPersoStyle}>
                          {"◈".repeat(s.p)}
                        </span>
                      )}
                      {s.p > 0 && (
                        <div className={styles.cellTooltipStyle}>
                          {levelLabel(s.p)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
