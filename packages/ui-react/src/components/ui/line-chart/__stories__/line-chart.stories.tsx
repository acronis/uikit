import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
} from 'recharts';

import { LineChart } from '../line-chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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
  title: 'UI/LineChart',
  component: LineChart,
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
    strokeWidth: 2,
    showDots: true,
    connectNulls: false,
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    className: 'h-[320px] w-[560px]',
  },
  argTypes: {
    curve: {
      control: 'inline-radio',
      options: ['linear', 'monotone', 'step'],
    },
    lineStyle: { control: 'inline-radio', options: ['solid', 'dashed'] },
    strokeWidth: { control: { type: 'number', min: 1, max: 6 } },
    showDots: { control: 'boolean' },
    connectNulls: { control: 'boolean' },
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// A single series.
export const SingleLine: Story = {
  args: { dataKeys: ['desktop'] },
};

// Several series on the same axes (default monotone curve).
export const MultiLine: Story = {
  args: { dataKeys: ['desktop', 'mobile', 'tablet'] },
};

// Straight segments between points.
export const Linear: Story = {
  args: { curve: 'linear' },
};

// Stepped interpolation.
export const Stepped: Story = {
  args: { curve: 'step' },
};

// Dashed stroke.
export const Dashed: Story = {
  args: { lineStyle: 'dashed' },
};

// All chrome toggled off + dots off — the baseline that would catch a toggle
// silently becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: {
    showGrid: false,
    showTooltip: false,
    showLegend: false,
    showDots: false,
  },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition so recharts' `defaultIndex` can open the tooltip
// statically for the visual-regression baseline (see the skill's VR note).
export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[320px] w-[560px]">
      <RechartsLineChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip defaultIndex={2} active content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={{ r: 3 }}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="mobile"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={{ r: 3 }}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="tablet"
          stroke="var(--color-tablet)"
          strokeWidth={2}
          dot={{ r: 3 }}
          isAnimationActive={false}
        />
      </RechartsLineChart>
    </ChartContainer>
  ),
};
