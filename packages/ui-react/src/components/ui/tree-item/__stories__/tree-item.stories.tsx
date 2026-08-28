import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  FolderIcon,
  PencilIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { ButtonIcon } from '../../button-icon';
import { Tag } from '../../tag';
import { TreeItem } from '../tree-item';

const meta = {
  title: 'UI/TreeItem',
  component: TreeItem,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description:
        "The row's label — mirrors the Figma `title` property. Truncates rather than wrapping. Component-rendered text, so it is a prop with the literal only as its default; it shadows the native `title` tooltip attribute.",
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Title'" },
        category: 'Content',
      },
    },
    isExpandable: {
      control: 'boolean',
      description:
        'Show the leading expand chevron. A purely visual affordance — this row implements no expand/collapse and renders no nested list; the consumer owns that state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Appearance',
      },
    },
    hasCheckbox: {
      control: 'boolean',
      description:
        'Show a leading `Checkbox`. The row holds no checked state — drive it through `checkboxProps`. Its `aria-label` defaults to `title`, since the box has no visible label of its own.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Appearance',
      },
    },
    checkboxProps: {
      control: false,
      description:
        'Props forwarded verbatim to the leading `Checkbox` (`checked`, `onCheckedChange`, `indeterminate`, `aria-label`, …).',
      table: { type: { summary: 'CheckboxProps' }, category: 'Behavior' },
    },
    hasIcon: {
      control: 'boolean',
      description: 'Show the leading icon slot.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Appearance',
      },
    },
    icon: {
      control: false,
      description:
        "The leading icon. Only rendered when `hasIcon` is set; falls back to the design's `SquareDashedIcon` placeholder.",
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    hasExtras: {
      control: 'boolean',
      description:
        'Render the trailing extras slot (`children`) at all. When false the children are dropped entirely.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Appearance',
      },
    },
    children: {
      control: false,
      description:
        'Trailing extras — action buttons, a count badge. Only rendered when `hasExtras` is true.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    selected: {
      control: 'boolean',
      description:
        "Whether the row is selected — the Figma `variant` axis. Paints the persistent highlighted background (`--ui-background-surface-active`), the same fill the design's `state=active` swatch previews.",
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    onClick: {
      control: false,
      description:
        'Fired when the row is clicked. Selection and expansion are the consumer’s to own.',
      table: { type: { summary: 'MouseEventHandler' }, category: 'Events' },
    },
    tabIndex: {
      control: 'number',
      description:
        'Not set by the component — pass it (or a roving tabindex) if your tree focuses rows. The focus ring paints on `:focus-visible`.',
      table: { type: { summary: 'number' }, category: 'Behavior' },
    },
    render: {
      control: false,
      description:
        'Base UI render prop — replace the underlying `<div>` (e.g. with the `<li role="treeitem">` of a real ARIA tree).',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
  args: {
    title: 'Title',
    isExpandable: true,
    hasCheckbox: false,
    hasIcon: false,
    hasExtras: true,
    selected: false,
  },
} satisfies Meta<typeof TreeItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Figma default: chevron + title, nothing else. */
export const Default: Story = {};

export const WithIcon: Story = {
  args: { hasIcon: true, title: 'Workloads' },
};

/** A custom icon replaces the design's `SquareDashedIcon` placeholder. */
export const WithCustomIcon: Story = {
  args: { hasIcon: true, icon: <FolderIcon size={16} />, title: 'Backups' },
};

export const WithCheckbox: Story = {
  args: { hasCheckbox: true, hasIcon: true, title: 'Select this workload' },
};

export const Selected: Story = {
  args: { selected: true, hasIcon: true, title: 'Workloads' },
};

/** The trailing slot takes whatever the row needs — a count, an action. */
export const WithExtras: Story = {
  args: {
    hasIcon: true,
    title: 'Protected devices',
    children: <Tag variant="info">12</Tag>,
  },
};

export const WithActionExtras: Story = {
  args: {
    hasIcon: true,
    title: 'Backups',
    children: (
      <ButtonIcon aria-label="Rename">
        <PencilIcon size={16} />
      </ButtonIcon>
    ),
  },
};

/** A leaf row: no chevron, so nothing suggests it can be expanded. */
export const NotExpandable: Story = {
  args: { isExpandable: false, hasIcon: true, title: 'readme.md' },
};

/** `hasExtras={false}` drops the trailing slot and its children entirely. */
export const WithoutExtras: Story = {
  args: {
    hasExtras: false,
    hasIcon: true,
    title: 'Workloads',
    children: <Tag variant="info">12</Tag>,
  },
};

/** Long labels truncate rather than wrapping or widening the row. */
export const TruncatedTitle: Story = {
  args: {
    hasIcon: true,
    title:
      'A very long workload group name that cannot possibly fit in this row',
  },
  render: (args) => (
    <div className="w-72">
      <TreeItem {...args} />
    </div>
  ),
};

/**
 * A real tree is composed by the consumer: several rows, indentation, and the
 * expand state all live outside this component. `render` supplies the ARIA tree
 * semantics the standalone row deliberately does not force.
 */
export const ComposedTree: Story = {
  render: () => (
    <ul role="tree" aria-label="Workloads" className="w-72">
      <TreeItem
        render={<li role="treeitem" aria-expanded="true" />}
        hasIcon
        icon={<FolderIcon size={16} />}
        title="All workloads"
      >
        <Tag variant="info">24</Tag>
      </TreeItem>
      <ul role="group" className="ps-4">
        <TreeItem
          render={<li role="treeitem" aria-expanded="false" />}
          hasIcon
          icon={<FolderIcon size={16} />}
          title="Machines with agents"
        />
        <TreeItem
          render={<li role="treeitem" aria-selected="true" />}
          isExpandable={false}
          hasIcon
          selected
          title="Cloud applications"
        />
        <TreeItem
          render={<li role="treeitem" />}
          isExpandable={false}
          hasIcon
          title="Unmanaged workloads"
        />
      </ul>
    </ul>
  ),
};
