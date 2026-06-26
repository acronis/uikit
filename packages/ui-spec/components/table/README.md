# Table

Displays rows and columns of data. Composable from native table parts, with
sortable column headers and a selected row state.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `Table` and informed by the pre-release Table
> design (shadcn-uikit Figma, node 2948-2416). Themed by the existing
> `--ui-table-*` token tier. A **TanStack-backed `DataTable`** (sorting,
> selection, pagination over these primitives) is a planned follow-up — these
> parts are the presentational base it will compose. Reconcile with
> `/figma-component Table <url> --update` once the design is ready for dev.

## When to use

- Showing structured, comparable data in rows and columns (lists of workloads,
  invoices, devices, …).
- When you need sortable columns and/or row selection on top of native table
  semantics.

## When not to use

- For a full data grid with built-in sorting/filtering/pagination state — that's
  the planned `DataTable`; until then, wire TanStack (or your own logic) around
  these primitives.
- For non-tabular layout — use CSS grid/flex, not a table.

## Parts

| Part           | Element   | Purpose                                                 |
| -------------- | --------- | ------------------------------------------------------- |
| `Table`        | `table`   | The table, in a horizontally scrollable container.      |
| `TableHeader`  | `thead`   | Column-header section.                                  |
| `TableBody`    | `tbody`   | Data rows section.                                      |
| `TableFooter`  | `tfoot`   | Summary section with a top divider.                     |
| `TableRow`     | `tr`      | A row; `selected` applies the active state.             |
| `TableHead`    | `th`      | Column header; `sortable` + `sortDirection` + `onSort`. |
| `TableCell`    | `td`      | A data cell.                                            |
| `TableCaption` | `caption` | Optional caption below the table.                       |

## Examples

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Checkbox,
  Tag,
} from '@acronis-platform/ui-react';

// Sortable header (consumer owns the sort logic)
<TableHead sortable sortDirection={dir} onSort={() => setDir(next(dir))}>
  Name
</TableHead>

// Selectable row
<TableRow selected={checked}>
  <TableCell>
    <Checkbox checked={checked} onCheckedChange={setChecked} aria-label="Select row" />
  </TableCell>
  <TableCell>web-server-01</TableCell>
  <TableCell><Tag>Protected</Tag></TableCell>
</TableRow>;
```
