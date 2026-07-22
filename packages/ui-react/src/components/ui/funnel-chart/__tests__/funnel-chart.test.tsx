import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FunnelChart } from '../funnel-chart';
import type { ChartConfig } from '../../chart';

const data = [
  { stage: 'Visits', value: 5000 },
  { stage: 'Signups', value: 2600 },
  { stage: 'Trials', value: 1400 },
  { stage: 'Purchases', value: 620 },
];

const config = {
  Visits: { label: 'Visits', color: 'rgb(23 99 207)' },
  Signups: { label: 'Signups', color: 'rgb(34 139 79)' },
  Trials: { label: 'Trials', color: 'rgb(212 149 42)' },
  Purchases: { label: 'Purchases', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof FunnelChart>> = {}
) {
  return render(
    <FunnelChart
      config={config}
      data={data}
      dataKey="value"
      nameKey="stage"
      {...props}
    />
  );
}

describe('FunnelChart', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each stage color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-Visits: rgb(23 99 207)');
    expect(style).toContain('--color-Purchases: rgb(220 53 69)');
  });

  it('defaults to a triangle last shape', () => {
    const { container } = renderChart();
    expect(container.firstElementChild).toHaveAttribute(
      'data-last-shape',
      'triangle'
    );
  });

  it('reflects the rectangle last-shape variant on the root', () => {
    const { container } = renderChart({ lastShape: 'rectangle' });
    expect(container.firstElementChild).toHaveAttribute(
      'data-last-shape',
      'rectangle'
    );
  });

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the segments/labels/chrome
  // can't be asserted here. This exercises the reversed + chrome-toggle + labels
  // prop paths against a plumbing/crash regression; the visual output is covered
  // by the VR stories.
  it('renders reversed with labels off and the tooltip off', () => {
    const { container } = renderChart({
      reversed: true,
      showLabels: false,
      showTooltip: false,
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
    const { container } = renderChart({ className: 'h-[360px] w-[420px]' });
    expect(container.firstElementChild).toHaveClass('h-[360px]', 'w-[420px]');
  });
});
