import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PieChart } from '../pie-chart';
import type { ChartConfig } from '../../chart';

const data = [
  { browser: 'Chrome', value: 275 },
  { browser: 'Safari', value: 200 },
  { browser: 'Firefox', value: 187 },
];

const config = {
  Chrome: { label: 'Chrome', color: 'rgb(23 99 207)' },
  Safari: { label: 'Safari', color: 'rgb(220 53 69)' },
  Firefox: { label: 'Firefox', color: 'rgb(34 139 79)' },
} satisfies ChartConfig;

function renderChart(props: Partial<React.ComponentProps<typeof PieChart>> = {}) {
  return render(
    <PieChart
      config={config}
      data={data}
      dataKey="value"
      nameKey="browser"
      {...props}
    />
  );
}

describe('PieChart', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each slice color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-Chrome: rgb(23 99 207)');
    expect(style).toContain('--color-Safari: rgb(220 53 69)');
  });

  it('defaults to a pie shape', () => {
    const { container } = renderChart();
    expect(container.firstElementChild).toHaveAttribute('data-shape', 'pie');
  });

  it('reflects the donut shape variant on the root', () => {
    const { container } = renderChart({ shape: 'donut' });
    expect(container.firstElementChild).toHaveAttribute('data-shape', 'donut');
  });

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the tooltip/legend toggles
  // can't be asserted on the rendered chrome here. This exercises the toggle +
  // donut/padding prop paths (guarding against a plumbing/crash regression); the
  // visual effect of the chrome toggles is covered by the `NoChrome` VR story.
  it('renders as a donut with chrome toggled off', () => {
    const { container } = renderChart({
      shape: 'donut',
      showTooltip: false,
      showLegend: false,
      paddingAngle: 2,
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
    const { container } = renderChart({ className: 'h-[300px] w-[300px]' });
    expect(container.firstElementChild).toHaveClass('h-[300px]', 'w-[300px]');
  });
});
