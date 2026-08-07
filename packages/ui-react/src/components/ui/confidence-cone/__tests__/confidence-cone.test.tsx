import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

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

import {
  axisTickLabels,
  axisTicks,
  giveEveryChartASize,
} from '../../chart/__tests__/chart-layout';

// The cone band, the curves, the axis ticks, the grid and the dots asserted
// below are painted SVG, which recharts skips entirely at 0×0.
giveEveryChartASize();

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

// The cone band is a stroke-less <Area> painting in the same hue, at the same
// opacity, as the actual series' own area — so it's told apart by the hook the
// component puts on it, not by any painted attribute.
const bandsOf = (container: Element) => [
  ...container.querySelectorAll('[data-slot="confidence-cone-band"]'),
];
const areaCurvesOf = (container: Element) => [
  ...container.querySelectorAll('.recharts-area-curve'),
];
const lineCurvesOf = (container: Element) => [
  ...container.querySelectorAll('.recharts-line-curve'),
];

describe('ConfidenceCone axes and grid', () => {
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

  it('thins the value axis to the requested tick count', () => {
    const { container } = renderChart({ yAxisTickCount: 4 });
    expect(axisTickLabels(container, 'y')).toHaveLength(4);
  });

  it('anchors rotated ticks on the side they lean towards', () => {
    const { container } = renderChart({ xAxisAngle: -45 });
    expect(axisTicks(container, 'x')[0]).toHaveAttribute('text-anchor', 'end');
  });

  it('thins the X ticks through the caller interval, keeping the ends', () => {
    const every = renderChart({ xAxisInterval: 1 });
    expect(axisTickLabels(every.container, 'x')).toEqual(['Jan', 'Mar', 'May']);
    every.unmount();

    const preserved = renderChart({ xAxisInterval: 'preserveStartEnd' });
    const ticks = axisTickLabels(preserved.container, 'x');
    expect(ticks[0]).toBe('Jan');
    expect(ticks[ticks.length - 1]).toBe('May');
  });

  // `zero` is also recharts' behavior for an unset domain, so the floor is only
  // observable against a preset that fits the data instead — this data starts
  // at 100.
  it('floors the Y domain at zero on request', () => {
    const fitted = renderChart({ yAxisDomain: 'auto' });
    expect(axisTickLabels(fitted.container, 'y')[0]).toBe('100');
    fitted.unmount();

    const floored = renderChart({ yAxisDomain: 'zero' });
    expect(axisTickLabels(floored.container, 'y')[0]).toBe('0');
  });

  it('renders the axis titles as their own labels', () => {
    const { container } = renderChart({
      xAxisLabel: 'Month',
      yAxisLabel: 'Revenue',
    });
    const titles = [...container.querySelectorAll('.recharts-label')].map(
      (label) => label.textContent
    );
    expect(titles).toContain('Month');
    expect(titles).toContain('Revenue');
  });

  it('draws only the grid direction it was asked for', () => {
    const { container } = renderChart({
      gridHorizontal: true,
      gridVertical: false,
    });
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
});

describe('ConfidenceCone', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('strips the grid and legend when their toggles are off', () => {
    const { container } = renderChart({
      showGrid: false,
      showTooltip: false,
      showLegend: false,
    });
    expect(container.querySelector('.recharts-cartesian-grid')).toBeNull();
    expect(container.querySelector('.recharts-legend-wrapper')).toBeNull();
    // The metric itself survives the chrome going away.
    expect(bandsOf(container)).toHaveLength(1);
    expect(areaCurvesOf(container)).toHaveLength(1);
    expect(lineCurvesOf(container)).toHaveLength(1);
  });

  it('draws no marks but still mounts on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    expect(bandsOf(container)).toHaveLength(0);
    expect(areaCurvesOf(container)).toHaveLength(0);
    expect(lineCurvesOf(container)).toHaveLength(0);
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

  // `lowerKey`/`upperKey` are set but no row carries those fields, so every band
  // tuple comes out undefined: the band's <Area> still mounts, with nothing to
  // shade.
  it('shades nothing when the bound fields are missing from the data', () => {
    const { container } = renderChart({
      data: [
        { month: 'Jan', actual: 100 },
        { month: 'Feb', actual: 120 },
      ],
    });
    const bands = bandsOf(container);
    expect(bands).toHaveLength(1);
    expect(bands[0]).not.toHaveAttribute('d');
    expect(areaCurvesOf(container)).toHaveLength(1);
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

  // Unbound, the band's <Area> is never composed at all — unlike the bound-but-
  // empty case above, where it mounts and shades nothing.
  it('renders a band-less series when the bound fields are omitted', () => {
    const { container } = renderChart({ lowerKey: undefined, upperKey: undefined });
    expect(bandsOf(container)).toHaveLength(0);
    // Still a full metric: a solid actual handing off to a dashed projection.
    expect(areaCurvesOf(container)).toHaveLength(1);
    expect(lineCurvesOf(container)[0]).toHaveAttribute('stroke-dasharray', '5 5');
  });

  // With the actual drawn as a <Line>, the cone is the only shaded region left
  // and the two strokes are told apart by their dash pattern alone.
  it('renders the actuals as a bare line', () => {
    const { container } = renderChart({ actualType: 'line' });
    expect(areaCurvesOf(container)).toHaveLength(0);
    expect(bandsOf(container)).toHaveLength(1);
    expect(
      lineCurvesOf(container).map((curve) =>
        curve.getAttribute('stroke-dasharray')
      )
    ).toEqual([null, '5 5']);
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

  // Three independent recharts children that a caller typically turns on at
  // once, and that the chart lays over marks it draws for itself — the accent
  // over the default ticks, the thresholds over the hand-off divider.
  it('draws the dots, forecast tick accents and thresholds together', () => {
    const { container } = renderChart({
      showDots: true,
      styleForecastTicks: true,
      referenceLine: [{ value: 160, label: 'Target' }, { value: 190 }],
    });
    expect(container.querySelectorAll('.recharts-dot').length).toBeGreaterThan(0);

    // The projection starts at Mar, so the last three columns carry the accent.
    const accent = 'font-style: italic; fill: var(--color-actual);';
    expect(
      axisTicks(container, 'x').map((tick) => tick.getAttribute('style'))
    ).toEqual([null, null, accent, accent, accent]);

    const thresholds = [
      ...container.querySelectorAll('.recharts-reference-line-line'),
    ].filter(
      (line) =>
        line.getAttribute('stroke') === 'var(--ui-text-on-surface-secondary)'
    );
    expect(thresholds.map((line) => line.getAttribute('y'))).toEqual([
      '160',
      '190',
    ]);
    expect(
      [...container.querySelectorAll('.recharts-label')].map(
        (label) => label.textContent
      )
    ).toEqual(['Target']);
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
    // One actual curve and one dashed projection per metric, each in its own
    // hue, but a band only for the series that carries bounds.
    expect(
      areaCurvesOf(container).map((curve) => curve.getAttribute('stroke'))
    ).toEqual(['var(--color-storage)', 'var(--color-backups)']);
    expect(
      lineCurvesOf(container).map((curve) => curve.getAttribute('stroke'))
    ).toEqual(['var(--color-storage)', 'var(--color-backups)']);
    expect(bandsOf(container)).toHaveLength(1);
    // One category axis for all of them, not one per metric.
    expect(container.querySelectorAll('.recharts-xAxis')).toHaveLength(1);
    expect(axisTickLabels(container, 'x')).toEqual([
      'Jan',
      'Feb',
      'Mar',
      'Apr',
    ]);
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

// The motion itself is a visual-regression concern; what matters here is that
// `animate` resolves to the reduced-motion-aware value rather than a literal
// `true`, and that every mark still ends up painted with the animation on.
describe('ConfidenceCone animation', () => {
  it('is not animated unless asked', () => {
    expect(resolveAnimation({})).toEqual({ isAnimationActive: false });
    // Nothing to wait for — a static series is painted on the first commit.
    const { container } = renderChart();
    expect(areaCurvesOf(container)).toHaveLength(1);
  });

  it('resolves animate to "auto" so prefers-reduced-motion is honored', () => {
    expect(resolveAnimation({ animate: true, animationDuration: 800 })).toEqual(
      { isAnimationActive: 'auto', animationDuration: 800 }
    );
  });

  it('still draws every mark with the full animation prop set', async () => {
    const { container } = renderChart({
      animate: true,
      animationDuration: 400,
      animationBegin: 50,
      animationEasing: 'ease-in-out',
    });
    // An animated mark can arrive after the first commit, unlike a static one.
    await waitFor(() => {
      expect(bandsOf(container)).toHaveLength(1);
      expect(areaCurvesOf(container)).toHaveLength(1);
      expect(lineCurvesOf(container)).toHaveLength(1);
    });
  });
});
