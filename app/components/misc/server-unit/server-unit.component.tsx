import { assignInlineVars } from "@vanilla-extract/dynamic";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import * as styles from "./server-unit.css";

type ServerUnitVariant = "a" | "b" | "c" | "link";

type ServerUnitProps = Omit<ComponentProps<"div">, "children"> & {
  seed?: number;
  children?: ReactNode;
  variant?: ServerUnitVariant;
  rackLabel?: string;
};

type ServerUnitSize = "xs" | "sm" | "md" | "lg";

export type ServerPatchAccent = "primary" | "secondary" | "tertiary" | "kirby";

export interface ServerPatchPort {
  id: string;
  accent: ServerPatchAccent;
}

/** A patch unit mounted on top of the rack: one keystone jack per port. */
export interface ServerPatch {
  ports: readonly ServerPatchPort[];
  /** Port whose jack holds a plug; its LED is lit. */
  plugged?: string | null;
}

type ServerUnitRackProps = ComponentProps<"div"> & {
  seed?: number;
  /**
   * Unit height preset. `inherit` sets none: `serverRackVars` come from an ancestor, so the
   * host can size the rack per breakpoint in CSS.
   */
  size?: ServerUnitSize | "inherit";
  patch?: ServerPatch;
};

function pseudoRandom(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

interface StatusLed {
  seed: number;
  label: string;
}

function generateStatusLeds(seed: number): StatusLed[] {
  return [
    { seed: parseFloat(pseudoRandom(seed * 110).toFixed(2)), label: "PWR" },
    { seed: parseFloat(pseudoRandom(seed * 120).toFixed(2)), label: "HDD" },
    { seed: parseFloat(pseudoRandom(seed * 130).toFixed(2)), label: "LAN" },
    { seed: parseFloat(pseudoRandom(seed * 140).toFixed(2)), label: "ERR" },
  ];
}

const VARIANT_META = {
  a: { brand: "NETOUN CORE", rack: "RACK 42U", code: "CORE" },
  b: { brand: "NETOUN EDGE", rack: "EDGE NODE", code: "EDGE" },
  c: { brand: "NETOUN ARCHIVE", rack: "STORAGE", code: "ARCH" },
  link: { brand: "NETOUN LINK", rack: "PATCH", code: "LINK" },
} as const satisfies Record<ServerUnitVariant, { brand: string; rack: string; code: string }>;

const FRONT_VARIANT_CLASS: Record<ServerUnitVariant, string> = {
  a: styles.serverFaceFrontVariantAStyle,
  b: styles.serverFaceFrontVariantBStyle,
  c: styles.serverFaceFrontVariantCStyle,
  link: styles.serverFaceFrontVariantAStyle,
};

const STRIP_VARIANT_CLASS: Record<ServerUnitVariant, string> = {
  a: styles.accentStripVariantAStyle,
  b: styles.accentStripVariantBStyle,
  c: styles.accentStripVariantCStyle,
  link: styles.accentStripVariantAStyle,
};

const BRAND_BAR_VARIANT_CLASS: Record<ServerUnitVariant, string> = {
  a: styles.serverBrandBarVariantAStyle,
  b: styles.serverBrandBarVariantBStyle,
  c: styles.serverBrandBarVariantCStyle,
  link: styles.serverBrandBarVariantAStyle,
};

const PANEL_VARIANT_CLASS: Record<ServerUnitVariant, string> = {
  a: styles.ledGridVariantAStyle,
  b: styles.ledGridVariantBStyle,
  c: styles.ledGridVariantCStyle,
  link: styles.ledGridLinkStyle,
};

function ServerUnit({
  seed = 42,
  children,
  variant = "a",
  rackLabel,
  className,
  ...props
}: ServerUnitProps) {
  const meta = VARIANT_META[variant];
  const isLink = variant === "link";
  const statusLeds = generateStatusLeds(seed);

  return (
    <div
      className={clsx(
        styles.serverUnitContainerStyle,
        isLink && styles.serverUnitContainerLinkStyle,
        className,
      )}
      aria-hidden="true"
      {...props}
    >
      <div className={styles.serverUnitInnerStyle}>
        <div className={clsx(styles.serverFaceFrontStyle, FRONT_VARIANT_CLASS[variant])}>
          <span className={styles.screwStyle} />
          <span className={styles.screwStyle} />
          <span className={styles.screwStyle} />
          <span className={styles.screwStyle} />
          <span className={styles.serverHandleStyle} data-side="left" />
          <span className={styles.serverHandleStyle} data-side="right" />
          <div className={clsx(styles.serverBrandBarStyle, BRAND_BAR_VARIANT_CLASS[variant])}>
            <span className={styles.serverBrandTitleStyle}>{meta.brand}</span>
            <span className={styles.serverBrandRackStyle}>{rackLabel ?? meta.rack}</span>
          </div>
          <div className={clsx(styles.ledGridStyle, PANEL_VARIANT_CLASS[variant])}>{children}</div>
          {!isLink && (
            <>
              <div className={clsx(styles.accentStripStyle, STRIP_VARIANT_CLASS[variant])} />
              <div className={styles.driveBayStyle} />
            </>
          )}
          <div className={styles.statusBarStyle}>
            {statusLeds.map((sl) => (
              <span
                key={sl.label}
                className={styles.statusLedStyle}
                data-status={sl.label}
                style={assignInlineVars({ [styles.serverLedSeed]: String(sl.seed) })}
              />
            ))}
            <span className={styles.statusLabelStyle}>
              {meta.code}-{String(seed).padStart(3, "0")}
            </span>
          </div>
        </div>
        <div className={styles.serverFaceBackStyle} />
        <div className={styles.serverFaceTopStyle} />
        <div className={styles.serverFaceBottomStyle} />
        <div className={styles.serverFaceLeftStyle} />
        <div className={styles.serverFaceRightStyle} />
      </div>
    </div>
  );
}

/**
 * The patch unit's jacks. Each keystone carries its port number, an LED in the port's accent
 * and, when plugged, a plug with its latch. `data-server-jack-socket` lets the host anchor a
 * cable on the jack as projected on screen.
 */
function ServerPatchJacks({ ports, plugged }: ServerPatch) {
  return ports.map((port, index) => (
    <span
      key={port.id}
      className={clsx(styles.patchJackStyle, styles.patchJackAccentStyles[port.accent])}
      data-server-jack={port.id}
      data-plugged={port.id === plugged ? "true" : "false"}
    >
      <span className={styles.patchJackHeadStyle}>
        <span className={styles.patchJackLedStyle} />
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className={styles.patchJackSocketStyle} data-server-jack-socket="">
        <span className={styles.patchJackCavityStyle} />
        <span className={styles.patchJackPlugStyle} />
      </span>
    </span>
  ));
}

export function ServerUnitRack({
  seed = 42,
  size = "md",
  patch,
  className,
  ...props
}: ServerUnitRackProps) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    rootMargin: "200px",
  });

  return (
    <div
      ref={ref}
      data-server-rack-paused={isIntersecting ? "false" : "true"}
      data-server-rack-patch={patch ? "true" : "false"}
      className={clsx(
        styles.serverUnitRackPerspectiveStyle,
        size !== "inherit" && styles.serverUnitRackSizeStyles[size],
        className,
      )}
      {...props}
    >
      <div className={styles.serverUnitRackStackStyle}>
        {patch && (
          <ServerUnit seed={seed + 3} variant="link" rackLabel={`PATCH ${patch.ports.length}P`}>
            <ServerPatchJacks ports={patch.ports} plugged={patch.plugged} />
          </ServerUnit>
        )}
        <ServerUnit seed={seed} variant="a" />
        <ServerUnit seed={seed + 7} variant="b" />
        <ServerUnit seed={seed + 13} variant="c" />
        <span className={styles.cabinetSideStyle} data-side="left" />
        <span className={styles.cabinetSideStyle} data-side="right" />
        <span className={styles.cabinetCapStyle} data-edge="top" />
        <span className={styles.cabinetCapStyle} data-edge="bottom" />
      </div>
    </div>
  );
}
