import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BarChart, barChartReferenceValue } from '../bar-chart';
import { ChartTooltipContent, type ChartConfig,
  resolveAnimation,
} from '../../chart';

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
];

const config = {
  desktop: { label: 'Desktop', color: 'rgb(23 99 207)' },
  mobile: { label: 'Mobile', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

function renderChart(props: Partial<React.ComponentProps<typeof BarChart>> = {}) {
  return render(
    <BarChart
      config={config}
      data={data}
      dataKeys={['desktop', 'mobile']}
      xKey="month"
      {...props}
    />
  );
}

describe('BarChart', () => {
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

  it('defaults to a vertical, grouped orientation/layout', () => {
    const { container } = renderChart();
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('data-orientation', 'vertical');
    expect(root).toHaveAttribute('data-layout', 'grouped');
  });

  it('reflects the orientation and layout variants on the root', () => {
    const { container } = renderChart({
      orientation: 'horizontal',
      layout: 'stacked',
    });
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('data-orientation', 'horizontal');
    expect(root).toHaveAttribute('data-layout', 'stacked');
  });

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the grid/tooltip/legend
  // toggles can't be asserted on the rendered chrome here. This exercises the
  // toggle + barRadius prop paths (guarding against a plumbing/crash regression);
  // the visual effect of the chrome toggles is covered by the `NoChrome` VR story.
  it('renders with all chrome toggles off and a squared barRadius', () => {
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

  it('renders with a fixed reference line and an averaged reference line', () => {
    expect(
      renderChart({ referenceLine: { value: 150, label: 'Target' } }).container.querySelector(
        '[data-slot="chart"]'
      )
    ).toBeInTheDocument();
    expect(
      renderChart({ referenceLine: { average: true } }).container.querySelector(
        '[data-slot="chart"]'
      )
    ).toBeInTheDocument();
  });

  it('renders with an array of reference lines', () => {
    const { container } = renderChart({
      referenceLine: [{ value: 300, label: 'Target' }, { average: true }],
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // Axis titles/units forward to recharts' XAxis/YAxis `label`/`unit`; happy-dom
  // doesn't paint the SVG, so this only guards the prop path (the rendered titles
  // are covered by the `AxisLabels` VR story) — for both orientations.
  it('renders with axis titles + units in both orientations', () => {
    const axis = { xAxisLabel: 'Month', yAxisLabel: 'Sessions', yUnit: 'k', xUnit: '$' };
    const vertical = renderChart(axis);
    expect(
      vertical.container.querySelector('[data-slot="chart"]')
    ).toBeInTheDocument();
    const horizontal = renderChart({ ...axis, orientation: 'horizontal' });
    expect(
      horizontal.container.querySelector('[data-slot="chart"]')
    ).toBeInTheDocument();
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

describe('barChartReferenceValue', () => {
  const keys = ['desktop', 'mobile'];

  it('returns undefined with no config', () => {
    expect(barChartReferenceValue(undefined, data, keys)).toBeUndefined();
  });

  it('returns a fixed value (including 0)', () => {
    expect(barChartReferenceValue({ value: 150 }, data, keys)).toBe(150);
    expect(barChartReferenceValue({ value: 0 }, data, keys)).toBe(0);
  });

  it('prefers a fixed value over average', () => {
    expect(
      barChartReferenceValue({ value: 42, average: true }, data, keys)
    ).toBe(42);
  });

  it('averages a single named series', () => {
    // desktop: (186 + 305 + 237) / 3
    expect(barChartReferenceValue({ average: 'desktop' }, data, keys)).toBeCloseTo(
      242.667,
      2
    );
  });

  it('averages every plotted series when average is true', () => {
    // (186+305+237 + 80+200+120) / 6 = 188
    expect(barChartReferenceValue({ average: true }, data, keys)).toBe(188);
  });

  it('returns undefined when there is nothing numeric to average', () => {
    expect(barChartReferenceValue({ average: true }, [], keys)).toBeUndefined();
    expect(
      barChartReferenceValue({ average: 'missing' }, data, keys)
    ).toBeUndefined();
  });
});

// recharts needs a laid-out container, which happy-dom does not provide, so the
// rendered labels/animation are covered by the visual-regression stories. These
// assert the prop contract itself: the composition accepts every new prop and
// mounts, and the animation resolves to the reduced-motion-aware value rather
// than a literal `true`.
describe('BarChart animation and data labels', () => {
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
