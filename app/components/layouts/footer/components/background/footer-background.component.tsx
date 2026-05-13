import { memo, useEffect, useState } from "react";
import {
  SHADER_CONFIG,
  VERTEX_SHADER,
  FRAGMENT_SHADER,
  WEBGPU_SHADER,
  GPU_BUFFER_USAGE,
  getShaderQuality,
  getCanvasSize,
  type RendererType,
  type NavigatorWithGpu,
  type MinimalGPUCanvasContext,
} from "@/components/misc/shaders/mesh-background/mesh-background.shader";
import * as styles from "./footer-background.css";

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
  disabled = false,
}: FooterSharedSvgIds & { disabled?: boolean }) {
  const canvasRef = useState<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = canvasRef;
  const [renderer, setRenderer] = useState<RendererType>("pending");

  useEffect(() => {
    if (!canvas) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    const commonSetup = (onMotionChange?: () => void) => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const reducedMotionRef = { current: mediaQuery.matches };
      const qualityValue = getShaderQuality();
      const handleMotion = () => {
        reducedMotionRef.current = mediaQuery.matches;
        onMotionChange?.();
      };
      mediaQuery.addEventListener("change", handleMotion);
      return {
        qualityValue,
        reducedMotionRef,
        dispose: () => mediaQuery.removeEventListener("change", handleMotion),
      };
    };

    const initWebGPU = async (shouldAbort: () => boolean) => {
      const gpu = (navigator as NavigatorWithGpu).gpu;
      if (!gpu || shouldAbort()) return null;

      const adapter = await gpu.requestAdapter({ powerPreference: "high-performance" });
      if (!adapter || shouldAbort()) return null;

      const device = await adapter.requestDevice();
      if (shouldAbort()) {
        device.destroy();
        return null;
      }

      const context = canvas.getContext("webgpu") as MinimalGPUCanvasContext | null;
      if (!context || shouldAbort()) {
        device.destroy();
        return null;
      }

      const format = gpu.getPreferredCanvasFormat();
      context.configure({ device, format, alphaMode: "premultiplied" });

      const shader = device.createShaderModule({ code: WEBGPU_SHADER });
      const pipeline = device.createRenderPipeline({
        layout: "auto",
        vertex: { module: shader, entryPoint: "vsMain" },
        fragment: {
          module: shader,
          entryPoint: "fsMain",
          targets: [{ format }],
        },
        primitive: { topology: "triangle-list" },
      });

      const uniformBuffer = device.createBuffer({
        size: 16,
        usage: GPU_BUFFER_USAGE.UNIFORM | GPU_BUFFER_USAGE.COPY_DST,
      });

      const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
      });

      let frameId = 0;
      let isRendering = false;
      const start = performance.now();

      const resize = () => {
        const { width, height } = getCanvasSize(canvas);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
      };

      const render = (now: number) => {
        if (shouldAbort()) return;
        isRendering = true;
        const elapsed = common.reducedMotionRef.current ? 0 : (now - start) / 1000;

        device.queue.writeBuffer(
          uniformBuffer,
          0,
          new Float32Array([canvas.width, canvas.height, elapsed, common.qualityValue]),
        );

        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),
              clearValue: { r: 0, g: 0, b: 0, a: 0 },
              loadOp: "clear",
              storeOp: "store",
            },
          ],
        });

        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.draw(6);
        pass.end();
        device.queue.submit([encoder.finish()]);

        if (!canvas.dataset.ready) {
          canvas.dataset.ready = "true";
        }

        if (common.reducedMotionRef.current) {
          isRendering = false;
          return;
        }

        frameId = window.requestAnimationFrame(render);
      };

      const startRendering = () => {
        if (!isRendering && !shouldAbort()) {
          frameId = window.requestAnimationFrame(render);
        }
      };

      const common = commonSetup(startRendering);
      resize();
      const resizeObserver = new ResizeObserver(() => {
        resize();
        startRendering();
      });
      resizeObserver.observe(canvas);
      window.addEventListener("resize", resize, { passive: true });
      startRendering();

      return () => {
        window.cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        window.removeEventListener("resize", resize);
        common.dispose();
        device.destroy();
      };
    };

    const initWebGL = () => {
      const gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance",
      });
      if (!gl) return null;

      const compileShader = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      if (!vertexShader || !fragmentShader) {
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
        return null;
      }

      const program = gl.createProgram();
      if (!program) {
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
      }

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
      }

      gl.useProgram(program);

      const positionBuffer = gl.createBuffer();
      if (!positionBuffer) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );

      const positionLocation = gl.getAttribLocation(program, "a_position");
      if (positionLocation === -1) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
      }

      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
      const timeLocation = gl.getUniformLocation(program, "u_time");
      const qualityLocation = gl.getUniformLocation(program, "u_quality");

      if (!resolutionLocation || !timeLocation || !qualityLocation) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
      }

      let frameId = 0;
      let isRendering = false;
      const start = performance.now();

      const resize = () => {
        const { width, height } = getCanvasSize(canvas);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        gl.viewport(0, 0, width, height);
        gl.uniform2f(resolutionLocation, width, height);
        gl.uniform1f(qualityLocation, common.qualityValue);
      };

      const render = (now: number) => {
        if (cancelled) return;
        isRendering = true;
        const elapsed = common.reducedMotionRef.current ? 0 : (now - start) / 1000;
        gl.uniform1f(timeLocation, elapsed);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        if (!canvas.dataset.ready) {
          canvas.dataset.ready = "true";
        }

        if (common.reducedMotionRef.current) {
          isRendering = false;
          return;
        }

        frameId = window.requestAnimationFrame(render);
      };

      const startRendering = () => {
        if (!isRendering && !cancelled) {
          frameId = window.requestAnimationFrame(render);
        }
      };

      const common = commonSetup(startRendering);
      resize();
      const resizeObserver = new ResizeObserver(() => {
        resize();
        startRendering();
      });
      resizeObserver.observe(canvas);
      window.addEventListener("resize", resize, { passive: true });
      startRendering();

      return () => {
        window.cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        window.removeEventListener("resize", resize);
        common.dispose();
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      };
    };

    const init = async () => {
      let webgpuTimedOut = false;
      let rendererType: RendererType | null = null;
      let rendererCleanup: (() => void) | null = null;

      try {
        const gpuCleanup = await Promise.race<Awaited<ReturnType<typeof initWebGPU>>>([
          initWebGPU(() => cancelled || webgpuTimedOut),
          new Promise<null>((resolve) => {
            window.setTimeout(() => {
              webgpuTimedOut = true;
              resolve(null);
            }, SHADER_CONFIG.webgpuInitTimeoutMs);
          }),
        ]);

        if (!cancelled && gpuCleanup) {
          rendererType = "webgpu";
          rendererCleanup = gpuCleanup;
        }
      } catch (_error) {
        // WebGPU unavailable, fallback to WebGL
      }

      if (!rendererType) {
        const glCleanup = initWebGL();
        if (!cancelled && glCleanup) {
          rendererType = "webgl";
          rendererCleanup = glCleanup;
        }
      }

      if (!rendererType && !cancelled) {
        rendererType = "svg";
      }

      if (rendererType) {
        setRenderer(rendererType);
        cleanup = rendererCleanup;
      }
    };

    void init();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [canvas]);

  if (disabled) {
    return null;
  }

  return (
    <div className={styles.footerMeshContainerStyle}>
      {MESH_SHAPES.map((mesh) => (
        <FooterMeshShapeSVG key={mesh.id} {...mesh} meshBlurId={meshBlurId} />
      ))}
      <FooterNoiseOverlaySVG noiseId={noiseId} />
      {renderer !== "svg" && (
        <canvas ref={setCanvas} className={styles.footerShaderCanvasStyle} aria-hidden="true" />
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
