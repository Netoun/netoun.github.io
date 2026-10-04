// `_❯` as Doto would draw it, one dot per cell. Drawn, not typed: a résumé parser reads the PDF's
// text, and the prompt is decoration.
const DOTS: [number, number][] = [
  [0, 6],
  [1, 6],
  [2, 6],
  [3, 6],
  [5, 1],
  [6, 2],
  [7, 3],
  [6, 4],
  [5, 5],
];

interface CvSheetPromptProps {
  className?: string;
}

export function CvSheetPrompt({ className }: CvSheetPromptProps) {
  return (
    <svg className={className} viewBox="-0.5 -0.5 9 7" aria-hidden="true" focusable="false">
      {DOTS.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={0.42} />
      ))}
    </svg>
  );
}
