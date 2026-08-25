import type { Meta, StoryObj } from '@storybook/react-vite';

import { TrendIndicator } from '../trend-indicator';

const meta = {
  title: 'Widgets/TrendIndicator',
  component: TrendIndicator,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    direction: 'up',
    sentiment: 'positive',
    value: '12%',
    showIcon: true,
  },
  argTypes: {
    direction: { control: 'inline-radio', options: ['up', 'down', 'flat'] },
    sentiment: {
      control: 'inline-radio',
      options: ['positive', 'negative', 'neutral'],
    },
    showIcon: { control: 'boolean' },
    value: { control: 'text' },
    tooltip: { control: 'text' },
    ariaLabel: { control: 'text' },
  },
} satisfies Meta<typeof TrendIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Direction is not sentiment: the same arrow can be good or bad depending on the
// metric. The consumer decides `sentiment`; the kit never assumes up = good.
export const DirectionVsSentiment: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <TrendIndicator direction="up" sentiment="positive" value="8%" />
      <TrendIndicator direction="up" sentiment="negative" value="35%" />
      <TrendIndicator direction="down" sentiment="positive" value="1.4 h" />
      <TrendIndicator direction="down" sentiment="negative" value="6 pts" />
      <TrendIndicator direction="flat" sentiment="neutral" value="Stable" />
    </div>
  ),
};

// Qualitative (non-numeric) change.
export const Qualitative: Story = {
  args: { direction: 'up', sentiment: 'positive', value: 'Improving' },
};

// No glyph (rarely needed — the icon reinforces meaning beyond color).
export const NoIcon: Story = {
  args: { showIcon: false },
};
