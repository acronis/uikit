import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ComposedChart } from '../composed-chart';
import { ChartTooltipContent, type ChartConfig,
  resolveAnimation,
} from '../../chart';

const data = [
  { month: 'Jan', revenue: 2400, profit: 1600, orders: 120 },
  { month: 'Feb', revenue: 1398, profit: 1200, orders: 98 },
  { month: 'Mar', revenue: 9800, profit: 4800, orders: 156 },
];

const config = {
  revenue: { label: 'Revenue', color: 'rgb(23 99 207)' },
  profit: { label: 'Profit', color: 'rgb(34 139 79)' },
  orders: { label: 'Orders', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

const series = [
  { key: 'revenue', type: 'bar' as const },
  { key: 'profit', type: 'area' as const },
  { key: 'orders', type: 'line' as const },
];

function renderChart(
  props: Partial<React.ComponentProps<typeof ComposedChart>> = {}
) {
  return render(
    <ComposedChart config={config} data={data} series={series} xKey="month" {...props} />
  );
}

describe('ComposedChart', () => {
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
    expect(style).toContain('--color-revenue: rgb(23 99 207)');
    expect(style).toContain('--color-profit: rgb(34 139 79)');
    expect(style).toContain('--color-orders: rgb(220 53 69)');
  });

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the bars/lines/areas/chrome
  // can't be asserted here. These exercise the prop paths (mixed series types,
  // curve, chrome toggles) against a plumbing/crash regression; the visual
  // output is covered by the VR stories.
  it('renders a mixed bar/line/area series set with a stepped curve', () => {
    const { container } = renderChart({ curve: 'step' });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders with all chrome toggles off and squared bars', () => {
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

  // Axis titles/unit forward to recharts' XAxis/YAxis `label`/`unit`; happy-dom
  // doesn't paint the SVG, so this only guards the prop path (the rendered titles
  // are covered by the `AxisLabels` VR story).
  it('renders with axis titles + a Y unit', () => {
    const { container } = renderChart({
      xAxisLabel: 'Month',
      yAxisLabel: 'Amount',
      yUnit: '$',
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
describe('ComposedChart animation and data labels', () => {
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

// The second value axis is only *rendered* by recharts, which needs a laid-out
// container happy-dom never provides — so the two scales themselves are covered by
// the `SecondaryYAxis*` VR stories. These assert the contract this composition
// owns: the per-series opt-in and every secondary-axis prop mount, and a chart
// that never opts in stays on the single-axis path.
describe('ComposedChart secondary Y axis', () => {
  const dualSeries = [
    { key: 'revenue', type: 'bar' as const },
    { key: 'orders', type: 'line' as const, yAxis: 'secondary' as const },
  ];

  it('accepts a per-series secondary-axis assignment with its own axis config', () => {
    const { container } = renderChart({
      series: dualSeries,
      secondaryYAxisLabel: 'Orders',
      secondaryYUnit: ' pcs',
      secondaryYTickFormatter: (value) => `${value}!`,
      secondaryYAxisTickCount: 3,
      secondaryYAxisDomain: 'dataMin-dataMax',
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('accepts a hidden secondary axis (the scale stays, its chrome goes)', () => {
    const { container } = renderChart({
      series: dualSeries,
      showSecondaryYAxis: false,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('accepts a right-oriented primary axis, with and without a second scale', () => {
    const single = renderChart({ yAxisOrientation: 'right' });
    expect(single.container.querySelector('[data-slot="chart"]')).toBeInTheDocument();

    const dual = renderChart({ series: dualSeries, yAxisOrientation: 'right' });
    expect(dual.container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // The secondary-axis props are inert without a series asking for the axis — no
  // second axis is rendered, so setting them can't shift a single-scale chart.
  // That they're *ignored* is what the `SecondaryYAxisShared` baseline shows; here
  // the claim is only that setting them on a single-scale chart is accepted.
  it('accepts the secondary-axis props when no series selects that axis', () => {
    const { container } = renderChart({
      secondaryYAxisLabel: 'Unused',
      secondaryYUnit: '%',
      secondaryYAxisDomain: 'auto',
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // Every series on the secondary axis leaves the primary one empty. recharts gives
  // a tickless axis a blank gutter and collapses the grid onto it, so the component
  // hides that axis and re-points the grid — visible in the `AllSeriesSecondaryYAxis`
  // baseline, which happy-dom can't distinguish from the unguarded render.
  it('accepts every series opting into the secondary axis', () => {
    const { container } = renderChart({
      series: [
        { key: 'revenue', type: 'bar', yAxis: 'secondary' },
        { key: 'orders', type: 'line', yAxis: 'secondary' },
      ],
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});
