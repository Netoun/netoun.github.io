import { memo, useEffect, useRef } from "react";
import {
  GPU_BUFFER_USAGE_UNIFORM,
  GPU_BUFFER_USAGE_COPY_DST,
  WGSL_SHADER,
  GLSL_VERTEX,
  GLSL_FRAGMENT,
  type HolographicBackend,
} from "@/components/misc/shaders/holographic/holographic.shader";
import * as styles from "./holographic-overlay.css";

function getViewport(canvas: HTMLCanvasElement, parent: HTMLElement) {
  const rect = parent.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

  const width = Math.max(1, Math.floor(rect.width * dpr));
  const height = Math.max(1, Math.floor(rect.height * dpr));

  return {
    width,
    height,
    cssWidth: Math.max(1, rect.width),
    cssHeight: Math.max(1, rect.height),
  };
}

function setCanvasSize(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  cssWidth: number,
  cssHeight: number,
) {
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;

  canvas.style.cssText = `width:${cssWidth}px;height:${cssHeight}px`;
}

async function tryWebGPU(
  canvas: HTMLCanvasElement,
  parent: HTMLElement,
): Promise<HolographicBackend | null> {
  const gpu = (navigator as Navigator & { gpu?: GPU }).gpu;
  if (!gpu) return null;

  const adapter = await gpu.requestAdapter();
  if (!adapter) return null;

  const device = await adapter.requestDevice();
  if (!device) return null;

  const format = gpu.getPreferredCanvasFormat();
  const shaderModule = device.createShaderModule({ code: WGSL_SHADER });

  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: shaderModule,
      entryPoint: "vs",
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fs",
      targets: [
        {
          format,
          blend: {
            color: {
              srcFactor: "one",
              dstFactor: "one-minus-src-alpha",
              operation: "add",
            },
            alpha: {
              srcFactor: "one",
              dstFactor: "one-minus-src-alpha",
              operation: "add",
            },
          },
        },
      ],
    },
    primitive: {
      topology: "triangle-list",
    },
  });

  const uniformBuffer = device.createBuffer({
    size: 16,
    usage: GPU_BUFFER_USAGE_UNIFORM | GPU_BUFFER_USAGE_COPY_DST,
  });

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: { buffer: uniformBuffer },
      },
    ],
  });

  const context = canvas.getContext("webgpu");

  if (!context) {
    device.destroy();
    return null;
  }

  const uniformData = new Float32Array(4);

  const configure = () => {
    context.configure({
      device,
      format,
      alphaMode: "premultiplied",
    });
  };

  configure();

  let disposed = false;

  return {
    resize: () => {
      if (disposed) return;

      const vp = getViewport(canvas, parent);
      setCanvasSize(canvas, vp.width, vp.height, vp.cssWidth, vp.cssHeight);

      configure();

      uniformData[0] = vp.width;
      uniformData[1] = vp.height;
      device.queue.writeBuffer(uniformBuffer, 0, uniformData);
    },

    render: (time: number) => {
      if (disposed) return;

      uniformData[2] = time;
      device.queue.writeBuffer(uniformBuffer, 0, uniformData);

      const encoder = device.createCommandEncoder();
      const textureView = context.getCurrentTexture().createView();

      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: textureView,
            loadOp: "clear",
            storeOp: "store",
            clearValue: { r: 0, g: 0, b: 0, a: 0 },
          },
        ],
      });

      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.draw(6);
      pass.end();

      device.queue.submit([encoder.finish()]);
    },

    dispose: () => {
      disposed = true;
      device.destroy();
    },
  };
}

function tryWebGL(canvas: HTMLCanvasElement, parent: HTMLElement): HolographicBackend | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: "low-power",
  });

  if (!gl) return null;

  const compileShader = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  const vs = compileShader(gl.VERTEX_SHADER, GLSL_VERTEX);
  const fs = compileShader(gl.FRAGMENT_SHADER, GLSL_FRAGMENT);

  if (!vs || !fs) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    return null;
  }

  const program = gl.createProgram();

  if (!program) {
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }

  const positionBuffer = gl.createBuffer();

  if (!positionBuffer) {
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }

  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const timeLocation = gl.getUniformLocation(program, "u_time");

  if (positionLocation === -1 || resolutionLocation === null || timeLocation === null) {
    gl.deleteBuffer(positionBuffer);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }

  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.disable(gl.STENCIL_TEST);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.clearColor(0, 0, 0, 0);

  let disposed = false;

  return {
    resize: () => {
      if (disposed) return;

      const vp = getViewport(canvas, parent);
      setCanvasSize(canvas, vp.width, vp.height, vp.cssWidth, vp.cssHeight);

      gl.viewport(0, 0, vp.width, vp.height);
      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, vp.width, vp.height);
    },

    render: (time: number) => {
      if (disposed) return;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1f(timeLocation, time);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },

    dispose: () => {
      disposed = true;
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}

function HolographicOverlayComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let disposed = false;
    let frameId = 0;
    let backend: HolographicBackend | null = null;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const start = performance.now();

    const getElapsedTime = () => (performance.now() - start) / 1000;

    const render = (now: number) => {
      if (disposed || !backend) return;

      try {
        backend.render((now - start) / 1000);
      } catch (error) {
        console.warn("Holographic overlay render failed.", error);
        backend.dispose();
        backend = null;
        return;
      }

      if (!reducedMotion.matches) {
        frameId = requestAnimationFrame(render);
      }
    };

    const renderOnce = () => {
      if (disposed || !backend) return;

      try {
        backend.render(getElapsedTime());
      } catch (error) {
        console.warn("Holographic overlay render failed.", error);
        backend.dispose();
        backend = null;
      }
    };

    const resize = () => {
      if (disposed || !backend) return;

      backend.resize();

      if (reducedMotion.matches) {
        renderOnce();
      }
    };

    const startRendering = () => {
      if (disposed || !backend) return;

      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(render);
    };

    const onMotionChange = () => {
      cancelAnimationFrame(frameId);

      if (reducedMotion.matches) {
        renderOnce();
        return;
      }

      startRendering();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);

    reducedMotion.addEventListener("change", onMotionChange);

    tryWebGPU(canvas, parent)
      .catch(() => null)
      .then((gpuBackend) => {
        if (disposed) {
          gpuBackend?.dispose();
          return;
        }

        backend = gpuBackend ?? tryWebGL(canvas, parent);

        if (!backend) {
          console.warn("Holographic overlay: no WebGPU/WebGL backend available.");
          return;
        }

        backend.resize();

        if (reducedMotion.matches) {
          renderOnce();
          return;
        }

        startRendering();
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      reducedMotion.removeEventListener("change", onMotionChange);
      backend?.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.holographicOverlayStyles} aria-hidden="true" />;
}

export const HolographicOverlay = memo(HolographicOverlayComponent);
