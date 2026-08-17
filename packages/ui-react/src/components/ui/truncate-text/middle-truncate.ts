// The pure search behind `<TruncateText mode="middle">`: given a string, a pixel budget, and a
// way to measure a candidate's rendered width, find the longest start+end slice
// (joined by an ellipsis) that still fits — preserving both ends of the string
// rather than just the start, which is what a plain CSS end-ellipsis already does
// and is useless for a URL, hash or path whose distinguishing part is at the tail.
//
// Binary search over "how many non-ellipsis characters to keep", not over the split
// point between start/end — the split is always the same proportion (kept chars
// divided evenly, the extra one going to the start on an odd count), so there is
// exactly one candidate per kept-count and `measure` is called O(log n) times
// rather than O(n). `measure` is injected rather than hard-coded to
// `canvas.measureText` specifically so this file has no DOM dependency: the real
// component supplies a canvas-backed measurer (see `truncate-text.tsx`), and
// these tests supply a deterministic fake — jsdom has no layout engine, so a test
// asserting real pixel widths would need the browser project for no benefit here,
// the search logic does not care what "width" means.

export interface MiddleTruncateOptions {
  /** Returns the rendered width of `candidate`, in the same unit as `maxWidth`. */
  readonly measure: (candidate: string) => number;
  /** Inserted between the kept start and end slices. Defaults to `'…'`. */
  readonly ellipsis?: string;
}

/**
 * Returns `text` unchanged if it already fits `maxWidth`, otherwise the widest
 * start+ellipsis+end slice that does. Never returns something wider than
 * `maxWidth`, even when nothing meaningful fits — the degenerate result is the
 * bare ellipsis, or `''` if `maxWidth` cannot fit that either.
 */
export function middleTruncate(
  text: string,
  maxWidth: number,
  { measure, ellipsis = '…' }: MiddleTruncateOptions
): string {
  if (maxWidth <= 0) return '';
  if (measure(text) <= maxWidth) return text;

  const ellipsisWidth = measure(ellipsis);
  if (ellipsisWidth > maxWidth) return '';

  const candidateFor = (kept: number): string => {
    if (kept <= 0) return ellipsis;
    const startLen = Math.ceil(kept / 2);
    const endLen = kept - startLen;
    return endLen > 0
      ? `${text.slice(0, startLen)}${ellipsis}${text.slice(text.length - endLen)}`
      : `${text.slice(0, startLen)}${ellipsis}`;
  };

  // Invariant: `low` is always a kept-count that fits (0 does, by the ellipsis
  // check above); `high` is always one that does not (`text.length` does not, by
  // the "already fits" check above). The loop halves the gap until they meet,
  // so `low` ends on the largest fitting count.
  let low = 0;
  let high = text.length;
  while (high - low > 1) {
    const mid = Math.floor((low + high) / 2);
    if (measure(candidateFor(mid)) <= maxWidth) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return candidateFor(low);
}
