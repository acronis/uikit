// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Tag } from '../../tag';
import { FolderIcon } from '@acronis-platform/icons-react/stroke-mono';
import { TreeItem } from '../tree-item';

const meta = {
  title: 'UI/TreeItem/All States (generated)',
  component: TreeItem,
} satisfies Meta<typeof TreeItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <TreeItem
        title="All workloads"
        hasIcon
        icon={<FolderIcon size={16} />}
        hasCheckbox
        className="w-72"
      >
        <Tag variant="info">24</Tag>
      </TreeItem>
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => (
    <TreeItem
      title="All workloads"
      hasIcon
      icon={<FolderIcon size={16} />}
      hasCheckbox
      className="w-72"
    >
      <Tag variant="info">24</Tag>
    </TreeItem>
  ),
};

export const FocusVisible: Story = {
  render: () => (
    <TreeItem
      title="All workloads"
      hasIcon
      icon={<FolderIcon size={16} />}
      hasCheckbox
      className="w-72"
    >
      <Tag variant="info">24</Tag>
    </TreeItem>
  ),
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
