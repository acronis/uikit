import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AreaChart } from '../area-chart';
import { ChartTooltipContent, type ChartConfig,
  resolveAnimation,
} from '../../chart';
import {
  axisTickLabels,
  axisTicks,
  giveEveryChartASize,
} from '../../chart/__tests__/chart-layout';

// The curves, dots, labels and chrome asserted below are painted SVG, which
// recharts skips entirely at 0×0.
giveEveryChartASize();

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
  props: Partial<React.ComponentProps<typeof AreaChart>> = {}
) {
  return render(
    <AreaChart
      config={config}
      data={data}
      dataKeys={['desktop', 'mobile']}
      xKey="month"
      {...props}
    />
  );
}

const curvesOf = (container: Element) => [
  ...container.querySelectorAll<SVGPathElement>('.recharts-area-curve'),
];

describe('AreaChart axes and grid', () => {
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

describe('AreaChart', () => {
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

  it('defaults to a single layout with a gradient fill', () => {
    const { container } = renderChart();
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('data-layout', 'single');
    expect(root).toHaveAttribute('data-fill', 'gradient');
  });

  it('reflects the layout and fill variants on the root', () => {
    const { container } = renderChart({ layout: 'stacked', fill: 'solid' });
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('data-layout', 'stacked');
    expect(root).toHaveAttribute('data-fill', 'solid');
  });

  it('strips the grid, legend and dots when their toggles are off', () => {
    const { container } = renderChart({
      showGrid: false,
      showTooltip: false,
      showLegend: false,
      showDots: false,
      fill: 'solid',
      connectNulls: true,
    });
    expect(container.querySelector('.recharts-cartesian-grid')).toBeNull();
    expect(container.querySelector('.recharts-legend-wrapper')).toBeNull();
    expect(container.querySelectorAll('.recharts-area-dot')).toHaveLength(0);
    // The series itself survives the chrome going away.
    expect(curvesOf(container)).toHaveLength(2);
  });

  // A solid fill paints straight from the series color; a gradient fill routes
  // it through a `<linearGradient>` def instead.
  it('fills from a gradient def by default and from the color directly when solid', () => {
    const gradient = renderChart();
    expect(
      gradient.container.querySelectorAll('linearGradient').length
    ).toBeGreaterThan(0);
    expect(
      gradient.container
        .querySelector('.recharts-area-area')
        ?.getAttribute('fill')
    ).toMatch(/^url\(#/);
    gradient.unmount();

    const solid = renderChart({ fill: 'solid' });
    expect(
      solid.container.querySelector('.recharts-area-area')?.getAttribute('fill')
    ).toBe('var(--color-desktop)');
  });

  it('draws no curves but still mounts on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    expect(curvesOf(container)).toHaveLength(0);
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

// The motion itself is a visual-regression concern; what matters here is that
// `animate` resolves to the reduced-motion-aware value rather than a literal
// `true`, and that the label props reach the painted series.
describe('AreaChart animation and data labels', () => {
  it('is not animated unless asked', () => {
    expect(resolveAnimation({})).toEqual({ isAnimationActive: false });
  });

  it('resolves animate to "auto" so prefers-reduced-motion is honored', () => {
    expect(
      resolveAnimation({ animate: true, animationDuration: 800 })
    ).toEqual({ isAnimationActive: 'auto', animationDuration: 800 });
  });

  it('still draws every series with the full animation prop set', async () => {
    const { container } = renderChart({
      animate: true,
      animationDuration: 400,
      animationBegin: 50,
      animationEasing: 'ease-in-out',
    });
    await waitFor(() => expect(curvesOf(container)).toHaveLength(2));
  });

  it('runs the data labels through the caller formatter', () => {
    const { container } = renderChart({
      dataKeys: ['desktop'],
      showLabels: true,
      labelFormatter: (value) => `${value} u`,
    });
    expect(
      [...container.querySelectorAll('.recharts-label-list text')].map(
        (label) => label.textContent
      )
    ).toEqual(data.map((row) => `${row.desktop} u`));
  });

  it('honors an explicit labelPosition override', () => {
    const labelY = (labelPosition?: 'center') => {
      const { container, unmount } = renderChart({
        dataKeys: ['desktop'],
        showLabels: true,
        ...(labelPosition ? { labelPosition } : {}),
      });
      const ys = [
        ...container.querySelectorAll('.recharts-label-list text'),
      ].map((label) => label.getAttribute('y'));
      unmount();
      return ys;
    };
    expect(labelY('center')).not.toEqual(labelY());
  });
});

// The curve set, the dot radii and the per-series overrides are only observable
// on the painted SVG, which recharts skips entirely at 0×0 (see `chart-layout`).
describe('AreaChart curves, dots and per-series overrides', () => {
  const CURVES = [
    'linear',
    'monotone',
    'natural',
    'basis',
    'step',
    'stepBefore',
    'stepAfter',
  ] as const;

  // A curve value that recharts doesn't recognize silently draws straight
  // segments, so identical geometry between two types is the failure to catch.
  it('draws distinct geometry for every curve type', () => {
    const drawn = CURVES.map((curve) => {
      const { container, unmount } = renderChart({
        dataKeys: ['desktop'],
        curve,
      });
      const path = container
        .querySelector('.recharts-area-curve')
        ?.getAttribute('d');
      unmount();
      expect(path).toBeTruthy();
      return path;
    });
    expect(new Set(drawn).size).toBe(CURVES.length);
  });

  it('sizes the point dots from dotSize', () => {
    const { container } = renderChart({
      dataKeys: ['desktop'],
      showDots: true,
      dotSize: 6,
    });
    const dots = container.querySelectorAll('.recharts-area-dot');
    expect(dots.length).toBeGreaterThan(0);
    for (const dot of dots) expect(dot).toHaveAttribute('r', '6');
  });

  it('draws no static dots for a hover-only area', () => {
    const { container } = renderChart({
      dataKeys: ['desktop'],
      showActiveDot: true,
    });
    expect(container.querySelectorAll('.recharts-area-dot')).toHaveLength(0);
  });

  it('restyles one series without touching the others', () => {
    const { container } = renderChart({
      fill: 'solid',
      areaSettings: {
        mobile: {
          color: 'rgb(1 2 3)',
          strokeWidth: 4,
          dashed: true,
          fillOpacity: 0.1,
        },
      },
    });
    // The curves follow `dataKeys` order: desktop first, then mobile.
    const [desktop, mobile] = container.querySelectorAll('.recharts-area-curve');
    expect(mobile).toHaveAttribute('stroke', 'rgb(1 2 3)');
    expect(mobile).toHaveAttribute('stroke-width', '4');
    expect(mobile).toHaveAttribute('stroke-dasharray', '5 5');
    expect(desktop).toHaveAttribute('stroke', 'var(--color-desktop)');
    expect(desktop).not.toHaveAttribute('stroke-dasharray');

    const [desktopFill, mobileFill] =
      container.querySelectorAll('.recharts-area-area');
    expect(mobileFill).toHaveAttribute('fill-opacity', '0.1');
    expect(desktopFill).toHaveAttribute('fill-opacity', '0.4');
  });

  // The fill is painted from a gradient def, so a color override that stopped at
  // the stroke would leave the series' body in its config color.
  it('recolors a gradient series through its own stops', () => {
    const { container } = renderChart({
      areaSettings: { mobile: { color: 'rgb(1 2 3)' } },
    });
    const stops = [...container.querySelectorAll('linearGradient')].flatMap(
      (gradient) =>
        [...gradient.querySelectorAll('stop')].map((stop) =>
          stop.getAttribute('stop-color')
        )
    );
    expect(stops).toContain('rgb(1 2 3)');
    expect(stops).toContain('var(--color-desktop)');
    expect(stops).not.toContain('var(--color-mobile)');
  });

  it('opts one series out of the chart-wide value labels', () => {
    const { container } = renderChart({
      showLabels: true,
      areaSettings: { mobile: { showLabel: false } },
    });
    const labels = container.querySelectorAll('.recharts-label-list text');
    expect([...labels].map((label) => label.textContent)).toEqual(
      data.map((row) => String(row.desktop))
    );
  });

  it('labels a single series without the chart-wide toggle', () => {
    const { container } = renderChart({
      areaSettings: { mobile: { showLabel: true, labelPosition: 'bottom' } },
    });
    const labels = container.querySelectorAll('.recharts-label-list text');
    expect([...labels].map((label) => label.textContent)).toEqual(
      data.map((row) => String(row.mobile))
    );
  });
});
