import { vi } from 'vitest';

// recharts' ResponsiveContainer measures its box through a ResizeObserver, which
// happy-dom never fires — so a chart renders at 0×0 and every SVG child bails
// out (`<Brush>` returns null for a non-positive width/height, series draw no
// path). Feeding it a size is what makes the rendered SVG observable in a unit
// test at all; without it the only honest assertion left is "the chart root
// exists", which passes with or without the feature under test.
//
// Shared by the chart test files that need real geometry (the range brush, the
// reference lines, per-series stroke/dot styling).

export const CHART_WIDTH = 600;
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

let restoreRect: (() => void) | undefined;

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

/**
 * Stub the layout APIs recharts measures, so it paints its SVG in happy-dom.
 *
 * `ResponsiveContainer` reads `getBoundingClientRect()` once on mount and then
 * follows the observer, so both have to be stubbed. Two details matter:
 *
 * - happy-dom implements the rect on `HTMLElement.prototype`, which shadows
 *   `Element.prototype` — patching only the latter leaves the chart at recharts'
 *   -1 sentinel size, drawing nothing at all.
 * - Only the responsive container may report the size. recharts also measures
 *   the legend wrapper; if that reported the full height too, it would claim the
 *   whole plot area and the series would again render at zero height.
 */
export function giveTheChartASize() {
  vi.stubGlobal('ResizeObserver', SizedResizeObserver);
  const patched = [Element.prototype, HTMLElement.prototype].map((proto) => {
    const original = proto.getBoundingClientRect;
    proto.getBoundingClientRect = function (this: Element) {
      return this.classList?.contains('recharts-responsive-container')
        ? CHART_RECT
        : original.call(this);
    };
    return () => {
      proto.getBoundingClientRect = original;
    };
  });
  restoreRect = () => {
    for (const restore of patched) restore();
  };
}

/** Undo `giveTheChartASize` — call from `afterEach`. */
export function restoreTheChartSize() {
  restoreRect?.();
  restoreRect = undefined;
  vi.unstubAllGlobals();
}
