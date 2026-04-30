import type { animate } from "animejs";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MousePosition } from "@/hooks/use-mouse-position";

interface Velocity {
  x: number;
  y: number;
}

interface TrailPoint {
  x: number;
  y: number;
  time: number;
  velocity: Velocity;
}

interface UseMouseTrailAnimationProps {
  container: HTMLElement | null;
  mousePosition: MousePosition;
}

export function useMouseTrailAnimation({ container, mousePosition }: UseMouseTrailAnimationProps) {
  const [d, setD] = useState<string>("");
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const lastMousePosition = useRef<MousePosition | null>(null);
  const velocity = useRef<Velocity>({ x: 0, y: 0 });
  const trailPoints = useRef<TrailPoint[]>([]);
  const maxTrailLength = 5; // Reduced from 8 to 5 for better performance
  const isFirstMove = useRef(true);
  const mousePositionRef = useRef(mousePosition);

  // Update the ref when the prop changes (though the object reference should be stable)
  useEffect(() => {
    mousePositionRef.current = mousePosition;
  }, [mousePosition]);

  // Function to generate a smooth trail based on position history
  const generateTrailShape = useCallback(() => {
    if (trailPoints.current.length < 2) return "";

    const points = trailPoints.current;
    const currentPoint = points[0]; // Most recent point

    // Create a smooth Bezier curve through all points
    let path = `M ${Math.round(currentPoint.x)},${Math.round(currentPoint.y)}`;

    // Add Bezier curves for each trail segment
    for (let i = 1; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      // Calculate control points for a smooth curve
      const cp1x = current.x + (next.x - current.x) * 0.3;
      const cp1y = current.y + (next.y - current.y) * 0.3;
      const cp2x = next.x - (next.x - current.x) * 0.3;
      const cp2y = next.y - (next.y - current.y) * 0.3;

      path += ` C ${Math.round(cp1x)},${Math.round(cp1y)} ${Math.round(cp2x)},${Math.round(cp2y)} ${Math.round(next.x)},${Math.round(next.y)}`;
    }

    // Add a final point with reduced size for the trail effect
    const lastPoint = points[points.length - 1];
    const size = Math.round(Math.max(20 - points.length * 2, 5)); // Decreasing size

    // Create a circle at the end of the trail
    const endX = Math.round(lastPoint.x);
    const endY = Math.round(lastPoint.y);

    path += ` M ${endX - size},${endY} A ${size},${size} 0 1,1 ${endX + size},${endY} A ${size},${size} 0 1,1 ${endX - size},${endY}`;

    return path;
  }, []);

  // Function to add a point to the trail
  const addTrailPoint = useCallback((x: number, y: number, velocity: Velocity) => {
    const now = Date.now();
    const newPoint: TrailPoint = { x, y, time: now, velocity };

    // Add the new point at the beginning
    trailPoints.current.unshift(newPoint);

    // Limit the trail length
    if (trailPoints.current.length > maxTrailLength) {
      trailPoints.current = trailPoints.current.slice(0, maxTrailLength);
    }

    // Remove points that are too old (more than 200ms)
    trailPoints.current = trailPoints.current.filter((point) => now - point.time < 200);
  }, []);

  // Function to clear the trail
  const clearTrail = useCallback(() => {
    trailPoints.current = [];
    lastMousePosition.current = null;
    isFirstMove.current = true;
    setD("");
    if (animationRef.current) {
      animationRef.current.pause();
      animationRef.current = null;
    }
  }, []);

  // Animation loop that uses mouse position from useMousePosition
  useEffect(() => {
    // Client-only: skip if not in browser
    if (typeof window === "undefined") return;
    if (!container) return;

    // Reset state when container changes
    isFirstMove.current = true;
    lastMousePosition.current = null;
    trailPoints.current = [];
    setD("");

    // Wait for container to have valid dimensions
    const checkContainerReady = () => {
      const rect = container.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    let checkInterval: ReturnType<typeof setInterval> | undefined;
    let cleanupAnimation: (() => void) | undefined;

    // Function to start the animation loop
    const startAnimationLoop = () => {
      let animationFrameId: number | undefined;
      let lastTime = 0;
      const fps = 30; // Reduce from 60fps to 30fps for better performance
      const frameInterval = 1000 / fps;

      const animate = (currentTime: number) => {
        animationFrameId = requestAnimationFrame(animate);

        const elapsed = currentTime - lastTime;
        if (elapsed < frameInterval) return;

        lastTime = currentTime - (elapsed % frameInterval);

        const currentMousePosition = mousePositionRef.current;
        const rect = container.getBoundingClientRect();

        // Skip if container has no dimensions
        if (rect.width === 0 || rect.height === 0) {
          return;
        }

        // Convert mouse coordinates to container-relative coordinates
        const x = ((currentMousePosition.x - rect.left) / rect.width) * 1000;
        const y = ((currentMousePosition.y - rect.top) / rect.height) * 500;

        // Initialize position on first move
        if (isFirstMove.current) {
          lastMousePosition.current = { x, y };
          // Add an initial point to start the trail
          addTrailPoint(x, y, { x: 0, y: 0 });
          isFirstMove.current = false;
        } else if (lastMousePosition.current) {
          // Calculate velocity
          const deltaX = x - lastMousePosition.current.x;
          const deltaY = y - lastMousePosition.current.y;
          const currentVelocity = { x: deltaX, y: deltaY };

          // Add point to trail
          addTrailPoint(x, y, currentVelocity);

          // Update references
          velocity.current = currentVelocity;
          lastMousePosition.current = { x, y };

          // Generate trail shape
          const trailShape = generateTrailShape();

          // Optimized animation
          if (animationRef.current) {
            animationRef.current.pause();
          }

          setD(trailShape);
        }
      };

      // Start animation
      animationFrameId = requestAnimationFrame(animate);

      // Handler for when mouse leaves the area
      const handleMouseLeave = () => {
        clearTrail();
      };

      container.addEventListener("mouseleave", handleMouseLeave);

      cleanupAnimation = () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        container.removeEventListener("mouseleave", handleMouseLeave);
        if (animationRef.current) {
          animationRef.current.pause();
        }
      };
    };

    // If container is not ready, wait a bit
    if (!checkContainerReady()) {
      checkInterval = setInterval(() => {
        if (checkContainerReady()) {
          if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = undefined;
          }
          // Start animation after container is ready
          startAnimationLoop();
        }
      }, 50);
    } else {
      // Start animation immediately if container is ready
      startAnimationLoop();
    }

    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      if (cleanupAnimation) {
        cleanupAnimation();
      }
    };
  }, [addTrailPoint, generateTrailShape, clearTrail, container]);

  return {
    d,
  };
}
