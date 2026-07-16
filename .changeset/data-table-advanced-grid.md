---
'@acronis-platform/ui-react': minor
---

Extend `DataTable` with advanced grid features built on native TanStack APIs:

- **Column resizing** — opt in with `enableColumnResizing`; a drag handle renders at the trailing edge of each resizable header (`header.getResizeHandler()`). Optional `onColumnSizingChange` passthrough persists widths.
- **Sticky columns** — a `ColumnDef.meta.pin: 'left' | 'right'` flag drives TanStack's native column pinning (`column.pin()`), applying `position: sticky` with the computed offset and an opaque row-token background.
- **`DataTableExpandTrigger`** — a chevron toggle cell helper wired to `row.getCanExpand()` / `getIsExpanded()` / `toggleExpanded()`, so the expand affordance can live in a real column rather than only via a whole-row click.
- **Per-column filtering in `DataTableToolbar`** — the bare `InputText` filter is replaced by composition of `FilterSearchFilters` + `FilterSearchAppliedFilters`; pass filter-field children (keyed by column id via `useFilterSearchFilters`) and the toolbar wires them to the table's `columnFilters` state. The plain-text `searchKey` search remains a separate concern.

`DataTableViewOptions` is now a thin TanStack adapter over the primitive-only `TableViewOptions`.

**Migrating from Vue2 `table`**: column `sortable`/`sortBy`/`sortMethod` map to
`DataTable`'s TanStack `ColumnDef.enableSorting`/`sortingFn` (or `Table`'s new
`useSortState` hook for the primitives-only path). `resizable` →
`enableColumnResizing` (TanStack's native column-resizing; no more manual
`header-dragend` math). `fixed: true/'left'/'right'` → `ColumnDef.meta.pin`
(TanStack column pinning) instead of the old CSS/IE-polyfill approach. The
`type="expand"` column → `DataTableExpandTrigger` in a column `cell`.
Column-level filtering → filter-field children composed into
`DataTableToolbar` via `FilterSearchFilters`/`FilterSearchAppliedFilters`.
There is no Vue2 equivalent for the new URL-bookmarkable state (see the
companion `Table` primitives changeset) — this is `ui-react`-only
functionality with no migration mapping needed. `colReorderable` and
`rowGroups`/`<el-table-rows-group>` are **not covered by this release** —
they're scoped as separate follow-up tasks; when those ship, their own
changesets will carry the `colReorderable` → TanStack `columnOrder`-based
reordering and `rowGroups`/`getRowGroupData` → TanStack
`getGroupedRowModel`-based grouping migration notes.
