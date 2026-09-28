import clsx from "clsx";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Container } from "@/components/layouts/container/container.component";
import { ServerUnitRack } from "@/components/misc/server-unit/server-unit.component";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import { FooterBackground } from "./components/background/footer-background.component";
import { FooterPatchCable } from "./components/patch-cable/footer-patch-cable.component";
import { FooterPatchPlate } from "./components/patch-plate/footer-patch-plate.component";
import {
  FooterStatusStrip,
  type FooterStatus,
} from "./components/status-strip/footer-status-strip.component";
import { restPortId, toFooterPorts, type FooterPortLink } from "./footer-patch";
import * as styles from "./footer.css";
import { Glyph } from "@/components/primitives/glyph/glyph.component";

export type FooterLink = FooterPortLink;
export type { FooterStatus };

export interface FooterProps {
  className?: string;
  /** Stable id for anchor navigation (e.g. the home sections nav) */
  id?: string;
  /** Contact links, one patch port each — owned by the page. */
  links: readonly FooterLink[];
  /** The Labs uplink: the index route and how many experiments it lists. */
  labs: { href: string; count: number };
  /** The rack's own Lab, captioned under it. */
  rackLabHref: string;
  /** What the build says about itself, for the status strip. */
  status: FooterStatus;
}

/**
 * The closing machine panel. The rack carries a NETOUN LINK patch unit, one jack per contact
 * link; the contact block is the matching faceplate. Pointing at or focusing a port plugs a
 * patch cable from the rack into it; at rest the cable sits in the email port.
 */
export function Footer({ className, id, links, labs, rackLabHref, status }: FooterProps) {
  const ports = useMemo(() => toFooterPorts(links), [links]);
  const resting = restPortId(ports);
  const [active, setActive] = useState<string | null>(null);
  const plugged = active ?? resting;
  const pluggedIndex = ports.findIndex((port) => port.id === plugged);
  const pluggedPort = pluggedIndex === -1 ? null : ports[pluggedIndex];

  // The resting cable draws itself the first time the panel comes into view.
  const { ref: panelRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.35,
  });
  const [hasArrived, setHasArrived] = useState(false);
  if (isIntersecting && !hasArrived) setHasArrived(true);

  return (
    <footer id={id} className={clsx(styles.footerStyle, className)}>
      <div ref={panelRef} className={styles.footerVisualContainerStyle}>
        <FooterBackground />
        <Container>
          <div className={styles.footerContentStyle}>
            <div className={styles.rackColumnStyle}>
              <div className={styles.rackWrapperStyle} aria-hidden="true">
                <ServerUnitRack
                  size="inherit"
                  patch={{
                    ports: ports.map((port) => ({ id: port.id, accent: port.accent })),
                    plugged,
                  }}
                />
              </div>
              <Link
                to={rackLabHref}
                className={styles.rackCaptionStyle}
                aria-label={`${rackLabHref} — the server rack, live with its source`}
              >
                <Glyph className={styles.rackCaptionArrowStyle}>⤘</Glyph>
                {rackLabHref}
              </Link>
            </div>

            <div className={styles.contactColumnStyle}>
              <h2 className={styles.headingStyle}>
                <Glyph className={styles.promptStyle}>_❯</Glyph>
                Establish link
                <Glyph className={styles.cursorStyle}>▐</Glyph>
              </h2>
              <FooterPatchPlate
                ports={ports}
                plugged={plugged}
                onActivate={setActive}
                onRelease={() => setActive(null)}
                labs={labs}
              />
            </div>

            <div className={styles.statusRowStyle}>
              <FooterStatusStrip status={status} busy={active !== null} />
            </div>
          </div>
        </Container>

        {hasArrived && pluggedPort && (
          <FooterPatchCable
            containerRef={panelRef}
            portId={pluggedPort.id}
            portIndex={pluggedIndex}
            accent={pluggedPort.accent}
          />
        )}
      </div>
    </footer>
  );
}
