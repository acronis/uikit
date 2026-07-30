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
    curve: { control: 'inline-radio', options: ['linear', 'monotone', 'step'] },
    barRadius: { control: { type: 'number', min: 0, max: 20 } },
    fillOpacity: { control: { type: 'number', min: 0, max: 1, step: 0.1 } },
    xAxisLabel: { control: 'text' },
    yAxisLabel: { control: 'text' },
    yUnit: { control: 'text' },
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
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
