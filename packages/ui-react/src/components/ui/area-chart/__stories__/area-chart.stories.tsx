import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
} from 'recharts';

import { AreaChart } from '../area-chart';
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
  { month: 'Apr', desktop: 173, mobile: 190, tablet: 30 },
  { month: 'May', desktop: 209, mobile: 130, tablet: 70 },
  { month: 'Jun', desktop: 214, mobile: 140, tablet: 80 },
];

const config = {
  desktop: { label: 'Desktop', color: 'var(--ui-background-brand-secondary)' },
  mobile: { label: 'Mobile', color: 'var(--ui-background-status-strong-danger)' },
  tablet: {
    label: 'Tablet',
    color: 'var(--ui-background-status-strong-success)',
  },
} satisfies ChartConfig;

const meta = {
  title: 'UI/AreaChart',
  component: AreaChart,
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
    curve: 'monotone',
    strokeWidth: 2,
    fillOpacity: 0.4,
    showDots: false,
    connectNulls: false,
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    className: 'h-[320px] w-[560px]',
  },
  argTypes: {
    layout: { control: 'inline-radio', options: ['single', 'stacked'] },
    fill: { control: 'inline-radio', options: ['solid', 'gradient'] },
    curve: {
      control: 'inline-radio',
      options: ['linear', 'monotone', 'step'],
    },
    strokeWidth: { control: { type: 'number', min: 0, max: 6 } },
    fillOpacity: { control: { type: 'number', min: 0, max: 1, step: 0.1 } },
    showDots: { control: 'boolean' },
    connectNulls: { control: 'boolean' },
    xAxisLabel: { control: 'text' },
    yAxisLabel: { control: 'text' },
    yUnit: { control: 'text' },
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
} satisfies Meta<typeof AreaChart>;

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

// Overlapping areas with the default gradient fill.
export const Single: Story = {
  args: { layout: 'single', fill: 'gradient' },
};

// Areas summed on a shared stack.
export const Stacked: Story = {
  args: { layout: 'stacked', fill: 'gradient' },
};

// Flat translucent fill instead of a gradient.
export const SolidFill: Story = {
  args: { fill: 'solid' },
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

// All chrome toggled off + a solid flat fill — the baseline that would catch a
// toggle silently becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: {
    showGrid: false,
    showTooltip: false,
    showLegend: false,
    showDots: false,
    fill: 'solid',
  },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition so recharts' `defaultIndex` can open the tooltip
// statically for the visual-regression baseline (see the skill's VR note).
export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[320px] w-[560px]">
      <RechartsAreaChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip defaultIndex={2} active content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="mobile"
          stroke="var(--color-mobile)"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="tablet"
          stroke="var(--color-tablet)"
          fill="var(--color-tablet)"
          fillOpacity={0.4}
          isAnimationActive={false}
        />
      </RechartsAreaChart>
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
      <RechartsAreaChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip defaultIndex={2} active content={customTooltipContent} />
        <Area
          type="monotone"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="mobile"
          stroke="var(--color-mobile)"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="tablet"
          stroke="var(--color-tablet)"
          fill="var(--color-tablet)"
          fillOpacity={0.4}
          isAnimationActive={false}
        />
      </RechartsAreaChart>
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
