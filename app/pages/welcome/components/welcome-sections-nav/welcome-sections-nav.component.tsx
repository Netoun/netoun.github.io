import { setElementVars } from "@vanilla-extract/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "react-aria-components";
import type { PressEvent } from "react-aria-components";
import { Link } from "react-router";
import { readSections } from "./welcome-sections-nav-readout";
import * as styles from "./welcome-sections-nav.css";

const SECTIONS = [
  { id: "intro", index: "_00", name: "Intro" },
  { id: "projects", index: "_01", name: "Projects" },
  { id: "experience", index: "_02", name: "Experience" },
  { id: "skills", index: "_03", name: "Skills" },
  { id: "contact", index: "_04", name: "Contact" },
] as const;

const LAST_INDEX = SECTIONS.length - 1;

// Gentle S-curve along the capsule's foot: the neon track is "un peu tordu", not a squiggle.
// Drawn in a 120x12 box and stretched to the track (non-scaling strokes). It crosses its
// centre line at every quarter, where the stations sit.
const TRACK_PATH = "M0 6 C 20 10.5, 40 1.5, 60 6 C 80 10.5, 100 1.5, 120 6";

// The lit copy is masked at the progress, by width: the curve is a function of x, so the cut
// is exact at every station (a dash offset is not: stretched non-scaling strokes dash in
// screen space and the pattern repeats). The CSS fades the last few pixels into a soft tip.

/**
 * The homepage's sections as a small ink capsule at the foot of the screen: the current
 * section and the way to the Labs at rest, the whole list on hover, focus or tap.
 */
export function WelcomeSectionsNav() {
  const navRef = useRef<HTMLElement>(null);
  const trackLitRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const listId = useId();
  const gradientId = useId();

  // One rAF-throttled pass per scroll: progress is written straight to the track's mask (no
  // render per frame), the current section and the reveal go through state, which React drops
  // when unchanged.
  useEffect(() => {
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const tops = SECTIONS.map((section, index) => {
        // The hero is sticky-pinned: its rect moves while pinned, so anchor it to the top.
        if (index === 0) return 0;
        const element = document.getElementById(section.id);
        return element ? element.getBoundingClientRect().top + window.scrollY : 0;
      });
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const readout = readSections(tops, window.scrollY, window.innerHeight, scrollMax);

      if (trackLitRef.current) {
        setElementVars(trackLitRef.current, {
          [styles.sectionsNavLit]: readout.progress.toFixed(4),
        });
      }

      setActiveIndex(readout.activeIndex);
      // The capsule mounts mid-hero, behind the hero panel (z-order), and is uncovered as the
      // panel scrolls away.
      setPastHero(window.scrollY > (tops[1] > 0 ? tops[1] * 0.5 : window.innerHeight));
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

  // Listens on the nav itself: hover opens the list for a mouse (touch and keyboard go through
  // the button), focus leaving the nav or Escape folds it, a tap anywhere else (the scrim
  // included) closes it.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setIsOpen(true);
    };
    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || nav.contains(document.activeElement)) return;
      setIsOpen(false);
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!(event.relatedTarget instanceof Node) || !nav.contains(event.relatedTarget)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !isOpen) return;
      setIsOpen(false);
      nav.querySelector("button")?.focus();
    };
    const onDocumentPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && nav.contains(event.target)) return;
      setIsOpen(false);
    };

    nav.addEventListener("pointerenter", onPointerEnter);
    nav.addEventListener("pointerleave", onPointerLeave);
    nav.addEventListener("focusout", onFocusOut);
    nav.addEventListener("keydown", onKeyDown);
    if (isOpen) document.addEventListener("pointerdown", onDocumentPointerDown);
    return () => {
      nav.removeEventListener("pointerenter", onPointerEnter);
      nav.removeEventListener("pointerleave", onPointerLeave);
      nav.removeEventListener("focusout", onFocusOut);
      nav.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onDocumentPointerDown);
    };
  }, [isOpen]);

  // A mouse already opened the list by pointing at it: its click must not fold it back.
  const onTogglePress = (event: PressEvent) => {
    if (event.pointerType === "mouse" && isOpen) return;
    setIsOpen((open) => !open);
  };

  const active = SECTIONS[activeIndex];
  // The footer holds the contacts (and its own Labs uplink): the capsule steps out of its way.
  const isVisible = pastHero && (activeIndex < LAST_INDEX || isOpen);

  return (
    <>
      <div className={styles.scrimStyle} data-open={isOpen || undefined} aria-hidden="true" />
      <nav
        ref={navRef}
        aria-label="Sections"
        className={styles.navStyle}
        data-visible={isVisible || undefined}
        data-open={isOpen || undefined}
      >
        <Button
          className={styles.toggleStyle}
          aria-expanded={isOpen}
          aria-controls={listId}
          onPress={onTogglePress}
        >
          <span className={styles.toggleLabelStyle}>
            <span className={styles.srOnlyStyle}>Sections, current: </span>
            <span className={styles.indexStyle} aria-hidden="true">
              {active.index}{" "}
            </span>
            <span key={active.id} className={styles.currentNameStyle}>
              {active.name}
            </span>
          </span>
          <svg className={styles.chevronStyle} viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 9 L7 5 L11 9" />
          </svg>
        </Button>

        <div id={listId} className={styles.listRegionStyle} inert={!isOpen}>
          <ul className={styles.listStyle}>
            {SECTIONS.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className={styles.linkStyle}
                  onClick={() => setIsOpen(false)}
                >
                  <span aria-hidden="true">{section.index} / </span>
                  <span className={styles.linkNameStyle}>{section.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <span className={styles.dividerStyle} aria-hidden="true" />
        <Link to="/labs/" className={styles.labsStyle}>
          Labs <span aria-hidden="true">→</span>
        </Link>

        {/* The neon track along the capsule's foot: one station per section, lit once passed. */}
        <span className={styles.trackStyle} aria-hidden="true">
          <svg className={styles.trackSvgStyle} viewBox="0 0 120 12" preserveAspectRatio="none">
            <path
              d={TRACK_PATH}
              vectorEffect="non-scaling-stroke"
              className={styles.trackBaseStyle}
            />
          </svg>
          <span ref={trackLitRef} className={styles.trackLitStyle}>
            <svg className={styles.trackSvgStyle} viewBox="0 0 120 12" preserveAspectRatio="none">
              <defs>
                <linearGradient
                  id={gradientId}
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="6"
                  x2="120"
                  y2="6"
                >
                  <stop offset="0" className={styles.gradientStopStartStyle} />
                  <stop offset="0.5" className={styles.gradientStopMidStyle} />
                  <stop offset="1" className={styles.gradientStopEndStyle} />
                </linearGradient>
              </defs>
              <path
                d={TRACK_PATH}
                vectorEffect="non-scaling-stroke"
                stroke={`url(#${gradientId})`}
                className={styles.trackHaloStyle}
              />
              <path
                d={TRACK_PATH}
                vectorEffect="non-scaling-stroke"
                stroke={`url(#${gradientId})`}
                className={styles.trackNeonStyle}
              />
            </svg>
          </span>
          {SECTIONS.map((section, index) => (
            <span
              key={section.id}
              className={styles.stationStyle}
              data-lit={index <= activeIndex || undefined}
            />
          ))}
        </span>
      </nav>
    </>
  );
}
