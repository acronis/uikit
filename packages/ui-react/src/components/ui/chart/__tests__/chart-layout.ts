import { onTestFinished, vi } from 'vitest';

// Test-only helper (not collected as a suite, not part of the published entry
// points). Shared by the chart tests rather than copied into each one.

/** Width the faked layout reports to recharts. */
export const CHART_WIDTH = 600;
/** Height the faked layout reports to recharts. */
export const CHART_HEIGHT = 400;

class SizedResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {}
  observe(target: Element) {
    this.callback(
      [
        {
          target,
          contentRect: {
            width: CHART_WIDTH,
            height: CHART_HEIGHT,
          } as DOMRectReadOnly,
        } as ResizeObserverEntry,
      ],
      this as unknown as ResizeObserver
    );
  }
  unobserve() {}
  disconnect() {}
}

const CHART_RECT = {
  width: CHART_WIDTH,
  height: CHART_HEIGHT,
  top: 0,
  left: 0,
  right: CHART_WIDTH,
  bottom: CHART_HEIGHT,
  x: 0,
  y: 0,
  toJSON: () => ({}),
} as DOMRect;

let installed = false;

/**
 * Give recharts a laid-out container for the duration of the calling test.
 *
 * recharts' `ResponsiveContainer` measures its box through a `ResizeObserver`,
 * which happy-dom never fires, and reads `getBoundingClientRect()` once in its
 * effect — so by default the chart renders at 0×0 and every SVG child bails out.
 * Feeding it a size is what makes the axes, grid and series observable in a unit
 * test at all; without it the only honest assertion left is "the chart root
 * exists", which passes whether or not the feature works.
 *
 * Only the responsive container may report the size. recharts also measures the
 * legend wrapper; if that reported the full height too, it would claim the whole
 * plot area and the series would again render at zero height.
 *
 * happy-dom defines the rect once, on `Element.prototype` — patching that one
 * prototype covers every element type, and patching a subclass's prototype as
 * well would capture this wrapper as its own "original" and leave it installed
 * after the restore.
 *
 * Call it inside the test, before rendering. Cleanup is registered automatically,
 * so no `afterEach` is needed at the call site. Calling it more than once in the
 * same test (a loop that renders one chart per case) is a no-op — re-stubbing
 * would capture this wrapper as its own "original".
 */
export function giveTheChartASize() {
  if (installed) return;
  installed = true;

  vi.stubGlobal('ResizeObserver', SizedResizeObserver);
  const original = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function (this: Element) {
    return this.classList?.contains('recharts-responsive-container')
      ? CHART_RECT
      : original.call(this);
  };
  onTestFinished(() => {
    Element.prototype.getBoundingClientRect = original;
    vi.unstubAllGlobals();
    installed = false;
  });
}
