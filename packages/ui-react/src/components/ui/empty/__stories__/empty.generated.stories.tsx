// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyIcon, EmptyHeader, EmptyTitle, EmptyDescription } from '../empty';
import { InboxIcon } from '@acronis-platform/icons-react/stroke-mono';
import { Empty } from '../empty';

const meta = {
  title: 'UI/Empty/All States (generated)',
  component: Empty,
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Empty>
        <EmptyIcon>
          <InboxIcon />
        </EmptyIcon>
        <EmptyHeader>
          <EmptyTitle>No messages</EmptyTitle>
          <EmptyDescription>You have no messages yet.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  ),
};
