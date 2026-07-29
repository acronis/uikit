import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ComposedChart } from '../composed-chart';
import { ChartTooltipContent, type ChartConfig } from '../../chart';

const data = [
  { month: 'Jan', revenue: 2400, profit: 1600, orders: 120 },
  { month: 'Feb', revenue: 1398, profit: 1200, orders: 98 },
  { month: 'Mar', revenue: 9800, profit: 4800, orders: 156 },
];

const config = {
  revenue: { label: 'Revenue', color: 'rgb(23 99 207)' },
  profit: { label: 'Profit', color: 'rgb(34 139 79)' },
  orders: { label: 'Orders', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

const series = [
  { key: 'revenue', type: 'bar' as const },
  { key: 'profit', type: 'area' as const },
  { key: 'orders', type: 'line' as const },
];

function renderChart(
  props: Partial<React.ComponentProps<typeof ComposedChart>> = {}
) {
  return render(
    <ComposedChart config={config} data={data} series={series} xKey="month" {...props} />
  );
}

describe('ComposedChart', () => {
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
    expect(style).toContain('--color-revenue: rgb(23 99 207)');
    expect(style).toContain('--color-profit: rgb(34 139 79)');
    expect(style).toContain('--color-orders: rgb(220 53 69)');
  });

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the bars/lines/areas/chrome
  // can't be asserted here. These exercise the prop paths (mixed series types,
  // curve, chrome toggles) against a plumbing/crash regression; the visual
  // output is covered by the VR stories.
  it('renders a mixed bar/line/area series set with a stepped curve', () => {
    const { container } = renderChart({ curve: 'step' });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders with all chrome toggles off and squared bars', () => {
    const { container } = renderChart({
      showGrid: false,
      showTooltip: false,
      showLegend: false,
      barRadius: 0,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders without crashing on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // Axis titles/unit forward to recharts' XAxis/YAxis `label`/`unit`; happy-dom
  // doesn't paint the SVG, so this only guards the prop path (the rendered titles
  // are covered by the `AxisLabels` VR story).
  it('renders with axis titles + a Y unit', () => {
    const { container } = renderChart({
      xAxisLabel: 'Month',
      yAxisLabel: 'Amount',
      yUnit: '$',
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
