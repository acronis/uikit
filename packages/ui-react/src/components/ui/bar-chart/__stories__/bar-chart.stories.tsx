import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Cell, XAxis } from 'recharts';

import { BarChart, dropHeadroomSeries } from '../bar-chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  formatCompactNumber,
  type ChartConfig,
} from '../../chart';

// Series colors are supplied by the caller via `config`. There is no chart token
// tier yet, so these reference the shared semantic brand/status tokens (a
// dedicated data-viz palette is pending an upstream design pass). The status
// tokens are chromatic in every brand; `brand-secondary` is brand-dependent.
const data = [
  { month: 'Jan', desktop: 186, mobile: 80, tablet: 40 },
  { month: 'Feb', desktop: 305, mobile: 200, tablet: 90 },
  { month: 'Mar', desktop: 237, mobile: 120, tablet: 60 },
  { month: 'Apr', desktop: 73, mobile: 190, tablet: 30 },
  { month: 'May', desktop: 209, mobile: 130, tablet: 70 },
  { month: 'Jun', desktop: 214, mobile: 140, tablet: 80 },
];

const config = {
  desktop: { label: 'Desktop', color: 'var(--ui-background-brand-secondary)' },
  mobile: { label: 'Mobile', color: 'var(--ui-background-status-strong-danger)' },
  tablet: { label: 'Tablet', color: 'var(--ui-background-status-strong-success)' },
} satisfies ChartConfig;

const meta = {
  title: 'Widgets/BarChart',
  component: BarChart,
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
    dataKeys: ['desktop', 'mobile', 'tablet'],
    xKey: 'month',
    barRadius: 4,
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    className: 'h-[320px] w-[560px]',
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
    },
    layout: { control: 'inline-radio', options: ['grouped', 'stacked'] },
    barRadius: { control: { type: 'number', min: 0, max: 20 } },
    referenceLine: {
      control: 'object',
      description:
        'One line or an array. Each: `{ value }` (fixed) or `{ average: true | "<key>" }`, with an optional `{ label }`. The object editor needs **strict JSON** (double-quoted keys) — e.g. `[{ "value": 300, "label": "Target" }]` — then click the submit arrow.',
    },
    xAxisLabel: { control: 'text' },
    yAxisLabel: { control: 'text' },
    xUnit: { control: 'text' },
    yUnit: { control: 'text' },
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    showBrush: { control: 'boolean' },
    brushHeight: { control: { type: 'number', min: 16, max: 80 } },
    brushAriaLabel: { control: 'text' },
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
    animate: { control: 'boolean' },
    animationDuration: { control: { type: 'number' } },
    animationBegin: { control: { type: 'number' } },
    animationEasing: {
      control: 'select',
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
    },
  },
} satisfies Meta<typeof BarChart>;

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

// Data labels on each bar (T15): the value at the growing end, formatted with the
// same compact formatter the axis can use. A single series keeps the labels from
// colliding in a grouped chart.
export const Labels: Story = {
  args: {
    dataKeys: ['desktop'],
    showLabels: true,
    labelFormatter: formatCompactNumber,
    showLegend: false,
  },
};

export const VerticalGrouped: Story = {
  args: { orientation: 'vertical', layout: 'grouped' },
};

export const HorizontalGrouped: Story = {
  args: { orientation: 'horizontal', layout: 'grouped' },
};

export const VerticalStacked: Story = {
  args: { orientation: 'vertical', layout: 'stacked' },
};

export const HorizontalStacked: Story = {
  args: { orientation: 'horizontal', layout: 'stacked' },
};

// A fixed target line on the value axis, captioned.
export const ReferenceLine: Story = {
  args: {
    dataKeys: ['desktop'],
    referenceLine: { value: 250, label: 'Target' },
  },
};

// The reference line computed as the mean of every plotted series.
export const AverageLine: Story = {
  args: {
    dataKeys: ['desktop'],
    referenceLine: { average: true, label: 'Average' },
  },
};

// Several lines at once — pass an array (here a fixed target + the average).
export const MultipleReferenceLines: Story = {
  args: {
    dataKeys: ['desktop'],
    referenceLine: [
      { value: 300, label: 'Target' },
      { average: true, label: 'Average' },
    ],
  },
};

// Response times in ms — real units, so `yUnit`/`xUnit` read truthfully. (The
// session-count data above has no unit; the former `yUnit="k"` was an
// abbreviation masquerading as one.)
const latencyData = [
  { month: 'Jan', p95: 180 },
  { month: 'Feb', p95: 240 },
  { month: 'Mar', p95: 210 },
  { month: 'Apr', p95: 320 },
  { month: 'May', p95: 260 },
  { month: 'Jun', p95: 290 },
];

const latencyConfig = {
  p95: { label: 'p95 latency', color: 'var(--ui-background-brand-secondary)' },
} satisfies ChartConfig;

// Axis titles + a Y-axis unit suffix, forwarded to recharts' native
// `label` / `unit`. The title inherits the theme token via the container's
// `.recharts-label` fill selector.
export const AxisLabels: Story = {
  args: {
    config: latencyConfig,
    data: latencyData,
    dataKeys: ['p95'],
    xAxisLabel: 'Month',
    yAxisLabel: 'Response time',
    yUnit: 'ms',
  },
};

// Axis titles on the horizontal orientation, where the axes swap: the value axis
// is the (numeric) X axis, so the unit suffix rides `xUnit`. Covers the mirrored
// label/unit wiring that the vertical `AxisLabels` baseline can't.
export const HorizontalAxisLabels: Story = {
  args: {
    orientation: 'horizontal',
    config: latencyConfig,
    data: latencyData,
    dataKeys: ['p95'],
    xAxisLabel: 'Response time',
    yAxisLabel: 'Month',
    xUnit: 'ms',
  },
};

// Horizontal bars put the values on X, so the value-axis props have to reach the
// numeric X axis — `yAxisDomain`/`yAxisTickCount` are routed there. Recharts
// silently ignores both on a category axis, so this baseline is what catches a
// regression back to the category axis.
export const HorizontalValueAxisDomain: Story = {
  args: {
    orientation: 'horizontal',
    config: latencyConfig,
    data: latencyData,
    dataKeys: ['p95'],
    yAxisDomain: 'dataMin-dataMax',
    yAxisTickCount: 3,
  },
};

// All chrome toggled off + squared corners — the baseline that would catch a
// toggle silently becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: {
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
      <RechartsBarChart data={data}>
        <CartesianGrid horizontal vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip defaultIndex={2} active content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} isAnimationActive={false} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} isAnimationActive={false} />
        <Bar dataKey="tablet" fill="var(--color-tablet)" radius={4} isAnimationActive={false} />
      </RechartsBarChart>
    </ChartContainer>
  ),
};

// A configured `ChartTooltipContent` (from this library, no recharts needed):
// `labelFormatter` adds an extra header field; `formatter` renders each row
// (swatch + config label + unit-suffixed value). Shared by the two stories below.
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
          {Number(value).toLocaleString()}k
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
      <RechartsBarChart data={data}>
        <CartesianGrid horizontal vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip defaultIndex={2} active content={customTooltipContent} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} isAnimationActive={false} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} isAnimationActive={false} />
        <Bar dataKey="tablet" fill="var(--color-tablet)" radius={4} isAnimationActive={false} />
      </RechartsBarChart>
    </ChartContainer>
  ),
};

// Compact the value axis with `yTickFormatter` — `146500 → "146.5K"`. A real
// value transform, which the plain `unit` suffix can't do (it can only append
// text).
const revenueData = [
  { month: 'Jan', revenue: 128600 },
  { month: 'Feb', revenue: 187400 },
  { month: 'Mar', revenue: 146500 },
  { month: 'Apr', revenue: 212300 },
  { month: 'May', revenue: 173900 },
  { month: 'Jun', revenue: 246800 },
];

const revenueConfig = {
  revenue: { label: 'Revenue', color: 'var(--ui-background-brand-secondary)' },
} satisfies ChartConfig;

export const CompactValueAxis: Story = {
  args: {
    config: revenueConfig,
    data: revenueData,
    dataKeys: ['revenue'],
    yTickFormatter: formatCompactNumber,
  },
};

// Hide both axes with `showXAxis` / `showYAxis` — the compact/sparkline layout.
// Carries a baseline so a regression in either toggle is caught visually; the
// unit tests can't assert it (recharts needs a laid-out container).
export const HiddenAxes: Story = {
  args: { showXAxis: false, showYAxis: false },
};

// A rotated tick row *and* an axis title at once — the X axis has to reserve room
// for both, which the earlier label-or-angle height ternary under-allocated.
export const RotatedTicksWithAxisTitle: Story = {
  args: {
    config: latencyConfig,
    data: latencyData,
    dataKeys: ['p95'],
    xAxisAngle: -45,
    xAxisLabel: 'Month',
    yAxisLabel: 'Response time',
    yUnit: 'ms',
  },
};

// Entrance animation on — a live example. Excluded from VR (snapshot.skip):
// the motion is non-deterministic, so it must not become a baseline.
export const Animated: Story = {
  parameters: { snapshot: { skip: true } },
  args: { animate: true, animationDuration: 800 },
};

// Labels on a *stacked* bar. Guards the layout-aware default: a stacked segment
// has no room at its growing end, so each value centres inside its own segment
// and switches to the on-fill label token.
export const StackedLabels: Story = {
  args: {
    layout: 'stacked',
    showLabels: true,
    labelFormatter: formatCompactNumber,
  },
};

// A longer series than the six-point default, so the brush has a range worth
// zooming into. Built from a formula rather than 24 literal rows — it stays
// deterministic, which the visual baseline requires.
const weeklyData = Array.from({ length: 24 }, (_, index) => ({
  month: `W${index + 1}`,
  desktop: 150 + ((index * 37) % 120),
  mobile: 90 + ((index * 23) % 80),
}));

// `showBrush` adds a range selector under the plot: drag a handle (or the
// selected window itself) to zoom the series into a slice of the data.
export const RangeBrush: Story = {
  args: {
    data: weeklyData,
    dataKeys: ['desktop', 'mobile'],
    showBrush: true,
  },
};

// The brush always reads left-to-right, but for horizontal bars the categories
// live on the Y axis — so its captions come from `yTickFormatter`, not `x`.
export const RangeBrushHorizontal: Story = {
  args: {
    data: weeklyData,
    dataKeys: ['desktop'],
    orientation: 'horizontal',
    showBrush: true,
  },
};
// The acceptance case for the styling knobs: the tail of the series reads as a
// projection — translucent, dashed, over its own ghost track — inside a shaded
// band whose category ticks pick up the accent styling.
export const ForecastRange: Story = {
  args: {
    dataKeys: ['desktop', 'mobile'],
    referenceArea: { from: 'Apr', label: 'Forecast', divider: true },
    barSettings: {
      desktop: { from: 'Apr', opacity: 0.35, dashed: true, background: true },
      mobile: { from: 'Apr', opacity: 0.35, dashed: true, background: true },
    },
  },
};

// The same override addressed by row index rather than category value, and
// bounded on both ends — the highlight sits in the middle of the series.
export const HighlightedRange: Story = {
  args: {
    dataKeys: ['desktop'],
    referenceArea: { from: 2, to: 3 },
    barSettings: { desktop: { from: 2, to: 3, fill: 'var(--ui-background-status-strong-warning)' } },
  },
};

// A band on a horizontal chart runs along the category axis (Y here), and the
// tick accent follows it.
export const HorizontalForecastRange: Story = {
  args: {
    orientation: 'horizontal',
    dataKeys: ['desktop'],
    referenceArea: { from: 'Apr', label: 'Forecast' },
    barSettings: { desktop: { from: 'Apr', opacity: 0.35, dashed: true } },
  },
};

// Bar shapes beyond the default rounded end.
export const PillBars: Story = {
  args: { dataKeys: ['desktop', 'mobile'], barShape: 'pill' },
};

export const GradientBars: Story = {
  args: { dataKeys: ['desktop', 'mobile'], barShape: 'gradient' },
};

export const PatternBars: Story = {
  args: { dataKeys: ['desktop', 'mobile'], barShape: 'pattern' },
};

// A pattern fill applied to one range only — hatching sets the projection apart
// without relying on color, which stays readable for colorblind viewers.
export const PatternRange: Story = {
  args: {
    dataKeys: ['desktop'],
    barSettings: { desktop: { from: 'Apr', shape: 'pattern' } },
  },
};

// The track behind every bar, plus the sizing knobs: a fixed thickness with a
// tighter gap between the bars of a category.
export const TrackBackgroundAndSizing: Story = {
  args: {
    dataKeys: ['desktop', 'mobile'],
    showBackground: true,
    barSize: 16,
    barGap: 2,
    barCategoryGap: '25%',
  },
};

// `minPointSize` keeps a near-zero value visible as a sliver rather than
// vanishing into the axis.
export const MinPointSize: Story = {
  args: {
    dataKeys: ['desktop'],
    data: [
      { month: 'Jan', desktop: 186 },
      { month: 'Feb', desktop: 0.4 },
      { month: 'Mar', desktop: 237 },
      { month: 'Apr', desktop: 0 },
    ],
    minPointSize: 4,
  },
};


// The Intelligence "churn vs new customers" widget, reproduced: six months of
// actuals, then a three-month projection that reads as provisional — translucent
// and dashed, each bar carrying the headroom up to its upper bound — inside a
// shaded band whose ticks pick up the accent styling.
const churnRows: Array<Record<string, string | number>> = [
  { month: 'Feb', new: 9, churned: 3.9 },
  { month: 'Mar', new: 8, churned: 2.9 },
  { month: 'Apr', new: 7, churned: 3.9 },
  { month: 'May', new: 9, churned: 4.9 },
  { month: 'Jun', new: 11, churned: 3.9 },
  { month: 'Jul', new: 12, churned: 2.9 },
  { month: 'Aug', new: 12.6, churned: 2.7, newMax: 14.6, churnedMax: 4.1 },
  { month: 'Sep', new: 13.3, churned: 2.4, newMax: 16, churnedMax: 4.4 },
  { month: 'Oct', new: 13.9, churned: 2.2, newMax: 17.2, churnedMax: 4.7 },
];

// The component synthesizes the headroom fields from `background: '<field>'`;
// the raw open-tooltip composition below has to plot them directly.
const churnData: Array<Record<string, string | number>> = churnRows.map(
  (row) => {
    const withHeadroom: Record<string, string | number> = { ...row };
    (
      [
        ['new', 'newMax'],
        ['churned', 'churnedMax'],
      ] as const
    ).forEach(([key, upperKey]) => {
      const value = row[key];
      const upper = row[upperKey];
      if (typeof value === 'number' && typeof upper === 'number') {
        withHeadroom[`__headroom_${key}`] = upper - value;
      }
    });
    return withHeadroom;
  }
);

const churnConfig = {
  new: { label: 'New', color: 'var(--ui-background-status-strong-success)' },
  churned: { label: 'Churned', color: 'var(--ui-background-status-strong-danger)' },
} satisfies ChartConfig;

// The forecast months read as estimates in the tooltip too: the header says so
// and each value carries a tilde. Shared by the example and its open-tooltip
// baseline below. The locale is pinned so the baseline can't drift with the
// renderer's default.
const FORECAST_FROM = 'Aug';
const isForecast = (month: string) =>
  churnRows.findIndex((row) => row.month === month) >=
  churnRows.findIndex((row) => row.month === FORECAST_FROM);

const churnLabelFormatter = (label: unknown) =>
  isForecast(String(label)) ? `${label} · forecast` : String(label);

// Loose parameter types so the same function satisfies both the library's
// `formatter` signature and recharts' own.
const churnValueFormatter = (
  value: unknown,
  name: unknown,
  item: { color?: string; payload?: Record<string, unknown> }
) => (
  <div className="flex w-full items-center gap-2">
    <span
      className="size-2.5 shrink-0 rounded-[2px]"
      style={{ backgroundColor: item.color }}
    />
    <span className="text-muted-foreground">
      {churnConfig[name as keyof typeof churnConfig]?.label ?? String(name)}
    </span>
    <span className="ms-auto font-medium tabular-nums">
      {isForecast(String(item.payload?.month)) ? '~' : ''}
      {Number(value).toLocaleString('en-US')}
    </span>
  </div>
);

const churnTooltipContent = (
  <ChartTooltipContent
    labelFormatter={churnLabelFormatter}
    formatter={churnValueFormatter}
  />
);

export const ChurnVsNewCustomers: Story = {
  args: {
    config: churnConfig,
    data: churnData,
    dataKeys: ['new', 'churned'],
    xKey: 'month',
    barSize: 14,
    barGap: 2,
    yAxisDomain: 'zero',
    yAxisTickCount: 5,
    referenceArea: { from: 'Aug', divider: true },
    tooltipContent: churnTooltipContent,
    barSettings: {
      new: { from: 'Aug', opacity: 0.35, dashed: true, background: 'newMax' },
      churned: { from: 'Aug', opacity: 0.35, dashed: true, background: 'churnedMax' },
    },
    className: 'h-[320px] w-[640px]',
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <span className="text-sm uppercase tracking-wide text-muted-foreground">
          Churn vs new customers
        </span>
        <span className="text-sm text-muted-foreground">Per month</span>
      </div>
      <BarChart {...args} />
    </div>
  ),
};

// The example's tooltip, on a forecast month. Like the other open-tooltip
// stories this renders the raw composition, since recharts only opens a tooltip
// statically through its own `defaultIndex`.
export const ChurnVsNewCustomersTooltipOpen: Story = {
  render: () => (
    <ChartContainer config={churnConfig} className="h-[320px] w-[640px]">
      <RechartsBarChart data={churnData} barSize={14} barGap={2}>
        <CartesianGrid horizontal vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip
          defaultIndex={6}
          active
          content={(props) => (
            <ChartTooltipContent
              {...props}
              payload={dropHeadroomSeries(props.payload) as never}
              labelFormatter={churnLabelFormatter}
              formatter={churnValueFormatter}
            />
          )}
        />
        {(['new', 'churned'] as const).map((key) => (
          <React.Fragment key={key}>
            <Bar dataKey={key} stackId={key} fill={`var(--color-${key})`} isAnimationActive={false}>
              {churnData.map((row) => (
                <Cell
                  key={String(row.month)}
                  fillOpacity={isForecast(String(row.month)) ? 0.35 : 1}
                  stroke={isForecast(String(row.month)) ? `var(--color-${key})` : undefined}
                  strokeDasharray={isForecast(String(row.month)) ? '4 3' : undefined}
                  radius={isForecast(String(row.month)) ? undefined : 4}
                />
              ))}
            </Bar>
            <Bar
              dataKey={`__headroom_${key}`}
              stackId={key}
              fill={`var(--color-${key})`}
              fillOpacity={0.25}
              radius={4}
              legendType="none"
              tooltipType="none"
              isAnimationActive={false}
            />
          </React.Fragment>
        ))}
      </RechartsBarChart>
    </ChartContainer>
  ),
};
