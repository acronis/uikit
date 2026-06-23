// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { AvatarFallback } from '../avatar';
import { Avatar } from '../avatar';

const meta = {
  title: 'UI/Avatar/All States (generated)',
  component: Avatar,
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar>
        <AvatarFallback>SN</AvatarFallback>
      </Avatar>
    </div>
  ),
};
