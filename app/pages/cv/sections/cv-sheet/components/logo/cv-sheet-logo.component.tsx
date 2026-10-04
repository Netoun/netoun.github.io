import { useEffect, useRef } from "react";
import { LOGO_ASCII } from "@/features/skills/data/logo-ascii";

// Doto's advance is 0.6em: a cell is 0.6 × 1 em, so the disc prints round.
const CELL = 16;
const ADVANCE = CELL * 0.6;
const COLUMNS = Math.max(...LOGO_ASCII.map((line) => line.length));

interface CvSheetLogoProps {
  className?: string;
}

/**
 * The fetch readout's ASCII favicon, painted on a canvas rather than typed: a résumé parser
 * would read 25 lines of "netounnetoun". Painted once Doto has loaded; without JS the cell
 * stays blank, which costs the page nothing it needs.
 */
export function CvSheetLogo({ className }: CvSheetLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let isCancelled = false;
    const font = `800 ${CELL}px Doto`;
    void document.fonts.load(font).then(() => {
      if (isCancelled) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = font;
      context.textBaseline = "top";
      context.fillStyle = getComputedStyle(canvas).color;
      LOGO_ASCII.forEach((line, row) => {
        [...line].forEach((char, column) => {
          if (char !== " ") context.fillText(char, column * ADVANCE, row * CELL);
        });
      });
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      width={Math.ceil(COLUMNS * ADVANCE)}
      height={LOGO_ASCII.length * CELL}
      aria-hidden="true"
    />
  );
}
