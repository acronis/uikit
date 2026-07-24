import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Area,
  CartesianGrid,
  ComposedChart,
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
  type ChartTooltipContentProps,
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
    xAxisLabel: { control: 'text' },
    yAxisLabel: { control: 'text' },
    yUnit: { control: 'text' },
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    comparisonKeys: {
      control: 'object',
      description:
        'Subset of `dataKeys` drawn as dashed, dimmed comparison overlays (e.g. `["lastYear"]`).',
    },
    deltaBands: {
      control: 'object',
      description:
        'Pairs `[current, comparison]` to shade the gap between (e.g. `[["thisYear","lastYear"]]`).',
    },
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

// QoQ / YoY comparison: the previous-period series is marked via
// `comparisonKeys`, so it renders dashed + dimmed behind the current one.
const trendData = [
  { month: 'Jan', thisYear: 186, lastYear: 120 },
  { month: 'Feb', thisYear: 305, lastYear: 210 },
  { month: 'Mar', thisYear: 237, lastYear: 250 },
  { month: 'Apr', thisYear: 273, lastYear: 190 },
  { month: 'May', thisYear: 309, lastYear: 230 },
  { month: 'Jun', thisYear: 314, lastYear: 280 },
];

const trendConfig = {
  thisYear: { label: 'This year', color: 'var(--ui-background-brand-secondary)' },
  lastYear: {
    label: 'Last year',
    color: 'var(--ui-background-status-strong-danger)',
  },
} satisfies ChartConfig;

export const ComparisonTrend: Story = {
  args: {
    data: trendData,
    config: trendConfig,
    dataKeys: ['thisYear', 'lastYear'],
    comparisonKeys: ['lastYear'],
  },
};

// The same comparison with a shaded delta band filling the gap between the two
// series (the QoQ/YoY difference).
export const ComparisonWithDeltaBand: Story = {
  args: {
    data: trendData,
    config: trendConfig,
    dataKeys: ['thisYear', 'lastYear'],
    comparisonKeys: ['lastYear'],
    deltaBands: [['thisYear', 'lastYear']],
  },
};

// Axis titles + a Y-axis unit suffix, forwarded to recharts' native
// `label` / `unit`. The title inherits the theme token via the container's
// `.recharts-label` fill selector.
export const AxisLabels: Story = {
  args: {
    xAxisLabel: 'Month',
    yAxisLabel: 'Sessions',
    yUnit: 'k',
  },
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
          {trendConfig[name as keyof typeof trendConfig]?.label ??
            config[name as keyof typeof config]?.label ??
            name}
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

// The same custom tooltip, forced open for the VR baseline — built on the
// delta-band composition so the baseline proves the synthetic `__band_*` range
// series is filtered out: the tooltip shows only the real thisYear/lastYear
// rows, never a stray `__band_0` row.
export const CustomTooltipOpen: Story = {
  render: () => {
    const bandData = trendData.map((d) => ({
      ...d,
      __band_0: [
        Math.min(d.thisYear, d.lastYear),
        Math.max(d.thisYear, d.lastYear),
      ],
    }));
    return (
      <ChartContainer config={trendConfig} className="h-[320px] w-[560px]">
        <ComposedChart data={bandData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            defaultIndex={2}
            active
            content={(tp) =>
              React.cloneElement(customTooltipContent, {
                ...tp,
                payload: tp.payload?.filter(
                  (item) => !String(item.dataKey).startsWith('__band_')
                ),
              } as ChartTooltipContentProps)
            }
          />
          <Area
            dataKey="__band_0"
            type="monotone"
            stroke="none"
            fill="var(--color-thisYear)"
            fillOpacity={0.12}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="thisYear"
            stroke="var(--color-thisYear)"
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="lastYear"
            stroke="var(--color-lastYear)"
            strokeWidth={2}
            strokeDasharray="5 5"
            strokeOpacity={0.5}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ChartContainer>
    );
  },
};
