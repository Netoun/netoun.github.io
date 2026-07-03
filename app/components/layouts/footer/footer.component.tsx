import clsx from "clsx";
import { Link } from "react-router";
import { Container } from "@/components/layouts/container/container.component";
import { ServerUnitRack } from "@/components/misc/server-unit/server-unit.component";
import { contactLinks } from "@/pages/welcome/data/contact-links.data";
import { FooterBackground } from "./components/background/footer-background.component";
import * as styles from "./footer.css";

// One identity accent per contact link — echoes the neon nav gradient + rack LEDs.
const CONTACT_ACCENTS = ["primary", "secondary", "tertiary", "kirby"] as const;

interface FooterProps {
  className?: string;
  /** Stable id for anchor navigation (e.g. the home sections nav) */
  id?: string;
}

export function Footer({ className, id }: FooterProps) {
  return (
    <footer id={id} className={clsx(styles.footerStyle, className)}>
      <Container>
        <div className={styles.footerVisualContainerStyle}>
          <FooterBackground />
          <div className={styles.footerContentStyle}>
            <div className={styles.rackWrapperStyle} aria-hidden="true">
              <ServerUnitRack />
            </div>
            <div className={styles.messageWrapperStyle}>
              <h3 className={styles.headingStyle}>
                Thanks for exploring
                <span className={styles.sparkleStyle}>✦</span>
              </h3>
              <p className={styles.subtextStyle}>Built with passion and pixels</p>
              <nav className={styles.contactNavStyle} aria-label="Contact">
                <span className={styles.contactHeaderStyle} aria-hidden="true">
                  _❯ ESTABLISH LINK
                  <span className={styles.contactCursorStyle}>▐</span>
                </span>
                <ul className={styles.contactListStyle}>
                  {contactLinks.map((link, index) => (
                    <li key={link.label}>
                      <a
                        href={link.url}
                        className={clsx(
                          styles.contactLinkStyle,
                          styles.contactLinkAccentStyles[
                            CONTACT_ACCENTS[index % CONTACT_ACCENTS.length]
                          ],
                        )}
                        target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                        rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      >
                        <span className={styles.contactArrowStyle} aria-hidden="true">
                          ⤘
                        </span>
                        {link.label}
                        <span className={styles.contactLedStyle} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <Link to="/labs" className={styles.labsLinkStyle}>
                Explore the Labs →
              </Link>
              <p className={styles.copyrightStyle}>
                © {new Date().getFullYear()} Netoun. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
