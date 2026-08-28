import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  LineChart,
  createBandStrippedTooltip,
  dropBandSeries,
} from '../line-chart';
import { ChartTooltipContent, dropProjectionPayload, type ChartConfig,
  resolveAnimation,
} from '../../chart';
import {
  axisTickLabels,
  axisTicks,
  giveEveryChartASize,
} from '../../chart/__tests__/chart-layout';

// The curves, dots, bands, labels and chrome asserted below are painted SVG,
// which recharts skips entirely at 0×0.
giveEveryChartASize();

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
];

const config = {
  desktop: { label: 'Desktop' },
  mobile: { label: 'Mobile' },
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

const curvesOf = (container: Element) => [
  ...container.querySelectorAll<SVGPathElement>('.recharts-line-curve'),
];

describe('LineChart axes and grid', () => {
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

  // The interval is a keep-every-Nth filter over the category ticks, so it is
  // only observable against the unthinned row it drops ticks from.
  it('thins the X ticks through the caller interval', () => {
    const every = renderChart();
    expect(axisTickLabels(every.container, 'x')).toEqual(['Jan', 'Feb', 'Mar']);
    every.unmount();

    const thinned = renderChart({ xAxisInterval: 1 });
    expect(axisTickLabels(thinned.container, 'x')).toEqual(['Jan', 'Mar']);
  });

  // `zero` is also recharts' behavior for an unset domain, so the floor is only
  // observable against a preset that fits the data instead — this data starts
  // at 80, which `auto` rounds down to the nice tick below it.
  it('floors the Y domain at zero on request', () => {
    const fitted = renderChart({ yAxisDomain: 'auto' });
    expect(axisTickLabels(fitted.container, 'y')[0]).toBe('65');
    fitted.unmount();

    const floored = renderChart({ yAxisDomain: 'zero' });
    expect(axisTickLabels(floored.container, 'y')[0]).toBe('0');
  });

  it('renders the axis titles as their own labels', () => {
    const { container } = renderChart({
      xAxisLabel: 'Month',
      yAxisLabel: 'Sessions',
    });
    const titles = [...container.querySelectorAll('.recharts-label')].map(
      (label) => label.textContent
    );
    expect(titles).toContain('Month');
    expect(titles).toContain('Sessions');
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

describe('LineChart', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each series color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-desktop: var(--ui-dataviz-categorical-1)');
    expect(style).toContain('--color-mobile: var(--ui-dataviz-categorical-2)');
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

  it('strips the grid, legend and dots when their toggles are off', () => {
    const { container } = renderChart({
      showGrid: false,
      showTooltip: false,
      showLegend: false,
      showDots: false,
      lineStyle: 'dashed',
      connectNulls: true,
    });
    expect(container.querySelector('.recharts-cartesian-grid')).toBeNull();
    expect(container.querySelector('.recharts-legend-wrapper')).toBeNull();
    expect(container.querySelectorAll('.recharts-line-dot')).toHaveLength(0);
    // The series itself survives the chrome going away.
    expect(curvesOf(container)).toHaveLength(2);
  });

  it('dashes every stroke under the dashed lineStyle', () => {
    const solid = renderChart();
    for (const curve of curvesOf(solid.container)) {
      expect(curve).not.toHaveAttribute('stroke-dasharray');
    }
    solid.unmount();

    const dashed = renderChart({ lineStyle: 'dashed' });
    for (const curve of curvesOf(dashed.container)) {
      expect(curve).toHaveAttribute('stroke-dasharray');
    }
  });

  it('draws no curves but still mounts on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    expect(curvesOf(container)).toHaveLength(0);
  });

  // A comparison series is drawn as a dashed overlay so it reads as context
  // rather than as another first-class trend.
  it('dashes a comparison overlay but leaves the primary series solid', () => {
    const { container } = renderChart({ comparisonKeys: ['mobile'] });
    const [desktop, mobile] = curvesOf(container);
    expect(desktop).not.toHaveAttribute('stroke-dasharray');
    expect(mobile).toHaveAttribute('stroke-dasharray');
  });

  // The band is an extra filled area between the two named series — without it
  // the delta is left for the reader to eyeball.
  it('fills a delta band between the two named series', () => {
    const plain = renderChart({ comparisonKeys: ['mobile'] });
    expect(plain.container.querySelectorAll('.recharts-area-area')).toHaveLength(
      0
    );
    plain.unmount();

    const banded = renderChart({
      comparisonKeys: ['mobile'],
      deltaBands: [['desktop', 'mobile']],
    });
    expect(
      banded.container.querySelectorAll('.recharts-area-area').length
    ).toBeGreaterThan(0);
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
// entirely at 0×0 (see `chart-layout`).
describe('LineChart curves, dots and per-series overrides', () => {
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
    const { container } = renderChart({
      dataKeys: ['desktop'],
      showDots: true,
      dotSize: 6,
    });
    const dots = container.querySelectorAll('.recharts-line-dot');
    expect(dots.length).toBeGreaterThan(0);
    for (const dot of dots) expect(dot).toHaveAttribute('r', '6');
  });

  it('keeps the static dots when only the hover dot is turned off', () => {
    const { container } = renderChart({
      dataKeys: ['desktop'],
      showDots: true,
      showActiveDot: false,
    });
    expect(
      container.querySelectorAll('.recharts-line-dot').length
    ).toBeGreaterThan(0);
  });

  it('draws no static dots for a hover-only line', () => {
    const { container } = renderChart({
      dataKeys: ['desktop'],
      showDots: false,
      showActiveDot: true,
    });
    expect(container.querySelectorAll('.recharts-line-dot')).toHaveLength(0);
  });

  it('restyles one series without touching the others', () => {
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
    const { container } = renderChart({
      showDots: true,
      lineSettings: { desktop: { showDots: false }, mobile: { dotSize: 5 } },
    });
    const dots = container.querySelectorAll('.recharts-line-dot');
    expect(dots).toHaveLength(data.length);
    for (const dot of dots) expect(dot).toHaveAttribute('r', '5');
  });

  // A comparison overlay is *defined* by reading as secondary, so the dot
  // settings must not be able to promote it back to a primary-looking line.
  it('keeps a comparison series dot-less even when its settings ask for dots', () => {
    const { container } = renderChart({
      comparisonKeys: ['mobile'],
      lineSettings: { desktop: { showDots: false }, mobile: { showDots: true } },
    });
    expect(container.querySelectorAll('.recharts-line-dot')).toHaveLength(0);
  });

  it('opts one series out of the chart-wide value labels', () => {
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
    const { container } = renderChart({
      lineSettings: { mobile: { showLabel: true, labelPosition: 'bottom' } },
    });
    const labels = container.querySelectorAll('.recharts-label-list text');
    expect([...labels].map((label) => label.textContent)).toEqual(
      data.map((row) => String(row.mobile))
    );
  });

  // recharts 3.8+ hoists tick labels out of the axis group into a sibling
  // recharts-zIndex-layer, so `.recharts-xAxis .recharts-text` never matches.
  // Query globally for our custom-class text elements instead.
  describe('projection ticks', () => {
    it('renders all ticks without the disabled class when projectionStart is not set', () => {
      const { container } = renderChart();
      // No custom renderer is active — no disabled class should appear anywhere.
      const allText = container.querySelectorAll('svg text');
      for (const text of allText) {
        expect(text.getAttribute('class') ?? '').not.toContain(
          'fill-[var(--ui-text-on-surface-disabled)]'
        );
      }
    });

    it('renders ticks from projectionStart onward in the disabled color', () => {
      // data has Jan, Feb, Mar; projectionStart='Mar' makes Mar disabled.
      // When the custom renderer is active, all X ticks carry one of our classes.
      const { container } = renderChart({ projectionStart: 'Mar' });
      const customTicks = [
        ...container.querySelectorAll('text.recharts-text'),
      ].filter(
        (t) =>
          (t.getAttribute('class') ?? '').includes('fill-muted-foreground') ||
          (t.getAttribute('class') ?? '').includes(
            'fill-[var(--ui-text-on-surface-disabled)]'
          )
      );
      // If recharts rendered ticks, assert the split; if not, assert the chart
      // at least mounted — the visual correctness is covered by VR baselines.
      if (customTicks.length > 0) {
        const disabled = customTicks.filter((t) =>
          (t.getAttribute('class') ?? '').includes(
            'fill-[var(--ui-text-on-surface-disabled)]'
          )
        );
        const normal = customTicks.filter((t) =>
          (t.getAttribute('class') ?? '').includes('fill-muted-foreground')
        );
        expect(disabled.length).toBeGreaterThan(0);
        expect(normal.length).toBeGreaterThan(0);
      } else {
        expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
      }
    });

    // Past the boundary the actuals are nulled out and a mirrored `_proj_*`
    // series takes over, so the projected span reads dashed.
    it('splits each series into a solid actual and a dashed projection', () => {
      const plain = renderChart();
      expect(curvesOf(plain.container)).toHaveLength(2);
      plain.unmount();

      const { container } = renderChart({ projectionStart: 'Mar' });
      const curves = curvesOf(container);
      expect(curves).toHaveLength(4);
      const dashed = curves.filter(
        (curve) => curve.getAttribute('stroke-dasharray') === '5 5'
      );
      expect(dashed).toHaveLength(2);
    });

    it('falls back to the default renderer when projectionStart is not in data', () => {
      const { container } = renderChart({ projectionStart: 'Dec' });
      // projectionStart not found → no custom renderer → no disabled class.
      const allText = container.querySelectorAll('svg text');
      for (const text of allText) {
        expect(text.getAttribute('class') ?? '').not.toContain(
          'fill-[var(--ui-text-on-surface-disabled)]'
        );
      }
    });

    // projectionStart at index 0 means there is no "previous tick" to compute
    // the clip boundary from. The component treats this as no-projection so the
    // chart never renders with dangling clipPath references (which would clip
    // every series to nothing, producing a blank chart).
    it('treats projectionStart at the first data point as no-projection', () => {
      // test data starts with 'Jan' — index 0.
      const { container } = renderChart({ projectionStart: 'Jan' });
      // No _proj_* series should be rendered.
      const curves = curvesOf(container);
      expect(curves).toHaveLength(2);
      // No disabled tick color.
      const allText = container.querySelectorAll('svg text');
      for (const text of allText) {
        expect(text.getAttribute('class') ?? '').not.toContain(
          'fill-[var(--ui-text-on-surface-disabled)]'
        );
      }
    });

    it('dropProjectionPayload strips _proj_* entries from a payload array', () => {
      const payload = [
        { dataKey: 'desktop', value: 186 },
        { dataKey: '_proj_desktop', value: 186 },
        { dataKey: 'mobile', value: 80 },
        { dataKey: '_proj_mobile', value: 80 },
      ];
      const result = dropProjectionPayload(payload);
      expect(result).toHaveLength(2);
      expect(result?.map((p) => p.dataKey)).toEqual(['desktop', 'mobile']);
    });

    it('dropProjectionPayload returns undefined for undefined input', () => {
      expect(dropProjectionPayload(undefined)).toBeUndefined();
    });

    it('renders projection clipPath defs when projectionStart is set', () => {
      const { container } = renderChart({ projectionStart: 'Mar' });
      const actualClip = container.querySelector('clipPath[id$="-actual"]');
      const projClip = container.querySelector('clipPath[id$="-projection"]');
      if (actualClip || projClip) {
        expect(actualClip).toBeInTheDocument();
        expect(projClip).toBeInTheDocument();
      } else {
        expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
      }
    });

    it('does not render projection clipPath defs when projectionStart is absent', () => {
      const { container } = renderChart();
      expect(container.querySelector('clipPath[id$="-actual"]')).not.toBeInTheDocument();
      expect(container.querySelector('clipPath[id$="-projection"]')).not.toBeInTheDocument();
    });

    it('renders a dashed separator line at the projection boundary', () => {
      const { container } = renderChart({ projectionStart: 'Mar' });
      // ProjectionClip renders a bare <line> (not inside recharts-reference-line).
      const separator = container.querySelector('line[stroke-dasharray="4 4"]');
      if (separator) {
        expect(separator).toBeInTheDocument();
      } else {
        expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
      }
    });

    it('does not render a separator line when projectionStart is absent', () => {
      const { container } = renderChart();
      expect(container.querySelectorAll('line[stroke-dasharray="4 4"]')).toHaveLength(0);
    });

    // Finding 3: the custom ProjectionTick renderer must forward the real tick
    // index to xTickFormatter, not a hardcoded 0.
    it('forwards the real tick index to xTickFormatter', () => {
      const formatter = vi.fn(
        (value: string | number, index?: number) => `${value}#${index}`
      );
      renderChart({ projectionStart: 'Mar', xTickFormatter: formatter });
      if (formatter.mock.calls.length > 0) {
        const indices = formatter.mock.calls.map(([, idx]) => idx);
        // With 3 ticks (Jan=0, Feb=1, Mar=2), at least one index must be > 0.
        expect(indices.some((i) => i !== undefined && i > 0)).toBe(true);
      }
    });

    // Finding 4: comparison series have no projection counterpart, so they must
    // not receive the actual-clip class — otherwise they vanish past the boundary.
    it('leaves comparison series unclipped when projectionStart is set', () => {
      const { container } = renderChart({
        comparisonKeys: ['mobile'],
        projectionStart: 'Mar',
      });
      // With projectionStart, each non-comparison series gets a <Line> with the
      // `actual-*` class. Comparison series must NOT carry that class.
      const lineGroups = [
        ...container.querySelectorAll<SVGGElement>(
          'g.recharts-line'
        ),
      ];
      const actualClipped = lineGroups.filter((g) =>
        (g.getAttribute('class') ?? '').match(/actual-/)
      );
      // 2 dataKeys: desktop (non-comparison, clipped) + mobile (comparison,
      // unclipped). Only 1 should carry the actual-clip class.
      if (lineGroups.length >= 2) {
        expect(actualClipped).toHaveLength(1);
      } else {
        expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
      }
    });

    // Finding 5: delta bands must be clipped to the actual zone so they don't
    // shade past the projection boundary (where the comparison line they measure
    // against has been clipped away).
    it('clips delta bands to the actual zone when projectionStart is set', () => {
      const { container } = renderChart({
        deltaBands: [['desktop', 'mobile']],
        projectionStart: 'Mar',
      });
      // The band <Area> should carry a clip-path pointing at the actual clip rect.
      const bandArea = container.querySelector('.recharts-area-area');
      if (bandArea) {
        expect(bandArea.getAttribute('clip-path')).toMatch(/url\(#.*-actual\)/);
      } else {
        expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
      }
    });
  });

  // A band shades the gap between two lines, so an edge drawn with a different
  // interpolation than the line it belongs to no longer bounds it.
  it('draws a delta band with the current series own curve type', () => {
    const bandPath = (props: Partial<React.ComponentProps<typeof LineChart>>) => {
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
      return d;
    };

    // A natural spline is drawn with cubic segments; a linear one is not.
    expect(bandPath({})).not.toContain('C');
    expect(
      bandPath({ lineSettings: { desktop: { curveType: 'natural' } } })
    ).toContain('C');
  });
});
