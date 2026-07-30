// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { AppShellChat } from '../app-shell-chat';

const meta = {
  title: 'UI/AppShellChat/All States (generated)',
  component: AppShellChat,
} satisfies Meta<typeof AppShellChat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <AppShellChat />
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <AppShellChat />,
};

export const Active: Story = {
  parameters: { pseudo: { active: true } },
  render: () => <AppShellChat />,
};

export const FocusVisible: Story = {
  render: () => <AppShellChat />,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
