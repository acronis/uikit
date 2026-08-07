import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  RadialBarChart,
  radialBarChartBandName,
  radialBarChartLabelText,
  radialBarChartSegmentFill,
  radialBarChartSegmentedReading,
  radialBarChartSegments,
} from '../radial-bar-chart';
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

// The arcs, track and labels asserted below are painted SVG, which recharts
// skips entirely at 0×0.
giveEveryChartASize();

const data = [
  { browser: 'Chrome', value: 65 },
  { browser: 'Safari', value: 50 },
  { browser: 'Firefox', value: 35 },
  { browser: 'Edge', value: 25 },
];

const config = {
  Chrome: { label: 'Chrome', color: 'rgb(23 99 207)' },
  Safari: { label: 'Safari', color: 'rgb(220 53 69)' },
  Firefox: { label: 'Firefox', color: 'rgb(34 139 79)' },
  Edge: { label: 'Edge', color: 'rgb(212 149 42)' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof RadialBarChart>> = {}
) {
  return render(
    <RadialBarChart
      config={config}
      data={data}
      dataKey="value"
      nameKey="browser"
      {...props}
    />
  );
}

/** The value arcs, in `data` order. */
const arcsOf = (container: Element) => [
  ...container.querySelectorAll<SVGPathElement>('.recharts-radial-bar-sector'),
];

/** The unfilled remainder painted behind each arc. */
const tracksOf = (container: Element) => [
  ...container.querySelectorAll<SVGPathElement>(
    '.recharts-radial-bar-background-sector'
  ),
];

const dataLabelsOf = (container: Element) =>
  [...container.querySelectorAll('.recharts-label-list text')].map(
    (label) => label.textContent
  );

/** Every `<text>` the chart painted — the center readout, when there is one. */
const svgTextOf = (container: Element) =>
  [...container.querySelectorAll('text')].map((text) => text.textContent);

/**
 * The two great-arc radii of one arc — its outer and its inner edge, in that
 * order. recharts exposes an arc's geometry only as path data, so the radii have
 * to be read back out of `d`; render with `cornerRadius: 0` so the little
 * end-rounding arcs don't show up here too.
 */
const radiiOf = (arc: Element) =>
  [...(arc.getAttribute('d') ?? '').matchAll(/A\s*(\d+(?:\.\d+)?),/g)].map(
    (match) => Number(match[1])
  );

/**
 * Horizontal extent of an arc — a stand-in for its angular length, which recharts
 * likewise publishes only as path data. An elliptical-arc command carries seven
 * arguments and only the last two are a point, hence the parse rather than a
 * coordinate regex.
 */
function arcSpanX(arc: Element): number {
  const xs: number[] = [];
  for (const [, command, args] of (arc.getAttribute('d') ?? '').matchAll(
    /([MLA])([-\d.,\s]+)/g
  )) {
    const numbers = args
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    const stride = command === 'A' ? 7 : 2;
    for (let index = stride - 2; index < numbers.length; index += stride) {
      xs.push(numbers[index]);
    }
  }
  return Math.max(...xs) - Math.min(...xs);
}

describe('RadialBarChart', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each arc color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-Chrome: rgb(23 99 207)');
    expect(style).toContain('--color-Edge: rgb(212 149 42)');
  });

  it('draws one arc per row, filled from its config color', () => {
    const { container } = renderChart();
    expect(arcsOf(container).map((arc) => arc.getAttribute('fill'))).toEqual([
      'var(--color-Chrome)',
      'var(--color-Safari)',
      'var(--color-Firefox)',
      'var(--color-Edge)',
    ]);
  });

  // The track is the unfilled remainder behind each arc — without it a gauge
  // reads as a floating wedge with no scale to measure against.
  it('draws a background track per arc unless showBackground is off', () => {
    const withTrack = renderChart();
    expect(tracksOf(withTrack.container)).toHaveLength(4);
    withTrack.unmount();

    const bare = renderChart({ showBackground: false });
    expect(tracksOf(bare.container)).toHaveLength(0);
    expect(arcsOf(bare.container)).toHaveLength(4);
  });

  it('sweeps only the arc the start/end angles describe', () => {
    const full = renderChart();
    const fullFirst = arcsOf(full.container)[0].getAttribute('d');
    full.unmount();

    const half = renderChart({ startAngle: 180, endAngle: 0 });
    expect(arcsOf(half.container)[0].getAttribute('d')).not.toBe(fullFirst);
  });

  it('drops the legend when its toggle is off', () => {
    const { container } = renderChart({
      showTooltip: false,
      showLegend: false,
    });
    expect(container.querySelector('.recharts-legend-wrapper')).toBeNull();
  });

  it('labels the legend from config', () => {
    const { container } = renderChart({ showLegend: true });
    const legend = container.querySelector('.recharts-legend-wrapper');
    expect(legend).toHaveTextContent('Chrome');
    expect(legend).toHaveTextContent('Edge');
  });

  it('draws no arcs but still mounts on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    expect(arcsOf(container)).toHaveLength(0);
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
// `true`, and that the label props reach the painted arcs.
describe('RadialBarChart animation and data labels', () => {
  it('is not animated unless asked', () => {
    expect(resolveAnimation({})).toEqual({ isAnimationActive: false });
  });

  it('resolves animate to "auto" so prefers-reduced-motion is honored', () => {
    expect(resolveAnimation({ animate: true, animationDuration: 800 })).toEqual(
      { isAnimationActive: 'auto', animationDuration: 800 }
    );
  });

  it('still draws every arc with the full animation prop set', async () => {
    const { container } = renderChart({
      animate: true,
      animationDuration: 400,
      animationBegin: 50,
      animationEasing: 'ease-in-out',
    });
    await waitFor(() => expect(arcsOf(container)).toHaveLength(4));
  });

  it('runs the data labels through the caller formatter', () => {
    const { container } = renderChart({
      showLabels: true,
      labelFormatter: (value) => `${value} u`,
    });
    expect(dataLabelsOf(container)).toEqual(['65 u', '50 u', '35 u', '25 u']);
  });

  // A radial label is placed by transform rather than by `x`/`y`, so the whole
  // rendered element is compared: an ignored `labelPosition` would produce the
  // identical markup twice.
  it('honors an explicit labelPosition override', () => {
    const markup = (position?: 'insideEnd') => {
      const { container, unmount } = renderChart({
        showLabels: true,
        ...(position ? { labelPosition: position } : {}),
      });
      const rendered = container.querySelector(
        '.recharts-label-list'
      )!.innerHTML;
      unmount();
      return rendered;
    };
    expect(markup('insideEnd')).not.toBe(markup());
  });
});

describe('radialBarChartLabelText', () => {
  it('reads the value alone by default', () => {
    expect(
      radialBarChartLabelText({ format: 'value', name: 'Chrome', value: 65 })
    ).toBe('65');
  });

  it('prefixes the arc name under name-value', () => {
    expect(
      radialBarChartLabelText({
        format: 'name-value',
        name: 'Chrome',
        value: 65,
      })
    ).toBe('Chrome: 65');
  });

  it('formats only the numeric part, so labels match their tooltip units', () => {
    expect(
      radialBarChartLabelText({
        format: 'name-value',
        name: 'Chrome',
        value: 6500,
        formatter: (value) => `${Number(value) / 1000}k`,
      })
    ).toBe('Chrome: 6.5k');
  });

  it('falls back to the value when there is no name', () => {
    expect(
      radialBarChartLabelText({
        format: 'name-value',
        name: undefined,
        value: 65,
      })
    ).toBe('65');
  });

  // An empty string makes recharts render no <text> element at all.
  it('yields an empty label for a missing value', () => {
    expect(
      radialBarChartLabelText({
        format: 'value',
        name: 'Chrome',
        value: undefined,
      })
    ).toBe('');
  });

  // The default runtime combination: `labelFormat` is unset while a caller passes
  // `labelFormatter`, so `value` + a formatter is the pairing that actually ships.
  it('applies a formatter under the default value format', () => {
    expect(
      radialBarChartLabelText({
        format: 'value',
        name: 'Chrome',
        value: 6500,
        formatter: (value) => `${Number(value) / 1000}k`,
      })
    ).toBe('6.5k');
  });

  // A nullish value wins over the format, so `name-value` degrades to no label
  // rather than to a name with a dangling separator ("Chrome: "). PieChart and
  // FunnelChart currently degrade differently — see #617 / #622.
  it('drops the name too when the value is missing under name-value', () => {
    expect(
      radialBarChartLabelText({
        format: 'name-value',
        name: 'Chrome',
        value: undefined,
        formatter: (value) => `${value} u`,
      })
    ).toBe('');
  });

  it('renders a zero value rather than treating it as missing', () => {
    expect(
      radialBarChartLabelText({ format: 'value', name: 'Chrome', value: 0 })
    ).toBe('0');
  });
});

describe('radialBarChartSegmentFill', () => {
  it('paints a reached piece in the arc color', () => {
    expect(radialBarChartSegmentFill('value', 'Chrome')).toBe(
      'var(--color-Chrome)'
    );
  });

  // The unreached remainder stands in for the `showBackground` track.
  it('paints the unreached remainder in the track surface', () => {
    expect(radialBarChartSegmentFill('track', 'Chrome')).toBe(
      'var(--ui-background-surface-secondary)'
    );
  });

  // `transparent`, not `none`: the notch still has to take a pointer so the
  // axis-shared tooltip reads the metric there too.
  it('leaves a notch transparent', () => {
    expect(radialBarChartSegmentFill('gap', 'Chrome')).toBe('transparent');
  });
});

describe('radialBarChartSegmentedReading', () => {
  const reading = (
    overrides: Partial<
      Parameters<typeof radialBarChartSegmentedReading>[0]
    > = {}
  ) =>
    radialBarChartSegmentedReading({
      config: { criteria: { label: 'Criteria met' } },
      row: { criteria: 'criteria', value: 29 },
      nameKey: 'criteria',
      dataKey: 'value',
      domainMax: 38,
      ...overrides,
    });

  it('reads the metric against the domain maximum', () => {
    expect(reading()).toEqual({
      colorName: 'criteria',
      label: 'Criteria met',
      valueText: '29 / 38',
    });
  });

  // Without a domain there is no maximum to pair the value with, so it reads bare
  // rather than inventing a denominator.
  it('reads the value alone when there is no domain maximum', () => {
    expect(reading({ domainMax: undefined }).valueText).toBe('29');
  });

  it('falls back to the nameKey value when config has no label', () => {
    expect(reading({ config: {} }).label).toBe('criteria');
  });

  it('groups thousands in both the value and the maximum', () => {
    expect(
      reading({ row: { criteria: 'criteria', value: 12345 }, domainMax: 98765 })
        .valueText
    ).toBe(`${(12345).toLocaleString()} / ${(98765).toLocaleString()}`);
  });

  // `segments` needs a numeric value to lay a ring out, so a stringified one never
  // reaches a segmented chart — but the reading must not print "[object Object]"
  // or "undefined" if it ever does.
  it('passes a non-numeric value through unformatted', () => {
    expect(
      reading({ row: { criteria: 'criteria', value: 'n/a' } }).valueText
    ).toBe('n/a / 38');
  });
});

describe('radialBarChartBandName', () => {
  it('names the band the hovered arc belongs to', () => {
    expect(
      radialBarChartBandName({ tier: 'Production', used: 72 }, 'tier')
    ).toBe('Production');
  });

  it('coerces a numeric band name', () => {
    expect(radialBarChartBandName({ tier: 2024, used: 72 }, 'tier')).toBe(
      '2024'
    );
  });

  // An empty header, not the string "undefined", when the row can't name a band.
  it('yields an empty header for a missing row or nameKey', () => {
    expect(radialBarChartBandName(undefined, 'tier')).toBe('');
    expect(radialBarChartBandName({ used: 72 }, 'tier')).toBe('');
  });
});

describe('radialBarChartSegments', () => {
  const base = {
    domain: [0, 100] as [number, number],
    segments: 4,
    gap: 2,
    sweep: 360,
    closed: true,
  };

  const total = (pieces: ReturnType<typeof radialBarChartSegments>) =>
    pieces.reduce((sum, piece) => sum + piece.degrees, 0);

  const of = (
    pieces: ReturnType<typeof radialBarChartSegments>,
    kind: 'value' | 'track' | 'gap'
  ) => pieces.filter((piece) => piece.kind === kind);

  it('fills the whole sweep: segments plus their gaps', () => {
    const pieces = radialBarChartSegments({ ...base, value: 50 });
    expect(total(pieces)).toBeCloseTo(360);
    // A closed ring gets one gap per segment (including after the last).
    expect(of(pieces, 'gap')).toHaveLength(4);
    expect(of(pieces, 'gap').every((gap) => gap.degrees === 2)).toBe(true);
  });

  it('leaves the last gap out of an open sweep', () => {
    const pieces = radialBarChartSegments({
      ...base,
      value: 50,
      sweep: 180,
      closed: false,
    });
    expect(of(pieces, 'gap')).toHaveLength(3);
    expect(total(pieces)).toBeCloseTo(180);
  });

  // The value maps onto the drawn ring, so the notches never eat into it.
  it('splits the ring in the value proportion, gaps excluded', () => {
    const pieces = radialBarChartSegments({ ...base, value: 50 });
    const drawn = 360 - 4 * 2;
    expect(total(of(pieces, 'value'))).toBeCloseTo(drawn / 2);
    expect(total(of(pieces, 'track'))).toBeCloseTo(drawn / 2);
  });

  it('splits the one segment the value ends inside', () => {
    // 30% of 4 segments = 1.2 segments: one whole, one part, two empty.
    const pieces = radialBarChartSegments({ ...base, value: 30, gap: 0 });
    const filled = of(pieces, 'value').map((piece) => piece.degrees);
    expect(filled[0]).toBeCloseTo(90);
    expect(filled[1]).toBeCloseTo(18);
    expect(filled[2]).toBe(0);
    expect(filled[3]).toBe(0);
  });

  it('keeps a stable key set as the value changes', () => {
    const keysAt = (value: number) =>
      radialBarChartSegments({ ...base, value }).map((piece) => piece.key);
    expect(keysAt(10)).toEqual(keysAt(90));
  });

  it('honors a domain that does not start at zero', () => {
    const pieces = radialBarChartSegments({
      ...base,
      value: 30,
      domain: [20, 40],
      gap: 0,
    });
    expect(total(of(pieces, 'value'))).toBeCloseTo(180);
  });

  it('clamps a value outside the domain to an empty or a full ring', () => {
    expect(
      total(of(radialBarChartSegments({ ...base, value: -5 }), 'value'))
    ).toBe(0);
    const full = radialBarChartSegments({ ...base, value: 200 });
    expect(total(of(full, 'track'))).toBeCloseTo(0);
  });

  // An all-gap ring would render as nothing at all.
  it('clamps a gap that would leave no room for the segments', () => {
    const pieces = radialBarChartSegments({ ...base, value: 100, gap: 400 });
    expect(total(of(pieces, 'gap'))).toBeCloseTo(180);
    expect(total(of(pieces, 'value'))).toBeCloseTo(180);
  });

  // A negative gap would stretch the pieces past the sweep and overlap them.
  it('floors a negative gap at zero', () => {
    const pieces = radialBarChartSegments({ ...base, value: 100, gap: -20 });
    expect(total(of(pieces, 'gap'))).toBe(0);
    expect(total(pieces)).toBeCloseTo(360);
  });

  // A domain with no span can't place a value on the ring, so there is no
  // fraction to draw. It must not fall back to comparing the value against zero:
  // that read a *full* ring for a value far below the domain.
  it('draws nothing for a domain with no span', () => {
    for (const domain of [
      [0, 0],
      [100, 100],
    ] satisfies [number, number][]) {
      const pieces = radialBarChartSegments({ ...base, value: 5, domain });
      expect(total(of(pieces, 'value'))).toBe(0);
      // The ring itself still renders — every segment is track.
      expect(total(pieces)).toBeCloseTo(360);
    }
  });

  it('draws nothing for an inverted domain', () => {
    const pieces = radialBarChartSegments({
      ...base,
      value: 50,
      domain: [100, 0],
    });
    expect(total(of(pieces, 'value'))).toBe(0);
    expect(total(pieces)).toBeCloseTo(360);
  });

  // Guards against the two independent checks combining wrongly: a value that
  // equals the domain minimum satisfies `span > 0` and still has to read empty.
  it('draws nothing for a value sitting on the domain minimum', () => {
    const pieces = radialBarChartSegments({
      ...base,
      value: 20,
      domain: [20, 40],
    });
    expect(total(of(pieces, 'value'))).toBe(0);
  });

  // The exported helper has no `segments > 1` guard of its own (the component
  // applies one), so a lone open segment must still fill its whole sweep.
  it('handles a single open segment without a gap', () => {
    const pieces = radialBarChartSegments({
      ...base,
      value: 100,
      segments: 1,
      closed: false,
      sweep: 180,
    });
    expect(of(pieces, 'gap')).toHaveLength(0);
    expect(total(of(pieces, 'value'))).toBeCloseTo(180);
  });
});

// The ring's angular arithmetic is unit-tested through `radialBarChartSegments`;
// what these cases add is that the geometry props reach the arcs recharts paints.
describe('RadialBarChart gauge, multi-metric and geometry props', () => {
  // The gauge reading is the whole point of `valueDomain`: without one a lone row
  // is its own maximum, so its arc fills the sweep and reads as 100% whatever the
  // value is.
  it('reads a single value against valueDomain instead of filling the sweep', () => {
    const gauge = {
      data: [{ browser: 'Chrome', value: 65 }],
      startAngle: 180,
      endAngle: 0,
      cy: 190,
      centerLabel: { value: '65%', label: 'of quota used' },
    };

    const scaled = renderChart({ ...gauge, valueDomain: [0, 100] });
    const arc = arcsOf(scaled.container)[0];
    expect(arc.getAttribute('d')).not.toBe(
      tracksOf(scaled.container)[0].getAttribute('d')
    );
    // `cy` moves the whole ring; recharts stamps the resolved centre on each arc.
    expect(arc).toHaveAttribute('cy', '190');
    expect(svgTextOf(scaled.container)).toEqual(['65%', 'of quota used']);
    scaled.unmount();

    const unscaled = renderChart(gauge);
    expect(arcsOf(unscaled.container)[0].getAttribute('d')).toBe(
      tracksOf(unscaled.container)[0].getAttribute('d')
    );
  });

  // A segmented ring is synthetic geometry — one stacked series per piece, the
  // notches painted transparent so they read as gaps. 29 of 38 covers six whole
  // segments and part of the seventh, so the seventh is the one segment drawn in
  // both fills and the eighth is track alone.
  it('draws a segmented gauge as notched pieces rather than data arcs', () => {
    const { container } = renderChart({
      data: [{ browser: 'Chrome', value: 29 }],
      valueDomain: [0, 38],
      segments: 8,
      segmentGap: 4,
      centerLabel: { value: 29, label: '/ 38 criteria met' },
    });

    const fills = arcsOf(container).map((piece) => piece.getAttribute('fill'));
    expect(fills.filter((fill) => fill === 'transparent')).toHaveLength(8);
    expect(fills.filter((fill) => fill === 'var(--color-Chrome)')).toHaveLength(
      7
    );
    expect(
      fills.filter((fill) => fill === 'var(--ui-background-surface-secondary)')
    ).toHaveLength(2);
    // The unreached segments *are* the track, so `showBackground`'s own one would
    // double it, and a legend here would name synthetic pieces instead of data.
    expect(tracksOf(container)).toHaveLength(0);
    expect(container.querySelector('.recharts-legend-wrapper')).toBeNull();
    expect(svgTextOf(container)).toEqual(['29', '/ 38 criteria met']);
  });

  it('accepts multi-metric dataKeys', () => {
    const { container } = renderChart({
      config: {
        used: { label: 'Used', color: 'rgb(23 99 207)' },
        quota: { label: 'Quota', color: 'rgb(212 149 42)' },
      },
      data: [{ tier: 'Production', used: 72, quota: 90 }],
      dataKeys: ['used', 'quota'],
      dataKey: 'used',
      nameKey: 'tier',
      valueDomain: [0, 100],
    });
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-used: rgb(23 99 207)');
    expect(style).toContain('--color-quota: rgb(212 149 42)');
  });

  it('sizes each arc from barSize and spaces the bands with barCategoryGap', () => {
    const ring = (
      props: Partial<React.ComponentProps<typeof RadialBarChart>> = {}
    ) => {
      const { container, unmount } = renderChart({
        cornerRadius: 0,
        ...props,
      });
      const [inner, next] = arcsOf(container).map(radiiOf);
      unmount();
      return {
        thickness: inner[0] - inner[1],
        betweenBands: next[1] - inner[0],
      };
    };

    const base = ring();
    expect(ring({ barSize: 18 }).thickness).toBe(18);
    expect(base.thickness).not.toBe(18);
    expect(ring({ barCategoryGap: '20%' }).betweenBands).toBeGreaterThan(
      base.betweenBands
    );
  });

  // A band holds one arc per metric, so `barGap` only has anything to separate
  // once there are several — on the single-metric mapping it is inert.
  it('separates one band metrics by barGap', () => {
    const between = (barGap?: number) => {
      const { container, unmount } = renderChart({
        config: {
          used: { label: 'Used', color: 'rgb(23 99 207)' },
          quota: { label: 'Quota', color: 'rgb(212 149 42)' },
        },
        data: [{ tier: 'Production', used: 72, quota: 90 }],
        dataKeys: ['used', 'quota'],
        dataKey: 'used',
        nameKey: 'tier',
        valueDomain: [0, 100],
        cornerRadius: 0,
        barGap,
      });
      const [inner, outer] = arcsOf(container).map(radiiOf);
      unmount();
      return outer[1] - inner[0];
    };

    expect(between(20)).toBeCloseTo(20);
    expect(between(6)).toBeCloseTo(6);
    expect(between()).not.toBeCloseTo(20);
  });

  // Without a floor a near-zero metric is drawn about a pixel wide: present in the
  // DOM, invisible on screen and impossible to hover.
  it('keeps a near-zero arc visible with minAngle', () => {
    const tiny = [
      { browser: 'Chrome', value: 100 },
      { browser: 'Safari', value: 0.2 },
    ];
    const span = (minAngle?: number) => {
      const { container, unmount } = renderChart({ data: tiny, minAngle });
      const width = arcSpanX(arcsOf(container)[1]);
      unmount();
      return width;
    };

    expect(span()).toBeLessThan(5);
    expect(span(90)).toBeGreaterThan(100);
  });

  it('centers the ring on cx and cy and insets the plot area by the margin', () => {
    const { container } = renderChart({
      cx: '40%',
      cy: 120,
      margin: { top: 8, right: 8, bottom: 8, left: 8 },
    });

    // 40% of the width the shared test layout reports to recharts.
    expect(arcsOf(container)[0]).toHaveAttribute(
      'cx',
      String(CHART_WIDTH * 0.4)
    );
    expect(arcsOf(container)[0]).toHaveAttribute('cy', '120');
    // recharts publishes the plot area as the chart's clip rect, so the margin
    // is observable there rather than on any arc.
    const plotArea = container.querySelector('clipPath rect');
    expect(plotArea).toHaveAttribute('x', '8');
    expect(plotArea).toHaveAttribute('y', '8');
    expect(plotArea).toHaveAttribute('width', String(CHART_WIDTH - 16));
    expect(plotArea).toHaveAttribute('height', String(CHART_HEIGHT - 16));
  });

  it('draws the polar grid as concentric rings without spokes', () => {
    const bare = renderChart();
    expect(bare.container.querySelector('.recharts-polar-grid')).toBeNull();
    bare.unmount();

    const { container } = renderChart({ showPolarGrid: true });
    expect(
      container.querySelectorAll('.recharts-polar-grid-concentric-circle')
        .length
    ).toBeGreaterThan(0);
    // `gridType="circle"`, so never the polygon form; `radialLines={false}`,
    // because spokes would cut across every arc.
    expect(
      container.querySelector('.recharts-polar-grid-concentric-polygon')
    ).toBeNull();
    expect(container.querySelector('.recharts-polar-grid-angle')).toBeNull();
  });
});
