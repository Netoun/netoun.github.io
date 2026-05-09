import { memo, useEffect, useRef, useState } from "react";
import { Computer } from "@/components/misc/computer/computer.component";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import type { MousePosition } from "@/hooks/use-mouse-position.hook";
import { CharacterGrid } from "./components/character-grid/welcome-hero-computer-character-grid.component";
import { SquareGrid } from "./components/square-grid/welcome-hero-computer-square-grid.component";
import * as styles from "./welcome-hero-computer.css";

// Generate random character: ., ▨, or random letter
// 60% chance for ".", 30% chance for "▨", 10% chance for a letter
const getRandomCharacter = (): string => {
  const random = Math.random();
  if (random < 0.6) return "."; // 60%
  if (random < 0.9) return "▨"; // 30%
  // Random letter from alphabet (10%)
  return String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
};

// Pre-generate a pool of random characters to avoid repeated Math.random() calls
const CHAR_POOL_SIZE = 1000;
const CHAR_POOL: string[] = Array.from({ length: CHAR_POOL_SIZE }, () => getRandomCharacter());

function WelcomeHeroComputerComponentInner({ mousePosition }: { mousePosition: MousePosition }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [itemCount, setItemCount] = useState(0);
  const [gridColumns, setGridColumns] = useState(0);
  const [characters, setCharacters] = useState<string[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs for stable comparison inside ResizeObserver — avoids re-subscription loop
  const itemCountRef = useRef(0);
  const gridColumnsRef = useRef(0);

  // Mutable ref for characters (write without re-render, flush to state in batch)
  const charsRef = useRef<string[]>([]);
  const poolIndexRef = useRef(0);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Store mousePosition in ref to avoid dependency on prop changes
  // The ref is updated directly from the prop object (which has stable reference)
  const mousePositionRef = useRef(mousePosition);
  const lastRotationRef = useRef({ x: 0, y: 0 });
  const shouldAnimateRef = useRef(true); // High priority, always true

  // Keep ref in sync with prop (direct mutation, no rerender)
  mousePositionRef.current = mousePosition;

  // Intersection observer to detect visibility
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  });

  // Medium priority: pauses RAF and interval when hero is off-screen
  const shouldAnimate = useAnimationPriority({
    priority: "medium",
    isVisible: isIntersecting,
  });
  shouldAnimateRef.current = shouldAnimate;

  useEffect(() => {
    if (containerRef.current && intersectionRef.current !== containerRef.current) {
      (intersectionRef as React.MutableRefObject<HTMLDivElement | null>).current =
        containerRef.current;
    }
  }, [intersectionRef]);

  // Calculate number of items based on container size (12px per item)
  useEffect(() => {
    const calculateItemCount = () => {
      if (!contentRef.current) return;

      const container = contentRef.current;
      const itemsPerRow = Math.floor(container.clientWidth / 12);
      const itemsPerCol = Math.floor(container.clientHeight / 12);
      const totalItems = itemsPerRow * itemsPerCol;

      if (totalItems > 0) {
        if (totalItems !== itemCountRef.current) {
          itemCountRef.current = totalItems;
          setItemCount(totalItems);
        }
        if (itemsPerRow !== gridColumnsRef.current) {
          gridColumnsRef.current = itemsPerRow;
          setGridColumns(itemsPerRow);
        }
      }
    };

    const timeoutId = setTimeout(calculateItemCount, 0);
    const resizeObserver = new ResizeObserver(calculateItemCount);
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, []);

  // Initialize characters when itemCount changes
  useEffect(() => {
    if (itemCount === 0) return;

    const initialChars = Array.from({ length: itemCount }, () => "▨");
    charsRef.current = initialChars;
    setCharacters(initialChars);
  }, [itemCount]);

  // Optimized: Single batch timer to update random subset of characters
  useEffect(() => {
    if (itemCount === 0) return;

    // Clear existing interval
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    // Helper to get next character from pre-generated pool
    const getNextPoolChar = (): string => {
      const char = CHAR_POOL[poolIndexRef.current % CHAR_POOL_SIZE];
      poolIndexRef.current++;
      return char;
    };

    intervalIdRef.current = setInterval(() => {
      if (!shouldAnimateRef.current) return;
      const updateCount = Math.max(1, Math.floor(itemCount * 0.05));

      // Mutate the ref directly (no re-render per character)
      for (let i = 0; i < updateCount; i++) {
        const randomIndex = Math.floor(Math.random() * itemCount);
        charsRef.current[randomIndex] = getNextPoolChar();
      }

      // Single batch update to state (one re-render per interval tick)
      setCharacters([...charsRef.current]);
    }, 100);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [itemCount]);

  useEffect(() => {
    let frameId: number;
    let idleCallbackId: number | undefined;
    let lastUpdateTime = 0;
    const updateInterval = 16; // ~60fps max

    const animate = (currentTime: number) => {
      frameId = requestAnimationFrame(animate);

      // Skip animation if should not animate (not visible or low priority)
      // Read from ref to avoid dependency on state changes
      if (!shouldAnimateRef.current) return;

      // Throttle updates to reduce unnecessary renders
      if (currentTime - lastUpdateTime < updateInterval) {
        return;
      }
      lastUpdateTime = currentTime;

      // Read current mouse position from ref (no dependency on prop)
      const currentMousePos = mousePositionRef.current;
      const newRotation = {
        x: currentMousePos.x * -0.001,
        y: currentMousePos.y * -0.001,
      };

      // Only update state if rotation actually changed
      if (
        Math.abs(newRotation.x - lastRotationRef.current.x) > 0.0001 ||
        Math.abs(newRotation.y - lastRotationRef.current.y) > 0.0001
      ) {
        lastRotationRef.current = newRotation;

        // Use requestIdleCallback for non-critical rotation updates
        if (idleCallbackId) {
          cancelIdleCallback(idleCallbackId);
        }

        if ("requestIdleCallback" in window) {
          idleCallbackId = requestIdleCallback(
            () => {
              setRotation(newRotation);
            },
            { timeout: 100 },
          );
        } else {
          // Fallback for browsers without requestIdleCallback
          setRotation(newRotation);
        }
      }
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      if (idleCallbackId) {
        cancelIdleCallback(idleCallbackId);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.welcomeHeroComputerWrapperStyles}>
      <div
        style={
          {
            "--mouse-position-x": `${rotation.x}deg`,
            "--mouse-position-y": `${rotation.y}deg`,
          } as React.CSSProperties
        }
        className={styles.welcomeHeroComputerCapturesStyles}
      >
        <Computer>
          <div className={styles.welcomeHeroComputerStyles}>
            <CharacterGrid
              contentRef={contentRef}
              gridColumns={gridColumns}
              characters={characters}
            />
            <SquareGrid columns={2} rows={10} />
          </div>
        </Computer>
      </div>
    </div>
  );
}
// Memoize component to prevent rerenders when mousePosition object reference is stable
export const WelcomeHeroComputerComponent = memo(
  WelcomeHeroComputerComponentInner,
  (prevProps, nextProps) => {
    // Only rerender if mouse position values actually changed
    return (
      prevProps.mousePosition.x === nextProps.mousePosition.x &&
      prevProps.mousePosition.y === nextProps.mousePosition.y
    );
  },
);
