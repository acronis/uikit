import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ComposedChart } from '../composed-chart';
import { ChartTooltipContent, type ChartConfig,
  resolveAnimation,
} from '../../chart';

import {
  axisTickLabels,
  axisTicks,
  giveEveryChartASize,
} from '../../chart/__tests__/chart-layout';

// The mixed bar/line/area geometry, stacking and orientation asserted below are
// painted SVG, which recharts skips entirely at 0×0.
giveEveryChartASize();

const data = [
  { month: 'Jan', revenue: 2400, profit: 1600, orders: 120 },
  { month: 'Feb', revenue: 1398, profit: 1200, orders: 98 },
  { month: 'Mar', revenue: 9800, profit: 4800, orders: 156 },
];

const config = {
  revenue: { label: 'Revenue' },
  profit: { label: 'Profit' },
  orders: { label: 'Orders' },
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

const barsOf = (container: Element) => [
  ...container.querySelectorAll<SVGPathElement>('.recharts-bar-rectangle path'),
];
const linesOf = (container: Element) => [
  ...container.querySelectorAll<SVGPathElement>('.recharts-line-curve'),
];
const areasOf = (container: Element) => [
  ...container.querySelectorAll<SVGPathElement>('.recharts-area-curve'),
];

describe('ComposedChart axes and grid', () => {
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
    const { container } = renderChart({ yUnit: '$' });
    const ticks = axisTickLabels(container, 'y');
    expect(ticks.length).toBeGreaterThan(0);
    for (const tick of ticks) expect(tick).toMatch(/\$$/);
  });

  // Every series in `series` sits on the primary axis, so the Y ticks read here
  // are that axis' alone — a secondary scale would add its own row to them.
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
  // observable against a preset that fits the data instead. Drawn on `orders`
  // (98–156) alone: the full composition spans 98–9800, whose fitted floor
  // rounds down to a nice tick of 0 anyway, which would make the two presets
  // indistinguishable again. That one series is on the primary axis, so the
  // ticks read here are that axis' alone.
  it('floors the Y domain at zero on request', () => {
    const narrow = { series: [{ key: 'orders', type: 'line' as const }] };
    const fitted = renderChart({ ...narrow, yAxisDomain: 'auto' });
    expect(axisTickLabels(fitted.container, 'y')[0]).toBe('80');
    fitted.unmount();

    const floored = renderChart({ ...narrow, yAxisDomain: 'zero' });
    expect(axisTickLabels(floored.container, 'y')[0]).toBe('0');
  });

  it('renders the axis titles as their own labels', () => {
    const { container } = renderChart({
      xAxisLabel: 'Month',
      yAxisLabel: 'Amount',
    });
    const titles = [...container.querySelectorAll('.recharts-label')].map(
      (label) => label.textContent
    );
    expect(titles).toContain('Month');
    expect(titles).toContain('Amount');
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

describe('ComposedChart', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each series color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-revenue: var(--ui-dataviz-categorical-1)');
    expect(style).toContain('--color-profit: var(--ui-dataviz-categorical-2)');
    expect(style).toContain('--color-orders: var(--ui-dataviz-categorical-3)');
  });

  // The whole point of the composition: one element per declared series type,
  // not three bars or three lines.
  it('draws one mark per series in the type each series declared', () => {
    const { container } = renderChart();
    expect(barsOf(container)).toHaveLength(3); // one bar per row of `revenue`
    expect(linesOf(container)).toHaveLength(1);
    expect(areasOf(container)).toHaveLength(1);
  });

  // A curve value recharts doesn't recognize silently draws straight segments,
  // so identical geometry between two curves is the failure to catch.
  it('applies the chart-wide curve to the stroked series', () => {
    const monotone = renderChart();
    const monotoneLine = linesOf(monotone.container)[0].getAttribute('d');
    monotone.unmount();

    const step = renderChart({ curve: 'step' });
    expect(linesOf(step.container)[0].getAttribute('d')).not.toBe(monotoneLine);
  });

  it('strips the grid and legend when their toggles are off', () => {
    const { container } = renderChart({
      showGrid: false,
      showTooltip: false,
      showLegend: false,
      barRadius: 0,
    });
    expect(container.querySelector('.recharts-cartesian-grid')).toBeNull();
    expect(container.querySelector('.recharts-legend-wrapper')).toBeNull();
    // The series themselves survive the chrome going away.
    expect(barsOf(container)).toHaveLength(3);
  });

  it('rounds the bar tops unless barRadius squares them', () => {
    const rounded = renderChart();
    expect(barsOf(rounded.container)[0].getAttribute('d')).toMatch(/[aA]/);
    rounded.unmount();

    const squared = renderChart({ barRadius: 0 });
    expect(barsOf(squared.container)[0].getAttribute('d')).not.toMatch(/[aA]/);
  });

  it('draws no marks but still mounts on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    expect(barsOf(container)).toHaveLength(0);
    expect(linesOf(container)).toHaveLength(0);
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
// `true`, and that the label props reach the painted marks.
describe('ComposedChart animation and data labels', () => {
  it('is not animated unless asked', () => {
    expect(resolveAnimation({})).toEqual({ isAnimationActive: false });
  });

  it('resolves animate to "auto" so prefers-reduced-motion is honored', () => {
    expect(
      resolveAnimation({ animate: true, animationDuration: 800 })
    ).toEqual({ isAnimationActive: 'auto', animationDuration: 800 });
  });

  it('still draws every mark with the full animation prop set', async () => {
    const { container } = renderChart({
      animate: true,
      animationDuration: 400,
      animationBegin: 50,
      animationEasing: 'ease-in-out',
    });
    await waitFor(() => expect(barsOf(container)).toHaveLength(3));
    expect(linesOf(container)).toHaveLength(1);
  });

  it('runs the data labels through the caller formatter', () => {
    const { container } = renderChart({
      series: [{ key: 'revenue', type: 'bar' }],
      showLabels: true,
      labelFormatter: (value) => `${value} u`,
    });
    expect(
      [...container.querySelectorAll('.recharts-label-list text')].map(
        (label) => label.textContent
      )
    ).toEqual(data.map((row) => `${row.revenue} u`));
  });

  it('honors an explicit labelPosition override', () => {
    const labelY = (labelPosition?: 'center') => {
      const { container, unmount } = renderChart({
        series: [{ key: 'revenue', type: 'bar' }],
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

// The chart is rendered into a sized container above, so these assert the SVG
// the new props actually produce — not just that the composition mounts.
describe('ComposedChart orientation', () => {
  const barLine = [
    { key: 'revenue', type: 'bar' as const },
    { key: 'orders', type: 'line' as const },
  ];

  function tickLabels(container: HTMLElement, axis: 'x' | 'y') {
    return Array.from(
      container.querySelectorAll(
        `.recharts-${axis}Axis-tick-labels .recharts-cartesian-axis-tick-value`
      )
    ).map((node) => node.textContent);
  }

  it('defaults to vertical, with the categories on the X axis', () => {
    const { container } = renderChart({ series: barLine });
    expect(container.firstElementChild).toHaveAttribute(
      'data-orientation',
      'vertical'
    );
    expect(tickLabels(container, 'x')).toContain('Jan');
  });

  it('moves the categories to the Y axis when horizontal', () => {
    const { container } = renderChart({
      series: barLine,
      orientation: 'horizontal',
    });
    expect(container.firstElementChild).toHaveAttribute(
      'data-orientation',
      'horizontal'
    );
    expect(tickLabels(container, 'y')).toContain('Jan');
    expect(tickLabels(container, 'x')).not.toContain('Jan');
  });

  // The bars grow rightward, so the rounded end swaps from the top corners to
  // the right ones — recharts draws that as a different arc path.
  it('rounds the growing end of a horizontal bar on its right corners', () => {
    const vertical = renderChart({ series: barLine, barRadius: 6 });
    const horizontal = renderChart({
      series: barLine,
      orientation: 'horizontal',
      barRadius: 6,
    });
    const path = (result: ReturnType<typeof renderChart>) =>
      result.container.querySelector('.recharts-bar-rectangle path')
        ?.getAttribute('d') ?? '';
    expect(path(vertical)).not.toBe('');
    expect(path(horizontal)).not.toBe(path(vertical));
  });

  // A second scale in horizontal orientation is an X axis, not a Y one — the
  // series are measured along X there.
  it('renders the secondary value axis as a second X axis when horizontal', () => {
    const { container } = renderChart({
      orientation: 'horizontal',
      series: [
        { key: 'revenue', type: 'bar' },
        { key: 'orders', type: 'line', yAxis: 'secondary' },
      ],
    });
    expect(container.querySelectorAll('.recharts-xAxis')).toHaveLength(2);
    expect(container.querySelectorAll('.recharts-yAxis')).toHaveLength(1);
  });

  // Counting the axes only proves both were declared. What matters is which one
  // the secondary series is measured against — a series bound to the wrong axis
  // still renders, just at the wrong scale. Rescaling one axis has to move the
  // series on that axis and leave the series on the other one where it was.
  it('plots a secondary horizontal series against the secondary X axis', () => {
    const horizontalDualAxis = (
      props: Partial<React.ComponentProps<typeof ComposedChart>>
    ) => {
      const { container } = renderChart({
        orientation: 'horizontal',
        series: [
          { key: 'revenue', type: 'bar' },
          { key: 'orders', type: 'line', yAxis: 'secondary' },
        ],
        ...props,
      });
      return {
        bar: container
          .querySelector('.recharts-bar-rectangle path')
          ?.getAttribute('d'),
        line: container
          .querySelector('.recharts-line-curve')
          ?.getAttribute('d'),
      };
    };

    const base = horizontalDualAxis({});
    const rescaledSecondary = horizontalDualAxis({
      secondaryYAxisDomain: 'dataMin-dataMax',
    });
    const rescaledPrimary = horizontalDualAxis({
      yAxisDomain: 'dataMin-dataMax',
    });

    expect(base.bar).toBeTruthy();
    expect(base.line).toBeTruthy();

    expect(rescaledSecondary.line).not.toBe(base.line);
    expect(rescaledSecondary.bar).toBe(base.bar);

    expect(rescaledPrimary.bar).not.toBe(base.bar);
    expect(rescaledPrimary.line).toBe(base.line);
  });

  // `yAxisOrientation` picks the side of the *value* axis. That axis is X when
  // the marks grow horizontally, so there is no left/right side to take and the
  // prop goes inert — it must not move the category axis instead.
  it('leaves yAxisOrientation inert when horizontal', () => {
    const plain = renderChart({ series: barLine, orientation: 'horizontal' });
    const flipped = renderChart({
      series: barLine,
      orientation: 'horizontal',
      yAxisOrientation: 'right',
    });
    const categoryTickX = (result: ReturnType<typeof renderChart>) =>
      result.container
        .querySelector(
          '.recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value'
        )
        ?.getAttribute('x');
    expect(categoryTickX(plain)).toBeTruthy();
    expect(categoryTickX(flipped)).toBe(categoryTickX(plain));
  });

  // The band runs along the category axis, which is Y here — so it spans the
  // full plot width and only part of its height, the opposite of the vertical
  // case.
  it('lays a reference band along the category axis when horizontal', () => {
    const rect = (orientation: 'vertical' | 'horizontal') => {
      const { container } = renderChart({
        series: barLine,
        orientation,
        referenceArea: { from: 'Feb', to: 'Mar' },
      });
      const node = container.querySelector('.recharts-reference-area-rect');
      return {
        width: Number(node?.getAttribute('width')),
        height: Number(node?.getAttribute('height')),
      };
    };
    const vertical = rect('vertical');
    const horizontal = rect('horizontal');
    expect(vertical.width).toBeLessThan(horizontal.width);
    expect(horizontal.height).toBeLessThan(vertical.height);
  });

  // A value rule crosses the value axis, so it stands vertical when the values
  // are on X — and a category rule turns the other way round.
  it('turns both kinds of reference rule when horizontal', () => {
    const rule = (props: Partial<React.ComponentProps<typeof ComposedChart>>) => {
      const { container } = renderChart({
        series: barLine,
        orientation: 'horizontal',
        ...props,
      });
      const line = container.querySelector('.recharts-reference-line line');
      return {
        x1: line?.getAttribute('x1'),
        x2: line?.getAttribute('x2'),
        y1: line?.getAttribute('y1'),
        y2: line?.getAttribute('y2'),
      };
    };
    const value = rule({ referenceLine: { value: 2000 } });
    expect(value.x1).toBe(value.x2);
    expect(value.y1).not.toBe(value.y2);

    const category = rule({ referenceLine: { category: 'Feb' } });
    expect(category.y1).toBe(category.y2);
    expect(category.x1).not.toBe(category.x2);
  });
});

describe('ComposedChart per-series config', () => {
  it('paints a series with its own color instead of the config one', () => {
    const { container } = renderChart({
      series: [{ key: 'revenue', type: 'bar', color: 'rgb(1 2 3)' }],
    });
    expect(
      container.querySelector('.recharts-bar-rectangle path')
    ).toHaveAttribute('fill', 'rgb(1 2 3)');
  });

  it('overrides stroke width and dash pattern per series', () => {
    const { container } = renderChart({
      series: [
        {
          key: 'orders',
          type: 'line',
          strokeWidth: 5,
          strokeDasharray: '5 5',
        },
      ],
    });
    const curve = container.querySelector('.recharts-line-curve');
    expect(curve).toHaveAttribute('stroke-width', '5');
    expect(curve).toHaveAttribute('stroke-dasharray', '5 5');
  });

  // recharts paints the dots into their own z-index layer, so they are counted
  // over the whole chart rather than inside the line's group: two lines, one
  // point marker per row, from the single series that opted in.
  it('renders dots only for the series that asks for them', () => {
    const { container } = renderChart({
      series: [
        { key: 'orders', type: 'line', showDots: true },
        { key: 'profit', type: 'line' },
      ],
    });
    expect(container.querySelectorAll('.recharts-line-dot')).toHaveLength(
      data.length
    );
  });

  // A bar has no stroke of its own, so the dash pattern has to bring one — in
  // the series color, or it would paint black.
  it('outlines a dashed bar series in its own color', () => {
    const { container } = renderChart({
      series: [
        {
          key: 'revenue',
          type: 'bar',
          strokeDasharray: '4 3',
          strokeWidth: 2,
        },
      ],
    });
    const bar = container.querySelector('.recharts-bar-rectangle path');
    expect(bar).toHaveAttribute('stroke', 'var(--color-revenue)');
    expect(bar).toHaveAttribute('stroke-dasharray', '4 3');
    expect(bar).toHaveAttribute('stroke-width', '2');
  });

  it('gives a series its own bar thickness', () => {
    const { container } = renderChart({
      series: [{ key: 'revenue', type: 'bar', barSize: 12 }],
    });
    expect(
      container.querySelector('.recharts-bar-rectangle path')
    ).toHaveAttribute('width', '12');
  });

  it('draws a track behind the bars of a series that opts in', () => {
    const plain = renderChart({ series: [{ key: 'revenue', type: 'bar' }] });
    const tracked = renderChart({
      series: [{ key: 'revenue', type: 'bar', showBackground: true }],
    });
    expect(
      plain.container.querySelectorAll('.recharts-bar-background-rectangle')
    ).toHaveLength(0);
    expect(
      tracked.container.querySelectorAll('.recharts-bar-background-rectangle')
    ).toHaveLength(data.length);
  });

  // `legendType: 'none'` is the one recharts icon value that changes what our
  // own legend content renders — it drops the entry from the payload entirely.
  it('keeps a series off the legend with legendType none', () => {
    const { container } = renderChart({
      series: [
        { key: 'revenue', type: 'bar' },
        { key: 'orders', type: 'line', legendType: 'none' },
      ],
    });
    const legend = container.querySelector('.recharts-legend-wrapper');
    expect(legend?.textContent).toContain('Revenue');
    expect(legend?.textContent).not.toContain('Orders');
  });

  // A null value breaks the line into two sub-paths; `connectNulls` bridges it
  // back into one.
  it('bridges null gaps only when connectNulls is on', () => {
    const gapped = [
      { month: 'Jan', orders: 120 },
      { month: 'Feb', orders: null },
      { month: 'Mar', orders: 156 },
    ];
    const countMoves = (container: HTMLElement) =>
      (
        container
          .querySelector('.recharts-line-curve')
          ?.getAttribute('d')
          ?.match(/M/g) ?? []
      ).length;
    const broken = renderChart({
      data: gapped,
      series: [{ key: 'orders', type: 'line' }],
    });
    const bridged = renderChart({
      data: gapped,
      series: [{ key: 'orders', type: 'line', connectNulls: true }],
    });
    expect(countMoves(broken.container)).toBe(2);
    expect(countMoves(bridged.container)).toBe(1);
  });

  it('takes the chart-level default when a series sets nothing', () => {
    const { container } = renderChart({
      strokeWidth: 4,
      series: [
        { key: 'orders', type: 'line' },
        { key: 'profit', type: 'line', strokeWidth: 1 },
      ],
    });
    const curves = container.querySelectorAll('.recharts-line-curve');
    expect(curves[0]).toHaveAttribute('stroke-width', '4');
    expect(curves[1]).toHaveAttribute('stroke-width', '1');
  });
});

describe('ComposedChart stacking', () => {
  it('stacks bars that share a stackId', () => {
    const grouped = renderChart({
      series: [
        { key: 'revenue', type: 'bar' },
        { key: 'profit', type: 'bar' },
      ],
    });
    const stacked = renderChart({
      series: [
        { key: 'revenue', type: 'bar', stackId: 'total' },
        { key: 'profit', type: 'bar', stackId: 'total' },
      ],
    });
    const firstBarsOf = (result: ReturnType<typeof renderChart>) =>
      Array.from(result.container.querySelectorAll('.recharts-bar')).map(
        (layer) => layer.querySelector('.recharts-bar-rectangle path')
      );

    const [groupedA, groupedB] = firstBarsOf(grouped);
    expect(groupedA?.getAttribute('x')).not.toBe(groupedB?.getAttribute('x'));

    // Stacked segments share the category's slot and sit on top of each other:
    // the upper one ends exactly where the lower one starts.
    const [stackedA, stackedB] = firstBarsOf(stacked);
    expect(stackedA?.getAttribute('x')).toBe(stackedB?.getAttribute('x'));
    expect(stackedA?.getAttribute('width')).toBe(
      stackedB?.getAttribute('width')
    );
    const bottom = Number(stackedA?.getAttribute('y'));
    const top = Number(stackedB?.getAttribute('y'));
    const topHeight = Number(stackedB?.getAttribute('height'));
    expect(top + topHeight).toBeCloseTo(bottom, 5);
  });

  // The ids are namespaced per mark type, so one id can't merge a bar into an
  // area stack — the bar keeps the full height it has on its own.
  it('does not stack an area onto a bar that shares its id', () => {
    const alone = renderChart({ series: [{ key: 'revenue', type: 'bar' }] });
    const withArea = renderChart({
      series: [
        { key: 'revenue', type: 'bar', stackId: 'total' },
        { key: 'profit', type: 'area', stackId: 'total' },
      ],
    });
    const height = (result: ReturnType<typeof renderChart>) =>
      result.container
        .querySelector('.recharts-bar-rectangle path')
        ?.getAttribute('height');
    expect(height(withArea)).toBe(height(alone));
  });

  it('rounds only the segment at the top of a stack', () => {
    const { container } = renderChart({
      barRadius: 8,
      series: [
        { key: 'revenue', type: 'bar', stackId: 'total' },
        { key: 'profit', type: 'bar', stackId: 'total' },
      ],
    });
    const [lower, upper] = Array.from(
      container.querySelectorAll('.recharts-bar')
    ).map((layer) =>
      layer.querySelector('.recharts-bar-rectangle path')?.getAttribute('d')
    );
    // recharts draws corner arcs with `A`; a square-cornered rect has none.
    expect(lower).not.toContain('A');
    expect(upper).toContain('A');
  });
});

describe('ComposedChart references, margin and legend placement', () => {
  it('draws a reference line on the value axis', () => {
    const { container } = renderChart({
      referenceLine: { value: 2000, label: 'Target' },
    });
    expect(
      container.querySelector('.recharts-reference-line line')
    ).toBeInTheDocument();
    expect(container.textContent).toContain('Target');
  });

  it('averages the plotted series when asked', () => {
    const fixed = renderChart({ referenceLine: { value: 2000 } });
    const averaged = renderChart({ referenceLine: { average: 'revenue' } });
    const y = (result: ReturnType<typeof renderChart>) =>
      result.container
        .querySelector('.recharts-reference-line line')
        ?.getAttribute('y1');
    expect(averaged.container.querySelector('.recharts-reference-line')).toBeInTheDocument();
    expect(y(averaged)).not.toBe(y(fixed));
  });

  // A category rule runs the other way — across the categories, at one of them.
  it('draws a vertical rule at a category', () => {
    const { container } = renderChart({
      referenceLine: { category: 'Feb', label: 'Today' },
    });
    const rule = container.querySelector('.recharts-reference-line line');
    expect(rule?.getAttribute('x1')).toBe(rule?.getAttribute('x2'));
    expect(container.textContent).toContain('Today');
  });

  it('draws nothing for a category that is not in the data', () => {
    const { container } = renderChart({ referenceLine: { category: 'Dec' } });
    expect(container.querySelector('.recharts-reference-line')).toBeNull();
  });

  // A rule belongs to one scale. `orders` (98–156) lives on the secondary axis
  // while `revenue` (1398–9800) sets the primary one, so plotting its average
  // against the primary scale would pin the rule to the baseline.
  describe('on a chart with two value axes', () => {
    const dualSeries = [
      { key: 'revenue', type: 'bar' as const },
      { key: 'orders', type: 'line' as const, yAxis: 'secondary' as const },
    ];
    const ruleY = (props: Partial<React.ComponentProps<typeof ComposedChart>>) =>
      Number(
        renderChart({ series: dualSeries, ...props }).container
          .querySelector('.recharts-reference-line line')
          ?.getAttribute('y1')
      );
    // The primary axis fits 1398–9800 into the plot, so a rule at ~127 (the
    // orders mean) drawn against it sits within a few px of the baseline.
    // Rendered per test, not once: the sized ResizeObserver recharts needs is
    // installed per case by `giveEveryChartASize`, after the describe body has run.
    const baselineY = () => ruleY({ referenceLine: { value: 0 } });

    it('reads an average off the axis of the series it names', () => {
      const onSecondary = ruleY({ referenceLine: { average: 'orders' } });
      // ~127 of a 98–156 scale lands mid-plot, nowhere near the baseline.
      expect(baselineY() - onSecondary).toBeGreaterThan(50);
    });

    it('pools only the series on the axis a rule is drawn against', () => {
      // `average: true` defaults to the primary axis, so it must average
      // `revenue` alone (4532.67) rather than mixing in the orders scale.
      const pooled = ruleY({ referenceLine: { average: true } });
      const revenueOnly = ruleY({ referenceLine: { average: 'revenue' } });
      expect(pooled).toBeCloseTo(revenueOnly, 5);
    });

    it('places a fixed value on the axis the caller names', () => {
      const onPrimary = ruleY({ referenceLine: { value: 130 } });
      const onSecondary = ruleY({
        referenceLine: { value: 130, yAxis: 'secondary' },
      });
      // 130 is near the floor of the revenue scale but mid-range for orders.
      const baseline = baselineY();
      expect(baseline - onPrimary).toBeLessThan(20);
      expect(baseline - onSecondary).toBeGreaterThan(50);
    });
  });

  // Without a series on that axis there is no secondary axis to bind to, and
  // recharts would invent an implicit one — so the request is ignored and the
  // rule stays on the primary scale.
  it('ignores a secondary yAxis request on a single-scale chart', () => {
    const y = (props: Partial<React.ComponentProps<typeof ComposedChart>>) =>
      renderChart(props).container
        .querySelector('.recharts-reference-line line')
        ?.getAttribute('y1');
    expect(y({ referenceLine: { value: 2000, yAxis: 'secondary' } })).toBe(
      y({ referenceLine: { value: 2000 } })
    );
  });

  it('shades a band behind a range of categories', () => {
    const { container } = renderChart({
      referenceArea: { from: 'Feb', to: 'Mar', label: 'Forecast' },
    });
    expect(
      container.querySelector('.recharts-reference-area-rect')
    ).toBeInTheDocument();
    expect(container.textContent).toContain('Forecast');
  });

  // A band is a backdrop: it has to paint under the marks and over the grid.
  // recharts' own default (100) collides with the layer the series are pulled
  // into to order them by array index, which paints the band over the bars.
  it('paints a band under the series and over the grid', () => {
    const { container } = renderChart({
      series: [{ key: 'revenue', type: 'bar' }],
      referenceArea: { from: 'Feb' },
    });
    const layerOf = (selector: string) => {
      const layer = container
        .querySelector(selector)
        ?.closest('[class*="recharts-zIndex-layer_"]');
      const match = layer?.className.match(/recharts-zIndex-layer_(-?\d+)/);
      return Number(match?.[1]);
    };
    const band = layerOf('.recharts-reference-area');
    expect(band).toBeLessThan(layerOf('.recharts-bar'));
    expect(band).toBeGreaterThan(layerOf('.recharts-cartesian-grid'));
  });

  // The rule is an annotation, so it goes the other way — on top of the marks.
  it('paints a reference rule over the series', () => {
    const { container } = renderChart({
      series: [{ key: 'revenue', type: 'bar' }],
      referenceLine: { value: 2000 },
    });
    const layerOf = (selector: string) => {
      const layer = container
        .querySelector(selector)
        ?.closest('[class*="recharts-zIndex-layer_"]');
      return Number(
        layer?.className.match(/recharts-zIndex-layer_(-?\d+)/)?.[1]
      );
    };
    expect(layerOf('.recharts-reference-line')).toBeGreaterThan(
      layerOf('.recharts-bar')
    );
  });

  it('accepts several reference lines and bands at once', () => {
    const { container } = renderChart({
      referenceLine: [{ value: 1000 }, { category: 'Feb' }],
      referenceArea: [{ from: 'Jan', to: 'Jan' }, { from: 'Mar' }],
    });
    expect(container.querySelectorAll('.recharts-reference-line')).toHaveLength(2);
    expect(container.querySelectorAll('.recharts-reference-area')).toHaveLength(2);
  });

  it('insets the plot by a caller margin', () => {
    const gridX = (result: ReturnType<typeof renderChart>) =>
      Number(
        result.container
          .querySelector('.recharts-cartesian-grid-horizontal line')
          ?.getAttribute('x1')
      );
    expect(gridX(renderChart({ margin: { left: 48 } }))).toBeGreaterThan(
      gridX(renderChart())
    );
  });

  // A vertical rule hangs its caption above the plot, which recharts' 5px inset
  // would clip. The chart reserves the headroom itself rather than making the
  // caller discover it — but only when such a caption exists.
  it('reserves top headroom for a labelled vertical rule', () => {
    const plotTop = (props: Partial<React.ComponentProps<typeof ComposedChart>>) =>
      Number(
        renderChart(props)
          .container.querySelector('.recharts-cartesian-grid-horizontal line')
          ?.getAttribute('y1')
      );
    const bare = plotTop({});
    // A category rule is vertical in the default orientation.
    expect(plotTop({ referenceLine: { category: 'Feb', label: 'Today' } })
    ).toBeGreaterThan(bare);
    // The same rule without a caption has nothing to clip, so nothing is added.
    expect(plotTop({ referenceLine: { category: 'Feb' } })).toBe(bare);
    // A value rule captions itself inside the plot, so it needs no headroom.
    expect(plotTop({ referenceLine: { value: 2000, label: 'Target' } })).toBe(
      bare
    );
  });

  it('puts the legend above the plot when asked', () => {
    const bottom = renderChart();
    const top = renderChart({ legendPosition: 'top' });
    expect(
      bottom.container.querySelector('.recharts-legend-wrapper > div')
    ).toHaveClass('pt-3');
    expect(
      top.container.querySelector('.recharts-legend-wrapper > div')
    ).toHaveClass('pb-3');
  });

  // The cursor only paints while the pointer is over the plot, so this guards
  // the prop path: `tooltipCursor` is consumed, not forwarded to the wrapper.
  it('consumes tooltipCursor instead of forwarding it to the DOM', () => {
    const { container } = renderChart({ tooltipCursor: false });
    expect(container.firstElementChild).not.toHaveAttribute('tooltipcursor');
  });
});

// How the two scales read against each other is covered by the `SecondaryYAxis*`
// VR stories. These assert the contract this composition owns: the per-series
// opt-in and every secondary-axis prop mount, and a chart that never opts in
// stays on the single-axis path.
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
  // baseline.
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
