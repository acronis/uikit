import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
} from 'recharts';

import { Histogram, computeHistogramBins } from '../histogram';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../../chart';

// A roughly bell-shaped sample (e.g. response times, scores). The single series
// color is caller-supplied via `config`; there is no chart token tier yet, so it
// references a shared semantic token (design-pending v1).
const values = [
  12, 15, 15, 18, 19, 20, 21, 22, 22, 23, 23, 24, 24, 25, 25, 25, 26, 26, 27, 27,
  28, 28, 29, 30, 30, 31, 32, 33, 34, 35, 36, 38, 40, 42, 45, 48, 52, 58, 64, 72,
];

const config = {
  count: {
    label: 'Frequency',
    color: 'var(--ui-background-brand-secondary)',
  },
} satisfies ChartConfig;

const meta = {
  title: 'UI/Histogram',
  component: Histogram,
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
    values,
    dataKey: 'count',
    binCount: 10,
    barRadius: 0,
    showGrid: true,
    showTooltip: true,
    className: 'h-[320px] w-[560px]',
  },
  argTypes: {
    binCount: { control: { type: 'number', min: 1, max: 30 } },
    barRadius: { control: { type: 'number', min: 0, max: 12 } },
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    domain: { control: 'object' },
  },
} satisfies Meta<typeof Histogram>;

export default meta;
type Story = StoryObj<typeof meta>;

// The distribution binned into 10 equal-width ranges.
export const Default: Story = {};

// Coarser bins.
export const FewBins: Story = {
  args: { binCount: 5 },
};

// Finer bins.
export const ManyBins: Story = {
  args: { binCount: 20 },
};

// Chrome toggled off — the baseline that would catch a toggle silently becoming
// a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: { showGrid: false, showTooltip: false },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition so recharts' `defaultIndex` can open the tooltip
// statically for the visual-regression baseline (see the skill's VR note).
export const TooltipOpen: Story = {
  render: () => {
    const data = computeHistogramBins(values, 10).map((bin) => ({
      label: bin.label,
      count: bin.count,
    }));
    return (
      <ChartContainer config={config} className="h-[320px] w-[560px]">
        <RechartsBarChart data={data} barCategoryGap={0}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <ChartTooltip defaultIndex={3} active content={<ChartTooltipContent />} />
          <Bar
            dataKey="count"
            fill="var(--color-count)"
            stroke="var(--ui-background-surface-primary)"
            strokeWidth={1}
            isAnimationActive={false}
          />
        </RechartsBarChart>
      </ChartContainer>
    );
  },
};
