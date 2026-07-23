import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ConfidenceCone } from '../confidence-cone';
import type { ChartConfig } from '../../chart';

const data = [
  { month: 'Jan', actual: 100 },
  { month: 'Feb', actual: 120 },
  { month: 'Mar', actual: 150, forecast: 150, lower: 150, upper: 150 },
  { month: 'Apr', forecast: 162, lower: 150, upper: 176 },
  { month: 'May', forecast: 175, lower: 154, upper: 200 },
];

const config = {
  actual: { label: 'Actual', color: 'rgb(23 99 207)' },
  forecast: { label: 'Forecast', color: 'rgb(240 160 30)' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof ConfidenceCone>> = {}
) {
  return render(
    <ConfidenceCone
      config={config}
      data={data}
      xKey="month"
      actualKey="actual"
      forecastKey="forecast"
      lowerKey="lower"
      upperKey="upper"
      {...props}
    />
  );
}

describe('ConfidenceCone', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires the actual + forecast colors from config into --color-* custom properties', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-actual: rgb(23 99 207)');
    expect(style).toContain('--color-forecast: rgb(240 160 30)');
  });

  it('renders with chrome toggled off', () => {
    const { container } = renderChart({
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

  it('renders when bound fields are missing (no cone band)', () => {
    const { container } = renderChart({
      data: [
        { month: 'Jan', actual: 100 },
        { month: 'Feb', actual: 120 },
      ],
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
});
