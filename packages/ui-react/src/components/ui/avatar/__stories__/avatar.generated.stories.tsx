// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserIcon } from '@acronis-platform/icons-react/stroke-mono';
import { Avatar } from '../avatar';

const meta = {
  title: 'UI/Avatar/All States (generated)',
  component: Avatar,
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['text', 'icon'] as const;

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
        <Avatar icon={<UserIcon size={16} />} key={v} variant={v} />
      ))}
    </div>
  ),
};
