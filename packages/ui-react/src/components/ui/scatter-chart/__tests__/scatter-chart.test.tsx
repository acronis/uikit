import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ScatterChart } from '../scatter-chart';
import { ChartTooltipContent, type ChartConfig,
  resolveAnimation,
} from '../../chart';
import {
  axisTickLabels,
  axisTicks,
  giveEveryChartASize,
} from '../../chart/__tests__/chart-layout';

// The axes, points and chrome asserted below are painted SVG, which recharts
// skips entirely at 0×0.
giveEveryChartASize();

const series = [
  {
    key: 'classA',
    data: [
      { hours: 2, score: 55, weight: 60 },
      { hours: 6, score: 78, weight: 85 },
    ],
  },
  {
    key: 'classB',
    data: [
      { hours: 3, score: 60, weight: 65 },
      { hours: 9, score: 95, weight: 98 },
    ],
  },
];

const config = {
  classA: { label: 'Class A' },
  classB: { label: 'Class B' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof ScatterChart>> = {}
) {
  return render(
    <ScatterChart
      config={config}
      series={series}
      xKey="hours"
      yKey="score"
      {...props}
    />
  );
}

const symbolsOf = (container: Element) => [
  ...container.querySelectorAll<SVGPathElement>('.recharts-symbols'),
];

describe('ScatterChart', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each series color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-classA: var(--ui-dataviz-diverging-teal-violet-a3)');
    expect(style).toContain('--color-classB: var(--ui-dataviz-diverging-teal-violet-a2)');
  });

  it('draws one point per row of every series, filled from its config color', () => {
    const { container } = renderChart();
    const symbols = symbolsOf(container);
    expect(symbols).toHaveLength(4);
    expect(symbols.map((point) => point.getAttribute('fill'))).toEqual([
      'var(--color-classA)',
      'var(--color-classA)',
      'var(--color-classB)',
      'var(--color-classB)',
    ]);
  });

  it('draws nothing but still mounts on empty series', () => {
    const { container } = renderChart({ series: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    expect(symbolsOf(container)).toHaveLength(0);
  });

  it('labels the legend from config rather than the series key', () => {
    const { container } = renderChart();
    const legend = container.querySelector('.recharts-legend-wrapper');
    expect(legend).toHaveTextContent('Class A');
    expect(legend).toHaveTextContent('Class B');
    expect(legend).not.toHaveTextContent('classA');
  });
});

describe('ScatterChart axes', () => {
  it('hides an axis without dropping the other', () => {
    const { container } = renderChart({ showXAxis: false, showYAxis: true });
    expect(container.querySelector('.recharts-xAxis')).toBeNull();
    expect(container.querySelector('.recharts-yAxis')).not.toBeNull();
  });

  it('runs tick values through the caller formatter', () => {
    const { container } = renderChart({
      yTickFormatter: (value) => `$${value}`,
    });
    const ticks = axisTickLabels(container, 'y');
    expect(ticks.length).toBeGreaterThan(0);
    for (const tick of ticks) expect(tick).toMatch(/^\$/);
  });

  // `unit` is recharts' own suffix, applied after the formatter — a regression
  // that dropped it would leave bare numbers on an axis the caller labelled.
  it('appends the axis unit to every tick', () => {
    const { container } = renderChart({ xUnit: '$', yUnit: '%' });
    const xTicks = axisTickLabels(container, 'x');
    const yTicks = axisTickLabels(container, 'y');
    expect(xTicks.length).toBeGreaterThan(0);
    expect(yTicks.length).toBeGreaterThan(0);
    for (const tick of xTicks) expect(tick).toMatch(/\$$/);
    for (const tick of yTicks) expect(tick).toMatch(/%$/);
  });

  it('anchors rotated ticks on the side they lean towards', () => {
    const negative = renderChart({ xAxisAngle: -45 });
    expect(axisTicks(negative.container, 'x')[0]).toHaveAttribute(
      'text-anchor',
      'end'
    );
    negative.unmount();

    const positive = renderChart({ xAxisAngle: 45 });
    expect(axisTicks(positive.container, 'x')[0]).toHaveAttribute(
      'text-anchor',
      'start'
    );
  });

  it('thins the value axis to the requested tick count', () => {
    const { container } = renderChart({ yAxisTickCount: 4 });
    expect(axisTickLabels(container, 'y')).toHaveLength(4);
  });

  // Both scales are numeric here, so the interval thins a tick row recharts
  // generated itself — only observable against the unthinned row.
  it('thins the X ticks through the caller interval', () => {
    const every = renderChart();
    expect(axisTickLabels(every.container, 'x')).toEqual([
      '0',
      '3',
      '6',
      '9',
      '12',
    ]);
    every.unmount();

    const thinned = renderChart({ xAxisInterval: 1 });
    expect(axisTickLabels(thinned.container, 'x')).toEqual(['0', '6', '12']);
  });

  // `zero` is also recharts' behavior for an unset domain, so the floor is only
  // observable against a preset that fits the data instead — the scores start
  // at 55, which `auto` rounds down to the nice tick below it.
  it('floors the Y domain at zero on request', () => {
    const fitted = renderChart({ yAxisDomain: 'auto' });
    expect(axisTickLabels(fitted.container, 'y')[0]).toBe('45');
    fitted.unmount();

    const floored = renderChart({ yAxisDomain: 'zero' });
    expect(axisTickLabels(floored.container, 'y')[0]).toBe('0');
  });

  it('renders the axis titles as their own labels', () => {
    const { container } = renderChart({
      xAxisLabel: 'Spend',
      yAxisLabel: 'Conversions',
    });
    const titles = [...container.querySelectorAll('.recharts-label')].map(
      (label) => label.textContent
    );
    expect(titles).toContain('Spend');
    expect(titles).toContain('Conversions');
  });
});

describe('ScatterChart chrome and markers', () => {
  it('drops the grid and the legend when their toggles are off', () => {
    const { container } = renderChart({
      showGrid: false,
      showTooltip: false,
      showLegend: false,
    });
    expect(container.querySelector('.recharts-cartesian-grid')).toBeNull();
    expect(container.querySelector('.recharts-legend-wrapper')).toBeNull();
  });

  it('renders dashed horizontal-only grid by default', () => {
    const { container } = renderChart();
    expect(
      container.querySelectorAll('.recharts-cartesian-grid-horizontal line').length
    ).toBeGreaterThan(0);
    expect(
      container.querySelectorAll('.recharts-cartesian-grid-vertical line')
    ).toHaveLength(0);
    expect(
      container.querySelector('.recharts-cartesian-grid-horizontal line')
    ).toHaveAttribute('stroke-dasharray', '3 3');
  });

  it('draws only the grid direction it was asked for', () => {
    const { container } = renderChart({
      gridHorizontal: true,
      gridVertical: false,
    });
    expect(
      container.querySelectorAll('.recharts-cartesian-grid-horizontal line')
        .length
    ).toBeGreaterThan(0);
    expect(
      container.querySelectorAll('.recharts-cartesian-grid-vertical line')
    ).toHaveLength(0);
  });

  it('restores vertical grid lines when gridVertical is true', () => {
    const { container } = renderChart({ gridVertical: true });
    expect(
      container.querySelectorAll('.recharts-cartesian-grid-vertical line').length
    ).toBeGreaterThan(0);
  });

  it('renders solid grid when gridDashed is false', () => {
    const { container } = renderChart({ gridDashed: false });
    expect(
      container.querySelector('.recharts-cartesian-grid-horizontal line')
    ).not.toHaveAttribute('stroke-dasharray');
  });

  // A shape recharts doesn't recognize silently falls back to a circle, so
  // identical geometry between two shapes is the failure to catch.
  it('draws distinct geometry for every marker shape', () => {
    const SHAPES = [
      'circle',
      'cross',
      'diamond',
      'square',
      'star',
      'triangle',
      'wye',
    ] as const;
    const drawn = SHAPES.map((shape) => {
      const { container, unmount } = renderChart({ shape });
      const d = symbolsOf(container)[0]?.getAttribute('d');
      unmount();
      expect(d).toBeTruthy();
      return d;
    });
    expect(new Set(drawn).size).toBe(SHAPES.length);
  });

  // Without `zKey` every point is the same size; mapping z is the whole point of
  // the bubble mode, so equal sizes here would mean the ZAxis never bound.
  it('sizes points from zKey across the zRange', () => {
    const flat = renderChart();
    const flatSizes = symbolsOf(flat.container).map((point) =>
      point.getAttribute('width')
    );
    expect(new Set(flatSizes).size).toBe(1);
    flat.unmount();

    const bubble = renderChart({ zKey: 'weight', zRange: [50, 300] });
    const sizes = symbolsOf(bubble.container).map((point) =>
      Number(point.getAttribute('width'))
    );
    expect(new Set(sizes).size).toBeGreaterThan(1);
    expect(Math.min(...sizes)).toBeLessThan(Math.max(...sizes));
  });
});

describe('ScatterChart props plumbing', () => {
  it('forwards a ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    renderChart({ ref });
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a caller className onto the root', () => {
    const { container } = renderChart({ className: 'h-[300px] w-[500px]' });
    expect(container.firstElementChild).toHaveClass('h-[300px]', 'w-[500px]');
  });

  // The tooltip is hover-only, so this guards the prop path — consumers
  // customize the tooltip without importing recharts.
  it('accepts a custom tooltipContent', () => {
    const { container } = renderChart({
      tooltipContent: (
        <ChartTooltipContent formatter={(value) => <span>{String(value)}</span>} />
      ),
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});

describe('ScatterChart animation', () => {
  it('is not animated unless asked', () => {
    expect(resolveAnimation({})).toEqual({ isAnimationActive: false });
  });

  it('resolves animate to "auto" so prefers-reduced-motion is honored', () => {
    expect(
      resolveAnimation({ animate: true, animationDuration: 800 })
    ).toEqual({ isAnimationActive: 'auto', animationDuration: 800 });
  });

  it('still draws every point with the full animation prop set', () => {
    const { container } = renderChart({
      animate: true,
      animationDuration: 400,
      animationBegin: 50,
      animationEasing: 'ease-in-out',
    });
    expect(symbolsOf(container)).toHaveLength(4);
  });
});
