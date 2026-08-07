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
 * Call it inside the test, before rendering. Cleanup is registered automatically,
 * so no `afterEach` is needed at the call site.
 *
 * Note the whole document reports this size, the legend included — so a chart
 * whose legend is shown gets its plot area measured away to nothing. Render with
 * `showLegend={false}` when the assertion is about geometry.
 */
export function giveTheChartASize() {
  vi.stubGlobal('ResizeObserver', SizedResizeObserver);
  const original = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function () {
    return {
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
  };
  onTestFinished(() => {
    Element.prototype.getBoundingClientRect = original;
    vi.unstubAllGlobals();
  });
}
