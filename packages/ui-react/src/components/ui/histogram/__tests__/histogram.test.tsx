import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Histogram, computeHistogramBins } from '../histogram';
import { ChartTooltipContent, type ChartConfig } from '../../chart';

const config = {
  count: { label: 'Frequency', color: 'rgb(23 99 207)' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof Histogram>> = {}
) {
  return render(
    <Histogram
      config={config}
      values={[1, 2, 2, 3, 3, 3, 4, 4, 5, 6, 7, 8, 9, 10]}
      {...props}
    />
  );
}

describe('Histogram', () => {
  // Axis visibility + tick formatting forward to recharts' XAxis/YAxis `hide` /
  // `tickFormatter`. happy-dom can't lay out recharts ticks (the visuals are
  // covered by the axis VR stories), so assert it renders cleanly.
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

  it('wires the series color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-count: rgb(23 99 207)');
  });

  it('renders with the grid/tooltip toggled off and a custom binCount', () => {
    const { container } = renderChart({
      showGrid: false,
      showTooltip: false,
      binCount: 5,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders without crashing on empty values', () => {
    const { container } = renderChart({ values: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // Axis titles/unit forward to recharts' XAxis/YAxis `label`/`unit`; happy-dom
  // doesn't paint the SVG, so this only guards the prop path (the rendered titles
  // are covered by the `AxisLabels` VR story).
  it('renders with axis titles + a Y unit', () => {
    const { container } = renderChart({
      xAxisLabel: 'Value range',
      yAxisLabel: 'Frequency',
      yUnit: 'k',
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
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

describe('computeHistogramBins', () => {
  it('returns [] for empty values or a non-positive binCount', () => {
    expect(computeHistogramBins([], 10)).toEqual([]);
    expect(computeHistogramBins([1, 2, 3], 0)).toEqual([]);
  });

  it('splits the data range into equal-width bins that sum to the sample count', () => {
    const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const bins = computeHistogramBins(values, 5);
    expect(bins).toHaveLength(5);
    expect(bins[0]).toMatchObject({ x0: 0, x1: 2, label: '0–2' });
    expect(bins[4].x1).toBe(10); // last bin closes on the max
    expect(bins.reduce((sum, b) => sum + b.count, 0)).toBe(values.length);
  });

  it('puts the max value in the last bin (inclusive upper edge)', () => {
    const bins = computeHistogramBins([0, 10], 2);
    expect(bins[1].count).toBe(1); // the 10 lands in the last bin, not dropped
    expect(bins[0].count).toBe(1);
  });

  it('honors an explicit domain and drops out-of-range values', () => {
    const bins = computeHistogramBins([-5, 0, 5, 10, 15], 2, [0, 10]);
    // -5 and 15 are outside [0,10] → dropped; 0,5,10 counted
    expect(bins.reduce((sum, b) => sum + b.count, 0)).toBe(3);
  });

  it('normalizes an inverted domain ([max, min])', () => {
    const asc = computeHistogramBins([0, 5, 10], 2, [0, 10]);
    const inv = computeHistogramBins([0, 5, 10], 2, [10, 0]);
    expect(inv.map((b) => b.count)).toEqual(asc.map((b) => b.count));
    expect(inv.reduce((sum, b) => sum + b.count, 0)).toBe(3);
  });

  it('widens a zero-width range (all values equal) into one usable bin', () => {
    const bins = computeHistogramBins([5, 5, 5], 1);
    expect(bins).toHaveLength(1);
    expect(bins[0].count).toBe(3);
    expect(bins[0].x1).toBeGreaterThan(bins[0].x0);
  });

  it('ignores non-finite values', () => {
    const bins = computeHistogramBins([1, NaN, 2, Infinity, 3], 3);
    expect(bins.reduce((sum, b) => sum + b.count, 0)).toBe(3);
  });
});
