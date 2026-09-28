import { memo, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useShaderCanvas } from "@/components/misc/canvas-renderer/use-canvas-shader.hook";
import { FRAGMENT_SHADER, VERTEX_SHADER } from "@/components/misc/shaders/crt/crt.shader";
import * as styles from "./crt-canvas.css";

const crtShader = {
  vertexGLSL: VERTEX_SHADER,
  fragmentGLSL: FRAGMENT_SHADER,
} as const;

export interface CrtCanvasProps {
  className?: string;
}

/**
 * The light pass of a terminal's glass (crt.shader.ts). Its GPU session starts only once the
 * screen comes within half a viewport, never at hydration; off screen the renderer stops
 * drawing, and under reduced motion it draws one still frame.
 */
function CrtCanvasComponent({ className }: CrtCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || armed || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setArmed(true);
      },
      { rootMargin: "50% 0px" },
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [armed]);

  const { type } = useShaderCanvas(canvasRef, crtShader, {
    animate: true,
    disabled: !armed,
    powerPreference: "low-power",
    // One cell per CSS pixel: the noise reads as phosphor, and a 2x screen draws a quarter.
    renderScale: { min: 1, max: 1 },
  });

  // No WebGL: the CSS glass under it is the whole terminal.
  if (type === "svg") return null;

  return (
    <canvas ref={canvasRef} className={clsx(styles.crtCanvas, className)} aria-hidden="true" />
  );
}

export const CrtCanvas = memo(CrtCanvasComponent);
