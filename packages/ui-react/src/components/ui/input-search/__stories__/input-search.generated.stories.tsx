// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { InputSearch } from '../input-search';

const meta = {
  title: 'UI/InputSearch/All States (generated)',
  component: InputSearch,
} satisfies Meta<typeof InputSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <InputSearch label="Find" placeholder="Search table" />
      <InputSearch label="Find" placeholder="Search table" disabled />
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <InputSearch label="Find" placeholder="Search table" />,
};

export const FocusVisible: Story = {
  render: () => <InputSearch label="Find" placeholder="Search table" />,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
