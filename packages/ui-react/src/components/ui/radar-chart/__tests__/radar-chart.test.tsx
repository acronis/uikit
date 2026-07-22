import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RadarChart } from '../radar-chart';
import type { ChartConfig } from '../../chart';

const data = [
  { subject: 'Math', alice: 120, bob: 110 },
  { subject: 'English', alice: 86, bob: 130 },
  { subject: 'Physics', alice: 85, bob: 90 },
  { subject: 'History', alice: 65, bob: 85 },
];

const config = {
  alice: { label: 'Alice', color: 'rgb(23 99 207)' },
  bob: { label: 'Bob', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof RadarChart>> = {}
) {
  return render(
    <RadarChart
      config={config}
      data={data}
      dataKeys={['alice', 'bob']}
      angleKey="subject"
      {...props}
    />
  );
}

describe('RadarChart', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each series color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-alice: rgb(23 99 207)');
    expect(style).toContain('--color-bob: rgb(220 53 69)');
  });

  it('defaults to a polygon grid', () => {
    const { container } = renderChart();
    expect(container.firstElementChild).toHaveAttribute(
      'data-grid-type',
      'polygon'
    );
  });

  it('reflects the circle grid-type variant on the root', () => {
    const { container } = renderChart({ gridType: 'circle' });
    expect(container.firstElementChild).toHaveAttribute(
      'data-grid-type',
      'circle'
    );
  });

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the web/series/chrome can't
  // be asserted here. This exercises the dots + chrome-toggle prop paths against
  // a plumbing/crash regression; the visual output is covered by the VR stories.
  it('renders with dots on and the grid/tooltip/legend toggled off', () => {
    const { container } = renderChart({
      showDots: true,
      showGrid: false,
      showTooltip: false,
      showLegend: false,
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
    const { container } = renderChart({ className: 'h-[360px] w-[360px]' });
    expect(container.firstElementChild).toHaveClass('h-[360px]', 'w-[360px]');
  });
});
