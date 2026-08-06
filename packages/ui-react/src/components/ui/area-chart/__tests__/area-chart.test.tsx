import * as React from 'react';
import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { AreaChart } from '../area-chart';
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

describe('AreaChart', () => {
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

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the grid/tooltip/legend
  // toggles can't be asserted on the rendered chrome here. This exercises the
  // toggle + stroke/dot prop paths (guarding against a plumbing/crash
  // regression); the visual effect of the chrome toggles is covered by the
  // `NoChrome` VR story.
  it('renders with all chrome toggles off, dots off, and a solid fill', () => {
    const { container } = renderChart({
      showGrid: false,
      showTooltip: false,
      showLegend: false,
      showDots: false,
      fill: 'solid',
      connectNulls: true,
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
      yAxisLabel: 'Sessions',
      yUnit: 'k',
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
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
describe('AreaChart animation and data labels', () => {
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
describe('AreaChart curves, dots and per-series overrides', () => {
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

  // A curve value that recharts doesn't recognize silently draws straight
  // segments, so identical geometry between two types is the failure to catch.
  it('draws distinct geometry for every curve type', () => {
    const drawn = CURVES.map((curve) => {
      giveTheChartASize();
      const { container, unmount } = renderChart({
        dataKeys: ['desktop'],
        curve,
      });
      const path = container
        .querySelector('.recharts-area-curve')
        ?.getAttribute('d');
      unmount();
      restoreTheChartSize();
      expect(path).toBeTruthy();
      return path;
    });
    expect(new Set(drawn).size).toBe(CURVES.length);
  });

  it('sizes the point dots from dotSize', () => {
    giveTheChartASize();
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
    giveTheChartASize();
    const { container } = renderChart({
      dataKeys: ['desktop'],
      showActiveDot: true,
    });
    expect(container.querySelectorAll('.recharts-area-dot')).toHaveLength(0);
  });

  it('restyles one series without touching the others', () => {
    giveTheChartASize();
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
    giveTheChartASize();
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
    giveTheChartASize();
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
    giveTheChartASize();
    const { container } = renderChart({
      areaSettings: { mobile: { showLabel: true, labelPosition: 'bottom' } },
    });
    const labels = container.querySelectorAll('.recharts-label-list text');
    expect([...labels].map((label) => label.textContent)).toEqual(
      data.map((row) => String(row.mobile))
    );
  });
});
