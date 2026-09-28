import clsx from "clsx";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "react-aria-components";
import type { PressEvent } from "react-aria-components";
import { Link } from "react-router";
import { Glyph } from "@/components/primitives/glyph/glyph.component";
import type { LabExperiment } from "../../data/labs.types";
import { LabsIsoIcon } from "../labs-iso-icon/labs-iso-icon.component";
import { dockPosition, experimentNumber, groupDockEntries, stationOffset } from "./labs-dock";
import * as styles from "./labs-dock.css";

export interface LabsDockProps {
  /** The registry, in its order: numbers, groups and stations all read from it. */
  experiments: readonly LabExperiment[];
  /** The experiment on screen; undefined on the index. */
  currentSlug?: string;
  /** Id of the footer: the dock steps out of its way while it is on screen. */
  hideWhenVisibleId?: string;
}

const labHref = (slug: string) => `/labs/${slug}/`;

/**
 * The Labs' way around: a small ink capsule at the foot of the screen. At rest it names the
 * experiment on screen with its neighbours one key away; hover, focus or a tap on the label
 * grows it upward into the whole list, grouped as the registry groups it.
 */
export function LabsDock({ experiments, currentSlug, hideWhenVisibleId }: LabsDockProps) {
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAway, setIsAway] = useState(false);
  const listId = useId();

  const { current, previous, next, lit } = dockPosition(experiments, currentSlug);
  const groups = groupDockEntries(experiments);
  const isIndex = current === -1;
  const currentExperiment = isIndex ? undefined : experiments[current];

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
      toggleRef.current?.focus();
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

  // The footer holds the contacts: while any of it is on screen the capsule steps away (it
  // would sit on its ports), and comes back with focus.
  useEffect(() => {
    if (!hideWhenVisibleId || typeof IntersectionObserver === "undefined") return;
    const target = document.getElementById(hideWhenVisibleId);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setIsAway(entry.isIntersecting));
    observer.observe(target);
    return () => observer.disconnect();
  }, [hideWhenVisibleId]);

  // A mouse already opened the list by pointing at it: its click must not fold it back.
  const onTogglePress = (event: PressEvent) => {
    if (event.pointerType === "mouse" && isOpen) return;
    setIsOpen((open) => !open);
  };
  const close = () => setIsOpen(false);

  return (
    <>
      <div className={styles.scrimStyle} data-open={isOpen || undefined} aria-hidden="true" />
      <nav
        ref={navRef}
        aria-label="Experiments"
        className={styles.dockStyle}
        data-mode={isIndex ? "index" : "experiment"}
        data-open={isOpen || undefined}
        data-away={(isAway && !isOpen) || undefined}
      >
        <Button
          ref={toggleRef}
          className={styles.toggleStyle}
          aria-expanded={isOpen}
          aria-controls={listId}
          onPress={onTogglePress}
        >
          <span className={styles.toggleLabelStyle}>
            {currentExperiment ? (
              <>
                <span className={styles.srOnlyStyle}>Experiments, current: </span>
                <span className={styles.indexStyle} aria-hidden="true">
                  {experimentNumber(current)}{" "}
                </span>
                <span key={currentExperiment.slug} className={styles.currentNameStyle}>
                  {currentExperiment.title}
                </span>
              </>
            ) : (
              <>
                <span className={styles.srOnlyStyle}>Experiments: </span>
                <span className={styles.indexStyle}>
                  <Glyph>_</Glyph>Labs ·
                </span>{" "}
                {experiments.length} experiments
              </>
            )}
          </span>
          <svg className={styles.chevronStyle} viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 9 L7 5 L11 9" />
          </svg>
        </Button>

        <div id={listId} className={styles.listRegionStyle} inert={!isOpen}>
          <div className={styles.listStyle}>
            {groups.map((section) => (
              <div key={section.group}>
                <p className={styles.groupLabelStyle} aria-hidden="true">
                  {section.group}
                </p>
                <ul className={styles.groupListStyle} aria-label={section.group}>
                  {section.entries.map(({ experiment, number, position, row }) => (
                    <li key={experiment.slug} data-row={row}>
                      <Link
                        to={labHref(experiment.slug)}
                        aria-current={position === current ? "page" : undefined}
                        className={styles.linkStyle}
                        onClick={close}
                      >
                        <span
                          className={clsx(styles.iconStyle, styles.iconAccents[experiment.accent])}
                          aria-hidden="true"
                        >
                          <LabsIsoIcon slug={experiment.slug} />
                        </span>
                        <span aria-hidden="true">{number} / </span>
                        <span className={styles.linkNameStyle}>{experiment.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link
              to="/labs/"
              aria-current={isIndex ? "page" : undefined}
              className={clsx(styles.linkStyle, styles.indexLinkStyle)}
              onClick={close}
            >
              Labs index <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {!isIndex && (
          <>
            <span className={styles.dividerStyle} aria-hidden="true" />
            {previous ? (
              <Link
                to={labHref(previous.slug)}
                className={clsx(styles.stepStyle, styles.stepAreas.previous)}
                aria-label={`Previous experiment: ${previous.title}`}
              >
                <Glyph>❮</Glyph>
              </Link>
            ) : (
              <span
                className={clsx(styles.stepStyle, styles.stepAreas.previous)}
                data-disabled
                aria-hidden="true"
              >
                ❮
              </span>
            )}
            {next ? (
              <Link
                to={labHref(next.slug)}
                className={clsx(styles.stepStyle, styles.stepAreas.next)}
                aria-label={`Next experiment: ${next.title}`}
              >
                <Glyph>❯</Glyph>
              </Link>
            ) : (
              <span
                className={clsx(styles.stepStyle, styles.stepAreas.next)}
                data-disabled
                aria-hidden="true"
              >
                ❯
              </span>
            )}
          </>
        )}

        {/* The neon track along the capsule's foot: one station per experiment, lit up to the
            one on screen. */}
        <span className={styles.trackStyle} aria-hidden="true">
          <span className={styles.trackBaseStyle} />
          <span
            className={styles.trackLitStyle}
            style={assignInlineVars({ [styles.dockLit]: lit.toFixed(4) })}
          >
            <span className={styles.trackHaloStyle} />
            <span className={styles.trackNeonStyle} />
          </span>
          {experiments.map((experiment, position) => (
            <span
              key={experiment.slug}
              className={styles.stationStyle}
              style={assignInlineVars({
                [styles.stationAt]: stationOffset(position, experiments.length).toFixed(4),
              })}
              data-lit={(!isIndex && position < current) || undefined}
              data-current={position === current || undefined}
            />
          ))}
        </span>
      </nav>
    </>
  );
}
