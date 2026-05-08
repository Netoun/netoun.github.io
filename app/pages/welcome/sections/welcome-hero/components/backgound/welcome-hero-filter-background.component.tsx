import { memo, useEffect, useRef, useState } from "react";
import { MousePathCanvas } from "@/components/misc/mouse-path-canvas/mouse-path-canvas.component";
import { ClientOnly } from "@/components/primitives/client-only/client-only.component";
import type { MousePosition } from "@/hooks/use-mouse-position";
import * as styles from "./welcome-hero-filter-background.css";

// Each mesh has its own bounding box + blur padding for optimized rendering.
// Smaller filter regions = less GPU work.
const MESH_SHAPES = [
  {
    id: "mesh-1",
    d: "M25.5 -31.1C31.3 -25.6 33 -15.8 33.4 -6.8C33.9 2.2 33.1 10.4 29.3 16.7C25.4 23.1 18.5 27.4 11 30.3C3.4 33.1 -4.8 34.3 -11.4 31.7C-18 29.1 -23 22.6 -28.9 15.3C-34.8 7.9 -41.6 -0.3 -40.3 -7C-39 -13.7 -29.6 -18.9 -21.5 -24C-13.5 -29 -6.7 -34 1.6 -35.9C9.9 -37.8 19.8 -36.5 25.5 -31.1Z",
    viewBox: "-50 -50 100 100",
    style: { top: "0%", left: "0%", width: "55%", height: "50%" },
    pathIndex: 1,
  },
  {
    id: "mesh-2",
    d: "M8.5,-5.6C14.5,-2.5,25.3,-1.3,25.5,0.2C25.8,1.8,15.5,3.5,9.5,6.2C3.5,8.9,1.8,12.5,-4.3,16.8C-10.4,21.1,-20.7,26.1,-24.1,23.4C-27.4,20.7,-23.8,10.4,-21.7,2.1C-19.6,-6.1,-19,-12.3,-15.6,-15.3C-12.3,-18.4,-6.1,-18.3,-2.4,-15.9C1.3,-13.5,2.5,-8.6,8.5,-5.6Z",
    // Bounding box: 0→500, 0→300 + blur padding
    viewBox: "-50 -30 100 100",
    style: { bottom: "0", left: "0%", width: "20%", height: "30%" },
    pathIndex: 2,
  },
  {
    id: "mesh-3",
    d: "M649 279 847 298 871 427 712 390Z",
    // Bounding box: x=649→871, y=279→427 + blur padding
    viewBox: "599 229 322 248",
    style: { top: "40%", left: "50%", width: "35%", height: "55%" },
    pathIndex: 3,
  },
] as const;

// Hidden SVG containing all shared defs (filters, patterns)
// Other SVGs can reference these by ID: url(#mesh-blur), url(#mesh-noise-pattern), etc.
const SharedDefsSVG = memo(function SharedDefsSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="0"
      height="0"
      style={{ position: "absolute", visibility: "hidden" }}
      aria-hidden="true"
    >
      <defs>
        {/* Shared blur filter for all mesh shapes */}
        <filter id="mesh-blur" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
        </filter>

        {/* Noise patterns */}
        <filter id="noise" x="0" y="0" width="100%" height="100%">
          {/* Reduced baseFrequency from 1.25 to 0.8 for better performance */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.26"
            result="turbulence"
            stitchTiles="stitch"
          />
          <feBlend in="SourceGraphic" in2="turbulence" mode="overlay" />
        </filter>
      </defs>
    </svg>
  );
});

// Individual mesh SVG scoped to its bounding box (less blur work per shape)
// References shared filter from SharedDefsSVG
const MeshShapeSVG = memo(function MeshShapeSVG({
  d,
  viewBox,
  style,
  pathIndex,
}: (typeof MESH_SHAPES)[number]) {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={styles.welcomeMeshShapeStyles}
      style={style}
    >
      <title>{`Mesh ${pathIndex}`}</title>
      <path
        d={d}
        filter="url(#mesh-blur)"
        data-mesh-index={pathIndex}
        className={styles.welcomeMeshGradientPathStyles}
      />
    </svg>
  );
});

// Noise overlay as a separate layer (references shared patterns)
const NoiseOverlaySVG = memo(function NoiseOverlaySVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 500"
      preserveAspectRatio="none"
      className={styles.welcomeNoiseOverlayStyles}
    >
      <title>Noise Overlay</title>
      <rect x="0" y="0" width="1000" height="500" filter="url(#noise)" fill="currentColor" />
    </svg>
  );
});

interface WelcomeHeroFilterBackgroundProps {
  container: HTMLElement | null;
  mousePosition: MousePosition;
  disabled?: boolean;
}

function WelcomeHeroFilterBackgroundComponent({
  container,
  mousePosition,
  disabled = false,
}: WelcomeHeroFilterBackgroundProps) {
  const [shouldMountMousePath, setShouldMountMousePath] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      setShouldMountMousePath(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {/* Hidden SVG with shared defs (filter, patterns) - must be rendered first */}
      <SharedDefsSVG />

      {/* MousePathCanvas must be outside the shifted mesh container for correct positioning */}
      <ClientOnly>
        {shouldMountMousePath ? (
          container ? (
            <MousePathCanvas
              key={container.id || "mouse-path"}
              container={container}
              mousePosition={mousePosition}
              disabled={disabled}
            />
          ) : null
        ) : null}
      </ClientOnly>

      {/* Mesh background container (shifted for overflow effect) */}
      <div className={styles.welcomeMeshContainerStyles}>
        {/* Each mesh in its own SVG scoped to its bounds → smaller blur regions */}
        {MESH_SHAPES.map((mesh) => (
          <MeshShapeSVG key={mesh.id} {...mesh} />
        ))}

        {/* Single noise overlay on top */}
        <NoiseOverlaySVG />
      </div>
    </>
  );
}

export const WelcomeHeroFilterBackground = WelcomeHeroFilterBackgroundComponent;
