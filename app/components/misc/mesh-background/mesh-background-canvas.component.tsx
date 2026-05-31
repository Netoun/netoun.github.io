import { memo, useEffect, useRef } from "react";
import {
  FRAGMENT_SHADER,
  VERTEX_SHADER,
  getCanvasSize,
} from "@/components/misc/shaders/mesh-background/mesh-background.shader";
import * as styles from "./mesh-background-canvas.css";

export interface MeshBackgroundCanvasProps {
  /** Film-grain quality, 0..1 (0 disables the grain layer). */
  quality?: number;
  /** Advance `u_time` so the colour blobs drift. */
  animate?: boolean;
}

/**
 * Self-contained WebGL renderer for the animated mesh-gradient shader.
 *
 * Reuses the shared GLSL from `mesh-background.shader.ts`, but — unlike the
 * hero background, which freezes `u_time` for performance — this drives the
 * animation on a rAF loop so the blobs visibly drift. Fills its positioned
 * parent (parent must be `position: relative`).
 */
function MeshBackgroundCanvasComponent({
  quality = 0.45,
  animate = true,
}: MeshBackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qualityRef = useRef(quality);
  const animateRef = useRef(animate);
  qualityRef.current = quality;
  animateRef.current = animate;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const compile = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        if (import.meta.env.DEV)
          console.warn("[MeshBackgroundCanvas]", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      if (import.meta.env.DEV)
        console.warn("[MeshBackgroundCanvas]", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const qualityLoc = gl.getUniformLocation(program, "u_quality");

    let frameId = 0;
    let last = performance.now();
    let elapsed = 0;

    const frame = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (animateRef.current) elapsed += dt;

      const { width, height } = getCanvasSize(canvas);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      gl.uniform2f(resolutionLoc, width, height);
      gl.uniform1f(timeLoc, elapsed);
      gl.uniform1f(qualityLoc, qualityRef.current);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      frameId = window.requestAnimationFrame(frame);
    };

    frameId = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(frameId);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.meshCanvas} aria-hidden="true" />;
}

export const MeshBackgroundCanvas = memo(MeshBackgroundCanvasComponent);
