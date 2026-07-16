# FilterSearch

A composable toolbar for data tables that arranges a search field, optional
filter controls, an optional scope/tenant switcher, and trailing action buttons
in a single horizontal row.

`FilterSearchFilters` (the filter popover — trigger + form + Reset/Cancel/
Apply) and `FilterSearchAppliedFilters` (the removable-chip row + a top-level
"Reset filters" that clears immediately) are the real, functioning filter
building blocks — compose `FilterSearchFilters` in place of a plain filter
trigger, and render `FilterSearchAppliedFilters` as a sibling row below
`FilterSearch`. Ported from the standalone `MultiSearch` component (retired in
favor of living here, next to the toolbar it always appeared alongside).

> **Design-pending.** Unlike `FilterSearch`/`FilterSearchActions` (which have a
> real Figma node — see `figma:` in `index.yaml`), `FilterSearchFilters` and
> `FilterSearchAppliedFilters` have no Figma node yet. They theme entirely from
> shared semantic tokens plus their composed components' own tiers (Button,
> Chip, Popover) — no new component token tier. Reconcile against the real
> design later with `/figma-component FilterSearchFilters <url> --update`.

## When to Use

- Above a data table to provide search, filtering, and bulk action controls.
- When the table needs a consistent toolbar layout across views.

## When NOT to Use

- **Global search** — use SearchGlobal.
- **Form layouts** — use a form component, not a toolbar.
- **Navigation bars** — use a dedicated nav component.

## Related Components

- **DataTableToolbar** — a differently-designed toolbar that is part of the
  `DataTable` compound component. Use `FilterSearch` when you need a standalone
  toolbar above any data table; use `DataTableToolbar` when working within the
  `DataTable` composition.

## Filter fields via the context hook

Filter fields are **plain children** (no render prop). Each field wires its
own value/onChange to the popover draft through the `useFilterSearchFilters()`
context hook, which returns the current draft `filters` map and a per-key
`setFilter` setter. Apply commits the draft; Cancel / dismiss reverts it.

```tsx
import {
  FilterSearchFilters,
  useFilterSearchFilters,
} from '@acronis-platform/ui-react';

function StatusField() {
  const { filters, setFilter } = useFilterSearchFilters();
  return (
    <InputSelect
      value={(filters.status as string) ?? null}
      onValueChange={(v) => setFilter('status', v)}
    >
      {/* … */}
    </InputSelect>
  );
}
```

Group fields with a `Separator` between them as a layout convention.

## Parts

| Part                         | Element / component             | Role                                                       |
| ---------------------------- | ------------------------------- | ---------------------------------------------------------- |
| `FilterSearch`               | `<div>`                         | Root flex container (16px gap, center-aligned)             |
| `FilterSearchActions`        | `<div>`                         | Right-aligned area for action buttons                      |
| `FilterSearchFilters`        | `Popover` + `Button` trigger    | The filter popover: fields + Reset/Cancel/Apply footer     |
| `FilterSearchAppliedFilters` | `<div>` with `Chip`s + `Button` | Removable applied-filter chips + a top-level Reset filters |

## Behavior at a glance

- Opening `FilterSearchFilters`'s popover snapshots `value` into an editable draft.
- **Apply** commits the draft → `onValueChange` (+ `onApply`) and closes.
  Disabled until the draft differs from the last-applied `value`.
- **Cancel**, outside-press, and **Escape** revert the draft and close.
- The footer's **Reset filters** clears the draft to empty (disabled when already empty).
- `FilterSearchAppliedFilters` renders nothing when `filters` is empty; its own
  **Reset filters** clears all filters immediately (no popover involved).

## Quick Examples

### React

```tsx
import {
  FilterSearch,
  FilterSearchActions,
  FilterSearchFilters,
  FilterSearchAppliedFilters,
  useFilterSearchFilters,
} from '@acronis-platform/ui-react';
import { Search, Button } from '@acronis-platform/ui-react';

function StatusField() {
  const { filters, setFilter } = useFilterSearchFilters();
  return (
    <InputSelect
      value={(filters.status as string) ?? null}
      onValueChange={(v) => setFilter('status', v)}
    >
      {/* … */}
    </InputSelect>
  );
}

function TableToolbar() {
  const [filters, setFilters] = React.useState<Record<string, unknown>>({});
  return (
    <div className="flex flex-col gap-3">
      <FilterSearch>
        <Search
          placeholder="Search table"
          aria-label="Search"
          className="w-56"
        />
        <FilterSearchFilters
          value={filters}
          onValueChange={setFilters}
          label="Table filters"
        >
          <StatusField />
        </FilterSearchFilters>
        <FilterSearchActions>
          <Button>Export</Button>
        </FilterSearchActions>
      </FilterSearch>
      <FilterSearchAppliedFilters
        filters={filters}
        onValueChange={setFilters}
      />
    </div>
  );
}
```

### With tenant switcher

```tsx
<FilterSearch>
  <Select defaultValue="all">
    <SelectTrigger className="w-56">
      <SelectValue placeholder="All customers" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All customers</SelectItem>
    </SelectContent>
  </Select>
  <Search placeholder="Search table" aria-label="Search" className="w-56" />
  <FilterSearchFilters value={filters} onValueChange={setFilters}>
    <StatusField />
  </FilterSearchFilters>
</FilterSearch>
```

## Spec Files

| File               | Contents                                                        |
| ------------------ | --------------------------------------------------------------- |
| `index.yaml`       | Identity, status, category, dependencies, Figma link            |
| `anatomy.yaml`     | Root, parts, layout, prop + internal states                     |
| `api.yaml`         | Framework-agnostic contract + framework adapters                |
| `tokens.yaml`      | Directly-referenced `--ui-*` token references                   |
| `behavior.md`      | Given/When/Then behavior scenarios                              |
| `accessibility.md` | ARIA guidance (delegated to child components; own popover a11y) |
