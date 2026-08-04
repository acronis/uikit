import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  RadialBarChart,
  radialBarChartLabelText,
  radialBarChartSegments,
} from '../radial-bar-chart';
import { ChartTooltipContent, type ChartConfig,
  resolveAnimation,
} from '../../chart';

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

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the arcs/track/chrome can't
  // be asserted here. This exercises the geometry + chrome-toggle prop paths
  // against a plumbing/crash regression; the visual output is covered by the VR
  // stories.
  it('renders a half-circle gauge with the background and chrome toggled off', () => {
    const { container } = renderChart({
      startAngle: 180,
      endAngle: 0,
      showBackground: false,
      showTooltip: false,
      showLegend: false,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders without crashing on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
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

});

// recharts needs a laid-out container, which happy-dom does not provide, so the
// rendered labels/animation are covered by the visual-regression stories. These
// assert the prop contract itself: the composition accepts every new prop and
// mounts, and the animation resolves to the reduced-motion-aware value rather
// than a literal `true`.
describe('RadialBarChart animation and data labels', () => {
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
      labelPosition: 'insideEnd',
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
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
      radialBarChartLabelText({ format: 'value', name: 'Chrome', value: undefined })
    ).toBe('');
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
});

// Same happy-dom limit as above: the ring's geometry is unit-tested through
// `radialBarChartSegments` and pictured by the VR stories; these guard the prop
// paths through the composition.
describe('RadialBarChart gauge, multi-metric and geometry props', () => {
  it('accepts the gauge props', () => {
    const { container } = renderChart({
      data: [{ browser: 'Chrome', value: 65 }],
      valueDomain: [0, 100],
      startAngle: 180,
      endAngle: 0,
      cy: 190,
      centerLabel: { value: '65%', label: 'of quota used' },
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('accepts a segmented gauge', () => {
    const { container } = renderChart({
      data: [{ browser: 'Chrome', value: 29 }],
      valueDomain: [0, 38],
      segments: 8,
      segmentGap: 4,
      centerLabel: { value: 29, label: '/ 38 criteria met' },
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
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

  it('accepts the geometry and grid props', () => {
    const { container } = renderChart({
      cx: '40%',
      cy: 120,
      barSize: 18,
      barGap: 6,
      barCategoryGap: '20%',
      minAngle: 12,
      margin: { top: 8, right: 8, bottom: 8, left: 8 },
      showPolarGrid: true,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});
