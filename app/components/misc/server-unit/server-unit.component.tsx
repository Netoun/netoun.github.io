import { assignInlineVars } from "@vanilla-extract/dynamic";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import * as styles from "./server-unit.css";

type ServerUnitVariant = "a" | "b" | "c" | "link";

interface ServerUnitProps extends Omit<ComponentProps<"div">, "children"> {
  seed?: number;
  children?: ReactNode;
  variant?: ServerUnitVariant;
  rackLabel?: string;
}

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

interface ServerUnitRackProps extends ComponentProps<"div"> {
  seed?: number;
  /** The Lab's xray: faces outlined, units pulled out of the cabinet by `pull` (0–1). */
  xray?: boolean;
  pull?: number;
  /**
   * Unit height preset. `inherit` sets none: `serverRackVars` come from an ancestor, so the
   * host can size the rack per breakpoint in CSS.
   */
  size?: ServerUnitSize | "inherit";
  patch?: ServerPatch;
}

function pseudoRandom(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export interface StatusLed {
  label: string;
  /** What the phase is drawn from: the unit's seed times 110, 120, 130, 140. */
  input: number;
  seed: number;
}

const STATUS_LABELS = ["PWR", "HDD", "LAN", "ERR"] as const;

/** A unit's four status LEDs, each with its phase (`0`–`1`) drawn from the unit's seed. */
export function generateStatusLeds(seed: number): StatusLed[] {
  return STATUS_LABELS.map((label, index) => {
    const input = seed * (110 + index * 10);
    return { label, input, seed: parseFloat(pseudoRandom(input).toFixed(2)) };
  });
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

/** The rack's three servers, top to bottom: each one's variant and its seed's offset. */
export const RACK_UNITS = [
  { variant: "a", seedOffset: 0 },
  { variant: "b", seedOffset: 7 },
  { variant: "c", seedOffset: 13 },
] as const;

/** The label a unit prints on its status bar (`CORE-042`). */
export function serverUnitCode(variant: ServerUnitVariant, seed: number): string {
  return `${VARIANT_META[variant].code}-${String(seed).padStart(3, "0")}`;
}

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
            <span className={styles.statusLabelStyle}>{serverUnitCode(variant, seed)}</span>
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
  xray = false,
  pull = 0,
  className,
  style,
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
      data-server-xray={xray || undefined}
      className={clsx(
        styles.serverUnitRackPerspectiveStyle,
        size !== "inherit" && styles.serverUnitRackSizeStyles[size],
        className,
      )}
      style={
        xray ? { ...style, ...assignInlineVars({ [styles.serverPull]: String(pull) }) } : style
      }
      {...props}
    >
      <div className={styles.serverUnitRackStackStyle}>
        {patch && (
          <ServerUnit seed={seed + 3} variant="link" rackLabel={`PATCH ${patch.ports.length}P`}>
            <ServerPatchJacks ports={patch.ports} plugged={patch.plugged} />
          </ServerUnit>
        )}
        {RACK_UNITS.map(({ variant, seedOffset }, index) => (
          <ServerUnit
            key={variant}
            seed={seed + seedOffset}
            variant={variant}
            style={xray ? assignInlineVars({ [styles.serverUnitIndex]: String(index) }) : undefined}
          />
        ))}
        <span className={styles.cabinetSideStyle} data-side="left" />
        <span className={styles.cabinetSideStyle} data-side="right" />
        <span className={styles.cabinetCapStyle} data-edge="top" />
        <span className={styles.cabinetCapStyle} data-edge="bottom" />
      </div>
    </div>
  );
}
