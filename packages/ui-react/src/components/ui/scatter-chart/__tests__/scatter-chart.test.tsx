import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ScatterChart } from '../scatter-chart';
import { ChartTooltipContent, type ChartConfig,
  resolveAnimation,
} from '../../chart';

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
  classA: { label: 'Class A', color: 'rgb(23 99 207)' },
  classB: { label: 'Class B', color: 'rgb(220 53 69)' },
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

describe('ScatterChart', () => {
  // Axis visibility + tick formatting forward to recharts' XAxis/YAxis `hide` /
  // `tickFormatter`. happy-dom can't lay out recharts ticks (the visuals are
  // covered by the axis-formatting VR stories), so assert it renders cleanly.
  it('renders with axis/grid config and tick formatters', () => {
    const { container } = renderChart({
      showXAxis: false,
      showYAxis: true,
      yTickFormatter: (value) => `$${value}`,
      xAxisAngle: -45,
      xAxisInterval: 'preserveStartEnd',
      yAxisTickCount: 4,
      yAxisDomain: 'zero',
      gridDashed: true,
      gridHorizontal: true,
      gridVertical: false,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each series color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-classA: rgb(23 99 207)');
    expect(style).toContain('--color-classB: rgb(220 53 69)');
  });

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the axes/points/chrome
  // can't be asserted here. These exercise the prop paths (bubble via zKey,
  // chrome toggles, marker shape) against a plumbing/crash regression; the
  // visual output is covered by the VR stories.
  it('renders as a bubble chart (zKey) with a custom marker shape', () => {
    const { container } = renderChart({
      zKey: 'weight',
      zRange: [50, 300],
      shape: 'triangle',
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders with all chrome toggles off', () => {
    const { container } = renderChart({
      showGrid: false,
      showTooltip: false,
      showLegend: false,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders without crashing on empty series', () => {
    const { container } = renderChart({ series: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // Axis titles/units forward to recharts' XAxis/YAxis `label`/`unit`; happy-dom
  // doesn't paint the SVG, so this only guards the prop path (the rendered titles
  // are covered by the `AxisLabels` VR story) — both axes are numeric here.
  it('renders with axis titles + units on both axes', () => {
    const { container } = renderChart({
      xAxisLabel: 'Spend',
      yAxisLabel: 'Conversions',
      xUnit: '$',
      yUnit: '%',
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('forwards a ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    renderChart({ ref });
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a caller className onto the root', () => {
    const { container } = renderChart({ className: 'h-[300px] w-[500px]' });
    expect(container.firstElementChild).toHaveClass('h-[300px]', 'w-[500px]');
  });

  // The `tooltipContent` prop forwards a custom (library-owned) ChartTooltipContent
  // to recharts' Tooltip; happy-dom doesn't paint the tooltip, so this only guards
  // the prop path — consumers customize the tooltip without importing recharts.
  it('accepts a custom tooltipContent', () => {
    const { container } = renderChart({
      tooltipContent: (
        <ChartTooltipContent formatter={(value) => <span>{String(value)}</span>} />
      ),
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

});

// recharts needs a laid-out container, which happy-dom does not provide, so the
// rendered labels/animation are covered by the visual-regression stories. These
// assert the prop contract itself: the composition accepts every new prop and
// mounts, and the animation resolves to the reduced-motion-aware value rather
// than a literal `true`.
describe('ScatterChart animation and data labels', () => {
  it('is not animated unless asked', () => {
    expect(resolveAnimation({})).toEqual({ isAnimationActive: false });
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('resolves animate to "auto" so prefers-reduced-motion is honored', () => {
    expect(
      resolveAnimation({ animate: true, animationDuration: 800 })
    ).toEqual({ isAnimationActive: 'auto', animationDuration: 800 });
  });

  it('accepts the full animation prop set without throwing', () => {
    const { container } = renderChart({
      animate: true,
      animationDuration: 400,
      animationBegin: 50,
      animationEasing: 'ease-in-out',
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});
