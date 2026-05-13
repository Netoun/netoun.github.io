import clsx from "clsx";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import * as styles from "./server-unit.css";

type ServerUnitProps = Omit<ComponentProps<"div">, "children"> & {
  seed?: number;
  children?: ReactNode;
  variant?: "a" | "b" | "c";
};

type ServerUnitSize = "xs" | "sm" | "md" | "lg";

type ServerUnitRackProps = ComponentProps<"div"> & {
  seed?: number;
  size?: ServerUnitSize;
};

const SERVER_UNIT_HEIGHT_BY_SIZE: Record<ServerUnitSize, number> = {
  xs: 50,
  sm: 100,
  md: 128,
  lg: 160,
};

const SERVER_RACK_GAP = 10;

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

function ServerUnit({ seed = 42, children, variant = "a", className, ...props }: ServerUnitProps) {
  const variantMeta = {
    a: { brand: "NETOUN CORE", rack: "RACK 42U", code: "CORE" },
    b: { brand: "NETOUN EDGE", rack: "EDGE NODE", code: "EDGE" },
    c: { brand: "NETOUN ARCHIVE", rack: "STORAGE", code: "ARCH" },
  } as const;

  const frontVariantClass =
    variant === "a"
      ? styles.serverFaceFrontVariantAStyle
      : variant === "b"
        ? styles.serverFaceFrontVariantBStyle
        : styles.serverFaceFrontVariantCStyle;

  const stripVariantClass =
    variant === "a"
      ? styles.accentStripVariantAStyle
      : variant === "b"
        ? styles.accentStripVariantBStyle
        : styles.accentStripVariantCStyle;

  const brandBarVariantClass =
    variant === "a"
      ? styles.serverBrandBarVariantAStyle
      : variant === "b"
        ? styles.serverBrandBarVariantBStyle
        : styles.serverBrandBarVariantCStyle;

  const panelVariantClass =
    variant === "a"
      ? styles.ledGridVariantAStyle
      : variant === "b"
        ? styles.ledGridVariantBStyle
        : styles.ledGridVariantCStyle;

  const statusLeds = generateStatusLeds(seed);

  return (
    <div className={clsx(styles.serverUnitContainerStyle, className)} aria-hidden="true" {...props}>
      <div className={styles.serverUnitInnerStyle}>
        <div className={clsx(styles.serverFaceFrontStyle, frontVariantClass)}>
          <span className={styles.screwStyle} />
          <span className={styles.screwStyle} />
          <span className={styles.screwStyle} />
          <span className={styles.screwStyle} />
          <span className={styles.serverHandleStyle} data-side="left" />
          <span className={styles.serverHandleStyle} data-side="right" />
          <div className={clsx(styles.serverBrandBarStyle, brandBarVariantClass)}>
            <span className={styles.serverBrandTitleStyle}>{variantMeta[variant].brand}</span>
            <span className={styles.serverBrandRackStyle}>{variantMeta[variant].rack}</span>
          </div>
          <div className={clsx(styles.ledGridStyle, panelVariantClass)}>{children}</div>
          <div className={clsx(styles.accentStripStyle, stripVariantClass)} />
          <div className={styles.driveBayStyle} />
          <div className={styles.statusBarStyle}>
            {statusLeds.map((sl) => (
              <span
                key={sl.label}
                className={styles.statusLedStyle}
                data-status={sl.label}
                style={
                  {
                    "--seed": sl.seed,
                  } as CSSProperties
                }
              />
            ))}
            <span className={styles.statusLabelStyle}>
              {variantMeta[variant].code}-{String(seed).padStart(3, "0")}
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

export function ServerUnitRack({
  seed = 42,
  size = "md",
  className,
  style,
  ...props
}: ServerUnitRackProps) {
  const unitHeight = SERVER_UNIT_HEIGHT_BY_SIZE[size];
  const rackHeight = unitHeight * 3 + SERVER_RACK_GAP * 2;

  return (
    <div
      className={clsx(styles.serverUnitRackPerspectiveStyle, className)}
      style={
        {
          "--server-unit-height": `${unitHeight}px`,
          "--server-rack-gap": `${SERVER_RACK_GAP}px`,
          "--server-rack-height": `${rackHeight}px`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <div className={styles.serverUnitRackStackStyle}>
        <ServerUnit seed={seed} variant="a" />
        <ServerUnit seed={seed + 7} variant="b" />
        <ServerUnit seed={seed + 13} variant="c" />
      </div>
    </div>
  );
}
