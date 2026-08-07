import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Histogram, computeHistogramBins } from '../histogram';
import { ChartTooltipContent, type ChartConfig,
  resolveAnimation,
} from '../../chart';
import {
  axisTickLabels,
  axisTicks,
  giveEveryChartASize,
} from '../../chart/__tests__/chart-layout';

// The bars, bin ticks and grid asserted below are painted SVG, which recharts
// skips entirely at 0×0.
giveEveryChartASize();

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

const barsOf = (container: Element) => [
  ...container.querySelectorAll<SVGPathElement>('.recharts-bar-rectangle path'),
];

/** `[x, width]` of a bar, read back off its rendered rectangle path. */
const geometryOf = (bar: SVGPathElement) => {
  const [, x, , width] = bar.getAttribute('d')!.match(/M (\S+),(\S+) h (\S+)/)!;
  return { x: Number(x), width: Number(width) };
};

describe('Histogram', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires the series color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-count: rgb(23 99 207)');
  });

  it('draws one bar per bin and re-bins when binCount changes', () => {
    const { container, unmount } = renderChart({ binCount: 5 });
    expect(barsOf(container)).toHaveLength(5);
    unmount();

    const wider = renderChart({ binCount: 8 });
    expect(barsOf(wider.container)).toHaveLength(8);
  });

  // The bin edges are the component's own output, so the axis reading them back
  // is what proves the binning reached the chart rather than just the helper.
  it('labels the category axis with the computed bin ranges', () => {
    const { container } = renderChart({ binCount: 5 });
    expect(axisTickLabels(container, 'x')).toEqual([
      '1–2.8',
      '2.8–4.6',
      '4.6–6.4',
      '6.4–8.2',
      '8.2–10',
    ]);
  });

  // Contiguous bars are what distinguish a histogram from a BarChart: any
  // category gap would leave the distribution reading as separate categories.
  it('butts the bars against each other with no category gap', () => {
    const { container } = renderChart({ binCount: 5 });
    const geometry = barsOf(container).map(geometryOf);
    for (let i = 1; i < geometry.length; i += 1) {
      expect(geometry[i].x).toBeCloseTo(
        geometry[i - 1].x + geometry[i - 1].width,
        1
      );
    }
  });

  // The hairline is what keeps neighbouring bars legible now that they touch.
  it('separates the bars with a surface-colored hairline', () => {
    const { container } = renderChart();
    const bar = barsOf(container)[0];
    expect(bar).toHaveAttribute('fill', 'var(--color-count)');
    expect(bar).toHaveAttribute(
      'stroke',
      'var(--ui-background-surface-primary)'
    );
  });

  it('rounds the bar tops only when barRadius asks for it', () => {
    const squared = renderChart();
    expect(barsOf(squared.container)[0].getAttribute('d')).not.toMatch(/[aA]/);
    squared.unmount();

    const rounded = renderChart({ barRadius: 4 });
    expect(barsOf(rounded.container)[0].getAttribute('d')).toMatch(/[aA]/);
  });

  it('draws nothing but still mounts on empty values', () => {
    const { container } = renderChart({ values: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    expect(barsOf(container)).toHaveLength(0);
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

  // The tooltip is hover-only, so this guards the prop path — consumers
  // customize the tooltip without importing recharts.
  it('accepts a custom tooltipContent', () => {
    const { container } = renderChart({
      tooltipContent: (
        <ChartTooltipContent formatter={(value) => <span>{String(value)}</span>} />
      ),
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});

describe('Histogram axes and grid', () => {
  it('hides an axis without dropping the other', () => {
    const { container } = renderChart({ showXAxis: false, showYAxis: true });
    expect(container.querySelector('.recharts-xAxis')).toBeNull();
    expect(container.querySelector('.recharts-yAxis')).not.toBeNull();
  });

  it('runs tick values through the caller formatter', () => {
    const { container } = renderChart({
      yTickFormatter: (value) => `$${value}`,
    });
    const ticks = axisTickLabels(container, 'y');
    expect(ticks.length).toBeGreaterThan(0);
    for (const tick of ticks) expect(tick).toMatch(/^\$/);
  });

  it('appends the Y unit to every tick', () => {
    const { container } = renderChart({ yUnit: 'k' });
    const ticks = axisTickLabels(container, 'y');
    expect(ticks.length).toBeGreaterThan(0);
    for (const tick of ticks) expect(tick).toMatch(/k$/);
  });

  // Frequencies are counts, so a fractional tick would be meaningless — the
  // component pins `allowDecimals={false}` for exactly that reason.
  it('keeps the frequency axis on whole numbers', () => {
    const { container } = renderChart({ yAxisTickCount: 4 });
    for (const tick of axisTickLabels(container, 'y')) {
      expect(tick).toMatch(/^\d+$/);
    }
  });

  it('anchors rotated ticks on the side they lean towards', () => {
    const { container } = renderChart({ xAxisAngle: -45 });
    expect(axisTicks(container, 'x')[0]).toHaveAttribute('text-anchor', 'end');
  });

  it('renders the axis titles as their own labels', () => {
    const { container } = renderChart({
      xAxisLabel: 'Value range',
      yAxisLabel: 'Frequency',
    });
    const titles = [...container.querySelectorAll('.recharts-label')].map(
      (label) => label.textContent
    );
    expect(titles).toContain('Value range');
    expect(titles).toContain('Frequency');
  });

  // A distribution reads off the frequency axis, so the vertical rules that
  // would box each bin are off unless the caller asks for them.
  it('defaults to horizontal grid rules only', () => {
    const { container } = renderChart();
    expect(
      container.querySelectorAll('.recharts-cartesian-grid-horizontal line')
        .length
    ).toBeGreaterThan(0);
    expect(
      container.querySelectorAll('.recharts-cartesian-grid-vertical line')
    ).toHaveLength(0);
  });

  it('dashes the grid on request', () => {
    const { container } = renderChart({ gridDashed: true });
    expect(
      container.querySelector('.recharts-cartesian-grid-horizontal line')
    ).toHaveAttribute('stroke-dasharray', '3 3');
  });

  it('drops the grid when its toggle is off', () => {
    const { container } = renderChart({ showGrid: false, showTooltip: false });
    expect(container.querySelector('.recharts-cartesian-grid')).toBeNull();
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

// The motion itself is a visual-regression concern; what matters here is that
// `animate` resolves to the reduced-motion-aware value rather than a literal
// `true`, and that turning it on still paints the full set of bars.
describe('Histogram animation', () => {
  it('is not animated unless asked', () => {
    expect(resolveAnimation({})).toEqual({ isAnimationActive: false });
  });

  it('resolves animate to "auto" so prefers-reduced-motion is honored', () => {
    expect(
      resolveAnimation({ animate: true, animationDuration: 800 })
    ).toEqual({ isAnimationActive: 'auto', animationDuration: 800 });
  });

  // An animated series is painted after `animationBegin` rather than on the
  // first render, so the bars have to be waited for — asserting synchronously
  // would just measure the delay.
  it('still draws every bin with the full animation prop set', async () => {
    const { container } = renderChart({
      binCount: 5,
      animate: true,
      animationDuration: 400,
      animationBegin: 50,
      animationEasing: 'ease-in-out',
    });
    await waitFor(() => expect(barsOf(container)).toHaveLength(5));
  });
});
