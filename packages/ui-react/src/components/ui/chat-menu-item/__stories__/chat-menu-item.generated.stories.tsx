// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { MessageTextIcon } from '@acronis-platform/icons-react/stroke-mono';
import { ChatMenuItem } from '../chat-menu-item';

const meta = {
  title: 'UI/ChatMenuItem/All States (generated)',
  component: ChatMenuItem,
  args: { label: 'Menu item' },
} satisfies Meta<typeof ChatMenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <ChatMenuItem icon={<MessageTextIcon />} label="Menu item" />
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <ChatMenuItem icon={<MessageTextIcon />} label="Menu item" />,
};

export const FocusVisible: Story = {
  render: () => <ChatMenuItem icon={<MessageTextIcon />} label="Menu item" />,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
