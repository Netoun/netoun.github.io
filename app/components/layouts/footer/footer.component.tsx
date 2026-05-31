import clsx from "clsx";
import { Link } from "react-router";
import { Container } from "@/components/layouts/container/container.component";
import { ServerUnitRack } from "@/components/misc/server-unit/server-unit.component";
import { FooterBackground } from "./components/background/footer-background.component";
import * as styles from "./footer.css";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={clsx(styles.footerStyle, className)}>
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
