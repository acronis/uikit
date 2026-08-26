// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import {
  TenantSearchPopoverTrigger,
  TenantSearchPopoverContent,
} from '../tenant-search-popover';
import { Button } from '../../button';
import { TenantSearchPopover } from '../tenant-search-popover';

const meta = {
  title: 'UI/TenantSearchPopover/All States (generated)',
  component: TenantSearchPopover,
} satisfies Meta<typeof TenantSearchPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <TenantSearchPopover defaultOpen>
        <TenantSearchPopoverTrigger render={<Button variant="secondary" />}>
          Select tenant
        </TenantSearchPopoverTrigger>
        <TenantSearchPopoverContent
          items={[
            { id: 'all', label: 'All clients', tenantType: 'all-clients' },
            {
              id: 'contoso',
              label: 'Contoso Ltd',
              tenantType: 'partner',
              children: [
                { id: 'contoso-hq', label: 'Headquarters', tenantType: 'unit' },
              ],
            },
            { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
          ]}
          recentItems={[
            { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
          ]}
        />
      </TenantSearchPopover>
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => (
    <TenantSearchPopover defaultOpen>
      <TenantSearchPopoverTrigger render={<Button variant="secondary" />}>
        Select tenant
      </TenantSearchPopoverTrigger>
      <TenantSearchPopoverContent
        items={[
          { id: 'all', label: 'All clients', tenantType: 'all-clients' },
          {
            id: 'contoso',
            label: 'Contoso Ltd',
            tenantType: 'partner',
            children: [
              { id: 'contoso-hq', label: 'Headquarters', tenantType: 'unit' },
            ],
          },
          { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
        ]}
        recentItems={[
          { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
        ]}
      />
    </TenantSearchPopover>
  ),
};

// transition "openPanel": trigger press / Space / Enter -> true
export const OpenPanel: Story = {
  render: () => (
    <TenantSearchPopover defaultOpen>
      <TenantSearchPopoverTrigger render={<Button variant="secondary" />}>
        Select tenant
      </TenantSearchPopoverTrigger>
      <TenantSearchPopoverContent
        items={[
          { id: 'all', label: 'All clients', tenantType: 'all-clients' },
          {
            id: 'contoso',
            label: 'Contoso Ltd',
            tenantType: 'partner',
            children: [
              { id: 'contoso-hq', label: 'Headquarters', tenantType: 'unit' },
            ],
          },
          { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
        ]}
        recentItems={[
          { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
        ]}
      />
    </TenantSearchPopover>
  ),
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="dialog"], div');
    if (el) await userEvent.click(el as HTMLElement);
  },
};

// transition "closePanel": Escape / outside press -> false
export const ClosePanel: Story = {
  render: () => (
    <TenantSearchPopover defaultOpen>
      <TenantSearchPopoverTrigger render={<Button variant="secondary" />}>
        Select tenant
      </TenantSearchPopoverTrigger>
      <TenantSearchPopoverContent
        items={[
          { id: 'all', label: 'All clients', tenantType: 'all-clients' },
          {
            id: 'contoso',
            label: 'Contoso Ltd',
            tenantType: 'partner',
            children: [
              { id: 'contoso-hq', label: 'Headquarters', tenantType: 'unit' },
            ],
          },
          { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
        ]}
        recentItems={[
          { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
        ]}
      />
    </TenantSearchPopover>
  ),
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="dialog"], div');
    if (el) await userEvent.click(el as HTMLElement);
  },
};

// transition "typeQuery": input in the search row -> the typed text
export const TypeQuery: Story = {
  render: () => (
    <TenantSearchPopover defaultOpen>
      <TenantSearchPopoverTrigger render={<Button variant="secondary" />}>
        Select tenant
      </TenantSearchPopoverTrigger>
      <TenantSearchPopoverContent
        items={[
          { id: 'all', label: 'All clients', tenantType: 'all-clients' },
          {
            id: 'contoso',
            label: 'Contoso Ltd',
            tenantType: 'partner',
            children: [
              { id: 'contoso-hq', label: 'Headquarters', tenantType: 'unit' },
            ],
          },
          { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
        ]}
        recentItems={[
          { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
        ]}
      />
    </TenantSearchPopover>
  ),
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="dialog"], div');
    if (el) await userEvent.click(el as HTMLElement);
  },
};

// transition "selectItem": click / Enter / Space on a leaf row -> the row's tenant id
export const SelectItem: Story = {
  render: () => (
    <TenantSearchPopover defaultOpen>
      <TenantSearchPopoverTrigger render={<Button variant="secondary" />}>
        Select tenant
      </TenantSearchPopoverTrigger>
      <TenantSearchPopoverContent
        items={[
          { id: 'all', label: 'All clients', tenantType: 'all-clients' },
          {
            id: 'contoso',
            label: 'Contoso Ltd',
            tenantType: 'partner',
            children: [
              { id: 'contoso-hq', label: 'Headquarters', tenantType: 'unit' },
            ],
          },
          { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
        ]}
        recentItems={[
          { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
        ]}
      />
    </TenantSearchPopover>
  ),
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="dialog"], div');
    if (el) await userEvent.click(el as HTMLElement);
  },
};

// transition "toggleNode": click on a row with children, or Arrow Right / Arrow Left -> toggle the row's id [guard: the row has children]
export const ToggleNode: Story = {
  render: () => (
    <TenantSearchPopover defaultOpen>
      <TenantSearchPopoverTrigger render={<Button variant="secondary" />}>
        Select tenant
      </TenantSearchPopoverTrigger>
      <TenantSearchPopoverContent
        items={[
          { id: 'all', label: 'All clients', tenantType: 'all-clients' },
          {
            id: 'contoso',
            label: 'Contoso Ltd',
            tenantType: 'partner',
            children: [
              { id: 'contoso-hq', label: 'Headquarters', tenantType: 'unit' },
            ],
          },
          { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
        ]}
        recentItems={[
          { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
        ]}
      />
    </TenantSearchPopover>
  ),
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="dialog"], div');
    if (el) await userEvent.click(el as HTMLElement);
  },
};

// transition "moveActiveRow": Arrow Up / Arrow Down / Home / End, or focusing a row -> the target row's id
export const MoveActiveRow: Story = {
  render: () => (
    <TenantSearchPopover defaultOpen>
      <TenantSearchPopoverTrigger render={<Button variant="secondary" />}>
        Select tenant
      </TenantSearchPopoverTrigger>
      <TenantSearchPopoverContent
        items={[
          { id: 'all', label: 'All clients', tenantType: 'all-clients' },
          {
            id: 'contoso',
            label: 'Contoso Ltd',
            tenantType: 'partner',
            children: [
              { id: 'contoso-hq', label: 'Headquarters', tenantType: 'unit' },
            ],
          },
          { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
        ]}
        recentItems={[
          { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
        ]}
      />
    </TenantSearchPopover>
  ),
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="dialog"], div');
    if (el) await userEvent.click(el as HTMLElement);
  },
};
