---
'@acronis-platform/ui-react': minor
---

Extend the `Table` primitives with TanStack-independent parts and hooks:

- **`TablePagination`** — a plain-props twin of `DataTablePagination`
  (first/prev/next/last + rows-per-page select + page-count text) driven by
  `pageIndex`/`pageCount`/`pageSize`/`onPageIndexChange`/`onPageSizeChange`, with
  no `@tanstack/react-table` dependency.
- **`TableViewOptions`** — a router/grid-agnostic show/hide-columns dropdown
  driven by a plain `{ id, label, hidden }[]` + `onToggle(id)`.
- **`useSortState`** — headless client-side sort state for the primitives
  (default natural alphanumeric comparator, optional per-column custom
  comparator) wired to `TableHead`'s `sortable`/`sortDirection`/`onSort`.
- **`useTableUrlState`** — router-agnostic hook that syncs controlled table
  state (pagination/sorting/columnFilters) to and from the URL query string via
  `history.pushState`/`popstate`, with namespaced `tbl_*` keys, so a view is
  bookmarkable. Ships `parseTableUrlState`/`serializeTableUrlState` helpers.
- **`TableCell`/`TableHead` `wrap` prop** — swaps the fixed row height for
  `whitespace-normal`, letting a cell wrap onto multiple lines and the row grow
  to fit its content.

There is no Vue2 equivalent for the URL-bookmarkable state — this is
`ui-react`-only functionality.
