export type RendererType = "pending" | "webgpu" | "webgl" | "svg";

export interface ShaderBundle {
  vertexGLSL: string;
  fragmentGLSL: string;
  webgpuWGSL?: string;
}

export type UniformValue =
  | number
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

export type Uniforms = Record<string, UniformValue>;

export interface RendererOptions {
  animate?: boolean;
  debounceResize?: number;
  respectReducedMotion?: boolean;
  respectVisibility?: boolean;
  powerPreference?: "high-performance" | "low-power";
  webgpuTimeout?: number;
  renderScale?: { min: number; max: number };
  quality?: () => number;
  uniforms?: Uniforms;
  onReady?: (type: RendererType) => void;
}

export interface RendererSession {
  type: RendererType;
  redraw(): void;
  updateUniforms(uniforms: Uniforms): void;
  destroy(): void;
}
