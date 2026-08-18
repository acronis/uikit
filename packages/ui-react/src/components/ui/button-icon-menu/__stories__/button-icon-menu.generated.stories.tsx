// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ButtonIconMenu } from '../button-icon-menu';

const meta = {
  title: 'UI/ButtonIconMenu/All States (generated)',
  component: ButtonIconMenu,
} satisfies Meta<typeof ButtonIconMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <ButtonIconMenu />
      <ButtonIconMenu disabled />
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <ButtonIconMenu />,
};

export const Active: Story = {
  parameters: { pseudo: { active: true } },
  render: () => <ButtonIconMenu />,
};

export const FocusVisible: Story = {
  render: () => <ButtonIconMenu />,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
