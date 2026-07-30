import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartPieIcon } from '@acronis-platform/icons-react/stroke-mono';
import { AcronisAiMultiIcon } from '@acronis-platform/icons-react/solid-multi';

import { Metric } from '../metric';
import { TrendIndicator } from '../../trend-indicator';
import { Tag } from '../../tag';
import { Separator } from '../../separator';
import { Meter } from '../../meter';

const meta = {
  title: 'Widgets/Metric',
  component: Metric,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Gross margin',
    value: '73',
    unit: '%',
    size: 'medium',
    status: 'neutral',
    loading: false,
    className: 'w-[320px]',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    status: {
      control: 'inline-radio',
      options: ['neutral', 'info', 'success', 'warning', 'danger', 'critical'],
    },
    loading: { control: 'boolean' },
    label: { control: 'text' },
    value: { control: 'text' },
    unit: { control: 'text' },
    supportingText: { control: 'text' },
    tooltip: { control: 'text' },
  },
} satisfies Meta<typeof Metric>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// The Figma MetricCard header: a caption top-right and a trend on the right of
// the value, with a status-tinted icon badge.
export const WithCaptionAndTrend: Story = {
  args: {
    status: 'critical',
    icon: <ChartPieIcon />,
    caption: (
      <Tag variant="neutral" size="sm">
        Last 30 days
      </Tag>
    ),
    trend: (
      <TrendIndicator
        direction="down"
        sentiment="negative"
        value="5%"
        comparisonLabel="vs prev 30d"
        size="small"
      />
    ),
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Metric className="w-[260px]" label="Coverage" value="94" unit="%" size="small" icon={<ChartPieIcon />} />
      <Metric className="w-[260px]" label="Coverage" value="94" unit="%" size="medium" icon={<ChartPieIcon />} />
      <Metric className="w-[260px]" label="Coverage" value="94" unit="%" size="large" icon={<ChartPieIcon />} />
    </div>
  ),
};

// Status tints the icon badge — a subtle cue, never a full color fill. The six
// statuses map to the semantic status token families (icon = text-on-status,
// badge = status-*-pressed), matching the design's status chips.
export const Statuses: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Metric className="w-[240px]" label="Info" value="12" status="info" icon={<ChartPieIcon />} />
      <Metric className="w-[240px]" label="Danger" value="3" status="danger" icon={<ChartPieIcon />} />
      <Metric className="w-[240px]" label="Critical" value="7" status="critical" icon={<ChartPieIcon />} />
      <Metric className="w-[240px]" label="Success" value="94" unit="%" status="success" icon={<ChartPieIcon />} />
      <Metric className="w-[240px]" label="Warning" value="95" unit="%" status="warning" icon={<ChartPieIcon />} />
      <Metric className="w-[240px]" label="Neutral" value="128" status="neutral" icon={<ChartPieIcon />} />
    </div>
  ),
};

export const WithSupportingText: Story = {
  args: {
    label: 'SLA compliance',
    value: '95',
    unit: '%',
    status: 'warning',
    icon: <ChartPieIcon />,
    supportingText: 'Target: 99%',
    trend: (
      <TrendIndicator direction="up" sentiment="positive" value="2.5%" size="small" />
    ),
  },
};

// No data is not zero — show an em dash.
export const NoData: Story = {
  args: {
    label: 'Health score',
    value: '—',
    unit: undefined,
    supportingText: 'Not enough historical data',
  },
};

// Loading preserves the value's space with a skeleton.
export const Loading: Story = {
  args: { loading: true, icon: <ChartPieIcon /> },
};

// An info affordance next to the label reveals the tooltip.
export const WithTooltip: Story = {
  args: {
    label: 'ARR',
    value: '$72K',
    unit: undefined,
    tooltip: 'Annual recurring revenue projected for the next 12 months.',
    tooltipLabel: 'About ARR',
  },
};

// A real dashboard tile composed from our primitives: Metric owns the data
// header (caption + icon badge + value + a composed TrendIndicator); the body
// (children) is a full-width Meter breakdown, a Separator, and an AI-insight
// footer. A Meter is a proportional bar with no axis gutter, so it spans the
// card edge-to-edge inside the padding.
export const InDashboardCard: Story = {
  render: () => (
    <Metric
      className="w-[314px]"
      label="At-risk customers"
      status="critical"
      icon={<ChartPieIcon />}
      caption={
        <Tag variant="neutral" size="sm">
          Now
        </Tag>
      }
      value="3"
      trend={
        <TrendIndicator
          direction="up"
          sentiment="negative"
          value="1 this week"
          size="small"
        />
      }
    >
      <div className="mt-3 flex flex-col gap-2.5">
        <Meter
          label="Healthy"
          value={46}
          max={54}
          color="var(--ui-background-status-strong-success)"
          showTooltip={false}
        />
        <Meter
          label="Unhealthy"
          value={5}
          max={54}
          color="var(--ui-background-status-strong-warning)"
          showTooltip={false}
        />
        <Meter
          label="At risk"
          value={3}
          max={54}
          color="var(--ui-background-status-strong-critical)"
          showTooltip={false}
        />
      </div>
      <Separator className="my-3" />
      <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
        <AcronisAiMultiIcon size={16} aria-hidden className="mt-0.5 shrink-0" />
        +3 customers predicted at-risk within 30 days — act before renewal.
      </p>
    </Metric>
  ),
};
