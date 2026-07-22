import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ScatterChart } from '../scatter-chart';
import type { ChartConfig } from '../../chart';

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

  it('forwards a ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    renderChart({ ref });
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a caller className onto the root', () => {
    const { container } = renderChart({ className: 'h-[300px] w-[500px]' });
    expect(container.firstElementChild).toHaveClass('h-[300px]', 'w-[500px]');
  });
});
