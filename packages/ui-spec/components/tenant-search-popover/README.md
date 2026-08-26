# TenantSearchPopover

A tenant picker in a popover: an in-panel `search` row, an optional "Recent" section,
and a "Browse" section holding a nested tenant tree. Rows carry a tenant-type icon and
an indent spacer; leaves show a trailing check when selected. The whole list region is
replaced by a centered loading / empty / error `status` block.

> Built from the Figma `InputSelectDropdownTenants` node (`3064:21461`) hosted in this
> repo's generic `Popover` shell — the tenant picker is a **tree** of toggles and
> selectable leaves, not a listbox, so it is deliberately not a Base UI `Select`.
> Everything below the popup chrome reuses the presentational list parts shared with
> `InputSelect`; themed by the `--ui-popover-*` and `--ui-input-select-dropdown-*`
> tiers.

## When to use

- Picking one tenant / organization out of a hierarchy — clients, partners, folders,
  units — where the user needs to both **search** by name and **browse** down the
  tree.
- Anywhere a "current tenant" switcher hangs off a button in a header or toolbar.
- When a short list of recently used tenants should sit above the full hierarchy.

## When not to use

- For a flat list of options with field furniture (label / description / error) — use
  **InputSelect**.
- For free-text search over a large remote result set with no hierarchy — use
  **InputSearch** / **Combobox**.
- For picking **several** tenants — this panel is single-select only.
- When the selectable target is a node that also has children — see "Limitations".

## Parts

| Part            | Element                 | Purpose                                                  |
| --------------- | ----------------------- | -------------------------------------------------------- |
| `trigger`       | `button`                | Anchors and toggles the panel.                           |
| `root`          | `div[role=dialog]`      | The 256px positioned popup.                              |
| `search`        | `div`                   | Query row; Arrow Down moves focus into the list.         |
| `section`       | `div`                   | "Recent" (only when non-empty) or "Browse".              |
| `section-label` | `div`                   | Section heading; also names the section's tree.          |
| `tree`          | `div[role=tree]`        | One per section.                                         |
| `item`          | `div[role=treeitem]`    | A selectable leaf row.                                   |
| `indent`        | `span`                  | Nesting spacer; level 1 reserves the chevron slot.       |
| `icon`          | `span`                  | 16px leading glyph keyed to `tenantType`.                |
| `indicator`     | `span`                  | Trailing check on the selected leaf.                     |
| `expander`      | `button[role=treeitem]` | A row with children; toggles its subtree, never selects. |
| `group`         | `div[role=group]`       | An expanded node's children, wired via `aria-owns`.      |
| `status`        | `div`                   | Loading / empty / error block replacing the sections.    |
| `retry`         | `button`                | The error block's "Try again" action.                    |

## Examples

### Basic — uncontrolled query, controlled selection

```tsx
import {
  Button,
  TenantSearchPopover,
  TenantSearchPopoverTrigger,
  TenantSearchPopoverContent,
  type TenantSearchItem,
} from '@acronis-platform/ui-react';

const tenants: TenantSearchItem[] = [
  { id: 'all', label: 'All clients', tenantType: 'all-clients' },
  {
    id: 'northwind',
    label: 'Northwind Traders',
    tenantType: 'partner',
    children: [
      { id: 'emea', label: 'EMEA', tenantType: 'folder' },
      { id: 'emea-ops', label: 'EMEA Operations', tenantType: 'unit' },
    ],
  },
  { id: 'contoso', label: 'Contoso Ltd', tenantType: 'client' },
];

const [tenantId, setTenantId] = useState<string>();

<TenantSearchPopover>
  <TenantSearchPopoverTrigger render={<Button variant="secondary" />}>
    Select tenant
  </TenantSearchPopoverTrigger>
  <TenantSearchPopoverContent
    items={tenants}
    recentItems={[
      { id: 'contoso', label: 'Contoso Ltd', tenantType: 'client' },
    ]}
    value={tenantId}
    onValueChange={setTenantId}
  />
</TenantSearchPopover>;
```

### Remote search — controlled query and status

```tsx
const [query, setQuery] = useState('');
const { data, isLoading, isError, refetch } = useTenants(query);

<TenantSearchPopoverContent
  items={data ?? []}
  query={query}
  onQueryChange={setQuery}
  status={isLoading ? 'loading' : isError ? 'error' : 'idle'}
  onRetry={refetch}
/>;
```

`status` wins over the filter result: an explicit `loading` / `error` is never
replaced by the "query matched nothing" empty block.

### Localized copy

Every string the panel renders on its own is a prop whose default is the Figma copy:

```tsx
<TenantSearchPopoverContent
  items={tenants}
  searchPlaceholder={t('tenant.search.placeholder')}
  searchLabel={t('tenant.search.label')}
  recentLabel={t('tenant.recent')}
  browseLabel={t('tenant.browse')}
  loadingLabel={t('common.loading')}
  emptyLabel={t('tenant.empty')}
  errorLabel={t('common.error')}
  retryLabel={t('common.retry')}
/>
```

## Limitations

- **Only leaves are selectable.** A node with `children` renders as an `expander` and
  never emits `value-change`. If a tenant must be both browsable and pickable, model
  it as a leaf for now.
- **The expander chevron does not flip under `dir="rtl"`** — an existing limitation of
  the shared `InputSelect` expander. Keyboard direction does mirror correctly. See
  [accessibility.md](./accessibility.md).
- The expanded-node set and the roving focus are panel-owned; only `open`, `value` and
  `query` are controllable.
