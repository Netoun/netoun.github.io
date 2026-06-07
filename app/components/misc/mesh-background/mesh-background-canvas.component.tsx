import { memo, useRef } from "react";
import { useShaderCanvas } from "@/components/misc/canvas-renderer/use-canvas-shader.hook";
import {
  FRAGMENT_SHADER,
  VERTEX_SHADER,
} from "@/components/misc/shaders/mesh-background/mesh-background.shader";
import * as styles from "./mesh-background-canvas.css";

const meshShader = {
  vertexGLSL: VERTEX_SHADER,
  fragmentGLSL: FRAGMENT_SHADER,
} as const;

export interface MeshBackgroundCanvasProps {
  quality?: number;
  animate?: boolean;
}

function MeshBackgroundCanvasComponent({
  quality = 0.45,
  animate = true,
}: MeshBackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qualityRef = useRef(quality);
  qualityRef.current = quality;

  useShaderCanvas(canvasRef, meshShader, {
    animate,
    quality: () => qualityRef.current,
    powerPreference: "low-power",
    renderScale: { min: 1, max: 2 },
  });

  return <canvas ref={canvasRef} className={styles.meshCanvas} aria-hidden="true" />;
}

export const MeshBackgroundCanvas = memo(MeshBackgroundCanvasComponent);
