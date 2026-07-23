import type { Meta, StoryObj } from '@storybook/react-vite';

import { Meter } from '../meter';

const meta = {
  title: 'UI/Meter',
  component: Meter,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // A meter is full-width; give it a fixed width on a themed surface so both the
  // light and dark baselines are legible.
  decorators: [
    (Story) => (
      <div className="w-[360px] rounded-lg border border-border bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Critical',
    value: 6,
    max: 29,
    color: 'var(--ui-background-status-strong-danger)',
    showTooltip: true,
  },
  argTypes: {
    value: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
    color: { control: 'color' },
    showTooltip: { control: 'boolean' },
  },
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

// A single meter: label + value · share, over a proportional bar.
export const Default: Story = {};

// The tooltip is hover-only, so a normal story never snapshots it. `defaultOpen`
// renders it open so the chart-style tooltip card is covered by the VR baseline.
export const TooltipOpen: Story = {
  args: { defaultOpen: true },
};

// Custom tooltip content via the `tooltip` prop (replaces the default inside the
// same card). Hover to see it.
export const CustomTooltip: Story = {
  args: {
    tooltip: (
      <div>
        <div className="font-semibold">Critical severity</div>
        <div className="text-muted-foreground">6 open findings — review recommended</div>
      </div>
    ),
  },
};

// Stacked into a ranked breakdown (a "bar list") — the consumer sorts the rows
// and shares one `max` (the total) so the shares are comparable.
const severities = [
  { label: 'Critical', value: 6, color: 'var(--ui-background-status-strong-danger)' },
  { label: 'High', value: 9, color: 'var(--ui-background-status-strong-warning)' },
  { label: 'Medium', value: 8, color: 'var(--ui-background-status-strong-info)' },
  { label: 'Low', value: 6, color: 'var(--ui-background-status-strong-success)' },
];
const total = severities.reduce((sum, s) => sum + s.value, 0);

export const RankedBreakdown: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      {[...severities]
        .sort((a, b) => b.value - a.value)
        .map((s) => (
          <Meter key={s.label} label={s.label} value={s.value} max={total} color={s.color} />
        ))}
    </div>
  ),
};
