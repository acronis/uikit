import * as React from 'react';
import { render } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';

import { BarChart as RechartsBarChart } from 'recharts';

import {
  BarChart,
  barChartCategoryRange,
  createTrackShape,
  dropHeadroomSeries,
  NormalizedTooltipContent,
  withSeriesColor,
} from '../bar-chart';
import { ChartContainer, ChartTooltipContent, type ChartConfig,
  resolveAnimation,
  resolveChartReferenceValue,
} from '../../chart';

beforeAll(() => {
  // happy-dom's ResizeObserver never reports a size, so recharts'
  // ResponsiveContainer renders nothing and its children never mount. The bar
  // styling below is per-bar SVG, so these tests need the real output.
  class SizedResizeObserver {
    constructor(private readonly callback: ResizeObserverCallback) {}
    observe(target: Element) {
      this.callback(
        [
          {
            target,
            contentRect: { width: 600, height: 300 },
          } as unknown as ResizeObserverEntry,
        ],
        this as unknown as ResizeObserver
      );
    }
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver =
    SizedResizeObserver as unknown as typeof ResizeObserver;
});

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
  // Axis visibility + tick formatting forward to recharts' XAxis/YAxis `hide` /
  // `tickFormatter`. happy-dom can't lay out recharts ticks (the visuals are
  // covered by the axis-formatting VR stories), so assert it renders cleanly.
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

  it('renders with a fixed reference line and an averaged reference line', () => {
    expect(
      renderChart({ referenceLine: { value: 150, label: 'Target' } }).container.querySelector(
        '[data-slot="chart"]'
      )
    ).toBeInTheDocument();
    expect(
      renderChart({ referenceLine: { average: true } }).container.querySelector(
        '[data-slot="chart"]'
      )
    ).toBeInTheDocument();
  });

  it('renders with an array of reference lines', () => {
    const { container } = renderChart({
      referenceLine: [{ value: 300, label: 'Target' }, { average: true }],
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // Axis titles/units forward to recharts' XAxis/YAxis `label`/`unit`; happy-dom
  // doesn't paint the SVG, so this only guards the prop path (the rendered titles
  // are covered by the `AxisLabels` VR story) — for both orientations.
  it('renders with axis titles + units in both orientations', () => {
    const axis = { xAxisLabel: 'Month', yAxisLabel: 'Sessions', yUnit: 'k', xUnit: '$' };
    const vertical = renderChart(axis);
    expect(
      vertical.container.querySelector('[data-slot="chart"]')
    ).toBeInTheDocument();
    const horizontal = renderChart({ ...axis, orientation: 'horizontal' });
    expect(
      horizontal.container.querySelector('[data-slot="chart"]')
    ).toBeInTheDocument();
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

  // The brush props are consumed here, not forwarded — dropping one from the
  // destructure would spread it onto the wrapper as an invalid DOM attribute.
  // The rendered strip itself is covered in `chart/__tests__/chart-brush.test.tsx`,
  // which stubs the layout recharts needs before it will draw a brush at all.
  it('consumes the range-brush props instead of forwarding them to the DOM', () => {
    const { container } = renderChart({
      showBrush: true,
      brushHeight: 40,
      brushAriaLabel: 'Range',
    });
    const wrapper = container.firstElementChild;
    expect(wrapper).not.toBeNull();
    expect(
      wrapper!.getAttributeNames().filter((name) => /brush/i.test(name))
    ).toEqual([]);
  });

});

// The resolver is shared with LineChart/AreaChart; BarChart is where its
// value/average contract is exercised against real bar data.
describe('resolveChartReferenceValue', () => {
  const keys = ['desktop', 'mobile'];

  it('returns undefined with no config', () => {
    expect(resolveChartReferenceValue(undefined, data, keys)).toBeUndefined();
  });

  it('returns a fixed value (including 0)', () => {
    expect(resolveChartReferenceValue({ value: 150 }, data, keys)).toBe(150);
    expect(resolveChartReferenceValue({ value: 0 }, data, keys)).toBe(0);
  });

  it('prefers a fixed value over average', () => {
    expect(
      resolveChartReferenceValue({ value: 42, average: true }, data, keys)
    ).toBe(42);
  });

  it('averages a single named series', () => {
    // desktop: (186 + 305 + 237) / 3
    expect(resolveChartReferenceValue({ average: 'desktop' }, data, keys)).toBeCloseTo(
      242.667,
      2
    );
  });

  it('averages every plotted series when average is true', () => {
    // (186+305+237 + 80+200+120) / 6 = 188
    expect(resolveChartReferenceValue({ average: true }, data, keys)).toBe(188);
  });

  it('returns undefined when there is nothing numeric to average', () => {
    expect(resolveChartReferenceValue({ average: true }, [], keys)).toBeUndefined();
    expect(
      resolveChartReferenceValue({ average: 'missing' }, data, keys)
    ).toBeUndefined();
  });
});

// recharts needs a laid-out container, which happy-dom does not provide, so the
// rendered labels/animation are covered by the visual-regression stories. These
// assert the prop contract itself: the composition accepts every new prop and
// mounts, and the animation resolves to the reduced-motion-aware value rather
// than a literal `true`.
describe('BarChart animation and data labels', () => {
  it('is not animated unless asked', () => {
    expect(resolveAnimation({})).toEqual({ isAnimationActive: false });
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('resolves animate to "auto" so prefers-reduced-motion is honored', () => {
    expect(
      resolveAnimation({ animate: true, animationDuration: 800 })
    ).toEqual({ isAnimationActive: 'auto', animationDuration: 800 });
  });

  it('accepts the full animation prop set without throwing', () => {
    const { container } = renderChart({
      animate: true,
      animationDuration: 400,
      animationBegin: 50,
      animationEasing: 'ease-in-out',
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('accepts the data-label props without throwing', () => {
    const { container } = renderChart({
      showLabels: true,
      labelFormatter: (value) => `${value} u`,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('accepts an explicit labelPosition override', () => {
    const { container } = renderChart({
      showLabels: true,
      labelPosition: 'center',
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});

describe('barChartCategoryRange', () => {
  it('resolves category values to inclusive row indices', () => {
    expect(barChartCategoryRange({ from: 'Feb', to: 'Mar' }, data, 'month')).toEqual([
      1, 2,
    ]);
  });

  it('resolves a numeric bound as a row index', () => {
    expect(barChartCategoryRange({ from: 1 }, data, 'month')).toEqual([1, 2]);
  });

  it('prefers a matching category value over the index reading', () => {
    const numeric = [{ q: 3, sales: 1 }, { q: 1, sales: 2 }, { q: 2, sales: 3 }];
    // `1` is a real category here (row 1), not "index 1" by coincidence — the
    // value match wins so numeric categories stay addressable.
    expect(barChartCategoryRange({ from: 1, to: 2 }, numeric, 'q')).toEqual([1, 2]);
  });

  it('runs to the ends of the data when a bound is omitted', () => {
    expect(barChartCategoryRange({}, data, 'month')).toEqual([0, 2]);
    expect(barChartCategoryRange({ to: 'Feb' }, data, 'month')).toEqual([0, 1]);
  });

  it('returns undefined for an unknown bound, an inverted range, or no data', () => {
    expect(barChartCategoryRange({ from: 'Dec' }, data, 'month')).toBeUndefined();
    expect(barChartCategoryRange({ from: 9 }, data, 'month')).toBeUndefined();
    expect(
      barChartCategoryRange({ from: 'Mar', to: 'Jan' }, data, 'month')
    ).toBeUndefined();
    expect(barChartCategoryRange({ from: 'Jan' }, [], 'month')).toBeUndefined();
  });
});

describe('BarChart styling knobs', () => {
  it('styles only the bars inside a barSettings range', () => {
    const { container } = renderChart({
      dataKeys: ['desktop'],
      barSettings: { desktop: { from: 'Feb', opacity: 0.4, dashed: true } },
    });
    const bars = container.querySelectorAll('.recharts-bar-rectangle path');
    expect(bars).toHaveLength(3);
    expect(bars[0]).not.toHaveAttribute('stroke-dasharray');
    expect(bars[0]).not.toHaveAttribute('fill-opacity', '0.4');
    [bars[1], bars[2]].forEach((bar) => {
      expect(bar).toHaveAttribute('stroke-dasharray', '4 3');
      expect(bar).toHaveAttribute('fill-opacity', '0.4');
      expect(bar).toHaveAttribute('stroke', 'var(--color-desktop)');
    });
  });

  it('leaves series without a barSettings entry untouched', () => {
    const { container } = renderChart({
      barSettings: { desktop: { from: 'Feb', dashed: true } },
    });
    const dashed = container.querySelectorAll('[stroke-dasharray="4 3"]');
    // Only the two matched desktop bars, none of the three mobile ones.
    expect(dashed).toHaveLength(2);
  });

  it('paints a shaded band behind a category range', () => {
    const { container } = renderChart({
      referenceArea: { from: 'Feb', label: 'Forecast' },
    });
    expect(
      container.querySelector('.recharts-reference-area')
    ).toBeInTheDocument();
    expect(container.textContent).toContain('Forecast');
  });

  // recharts measures text to lay a tick out, which happy-dom can't do, so every
  // tick renders empty here — the accent styling is covered by the
  // ForecastRange VR story. This guards the prop path instead.
  it('renders a highlighted range in both orientations without throwing', () => {
    expect(
      renderChart({
        referenceArea: { from: 'Feb' },
      }).container.querySelector('.recharts-reference-area')
    ).toBeInTheDocument();
    expect(
      renderChart({
        orientation: 'horizontal',
        referenceArea: { from: 'Feb', highlightTicks: false },
      }).container.querySelector('.recharts-reference-area')
    ).toBeInTheDocument();
  });

  // Neither index a tick carries is the data row: the `index` prop is a
  // position in the filtered list recharts actually renders, and `payload.index`
  // is relative to whatever slice a brush leaves. Keying the accent off either
  // put the highlight on the wrong categories — here it would land on nothing.
  const accentMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const accentRows = accentMonths.map((month, i) => ({ month, desktop: 100 + i }));

  // The value axis keeps recharts' default tick renderer, so the category ticks
  // are the ones drawn by ours.
  const categoryTicksOf = (container: HTMLElement) =>
    Array.from(container.querySelectorAll('text')).filter(
      (tick) => !tick.classList.contains('recharts-cartesian-axis-tick-value')
    );

  // Coexistence guard only: happy-dom can't drive a brush drag (see
  // chart/__tests__/chart-brush.test.tsx for what it takes to render the strip
  // at all), and an undragged brush still leaves the indices absolute — so this
  // would pass against the row-index lookup too. The drift a dragged selection
  // causes is what the value-based match above rules out by construction.
  it('accents the ticks of the band alongside a brush', () => {
    const { container } = render(
      <BarChart
        config={config}
        data={accentRows}
        dataKeys={['desktop']}
        xKey="month"
        showBrush
        referenceArea={{ from: 'Jul' }}
      />
    );
    expect(
      categoryTicksOf(container)
        .filter((tick) => tick.classList.contains('fill-primary'))
        .map((tick) => tick.textContent)
    ).toEqual(['Jul', 'Aug', 'Sep']);
  });

  it('accents the ticks of the band by data row, not by tick position', () => {
    const rows = accentRows;
    const { container } = render(
      <BarChart
        config={config}
        data={rows}
        dataKeys={['desktop']}
        xKey="month"
        // Keeps every 3rd tick: rows 0 (Jan), 3 (Apr) and 6 (Jul).
        xAxisInterval={2}
        referenceArea={{ from: 'Jul' }}
      />
    );

    const categoryTicks = categoryTicksOf(container);
    expect(categoryTicks.map((tick) => tick.textContent)).toEqual([
      'Jan',
      'Apr',
      'Jul',
    ]);
    // Keyed off the tick position this would accent nothing, since the band
    // starts at row 6 and only positions 0-2 are ever handed out.
    expect(
      categoryTicks
        .filter((tick) => tick.classList.contains('fill-primary'))
        .map((tick) => tick.textContent)
    ).toEqual(['Jul']);
  });

  it('rules the leading edge of a band only when asked', () => {
    const plain = renderChart({ referenceArea: { from: 'Feb' } });
    expect(
      plain.container.querySelectorAll('.recharts-reference-area line')
    ).toHaveLength(0);

    const ruled = renderChart({ referenceArea: { from: 'Feb', divider: true } });
    const rule = ruled.container.querySelector('.recharts-reference-area line');
    expect(rule).toHaveAttribute('stroke-dasharray', '4 4');
    // Vertical bars put the categories on X, so the rule is a vertical line.
    expect(rule?.getAttribute('x1')).toBe(rule?.getAttribute('x2'));
    expect(rule?.getAttribute('y1')).not.toBe(rule?.getAttribute('y2'));
  });

  it('rules the top edge of a band on a horizontal chart', () => {
    const { container } = renderChart({
      orientation: 'horizontal',
      referenceArea: { from: 'Feb', divider: true },
    });
    const rule = container.querySelector('.recharts-reference-area line');
    expect(rule?.getAttribute('y1')).toBe(rule?.getAttribute('y2'));
    expect(rule?.getAttribute('x1')).not.toBe(rule?.getAttribute('x2'));
  });

  it('rounds every corner for the pill shape', () => {
    const { container } = renderChart({
      dataKeys: ['desktop'],
      barShape: 'pill',
    });
    // recharts clamps the radius to half the bar, so the oversized value the
    // component passes is what makes a capsule at any width.
    expect(
      container.querySelector('.recharts-bar-rectangle path')
    ).toHaveAttribute('radius', '9999');
  });

  it('draws a track background for every bar, or only the matched range', () => {
    const all = renderChart({ dataKeys: ['desktop'], showBackground: true });
    expect(
      all.container.querySelectorAll('.recharts-bar-background-rectangle')
    ).toHaveLength(3);

    const ranged = renderChart({
      dataKeys: ['desktop'],
      barSettings: { desktop: { from: 'Feb', background: true } },
    });
    // Only the two bars inside the range get a track.
    const backgrounds = ranged.container.querySelectorAll(
      '.recharts-bar-background-rectangle'
    );
    expect(backgrounds).toHaveLength(2);
    expect(backgrounds[0]).toHaveAttribute(
      'fill',
      'var(--ui-background-surface-secondary)'
    );
  });

  it('caps a track at an upper-bound field, stacked on its own bar', () => {
    const bounded: Array<Record<string, string | number>> = [
      { month: 'Jan', desktop: 100 },
      { month: 'Feb', desktop: 120, ceiling: 150 },
      { month: 'Mar', desktop: 130, ceiling: 170 },
    ];
    const { container } = render(
      <BarChart
        config={config}
        data={bounded}
        dataKeys={['desktop']}
        xKey="month"
        barSettings={{ desktop: { from: 'Feb', background: 'ceiling' } }}
      />
    );
    // One series plus its headroom series; the headroom only covers the range.
    const layers = container.querySelectorAll('.recharts-bar');
    expect(layers).toHaveLength(2);
    const headroom = layers[1].querySelectorAll('.recharts-rectangle');
    expect(headroom).toHaveLength(2);
    // 150 - 120 and 170 - 130 sit above bars of 120 and 130, so the headroom is
    // the shorter of the two rectangles in each category.
    expect(Number(headroom[0].getAttribute('height'))).toBeGreaterThan(0);
    expect(headroom[0].getAttribute('fill-opacity')).toBe('0.25');
  });

  it('keeps the headroom series out of the legend and the tooltip', () => {
    const rows: Array<Record<string, string | number>> = [
      { month: 'Jan', desktop: 100 },
      { month: 'Feb', desktop: 120, ceiling: 150 },
    ];
    const { container } = render(
      <BarChart
        config={config}
        data={rows}
        dataKeys={['desktop']}
        xKey="month"
        barSettings={{ desktop: { from: 'Feb', background: 'ceiling' } }}
      />
    );
    // One legend entry for the real series, none for its decoration.
    expect(
      container.querySelectorAll('.recharts-legend-wrapper [class*="rounded"]')
    ).toHaveLength(1);
    expect(container.textContent).not.toContain('__headroom_');
  });

  it('ignores a capped track when the bars are stacked', () => {
    const { container } = renderChart({
      layout: 'stacked',
      barSettings: { desktop: { from: 'Feb', background: 'mobile' } },
    });
    // Just the two real series — no synthetic headroom inside the stack.
    expect(container.querySelectorAll('.recharts-bar')).toHaveLength(2);
  });

  it('paints gradient and pattern shapes from per-chart defs', () => {
    const gradient = renderChart({ dataKeys: ['desktop'], barShape: 'gradient' });
    expect(gradient.container.querySelector('linearGradient')).toBeInTheDocument();
    expect(
      gradient.container.querySelector('.recharts-bar-rectangle path')
    ).toHaveAttribute('fill', expect.stringContaining('url(#') as unknown as string);

    const pattern = renderChart({ dataKeys: ['desktop'], barShape: 'pattern' });
    expect(pattern.container.querySelector('pattern')).toBeInTheDocument();
  });

  it('never wipes the series color when the active bar has no fill', () => {
    const { container } = renderChart({ dataKeys: ['desktop'], showActiveBar: true });
    // recharts spreads the activeBar option over the bar's own props, so an
    // explicit `undefined` fill would leave the hovered bar unfilled (black).
    container
      .querySelectorAll('.recharts-bar-rectangle path')
      .forEach((bar) => expect(bar).toHaveAttribute('fill'));
  });

  it('keeps the rounded end on an in-range bar with no headroom to stack', () => {
    const partial: Array<Record<string, string | number>> = [
      { month: 'Jan', desktop: 100 },
      // In range, but the upper bound is missing…
      { month: 'Feb', desktop: 120 },
      // …and here it is no higher than the value.
      { month: 'Mar', desktop: 130, ceiling: 130 },
    ];
    const { container } = render(
      <BarChart
        config={config}
        data={partial}
        dataKeys={['desktop']}
        xKey="month"
        barSettings={{ desktop: { from: 'Feb', background: 'ceiling' } }}
      />
    );
    const paths = (root: HTMLElement) =>
      Array.from(
        root.querySelectorAll('.recharts-bar-rectangle .recharts-rectangle')
      ).map((bar) => bar.getAttribute('d'));

    // recharts only emits a `radius` attribute for a numeric radius, so the
    // rounding is compared through the drawn path: identical to a chart with no
    // barSettings at all, because no row here has headroom to stack.
    const plain = render(
      <BarChart
        config={config}
        data={partial}
        dataKeys={['desktop']}
        xKey="month"
      />
    );
    expect(paths(container)).toEqual(paths(plain.container));
  });

  it('floors a tiny bar with minPointSize but leaves a zero at nothing', () => {
    const { container } = render(
      <BarChart
        config={config}
        data={[
          { month: 'Jan', desktop: 100 },
          { month: 'Feb', desktop: 0.4 },
          { month: 'Mar', desktop: 0 },
        ]}
        dataKeys={['desktop']}
        xKey="month"
        minPointSize={4}
      />
    );
    const heights = Array.from(
      container.querySelectorAll('.recharts-bar-rectangle .recharts-rectangle')
    ).map((bar) => Number(bar.getAttribute('height')));
    // The 0.4 bar is floored to 4px; the true zero draws no rectangle at all.
    expect(heights).toEqual([expect.any(Number), 4]);
  });

  it('colors the legend swatch from the series, not the paint server', () => {
    // A gradient/pattern bar fills from url(#…), which paints SVG but is not a
    // usable CSS background — the swatch would render blank.
    (['gradient', 'pattern'] as const).forEach((barShape) => {
      const { container } = renderChart({ dataKeys: ['desktop'], barShape });
      const swatch = container.querySelector<HTMLElement>(
        '.recharts-legend-wrapper [class*="rounded"]'
      );
      expect(swatch?.style.backgroundColor).toBe('var(--color-desktop)');
    });
  });

  it('accepts the sizing, active-bar and minPointSize knobs', () => {
    const { container } = renderChart({
      barSize: 12,
      maxBarSize: 24,
      barGap: 2,
      barCategoryGap: '20%',
      minPointSize: 3,
      showActiveBar: true,
      activeBar: { fill: 'rgb(0 0 0)', opacity: 0.8 },
    });
    const bars = container.querySelectorAll('.recharts-bar-rectangle path');
    expect(bars.length).toBeGreaterThan(0);
    // barSize is honored rather than computed from the available width.
    expect(bars[0]).toHaveAttribute('width', '12');
  });

  // recharts hands the minPointSize callback the bar's top edge, which inside a
  // stack is the running total — a zero segment riding on a non-zero stack
  // would clear a `value !== 0` check and get a sliver it should not have.
  it('leaves a zero at nothing under minPointSize even when stacked', () => {
    const rows = [
      { month: 'Jan', desktop: 100, mobile: 40 },
      // mobile is zero here, but it stacks on a non-zero desktop.
      { month: 'Feb', desktop: 120, mobile: 0 },
    ];
    const { container } = render(
      <BarChart
        config={config}
        data={rows}
        dataKeys={['desktop', 'mobile']}
        xKey="month"
        layout="stacked"
        minPointSize={6}
      />
    );
    const mobileBar = container.querySelectorAll('.recharts-bar')[1];
    const heights = Array.from(
      mobileBar.querySelectorAll('.recharts-bar-rectangle path')
    ).map((bar) => Number(bar.getAttribute('height')));
    // Only Jan's segment is drawn; floored off the stack total, Feb's zero
    // would have picked up a 6px sliver of its own.
    expect(heights).toHaveLength(1);
    expect(heights[0]).toBeGreaterThan(0);
  });

  // recharts sorts legend entries alphabetically by series name by default
  // (`itemSorter: 'value'`), so the order has to be restored unconditionally —
  // gating that on the bar styling made a paint-server shape silently reorder
  // the legend.
  it('keeps the legend in dataKeys order whatever the bar styling', () => {
    const labels = (props: Partial<React.ComponentProps<typeof BarChart>>) =>
      Array.from(
        renderChart({ dataKeys: ['mobile', 'desktop'], ...props }).container
          .querySelectorAll('.recharts-legend-wrapper > div > div')
      ).map((entry) => entry.textContent);

    expect(labels({})).toEqual(['Mobile', 'Desktop']);
    expect(labels({ barShape: 'gradient' })).toEqual(['Mobile', 'Desktop']);
  });
});

// A range-scoped track is drawn by a custom `<Bar shape>`; recharts swaps that
// shape out for the `activeBar` option while a bar is hovered, so the active
// option has to redraw the track itself or it blinks out under the pointer.
describe('createTrackShape', () => {
  const geometry = {
    x: 10,
    y: 20,
    width: 8,
    height: 40,
    fill: 'rgb(23 99 207)',
    background: { x: 10, y: 0, width: 8, height: 100 },
  } as unknown as Parameters<ReturnType<typeof createTrackShape>>[0];

  it('draws the track for a row inside the range, and not outside it', () => {
    const shape = createTrackShape({
      inRange: (row) => row === 1,
      trackFill: 'rgb(1 2 3)',
    });

    const inside = render(<svg>{shape({ ...geometry, index: 1 })}</svg>);
    expect(
      inside.container.querySelector('.recharts-bar-background-rectangle')
    ).toBeInTheDocument();

    const outside = render(<svg>{shape({ ...geometry, index: 0 })}</svg>);
    expect(
      outside.container.querySelector('.recharts-bar-background-rectangle')
    ).not.toBeInTheDocument();
  });

  it('keeps the track while applying the active paint to the bar', () => {
    const shape = createTrackShape({
      inRange: () => true,
      trackFill: 'rgb(1 2 3)',
      paint: { fill: 'rgb(0 0 0)', fillOpacity: 0.85 },
    });
    const { container } = render(<svg>{shape({ ...geometry, index: 0 })}</svg>);

    expect(
      container.querySelector('.recharts-bar-background-rectangle')
    ).toBeInTheDocument();
    // The track is drawn first, so the bar itself is the last path.
    const paths = Array.from(container.querySelectorAll('path'));
    const bar = paths[paths.length - 1];
    expect(bar).toHaveAttribute('fill', 'rgb(0 0 0)');
    expect(bar).toHaveAttribute('fill-opacity', '0.85');
  });
});

// The chrome always goes through this, so it has to be a no-op for an ordinary
// chart and still strip/recolor when a headroom or paint-server series is in
// play. The open-tooltip story renders a raw recharts composition, so this is
// the only thing covering the component's own tooltip path.
describe('NormalizedTooltipContent', () => {
  const payload = [
    {
      dataKey: 'desktop',
      name: 'desktop',
      value: 1,
      color: 'url(#p)',
      payload: { month: 'Jan', desktop: 1 },
    },
    {
      dataKey: '__headroom_desktop',
      name: '__headroom_desktop',
      value: 2,
      payload: { month: 'Jan' },
    },
  ] as never;

  function renderIn(node: React.ReactNode) {
    return render(
      <ChartContainer config={config} className="h-[300px] w-[500px]">
        <RechartsBarChart data={data}>{node as never}</RechartsBarChart>
      </ChartContainer>
    );
  }

  it('strips the headroom row and recolors the dot for the default tooltip', () => {
    const { container } = renderIn(
      <NormalizedTooltipContent active label="Jan" payload={payload} />
    );
    expect(container.textContent).toContain('Desktop');
    expect(container.textContent).not.toContain('__headroom_');
  });

  it('normalizes before a caller-supplied element tooltip renders', () => {
    const seen: unknown[] = [];
    const { container } = renderIn(
      <NormalizedTooltipContent
        active
        label="Jan"
        payload={payload}
        content={
          <ChartTooltipContent
            formatter={(value, name) => {
              seen.push(name);
              return <span>{String(value)}</span>;
            }}
          />
        }
      />
    );
    expect(seen).toEqual(['desktop']);
    expect(container.textContent).not.toContain('__headroom_');
  });

  it('normalizes before a caller-supplied function tooltip renders', () => {
    const seen: unknown[] = [];
    renderIn(
      <NormalizedTooltipContent
        active
        label="Jan"
        payload={payload}
        content={(props) => {
          seen.push(props.payload?.map((item) => item.dataKey));
          return null;
        }}
      />
    );
    expect(seen).toEqual([['desktop']]);
  });
});

// recharts still lists a `legendType="none"` bar in the payload, so the filter
// below is what keeps the synthetic headroom series out of the chrome. Guarded
// directly — an inverted predicate would drop the real series instead.
describe('dropHeadroomSeries', () => {
  const real = [{ dataKey: 'desktop' }, { dataKey: 'mobile' }];

  it('drops the headroom series while keeping real series in order', () => {
    expect(
      dropHeadroomSeries([real[0], { dataKey: '__headroom_desktop' }, real[1]])
    ).toEqual(real);
  });

  it('keeps every series when none is synthetic', () => {
    expect(dropHeadroomSeries(real)).toEqual(real);
  });

  it('restores dataKeys order when asked', () => {
    // Per-series stacks reorder recharts' payload; the legend must not follow.
    expect(
      dropHeadroomSeries([real[1], { dataKey: '__headroom_mobile' }, real[0]], [
        'desktop',
        'mobile',
      ])
    ).toEqual(real);
  });

  it('returns undefined for an undefined payload', () => {
    expect(dropHeadroomSeries(undefined)).toBeUndefined();
  });
});

// The legend swatch and the tooltip dot are CSS backgrounds, so a bar filled
// from an SVG paint server has to fall back to its series color.
describe('withSeriesColor', () => {
  it('swaps a url(#…) fill for the series custom property', () => {
    expect(
      withSeriesColor([{ dataKey: 'desktop', color: 'url(#bar-1-pattern-desktop)' }])
    ).toEqual([{ dataKey: 'desktop', color: 'var(--color-desktop)' }]);
  });

  it('leaves a plain color and a missing one alone', () => {
    const plain = [{ dataKey: 'desktop', color: 'var(--color-desktop)' }, { dataKey: 'mobile' }];
    expect(withSeriesColor(plain)).toEqual(plain);
  });

  it('returns undefined for an undefined payload', () => {
    expect(withSeriesColor(undefined)).toBeUndefined();
  });
});
