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
  title: 'UI/ComposedChart',
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
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
} satisfies Meta<typeof ComposedChart>;

export default meta;
type Story = StoryObj<typeof meta>;

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
