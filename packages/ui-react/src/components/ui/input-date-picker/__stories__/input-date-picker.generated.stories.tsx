// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { InputDatePicker } from '../input-date-picker';

const meta = {
  title: 'UI/InputDatePicker/All States (generated)',
  component: InputDatePicker,
} satisfies Meta<typeof InputDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <InputDatePicker label="Due" placeholder="Pick a date" />
      <InputDatePicker label="Due" placeholder="Pick a date" disabled />
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <InputDatePicker label="Due" placeholder="Pick a date" />,
};

export const FocusVisible: Story = {
  render: () => <InputDatePicker label="Due" placeholder="Pick a date" />,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
