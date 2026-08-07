import { afterEach, beforeEach, onTestFinished, vi } from 'vitest';

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
let originalGetBoundingClientRect: Element['getBoundingClientRect'] | null =
  null;
let originalResizeObserver: typeof globalThis.ResizeObserver | undefined;

function install() {
  if (installed) return;
  installed = true;

  originalResizeObserver = globalThis.ResizeObserver;
  vi.stubGlobal('ResizeObserver', SizedResizeObserver);
  const original = Element.prototype.getBoundingClientRect;
  originalGetBoundingClientRect = original;
  Element.prototype.getBoundingClientRect = function (this: Element) {
    return this.classList?.contains('recharts-responsive-container')
      ? CHART_RECT
      : original.call(this);
  };
}

function restore() {
  if (!installed) return;
  installed = false;

  if (originalGetBoundingClientRect) {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    originalGetBoundingClientRect = null;
  }
  // Restoring the one global this helper stubbed, rather than
  // `vi.unstubAllGlobals()`: this runs as an `afterEach` in every chart suite,
  // so the blanket form would also tear down a `vi.stubGlobal` the calling test
  // made for its own reasons.
  vi.stubGlobal('ResizeObserver', originalResizeObserver);
  originalResizeObserver = undefined;
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
 * same test (a loop that renders one chart per case) re-stubs nothing — that
 * would capture this wrapper as its own "original" — though each call does queue
 * its own teardown, and the second one finds the patches already lifted.
 */
export function giveTheChartASize() {
  install();
  onTestFinished(restore);
}

/**
 * Suite-level form of `giveTheChartASize`, for a file where every case renders a
 * laid-out chart — including the ones that call `render()` directly instead of
 * going through a shared `renderChart` helper. Call it once at the top of the
 * file; it registers its own `beforeEach`/`afterEach`, so the size is in place
 * whichever way a case renders and is torn down between cases either way.
 */
export function giveEveryChartASize() {
  beforeEach(install);
  afterEach(restore);
}

/**
 * The tick elements recharts painted for one cartesian axis, in document order.
 *
 * Selected by recharts' own `orientation` attribute rather than by descending
 * from `.recharts-xAxis` / `.recharts-yAxis`, because as of recharts 3.8 a tick
 * is not inside its axis group at all: the labels are hoisted into a separate
 * top-level `recharts-zIndex-layer_*` that is a *sibling* of the axis. So
 * `.recharts-xAxis .recharts-text` matches nothing and `axis.contains(tick)` is
 * false — and a test written the obvious way passes vacuously instead of
 * asserting anything. (Descendant selectors themselves are fine here; `svg text`
 * and `clipPath rect` both work.)
 *
 * `'x'` and `'y'` mean *both* axes of that dimension, so on a chart with a
 * secondary scale they return the two axes' ticks concatenated. Pass a single
 * side (`'left'`, `'right'`, `'top'`, `'bottom'`) to assert against one of them
 * — the orientation attribute is the only thing separating them.
 *
 * An empty result means "no tick carried that orientation", which is also what
 * you get if a recharts upgrade stops emitting the attribute. Assert a length
 * before looping, or a broken selector reads as a chart with no ticks.
 */
export type ChartAxisSide = 'left' | 'right' | 'top' | 'bottom';

export function axisTicks(
  container: Element,
  axis: 'x' | 'y' | ChartAxisSide
): Element[] {
  const sides =
    axis === 'x'
      ? ['bottom', 'top']
      : axis === 'y'
        ? ['left', 'right']
        : [axis];
  return [
    ...container.querySelectorAll('.recharts-cartesian-axis-tick-value'),
  ].filter((tick) => sides.includes(tick.getAttribute('orientation') ?? ''));
}

/** Text of every tick on one cartesian axis — see `axisTicks` for the caveats. */
export function axisTickLabels(
  container: Element,
  axis: 'x' | 'y' | ChartAxisSide
): (string | null)[] {
  return axisTicks(container, axis).map((tick) => tick.textContent);
}
