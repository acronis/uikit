import type { Meta, StoryObj } from '@storybook/react-vite';

import { TruncateText } from '../truncate-text';

const meta = {
  title: 'UI/TruncateText',
  component: TruncateText,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof TruncateText>;

export default meta;
type Story = StoryObj<typeof meta>;

const SHORT = 'Acme Corp';
const LONG = 'Acme Corporation International Holdings & Subsidiaries — Global Compliance Division';

/** Short text that fits — no tooltip, no ellipsis. */
export const Fits: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <TruncateText>{SHORT}</TruncateText>
    </div>
  ),
};

/** End-truncation: the familiar CSS ellipsis at the right. */
export const EndTruncated: Story = {
  render: () => (
    <div style={{ width: 200 }}>
      <TruncateText defaultOpen>{LONG}</TruncateText>
    </div>
  ),
};

/** Multi-line clamp: wraps up to 2 lines, then clips. */
export const MultilineClamped: Story = {
  render: () => (
    <div style={{ width: 200 }}>
      <TruncateText lines={2}>{LONG}</TruncateText>
    </div>
  ),
};

/** Middle-truncation: preserves start and end — useful for paths and URLs. */
export const MiddleTruncated: Story = {
  render: () => (
    <div style={{ width: 200 }}>
      <TruncateText mode="middle">{LONG}</TruncateText>
    </div>
  ),
};
