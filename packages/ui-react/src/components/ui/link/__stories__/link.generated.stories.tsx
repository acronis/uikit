// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Link } from '../link';

const meta = {
  title: 'UI/Link/All States (generated)',
  component: Link,
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Link href="#">Link</Link>
      <Link href="#" disabled>
        Link
      </Link>
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <Link href="#">Link</Link>,
};

export const Active: Story = {
  parameters: { pseudo: { active: true } },
  render: () => <Link href="#">Link</Link>,
};

export const FocusVisible: Story = {
  render: () => <Link href="#">Link</Link>,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
