import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import * as styles from "./square-grid.css";

interface SquareGridProps {
  contentRef?: React.RefObject<HTMLDivElement | null>;
  squareSize?: number;
  animationDelay?: number;
  columns?: number;
  rows?: number;
}

interface RowState {
  filledCount: number;
  direction: "forward" | "backward";
  isAnimating: boolean;
}

export const SquareGrid = ({
  contentRef,
  squareSize = 12,
  animationDelay = 100,
  columns: fixedColumns,
  rows: fixedRows,
}: SquareGridProps) => {
  const [rows, setRows] = useState(fixedRows || 0);
  const [columns, setColumns] = useState(fixedColumns || 0);
  const [rowStates, setRowStates] = useState<RowState[]>([]);
  const timeoutRefsRef = useRef<Array<ReturnType<typeof setTimeout> | null>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const transitionScheduledRef = useRef(false);

  // Refs for stable comparison inside ResizeObserver — avoids re-subscription loop
  const prevColumnsRef = useRef(fixedColumns || 0);
  const prevRowsRef = useRef(fixedRows || 0);
  // Stable ref to current rows count, used inside setTimeout callbacks to avoid stale closure
  const rowsRef = useRef(rows);
  const columnsRef = useRef(columns);
  rowsRef.current = rows;
  columnsRef.current = columns;

  // Intersection observer to detect visibility
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  });

  // Sync intersection ref with container ref
  useEffect(() => {
    if (containerRef.current && intersectionRef.current !== containerRef.current) {
      (intersectionRef as React.MutableRefObject<HTMLDivElement | null>).current =
        containerRef.current;
    }
  }, [intersectionRef]);

  // Calculate grid dimensions based on container size (only if not fixed)
  useEffect(() => {
    if (fixedColumns !== undefined) {
      if (fixedColumns !== prevColumnsRef.current) {
        prevColumnsRef.current = fixedColumns;
        setColumns(fixedColumns);
      }
    }
    if (fixedRows !== undefined) {
      if (fixedRows !== prevRowsRef.current) {
        prevRowsRef.current = fixedRows;
        setRows(fixedRows);
      }
    }

    if (fixedColumns !== undefined && fixedRows !== undefined) {
      return;
    }

    const calculateGrid = () => {
      if (!contentRef?.current) return;

      const container = contentRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      if (fixedColumns === undefined) {
        const itemsPerRow = Math.floor(containerWidth / squareSize);
        if (itemsPerRow > 0 && itemsPerRow !== prevColumnsRef.current) {
          prevColumnsRef.current = itemsPerRow;
          setColumns(itemsPerRow);
        }
      }

      if (fixedRows === undefined) {
        const itemsPerCol = Math.floor(containerHeight / squareSize);
        if (itemsPerCol > 0 && itemsPerCol !== prevRowsRef.current) {
          prevRowsRef.current = itemsPerCol;
          setRows(itemsPerCol);
        }
      }
    };

    const timeoutId = setTimeout(calculateGrid, 0);
    const resizeObserver = new ResizeObserver(calculateGrid);
    if (contentRef?.current) resizeObserver.observe(contentRef.current);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [contentRef, squareSize, fixedColumns, fixedRows]);

  // Initialize row states when dimensions change
  useEffect(() => {
    if (rows === 0 || columns === 0) return;

    const initialStates: RowState[] = Array.from({ length: rows }, () => ({
      filledCount: 0,
      direction: "forward",
      isAnimating: false,
    }));

    setRowStates(initialStates);
  }, [rows, columns]);

  // Clear all timeouts
  const clearAllTimeouts = () => {
    timeoutRefsRef.current.forEach((timeout) => {
      if (timeout) {
        clearTimeout(timeout);
      }
    });
    timeoutRefsRef.current = [];
  };

  // Animate a single row
  const animateRow = (rowIndex: number, startIndex: number, direction: "forward" | "backward") => {
    // Use stable ref to avoid stale closure on rowStates.length
    if (rowIndex < 0 || rowIndex >= rowsRef.current) return;

    setRowStates((prevStates) => {
      const newStates = [...prevStates];
      const rowState = newStates[rowIndex];

      if (!rowState) return prevStates;

      if (direction === "forward") {
        rowState.filledCount = startIndex + 1;
      } else {
        rowState.filledCount = startIndex - 1;
      }

      rowState.direction = direction;
      rowState.isAnimating = true;

      return newStates;
    });

    const nextIndex = direction === "forward" ? startIndex + 1 : startIndex - 1;
    const isComplete = direction === "forward" ? nextIndex >= columnsRef.current : nextIndex < 0;

    if (!isComplete) {
      const timeoutId = setTimeout(() => {
        animateRow(rowIndex, nextIndex, direction);
      }, animationDelay);

      timeoutRefsRef.current.push(timeoutId);
    } else {
      setRowStates((prevStates) => {
        const newStates = [...prevStates];
        if (newStates[rowIndex]) {
          newStates[rowIndex].isAnimating = false;
        }
        return newStates;
      });
    }
  };

  // Start animation for all rows
  const startAnimation = (direction: "forward" | "backward" = "forward") => {
    clearAllTimeouts();
    transitionScheduledRef.current = false;

    for (let i = 0; i < rowsRef.current; i++) {
      const rowDelay = Math.random() * 50;
      const timeoutId = setTimeout(() => {
        if (direction === "forward") {
          animateRow(i, -1, "forward");
        } else {
          animateRow(i, columnsRef.current, "backward");
        }
      }, rowDelay);

      timeoutRefsRef.current.push(timeoutId);
    }
  };

  // Check if all rows are complete and reverse if needed
  useEffect(() => {
    if (rows === 0 || columns === 0) return;
    if (rowStates.length === 0) return;
    if (transitionScheduledRef.current) return;

    const allRowsComplete = rowStates.every((state) => !state.isAnimating);

    if (allRowsComplete && rowStates.length > 0) {
      const allFull = rowStates.every(
        (state) => state.filledCount === columns && state.direction === "forward",
      );
      const allEmpty = rowStates.every(
        (state) => state.filledCount === 0 && state.direction === "backward",
      );

      if (allFull) {
        transitionScheduledRef.current = true;
        const timeoutId = setTimeout(() => {
          startAnimation("backward");
        }, animationDelay * 2);
        timeoutRefsRef.current.push(timeoutId);
      } else if (allEmpty) {
        transitionScheduledRef.current = true;
        const timeoutId = setTimeout(() => {
          startAnimation("forward");
        }, animationDelay * 2);
        timeoutRefsRef.current.push(timeoutId);
      }
    }
  }, [rowStates, rows, columns, animationDelay]);

  // Start animation when component becomes visible
  useEffect(() => {
    if (isIntersecting && rows > 0 && columns > 0 && rowStates.length === rows) {
      const hasStarted = rowStates.some((state) => state.isAnimating);
      if (!hasStarted && !transitionScheduledRef.current) {
        startAnimation("forward");
      }
    } else if (!isIntersecting) {
      clearAllTimeouts();
      transitionScheduledRef.current = false;
    }

    return () => {
      clearAllTimeouts();
    };
  }, [isIntersecting, rows, columns, rowStates.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  const totalSquares = rows * columns;

  return (
    <div
      ref={containerRef}
      className={styles.squareGridContentStyles}
      style={
        {
          "--grid-columns": columns || 1,
          "--square-size": `${squareSize}px`,
        } as React.CSSProperties
      }
    >
      {Array.from({ length: totalSquares }, (_, index) => {
        const rowIndex = Math.floor(index / columns);
        const colIndex = index % columns;
        const rowState = rowStates[rowIndex];

        if (!rowState) {
          return (
            <div key={index} className={styles.squareGridItemStyles}>
              □
            </div>
          );
        }

        const isFilled =
          rowState.direction === "forward"
            ? colIndex < rowState.filledCount
            : colIndex >= rowState.filledCount;

        return (
          <div
            key={index}
            className={styles.squareGridItemStyles}
            data-filled={isFilled}
          >
            {isFilled ? "■" : "□"}
          </div>
        );
      })}
    </div>
  );
};
