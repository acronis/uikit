# Table

Displays rows and columns of data. Composable from native table parts, with
sortable column headers, a selected row state, wrappable cells, and — as
TanStack-independent companions — a pagination bar and a show/hide-columns
menu. Two headless hooks (`useSortState`, `useTableUrlState`) supply optional
sort and URL-synced state.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `Table` and informed by the pre-release Table
> design (shadcn-uikit Figma, node 2948-2416). Themed by the existing
> `--ui-table-*` token tier. The TanStack-backed **`DataTable`** (sorting,
> selection, pagination over these primitives) now ships alongside — also draft
> — and composes these parts. Reconcile with
> `/figma-component Table <url> --update` once the design is ready for dev.

## When to use

- Showing structured, comparable data in rows and columns (lists of workloads,
  invoices, devices, …).
- When you need sortable columns and/or row selection on top of native table
  semantics.
- When you want the pagination bar or the show/hide-columns menu without pulling
  in `@tanstack/react-table` — pair the parts with your own or the
  `useSortState` / `useTableUrlState` hooks.

## When not to use

- For a full data grid whose state (sorting/filtering/pagination/selection/
  column resizing/sticky columns) is managed for you — use the `DataTable`,
  which composes these primitives.
- For non-tabular layout — use CSS grid/flex, not a table.

## Parts

| Part               | Element   | Purpose                                                         |
| ------------------ | --------- | --------------------------------------------------------------- |
| `Table`            | `table`   | The table, in a horizontally scrollable container.              |
| `TableHeader`      | `thead`   | Column-header section.                                          |
| `TableBody`        | `tbody`   | Data rows section.                                              |
| `TableFooter`      | `tfoot`   | Summary section with a top divider.                             |
| `TableRow`         | `tr`      | A row; `selected` applies the active state.                     |
| `TableHead`        | `th`      | Column header; `sortable` + `sortDirection` + `onSort`; `wrap`. |
| `TableCell`        | `td`      | A data cell; `wrap` lets it grow to fit multi-line content.     |
| `TableCaption`     | `caption` | Optional caption below the table.                               |
| `TablePagination`  | `div`     | Plain-prop pagination bar (no TanStack dependency).             |
| `TableViewOptions` | `div`     | Show/hide-columns dropdown driven by a plain columns array.     |

## Hooks

Headless helpers for the `Table` primitives — no TanStack dependency, no visual
output. They drive the parts' props and own the state.

| Hook               | Purpose                                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useSortState`     | Client-side single-column sort. Returns `sortedData` + `getSortDirection` / `toggleSort` shaped for `TableHead`.                                                    |
| `useTableUrlState` | Syncs pagination / sorting / column-filter state to and from the URL query string (namespaced `tbl_*` keys) via `history.pushState` + `popstate` — router-agnostic. |

## Examples

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
  Checkbox,
  Tag,
} from '@acronis-platform/ui-react';
import { useSortState } from '@acronis-platform/ui-react'; // headless hook

// Sortable header driven by the headless sort hook
const { sortedData, getSortDirection, toggleSort } = useSortState({ data });

<TableHead
  sortable
  sortDirection={getSortDirection('name')}
  onSort={() => toggleSort('name')}
>
  Name
</TableHead>

// Wrappable cell — grows to fit multi-line content instead of truncating
<TableCell wrap>{longDescription}</TableCell>

// Selectable row
<TableRow selected={checked}>
  <TableCell>
    <Checkbox checked={checked} onCheckedChange={setChecked} aria-label="Select row" />
  </TableCell>
  <TableCell>web-server-01</TableCell>
  <TableCell><Tag>Protected</Tag></TableCell>
</TableRow>

// Pagination bar — plain props, no TanStack
<TablePagination
  pageIndex={pageIndex}
  pageCount={pageCount}
  pageSize={pageSize}
  totalRows={rows.length}
  onPageIndexChange={setPageIndex}
  onPageSizeChange={setPageSize}
/>;
```
