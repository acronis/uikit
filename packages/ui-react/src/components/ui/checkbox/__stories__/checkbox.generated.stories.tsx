// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Checkbox } from '../checkbox';

const meta = {
  title: 'UI/Checkbox/All States (generated)',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
      }}
    >
      <Checkbox aria-label="Off" />
      <Checkbox aria-label="On" defaultChecked />
      <Checkbox aria-label="Disabled off" disabled />
      <Checkbox aria-label="Disabled on" disabled defaultChecked />
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <Checkbox aria-label="Accept" />,
};

export const FocusVisible: Story = {
  render: () => <Checkbox aria-label="Accept" />,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};

// transition "toggle": click / Space -> toggle (!checked) [guard: not disabled]
export const Toggle: Story = {
  render: () => <Checkbox aria-label="Accept" />,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="checkbox"], span');
    if (el) await userEvent.click(el as HTMLElement);
  },
};
