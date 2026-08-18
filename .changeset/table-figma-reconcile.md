---
'@acronis-platform/ui-react': patch
---

Reconcile `Table` with its Figma design and complete the Code Connect link.

- Header cells now theme every interaction state from
  `--ui-table-header-cell-color-{idle,hover,active}`; a sortable `<th>` tints
  the whole cell and owns the focus ring (in the `Table` primitives), rather
  than an inner button doing it. Data cells pick up `--ui-table-data-cell-color-idle`
  (previously unused); the `hover`/`active` pair of that same tier is consumed
  by `TableActionsCell` and `DataTableExpandTrigger` — plain `TableCell` still
  gets its hover tint from the row's `--ui-table-data-row-color-hover`.
- Replaced the hard-coded `h-10` row height with
  `--ui-table-global-cell-min-height`, added the missing header
  `--ui-table-global-cell-padding-y`, and drove the row divider from
  `--ui-table-global-row-border-{width,style}` instead of a literal `1px`.
- Added three structural cells the design documents but the library lacked:
  `TableSelectCell` (32px row-selection column, `header` prop for the
  select-all cell), `TableActionsCell` (48px trailing row-actions column) and
  `TableSettingsCell` (48px trailing header column for a column-settings
  trigger).
- `DataTableColumnHeader`: aligned the focus ring with the kit-wide 3px
  treatment, and made the sort toggle's accessible label localizable via a
  new `sortLabel` prop (was a hard-coded string). The pressed state itself is
  wired on the enclosing `<th>`/header cell, not on this button.
- `TableRow` now wires the keyboard focus state the design documents on the row
  itself (a full-row 3px ring). Rows aren't focusable by default, so this only
  paints once a consumer sets `tabIndex` on them. Header rows opt out of the
  row-level hover tint, since it doesn't apply to `<thead>`.
- `DataTableExpandTrigger` lives in a data cell, so it now tints from
  `--ui-table-data-cell-color-{hover,active}` instead of the header tier, uses
  the kit-wide 3px focus ring, and takes `expandLabel` / `collapseLabel` so its
  accessible name can be localized (was hard-coded).
- Localization: every string `TablePagination` / `DataTablePagination` rendered
  itself is now a prop with the English text as its default —
  `rowsPerPageLabel`, `firstPageLabel`, `previousPageLabel`, `nextPageLabel`,
  `lastPageLabel`, plus the `pageLabel` / `summaryLabel` formatters. `DataTable`
  gains `resizeColumnLabel` and `emptyLabel` for the same reason. Defaults
  reproduce the previous output exactly, so this is not a visual change. A
  custom `summaryLabel` is now also invoked when `selectedRows` is
  `undefined` (previously skipped in that case), per its existing tsdoc.
