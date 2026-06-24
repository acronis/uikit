// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ButtonMenu } from '../button-menu';

const meta = {
  title: 'UI/ButtonMenu/All States (generated)',
  component: ButtonMenu,
} satisfies Meta<typeof ButtonMenu>;

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
        <ButtonMenu key={v} variant={v}>
          Label
        </ButtonMenu>
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
        <ButtonMenu key={v} variant={v} disabled>
          Label
        </ButtonMenu>
      ))}
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <ButtonMenu>Label</ButtonMenu>,
};

export const Active: Story = {
  parameters: { pseudo: { active: true } },
  render: () => <ButtonMenu>Label</ButtonMenu>,
};

export const FocusVisible: Story = {
  render: () => <ButtonMenu>Label</ButtonMenu>,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
