// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ButtonIconInput } from '../button-icon-input';

const meta = {
  title: 'UI/ButtonIconInput/All States (generated)',
  component: ButtonIconInput,
} satisfies Meta<typeof ButtonIconInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['normal', 'error'] as const;

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
        <ButtonIconInput key={v} variant={v} />
      ))}
    </div>
  ),
};

export const Disabled: Story = {
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
        <ButtonIconInput key={v} variant={v} disabled />
      ))}
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <ButtonIconInput />,
};

export const Active: Story = {
  parameters: { pseudo: { active: true } },
  render: () => <ButtonIconInput />,
};

export const FocusVisible: Story = {
  render: () => <ButtonIconInput />,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
