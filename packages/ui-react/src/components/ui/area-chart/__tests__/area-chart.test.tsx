import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AreaChart } from '../area-chart';
import type { ChartConfig } from '../../chart';

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
