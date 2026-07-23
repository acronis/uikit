import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LineChart, dropBandSeries } from '../line-chart';
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
  props: Partial<React.ComponentProps<typeof LineChart>> = {}
) {
  return render(
    <LineChart
      config={config}
      data={data}
      dataKeys={['desktop', 'mobile']}
      xKey="month"
      {...props}
    />
  );
}

describe('LineChart', () => {
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

  it('defaults to a monotone, solid curve/line-style', () => {
    const { container } = renderChart();
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('data-curve', 'monotone');
    expect(root).toHaveAttribute('data-line-style', 'solid');
  });

  it('reflects the curve and lineStyle variants on the root', () => {
    const { container } = renderChart({ curve: 'step', lineStyle: 'dashed' });
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('data-curve', 'step');
    expect(root).toHaveAttribute('data-line-style', 'dashed');
  });

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the grid/tooltip/legend
  // toggles can't be asserted on the rendered chrome here. This exercises the
  // toggle + stroke/dot prop paths (guarding against a plumbing/crash
  // regression); the visual effect of the chrome toggles is covered by the
  // `NoChrome` VR story.
  it('renders with all chrome toggles off, dots off, and dashed strokes', () => {
    const { container } = renderChart({
      showGrid: false,
      showTooltip: false,
      showLegend: false,
      showDots: false,
      lineStyle: 'dashed',
      connectNulls: true,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders without crashing on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // The dashed/dimmed comparison styling is SVG that happy-dom won't paint, so
  // it's covered by the ComparisonTrend VR story; this guards the prop path
  // (a comparison overlay renders without crashing).
  it('renders with a comparison overlay series', () => {
    const { container } = renderChart({ comparisonKeys: ['mobile'] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders with a delta band between two series', () => {
    const { container } = renderChart({
      comparisonKeys: ['mobile'],
      deltaBands: [['desktop', 'mobile']],
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // The delta-band tooltip/legend content callbacks route their payload through
  // dropBandSeries to hide the synthetic `__band_*` range series. recharts won't
  // paint that content in happy-dom, so the filter is guarded here directly — an
  // inverted predicate would otherwise ship silently.
  describe('dropBandSeries', () => {
    const real = [{ dataKey: 'thisYear' }, { dataKey: 'lastYear' }];

    it('drops synthetic band series while keeping real series in order', () => {
      const payload = [real[0], { dataKey: '__band_0' }, real[1]];
      expect(dropBandSeries(payload)).toEqual(real);
    });

    it('keeps every series when none is a band series', () => {
      expect(dropBandSeries(real)).toEqual(real);
    });

    it('handles a numeric or missing dataKey without dropping it', () => {
      const payload = [{ dataKey: 0 }, { dataKey: undefined }];
      expect(dropBandSeries(payload)).toEqual(payload);
    });

    it('returns undefined for an undefined payload', () => {
      expect(dropBandSeries(undefined)).toBeUndefined();
    });
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
