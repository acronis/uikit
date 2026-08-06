import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Line,
  XAxis,
} from 'recharts';

import { ComposedChart } from '../composed-chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  formatCompactNumber,
  type ChartConfig,
} from '../../chart';

// Series colors are supplied by the caller via `config`, keyed by each series'
// key. There is no chart token tier yet, so these reference the shared semantic
// brand/status tokens (a dedicated data-viz palette is pending an upstream design
// pass). The status tokens are chromatic in every brand; `brand-secondary` is
// brand-dependent.
// All three series sit in the same thousands-scale range so that, on the shared
// Y axis, the line series shows real variation instead of being flattened at the
// bottom by a much larger series.
const data = [
  { month: 'Jan', revenue: 4200, forecast: 3800, profit: 2400 },
  { month: 'Feb', revenue: 3100, forecast: 2900, profit: 1400 },
  { month: 'Mar', revenue: 6500, forecast: 5200, profit: 4800 },
  { month: 'Apr', revenue: 4900, forecast: 4100, profit: 2900 },
  { month: 'May', revenue: 5400, forecast: 4800, profit: 3100 },
  { month: 'Jun', revenue: 4800, forecast: 5100, profit: 2410 },
];

const config = {
  revenue: { label: 'Revenue', color: 'var(--ui-background-brand-secondary)' },
  forecast: {
    label: 'Forecast',
    color: 'var(--ui-background-status-strong-danger)',
  },
  profit: {
    label: 'Profit',
    color: 'var(--ui-background-status-strong-success)',
  },
} satisfies ChartConfig;

const meta = {
  title: 'Widgets/ComposedChart',
  component: ComposedChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // The ChartContainer is transparent by design (it inherits the surface it sits
  // on — usually a Card). Render the stories on a themed surface so the chart is
  // legible in both light and dark; without it, dark mode flips the token-driven
  // text/grid but leaves the backdrop unthemed.
  decorators: [
    (Story) => (
      <div className="rounded-lg border border-border bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
  args: {
    config,
    data,
    series: [
      { key: 'revenue', type: 'bar' },
      { key: 'profit', type: 'line' },
    ],
    xKey: 'month',
    curve: 'monotone',
    barRadius: 4,
    fillOpacity: 0.3,
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    className: 'h-[320px] w-[560px]',
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    curve: { control: 'inline-radio', options: ['linear', 'monotone', 'step'] },
    barRadius: { control: { type: 'number', min: 0, max: 20 } },
    barSize: { control: { type: 'number', min: 1, max: 80 } },
    barGap: { control: { type: 'number', min: 0, max: 40 } },
    barCategoryGap: { control: 'text' },
    fillOpacity: { control: { type: 'number', min: 0, max: 1, step: 0.1 } },
    strokeWidth: { control: { type: 'number', min: 1, max: 8 } },
    showDots: { control: 'boolean' },
    showActiveDots: { control: 'boolean' },
    connectNulls: { control: 'boolean' },
    showBackground: { control: 'boolean' },
    showActiveBar: { control: 'boolean' },
    tooltipCursor: { control: 'boolean' },
    legendPosition: { control: 'inline-radio', options: ['top', 'bottom'] },
    xAxisLabel: { control: 'text' },
    yAxisLabel: { control: 'text' },
    yUnit: { control: 'text' },
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    showBrush: { control: 'boolean' },
    brushHeight: { control: { type: 'number', min: 16, max: 80 } },
    brushAriaLabel: { control: 'text' },
    animate: { control: 'boolean' },
    animationDuration: { control: { type: 'number' } },
    animationBegin: { control: { type: 'number' } },
    animationEasing: {
      control: 'select',
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
    },
    yAxisOrientation: { control: 'inline-radio', options: ['left', 'right'] },
    showSecondaryYAxis: { control: 'boolean' },
    secondaryYAxisLabel: { control: 'text' },
    secondaryYUnit: { control: 'text' },
    showLabels: { control: 'boolean' },
    labelPosition: {
      control: 'select',
      options: [
        'top',
        'bottom',
        'left',
        'right',
        'center',
        'insideTop',
        'insideBottom',
        'insideLeft',
        'insideRight',
        'insideStart',
        'insideEnd',
      ],
    },
  },
} satisfies Meta<typeof ComposedChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// New shared axis/grid knobs: rotated X ticks, a zero-anchored Y domain, a
// fixed Y tick count, and a dashed grid. See "Formatting and hiding axes".
export const AxisAndGridConfig: Story = {
  args: {
    xAxisAngle: -45,
    yAxisDomain: 'zero',
    yAxisTickCount: 4,
    gridDashed: true,
  },
};

// The classic combo: bars for a quantity + a line for a related trend.
export const BarPlusLine: Story = {
  args: {
    series: [
      { key: 'revenue', type: 'bar' },
      { key: 'profit', type: 'line' },
    ],
  },
};

// All three render types on one chart — bars behind, area over them, line on top.
export const BarAreaLine: Story = {
  args: {
    series: [
      { key: 'revenue', type: 'bar' },
      { key: 'forecast', type: 'area' },
      { key: 'profit', type: 'line' },
    ],
  },
};

// Axis titles + a Y-axis unit suffix, forwarded to recharts' native
// `label` / `unit`. The title inherits the theme token via the container's
// `.recharts-label` fill selector.
export const AxisLabels: Story = {
  args: {
    xAxisLabel: 'Month',
    yAxisLabel: 'Amount',
    yUnit: '$',
  },
};

// All chrome toggled off + squared bars — the baseline that would catch a toggle
// silently becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: {
    series: [
      { key: 'revenue', type: 'bar' },
      { key: 'profit', type: 'line' },
    ],
    showGrid: false,
    showTooltip: false,
    showLegend: false,
    barRadius: 0,
  },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition so recharts' `defaultIndex` can open the tooltip
// statically for the visual-regression baseline (see the skill's VR note).
export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[320px] w-[560px]">
      <RechartsComposedChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip defaultIndex={2} active content={<ChartTooltipContent />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
        <Area
          type="monotone"
          dataKey="forecast"
          stroke="var(--color-forecast)"
          fill="var(--color-forecast)"
          fillOpacity={0.3}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="var(--color-profit)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </RechartsComposedChart>
    </ChartContainer>
  ),
};

// A configured `ChartTooltipContent` (from this library, no recharts needed):
// `labelFormatter` adds an extra header field; `formatter` renders each row
// (swatch + config label + currency-formatted value). Shared by the two stories.
const customTooltipContent = (
  <ChartTooltipContent
    labelFormatter={(label) => `${label} · fiscal Q3`}
    formatter={(value, name, item) => (
      <div className="flex w-full items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: item.color }}
        />
        <span className="text-muted-foreground">
          {config[name as keyof typeof config]?.label ?? name}
        </span>
        <span className="ms-auto font-mono font-medium tabular-nums">
          ${Number(value).toLocaleString()}
        </span>
      </div>
    )}
  />
);

// Customize the tooltip through the component's `tooltipContent` prop — this is
// the usage example (autodocs). The tooltip is hover-only, so it isn't painted
// here; `CustomTooltipOpen` below is the visual-regression case.
export const CustomTooltip: Story = {
  args: { tooltipContent: customTooltipContent },
};

// The same custom tooltip, forced open for the VR baseline: like `TooltipOpen`,
// this renders the raw composition (recharts can't open a hover tooltip
// statically otherwise) with the shared custom content wired in.
export const CustomTooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[320px] w-[560px]">
      <RechartsComposedChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip defaultIndex={2} active content={customTooltipContent} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
        <Area
          type="monotone"
          dataKey="forecast"
          stroke="var(--color-forecast)"
          fill="var(--color-forecast)"
          fillOpacity={0.3}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="var(--color-profit)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </RechartsComposedChart>
    </ChartContainer>
  ),
};

// Compact the shared value axis with `yTickFormatter` — `4200 → "4.2K"`. A real
// value transform beyond what a `unit` suffix can do.
export const CompactValueAxis: Story = {
  args: { yTickFormatter: formatCompactNumber },
};

// Hide both axes with `showXAxis` / `showYAxis` — the compact/sparkline layout.
// Carries a baseline so a regression in either toggle is caught visually; the
// unit tests can't assert it (recharts needs a laid-out container).
export const HiddenAxes: Story = {
  args: { showXAxis: false, showYAxis: false },
};

// Entrance animation on — a live example. Excluded from VR (snapshot.skip):
// the motion is non-deterministic, so it must not become a baseline.
export const Animated: Story = {
  parameters: { snapshot: { skip: true } },
  args: { animate: true, animationDuration: 800 },
};

// Value labels across all three mark types, compact-formatted. The shared `data`
// packs the series into one narrow band (so the line isn't flattened), which
// would stack the three label rows on top of each other — this set gives each
// series its own band instead, one clear label row per mark type. Series render
// back-to-front: bars, the area washing over them, then the line.
const labelData = [
  { month: 'Jan', revenue: 7400, forecast: 4600, profit: 1400 },
  { month: 'Feb', revenue: 8200, forecast: 5200, profit: 1800 },
  { month: 'Mar', revenue: 7000, forecast: 4400, profit: 1200 },
  { month: 'Apr', revenue: 8600, forecast: 5400, profit: 2000 },
  { month: 'May', revenue: 7600, forecast: 4800, profit: 1600 },
  { month: 'Jun', revenue: 8800, forecast: 5000, profit: 2200 },
];

export const Labels: Story = {
  args: {
    data: labelData,
    series: [
      { key: 'revenue', type: 'bar' },
      { key: 'forecast', type: 'area' },
      { key: 'profit', type: 'line' },
    ],
    showLabels: true,
    labelFormatter: formatCompactNumber,
  },
};

// Two scales, two magnitudes: revenue in the thousands, conversion rate in
// single-digit percent. This is the case the secondary axis exists for — on the
// shared axis the rate collapses onto the baseline (see `SecondaryYAxisShared`
// below, the same data with one scale).
const dualAxisData = [
  { month: 'Jan', revenue: 4200, conversion: 3.1 },
  { month: 'Feb', revenue: 3100, conversion: 2.4 },
  { month: 'Mar', revenue: 6500, conversion: 5.2 },
  { month: 'Apr', revenue: 4900, conversion: 4.1 },
  { month: 'May', revenue: 5400, conversion: 6.3 },
  { month: 'Jun', revenue: 4800, conversion: 5.8 },
];

const dualAxisConfig = {
  revenue: { label: 'Revenue', color: 'var(--ui-background-brand-secondary)' },
  conversion: {
    label: 'Conversion',
    color: 'var(--ui-background-status-strong-success)',
  },
} satisfies ChartConfig;

const dualAxisSeries = [
  { key: 'revenue', type: 'bar' as const },
  { key: 'conversion', type: 'line' as const, yAxis: 'secondary' as const },
];

// A series opts in with `yAxis: 'secondary'`; the second axis appears on the
// opposite side, with its own unit, formatter, and domain.
export const SecondaryYAxis: Story = {
  args: {
    data: dualAxisData,
    config: dualAxisConfig,
    series: dualAxisSeries,
    yTickFormatter: formatCompactNumber,
    secondaryYUnit: '%',
    // Zero-anchored (recharts' own default, spelled out) so both axes divide their
    // range into the same number of steps and their tick rows line up. `auto` fits
    // the rate tightly instead — 2.1%, 3.15%, … — and its ticks then fall between
    // the gridlines the primary axis draws.
    secondaryYAxisDomain: 'zero',
  },
};

// The same data on one shared scale — the contrast story. The conversion line sits
// flat on the baseline here, which is the regression this feature is judged
// against: if the two baselines ever look alike, the second axis stopped applying.
export const SecondaryYAxisShared: Story = {
  args: {
    data: dualAxisData,
    config: dualAxisConfig,
    series: [
      { key: 'revenue', type: 'bar' },
      { key: 'conversion', type: 'line' },
    ],
    yTickFormatter: formatCompactNumber,
  },
};

// A title per axis, each rotated to read from the outside in.
export const SecondaryYAxisLabels: Story = {
  args: {
    data: dualAxisData,
    config: dualAxisConfig,
    series: dualAxisSeries,
    yAxisLabel: 'Revenue',
    yUnit: '$',
    secondaryYAxisLabel: 'Conversion',
    secondaryYUnit: '%',
  },
};

// `yAxisOrientation` flips the primary axis to the right; the secondary always
// takes the opposite side, so the whole pair mirrors.
export const YAxisOrientationRight: Story = {
  args: {
    data: dualAxisData,
    config: dualAxisConfig,
    series: dualAxisSeries,
    yAxisOrientation: 'right',
    yTickFormatter: formatCompactNumber,
    secondaryYUnit: '%',
  },
};

// `showSecondaryYAxis: false` drops the second axis's chrome but keeps its scale —
// the line stays scaled against it. Baselined because the unit env can't tell an
// honoured toggle from a no-op.
export const SecondaryYAxisHidden: Story = {
  args: {
    data: dualAxisData,
    config: dualAxisConfig,
    series: dualAxisSeries,
    yTickFormatter: formatCompactNumber,
    showSecondaryYAxis: false,
  },
};

// Every series on the secondary axis — the degenerate opt-in. The primary axis has
// nothing measured against it, so it gives up its gutter and the grid follows the
// axis that does. Baselined because that's the whole difference: unguarded, this
// renders a blank left gutter and only two grid lines.
export const AllSeriesSecondaryYAxis: Story = {
  args: {
    data: dualAxisData,
    config: dualAxisConfig,
    series: [
      { key: 'revenue', type: 'bar', yAxis: 'secondary' },
      { key: 'conversion', type: 'line', yAxis: 'secondary' },
    ],
    secondaryYTickFormatter: formatCompactNumber,
  },
};

// A longer series than the six-point default, so the brush has a range worth
// zooming into. Built from a formula rather than 24 literal rows — it stays
// deterministic, which the visual baseline requires.
const weeklyData = Array.from({ length: 24 }, (_, index) => ({
  month: `W${index + 1}`,
  revenue: 4200 + ((index * 370) % 2400),
  profit: 1800 + ((index * 230) % 1600),
}));

// `showBrush` adds a range selector under the plot: drag a handle (or the
// selected window itself) to zoom the series into a slice of the data.
export const RangeBrush: Story = {
  args: {
    data: weeklyData,
    series: [
      { key: 'revenue', type: 'bar' },
      { key: 'profit', type: 'line' },
    ],
    showBrush: true,
  },
};

// `orientation="horizontal"` grows the marks rightward: the categories move to
// the Y axis, the values to X, the grid lines turn vertical, and each bar rounds
// its right end instead of its top.
export const HorizontalOrientation: Story = {
  args: {
    orientation: 'horizontal',
    series: [
      { key: 'revenue', type: 'bar' },
      { key: 'profit', type: 'line' },
    ],
  },
};

// Two scales on a horizontal chart: the second value axis is an X axis too, so
// it sits along the top edge rather than opposite the categories.
export const HorizontalSecondaryAxis: Story = {
  args: {
    orientation: 'horizontal',
    data: dualAxisData,
    config: dualAxisConfig,
    series: dualAxisSeries,
    xTickFormatter: formatCompactNumber,
    secondaryYUnit: '%',
    secondaryYAxisDomain: 'zero',
  },
};

// Series that share a `stackId` stack — bars with bars, areas with areas. Only
// the top segment of a stack rounds its corners; the line rides over the total.
export const StackedBars: Story = {
  args: {
    series: [
      { key: 'revenue', type: 'bar', stackId: 'total' },
      { key: 'forecast', type: 'bar', stackId: 'total' },
      { key: 'profit', type: 'line' },
    ],
  },
};

// The same id on two areas builds a stacked band. Ids are namespaced per mark
// type, so a bar can't be pulled into an area's stack by reusing its id.
export const StackedAreas: Story = {
  args: {
    series: [
      { key: 'revenue', type: 'area', stackId: 'mix' },
      { key: 'forecast', type: 'area', stackId: 'mix' },
    ],
  },
};

// Every styling prop on the chart is the default a series overrides: here the
// forecast reads as a secondary, dashed, dot-less projection next to the solid
// actuals, and the bar series takes a fixed thickness of its own.
export const PerSeriesStyling: Story = {
  args: {
    series: [
      { key: 'revenue', type: 'bar', barSize: 18, barRadius: 2 },
      {
        key: 'forecast',
        type: 'line',
        strokeDasharray: '5 5',
        strokeWidth: 1.5,
        legendType: 'line',
      },
      { key: 'profit', type: 'line', showDots: true },
    ],
  },
};

// Chart-level series defaults: one stroke width, dots, and `connectNulls` for
// every line/area that doesn't override them. The gap in `profit` is bridged;
// `forecast` opts out and breaks instead.
const gappedData = [
  { month: 'Jan', revenue: 4200, forecast: 3800, profit: 2400 },
  { month: 'Feb', revenue: 3100, forecast: null, profit: null },
  { month: 'Mar', revenue: 6500, forecast: 5200, profit: 4800 },
  { month: 'Apr', revenue: 4900, forecast: 4100, profit: 2900 },
  { month: 'May', revenue: 5400, forecast: 4800, profit: 3100 },
  { month: 'Jun', revenue: 4800, forecast: 5100, profit: 2410 },
];

export const SeriesDefaults: Story = {
  args: {
    data: gappedData,
    strokeWidth: 3,
    showDots: true,
    connectNulls: true,
    series: [
      { key: 'revenue', type: 'bar' },
      { key: 'forecast', type: 'line', connectNulls: false },
      { key: 'profit', type: 'line' },
    ],
  },
};

// Bar geometry: a track behind every bar, a fixed thickness, and the two gaps
// (between bars of one category, and between the category groups).
export const BarGeometry: Story = {
  args: {
    series: [
      { key: 'revenue', type: 'bar' },
      { key: 'forecast', type: 'bar' },
      { key: 'profit', type: 'line' },
    ],
    showBackground: true,
    barSize: 16,
    barGap: 2,
    barCategoryGap: '30%',
  },
};

// References: a dashed target on the value axis, an average of one series, a
// vertical rule marking the hand-off into the forecast, and the band behind it.
export const References: Story = {
  args: {
    series: [
      { key: 'revenue', type: 'bar' },
      { key: 'profit', type: 'line' },
    ],
    referenceLine: [
      { value: 6000, label: 'Target' },
      { average: 'revenue', label: 'Avg' },
      { category: 'Apr' },
    ],
    referenceArea: { from: 'Apr', label: 'Forecast' },
  },
};

// The legend above the plot instead of below it.
export const LegendTop: Story = {
  args: { legendPosition: 'top' },
};

// A wider plot inset — room for long value labels the default gutter would clip.
// Any side left out keeps the chart's own default.
export const PlotMargin: Story = {
  args: {
    margin: { left: 32, right: 32, top: 24 },
    yTickFormatter: formatCompactNumber,
  },
};
