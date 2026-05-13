import { useId } from "react";
import type { ShapeType } from "../../data/skills-data.types";
import * as styles from "./skills-shape-shader.css";

interface ShapeShaderProps {
  shape: ShapeType;
}

function ShapeSvg({ shape }: { shape: ShapeType }) {
  const glossId = useId();

  return (
    <svg viewBox="0 0 32 32" className={styles.shapeSvgStyle} aria-hidden="true">
      <defs>
        <radialGradient id={glossId} cx="25%" cy="25%" r="65%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="60%" stopColor="white" stopOpacity="0.05" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {shape === "sparkle" && (
        <>
          <path
            d="M16 0 L19.52 11.2 L31.36 11.2 L21.76 18.24 L25.28 29.12 L16 22.4 L6.72 29.12 L10.24 18.24 L0.64 11.2 L12.48 11.2 Z"
            fill="var(--block-accent)"
          />
          <path
            d="M16 0 L19.52 11.2 L31.36 11.2 L21.76 18.24 L25.28 29.12 L16 22.4 L6.72 29.12 L10.24 18.24 L0.64 11.2 L12.48 11.2 Z"
            fill={`url(#${glossId})`}
          />
        </>
      )}

      {shape === "diamond" && (
        <>
          <polygon points="16,0 32,16 16,32 0,16" fill="var(--block-accent)" />
          <polygon points="16,0 32,16 16,32 0,16" fill={`url(#${glossId})`} />
        </>
      )}

      {shape === "cube" && (
        <>
          <rect x="2" y="2" width="28" height="28" rx="3" fill="var(--block-accent)" />
          <rect x="2" y="2" width="28" height="28" rx="3" fill={`url(#${glossId})`} />
        </>
      )}

      {shape === "circle" && (
        <>
          <circle cx="16" cy="16" r="14" fill="var(--block-accent)" />
          <circle cx="16" cy="16" r="14" fill={`url(#${glossId})`} />
        </>
      )}

      {shape === "hexagon" && (
        <>
          <polygon points="8,0 24,0 32,16 24,32 8,32 0,16" fill="var(--block-accent)" />
          <polygon points="8,0 24,0 32,16 24,32 8,32 0,16" fill={`url(#${glossId})`} />
        </>
      )}

      {shape === "ring" && (
        <circle cx="16" cy="16" r="11" fill="none" stroke="var(--block-accent)" strokeWidth="3" />
      )}
    </svg>
  );
}

export function ShapeShader({ shape }: ShapeShaderProps) {
  return (
    <div className={styles.shapeShaderContainerStyle}>
      <div className={styles.shapeShaderIntersectionStyle}>
        <ShapeSvg shape={shape} />
      </div>
    </div>
  );
}
