import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { MeshBackgroundCanvas } from "@/components/misc/mesh-background/mesh-background-canvas.component";
import { labs } from "../../data/experiments";
import { LabsIsoIcon } from "../labs-iso-icon/labs-iso-icon.component";
import * as styles from "./labs-shell.css";

interface LabsShellProps {
  children: React.ReactNode;
}

/** Persistent Labs layout: console sidebar (animated mesh + scrim + grain) + content outlet. */
export function LabsShell({ children }: LabsShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const groups = labs.getGrouped();
  const closeMenu = () => setMenuOpen(false);

  // Lock background scroll while the mobile overlay menu is open (overlay only
  // exists below the lg breakpoint, so it never traps desktop scroll).
  useEffect(() => {
    if (!menuOpen) return;
    const overlay = window.matchMedia("(max-width: 1023.98px)");
    if (!overlay.matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // Total experiment count derived from data — never hardcoded
  const totalCount = labs.getAll().length;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        {/* ── Background layers (z -2 and -1) ── */}
        <div className={styles.sidebarMeshCanvas}>
          <MeshBackgroundCanvas quality={0.45} animate />
        </div>
        <div className={styles.sidebarScrim} />
        <div className={styles.sidebarHalos} />
        <div className={styles.sidebarGrain} />

        {/* ── All console chrome sits above layers (z 1) ── */}
        <div className={styles.sidebarContent}>
          {/* Brand header */}
          <div className={styles.conHead}>
            <div className={styles.brandRow}>
              <NavLink to="/labs" end className={styles.brand} onClick={closeMenu}>
                <span className={styles.brandMark}>▚</span>
                LABS
              </NavLink>
              <span className={styles.verBadge}>v0.0.2</span>
            </div>

            {/* Status line: prompt · dot · count · cursor */}
            <div className={styles.statusLine}>
              <span className={styles.statusPrompt}>_❯</span>
              <span className={styles.statusDot} aria-hidden="true" />
              <span>{totalCount} experiments online</span>
              <span className={styles.blinkCursor} aria-hidden="true">
                ▐
              </span>
            </div>

            {/* Mobile menu toggle — hidden on desktop */}
            <button
              type="button"
              className={styles.menuButton}
              aria-expanded={menuOpen}
              aria-controls="labs-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? "_CLOSE_" : "_MENU_"}
            </button>
          </div>

          {/* Grouped nav */}
          <nav id="labs-nav" className={styles.nav} data-open={menuOpen}>
            {groups.map((section) => (
              <div key={section.group} className={styles.navGroup}>
                <p className={styles.navGroupTitle}>{section.group}</p>
                {section.experiments.map((experiment) => (
                  <NavLink
                    key={experiment.slug}
                    to={`/labs/${experiment.slug}`}
                    className={styles.navLink}
                    data-accent={experiment.accent}
                    onClick={closeMenu}
                  >
                    <span className={styles.navPrompt} aria-hidden="true">
                      ❯
                    </span>
                    <span className={styles.navIcon} aria-hidden="true">
                      <LabsIsoIcon slug={experiment.slug} />
                    </span>
                    <span className={styles.navText}>{experiment.title}</span>
                    <span className={styles.navArrow} aria-hidden="true">
                      ⤘
                    </span>
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      <main className={styles.content}>{children}</main>
    </div>
  );
}
