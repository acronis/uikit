import * as React from 'react';
import { render } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';

import { ComposedChart } from '../composed-chart';
import { ChartTooltipContent, type ChartConfig,
  resolveAnimation,
} from '../../chart';

beforeAll(() => {
  // happy-dom's ResizeObserver never reports a size, so recharts'
  // ResponsiveContainer renders nothing and its children never mount. The
  // per-series styling, stacking and orientation below are SVG output, so those
  // tests need the real thing.
  class SizedResizeObserver {
    constructor(private readonly callback: ResizeObserverCallback) {}
    observe(target: Element) {
      this.callback(
        [
          {
            target,
            contentRect: { width: 600, height: 300 },
          } as unknown as ResizeObserverEntry,
        ],
        this as unknown as ResizeObserver
      );
    }
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver =
    SizedResizeObserver as unknown as typeof ResizeObserver;
});

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
  // `tickFormatter`; how the rotated/thinned tick row actually lays out is a
  // visual question the axis-formatting VR stories own, so this guards the prop
  // path against a plumbing regression.
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

  // These exercise the prop paths (mixed series types, curve, chrome toggles)
  // against a plumbing/crash regression; how the result looks is covered by the
  // VR stories, and the SVG the new props emit is asserted further down.
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

  // Axis titles/unit forward to recharts' XAxis/YAxis `label`/`unit`; this only
  // guards the prop path (the rendered titles are covered by the `AxisLabels` VR
  // story).
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
  // to recharts' Tooltip. The tooltip is hover-only, so this guards the prop path
  // — consumers customize the tooltip without importing recharts.
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

// The rendered labels and the motion itself are covered by the
// visual-regression stories. These assert the prop contract: the composition
// accepts every animation/label prop and mounts, and `animate` resolves to the
// reduced-motion-aware value rather than a literal `true`.
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
