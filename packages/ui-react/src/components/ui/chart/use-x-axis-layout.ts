import * as React from 'react';

import { resolveXAxisHeight } from './chart-format';

export type XAxisLayout = {
  height: number | undefined;
  margin: { left?: number; right?: number } | undefined;
};

type ChartMargin = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

type MeasuredXAxisLayout = {
  height: number;
  margin: { left?: number; right?: number };
};

const RECHARTS_DEFAULT_MARGIN = { top: 5, right: 5, bottom: 5, left: 5 } as const;

/**
 * Add the measured endpoint clearance without turning recharts' per-side
 * defaults into zeroes. Recharts applies its 5px defaults only when the whole
 * margin prop is absent, so a partial left/right margin must be completed here.
 */
export function mergeXAxisLayoutMargin(
  baseMargin: ChartMargin | undefined,
  xAxisMargin: XAxisLayout['margin']
): ChartMargin | undefined {
  if (!xAxisMargin) return baseMargin;

  const margin = {
    top: baseMargin?.top ?? RECHARTS_DEFAULT_MARGIN.top,
    right: baseMargin?.right ?? RECHARTS_DEFAULT_MARGIN.right,
    bottom: baseMargin?.bottom ?? RECHARTS_DEFAULT_MARGIN.bottom,
    left: baseMargin?.left ?? RECHARTS_DEFAULT_MARGIN.left,
  };

  return {
    ...margin,
    left: margin.left + (xAxisMargin?.left ?? 0),
    right: margin.right + (xAxisMargin?.right ?? 0),
  };
}

/**
 * Fits a rotated X-axis tick row to the geometry that recharts actually
 * rendered. Estimating from character count leaves conspicuous empty space for
 * narrow glyphs and short endpoint labels; measuring the SVG lets the axis use
 * precisely the room its labels need.
 */
export function useXAxisLayout(
  containerRef: React.RefObject<HTMLElement | null>,
  angle: number | undefined,
  label: string | undefined,
  layoutKey: string
): XAxisLayout {
  const fallbackHeight = resolveXAxisHeight(label, angle);
  const [layout, setLayout] = React.useState<MeasuredXAxisLayout>({
    height: fallbackHeight ?? 0,
    margin: {},
  });

  React.useLayoutEffect(() => {
    setLayout({ height: fallbackHeight ?? 0, margin: {} });
  }, [fallbackHeight, layoutKey]);

  React.useLayoutEffect(() => {
    if (angle == null) return;

    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const surface = container.querySelector<SVGSVGElement>('.recharts-surface');
      const ticks = Array.from(
        container.querySelectorAll<SVGTextElement>(
          '.recharts-xAxis-tick-labels text'
        )
      );
      if (!surface || !ticks.length) return;

      const surfaceBounds = surface.getBoundingClientRect();
      if (!surfaceBounds.width || !surfaceBounds.height) return;

      const tickBounds = ticks.map((tick) => tick.getBoundingClientRect());
      const left = Math.min(...tickBounds.map((bounds) => bounds.left));
      const right = Math.max(...tickBounds.map((bounds) => bounds.right));
      const bottom = Math.max(...tickBounds.map((bounds) => bounds.bottom));
      const legendBounds = container
        .querySelector<HTMLElement>('.recharts-legend-wrapper')
        ?.getBoundingClientRect();
      // Recharts' legend is absolutely positioned inside the same responsive
      // area. It can therefore overlap labels well before the SVG's own lower
      // edge. Keep a small, intentional gap to it rather than making the tick
      // row consume every pixel down to that edge.
      const bottomBoundary = Math.min(
        surfaceBounds.bottom,
        legendBounds ? legendBounds.top - 8 : surfaceBounds.bottom
      );

      setLayout((current) => {
        const leftOverflow = Math.ceil(Math.max(0, surfaceBounds.left - left));
        const rightOverflow = Math.ceil(Math.max(0, right - surfaceBounds.right));
        const nextLeft = Math.max(
          0,
          (current.margin.left ?? 0) +
            (leftOverflow ? leftOverflow + 16 : 0)
        );
        const nextRight = Math.max(
          0,
          (current.margin.right ?? 0) +
            (rightOverflow ? rightOverflow + 16 : 0)
        );
        // The bottom of the surface is the X-axis allocation boundary. The
        // measured distance tells us how much of the provisional height is
        // unused (or how much is still missing), rather than guessing from a
        // string's character count.
        const minimumHeight = fallbackHeight ?? 0;
        const nextHeight = Math.max(
          minimumHeight,
          Math.ceil(current.height - (bottomBoundary - bottom))
        );
        const nextMargin =
          nextLeft || nextRight
            ? { left: nextLeft || undefined, right: nextRight || undefined }
            : {};
        if (
          current.height === nextHeight &&
          current.margin.left === nextMargin.left &&
          current.margin.right === nextMargin.right
        ) {
          return current;
        }
        return { height: nextHeight, margin: nextMargin };
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [angle, containerRef, fallbackHeight, layoutKey]);

  return {
    height: layout.height || undefined,
    margin:
      layout.margin.left || layout.margin.right ? layout.margin : undefined,
  };
}
