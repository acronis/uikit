import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BriefcaseIcon,
  BuildingIcon,
  FolderIcon,
  NodeTreeIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import {
  InputSelect,
  InputSelectContent,
  InputSelectDescription,
  InputSelectError,
  InputSelectExpander,
  InputSelectField,
  InputSelectItem,
  InputSelectLabel,
  InputSelectSearch,
  InputSelectSection,
  InputSelectSectionLabel,
  InputSelectStatus,
  InputSelectTrigger,
  InputSelectValue,
  useInputSelectFilter,
} from '../input-select';

const meta = {
  title: 'UI/InputSelect',
  component: InputSelect,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Uncontrolled initial value (matches an InputSelectItem `value`).',
      table: { type: { summary: 'Value | null' }, category: 'Content' },
    },
    value: {
      control: false,
      description: 'Controlled value. Pair with `onValueChange`.',
      table: { type: { summary: 'Value | null' }, category: 'Content' },
    },
    items: {
      control: false,
      description:
        'Item data structure; when set, InputSelectValue renders the selected item label instead of the raw value.',
      table: {
        type: { summary: 'Record<string, ReactNode> | { label; value }[]' },
        category: 'Content',
      },
    },
    multiple: {
      control: 'boolean',
      description:
        'Allow selecting multiple items (items show a leading checkbox; the popup stays open).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the select and applies the disabled token set.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'State' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the popup is initially open (uncontrolled).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Behavior' },
    },
    onValueChange: {
      control: false,
      description: 'Called when the selected value changes.',
      table: { type: { summary: '(value, eventDetails) => void' }, category: 'Events' },
    },
    children: {
      control: false,
      description: 'InputSelectField + InputSelectContent composition.',
      table: { type: { summary: 'ReactNode' }, category: 'Composition' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const fruitItems = {
  apple: 'Apple',
  banana: 'Banana',
  blueberry: 'Blueberry',
  grapes: 'Grapes',
};

const fruits = (
  <>
    <InputSelectItem value="apple">Apple</InputSelectItem>
    <InputSelectItem value="banana">Banana</InputSelectItem>
    <InputSelectItem value="blueberry">Blueberry</InputSelectItem>
    <InputSelectItem value="grapes">Grapes</InputSelectItem>
  </>
);

// Shared render for the fruit-based stories: the Controls-panel args (defaultValue,
// multiple, disabled, defaultOpen, …) are spread onto the root, so tweaking a control
// re-renders the live select. `items` is locked so InputSelectValue can resolve labels.
const renderFruitSelect: NonNullable<Story['render']> = (args) => (
  <InputSelect {...args} items={fruitItems}>
    <InputSelectField>
      <InputSelectLabel>Fruit</InputSelectLabel>
      <InputSelectTrigger>
        <InputSelectValue placeholder="Select an option" />
      </InputSelectTrigger>
      <InputSelectDescription>Pick your favourite</InputSelectDescription>
    </InputSelectField>
    <InputSelectContent>{fruits}</InputSelectContent>
  </InputSelect>
);

export const Default: Story = {
  render: renderFruitSelect,
};

export const Required: Story = {
  render: (args) => (
    <InputSelect {...args} items={fruitItems}>
      <InputSelectField>
        <InputSelectLabel required>Fruit</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>{fruits}</InputSelectContent>
    </InputSelect>
  ),
};

export const WithValue: Story = {
  args: { defaultValue: 'apple' },
  render: renderFruitSelect,
};

export const Error: Story = {
  render: (args) => (
    <InputSelect {...args} items={fruitItems}>
      <InputSelectField>
        <InputSelectLabel required>Fruit</InputSelectLabel>
        <InputSelectTrigger aria-invalid>
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
        <InputSelectError>Please choose a fruit</InputSelectError>
      </InputSelectField>
      <InputSelectContent>{fruits}</InputSelectContent>
    </InputSelect>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'apple' },
  render: renderFruitSelect,
};

// Open popup (single select) with a working in-dropdown search. Filtering is a
// component behaviour: `InputSelectSearch` drives the filter context and each
// `InputSelectItem` hides itself when its label doesn't match — no wiring needed.
export const Open: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <InputSelect {...args} items={fruitItems}>
      <InputSelectField>
        <InputSelectLabel>Fruit</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>
        <InputSelectSearch aria-label="Filter" placeholder="Search" />
        <InputSelectSection>
          <InputSelectSectionLabel>Fruits</InputSelectSectionLabel>
          {fruits}
        </InputSelectSection>
      </InputSelectContent>
    </InputSelect>
  ),
};

export const Multiple: Story = {
  args: { multiple: true, defaultValue: ['apple', 'banana'], defaultOpen: true },
  render: (args) => (
    <InputSelect {...args} items={fruitItems}>
      <InputSelectField>
        <InputSelectLabel>Fruit</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue placeholder="Select options" />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>{fruits}</InputSelectContent>
    </InputSelect>
  ),
};

// The loading / empty / error status rows shown inside the dropdown.
export const Statuses: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      {(['loading', 'empty', 'error'] as const).map((variant) => (
        <div
          key={variant}
          className="overflow-hidden rounded-[var(--ui-input-select-dropdown-container-border-radius)] border border-[var(--ui-input-select-dropdown-container-border-color)] bg-[var(--ui-input-select-dropdown-container-color)]"
        >
          <InputSelectStatus
            variant={variant}
            action={
              variant === 'error' ? (
                <button
                  type="button"
                  className="text-[var(--ui-link-color-idle)] underline hover:text-[var(--ui-link-color-hover)]"
                >
                  Try again
                </button>
              ) : undefined
            }
          >
            {variant === 'loading'
              ? 'Loading…'
              : variant === 'empty'
                ? 'No data found'
                : 'Something went wrong'}
          </InputSelectStatus>
        </div>
      ))}
    </div>
  ),
};

const tenantItems = {
  'london-office': 'London office',
  'all-clients': 'All clients',
  'apex': 'Apex Innovations',
  'bluesky': 'BlueSky Technologies',
  'cloud': 'Cloud Solutions',
  'london-obs': 'London office',
  'berlin': 'Berlin office',
  'sofia': 'Sofia office',
  'cedar': 'Cedar Grove Capital',
  'avalon': 'Avalon City Schools',
  'elysium': 'Elysium Networks',
  'zenith': 'Zenith Data Group',
  'nimbus': 'Nimbus Analytics',
  'gigawave': 'GigaWave Digital',
  'helix': 'Helix Cloud Services',
  'innovatech': 'InnovaTech Labs',
  'labeljada': 'LabelJada Cloud Solutions',
};

// The browsable tenant hierarchy. Leaves carry a `value`; branches carry `children`
// and render as expanders. Mirrors the Figma "InputSelectDropdownTenants" tree.
interface TenantNode {
  value?: string;
  label: string;
  icon: React.ReactNode;
  children?: TenantNode[];
}

const tenantTree: TenantNode[] = [
  { value: 'apex', label: 'Apex Innovations', icon: <BriefcaseIcon size={16} /> },
  { value: 'bluesky', label: 'BlueSky Technologies', icon: <BriefcaseIcon size={16} /> },
  { value: 'cloud', label: 'Cloud Solutions', icon: <BriefcaseIcon size={16} /> },
  {
    label: 'DataBridge Systems',
    icon: <BuildingIcon size={16} />,
    children: [
      {
        label: 'Obsidian Legal Group',
        icon: <BriefcaseIcon size={16} />,
        children: [
          { value: 'london-obs', label: 'London office', icon: <NodeTreeIcon size={16} /> },
          { value: 'berlin', label: 'Berlin office', icon: <NodeTreeIcon size={16} /> },
          { value: 'sofia', label: 'Sofia office', icon: <NodeTreeIcon size={16} /> },
        ],
      },
      { value: 'cedar', label: 'Cedar Grove Capital', icon: <BriefcaseIcon size={16} /> },
      { value: 'avalon', label: 'Avalon City Schools', icon: <BriefcaseIcon size={16} /> },
    ],
  },
  { value: 'elysium', label: 'Elysium Networks', icon: <BriefcaseIcon size={16} /> },
  {
    label: 'FusionSphere',
    icon: <BuildingIcon size={16} />,
    children: [
      { value: 'zenith', label: 'Zenith Data Group', icon: <BriefcaseIcon size={16} /> },
      { value: 'nimbus', label: 'Nimbus Analytics', icon: <BriefcaseIcon size={16} /> },
    ],
  },
  { value: 'gigawave', label: 'GigaWave Digital', icon: <FolderIcon size={16} /> },
  { value: 'helix', label: 'Helix Cloud Services', icon: <BriefcaseIcon size={16} /> },
  { value: 'innovatech', label: 'InnovaTech Labs', icon: <BriefcaseIcon size={16} /> },
  { value: 'labeljada', label: 'LabelJada Cloud Solutions', icon: <BriefcaseIcon size={16} /> },
];

const subtreeMatches = (node: TenantNode, q: string): boolean =>
  node.label.toLowerCase().includes(q) ||
  (node.children?.some((child) => subtreeMatches(child, q)) ?? false);

// Renders the tenant tree, reading the live search query from the InputSelect filter
// context. Filtering keeps the hierarchy (no flattening): a row shows when it, an
// ancestor, or a descendant matches, and matching branches auto-expand. Rows stay
// mounted and toggle `hidden` so Base UI's selection index stays stable.
function TenantTree() {
  const { query } = useInputSelectFilter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'DataBridge Systems': true,
    'Obsidian Legal Group': true,
  });
  const toggle = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  const rows: React.ReactNode[] = [];
  const walk = (
    node: TenantNode,
    depth: number,
    parentOpen: boolean,
    ancestorMatch: boolean
  ) => {
    const selfMatch = searching && node.label.toLowerCase().includes(q);
    const descendantMatch =
      searching && (node.children?.some((c) => subtreeMatches(c, q)) ?? false);
    const key = node.value ?? node.label;
    const visible = searching
      ? selfMatch || descendantMatch || ancestorMatch
      : parentOpen;
    const open = searching
      ? descendantMatch || selfMatch || ancestorMatch
      : !!expanded[node.label];

    if (node.children?.length) {
      rows.push(
        <InputSelectExpander
          key={key}
          expanded={open}
          onToggle={() => toggle(node.label)}
          indent={depth}
          hidden={!visible}
          icon={node.icon}
        >
          {node.label}
        </InputSelectExpander>
      );
      node.children.forEach((child) =>
        walk(child, depth + 1, visible && open, ancestorMatch || selfMatch)
      );
    } else {
      rows.push(
        <InputSelectItem
          key={key}
          value={node.value!}
          indent={depth || undefined}
          hidden={!visible}
          icon={node.icon}
        >
          {node.label}
        </InputSelectItem>
      );
    }
  };
  tenantTree.forEach((node) => walk(node, 1, true, false));

  const allClientsVisible = searching ? 'all clients'.includes(q) : true;
  const hasResults =
    !searching ||
    allClientsVisible ||
    tenantTree.some((node) => subtreeMatches(node, q));

  return (
    <>
      <InputSelectSection hidden={searching}>
        <InputSelectSectionLabel>Recent</InputSelectSectionLabel>
        <InputSelectItem value="london-office" icon={<NodeTreeIcon size={16} />}>
          London office
        </InputSelectItem>
      </InputSelectSection>
      <InputSelectSection hidden={searching && !hasResults}>
        <InputSelectSectionLabel>Browse</InputSelectSectionLabel>
        {/* "All clients" is the root of the whole tree, so it sits one level
            shallower than the top-level tenant rows (its children) — no indent. */}
        <InputSelectItem
          value="all-clients"
          hidden={!allClientsVisible}
          icon={<BriefcaseIcon size={16} />}
        >
          All clients
        </InputSelectItem>
        {rows}
      </InputSelectSection>
      <InputSelectStatus variant="empty" hidden={hasResults}>
        No tenants found
      </InputSelectStatus>
    </>
  );
}

// Tenant selector with icons, sections, expand/collapse, indentation and a working
// in-dropdown search — mirrors the Figma "InputSelectDropdownTenants" tree
// (node 3064-21461). The nesting spacer reserves 16 / 40 / 64 px for levels 1–3;
// expandable rows tuck their chevron right-aligned into that space so tenant icons
// stay aligned. Searching filters the tree in place, keeping the hierarchy.
export const TenantSelector: Story = {
  args: { defaultValue: 'all-clients', defaultOpen: true },
  render: (args) => (
    <InputSelect {...args} items={tenantItems}>
      <InputSelectField>
        <InputSelectLabel>Tenant</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue placeholder="Select a tenant" />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>
        <InputSelectSearch aria-label="Search tenants" placeholder="Search…" />
        <TenantTree />
      </InputSelectContent>
    </InputSelect>
  ),
};

// The tenant dropdown's loading / empty / error variants, each with the in-dropdown
// search on top — mirrors the Figma "InputSelectDropdownTenants" status variants
// (nodes 3064-21462 / 21467 / 21472).
export const StatusesWithSearch: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      {(['loading', 'empty', 'error'] as const).map((variant) => (
        <div
          key={variant}
          className="overflow-hidden rounded-[var(--ui-input-select-dropdown-container-border-radius)] border border-[var(--ui-input-select-dropdown-container-border-color)] bg-[var(--ui-input-select-dropdown-container-color)]"
        >
          <InputSelectSearch aria-label="Search tenants" placeholder="Search…" />
          <InputSelectStatus
            variant={variant}
            action={
              variant === 'error' ? (
                <button
                  type="button"
                  className="text-[var(--ui-link-color-idle)] underline hover:text-[var(--ui-link-color-hover)]"
                >
                  Try again
                </button>
              ) : undefined
            }
          >
            {variant === 'loading'
              ? 'Data is loading…'
              : variant === 'empty'
                ? 'No data found'
                : 'Something went wrong'}
          </InputSelectStatus>
        </div>
      ))}
    </div>
  ),
};
