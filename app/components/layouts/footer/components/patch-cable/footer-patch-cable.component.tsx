import { useEffect, useId, useState, type RefObject } from "react";
import type { ServerPatchAccent } from "@/components/misc/server-unit/server-unit.component";
import { cableGeometry, type CableGeometry } from "../../footer-patch";
import * as styles from "./footer-patch-cable.css";

export interface FooterPatchCableProps {
  /** The footer panel: both jacks are looked up inside it, and the cable is drawn over it. */
  containerRef: RefObject<HTMLElement | null>;
  portId: string;
  portIndex: number;
  accent: ServerPatchAccent;
}

/**
 * The patch cable from the rack's jack to the plate's port. Both ends are measured on screen
 * (the rack is in CSS 3D, so its jack is read as projected), and re-measured when the panel
 * resizes or the fonts land. Client-only: it renders nothing until measured. Only the
 * two-column layout (xl) shows it; stacked, the rack sits above the heading.
 */
export function FooterPatchCable({
  containerRef,
  portId,
  portIndex,
  accent,
}: FooterPatchCableProps) {
  // Tagged with its port, so a new port never draws for one frame along the previous path.
  const [measured, setMeasured] = useState<{ portId: string; geometry: CableGeometry } | null>(
    null,
  );
  const shadowId = `${useId().replace(/:/g, "")}-cable-shadow`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const jack = container.querySelector(
        `[data-server-jack="${portId}"] [data-server-jack-socket]`,
      );
      const port = container.querySelector(`[data-footer-socket="${portId}"]`);
      // A port that is not laid out (display: none) has no box to reach.
      if (!jack || !port || port.getClientRects().length === 0) {
        setMeasured(null);
        return;
      }
      const box = container.getBoundingClientRect();
      const from = jack.getBoundingClientRect();
      const to = port.getBoundingClientRect();
      setMeasured({
        portId,
        geometry: cableGeometry(
          { x: from.left + from.width / 2 - box.left, y: from.bottom - box.top },
          { x: to.left - box.left, y: to.top + to.height / 2 - box.top },
          portIndex,
        ),
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    // A face that lands late (Doto from Google Fonts) moves the rows without resizing the panel.
    document.fonts?.addEventListener("loadingdone", measure);
    return () => {
      observer.disconnect();
      document.fonts?.removeEventListener("loadingdone", measure);
    };
  }, [containerRef, portId, portIndex]);

  if (!measured || measured.portId !== portId) return null;
  const { geometry } = measured;

  return (
    <svg className={styles.cableLayerStyle} aria-hidden="true" focusable="false">
      <defs>
        <filter id={shadowId} x="-10%" y="-10%" width="120%" height="140%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>
      <g key={portId} className={styles.cableAccentStyles[accent]}>
        <path
          d={geometry.path}
          pathLength={1}
          className={styles.cableShadowStyle}
          filter={`url(#${shadowId})`}
        />
        <path d={geometry.path} pathLength={1} className={styles.cableOutlineStyle} />
        <path d={geometry.path} pathLength={1} className={styles.cableSheathStyle} />
        <path d={geometry.path} pathLength={1} className={styles.cableHighlightStyle} />
        <path d={geometry.rackBoot} className={styles.cableBootStyle} />
        <path d={geometry.portBoot} className={styles.cableBootStyle} />
      </g>
    </svg>
  );
}
