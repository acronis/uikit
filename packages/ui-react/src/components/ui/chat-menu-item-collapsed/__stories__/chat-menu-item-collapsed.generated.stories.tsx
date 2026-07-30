// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { MessageTextIcon } from '@acronis-platform/icons-react/stroke-mono';
import { ChatMenuItemCollapsed } from '../chat-menu-item-collapsed';

const meta = {
  title: 'UI/ChatMenuItemCollapsed/All States (generated)',
  component: ChatMenuItemCollapsed,
} satisfies Meta<typeof ChatMenuItemCollapsed>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['idle'] as const;

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
      }}
    >
      {VARIANTS.map((v) => (
        <ChatMenuItemCollapsed
          aria-label="Chats"
          icon={<MessageTextIcon />}
          key={v}
          variant={v}
        />
      ))}
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => (
    <ChatMenuItemCollapsed aria-label="Chats" icon={<MessageTextIcon />} />
  ),
};

export const Active: Story = {
  parameters: { pseudo: { active: true } },
  render: () => (
    <ChatMenuItemCollapsed aria-label="Chats" icon={<MessageTextIcon />} />
  ),
};

export const FocusVisible: Story = {
  render: () => (
    <ChatMenuItemCollapsed aria-label="Chats" icon={<MessageTextIcon />} />
  ),
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
