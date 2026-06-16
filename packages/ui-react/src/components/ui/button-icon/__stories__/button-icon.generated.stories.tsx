// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { PlusIcon } from '@acronis-platform/icons-react/stroke-mono';
import { ButtonIcon } from '../button-icon';

const meta = {
  title: 'UI/ButtonIcon/All States (generated)',
  component: ButtonIcon,
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['ghost', 'secondary'] as const;

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
        <ButtonIcon aria-label="Action" key={v} variant={v}>
          <PlusIcon />
        </ButtonIcon>
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
        <ButtonIcon aria-label="Action" key={v} variant={v} disabled>
          <PlusIcon />
        </ButtonIcon>
      ))}
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => (
    <ButtonIcon aria-label="Action">
      <PlusIcon />
    </ButtonIcon>
  ),
};

export const Active: Story = {
  parameters: { pseudo: { active: true } },
  render: () => (
    <ButtonIcon aria-label="Action">
      <PlusIcon />
    </ButtonIcon>
  ),
};

export const FocusVisible: Story = {
  render: () => (
    <ButtonIcon aria-label="Action">
      <PlusIcon />
    </ButtonIcon>
  ),
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
