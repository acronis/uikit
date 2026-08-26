import * as React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  PieChart,
  pieChartLabelText,
  pieChartValuePercentRow,
} from '../pie-chart';
import { ChartTooltipContent, type ChartConfig,
  resolveAnimation,
} from '../../chart';
import { giveEveryChartASize } from '../../chart/__tests__/chart-layout';

// The slices, labels, legend and centre text are painted SVG/DOM, which recharts
// skips entirely at 0×0.
giveEveryChartASize();

const data = [
  { browser: 'Chrome', value: 275 },
  { browser: 'Safari', value: 200 },
  { browser: 'Firefox', value: 187 },
];

const config = {
  Chrome: { label: 'Chrome' },
  Safari: { label: 'Safari' },
  Firefox: { label: 'Firefox' },
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

const slicesOf = (container: Element) => [
  ...container.querySelectorAll<SVGPathElement>('.recharts-sector'),
];

/**
 * The geometry recharts baked into a slice: its arc runs `M <start> A r,r,…
 * <end> L <centre> Z`, so the radius, both arc endpoints and the pie's centre
 * are all readable off the one `d`.
 */
const arcOf = (slice: SVGPathElement) => {
  const [startX, startY, radius, , , , , endX, endY, cx, cy] = slice
    .getAttribute('d')!
    .match(/-?[\d.]+/g)!
    .map(Number);
  return { startX, startY, radius, endX, endY, cx, cy };
};

/** How wide a slice sweeps, in degrees — the angle its arc spans at the centre. */
const sweepOf = (slice: SVGPathElement) => {
  const { startX, startY, endX, endY, cx, cy } = arcOf(slice);
  // SVG y grows downward, so a clockwise sweep runs *down* in atan2 terms.
  const start = Math.atan2(startY - cy, startX - cx);
  const end = Math.atan2(endY - cy, endX - cx);
  return (((start - end) * 180) / Math.PI + 360) % 360;
};

const dataLabelsOf = (container: Element) =>
  [...container.querySelectorAll('.recharts-label-list text')].map(
    (label) => label.textContent
  );

/** Every `<text>` recharts painted — the centre label lives outside the list. */
const svgTextOf = (container: Element) =>
  [...container.querySelectorAll('svg text')].map((text) => text.textContent);

describe('PieChart', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each slice color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-Chrome: var(--ui-dataviz-categorical-1)');
    expect(style).toContain('--color-Safari: var(--ui-dataviz-categorical-2)');
  });

  it('defaults to a donut shape', () => {
    const { container } = renderChart();
    expect(container.firstElementChild).toHaveAttribute('data-shape', 'donut');
  });

  it('renders a filled pie when shape="pie"', () => {
    const { container } = renderChart({ shape: 'pie' });
    expect(container.firstElementChild).toHaveAttribute('data-shape', 'pie');
  });

  it('draws one slice per row, filled from its config color', () => {
    const { container } = renderChart();
    expect(
      slicesOf(container).map((slice) => slice.getAttribute('fill'))
    ).toEqual([
      'var(--color-Chrome)',
      'var(--color-Safari)',
      'var(--color-Firefox)',
    ]);
  });

  it('drops the legend when its toggle is off', () => {
    const { container } = renderChart({
      shape: 'donut',
      showTooltip: false,
      showLegend: false,
      paddingAngle: 2,
    });
    expect(container.querySelector('.recharts-legend-wrapper')).toBeNull();
    expect(slicesOf(container)).toHaveLength(3);
  });

  it('labels the legend from config', () => {
    const { container } = renderChart();
    // Legend is rendered externally (not inside recharts chrome).
    expect(container.querySelector('.recharts-legend-wrapper')).toBeNull();
    expect(container.textContent).toContain('Chrome');
    expect(container.textContent).toContain('Safari');
    expect(container.textContent).toContain('Firefox');
  });

  it('draws no slices but still mounts on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    expect(slicesOf(container)).toHaveLength(0);
  });

  it('renders the center label inside a donut hole', () => {
    const { container } = renderChart({
      shape: 'donut',
      centerLabel: { value: '835', label: 'Visitors' },
    });
    const texts = svgTextOf(container);
    expect(texts).toContain('835');
    expect(texts).toContain('Visitors');
  });

  // A filled pie has no hole to put it in, so the prop is dropped rather than
  // painted over the slices.
  it('ignores centerLabel for a pie shape', () => {
    const { container } = renderChart({
      shape: 'pie',
      centerLabel: { value: '835', label: 'Visitors' },
    });
    const texts = svgTextOf(container);
    expect(texts).not.toContain('835');
    expect(texts).not.toContain('Visitors');
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

  // The preset is reached the way a user reaches it — recharts only renders the
  // wired-in content element once a slice is hovered.
  it('renders the value-percent tooltip preset on hover', () => {
    const { container } = renderChart({ tooltipFormat: 'value-percent' });
    fireEvent.mouseOver(slicesOf(container)[0]);
    // 275 of 662 — the default row prints the bare value, this one its share too.
    expect(
      container.querySelector('.recharts-tooltip-wrapper')
    ).toHaveTextContent('275 (41.5%)');
  });
});

// The motion itself is a visual-regression concern; what matters here is that
// `animate` resolves to the reduced-motion-aware value rather than a literal
// `true`, and that turning it on still paints every slice.
describe('PieChart animation and data labels', () => {
  it('is not animated unless asked', () => {
    expect(resolveAnimation({})).toEqual({ isAnimationActive: false });
  });

  it('resolves animate to "auto" so prefers-reduced-motion is honored', () => {
    expect(
      resolveAnimation({ animate: true, animationDuration: 800 })
    ).toEqual({ isAnimationActive: 'auto', animationDuration: 800 });
  });

  it('still draws every slice with the full animation prop set', async () => {
    const { container } = renderChart({
      animate: true,
      animationDuration: 400,
      animationBegin: 50,
      animationEasing: 'ease-in-out',
    });
    await waitFor(() => expect(slicesOf(container)).toHaveLength(3));
  });

  it('runs the data labels through the caller formatter', () => {
    const { container } = renderChart({
      showLabels: true,
      labelFormatter: (value) => `${value} u`,
    });
    expect(dataLabelsOf(container)).toEqual(['275 u', '200 u', '187 u']);
  });

  it('honors an explicit labelPosition override', () => {
    const outside = renderChart({ showLabels: true });
    const outsideY = [
      ...outside.container.querySelectorAll('.recharts-label-list text'),
    ].map((label) => label.getAttribute('y'));
    outside.unmount();

    const inside = renderChart({
      showLabels: true,
      labelPosition: 'insideEnd',
    });
    const insideY = [
      ...inside.container.querySelectorAll('.recharts-label-list text'),
    ].map((label) => label.getAttribute('y'));
    expect(insideY).not.toEqual(outsideY);
  });
});

// The label text is the one piece of the slice-label work that doesn't need a
// laid-out chart, so it's asserted directly. `total` is the sum of every slice
// value (275 + 200 + 187 = 662 for the fixture above).
describe('pieChartLabelText', () => {
  const base = { name: 'Chrome', value: 275, total: 662 } as const;

  it('renders the raw value by default', () => {
    expect(pieChartLabelText({ ...base, format: 'value' })).toBe('275');
  });

  it('pairs the name with the value', () => {
    expect(pieChartLabelText({ ...base, format: 'name-value' })).toBe(
      'Chrome: 275'
    );
  });

  it('pairs the name with the share of the total', () => {
    expect(pieChartLabelText({ ...base, format: 'name-percent' })).toBe(
      'Chrome: 41.5%'
    );
  });

  it('renders the share alone', () => {
    expect(pieChartLabelText({ ...base, format: 'percent' })).toBe('41.5%');
  });

  it('formats only the numeric part, so labels match the value axis', () => {
    expect(
      pieChartLabelText({
        ...base,
        format: 'name-value',
        formatter: (value) => `${value} users`,
      })
    ).toBe('Chrome: 275 users');
  });

  // The formatter formats a *value*, so the two percent formats never route
  // through it — a share is always `NN.N%`. Guards the documented contract.
  it('leaves the percent formats untouched by the formatter', () => {
    const formatter = (value: number | string) => `${value} users`;
    expect(
      pieChartLabelText({ ...base, format: 'percent', formatter })
    ).toBe('41.5%');
    expect(
      pieChartLabelText({ ...base, format: 'name-percent', formatter })
    ).toBe('Chrome: 41.5%');
  });

  // A zero total (all-zero or non-numeric data) would divide to NaN; the two
  // percent formats degrade instead of printing it.
  it('drops the percent when there is nothing to divide by', () => {
    expect(
      pieChartLabelText({ name: 'Chrome', value: 0, total: 0, format: 'percent' })
    ).toBe('');
    expect(
      pieChartLabelText({
        name: 'Chrome',
        value: 0,
        total: 0,
        format: 'name-percent',
      })
    ).toBe('Chrome');
  });

  it('passes a non-numeric value through as text', () => {
    expect(
      pieChartLabelText({ name: 'Chrome', value: 'n/a', total: 662, format: 'value' })
    ).toBe('n/a');
  });

  // The other half of the percent contract: a share needs a numeric value *and*
  // a non-zero total. A non-numeric value degrades even when the total is fine.
  it('drops the percent for a non-numeric value even with a usable total', () => {
    expect(
      pieChartLabelText({
        name: 'Chrome',
        value: 'n/a',
        total: 662,
        format: 'percent',
      })
    ).toBe('');
    expect(
      pieChartLabelText({
        name: 'Chrome',
        value: 'n/a',
        total: 662,
        format: 'name-percent',
      })
    ).toBe('Chrome');
  });

  // A row that carries no `dataKey` field at all — the data type permits it, so
  // every format has to degrade rather than print a dangling "Chrome: ".
  it('degrades to the bare name (or nothing) when the row has no value', () => {
    const missing = { name: 'Chrome', value: undefined, total: 662 } as const;
    expect(pieChartLabelText({ ...missing, format: 'value' })).toBe('');
    expect(pieChartLabelText({ ...missing, format: 'name-value' })).toBe('Chrome');
    expect(pieChartLabelText({ ...missing, format: 'name-percent' })).toBe('Chrome');
    expect(pieChartLabelText({ ...missing, format: 'percent' })).toBe('');
  });
});

// The row the `value-percent` preset installs is a plain formatter of
// (value, name, item) returning ordinary JSX, so its own cases are asserted
// here rather than through a hovered chart — that only covers the wiring.
describe('pieChartValuePercentRow', () => {
  const total = 662;
  const item = {
    payload: { browser: 'Chrome', value: 275, fill: 'rgb(23 99 207)' },
    color: 'rgb(23 99 207)',
  } as unknown as Parameters<ReturnType<typeof pieChartValuePercentRow>>[2];

  function renderRow(
    value: number | string,
    name: string,
    rowConfig: ChartConfig = config
  ) {
    const row = pieChartValuePercentRow({ config: rowConfig, total });
    return render(<>{row(value, name, item, 0, [])}</>);
  }

  it("reads a slice as its value and its share of the total", () => {
    const { container } = renderRow(275, 'Chrome');
    expect(container.textContent).toContain('275 (41.5%)');
  });

  it('labels the row from config, falling back to the raw name', () => {
    expect(renderRow(275, 'Chrome').container.textContent).toContain('Chrome');
    // Edge is absent from `config` — the row still names the slice.
    expect(renderRow(173, 'Edge').container.textContent).toContain('Edge');
  });

  it('paints the swatch from the slice fill', () => {
    const { container } = renderRow(275, 'Chrome');
    const swatch = container.querySelector('div[style]');
    expect(swatch).toHaveStyle({ backgroundColor: 'rgb(23 99 207)' });
  });

  // The shared default row prefers a config icon over the swatch; the preset has
  // to agree, or turning on `tooltipFormat` would silently drop the icon.
  it('renders a config icon in place of the swatch', () => {
    const { container } = renderRow(275, 'Chrome', {
      Chrome: {
        label: 'Chrome',
        icon: () => <svg data-testid="slice-icon" />,
      },
    });
    expect(container.querySelector('[data-testid="slice-icon"]')).toBeInTheDocument();
    expect(container.querySelector('div[style]')).not.toBeInTheDocument();
  });

  it('falls back to the value alone when there is no share to show', () => {
    const row = pieChartValuePercentRow({ config, total: 0 });
    const { container } = render(<>{row(275, 'Chrome', item, 0, [])}</>);
    expect(container.textContent).toContain('275');
    expect(container.textContent).not.toContain('%');
  });
});

describe('PieChart geometry, slices and chrome', () => {
  // A half sweep is the semicircle preset; the arcs must actually stop halfway
  // rather than quietly closing the circle.
  it('sweeps only the arc the start/end angles describe', () => {
    const full = renderChart();
    const fullFirst = slicesOf(full.container)[0].getAttribute('d');
    full.unmount();

    const half = renderChart({ startAngle: 180, endAngle: 0 });
    const halfSlices = slicesOf(half.container);
    expect(halfSlices).toHaveLength(3);
    expect(halfSlices[0].getAttribute('d')).not.toBe(fullFirst);
  });

  // A slice worth a fraction of a percent draws as a hairline nobody can hover;
  // `minAngle` is the floor that keeps it reachable, at the cost of drawing it
  // out of proportion.
  it('widens a hairline slice to the minAngle floor', () => {
    const lopsided = [...data.slice(0, 2), { browser: 'Firefox', value: 1 }];

    const unfloored = renderChart({ data: lopsided, paddingAngle: 0, startAngle: 0, endAngle: 360, shape: 'pie' });
    expect(sweepOf(slicesOf(unfloored.container)[2])).toBeLessThan(1);
    unfloored.unmount();

    const floored = renderChart({ data: lopsided, minAngle: 30, paddingAngle: 0, startAngle: 0, endAngle: 360, shape: 'pie' });
    expect(sweepOf(slicesOf(floored.container)[2])).toBeGreaterThanOrEqual(30);
  });

  // The component uses a fixed outerRadius default, so margin no longer affects
  // the arc radius. It still insets the recharts plot area, which is observable
  // as the clip rect's offset and dimensions.
  it('insets the plot area by the margin the caller reserves', () => {
    const { container } = renderChart({
      margin: { top: 40, right: 40, bottom: 40, left: 40 },
    });
    const plotArea = container.querySelector('clipPath rect');
    expect(plotArea).toHaveAttribute('x', '40');
    expect(plotArea).toHaveAttribute('y', '40');
  });

  // `cornerRadius` rounds each slice tip, which recharts draws as extra arc
  // commands — a squared slice has strictly fewer of them.
  it('rounds the slice corners when cornerRadius asks for it', () => {
    const squared = renderChart();
    const squaredArcs = (
      slicesOf(squared.container)[0].getAttribute('d')!.match(/A/g) ?? []
    ).length;
    squared.unmount();

    const rounded = renderChart({ cornerRadius: 6, paddingAngle: 2 });
    const roundedArcs = (
      slicesOf(rounded.container)[0].getAttribute('d')!.match(/A/g) ?? []
    ).length;
    expect(roundedArcs).toBeGreaterThan(squaredArcs);
  });

  it('overrides one slice color without touching the others', () => {
    const { container } = renderChart({
      sliceSettings: { Chrome: { color: 'rgb(0 0 0)' } },
    });
    expect(
      slicesOf(container).map((slice) => slice.getAttribute('fill'))
    ).toEqual([
      'rgb(0 0 0)',
      'var(--color-Safari)',
      'var(--color-Firefox)',
    ]);
  });

  it('applies the chart-wide label format and the per-slice overrides', () => {
    const { container } = renderChart({
      showLabels: true,
      labelFormat: 'name-percent',
      sliceSettings: {
        Safari: { hideLabel: true },
        Firefox: { labelFormat: 'value' },
      },
    });
    const labels = dataLabelsOf(container);
    // Safari opts out; Chrome keeps the chart-wide name+percent; Firefox
    // overrides down to the bare value.
    expect(labels).toHaveLength(2);
    expect(labels[0]).toMatch(/^Chrome.*%$/);
    expect(labels[1]).toBe('187');
  });

  // With `labelLine` on, the labels move off the position-aware `LabelList` onto
  // recharts' own outside-placement path — so they are the only text in the SVG
  // — and a slice that opted out gets neither a label nor a line.
  it('draws a leader line per labelled slice only', () => {
    const { container } = renderChart({
      showLabels: true,
      labelLine: true,
      labelFormat: 'name-value',
      sliceSettings: { Safari: { hideLabel: true } },
    });
    expect(svgTextOf(container)).toEqual(['Chrome: 275', 'Firefox: 187']);
    expect(
      container.querySelectorAll('.recharts-pie-label-line')
    ).toHaveLength(2);
  });

  it('always renders the legend as an external list beside the chart', () => {
    const { container } = renderChart({ shape: 'donut', showLegend: true });
    // Legend is external — no recharts built-in legend wrapper in the SVG.
    expect(container.querySelector('.recharts-legend-wrapper')).toBeNull();
    // Slice labels from config appear in the external panel.
    expect(container.textContent).toContain('Chrome');
    expect(container.textContent).toContain('Safari');
  });
});
