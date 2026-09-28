export interface SectionsReadout {
  /** 0 → 1 along the track. */
  progress: number;
  /** Index of the section under the middle of the viewport. */
  activeIndex: number;
}

/**
 * Where the reader is along the sections. The anchor is the middle of the viewport: a section
 * is current once its top has crossed it. Progress is interpolated across the section tops,
 * not the raw page ratio, so the lit tip reaches an index exactly when its section becomes
 * current (with a raw ratio the footer would only light CONTACT in the last ~2% of scroll).
 * At the bottom of the page the last section is current and the track is full.
 */
export function readSections(
  tops: readonly number[],
  scrollY: number,
  viewportHeight: number,
  scrollMax: number,
): SectionsReadout {
  const lastIndex = tops.length - 1;
  if (lastIndex <= 0) return { progress: 1, activeIndex: 0 };
  if (scrollMax <= 0 || scrollY >= scrollMax - 2) return { progress: 1, activeIndex: lastIndex };

  const anchorY = scrollY + viewportHeight / 2;
  let index = 0;
  while (index < lastIndex && anchorY >= tops[index + 1]) index++;
  if (index >= lastIndex) return { progress: 1, activeIndex: lastIndex };

  const span = Math.max(1, tops[index + 1] - tops[index]);
  const t = Math.min(1, Math.max(0, (anchorY - tops[index]) / span));
  return { progress: (index + t) / lastIndex, activeIndex: index };
}
