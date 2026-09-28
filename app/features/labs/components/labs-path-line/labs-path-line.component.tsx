import { Link } from "react-router";
import { Glyph } from "@/components/primitives/glyph/glyph.component";
import * as styles from "./labs-path-line.css";

interface LabsPathLineProps {
  /** The experiment on screen; none on the index. */
  slug?: string;
}

/** Where the page sits, typed as a path: `❮ netoun.com / labs / <slug>`. The way home. */
export function LabsPathLine({ slug }: LabsPathLineProps) {
  return (
    <nav aria-label="Breadcrumb" className={styles.pathStyle}>
      <ol className={styles.listStyle}>
        <li className={styles.itemStyle}>
          <Link to="/" className={styles.linkStyle}>
            <Glyph>❮</Glyph>
            netoun.com
          </Link>
        </li>
        <li className={styles.itemStyle}>
          <span className={styles.separatorStyle} aria-hidden="true">
            /
          </span>
          {slug ? (
            <Link to="/labs/" className={styles.linkStyle}>
              labs
            </Link>
          ) : (
            <span className={styles.currentStyle} aria-current="page">
              labs
            </span>
          )}
        </li>
        {slug && (
          <li className={styles.itemStyle}>
            <span className={styles.separatorStyle} aria-hidden="true">
              /
            </span>
            <span className={`${styles.currentStyle} ${styles.slugStyle}`} aria-current="page">
              {slug}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}
