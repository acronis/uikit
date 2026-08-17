// A single offscreen canvas, reused across every `<TruncateText mode="middle">` instance and
// every candidate it measures. `canvas.measureText` is O(1) per call — no layout,
// no reflow — which is why `middleTruncate`'s binary search calls `measure` a
// handful of times per resize without it being a performance concern the way a
// DOM-clone measurement (render, read `offsetWidth`, repeat per candidate) would
// be for a search space the size of a whole string.
let sharedContext: CanvasRenderingContext2D | null | undefined;

function getSharedContext(): CanvasRenderingContext2D | null {
  if (sharedContext === undefined) {
    sharedContext = document.createElement('canvas').getContext('2d');
  }
  return sharedContext;
}

/**
 * The rendered width of `text` in `font` (a CSS `font` shorthand string, e.g. from
 * `getComputedStyle(el).font`), in CSS pixels.
 *
 * Falls back to a fixed per-character estimate when `canvas` 2D contexts are
 * unavailable (jsdom's default; the real component is exercised by the browser
 * test project instead) — a rough width is enough to keep the search from
 * throwing, and nothing in the unit project renders far enough to compare it
 * against a pixel budget.
 */
export function measureTextWidth(text: string, font: string): number {
  const context = getSharedContext();
  if (context === null) return text.length * 8;
  context.font = font;
  return context.measureText(text).width;
}
