import type { LabSource, LabSourceRef } from "./labs.types";

/** A reference resolved to lines of one source: 1-based, inclusive. */
export interface LabLineRange {
  sourceIndex: number;
  from: number;
  to: number;
}

/** Resolves a text-anchored reference against the experiment's sources; undefined when it misses. */
export function resolveSourceRef(
  sources: readonly LabSource[],
  ref: LabSourceRef,
): LabLineRange | undefined {
  const sourceIndex = sources.findIndex((source) => source.label === ref.source);
  if (sourceIndex === -1) return undefined;

  const lines = sources[sourceIndex].code.split("\n");
  const fromIndex = lines.findIndex((line) => line.includes(ref.from));
  if (fromIndex === -1) return undefined;

  if (ref.to === undefined) return { sourceIndex, from: fromIndex + 1, to: fromIndex + 1 };

  const offset = lines.slice(fromIndex).findIndex((line) => line.includes(ref.to as string));
  if (offset === -1) return undefined;
  return { sourceIndex, from: fromIndex + 1, to: fromIndex + offset + 1 };
}

/** `L293–309`, or `L70` for a single line. */
export function formatLineRange({ from, to }: LabLineRange): string {
  return from === to ? `L${from}` : `L${from}–${to}`;
}

export interface LabTextPart {
  text: string;
  code: boolean;
}

/** Splits a note's body on backticks: odd parts are code. */
export function splitCode(body: string): LabTextPart[] {
  return body
    .split("`")
    .map((text, index) => ({ text, code: index % 2 === 1 }))
    .filter((part) => part.text.length > 0);
}
