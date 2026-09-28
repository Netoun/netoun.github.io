import { assignInlineVars } from "@vanilla-extract/dynamic";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import {
  CELL_ASPECT,
  bucketOf,
  gridFor,
  renderAsciiFrame,
  type AsciiFrame,
  type AsciiRamp,
  type AsciiShape,
} from "./ascii-raymarcher-scene";
import * as styles from "./ascii-raymarcher.css";

export type AsciiPalette = "phosphor" | "ink";

export interface AsciiProbe {
  col: number;
  row: number;
  /** -1 where the ray missed. */
  luminance: number;
  bucket: number;
}

export interface AsciiRaymarcherProps {
  shape: AsciiShape;
  ramp: AsciiRamp;
  /** Font size of the text: one cell is 0.6 of it wide, all of it tall. */
  cellPx: number;
  /** Angle of the key light, in degrees. */
  light: number;
  palette: AsciiPalette;
  playing: boolean;
  /** Print each cell's bucket index instead of its glyph. */
  xray: boolean;
  /** Cells per bucket, a few times a second while `xray` is on. */
  onCounts?: (counts: number[]) => void;
  /** The cell under the pointer, while `xray` is on. */
  onProbe?: (probe: AsciiProbe | null) => void;
}

const FRAME_MS = 50;
const START_TIME = 0.9;

// What the page prerenders: the default scene on the default grid, as text.
const DEFAULT_GRID = gridFor(778, 410, 14);
const INITIAL = renderAsciiFrame({
  ...DEFAULT_GRID,
  shape: "box",
  ramp: "classic",
  light: 35,
  time: START_TIME,
});

/**
 * The scene printed as real text in a `<pre>`: one line per row, written straight to the DOM
 * at 20 frames a second at most, only while the screen is visible and the piece plays. React
 * renders the rows once per grid size; the loop owns their text.
 */
export function AsciiRaymarcher({
  shape,
  ramp,
  cellPx,
  light,
  palette,
  playing,
  xray,
  onCounts,
  onProbe,
}: AsciiRaymarcherProps) {
  const { ref: boxRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    rootMargin: "100px",
  });
  const rowRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [grid, setGrid] = useState(DEFAULT_GRID);
  const scene = useRef({ time: START_TIME, frame: INITIAL as AsciiFrame, tick: 0 });
  const listeners = useRef({ onCounts, onProbe });

  useEffect(() => {
    listeners.current = { onCounts, onProbe };
  });

  // The grid follows the box: as many cells as fit at this size.
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      const next = gridFor(box.clientWidth, box.clientHeight, cellPx);
      setGrid((current) =>
        current.cols === next.cols && current.rows === next.rows ? current : next,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, [boxRef, cellPx]);

  useEffect(() => {
    const state = scene.current;
    const draw = () => {
      const frame = renderAsciiFrame({ ...grid, shape, ramp, light, time: state.time });
      state.frame = frame;
      const text = xray ? frame.buckets : frame.lines;
      rowRefs.current.forEach((row, index) => {
        if (row && row.textContent !== text[index]) row.textContent = text[index] ?? "";
      });
      state.tick += 1;
      if (xray && state.tick % 4 === 1) listeners.current.onCounts?.(frame.counts);
    };

    draw();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!playing || !isIntersecting || reduced) return;

    let handle = 0;
    let last = performance.now();
    let pending = 0;
    const loop = (now: number) => {
      pending += now - last;
      last = now;
      if (pending >= FRAME_MS) {
        state.time += Math.min(pending, 200) / 1000;
        pending = 0;
        draw();
      }
      handle = requestAnimationFrame(loop);
    };
    handle = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(handle);
  }, [grid, shape, ramp, light, xray, playing, isIntersecting]);

  const probe = (event: PointerEvent<HTMLPreElement>) => {
    if (!xray) return;
    // The rows are centred in the screen: the first one's box is the grid's origin.
    const origin = rowRefs.current[0]?.getBoundingClientRect();
    if (!origin) return;
    const col = Math.floor((event.clientX - origin.left) / (cellPx * CELL_ASPECT));
    const row = Math.floor((event.clientY - origin.top) / cellPx);
    if (col < 0 || row < 0 || col >= grid.cols || row >= grid.rows) {
      listeners.current.onProbe?.(null);
      return;
    }
    const luminance = scene.current.frame.luminance[row * grid.cols + col] ?? -1;
    listeners.current.onProbe?.({
      col,
      row,
      luminance,
      bucket: luminance < 0 ? -1 : bucketOf(ramp, luminance),
    });
  };

  return (
    <div
      ref={boxRef}
      className={styles.screen}
      data-palette={palette}
      data-xray={xray || undefined}
    >
      <pre
        className={styles.text}
        style={assignInlineVars({ [styles.cellSize]: `${cellPx}px` })}
        aria-hidden="true"
        onPointerMove={probe}
        onPointerLeave={() => listeners.current.onProbe?.(null)}
      >
        {Array.from({ length: grid.rows }, (_, index) => (
          <span
            // A row is its position on the screen.
            // oxlint-disable-next-line react/no-array-index-key
            key={index}
            ref={(element) => {
              rowRefs.current[index] = element;
            }}
            className={styles.row}
          >
            {INITIAL.lines[index] ?? ""}
          </span>
        ))}
      </pre>
    </div>
  );
}
