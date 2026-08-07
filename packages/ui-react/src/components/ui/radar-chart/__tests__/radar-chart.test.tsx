import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  RadarChart,
  radarRadiusAxisDomain,
  radarSeriesStyle,
} from '../radar-chart';
import {
  ChartTooltipContent,
  type ChartConfig,
  resolveAnimation,
} from '../../chart';
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  giveEveryChartASize,
} from '../../chart/__tests__/chart-layout';

// The web, axes, series and labels asserted below are painted SVG, which
// recharts skips entirely at 0×0.
giveEveryChartASize();

const data = [
  { subject: 'Math', alice: 120, bob: 110 },
  { subject: 'English', alice: 86, bob: 130 },
  { subject: 'Physics', alice: 85, bob: 90 },
  { subject: 'History', alice: 65, bob: 85 },
];

const config = {
  alice: { label: 'Alice', color: 'rgb(23 99 207)' },
  bob: { label: 'Bob', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof RadarChart>> = {}
) {
  return render(
    <RadarChart
      config={config}
      data={data}
      dataKeys={['alice', 'bob']}
      angleKey="subject"
      {...props}
    />
  );
}

// The centre of the web, and the radius the outermost ring is drawn at, for the
// faked layout: recharts takes `outerRadius="80%"` of half the shorter side of
// the plot area, which is the container minus its default 5px margins.
const CENTRE_X = CHART_WIDTH / 2;
const CENTRE_Y = CHART_HEIGHT / 2;
const OUTER_RADIUS = 0.8 * ((Math.min(CHART_WIDTH, CHART_HEIGHT) - 10) / 2);

/**
 * Render with the legend and tooltip off, so the geometry helpers below see the
 * plot's elements and nothing else. The size itself is suite-level (see the top
 * of the file) — it is what makes that geometry exist at all.
 */
function renderSized(
  props: Partial<React.ComponentProps<typeof RadarChart>> = {}
) {
  return renderChart({ showLegend: false, showTooltip: false, ...props });
}

/** The value-scale ticks, with each one's distance from the centre. */
function radiusAxisTicks(container: HTMLElement) {
  return [
    ...container.querySelectorAll('.recharts-polar-radius-axis-tick-value'),
  ].map((tick) => ({
    value: tick.textContent,
    radius: Number(tick.getAttribute('x')) - CENTRE_X,
  }));
}

/** The category (spoke) labels around the web. */
function categoryTicks(container: HTMLElement) {
  return [
    ...container.querySelectorAll('.recharts-polar-angle-axis-tick-value'),
  ].map((tick) => tick.textContent);
}

/** One `<path>` per plotted series, in `dataKeys` order. */
function seriesAreas(container: HTMLElement) {
  return [
    ...container.querySelectorAll('.recharts-radar-polygon .recharts-polygon'),
  ];
}

/**
 * How far the first category's vertex sits from the centre. The first row is
 * drawn at `startAngle` (12 o'clock by default) and is the `M` point of the
 * area's path, so this is the radius the radius axis mapped that value to —
 * i.e. the scale, measured off the rendered geometry.
 */
function firstVertexRadius(area: Element) {
  const [x, y] = area
    .getAttribute('d')!
    .slice(1)
    .split('L')[0]
    .split(',')
    .map(Number);
  return Math.hypot(x - CENTRE_X, y - CENTRE_Y);
}

describe('RadarChart', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each series color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-alice: rgb(23 99 207)');
    expect(style).toContain('--color-bob: rgb(220 53 69)');
  });

  it('defaults to a polygon grid', () => {
    const { container } = renderChart();
    expect(container.firstElementChild).toHaveAttribute(
      'data-grid-type',
      'polygon'
    );
  });

  it('reflects the circle grid-type variant on the root', () => {
    const { container } = renderChart({ gridType: 'circle' });
    expect(container.firstElementChild).toHaveAttribute(
      'data-grid-type',
      'circle'
    );
  });

  it('draws no web but still mounts on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    expect(seriesAreas(container)).toHaveLength(0);
    // No rows means no categories either, so the grid has no spokes to hang off.
    expect(categoryTicks(container)).toEqual([]);
    expect(
      container.querySelector('.recharts-polar-grid')
    ).not.toBeInTheDocument();
  });

  it('forwards a ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    renderChart({ ref });
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a caller className onto the root', () => {
    const { container } = renderChart({ className: 'h-[360px] w-[360px]' });
    expect(container.firstElementChild).toHaveClass('h-[360px]', 'w-[360px]');
  });

  // The tooltip is hover-only, so this guards the prop path — consumers
  // customize the tooltip without importing recharts.
  it('accepts a custom tooltipContent', () => {
    const { container } = renderChart({
      tooltipContent: (
        <ChartTooltipContent
          formatter={(value) => <span>{String(value)}</span>}
        />
      ),
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});

// The motion itself is a visual-regression concern; what matters here is that
// `animate` resolves to the reduced-motion-aware value rather than a literal
// `true`, and that turning the whole prop set on still paints every series.
describe('RadarChart animation', () => {
  it('is not animated unless asked', () => {
    expect(resolveAnimation({})).toEqual({ isAnimationActive: false });
  });

  it('resolves animate to "auto" so prefers-reduced-motion is honored', () => {
    expect(resolveAnimation({ animate: true, animationDuration: 800 })).toEqual(
      { isAnimationActive: 'auto', animationDuration: 800 }
    );
  });

  // An animated radar starts collapsed on its centre and grows outward, so the
  // vertices are the first frame rather than the final scale — what this pins is
  // that every series is still painted, from its own config color.
  it('still draws every series with the full animation prop set', async () => {
    const { container } = renderChart({
      animate: true,
      animationDuration: 400,
      animationBegin: 50,
      animationEasing: 'ease-in-out',
    });
    await waitFor(() => expect(seriesAreas(container)).toHaveLength(2));
    expect(
      seriesAreas(container).map((area) => area.getAttribute('fill'))
    ).toEqual(['var(--color-alice)', 'var(--color-bob)']);
  });
});

describe('RadarChart data labels', () => {
  /** Every value label, with its baseline y. */
  function valueLabels(container: HTMLElement) {
    return [...container.querySelectorAll('.recharts-label-list text')].map(
      (label) => ({
        text: label.textContent,
        y: Number(label.getAttribute('y')),
      })
    );
  }

  it('renders no value labels unless asked', () => {
    const { container } = renderSized();
    expect(valueLabels(container)).toEqual([]);
  });

  it('labels every point of every series, through the formatter', () => {
    const { container } = renderSized({
      showLabels: true,
      labelFormatter: (value) => `${value} u`,
    });
    expect(valueLabels(container).map((label) => label.text)).toEqual([
      '120 u',
      '86 u',
      '85 u',
      '65 u',
      '110 u',
      '130 u',
      '90 u',
      '85 u',
    ]);
  });

  // A radar area is a flat fillOpacity, so an inside label sits on the surface
  // *tinted by* the series color rather than on the color itself — hence the
  // on-surface token, not the on-fill one, at either position.
  it('renders the labels in the on-surface fill token', () => {
    const { container } = renderSized({ showLabels: true });
    const labels = container.querySelectorAll('.recharts-label-list text');
    expect(labels.length).toBeGreaterThan(0);
    for (const label of labels)
      expect(label.getAttribute('class')).toContain(
        'fill-[var(--ui-text-on-surface-primary)]'
      );
  });

  it('offsets the label above its vertex by default, and onto it at center', () => {
    const domain = {
      radiusAxisDomain: 'fixed',
      radiusAxisDomainMax: 150,
    } as const;
    const vertexY = CENTRE_Y - (120 / 150) * OUTER_RADIUS;

    const top = renderSized({ showLabels: true, ...domain });
    expect(valueLabels(top.container)[0].y).toBeCloseTo(vertexY - 5, 1);

    const centre = renderSized({
      showLabels: true,
      labelPosition: 'center',
      ...domain,
    });
    expect(valueLabels(centre.container)[0].y).toBeCloseTo(vertexY, 1);
  });

  /** How far the first category's label sits beyond the outer ring. */
  function categoryTickClearance(container: HTMLElement) {
    const tick = container.querySelector(
      '.recharts-polar-angle-axis-tick-value'
    );
    return CENTRE_Y - Number(tick!.getAttribute('y')) - OUTER_RADIUS;
  }

  // recharts gives a Radar's label list a cartesian viewBox, so `top` offsets
  // straight up in screen space — at the topmost vertex the value would land on
  // that category's own tick. Widening the tick gap is the only lever that adds
  // absolute clearance, so `showLabels` does it on the caller's behalf.
  it('pushes the category labels out to clear the value labels', () => {
    const withLabels = renderSized({ showLabels: true });
    const withoutLabels = renderSized();
    expect(categoryTickClearance(withLabels.container)).toBeGreaterThan(
      categoryTickClearance(withoutLabels.container)
    );
  });

  it('lets an explicit angleTickSize win over that widening', () => {
    const { container } = renderSized({ showLabels: true, angleTickSize: 16 });
    expect(categoryTickClearance(container)).toBeCloseTo(16, 1);
  });
});

// The radius axis is what maps a value to a radius, so its domain decides
// whether a radar reads as an absolute profile or a relative one. That mapping is
// pure, so its edge cases are asserted directly here — the scale it produces is
// measured off the rendered geometry in `RadarChart radius axis` below.
describe('radarRadiusAxisDomain', () => {
  it('leaves an unset preset to recharts (the data max)', () => {
    expect(radarRadiusAxisDomain(undefined, undefined)).toBeUndefined();
    // A maximum on its own does nothing — it only applies under `fixed`.
    expect(radarRadiusAxisDomain(undefined, 150)).toBeUndefined();
  });

  it('pins the outer ring to the given maximum under "fixed"', () => {
    expect(radarRadiusAxisDomain('fixed', 150)).toEqual([0, 150]);
  });

  it('falls back to the data top when "fixed" has no maximum', () => {
    expect(radarRadiusAxisDomain('fixed', undefined)).toEqual([0, 'auto']);
  });

  it('fits the data at both ends under "auto"', () => {
    expect(radarRadiusAxisDomain('auto', 150)).toEqual(['auto', 'auto']);
    expect(radarRadiusAxisDomain('auto', undefined)).toEqual(['auto', 'auto']);
  });

  // A maximum that can't bound a scale growing outward from 0 would collapse the
  // web onto its centre (0) or invert it (negative). A computed max reaches this
  // — `Math.max` over an empty or all-zero series is 0 — so it has to degrade to
  // the data's own top rather than render nothing.
  it('ignores a maximum that cannot bound the scale', () => {
    expect(radarRadiusAxisDomain('fixed', 0)).toEqual([0, 'auto']);
    expect(radarRadiusAxisDomain('fixed', -5)).toEqual([0, 'auto']);
    expect(radarRadiusAxisDomain('fixed', Number.NaN)).toEqual([0, 'auto']);
    expect(radarRadiusAxisDomain('fixed', Number.POSITIVE_INFINITY)).toEqual([
      0,
      'auto',
    ]);
  });
});

// The per-series fold is the other half of the composition that is pure, so its
// full override matrix is asserted directly here — cheaper than a render per
// combination. That the resolved values actually reach the `<Radar>` is covered
// by the rendered per-series tests below.
describe('radarSeriesStyle', () => {
  const defaults = {
    fillOpacity: 0.3,
    strokeWidth: 2,
    showDots: false,
    dotRadius: 3,
    activeDot: undefined,
  };

  it('falls back to the config-injected custom property for an unnamed series', () => {
    expect(radarSeriesStyle('alice', undefined, defaults)).toEqual({
      fill: 'var(--color-alice)',
      stroke: 'var(--color-alice)',
      fillOpacity: 0.3,
      strokeWidth: 2,
      dot: false,
      activeDot: undefined,
    });
  });

  it('applies an overridden color to both the fill and the outline', () => {
    const style = radarSeriesStyle('alice', { color: 'rgb(1 2 3)' }, defaults);
    expect(style.fill).toBe('rgb(1 2 3)');
    expect(style.stroke).toBe('rgb(1 2 3)');
  });

  it('keeps an explicit stroke distinct from the fill', () => {
    const style = radarSeriesStyle(
      'alice',
      { color: 'rgb(1 2 3)', stroke: 'rgb(4 5 6)' },
      defaults
    );
    expect(style.fill).toBe('rgb(1 2 3)');
    expect(style.stroke).toBe('rgb(4 5 6)');
  });

  // A stroke on its own still leaves the fill on the config color — which is also
  // why it moves the legend swatch: recharts reads a Radar's marker color from
  // the stroke first.
  it('leaves the fill on the config color when only the stroke is set', () => {
    const style = radarSeriesStyle('alice', { stroke: 'rgb(4 5 6)' }, defaults);
    expect(style.fill).toBe('var(--color-alice)');
    expect(style.stroke).toBe('rgb(4 5 6)');
  });

  it('sizes a per-series dot, and opts one series in while the chart is off', () => {
    expect(radarSeriesStyle('alice', { dot: true }, defaults).dot).toEqual({
      r: 3,
    });
    expect(
      radarSeriesStyle('alice', { dot: true, dotRadius: 6 }, defaults).dot
    ).toEqual({ r: 6 });
    expect(
      radarSeriesStyle('alice', undefined, { ...defaults, showDots: true }).dot
    ).toEqual({ r: 3 });
  });

  // Every override is `??`, not `||` — a deliberate falsy value has to beat a
  // truthy chart-level one, or "outline only" and "opt this series out of the
  // dots" are both unreachable.
  it('honors a falsy override over a truthy chart-level value', () => {
    const chartLevel = {
      fillOpacity: 0.3,
      strokeWidth: 2,
      showDots: true,
      dotRadius: 3,
      activeDot: true,
    };
    const style = radarSeriesStyle(
      'alice',
      { fillOpacity: 0, strokeWidth: 0, dot: false, activeDot: false },
      chartLevel
    );
    expect(style.fillOpacity).toBe(0);
    expect(style.strokeWidth).toBe(0);
    expect(style.dot).toBe(false);
    expect(style.activeDot).toBe(false);
  });
});

// These assert the rendered recharts output, not just that the props are
// accepted: with a faked layout (see `chart-layout`) the axes, grid and series
// all reach the DOM, so the scale a value is mapped to can be measured off the
// geometry rather than left to the VR stories.
describe('RadarChart radius axis', () => {
  // The radius axis is what maps a value to a radius, so a fixed domain is the
  // difference between "the largest value in the data reaches the outer ring"
  // and "the outer ring is 150" — i.e. between a relative and an absolute
  // profile.
  it('scales the web to a fixed domain maximum instead of the data top', () => {
    const { container } = renderSized({
      showRadiusAxis: true,
      radiusAxisDomain: 'fixed',
      radiusAxisDomainMax: 150,
    });

    const ticks = radiusAxisTicks(container);
    expect(ticks.map((tick) => tick.value)).toEqual([
      '0',
      '40',
      '80',
      '120',
      '150',
    ]);
    // The domain maximum is the outer ring, and 0 the centre.
    expect(ticks[0].radius).toBeCloseTo(0, 1);
    expect(ticks[4].radius).toBeCloseTo(OUTER_RADIUS, 1);

    // Alice's first value is 120, so its vertex sits at 120/150 of the radius.
    expect(firstVertexRadius(seriesAreas(container)[0])).toBeCloseTo(
      (120 / 150) * OUTER_RADIUS,
      1
    );
  });

  it('leaves the data top reaching the outer ring without a fixed domain', () => {
    const { container } = renderSized();
    // Same value, more of the radius: recharts scales to the data instead, so
    // this vertex is further out than the 120/150 above. (The exact radius is
    // recharts' own nicing of the 130 data top, which is not ours to pin.)
    expect(firstVertexRadius(seriesAreas(container)[0])).toBeGreaterThan(
      (120 / 150) * OUTER_RADIUS
    );
  });

  it('inverts the scale so the maximum sits at the centre when reversed', () => {
    const { container } = renderSized({
      showRadiusAxis: true,
      radiusAxisDomain: 'fixed',
      radiusAxisDomainMax: 150,
      radiusAxisReversed: true,
    });

    const ticks = radiusAxisTicks(container);
    expect(ticks.map((tick) => tick.value)).toEqual([
      '0',
      '40',
      '80',
      '120',
      '150',
    ]);
    // Same tick values, opposite ends: 0 is now the outer ring and 150 the centre.
    expect(ticks[0].radius).toBeCloseTo(OUTER_RADIUS, 1);
    expect(ticks[4].radius).toBeCloseTo(0, 1);

    // So a high value plots *near* the centre — 120 of 150 leaves 1/5 of the radius.
    expect(firstVertexRadius(seriesAreas(container)[0])).toBeCloseTo(
      (1 - 120 / 150) * OUTER_RADIUS,
      1
    );
  });

  // The axis is mounted for a domain or a reversal even with the scale hidden —
  // that is how a chart is scaled to a known maximum without showing the ticks.
  it('rescales the web while the scale itself stays hidden', () => {
    const { container } = renderSized({
      showRadiusAxis: false,
      radiusAxisDomain: 'fixed',
      radiusAxisDomainMax: 150,
    });
    expect(radiusAxisTicks(container)).toEqual([]);
    expect(
      container.querySelector('.recharts-polar-radius-axis-line')
    ).not.toBeInTheDocument();
    expect(firstVertexRadius(seriesAreas(container)[0])).toBeCloseTo(
      (120 / 150) * OUTER_RADIUS,
      1
    );
  });

  it('takes the grid ring count from the radius-axis tick count', () => {
    const { container } = renderSized({
      radiusAxisTickCount: 4,
      showRadiusAxis: true,
      radiusAxisDomain: 'fixed',
      radiusAxisDomainMax: 150,
    });
    expect(radiusAxisTicks(container).map((tick) => tick.value)).toEqual([
      '0',
      '50',
      '100',
      '150',
    ]);
    expect(
      container.querySelectorAll('.recharts-polar-grid-concentric-polygon')
    ).toHaveLength(4);
  });
});

describe('RadarChart angle axis and grid', () => {
  it('labels each spoke with its category', () => {
    const { container } = renderSized();
    expect(categoryTicks(container)).toEqual([
      'Math',
      'English',
      'Physics',
      'History',
    ]);
  });

  // `showAngleAxis` hides the chrome rather than dropping the axis: the angle
  // axis is also what maps a row to its category name, so removing it would
  // leave the tooltip labelling rows by index.
  it('hides the angle-axis chrome but keeps the axis mounted', () => {
    const { container } = renderSized({ showAngleAxis: false });
    expect(categoryTicks(container)).toEqual([]);
    expect(
      container.querySelector('.recharts-polar-angle-axis')
    ).toBeInTheDocument();
    expect(
      container.querySelector('.recharts-polar-angle-axis-line')
    ).not.toBeInTheDocument();
    expect(
      container.querySelectorAll('.recharts-polar-angle-axis-tick-line')
    ).toHaveLength(0);
  });

  it('drops the axis line and tick lines while keeping the labels', () => {
    const { container } = renderSized({
      angleAxisLine: false,
      angleTickLine: false,
    });
    expect(categoryTicks(container)).toHaveLength(4);
    expect(
      container.querySelector('.recharts-polar-angle-axis-line')
    ).not.toBeInTheDocument();
    expect(
      container.querySelectorAll('.recharts-polar-angle-axis-tick-line')
    ).toHaveLength(0);
  });

  it('draws the web as polygon rings plus spokes by default', () => {
    const { container } = renderSized();
    expect(
      container.querySelectorAll('.recharts-polar-grid-concentric-polygon')
    ).toHaveLength(5);
    expect(
      container.querySelectorAll('.recharts-polar-grid-angle line')
    ).toHaveLength(4);
  });

  it('draws circle rings under the circle grid-type variant', () => {
    const { container } = renderSized({ gridType: 'circle' });
    expect(
      container.querySelectorAll('.recharts-polar-grid-concentric-circle')
    ).toHaveLength(5);
    expect(
      container.querySelectorAll('.recharts-polar-grid-concentric-polygon')
    ).toHaveLength(0);
  });

  it('keeps the rings but drops the spokes when radialLines is off', () => {
    const { container } = renderSized({ radialLines: false });
    expect(
      container.querySelectorAll('.recharts-polar-grid-concentric-polygon')
    ).toHaveLength(5);
    expect(
      container.querySelectorAll('.recharts-polar-grid-angle line')
    ).toHaveLength(0);
  });

  it('drops the whole grid when showGrid is off', () => {
    const { container } = renderSized({ showGrid: false });
    expect(
      container.querySelector('.recharts-polar-grid')
    ).not.toBeInTheDocument();
    // The areas still render — the grid is chrome, not the plot.
    expect(seriesAreas(container)).toHaveLength(2);
  });
});

describe('RadarChart per-series styling', () => {
  it('paints each series from its config custom property', () => {
    const { container } = renderSized();
    const [alice, bob] = seriesAreas(container);
    for (const [area, key] of [
      [alice, 'alice'],
      [bob, 'bob'],
    ] as const) {
      expect(area).toHaveAttribute('fill', `var(--color-${key})`);
      expect(area).toHaveAttribute('stroke', `var(--color-${key})`);
      expect(area).toHaveAttribute('fill-opacity', '0.3');
      expect(area).toHaveAttribute('stroke-width', '2');
    }
  });

  it('applies an override to the named series only', () => {
    const { container } = renderSized({
      seriesSettings: {
        alice: {
          color: 'rgb(1 2 3)',
          stroke: 'rgb(4 5 6)',
          fillOpacity: 0.05,
          strokeWidth: 3,
        },
      },
    });
    const [alice, bob] = seriesAreas(container);

    expect(alice).toHaveAttribute('fill', 'rgb(1 2 3)');
    expect(alice).toHaveAttribute('stroke', 'rgb(4 5 6)');
    expect(alice).toHaveAttribute('fill-opacity', '0.05');
    expect(alice).toHaveAttribute('stroke-width', '3');

    // The series the caller didn't name keeps reading its config color.
    expect(bob).toHaveAttribute('fill', 'var(--color-bob)');
    expect(bob).toHaveAttribute('fill-opacity', '0.3');
    expect(bob).toHaveAttribute('stroke-width', '2');

    // A per-series color styles the series, it doesn't rewrite the
    // `--color-<key>` custom properties `config` injects.
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-alice: rgb(23 99 207)');
    expect(style).toContain('--color-bob: rgb(220 53 69)');
  });

  // `fillOpacity: 0` is "outline only" and `strokeWidth: 0` is "fill only", so a
  // falsy override has to beat the truthy chart-level value in the DOM too, not
  // just in `radarSeriesStyle`.
  it('honors a falsy override over the chart-level value', () => {
    const { container } = renderSized({
      fillOpacity: 0.4,
      strokeWidth: 4,
      seriesSettings: { alice: { fillOpacity: 0, strokeWidth: 0 } },
    });
    const [alice, bob] = seriesAreas(container);
    expect(alice).toHaveAttribute('fill-opacity', '0');
    expect(alice).toHaveAttribute('stroke-width', '0');
    expect(bob).toHaveAttribute('fill-opacity', '0.4');
    expect(bob).toHaveAttribute('stroke-width', '4');
  });

  it('renders no dots unless asked', () => {
    const { container } = renderSized();
    expect(container.querySelectorAll('.recharts-radar-dot')).toHaveLength(0);
  });

  it('sizes the dots per series, one per row', () => {
    const { container } = renderSized({
      showDots: true,
      dotRadius: 3,
      seriesSettings: { alice: { dotRadius: 5 } },
    });
    // Four rows × two series, the overridden series first (`dataKeys` order).
    expect(
      [...container.querySelectorAll('.recharts-radar-dot')].map((dot) =>
        dot.getAttribute('r')
      )
    ).toEqual(['5', '5', '5', '5', '3', '3', '3', '3']);
  });

  it('opts one series into dots while the chart-level default is off', () => {
    const { container } = renderSized({
      seriesSettings: { alice: { dot: true, dotRadius: 4 } },
    });
    expect(
      [...container.querySelectorAll('.recharts-radar-dot')].map((dot) =>
        dot.getAttribute('r')
      )
    ).toEqual(['4', '4', '4', '4']);
  });

  it('ignores seriesSettings keys that are not plotted', () => {
    const { container } = renderSized({
      dataKeys: ['alice'],
      seriesSettings: { carol: { fillOpacity: 0.9 } },
    });
    const areas = seriesAreas(container);
    expect(areas).toHaveLength(1);
    expect(areas[0]).toHaveAttribute('fill-opacity', '0.3');
  });
});

describe('RadarChart geometry and legend', () => {
  it('centres the web on cx/cy and sizes it from outerRadius', () => {
    const { container } = renderSized({
      cx: 200,
      cy: 150,
      outerRadius: 100,
      radiusAxisDomain: 'fixed',
      radiusAxisDomainMax: 150,
    });
    // The first vertex is straight up from the centre at the default startAngle.
    const [x, y] = seriesAreas(container)[0]
      .getAttribute('d')!
      .slice(1)
      .split('L')[0]
      .split(',')
      .map(Number);
    expect(x).toBeCloseTo(200, 1);
    expect(y).toBeCloseTo(150 - (120 / 150) * 100, 1);
  });

  it('lifts the web off the centre with an innerRadius', () => {
    const { container } = renderSized({
      innerRadius: 40,
      outerRadius: 140,
      radiusAxisDomain: 'fixed',
      radiusAxisDomainMax: 150,
    });
    // The scale now runs from 40 to 140, so a value maps into that band.
    expect(firstVertexRadius(seriesAreas(container)[0])).toBeCloseTo(
      40 + (120 / 150) * 100,
      1
    );
  });

  it('renders a legend entry per series, labelled from config', () => {
    const { container } = renderChart({ legendPosition: 'top' });
    expect(
      [...container.querySelectorAll('.recharts-legend-wrapper div div')].map(
        (item) => item.textContent
      )
    ).toEqual(expect.arrayContaining(['Alice', 'Bob']));
  });
});
