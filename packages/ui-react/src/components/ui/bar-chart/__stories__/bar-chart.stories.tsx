import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis } from 'recharts';

import { BarChart } from '../bar-chart';
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
