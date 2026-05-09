import { memo, useEffect, useRef } from "react";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import type { MousePosition } from "@/hooks/use-mouse-position.hook";
import * as styles from "./dots-canvas.css";

interface DotsCanvasProps {
  className?: string;
  mousePosition: MousePosition;
  priority?: "high" | "medium" | "low";
}

interface Dot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
}

// Vertex shader - GLSL for WebGL
const vertexShaderSource = `
	attribute vec2 a_position;
	attribute vec2 a_basePosition;
	attribute float a_radius;
	
	uniform vec2 u_resolution;
	uniform vec2 u_mousePosition;
	uniform float u_magnetRadius;
	uniform float u_magnetStrength;
	
	varying float v_distance;
	varying float v_opacity;
	
	void main() {
		// Calculate distance from mouse to dot
		vec2 diff = u_mousePosition - a_basePosition;
		float dist = length(diff);
		float distSquared = dot(diff, diff);
		float magnetRadiusSquared = u_magnetRadius * u_magnetRadius;
		
		vec2 position = a_position;
		
		// Apply magnetic effect
		if (distSquared < magnetRadiusSquared && dist > 0.0) {
			float force = (1.0 - dist / u_magnetRadius) * u_magnetStrength;
			vec2 direction = normalize(diff);
			position = a_basePosition + direction * force;
		}
		
		// Convert from pixels to clip space (-1 to 1)
		vec2 clipSpace = ((position / u_resolution) * 2.0 - 1.0) * vec2(1, -1);
		
		gl_Position = vec4(clipSpace, 0, 1);
		gl_PointSize = a_radius * 2.0;
		
		v_distance = dist;
		v_opacity = distSquared < magnetRadiusSquared ? (1.0 - dist / u_magnetRadius) : 0.0;
	}
`;

// Fragment shader - GLSL for WebGL
const fragmentShaderSource = `
	precision mediump float;
	
	varying float v_distance;
	varying float v_opacity;
	
	void main() {
		// Create circular dots
		vec2 coord = gl_PointCoord - vec2(0.5);
		float dist = length(coord);
		
		if (dist > 0.5) {
			discard;
		}
		
		// Base dot color
		vec3 baseColor = vec3(1.0, 1.0, 1.0);
		vec3 glowColor = vec3(0.69, 1.0, 0.56); // rgb(176, 255, 144)
		
		// Mix base color with glow based on proximity to mouse
		vec3 color = mix(baseColor, glowColor, v_opacity);
		float alpha = v_opacity > 0.0 ? 0.3 + v_opacity * 0.5 : 0.3;
		
		gl_FragColor = vec4(color, alpha);
	}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export const DotsCanvas = memo(function DotsCanvas({
  className,
  mousePosition,
  priority = "medium",
}: DotsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const mousePositionRef = useRef(mousePosition);

  // Intersection observer to detect visibility
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  });

  // Animation priority system
  const shouldAnimate = useAnimationPriority({
    priority,
    isVisible: isIntersecting,
  });

  useEffect(() => {
    mousePositionRef.current = mousePosition;
  }, [mousePosition]);

  // Merge refs (canvas and intersection observer)
  useEffect(() => {
    if (canvasRef.current && intersectionRef.current !== canvasRef.current) {
      (intersectionRef as React.MutableRefObject<HTMLCanvasElement | null>).current =
        canvasRef.current;
    }
  }, [intersectionRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Try to get WebGL context
    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      console.warn("WebGL not supported, canvas will not render");
      return;
    }

    // Configuration
    const dotSpacing = 28;
    const dotRadius = 3;
    const magnetRadius = 120;
    const magnetStrength = 40;

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      console.error("Failed to create shaders");
      return;
    }

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      console.error("Failed to create program");
      return;
    }

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const basePositionLocation = gl.getAttribLocation(program, "a_basePosition");
    const radiusLocation = gl.getAttribLocation(program, "a_radius");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mousePositionLocation = gl.getUniformLocation(program, "u_mousePosition");
    const magnetRadiusLocation = gl.getUniformLocation(program, "u_magnetRadius");
    const magnetStrengthLocation = gl.getUniformLocation(program, "u_magnetStrength");

    // Create buffers
    const positionBuffer = gl.createBuffer();
    const basePositionBuffer = gl.createBuffer();
    const radiusBuffer = gl.createBuffer();

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);

      // Recreate dots grid
      dotsRef.current = [];
      const cols = Math.floor(canvas.width / dotSpacing);
      const rows = Math.floor(canvas.height / dotSpacing);

      const positions: number[] = [];
      const basePositions: number[] = [];
      const radii: number[] = [];

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = (i + 0.5) * dotSpacing;
          const y = (j + 0.5) * dotSpacing;

          dotsRef.current.push({ x, y, baseX: x, baseY: y });
          positions.push(x, y);
          basePositions.push(x, y);
          radii.push(dotRadius);
        }
      }

      // Upload base positions (these don't change)
      gl.bindBuffer(gl.ARRAY_BUFFER, basePositionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(basePositions), gl.STATIC_DRAW);

      // Upload radii (these don't change)
      gl.bindBuffer(gl.ARRAY_BUFFER, radiusBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(radii), gl.STATIC_DRAW);
    };

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Skip rendering if animation is paused (not visible or low priority)
      if (!shouldAnimate) return;

      // Clear canvas
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Enable blending for transparency
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      // Use WebGL program
      gl.useProgram(program);

      // Get mouse position relative to canvas center
      const currentMousePosition = mousePositionRef.current;
      const mouseX = currentMousePosition.x - window.innerWidth / 2;
      const mouseY = currentMousePosition.y - window.innerHeight / 2;

      // Update dot positions with smooth return to base
      const positions: number[] = [];
      for (const dot of dotsRef.current) {
        const dx = mouseX - dot.baseX;
        const dy = mouseY - dot.baseY;
        const distanceSquared = dx * dx + dy * dy;
        const magnetRadiusSquared = magnetRadius * magnetRadius;

        if (distanceSquared < magnetRadiusSquared) {
          const distance = Math.sqrt(distanceSquared);
          const force = (1 - distance / magnetRadius) * magnetStrength;
          const angle = Math.atan2(dy, dx);
          dot.x = dot.baseX + Math.cos(angle) * force;
          dot.y = dot.baseY + Math.sin(angle) * force;
        } else {
          // Smooth return to base position
          dot.x += (dot.baseX - dot.x) * 0.1;
          dot.y += (dot.baseY - dot.y) * 0.1;
        }

        positions.push(dot.x, dot.y);
      }

      // Upload dynamic positions
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      // Set base positions
      gl.bindBuffer(gl.ARRAY_BUFFER, basePositionBuffer);
      gl.enableVertexAttribArray(basePositionLocation);
      gl.vertexAttribPointer(basePositionLocation, 2, gl.FLOAT, false, 0, 0);

      // Set radii
      gl.bindBuffer(gl.ARRAY_BUFFER, radiusBuffer);
      gl.enableVertexAttribArray(radiusLocation);
      gl.vertexAttribPointer(radiusLocation, 1, gl.FLOAT, false, 0, 0);

      // Set uniforms
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mousePositionLocation, mouseX, mouseY);
      gl.uniform1f(magnetRadiusLocation, magnetRadius);
      gl.uniform1f(magnetStrengthLocation, magnetStrength);

      // Draw points
      gl.drawArrays(gl.POINTS, 0, dotsRef.current.length);
    };

    // Initialize
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(basePositionBuffer);
      gl.deleteBuffer(radiusBuffer);
    };
  }, [shouldAnimate]);

  return <canvas ref={canvasRef} className={`${styles.dotsCanvasStyles} ${className || ""}`} />;
});
