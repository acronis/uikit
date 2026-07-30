// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { SquareDashedIcon } from '@acronis-platform/icons-react/stroke-mono';
import { TagIcon } from '../tag-icon';

const meta = {
  title: 'UI/TagIcon/All States (generated)',
  component: TagIcon,
} satisfies Meta<typeof TagIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <TagIcon icon={<SquareDashedIcon />} />
    </div>
  ),
};
