// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ButtonDropdown } from '../button-dropdown';

const meta = {
  title: 'UI/ButtonDropdown/All States (generated)',
  component: ButtonDropdown,
} satisfies Meta<typeof ButtonDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['primary', 'secondary'] as const;

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
        <ButtonDropdown key={v} variant={v}>
          Label
        </ButtonDropdown>
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
        <ButtonDropdown key={v} variant={v} disabled>
          Label
        </ButtonDropdown>
      ))}
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <ButtonDropdown>Label</ButtonDropdown>,
};

export const Active: Story = {
  parameters: { pseudo: { active: true } },
  render: () => <ButtonDropdown>Label</ButtonDropdown>,
};

export const FocusVisible: Story = {
  render: () => <ButtonDropdown>Label</ButtonDropdown>,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
