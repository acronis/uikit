import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';

import {
  ConfidenceCone,
  createConeTooltip,
  createForecastTick,
  dropConeBand,
  forecastPeriodX,
  keepMetricSeries,
} from '../confidence-cone';
import { ChartTooltipContent, type ChartConfig,
  resolveAnimation,
} from '../../chart';

beforeAll(() => {
  // happy-dom's ResizeObserver never reports a size, so recharts'
  // ResponsiveContainer renders nothing and its children never mount. The dot
  // styling below is per-dot SVG, so these tests need the real output.
  // (Same shim as bar-chart.test.tsx, for the same reason.)
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

  // Axis titles/unit forward to recharts' XAxis/YAxis `label`/`unit`; happy-dom
  // doesn't paint the SVG, so this only guards the prop path (the rendered titles
  // are covered by the `AxisLabels` VR story).
  it('renders with axis titles + a Y unit', () => {
    const { container } = renderChart({
      xAxisLabel: 'Month',
      yAxisLabel: 'Revenue',
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

  it('renders when bound fields are missing (no cone band)', () => {
    const { container } = renderChart({
      data: [
        { month: 'Jan', actual: 100 },
        { month: 'Feb', actual: 120 },
      ],
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // The metric is one hue: the cone and the forecast line paint with the actual
  // series' color, and the forecast key's own `--color-*` is re-pointed at it so
  // a caller's second color can't slip back in through a custom tooltip.
  it('wires config colors into --color-*, forecast included, from one hue', () => {
    const { container } = renderChart();
    const css = container.querySelector('style')?.innerHTML ?? '';
    expect(css).toContain('--color-actual: rgb(23 99 207)');
    expect(css).toContain('--color-forecast: rgb(23 99 207)');
    expect(css).not.toContain('rgb(240 160 30)');
  });

  it('keeps a per-theme actual color when re-pointing the forecast', () => {
    const { container } = renderChart({
      config: {
        actual: { label: 'Actual', theme: { light: '#aaa', dark: '#222' } },
        forecast: { label: 'Forecast', color: 'rgb(240 160 30)' },
      },
    });
    const css = container.querySelector('style')?.innerHTML ?? '';
    expect(css).toContain('--color-forecast: #aaa');
    expect(css).toContain('--color-forecast: #222');
  });

  // The default tooltip and any caller-supplied `tooltipContent` both route
  // their payload through dropConeBand to hide the synthetic `__cone` range
  // series. recharts won't paint that content in happy-dom, so the filter is
  // guarded here directly — an inverted predicate would otherwise leak an
  // unlabeled `__cone` row into a consumer's custom tooltip.
  describe('dropConeBand', () => {
    const real = [{ dataKey: 'actual' }, { dataKey: 'forecast' }];

    it('drops the synthetic cone band while keeping real series in order', () => {
      const payload = [real[0], { dataKey: '__cone:actual' }, real[1]];
      expect(dropConeBand(payload)).toEqual(real);
    });

    // One band per series, so the filter is a prefix test — a payload from a
    // multi-series cone carries several of them.
    it('drops every series band, not just the first', () => {
      const payload = [
        real[0],
        { dataKey: '__cone:actual' },
        real[1],
        { dataKey: 'other' },
        { dataKey: '__cone:other' },
      ];
      expect(dropConeBand(payload)).toEqual([...real, { dataKey: 'other' }]);
    });

    it('keeps every series when none is the cone band', () => {
      expect(dropConeBand(real)).toEqual(real);
    });

    it('returns undefined for an undefined payload', () => {
      expect(dropConeBand(undefined)).toBeUndefined();
    });
  });

  // A series' actual, forecast and cone are one metric in one hue, so the legend
  // names each metric once. Guarded directly for the same reason as dropConeBand.
  describe('keepMetricSeries', () => {
    it('keeps only the actual series, dropping the forecast and the band', () => {
      expect(
        keepMetricSeries(
          [
            { dataKey: 'actual' },
            { dataKey: '__cone:actual' },
            { dataKey: 'forecast' },
          ],
          ['actual']
        )
      ).toEqual([{ dataKey: 'actual' }]);
    });

    it('keeps one entry per series for a multi-series cone', () => {
      expect(
        keepMetricSeries(
          [
            { dataKey: 'storage' },
            { dataKey: '__cone:storage' },
            { dataKey: 'storageForecast' },
            { dataKey: 'backups' },
            { dataKey: '__cone:backups' },
            { dataKey: 'backupsForecast' },
          ],
          ['storage', 'backups']
        )
      ).toEqual([{ dataKey: 'storage' }, { dataKey: 'backups' }]);
    });

    it('returns undefined for an undefined payload', () => {
      expect(keepMetricSeries(undefined, ['actual'])).toBeUndefined();
    });
  });

  // The prop path in the component is a wrapper (createConeTooltip) that strips
  // the band, then mounts the caller's tooltip exactly as recharts would — a
  // function via createElement, an element via cloneElement. Exercised directly
  // here because recharts doesn't paint the tooltip in happy-dom; an inverted
  // filter would leak a `__cone` row into the caller's tooltip and fail this.
  describe('createConeTooltip', () => {
    const payload = [
      { dataKey: 'actual', name: 'Actual', value: 150 },
      { dataKey: '__cone:actual', name: 'cone', value: [150, 176] },
      { dataKey: 'forecast', name: 'Forecast', value: 162 },
    ];

    function Probe({
      payload: p,
    }: {
      payload?: ReadonlyArray<{ dataKey?: unknown }>;
    }) {
      return (
        <div data-testid="keys">
          {(p ?? []).map((item) => String(item.dataKey)).join(',')}
        </div>
      );
    }

    function renderWrapped(content: Parameters<typeof createConeTooltip>[0]) {
      const Wrapped = createConeTooltip(content) as unknown as React.FC<{
        payload: typeof payload;
        active: boolean;
      }>;
      render(<Wrapped payload={payload} active />);
      return screen.getByTestId('keys').textContent;
    }

    it('strips the cone band before a function-form tooltip renders', () => {
      expect(renderWrapped((p) => <Probe payload={p.payload} />)).toBe(
        'actual,forecast'
      );
    });

    it('strips the cone band before an element-form tooltip renders', () => {
      expect(renderWrapped(<Probe />)).toBe('actual,forecast');
    });
  });

  // Item-level guards for the props recharts only shows once laid out — the
  // rendered result is covered by the matching VR stories.
  it('renders a band-less series when the bound fields are omitted', () => {
    const { container } = renderChart({ lowerKey: undefined, upperKey: undefined });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders the actuals as a bare line', () => {
    const { container } = renderChart({ actualType: 'line' });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // recharts merges the parent mark's own SVG presentation props into every dot
  // it draws (`Dots` spreads the mark's props under the `dot` object), so a dot
  // that doesn't restate a property silently inherits the mark's. Two of those
  // shipped as visual bugs — the actual `<Area>`'s `fillOpacity: 0.15` washed the
  // observed dot out to a faint halo, and the forecast `<Line>`'s
  // `strokeDasharray: '5 5'` broke each projected dot's ring into two arcs — so
  // both are asserted on the rendered circles rather than left to the baselines.
  describe('showDots', () => {
    it('draws the observed points solid, not at the area fill opacity', () => {
      const { container } = renderChart({ showDots: true });
      const dots = container.querySelectorAll('.recharts-area-dot');
      expect(dots.length).toBeGreaterThan(0);
      dots.forEach((dot) => {
        expect(dot).toHaveAttribute('fill', 'var(--color-actual)');
        expect(dot).toHaveAttribute('fill-opacity', '1');
      });
    });

    it('draws the projected points with an unbroken ring, not a dashed one', () => {
      const { container } = renderChart({ showDots: true });
      const dots = container.querySelectorAll('.recharts-line-dot');
      expect(dots.length).toBeGreaterThan(0);
      dots.forEach((dot) => {
        expect(dot).toHaveAttribute('stroke', 'var(--color-actual)');
        expect(dot).toHaveAttribute('stroke-dasharray', 'none');
      });
    });

    // With actualType="line" both marks are Lines, so the observed and projected
    // dots are told apart by their fill — the metric hue vs the surface token.
    it('keeps measured and predicted points distinct with actualType="line"', () => {
      const { container } = renderChart({ showDots: true, actualType: 'line' });
      const dots = [...container.querySelectorAll('.recharts-line-dot')];
      const observed = dots.filter(
        (dot) => dot.getAttribute('fill') === 'var(--color-actual)'
      );
      const projected = dots.filter(
        (dot) =>
          dot.getAttribute('fill') === 'var(--ui-background-surface-primary)'
      );
      expect(observed.length).toBeGreaterThan(0);
      expect(projected.length).toBeGreaterThan(0);
      observed.forEach((dot) => expect(dot).toHaveAttribute('fill-opacity', '1'));
      projected.forEach((dot) =>
        expect(dot).toHaveAttribute('stroke-dasharray', 'none')
      );
    });

    it('marks no points when off', () => {
      const { container } = renderChart();
      expect(container.querySelector('.recharts-dot')).toBeNull();
    });
  });

  it('accepts dots, styled forecast ticks and thresholds', () => {
    const { container } = renderChart({
      showDots: true,
      styleForecastTicks: true,
      referenceLine: [{ value: 160, label: 'Target' }, { value: 190 }],
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // A custom tick renders its own text, so it has to apply the caller's
  // xTickFormatter itself — recharts only formats the ticks it renders. The
  // accent is an inline style so it survives a class-based tick color.
  describe('createForecastTick', () => {
    const tick = createForecastTick(
      new Set(['Apr', 'May']),
      'var(--color-actual)',
      (value) => `FY-${value}`
    );

    function renderTick(value: string) {
      const { container } = render(
        <svg>{tick({ payload: { value }, index: 0 })}</svg>
      );
      return container.querySelector('text');
    }

    // Asserted on the inline style attribute rather than the computed style: the
    // accent is a `var()` reference, which happy-dom can't resolve.
    it('italicizes and accents the projected periods', () => {
      expect(renderTick('Apr')?.getAttribute('style')).toBe(
        'font-style: italic; fill: var(--color-actual);'
      );
    });

    it('leaves the actual periods with the axis default styling', () => {
      expect(renderTick('Mar')?.getAttribute('style')).toBeNull();
    });

    it('applies the caller tick formatter to every tick', () => {
      expect(renderTick('Mar')?.textContent).toBe('FY-Mar');
      expect(renderTick('Apr')?.textContent).toBe('FY-Apr');
    });

    it('falls back to the raw value with no formatter', () => {
      const plain = createForecastTick(new Set(['Apr']), 'var(--color-actual)');
      const { container } = render(
        <svg>{plain({ payload: { value: 'Apr' } })}</svg>
      );
      expect(container.querySelector('text')?.textContent).toBe('Apr');
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

// Several metrics on one shared axis, each with its own actual / forecast /
// bound fields and its own hue.
describe('ConfidenceCone multi-series', () => {
  const multiData = [
    { month: 'Jan', storage: 100, backups: 40 },
    { month: 'Feb', storage: 120, backups: 52 },
    {
      month: 'Mar',
      storage: 150,
      storageForecast: 150,
      storageLower: 150,
      storageUpper: 150,
      backups: 61,
      backupsForecast: 61,
    },
    {
      month: 'Apr',
      storageForecast: 162,
      storageLower: 150,
      storageUpper: 176,
      backupsForecast: 68,
    },
  ];

  const multiConfig = {
    storage: { label: 'Storage', color: 'rgb(23 99 207)' },
    storageForecast: { label: 'Storage forecast', color: 'rgb(240 160 30)' },
    backups: { label: 'Backups', color: 'rgb(0 150 100)' },
    backupsForecast: { label: 'Backups forecast', color: 'rgb(200 30 30)' },
  } satisfies ChartConfig;

  const series = [
    {
      actualKey: 'storage',
      forecastKey: 'storageForecast',
      lowerKey: 'storageLower',
      upperKey: 'storageUpper',
    },
    // Band-less: a bare dashed projection, no cone.
    { actualKey: 'backups', forecastKey: 'backupsForecast' },
  ];

  function renderMulti(
    props: Partial<React.ComponentProps<typeof ConfidenceCone>> = {}
  ) {
    return render(
      <ConfidenceCone
        config={multiConfig}
        data={multiData}
        xKey="month"
        series={series}
        {...props}
      />
    );
  }

  it('renders every series against one shared axis', () => {
    const { container } = renderMulti();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // Each metric is one hue: every series' forecast key is re-pointed at its own
  // actual color, so no series can reintroduce a second color downstream.
  it('re-points each series forecast color at its own actual color', () => {
    const { container } = renderMulti();
    const css = container.querySelector('style')?.innerHTML ?? '';
    expect(css).toContain('--color-storage: rgb(23 99 207)');
    expect(css).toContain('--color-storageForecast: rgb(23 99 207)');
    expect(css).toContain('--color-backups: rgb(0 150 100)');
    expect(css).toContain('--color-backupsForecast: rgb(0 150 100)');
    expect(css).not.toContain('rgb(240 160 30)');
    expect(css).not.toContain('rgb(200 30 30)');
  });

  // `series` is the general form; the flat *Key props are its single-series
  // shorthand, so a caller passing both gets the array (not a merge of the two).
  it('takes precedence over the single-series shorthand props', () => {
    const { container } = renderMulti({
      actualKey: 'ignored',
      forecastKey: 'alsoIgnored',
    });
    const css = container.querySelector('style')?.innerHTML ?? '';
    expect(css).toContain('--color-storage: rgb(23 99 207)');
    expect(css).not.toContain('--color-ignored');
  });

  // The hand-off point and the styled forecast ticks both come from this — the
  // rows where *any* series has started projecting.
  describe('forecastPeriodX', () => {
    it('collects the x values of every projected row, in data order', () => {
      expect(forecastPeriodX(multiData, series, 'month')).toEqual(['Mar', 'Apr']);
    });

    it('starts at the earliest series hand-off, not the last', () => {
      const staggered = [
        { month: 'Jan', storage: 10, backups: 5 },
        { month: 'Feb', storageForecast: 12, backups: 6 },
        { month: 'Mar', storageForecast: 14, backupsForecast: 7 },
      ];
      expect(forecastPeriodX(staggered, series, 'month')[0]).toBe('Feb');
    });

    it('is empty when no series carries a forecast', () => {
      expect(
        forecastPeriodX([{ month: 'Jan', storage: 10 }], series, 'month')
      ).toEqual([]);
    });
  });
});

// recharts needs a laid-out container, which happy-dom does not provide, so the
// rendered labels/animation are covered by the visual-regression stories. These
// assert the prop contract itself: the composition accepts every new prop and
// mounts, and the animation resolves to the reduced-motion-aware value rather
// than a literal `true`.
describe('ConfidenceCone animation and data labels', () => {
  it('is not animated unless asked', () => {
    expect(resolveAnimation({})).toEqual({ isAnimationActive: false });
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('resolves animate to "auto" so prefers-reduced-motion is honored', () => {
    expect(resolveAnimation({ animate: true, animationDuration: 800 })).toEqual(
      { isAnimationActive: 'auto', animationDuration: 800 }
    );
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
});
