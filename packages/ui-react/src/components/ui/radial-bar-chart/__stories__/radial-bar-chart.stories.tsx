import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Cell,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
} from 'recharts';

import { RadialBarChart } from '../radial-bar-chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../../chart';

// Arc colors are supplied by the caller via `config`, keyed by each arc's nameKey
// value. There is no chart token tier yet, so these reference the shared semantic
// brand/status tokens (a dedicated data-viz palette is pending an upstream design
// pass). The status tokens are chromatic in every brand; `brand-secondary` is
// brand-dependent.
const data = [
  { browser: 'Chrome', value: 65 },
  { browser: 'Safari', value: 50 },
  { browser: 'Firefox', value: 35 },
  { browser: 'Edge', value: 25 },
];

const config = {
  Chrome: { label: 'Chrome', color: 'var(--ui-background-brand-secondary)' },
  Safari: { label: 'Safari', color: 'var(--ui-background-status-strong-danger)' },
  Firefox: {
    label: 'Firefox',
    color: 'var(--ui-background-status-strong-success)',
  },
  Edge: { label: 'Edge', color: 'var(--ui-background-status-strong-warning)' },
} satisfies ChartConfig;

const meta = {
  title: 'UI/RadialBarChart',
  component: RadialBarChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // The ChartContainer is transparent by design (it inherits the surface it sits
  // on — usually a Card). Render the stories on a themed surface so the chart is
  // legible in both light and dark; without it, dark mode flips the token-driven
  // arcs/track but leaves the backdrop unthemed.
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
    dataKey: 'value',
    nameKey: 'browser',
    innerRadius: 30,
    outerRadius: 110,
    startAngle: 90,
    endAngle: -270,
    cornerRadius: 4,
    showBackground: true,
    showTooltip: true,
    showLegend: true,
    className: 'h-[360px] w-[360px]',
  },
  argTypes: {
    innerRadius: { control: { type: 'number', min: 0, max: 120 } },
    outerRadius: { control: { type: 'number', min: 40, max: 160 } },
    startAngle: { control: { type: 'number', min: -360, max: 360 } },
    endAngle: { control: { type: 'number', min: -360, max: 360 } },
    cornerRadius: { control: { type: 'number', min: 0, max: 20 } },
    showBackground: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
} satisfies Meta<typeof RadialBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Concentric arcs sweeping a full circle (default).
export const FullCircle: Story = {};

// A half-circle gauge (startAngle 180 → endAngle 0).
export const Gauge: Story = {
  args: { startAngle: 180, endAngle: 0, innerRadius: 40, outerRadius: 130 },
};

// Background track + tooltip + legend toggled off — the baseline that would catch
// a toggle silently becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: { showBackground: false, showTooltip: false, showLegend: false },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition so recharts' `defaultIndex` can open the tooltip
// statically for the visual-regression baseline (see the skill's VR note).
export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[360px] w-[360px]">
      <RechartsRadialBarChart
        data={data.map((d) => ({ ...d, fill: `var(--color-${d.browser})` }))}
        dataKey="value"
        innerRadius={30}
        outerRadius={110}
        startAngle={90}
        endAngle={-270}
      >
        <ChartTooltip
          defaultIndex={0}
          active
          content={<ChartTooltipContent nameKey="browser" hideLabel />}
        />
        <RadialBar dataKey="value" background cornerRadius={4} isAnimationActive={false}>
          {data.map((entry) => (
            <Cell key={entry.browser} fill={`var(--color-${entry.browser})`} />
          ))}
        </RadialBar>
      </RechartsRadialBarChart>
    </ChartContainer>
  ),
};
