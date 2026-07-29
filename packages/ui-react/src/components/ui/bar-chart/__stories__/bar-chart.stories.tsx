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
  title: 'UI/BarChart',
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
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

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

// Axis titles + a Y-axis unit suffix, forwarded to recharts' native
// `label` / `unit`. The title inherits the theme token via the container's
// `.recharts-label` fill selector.
export const AxisLabels: Story = {
  args: {
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
    dataKeys: ['desktop'],
    xAxisLabel: 'Response time',
    yAxisLabel: 'Month',
    xUnit: 'ms',
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
