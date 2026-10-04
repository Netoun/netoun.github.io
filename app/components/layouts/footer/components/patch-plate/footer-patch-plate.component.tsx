import clsx from "clsx";
import { useRef } from "react";
import { Link } from "react-router";
import type { FooterFile, FooterPort } from "../../footer-patch";
import * as styles from "./footer-patch-plate.css";
import { usePlateLight } from "./use-plate-light.hook";

export interface FooterPatchPlateProps {
  ports: readonly FooterPort[];
  /** Port that holds the cable (pointed at, focused, or the resting one). */
  plugged: string | null;
  onActivate: (portId: string) => void;
  onRelease: () => void;
  labs: { href: string; count: number };
  /** A file under the uplink (the résumé), when the page has one to hand over. */
  file?: FooterFile;
}

/**
 * The contact block as a patch-panel faceplate in liquid glass: one port per link (number, keystone, name,
 * address, scheme), then the Labs uplink. Pointing at or focusing a port plugs the cable in.
 */
export function FooterPatchPlate({
  ports,
  plugged,
  onActivate,
  onRelease,
  labs,
  file,
}: FooterPatchPlateProps) {
  const plateRef = useRef<HTMLDivElement>(null);
  usePlateLight(plateRef, plugged);

  return (
    <div ref={plateRef} className={styles.plateStyle}>
      <ul className={styles.portListStyle}>
        {ports.map((port) => (
          <li key={port.id}>
            <a
              href={port.url}
              className={clsx(styles.portStyle, styles.portAccentStyles[port.accent])}
              data-plugged={port.id === plugged ? "true" : "false"}
              target={port.external ? "_blank" : undefined}
              rel={port.external ? "noopener noreferrer" : undefined}
              // Leaving one port for the next fires both in the same task, so the cable goes
              // straight to the next port without a paint at rest in between.
              onPointerEnter={() => onActivate(port.id)}
              onPointerLeave={onRelease}
              onFocus={() => onActivate(port.id)}
              onBlur={onRelease}
            >
              <span className={styles.socketStyle} data-footer-socket={port.id} aria-hidden="true">
                <span className={styles.socketCavityStyle} />
                <span className={styles.socketPlugStyle} />
                <span className={styles.socketLedStyle} />
              </span>
              <span className={styles.portTextStyle}>
                <span className={styles.portLabelStyle}>
                  <span className={styles.portNumberStyle} aria-hidden="true">
                    {port.number}
                  </span>
                  {port.label}
                </span>
                <span className={styles.portAddressStyle}>{port.address}</span>
              </span>
              <span className={styles.portSchemeStyle} aria-hidden="true">
                <span className={styles.portSchemeNameStyle}>{port.scheme} </span>↗
              </span>
            </a>
          </li>
        ))}
      </ul>
      <Link to={labs.href} className={styles.uplinkStyle}>
        <span className={styles.uplinkDisplayStyle} aria-hidden="true">
          <span className={styles.uplinkGhostStyle}>88</span>
          <span className={styles.uplinkCountStyle}>{String(labs.count).padStart(2, "0")}</span>
        </span>
        <span className={styles.portTextStyle}>
          <span className={styles.uplinkLabelStyle}>Labs · uplink</span>
          <span className={styles.portAddressStyle}>
            {labs.count} experiments, live with their source
          </span>
        </span>
        <span className={styles.portSchemeStyle} aria-hidden="true">
          <span className={styles.portSchemeNameStyle}>/labs </span>→
        </span>
      </Link>
      {file && (
        <a href={file.href} download className={styles.uplinkStyle}>
          <span className={styles.uplinkDisplayStyle} aria-hidden="true">
            <span className={styles.uplinkGhostStyle}>88</span>
            <span className={styles.uplinkCountStyle}>{file.format}</span>
          </span>
          <span className={styles.portTextStyle}>
            <span className={styles.uplinkLabelStyle}>{file.label}</span>
            <span className={styles.portAddressStyle}>{file.detail}</span>
          </span>
          <span className={styles.portSchemeStyle} aria-hidden="true">
            <span className={styles.portSchemeNameStyle}>
              {file.href.slice(file.href.lastIndexOf("."))}{" "}
            </span>
            ↓
          </span>
        </a>
      )}
    </div>
  );
}
