// Figma Code Connect — status: PARTIAL
//
// Mapped to "InputSelectDropdownTenants" (node 3064:21461) — the node whose
// visual identity this component implements. Exactly one of its four properties
// maps cleanly and is wired below: `variant` (loading | empty | error | data) →
// the `status` prop.
//
// The other three do NOT map 1:1, which is why this is PARTIAL rather than
// COMPLETE:
//   • `listRecent` / `listBrowse` are *instance slots* in Figma (a designer
//     drops row instances into them), whereas this component is data-driven —
//     rows are generated from the recursive `items` / `recentItems` arrays,
//     including the nesting level, the tenant-type icon and the expand/collapse
//     state. No children expression can turn a slot of row instances into that
//     tree, so the example passes named placeholder arrays instead of
//     `figma.children(...)`.
//   • `hasRecent` has no prop to map to: the Recent section is derived from
//     whether `recentItems` is non-empty rather than gated by its own flag, and
//     Code Connect cannot express that conditional in the example snippet.
//
// The popover shell itself (trigger, positioning, chrome) is a separate Figma
// node — 6364:17907, already mapped in `../popover/popover.figma.tsx` — so the
// example composes this content into that shell rather than re-mapping it.
import figma from '@figma/code-connect';

import { Button } from '../button/button';
import {
  TenantSearchPopover,
  TenantSearchPopoverContent,
  TenantSearchPopoverTrigger,
  type TenantSearchItem,
  type TenantSearchPopoverStatus,
} from './tenant-search-popover';

// Stand-ins for the consumer's own data + selection state: the Figma node
// exposes its rows as instance slots, which cannot be turned into this
// component's recursive `items` array (see the PARTIAL note above).
declare const tenants: TenantSearchItem[];
declare const recentTenants: TenantSearchItem[];
declare const selectedTenantId: string | undefined;
declare const setSelectedTenantId: (id: string) => void;

figma.connect(
  TenantSearchPopoverContent,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3064-21461',
  {
    props: {
      status: figma.enum<TenantSearchPopoverStatus>('variant', {
        data: 'idle',
        loading: 'loading',
        empty: 'empty',
        error: 'error',
      }),
    },
    example: ({ status }: { status: TenantSearchPopoverStatus }) => (
      <TenantSearchPopover>
        <TenantSearchPopoverTrigger render={<Button variant="secondary" />}>
          Select tenant
        </TenantSearchPopoverTrigger>
        <TenantSearchPopoverContent
          items={tenants}
          recentItems={recentTenants}
          status={status}
          value={selectedTenantId}
          onValueChange={setSelectedTenantId}
        />
      </TenantSearchPopover>
    ),
  }
);
