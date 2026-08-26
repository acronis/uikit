'use client';

import { useState } from 'react';
import {
  Button,
  TenantSearchPopover,
  TenantSearchPopoverContent,
  TenantSearchPopoverTrigger,
  type TenantSearchItem,
} from '@acronis-platform/ui-react';

const tenants: TenantSearchItem[] = [
  { id: 'all', label: 'All clients', tenantType: 'all-clients' },
  {
    id: 'northwind',
    label: 'Northwind Traders',
    tenantType: 'partner',
    children: [
      {
        id: 'emea',
        label: 'EMEA',
        tenantType: 'folder',
        children: [{ id: 'emea-ops', label: 'EMEA Operations', tenantType: 'unit' }],
      },
      { id: 'amer', label: 'AMER', tenantType: 'folder' },
    ],
  },
  { id: 'contoso', label: 'Contoso Ltd', tenantType: 'client' },
  { id: 'fabrikam', label: 'Fabrikam Inc', tenantType: 'client' },
];

const recent: TenantSearchItem[] = [
  { id: 'contoso', label: 'Contoso Ltd', tenantType: 'client' },
];

function findLabel(items: TenantSearchItem[], id: string): string | undefined {
  for (const item of items) {
    if (item.id === id) return item.label;
    const nested = item.children ? findLabel(item.children, id) : undefined;
    if (nested) return nested;
  }
  return undefined;
}

// `ShadowDemo` wraps every preview in a `PortalContainerProvider` pointing at the
// shadow mount, so the portaled panel picks up the shadow root's styles without the
// demo passing `portalContainer` itself.
export function TenantSearchPopoverDemo() {
  const [tenantId, setTenantId] = useState<string | undefined>('contoso');

  return (
    <TenantSearchPopover defaultOpen>
      <TenantSearchPopoverTrigger render={<Button variant="secondary" />}>
        {(tenantId && findLabel(tenants, tenantId)) ?? 'Select tenant'}
      </TenantSearchPopoverTrigger>
      <TenantSearchPopoverContent
        items={tenants}
        recentItems={recent}
        value={tenantId}
        onValueChange={setTenantId}
      />
    </TenantSearchPopover>
  );
}
