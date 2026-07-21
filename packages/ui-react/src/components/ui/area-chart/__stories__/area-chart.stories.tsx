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
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

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
