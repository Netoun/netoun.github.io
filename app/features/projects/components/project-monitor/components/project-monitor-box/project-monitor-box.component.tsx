import * as styles from "./project-monitor-box.css";

const SIDES = ["front", "back", "right", "left", "top", "bottom"] as const;

export interface ProjectMonitorBoxProps {
  kind: "cube" | "server";
  tone: "mint" | "violet" | "gold" | "azure" | "graphite";
  /** Pose owned by the parent (a turn on selection, a spin on arrival). */
  className?: string;
}

/** A 12–18px CSS-3D object. Decorative: its meaning is always written next to it. */
export function ProjectMonitorBox({ kind, tone, className }: ProjectMonitorBoxProps) {
  const faceSize = kind === "cube" ? styles.cubeFaceStyle : styles.serverFaceStyle;

  return (
    <span
      className={`${styles.boxStyle({ kind, tone })}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      {SIDES.map((side) => (
        <span
          key={side}
          className={[
            styles.faceStyle,
            faceSize[side],
            kind === "server" && side === "front"
              ? styles.serverFrontStyle
              : styles.shadeStyle[side],
          ].join(" ")}
        />
      ))}
    </span>
  );
}
