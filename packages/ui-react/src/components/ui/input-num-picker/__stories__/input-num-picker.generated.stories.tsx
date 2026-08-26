// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { InputNumPicker } from '../input-num-picker';

const meta = {
  title: 'UI/InputNumPicker/All States (generated)',
  component: InputNumPicker,
} satisfies Meta<typeof InputNumPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <InputNumPicker label="Quantity" defaultValue={1} />
      <InputNumPicker label="Quantity" defaultValue={1} disabled />
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <InputNumPicker label="Quantity" defaultValue={1} />,
};

export const FocusVisible: Story = {
  render: () => <InputNumPicker label="Quantity" defaultValue={1} />,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
