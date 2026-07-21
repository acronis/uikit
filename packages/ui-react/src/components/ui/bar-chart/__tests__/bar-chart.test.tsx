import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BarChart } from '../bar-chart';
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

function renderChart(props: Partial<React.ComponentProps<typeof BarChart>> = {}) {
  return render(
    <BarChart
      config={config}
      data={data}
      dataKeys={['desktop', 'mobile']}
      xKey="month"
      {...props}
    />
  );
}

describe('BarChart', () => {
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

  it('defaults to a vertical, grouped orientation/layout', () => {
    const { container } = renderChart();
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('data-orientation', 'vertical');
    expect(root).toHaveAttribute('data-layout', 'grouped');
  });

  it('reflects the orientation and layout variants on the root', () => {
    const { container } = renderChart({
      orientation: 'horizontal',
      layout: 'stacked',
    });
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('data-orientation', 'horizontal');
    expect(root).toHaveAttribute('data-layout', 'stacked');
  });

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the grid/tooltip/legend
  // toggles can't be asserted on the rendered chrome here. This exercises the
  // toggle + barRadius prop paths (guarding against a plumbing/crash regression);
  // the visual effect of the chrome toggles is covered by the `NoChrome` VR story.
  it('renders with all chrome toggles off and a squared barRadius', () => {
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
