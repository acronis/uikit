import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AreaChart } from '../area-chart';
import { ChartTooltipContent, type ChartConfig } from '../../chart';

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
];

const config = {
  desktop: { label: 'Desktop', color: 'rgb(23 99 207)' },
  mobile: { label: 'Mobile', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof AreaChart>> = {}
) {
  return render(
    <AreaChart
      config={config}
      data={data}
      dataKeys={['desktop', 'mobile']}
      xKey="month"
      {...props}
    />
  );
}

describe('AreaChart', () => {
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
    expect(style).toContain('--color-desktop: rgb(23 99 207)');
    expect(style).toContain('--color-mobile: rgb(220 53 69)');
  });

  it('defaults to a single layout with a gradient fill', () => {
    const { container } = renderChart();
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('data-layout', 'single');
    expect(root).toHaveAttribute('data-fill', 'gradient');
  });

  it('reflects the layout and fill variants on the root', () => {
    const { container } = renderChart({ layout: 'stacked', fill: 'solid' });
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('data-layout', 'stacked');
    expect(root).toHaveAttribute('data-fill', 'solid');
  });

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the grid/tooltip/legend
  // toggles can't be asserted on the rendered chrome here. This exercises the
  // toggle + stroke/dot prop paths (guarding against a plumbing/crash
  // regression); the visual effect of the chrome toggles is covered by the
  // `NoChrome` VR story.
  it('renders with all chrome toggles off, dots off, and a solid fill', () => {
    const { container } = renderChart({
      showGrid: false,
      showTooltip: false,
      showLegend: false,
      showDots: false,
      fill: 'solid',
      connectNulls: true,
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
      yAxisLabel: 'Sessions',
      yUnit: 'k',
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
