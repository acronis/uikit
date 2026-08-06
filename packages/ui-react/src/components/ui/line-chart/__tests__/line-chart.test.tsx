import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  LineChart,
  createBandStrippedTooltip,
  dropBandSeries,
} from '../line-chart';
import { ChartTooltipContent, type ChartConfig,
  resolveAnimation,
} from '../../chart';
import {
  giveTheChartASize,
  restoreTheChartSize,
} from '../../chart/__tests__/sized-chart';

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

  // Axis titles/unit forward to recharts' XAxis/YAxis `label`/`unit`; happy-dom
  // doesn't paint the SVG, so this only guards the prop path (the rendered titles
  // are covered by the `AxisLabels` VR story).
  it('renders with axis titles + a Y unit', () => {
    const { container } = renderChart({
      xAxisLabel: 'Month',
      yAxisLabel: 'Sessions',
      yUnit: 'k',
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

  // The prop path in the component is a wrapper (createBandStrippedTooltip) that
  // strips the bands, then mounts the caller's tooltip exactly as recharts would
  // — a function via createElement, an element via cloneElement. Exercised
  // directly here because recharts doesn't paint the tooltip in happy-dom; an
  // inverted predicate would leak a `__band_*` row into the caller's tooltip.
  describe('createBandStrippedTooltip', () => {
    const payload = [
      { dataKey: 'thisYear', name: 'This year', value: 305 },
      { dataKey: '__band_0', name: 'band', value: [200, 305] },
      { dataKey: 'lastYear', name: 'Last year', value: 200 },
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

    function renderWrapped(
      content: Parameters<typeof createBandStrippedTooltip>[0]
    ) {
      const Wrapped = createBandStrippedTooltip(content) as unknown as React.FC<{
        payload: typeof payload;
        active: boolean;
      }>;
      render(<Wrapped payload={payload} active />);
      return screen.getByTestId('keys').textContent;
    }

    it('strips band series before a function-form tooltip renders', () => {
      expect(renderWrapped((p) => <Probe payload={p.payload} />)).toBe(
        'thisYear,lastYear'
      );
    });

    it('strips band series before an element-form tooltip renders', () => {
      expect(renderWrapped(<Probe />)).toBe('thisYear,lastYear');
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

// recharts needs a laid-out container, which happy-dom does not provide, so the
// rendered labels/animation are covered by the visual-regression stories. These
// assert the prop contract itself: the composition accepts every new prop and
// mounts, and the animation resolves to the reduced-motion-aware value rather
// than a literal `true`.
describe('LineChart animation and data labels', () => {
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

// These need real geometry: the curve set, the dot radii, and the per-series
// overrides are all only observable on the painted SVG, which recharts skips
// entirely at 0×0 (see `sized-chart`).
describe('LineChart curves, dots and per-series overrides', () => {
  afterEach(restoreTheChartSize);

  const CURVES = [
    'linear',
    'monotone',
    'natural',
    'basis',
    'step',
    'stepBefore',
    'stepAfter',
  ] as const;

  function curvePaths(props: Partial<React.ComponentProps<typeof LineChart>>) {
    giveTheChartASize();
    const { container, unmount } = renderChart({ dataKeys: ['desktop'], ...props });
    const paths = [...container.querySelectorAll('.recharts-line-curve')].map(
      (path) => path.getAttribute('d')
    );
    return { paths, container, unmount };
  }

  // A curve value that recharts doesn't recognize silently draws a straight
  // line, so identical geometry between two types is the failure to catch.
  it('draws distinct geometry for every curve type', () => {
    const drawn = CURVES.map((curve) => {
      const { paths, unmount } = curvePaths({ curve });
      unmount();
      restoreTheChartSize();
      expect(paths[0]).toBeTruthy();
      return paths[0];
    });
    expect(new Set(drawn).size).toBe(CURVES.length);
  });

  it('mirrors an extended curve variant onto the root', () => {
    const { container } = renderChart({ curve: 'stepAfter' });
    expect(container.firstElementChild).toHaveAttribute(
      'data-curve',
      'stepAfter'
    );
  });

  it('sizes the point dots from dotSize', () => {
    giveTheChartASize();
    const { container } = renderChart({ dataKeys: ['desktop'], dotSize: 6 });
    const dots = container.querySelectorAll('.recharts-line-dot');
    expect(dots.length).toBeGreaterThan(0);
    for (const dot of dots) expect(dot).toHaveAttribute('r', '6');
  });

  it('keeps the static dots when only the hover dot is turned off', () => {
    giveTheChartASize();
    const { container } = renderChart({
      dataKeys: ['desktop'],
      showActiveDot: false,
    });
    expect(
      container.querySelectorAll('.recharts-line-dot').length
    ).toBeGreaterThan(0);
  });

  it('draws no static dots for a hover-only line', () => {
    giveTheChartASize();
    const { container } = renderChart({
      dataKeys: ['desktop'],
      showDots: false,
      showActiveDot: true,
    });
    expect(container.querySelectorAll('.recharts-line-dot')).toHaveLength(0);
  });

  it('restyles one series without touching the others', () => {
    giveTheChartASize();
    const { container } = renderChart({
      lineSettings: {
        mobile: { color: 'rgb(1 2 3)', strokeWidth: 4, dashed: true },
      },
    });
    // The curves follow `dataKeys` order: desktop first, then mobile.
    const [desktop, mobile] = container.querySelectorAll('.recharts-line-curve');
    expect(mobile).toHaveAttribute('stroke', 'rgb(1 2 3)');
    expect(mobile).toHaveAttribute('stroke-width', '4');
    expect(mobile).toHaveAttribute('stroke-dasharray', '5 5');
    expect(desktop).toHaveAttribute('stroke', 'var(--color-desktop)');
    expect(desktop).toHaveAttribute('stroke-width', '2');
    expect(desktop).not.toHaveAttribute('stroke-dasharray');
  });

  it('gives one series its own curve type', () => {
    giveTheChartASize();
    const { container } = renderChart({
      curve: 'linear',
      lineSettings: { mobile: { curveType: 'natural' } },
    });
    const [desktop, mobile] = container.querySelectorAll('.recharts-line-curve');
    expect(desktop!.getAttribute('d')).not.toBe(mobile!.getAttribute('d'));
    // A natural spline is drawn with cubic segments; a linear one is not.
    expect(mobile!.getAttribute('d')).toContain('C');
    expect(desktop!.getAttribute('d')).not.toContain('C');
  });

  it('turns dots off for one series and resizes another', () => {
    giveTheChartASize();
    const { container } = renderChart({
      lineSettings: { desktop: { showDots: false }, mobile: { dotSize: 5 } },
    });
    const dots = container.querySelectorAll('.recharts-line-dot');
    expect(dots).toHaveLength(data.length);
    for (const dot of dots) expect(dot).toHaveAttribute('r', '5');
  });

  // A comparison overlay is *defined* by reading as secondary, so the dot
  // settings must not be able to promote it back to a primary-looking line.
  it('keeps a comparison series dot-less even when its settings ask for dots', () => {
    giveTheChartASize();
    const { container } = renderChart({
      comparisonKeys: ['mobile'],
      lineSettings: { desktop: { showDots: false }, mobile: { showDots: true } },
    });
    expect(container.querySelectorAll('.recharts-line-dot')).toHaveLength(0);
  });

  it('opts one series out of the chart-wide value labels', () => {
    giveTheChartASize();
    const { container } = renderChart({
      showLabels: true,
      lineSettings: { mobile: { showLabel: false } },
    });
    const labels = container.querySelectorAll('.recharts-label-list text');
    expect(labels).toHaveLength(data.length);
    expect([...labels].map((label) => label.textContent)).toEqual(
      data.map((row) => String(row.desktop))
    );
  });

  it('labels a single series without the chart-wide toggle', () => {
    giveTheChartASize();
    const { container } = renderChart({
      lineSettings: { mobile: { showLabel: true, labelPosition: 'bottom' } },
    });
    const labels = container.querySelectorAll('.recharts-label-list text');
    expect([...labels].map((label) => label.textContent)).toEqual(
      data.map((row) => String(row.mobile))
    );
  });

  // A band shades the gap between two lines, so an edge drawn with a different
  // interpolation than the line it belongs to no longer bounds it.
  it('draws a delta band with the current series own curve type', () => {
    const bandPath = (props: Partial<React.ComponentProps<typeof LineChart>>) => {
      giveTheChartASize();
      const { container, unmount } = renderChart({
        curve: 'linear',
        deltaBands: [['desktop', 'mobile']],
        ...props,
      });
      // The band is stroke-less, so recharts paints only its filled outline —
      // there is no separate top-edge curve path to read.
      const d = container
        .querySelector('.recharts-area-area')
        ?.getAttribute('d');
      unmount();
      restoreTheChartSize();
      return d;
    };

    // A natural spline is drawn with cubic segments; a linear one is not.
    expect(bandPath({})).not.toContain('C');
    expect(
      bandPath({ lineSettings: { desktop: { curveType: 'natural' } } })
    ).toContain('C');
  });
});
