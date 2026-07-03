import { useEffect, useRef, useState } from "react";
import * as styles from "./welcome-sections-nav.css";

const SECTIONS = [
  { id: "intro", label: "_00 / INTRO" },
  { id: "projects", label: "_01 / PROJECTS" },
  { id: "experience", label: "_02 / EXPERIENCE" },
  { id: "skills", label: "_03 / SKILLS" },
  { id: "contact", label: "_04 / CONTACT" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

// Gentle S-curve: the neon track is "un peu tordu", not a squiggle.
// Drawn in a 12x120 box, stretched to the nav height (non-scaling strokes).
const TRACK_PATH = "M6 2 C 10.5 22, 1.5 40, 6 60 C 10.5 80, 1.5 98, 6 118";
const TRACK_GRADIENT_ID = "welcome-sections-nav-gradient";

export function WelcomeSectionsNav() {
  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<SectionId>("intro");
  const [pastHero, setPastHero] = useState(false);

  // Scroll progress → --scroll-progress (0..1), rAF-throttled, drives the lit
  // portion of the neon path via stroke-dashoffset (tiny paint area, no layout).
  // The same pass toggles the reveal: the menu mounts mid-hero, hidden behind
  // the hero panel (z-order), and gets uncovered as the panel scrolls away.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let rafId = 0;
    let wasPastHero = false;

    const update = () => {
      rafId = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;

      // Bar progress is interpolated across the section anchors, not the raw
      // page ratio: the lit tip reaches a label exactly when its section hits
      // the middle of the viewport. With a raw ratio the footer would only
      // light CONTACT in the last ~2% of scroll.
      const anchorY = window.scrollY + window.innerHeight / 2;
      const tops = SECTIONS.map((section, index) => {
        // The hero is sticky-pinned: its rect moves while pinned, so anchor it
        // to the top of the document instead.
        if (index === 0) return 0;
        const el = document.getElementById(section.id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });
      const lastIndex = SECTIONS.length - 1;

      let progress: number;
      if (max <= 0 || window.scrollY >= max - 2) {
        progress = 1;
      } else {
        let i = 0;
        while (i < lastIndex && anchorY >= tops[i + 1]) i++;
        if (i >= lastIndex) {
          progress = 1;
        } else {
          const span = Math.max(1, tops[i + 1] - tops[i]);
          const t = Math.min(1, Math.max(0, (anchorY - tops[i]) / span));
          progress = (i + t) / lastIndex;
        }
      }
      nav.style.setProperty("--scroll-progress", progress.toFixed(4));

      const revealAt = tops[1] > 0 ? tops[1] * 0.5 : window.innerHeight;
      const isPastHero = window.scrollY > revealAt;
      if (isPastHero !== wasPastHero) {
        wasPastHero = isPastHero;
        setPastHero(isPastHero);
      }
    };

    const requestUpdate = () => {
      if (rafId === 0) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (rafId !== 0) cancelAnimationFrame(rafId);
    };
  }, []);

  // Active section: the target crossing the middle band of the viewport wins.
  useEffect(() => {
    const targets = SECTIONS.map((section) => document.getElementById(section.id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id as SectionId);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label="Sections"
      data-visible={pastHero || undefined}
      className={styles.navStyle}
    >
      <div className={styles.trackStyle} aria-hidden="true">
        <svg
          className={styles.trackSvgStyle}
          viewBox="0 0 12 120"
          preserveAspectRatio="none"
          role="presentation"
        >
          <defs>
            <linearGradient
              id={TRACK_GRADIENT_ID}
              gradientUnits="userSpaceOnUse"
              x1="6"
              y1="0"
              x2="6"
              y2="120"
            >
              <stop offset="0" className={styles.gradientStopTopStyle} />
              <stop offset="0.5" className={styles.gradientStopMidStyle} />
              <stop offset="1" className={styles.gradientStopBottomStyle} />
            </linearGradient>
          </defs>
          <path d={TRACK_PATH} vectorEffect="non-scaling-stroke" className={styles.trackBaseStyle} />
          <path
            d={TRACK_PATH}
            pathLength={1}
            vectorEffect="non-scaling-stroke"
            stroke={`url(#${TRACK_GRADIENT_ID})`}
            className={styles.trackHaloStyle}
          />
          <path
            d={TRACK_PATH}
            pathLength={1}
            vectorEffect="non-scaling-stroke"
            stroke={`url(#${TRACK_GRADIENT_ID})`}
            className={styles.trackNeonStyle}
          />
        </svg>
      </div>
      <ul className={styles.listStyle}>
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={activeId === section.id ? "true" : undefined}
              className={styles.linkStyle}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
