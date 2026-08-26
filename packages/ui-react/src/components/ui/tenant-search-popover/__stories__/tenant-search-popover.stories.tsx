import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import {
  TenantSearchPopover,
  TenantSearchPopoverContent,
  TenantSearchPopoverTrigger,
  type TenantSearchItem,
} from '../tenant-search-popover';

const tenants: TenantSearchItem[] = [
  { id: 'all', label: 'All clients', tenantType: 'all-clients' },
  {
    id: 'northwind',
    label: 'Northwind Traders',
    tenantType: 'partner',
    children: [
      {
        id: 'northwind-emea',
        label: 'EMEA',
        tenantType: 'folder',
        children: [
          { id: 'northwind-emea-de', label: 'Germany', tenantType: 'unit' },
          { id: 'northwind-emea-fr', label: 'France', tenantType: 'unit' },
        ],
      },
      { id: 'northwind-apac', label: 'APAC', tenantType: 'folder' },
    ],
  },
  {
    id: 'contoso',
    label: 'Contoso Ltd',
    tenantType: 'partner',
    children: [
      { id: 'contoso-hq', label: 'Headquarters', tenantType: 'unit' },
      { id: 'contoso-retail', label: 'Retail', tenantType: 'client' },
    ],
  },
  { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
  { id: 'litware', label: 'Litware Group', tenantType: 'client' },
];

const recent: TenantSearchItem[] = [
  { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
  { id: 'contoso-hq', label: 'Headquarters', tenantType: 'unit' },
];

const meta = {
  title: 'UI/TenantSearchPopover',
  component: TenantSearchPopoverContent,
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: false,
      description:
        'Tenant tree rendered under the "Browse" section. A node with `children` becomes an expand/collapse toggle.',
      table: { type: { summary: 'TenantSearchItem[]' }, category: 'Content' },
    },
    recentItems: {
      control: false,
      description:
        'Tenants rendered under "Recent". The section is omitted entirely when the list is empty (Figma\'s `hasRecent`).',
      table: { type: { summary: 'TenantSearchItem[]' }, category: 'Content' },
    },
    value: {
      control: 'text',
      description: 'Controlled selected tenant id. Pair with `onValueChange`.',
      table: { type: { summary: 'string' }, category: 'State' },
    },
    status: {
      control: 'inline-radio',
      options: ['idle', 'loading', 'empty', 'error'],
      description:
        "Which region replaces the list — mirrors the Figma `variant` axis (`data` → `idle`).",
      table: {
        type: { summary: "'idle' | 'loading' | 'empty' | 'error'" },
        defaultValue: { summary: "'idle'" },
        category: 'State',
      },
    },
    query: {
      control: 'text',
      description:
        'Controlled search query. Leave unset to let the panel own it. Matching keeps every ancestor of a match and auto-expands the path to it.',
      table: { type: { summary: 'string' }, category: 'State' },
    },
    searchPlaceholder: {
      control: 'text',
      description: 'Search input placeholder.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Search'" },
        category: 'Content',
      },
    },
    searchLabel: {
      control: 'text',
      description: 'Accessible name for the search input (it has no visible label).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Search tenants'" },
        category: 'Content',
      },
    },
    recentLabel: {
      control: 'text',
      description: '"Recent" section heading.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Recent'" },
        category: 'Content',
      },
    },
    browseLabel: {
      control: 'text',
      description: '"Browse" section heading.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Browse'" },
        category: 'Content',
      },
    },
    loadingLabel: {
      control: 'text',
      description: 'Copy shown in the `loading` state.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Data is loading…'" },
        category: 'Content',
      },
    },
    emptyLabel: {
      control: 'text',
      description:
        'Copy shown in the `empty` state, and whenever the active query matches nothing.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'No data found'" },
        category: 'Content',
      },
    },
    errorLabel: {
      control: 'text',
      description: 'Copy shown in the `error` state.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Something went wrong.'" },
        category: 'Content',
      },
    },
    retryLabel: {
      control: 'text',
      description: "Label of the error state's retry action.",
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Try again'" },
        category: 'Content',
      },
    },
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      description:
        'Which side of the trigger the panel opens on. Resolved by Base UI `Popover.Positioner`, which flips logical sides under `dir="rtl"`.',
      table: {
        type: { summary: "'top' | 'right' | 'bottom' | 'left'" },
        defaultValue: { summary: "'bottom'" },
        category: 'Appearance',
      },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description: 'Alignment along the chosen side.',
      table: {
        type: { summary: "'start' | 'center' | 'end'" },
        defaultValue: { summary: "'start'" },
        category: 'Appearance',
      },
    },
    sideOffset: {
      control: { type: 'number', min: 0, max: 24 },
      description: 'Distance in px from the trigger.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '4' },
        category: 'Appearance',
      },
    },
    portal: {
      control: 'boolean',
      description: 'Render the panel in a portal (default). Set `false` for inline usage.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Behavior',
      },
    },
    onValueChange: {
      control: false,
      description: 'Called with the tenant id when a selectable (leaf) row is activated.',
      table: { type: { summary: '(id: string) => void' }, category: 'Events' },
    },
    onQueryChange: {
      control: false,
      description: 'Called when the user types in the search row.',
      table: { type: { summary: '(query: string) => void' }, category: 'Events' },
    },
    onRetry: {
      control: false,
      description: "Called by the error state's retry action.",
      table: { type: { summary: '() => void' }, category: 'Events' },
    },
    className: {
      control: false,
      description: 'Extra classes merged onto the popup element.',
      table: { type: { summary: 'string' }, category: 'Composition' },
    },
  },
} satisfies Meta<typeof TenantSearchPopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Every story renders the panel open next to a real trigger so the composition —
// trigger + positioned popup — is what gets reviewed (and screenshotted).
const renderPanel: NonNullable<Story['render']> = (args) => {
  const [value, setValue] = useState<string | undefined>(args.value);
  return (
    <TenantSearchPopover defaultOpen>
      <TenantSearchPopoverTrigger render={<Button variant="secondary" />}>
        Select tenant
      </TenantSearchPopoverTrigger>
      <TenantSearchPopoverContent
        {...args}
        value={value}
        onValueChange={setValue}
      />
    </TenantSearchPopover>
  );
};

export const Default: Story = {
  args: { items: tenants },
  render: renderPanel,
  decorators: [
    (Story) => (
      <div className="min-h-[28rem] pb-96">
        <Story />
      </div>
    ),
  ],
};

export const WithRecent: Story = {
  ...Default,
  args: { items: tenants, recentItems: recent },
};

export const Selected: Story = {
  ...Default,
  args: { items: tenants, recentItems: recent, value: 'fabrikam' },
};

/**
 * A node with children starts collapsed; a query auto-expands the path to every
 * match. `query` is passed controlled here so the screenshot is deterministic.
 */
export const Filtered: Story = {
  ...Default,
  args: { items: tenants, query: 'Germany' },
};

export const Loading: Story = {
  ...Default,
  args: { items: tenants, status: 'loading' },
};

export const Empty: Story = {
  ...Default,
  args: { items: [], status: 'empty' },
};

export const Error: Story = {
  ...Default,
  args: { items: tenants, status: 'error' },
};

/** Logical spacing + Base UI's own side resolution mirror the whole panel. */
export const Rtl: Story = {
  ...Default,
  args: { items: tenants, recentItems: recent },
  decorators: [
    (Story) => (
      <div dir="rtl" className="min-h-[28rem] pb-96">
        <Story />
      </div>
    ),
  ],
};

/** Every rendered string comes from a prop, so the panel localizes wholesale. */
export const Localized: Story = {
  ...Default,
  args: {
    items: tenants,
    recentItems: recent,
    searchPlaceholder: 'Suchen',
    searchLabel: 'Mandanten suchen',
    recentLabel: 'Kürzlich',
    browseLabel: 'Durchsuchen',
  },
};
