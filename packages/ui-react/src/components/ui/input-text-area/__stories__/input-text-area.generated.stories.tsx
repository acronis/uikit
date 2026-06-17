// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { InputTextArea } from '../input-text-area';

const meta = {
  title: 'UI/InputTextArea/All States (generated)',
  component: InputTextArea,
} satisfies Meta<typeof InputTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <InputTextArea aria-label="Notes" />
      <InputTextArea aria-label="Notes" aria-invalid />
      <InputTextArea aria-label="Notes" disabled />
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <InputTextArea aria-label="Notes" />,
};

export const FocusVisible: Story = {
  render: () => <InputTextArea aria-label="Notes" />,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
