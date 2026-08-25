import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartPieIcon } from '@acronis-platform/icons-react/stroke-mono';

import { Metric } from '../metric';
import { Tag } from '../../tag';

const meta = {
  title: 'Widgets/Metric',
  component: Metric,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    value: '125',
    unit: 'Label',
    loading: false,
    className: 'w-[320px]',
  },
  argTypes: {
    loading: { control: 'boolean' },
    value: { control: 'text' },
    unit: { control: 'text' },
    trendValue: { control: 'text' },
    supportingText: { control: 'text' },
    tooltip: { control: 'text' },
  },
} satisfies Meta<typeof Metric>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { icon: <ChartPieIcon /> },
};

// Stats row: icon badge + value + unit on the left, caption Tag on the right.
export const WithCaption: Story = {
  args: {
    icon: <ChartPieIcon />,
    caption: (
      <Tag variant="neutral" size="sm">
        Last 3 months
      </Tag>
    ),
  },
};

// Trend prop: renders a TrendIndicator automatically below the value.
// Sentiment follows direction: up=positive, down=negative, stable=neutral.
export const WithTrend: Story = {
  args: {
    icon: <ChartPieIcon />,
    trend: 'up',
    trendValue: '20%',
    supportingText: 'over 6 months',
  },
};

// Loading preserves the value's space with a skeleton.
export const Loading: Story = {
  args: { loading: true, icon: <ChartPieIcon /> },
};

// No data is not zero — show an em dash.
export const NoData: Story = {
  args: { value: '—', unit: undefined },
};

// An info affordance reveals the tooltip.
export const WithTooltip: Story = {
  args: {
    value: '$72K',
    unit: undefined,
    tooltip: 'Annual recurring revenue projected for the next 12 months.',
    tooltipLabel: 'About ARR',
  },
};

