import { memo, useRef } from "react";
import { useShaderCanvas } from "@/components/misc/canvas-renderer/use-canvas-shader.hook";
import {
  SHADER_CONFIG,
  VERTEX_SHADER,
  FRAGMENT_SHADER,
  WEBGPU_SHADER,
} from "@/components/misc/shaders/mesh-background/mesh-background.shader";
import * as styles from "./footer-background.css";

const footerShader = {
  vertexGLSL: VERTEX_SHADER,
  fragmentGLSL: FRAGMENT_SHADER,
  webgpuWGSL: WEBGPU_SHADER,
} as const;

function getShaderQuality() {
  return document.documentElement.dataset.quality === "high"
    ? SHADER_CONFIG.highQuality
    : SHADER_CONFIG.defaultQuality;
}

const MESH_SHAPES = [
  {
    id: "footer-mesh-1",
    d: "M25.5 -31.1C31.3 -25.6 33 -15.8 33.4 -6.8C33.9 2.2 33.1 10.4 29.3 16.7C25.4 23.1 18.5 27.4 11 30.3C3.4 33.1 -4.8 34.3 -11.4 31.7C-18 29.1 -23 22.6 -28.9 15.3C-34.8 7.9 -41.6 -0.3 -40.3 -7C-39 -13.7 -29.6 -18.9 -21.5 -24C-13.5 -29 -6.7 -34 1.6 -35.9C9.9 -37.8 19.8 -36.5 25.5 -31.1Z",
    viewBox: "-50 -50 100 100",
    style: { top: "0%", left: "0%", width: "55%", height: "50%" },
    pathIndex: 1,
  },
  {
    id: "footer-mesh-2",
    d: "M8.5,-5.6C14.5,-2.5,25.3,-1.3,25.5,0.2C25.8,1.8,15.5,3.5,9.5,6.2C3.5,8.9,1.8,12.5,-4.3,16.8C-10.4,21.1,-20.7,26.1,-24.1,23.4C-27.4,20.7,-23.8,10.4,-21.7,2.1C-19.6,-6.1,-19,-12.3,-15.6,-15.3C-12.3,-18.4,-6.1,-18.3,-2.4,-15.9C1.3,-13.5,2.5,-8.6,8.5,-5.6Z",
    viewBox: "-50 -30 100 100",
    style: { bottom: "0", left: "0%", width: "20%", height: "30%" },
    pathIndex: 2,
  },
  {
    id: "footer-mesh-3",
    d: "M649 279 847 298 871 427 712 390Z",
    viewBox: "599 229 322 248",
    style: { top: "40%", left: "50%", width: "35%", height: "55%" },
    pathIndex: 3,
  },
] as const;

const normalizeSvgId = (id: string) => id.replace(/:/g, "-");

interface FooterSharedSvgIds {
  meshBlurId: string;
  noiseId: string;
}

const FooterSharedDefsSVG = memo(function FooterSharedDefsSVG({
  meshBlurId,
  noiseId,
}: FooterSharedSvgIds) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="0"
      height="0"
      style={{ position: "absolute", visibility: "hidden" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id={meshBlurId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
        </filter>
        <filter id={noiseId} x="0" y="0" width="100%" height="100%">
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

type FooterMeshShapeSVGProps = (typeof MESH_SHAPES)[number] & {
  meshBlurId: string;
};

const FooterMeshShapeSVG = memo(function FooterMeshShapeSVG({
  d,
  viewBox,
  style,
  pathIndex,
  meshBlurId,
}: FooterMeshShapeSVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={styles.footerMeshShapeStyle}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={d}
        filter={`url(#${meshBlurId})`}
        data-mesh-index={pathIndex}
        className={styles.footerMeshGradientPathStyle}
      />
    </svg>
  );
});

const FooterNoiseOverlaySVG = memo(function FooterNoiseOverlaySVG({
  noiseId,
}: Pick<FooterSharedSvgIds, "noiseId">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 500"
      preserveAspectRatio="none"
      className={styles.footerNoiseOverlayStyle}
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="0"
        y="0"
        width="1000"
        height="500"
        filter={`url(#${noiseId})`}
        fill="white"
        opacity="0.08"
      />
    </svg>
  );
});

const FooterMeshShaderBackground = memo(function FooterMeshShaderBackground({
  meshBlurId,
  noiseId,
}: FooterSharedSvgIds) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { type } = useShaderCanvas(canvasRef, footerShader, {
    animate: false,
    quality: getShaderQuality,
    powerPreference: "high-performance",
    webgpuTimeout: SHADER_CONFIG.webgpuInitTimeoutMs,
  });

  return (
    <div className={styles.footerMeshContainerStyle}>
      {MESH_SHAPES.map((mesh) => (
        <FooterMeshShapeSVG key={mesh.id} {...mesh} meshBlurId={meshBlurId} />
      ))}
      <FooterNoiseOverlaySVG noiseId={noiseId} />
      {type !== "svg" && (
        <canvas ref={canvasRef} className={styles.footerShaderCanvasStyle} aria-hidden="true" />
      )}
    </div>
  );
});

export function FooterBackground() {
  const svgId = normalizeSvgId("footer-bg");
  const meshBlurId = `${svgId}-mesh-blur`;
  const noiseId = `${svgId}-noise`;

  return (
    <>
      <FooterSharedDefsSVG meshBlurId={meshBlurId} noiseId={noiseId} />
      <FooterMeshShaderBackground meshBlurId={meshBlurId} noiseId={noiseId} />
    </>
  );
}
