import clsx from "clsx";
import { useMemo, useState } from "react";
import { Container } from "@/components/layouts/container/container.component";
import { Glyph } from "@/components/primitives/glyph/glyph.component";
import * as plate from "../footer/components/patch-plate/footer-patch-plate.css";
import { FooterStatusStrip } from "../footer/components/status-strip/footer-status-strip.component";
import type { FooterLink, FooterStatus } from "../footer/footer.component";
import * as heading from "../footer/footer.css";
import { restPortId, toFooterPorts } from "../footer/footer-patch";
import * as styles from "./footer-slim.css";

export interface FooterSlimProps {
  className?: string;
  /** Stable id for anchor navigation. */
  id?: string;
  /** Contact links, one port each — owned by the page. */
  links: readonly FooterLink[];
  /** What the build says about itself, for the status strip. */
  status: FooterStatus;
}

/**
 * The home's closing panel cut down to its contact line, for pages that end on their own
 * content (the Labs): the heading, one row of patch ports and the status strip. The ports are
 * the home plate's own parts (socket, plug, LED, labels, reused from its stylesheet so the
 * two footers can't drift apart); pointing at or focusing one moves the plug into it, and at
 * rest it sits in the email port. No rack, no cable, no glass, no shader.
 */
export function FooterSlim({ className, id, links, status }: FooterSlimProps) {
  const ports = useMemo(() => toFooterPorts(links), [links]);
  const resting = restPortId(ports);
  const [active, setActive] = useState<string | null>(null);
  const plugged = active ?? resting;

  return (
    <footer id={id} className={clsx(styles.footerStyle, className)}>
      <div className={styles.panelStyle}>
        <Container>
          <div className={styles.contentStyle}>
            <h2 className={heading.headingStyle}>
              <Glyph className={heading.promptStyle}>_❯</Glyph>
              Establish link
              <Glyph className={heading.cursorStyle}>▐</Glyph>
            </h2>
            <ul className={styles.portRowStyle} aria-label="Contact">
              {ports.map((port) => (
                <li key={port.id} className={styles.portItemStyle}>
                  <a
                    href={port.url}
                    className={clsx(
                      plate.portStyle,
                      plate.portAccentStyles[port.accent],
                      styles.portStyle,
                    )}
                    data-plugged={port.id === plugged ? "true" : "false"}
                    target={port.external ? "_blank" : undefined}
                    rel={port.external ? "noopener noreferrer" : undefined}
                    onPointerEnter={() => setActive(port.id)}
                    onPointerLeave={() => setActive(null)}
                    onFocus={() => setActive(port.id)}
                    onBlur={() => setActive(null)}
                  >
                    <span className={plate.socketStyle} aria-hidden="true">
                      <span className={plate.socketCavityStyle} />
                      <span className={plate.socketPlugStyle} />
                      <span className={plate.socketLedStyle} />
                    </span>
                    <span className={plate.portTextStyle}>
                      <span className={plate.portLabelStyle}>
                        <span className={plate.portNumberStyle} aria-hidden="true">
                          {port.number}
                        </span>
                        {port.label}
                      </span>
                      <span className={plate.portAddressStyle}>{port.address}</span>
                    </span>
                    <span className={plate.portSchemeStyle} aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <FooterStatusStrip status={status} busy={active !== null} />
          </div>
        </Container>
      </div>
    </footer>
  );
}
