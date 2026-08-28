import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  FolderIcon,
  NodeTreeIcon,
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
    expanded: {
      control: 'boolean',
      description:
        "Whether the row's nested list is currently expanded. Purely visual — it only rotates the leading chevron to reflect state the consumer already owns (and should also mirror via `aria-expanded`). No effect when `isExpandable` is false.",
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
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
    expanded: false,
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

/**
 * `expanded` rotates the chevron a quarter turn to point down. The row still
 * renders no nested list — the consumer owns the open state and the children.
 */
export const Expanded: Story = {
  args: { expanded: true, hasIcon: true, title: 'Workloads' },
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
 * expand state all live outside this component. `expanded` tracks
 * `aria-expanded` on the open row so the chevron never contradicts what the row
 * announces. The collapsed row still spells out `aria-expanded="false"` — ARIA
 * requires the attribute be explicit, not merely absent, on a treeitem that
 * owns a group — but omits `expanded`, which already defaults to false.
 *
 * The `<li role="treeitem">` is authored by hand rather than composed through
 * `render`, because a branch row's nested `<ul role="group">` has to be a DOM
 * *child* of that `<li>` — both HTML's content model (a `<ul>` may only
 * contain `<li>`s) and ARIA ownership (a treeitem's group must be reachable
 * from it) require that. `TreeItem` renders as its default `<div>` inside the
 * `<li>`, alongside the group.
 */
export const ComposedTree: Story = {
  render: () => (
    <ul role="tree" aria-label="Workloads" className="w-72">
      <li role="treeitem" aria-expanded="true">
        <TreeItem
          expanded
          hasIcon
          icon={<FolderIcon size={16} />}
          title="All workloads"
        >
          <Tag variant="info">24</Tag>
        </TreeItem>
        <ul role="group" className="ps-4">
          <li role="treeitem" aria-expanded="false">
            <TreeItem
              hasIcon
              icon={<FolderIcon size={16} />}
              title="Machines with agents"
            />
          </li>
          <li role="treeitem" aria-selected="true">
            <TreeItem
              isExpandable={false}
              hasIcon
              selected
              title="Cloud applications"
            />
          </li>
          <li role="treeitem">
            <TreeItem
              isExpandable={false}
              hasIcon
              title="Unmanaged workloads"
            />
          </li>
        </ul>
      </li>
    </ul>
  ),
};

interface DemoTreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: DemoTreeNode[];
}

// Four levels: root → group → tenant → workload.
const workloadTree: DemoTreeNode = {
  id: 'all',
  label: 'All workloads',
  icon: <FolderIcon size={16} />,
  children: [
    {
      id: 'agents',
      label: 'Machines with agents',
      icon: <FolderIcon size={16} />,
      children: [
        {
          id: 'obsidian',
          label: 'Obsidian Legal Group',
          icon: <FolderIcon size={16} />,
          children: [
            { id: 'obsidian-dc1', label: 'dc-01.obsidian.local' },
            { id: 'obsidian-web', label: 'web-01.obsidian.local' },
          ],
        },
        {
          id: 'cedar',
          label: 'Cedar Grove Capital',
          icon: <FolderIcon size={16} />,
          children: [
            { id: 'cedar-sql', label: 'sql-01.cedar.local' },
            { id: 'cedar-file', label: 'file-01.cedar.local' },
          ],
        },
      ],
    },
    {
      id: 'cloud',
      label: 'Cloud applications',
      icon: <FolderIcon size={16} />,
      children: [
        {
          id: 'm365',
          label: 'Microsoft 365',
          icon: <FolderIcon size={16} />,
          children: [
            { id: 'm365-mail', label: 'Mailboxes' },
            { id: 'm365-sites', label: 'SharePoint sites' },
          ],
        },
        {
          id: 'gws',
          label: 'Google Workspace',
          icon: <FolderIcon size={16} />,
          children: [{ id: 'gws-drive', label: 'Shared drives' }],
        },
      ],
    },
    { id: 'unmanaged', label: 'Unmanaged workloads' },
  ],
};

// Everything the interaction needs — the open/closed map, the toggle handler and
// the nested-list rendering — lives here in the consumer, because `TreeItem` is a
// single stateless row by design. Collapsed branches are unmounted rather than
// hidden: the row holds no state, animation or measurement worth preserving.
function ExpandableWorkloadTree() {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    all: true,
    agents: true,
    obsidian: true,
  });
  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  // `level` is the 1-based ARIA depth. The `<li role="treeitem">` is authored
  // by hand (not composed through `render`) so that a branch node's nested
  // `<ul role="group">` can be its DOM *child* — both HTML's content model
  // (a `<ul>` may only contain `<li>`s) and ARIA ownership (a treeitem's group
  // must be reachable from it) require that. `TreeItem` renders as its
  // default `<div>`, and carries the click/keyboard/focus behavior — the `<li>`
  // only carries the tree semantics.
  const renderNode = (
    node: DemoTreeNode,
    level = 1,
    posInSet = 1,
    setSize = 1
  ): React.ReactNode => {
    const branch = !!node.children?.length;
    const open = branch && !!expanded[node.id];

    return (
      <li
        key={node.id}
        role="treeitem"
        aria-level={level}
        aria-posinset={posInSet}
        aria-setsize={setSize}
        {...(branch ? { 'aria-expanded': open } : {})}
      >
        <TreeItem
          onClick={branch ? () => toggle(node.id) : undefined}
          onKeyDown={
            branch
              ? (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggle(node.id);
                  }
                }
              : undefined
          }
          className={branch ? 'cursor-pointer' : undefined}
          isExpandable={branch}
          expanded={open}
          hasIcon
          icon={node.icon ?? <NodeTreeIcon size={16} />}
          title={node.label}
          tabIndex={level === 1 ? 0 : -1}
        />
        {open && (
          <ul role="group" className="ps-4">
            {node.children!.map((child, index) =>
              renderNode(child, level + 1, index + 1, node.children!.length)
            )}
          </ul>
        )}
      </li>
    );
  };

  return (
    <ul role="tree" aria-label="Workloads" className="w-80">
      {renderNode(workloadTree)}
    </ul>
  );
}

/**
 * A working four-level tree: clicking an expandable row toggles its `aria-expanded`
 * and mounts/unmounts the nested `<ul role="group">` beneath it. All of that state
 * is the consumer's — the story's — since `TreeItem` deliberately renders one row
 * and nothing else. The root row is the tree's single tab stop (`tabIndex={0}`,
 * every descendant `-1`) and Enter/Space activate the same toggle as a click;
 * full arrow-key roving navigation is out of scope for this demo.
 */
export const ExpandCollapseTree: Story = {
  render: () => <ExpandableWorkloadTree />,
};
