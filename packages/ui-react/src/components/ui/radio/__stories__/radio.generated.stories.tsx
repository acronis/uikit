// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Radio } from '../radio';
import { RadioGroup } from '../radio';

const meta = {
  title: 'UI/RadioGroup/All States (generated)',
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <RadioGroup aria-label="Plan">
        <Radio value="a" aria-label="Option A" />
        <Radio value="b" aria-label="Option B" />
      </RadioGroup>
      <RadioGroup aria-label="Plan" disabled>
        <Radio value="a" aria-label="Option A" />
        <Radio value="b" aria-label="Option B" />
      </RadioGroup>
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => (
    <RadioGroup aria-label="Plan">
      <Radio value="a" aria-label="Option A" />
      <Radio value="b" aria-label="Option B" />
    </RadioGroup>
  ),
};

export const FocusVisible: Story = {
  render: () => (
    <RadioGroup aria-label="Plan">
      <Radio value="a" aria-label="Option A" />
      <Radio value="b" aria-label="Option B" />
    </RadioGroup>
  ),
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
