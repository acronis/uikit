// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { InboxIcon } from '@acronis-platform/icons-react/stroke-mono';
import { EmptyOverlay } from '../empty-overlay';

const meta = {
  title: 'UI/EmptyOverlay/All States (generated)',
  component: EmptyOverlay,
  args: { title: 'No object yet' },
} satisfies Meta<typeof EmptyOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <EmptyOverlay icon={<InboxIcon />} title="No object yet" description="Short description." />
    </div>
  ),
};
