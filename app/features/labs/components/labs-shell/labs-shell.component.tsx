import { useState } from "react";
import { NavLink } from "react-router";
import { getGroupedExperiments } from "../../data/experiments";
import * as styles from "./labs-shell.css";

interface LabsShellProps {
  children: React.ReactNode;
}

/** Persistent Labs layout: grouped experiment sidebar + content outlet. */
export function LabsShell({ children }: LabsShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const groups = getGroupedExperiments();
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brandRow}>
          <NavLink to="/labs" end className={styles.brand} onClick={closeMenu}>
            <span className={styles.brandMark}>▚</span>
            LABS
          </NavLink>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="labs-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        <nav id="labs-nav" className={styles.nav} data-open={menuOpen}>
          {groups.map((section) => (
            <div key={section.group} className={styles.navGroup}>
              <p className={styles.navGroupTitle}>{section.group}</p>
              {section.experiments.map((experiment) => (
                <NavLink
                  key={experiment.slug}
                  to={`/labs/${experiment.slug}`}
                  className={styles.navLink}
                  onClick={closeMenu}
                >
                  <span className={styles.navIcon} aria-hidden="true">
                    {experiment.icon}
                  </span>
                  <span className={styles.navText}>{experiment.title}</span>
                  <span className={styles.navDot} data-accent={experiment.accent} />
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <main className={styles.content}>{children}</main>
    </div>
  );
}
