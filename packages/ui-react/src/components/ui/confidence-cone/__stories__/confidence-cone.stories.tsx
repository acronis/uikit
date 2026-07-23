import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from 'recharts';

import { ConfidenceCone } from '../confidence-cone';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
  type ChartTooltipContentProps,
} from '../../chart';

// Actual values run to the hand-off point (Jun, where actual = forecast and the
// cone starts at a point), then the forecast projects with a widening band.
// Series colors are caller-supplied via `config` (no chart token tier yet).
const data = [
  { month: 'Jan', actual: 100 },
  { month: 'Feb', actual: 118 },
  { month: 'Mar', actual: 112 },
  { month: 'Apr', actual: 130 },
  { month: 'May', actual: 141 },
  { month: 'Jun', actual: 150, forecast: 150, lower: 150, upper: 150 },
  { month: 'Jul', forecast: 162, lower: 150, upper: 176 },
  { month: 'Aug', forecast: 173, lower: 154, upper: 196 },
  { month: 'Sep', forecast: 185, lower: 158, upper: 218 },
  { month: 'Oct', forecast: 198, lower: 160, upper: 240 },
];

const config = {
  actual: { label: 'Actual', color: 'var(--ui-background-brand-secondary)' },
  forecast: {
    label: 'Forecast',
    color: 'var(--ui-background-brand-secondary)',
  },
} satisfies ChartConfig;

const meta = {
  title: 'UI/ConfidenceCone',
  component: ConfidenceCone,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // The ChartContainer is transparent by design (it inherits the surface it sits
  // on — usually a Card). Render the stories on a themed surface so the chart is
  // legible in both light and dark.
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
    xKey: 'month',
    actualKey: 'actual',
    forecastKey: 'forecast',
    lowerKey: 'lower',
    upperKey: 'upper',
    strokeWidth: 2,
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    className: 'h-[320px] w-[560px]',
  },
  argTypes: {
    strokeWidth: { control: { type: 'number', min: 1, max: 6 } },
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
} satisfies Meta<typeof ConfidenceCone>;

export default meta;
type Story = StoryObj<typeof meta>;

// Actual (solid) + forecast (dashed) + the widening prediction cone.
export const Default: Story = {};

// Chrome toggled off — the baseline that would catch a toggle silently becoming
// a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: { showGrid: false, showTooltip: false, showLegend: false },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition (with the same band filtered out of the tooltip) so
// recharts' `defaultIndex` can open it statically for the VR baseline.
export const TooltipOpen: Story = {
  render: () => {
    const coneData = data.map((d) => ({
      ...d,
      __cone:
        typeof d.lower === 'number' && typeof d.upper === 'number'
          ? [d.lower, d.upper]
          : undefined,
    }));
    return (
      <ChartContainer config={config} className="h-[320px] w-[560px]">
        <ComposedChart data={coneData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            defaultIndex={7}
            active
            content={(tp) => (
              <ChartTooltipContent
                active={tp.active}
                label={tp.label}
                payload={
                  tp.payload?.filter(
                    (item) => item.dataKey !== '__cone'
                  ) as ChartTooltipContentProps['payload']
                }
              />
            )}
          />
          <Area
            dataKey="__cone"
            type="monotone"
            stroke="none"
            fill="var(--color-forecast)"
            fillOpacity={0.15}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          <Area
            dataKey="actual"
            type="monotone"
            stroke="var(--color-actual)"
            strokeWidth={2}
            fill="var(--color-actual)"
            fillOpacity={0.15}
            dot={false}
            activeDot={false}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            dataKey="forecast"
            type="monotone"
            stroke="var(--color-forecast)"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
        </ComposedChart>
      </ChartContainer>
    );
  },
};
