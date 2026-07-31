import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis } from 'recharts';

import { BarChart } from '../bar-chart';
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
