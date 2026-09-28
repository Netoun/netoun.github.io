import * as styles from "./footer-status-strip.css";

export interface FooterStatus {
  /** The site's host, e.g. `netoun.com`. */
  host: string;
  /** How many paths the build prerendered. */
  routes: number;
  /** UTC day of the build, `YYYY-MM-DD`. */
  buildDate: string;
  /** Short commit of the build; empty when unknown. */
  commit: string;
  /** The site's own repository. */
  sourceUrl: string;
}

export interface FooterStatusStripProps {
  status: FooterStatus;
  /** A port is being pointed at or focused: the LAN LED shows traffic. */
  busy: boolean;
}

const LEDS = ["PWR", "HDD", "LAN", "ERR"] as const;

/**
 * The panel's closing line, printed like the rack's own status bar: LEDs, what the build
 * says about itself (host, prerendered routes, day and commit), the source, the copyright.
 */
export function FooterStatusStrip({ status, busy }: FooterStatusStripProps) {
  const build = [
    status.host.toUpperCase(),
    `${status.routes} routes prerendered`.toUpperCase(),
    `BUILD ${status.buildDate}`,
    status.commit.toUpperCase(),
  ].filter(Boolean);

  return (
    <div className={styles.stripStyle}>
      <span className={styles.ledsStyle} aria-hidden="true">
        {LEDS.map((led) => (
          <span key={led} className={styles.ledItemStyle}>
            <span className={styles.ledStyle} data-led={led} data-busy={busy ? "true" : "false"} />
            <span className={styles.ledLabelStyle}>{led}</span>
          </span>
        ))}
      </span>
      <span className={styles.grooveStyle} aria-hidden="true" />
      <p className={styles.buildStyle}>{build.join(" · ")}</p>
      <a
        href={status.sourceUrl}
        className={styles.sourceStyle}
        target="_blank"
        rel="noopener noreferrer"
      >
        Source <span aria-hidden="true">↗</span>
      </a>
      <span className={styles.grooveStyle} aria-hidden="true" />
      <p className={styles.copyrightStyle}>
        © {status.buildDate.slice(0, 4)} Netoun. All rights reserved.
      </p>
    </div>
  );
}
