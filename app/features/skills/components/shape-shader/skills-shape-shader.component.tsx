import { useEffect, useRef } from "react";
import type { AccentType, ShapeType } from "../../data/skills-data.types";
import { ACCENT_RGB, SHAPE_INDEX } from "../../data/skills-data";
import { VERTEX_SOURCE, getFragmentSource } from "@/components/misc/shaders/shape/shape.shader";
import * as styles from "./skills-shape-shader.css";

const SHAPE_CLASSES: Record<ShapeType, string> = {
  sparkle: styles.shapeSparkleStyle,
  diamond: styles.shapeDiamondStyle,
  cube: styles.shapeCubeStyle,
  circle: styles.shapeCircleStyle,
  hexagon: styles.shapeHexagonStyle,
  ring: styles.shapeRingStyle,
};

interface ShapeShaderProps {
  shape: ShapeType;
  accent: AccentType;
}

export function ShapeShader({ shape, accent }: ShapeShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackClass = `${styles.shapeBaseStyle} ${SHAPE_CLASSES[shape]}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;
    let stop = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };

    const startWebGL = () => {
      const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
      if (!gl) return false;

      const vertex = gl.createShader(gl.VERTEX_SHADER);
      const fragment = gl.createShader(gl.FRAGMENT_SHADER);
      if (!vertex || !fragment) return false;

      const fragmentSource = getFragmentSource(ACCENT_RGB[accent], SHAPE_INDEX[shape]);

      gl.shaderSource(vertex, VERTEX_SOURCE);
      gl.compileShader(vertex);
      gl.shaderSource(fragment, fragmentSource);
      gl.compileShader(fragment);
      if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) return false;
      if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) return false;

      const program = gl.createProgram();
      if (!program) return false;
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;

      const buffer = gl.createBuffer();
      if (!buffer) return false;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );

      const posLoc = gl.getAttribLocation(program, "position");
      const timeLoc = gl.getUniformLocation(program, "uTime");
      const resLoc = gl.getUniformLocation(program, "uResolution");
      const accentLoc = gl.getUniformLocation(program, "uAccent");
      const shapeLoc = gl.getUniformLocation(program, "uShape");
      if (posLoc < 0 || !timeLoc || !resLoc || !accentLoc || !shapeLoc) return false;

      const rgb = ACCENT_RGB[accent];
      const shapeIndex = SHAPE_INDEX[shape];
      const start = performance.now();

      const draw = () => {
        if (stop) return;
        resize();
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1f(timeLoc, (performance.now() - start) * 0.001);
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform3f(accentLoc, rgb[0], rgb[1], rgb[2]);
        gl.uniform1f(shapeLoc, shapeIndex);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        raf = requestAnimationFrame(draw);
      };

      draw();
      return true;
    };

    startWebGL();

    return () => {
      stop = true;
      if (raf) cancelAnimationFrame(raf);
    };
  }, [accent, shape]);

  return (
    <>
      <div className={fallbackClass} aria-hidden />
      <canvas ref={canvasRef} className={styles.shapeShaderCanvasStyle} aria-hidden />
    </>
  );
}
