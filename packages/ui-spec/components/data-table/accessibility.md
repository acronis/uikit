# DataTable — accessibility

- Renders a real `<table>` via the Table primitives, so column headers and cells
  carry native table semantics for assistive tech.
- The sort control is a real `<button>` that toggles the sort on a single click
  (and Enter/Space); it carries an `aria-label` ("Sort by <title>", override via
  `sortLabel` to localize) and the sort
  direction is conveyed by the arrow icon alongside the always-rendered text title.
- Pagination controls are icon buttons with explicit labels ("Go to next page",
  etc.); the rows-per-page control is a labelled select.
- Selection checkboxes need an `aria-label` ("Select row" / "Select all") since
  they have no visible label in the cell.
- The view-options menu is keyboard-navigable (Base UI menu).
- `DataTableExpandTrigger` is a real `<button>` carrying `aria-expanded` and an
  "Expand row" / "Collapse row" label; it renders nothing for a row that can't
  expand.
- The column resize handle is a `role="separator"` with `aria-orientation`
  vertical and an "Resize column" label (override via `resizeColumnLabel`)
  (`enableColumnResizing`).
- **Row navigation uses a roving tabindex**: exactly one data row is a Tab stop
  (`tabIndex={0}`, the rest `-1`), and Arrow Up / Arrow Down move both DOM focus
  and which row that is. Focusing a row by click syncs the roving index too,
  so the last-interacted row stays the Tab stop. The index is clamped against the
  live row count, so filtering or paging to fewer rows can't leave it pointing
  past the end.
- The trailing action column's controls are labelled buttons: the header's
  column-visibility cog (`columnSettingsLabel`) and each row's overflow-actions
  ellipsis (`rowActionsLabel`), both overridable to localize.
- Each header cell's capability hint is a `Tooltip` on the cell itself, so it is
  announced on keyboard focus as well as hover; a column with no capability
  renders no tooltip.
- Per-column filter fields live in a keyboard-navigable `FilterSearchFilters`
  popover; each applied-filter chip below the toolbar removes its own filter.
- The infinite-scroll loading row (`paginationMode="infinite"`, `isLoadingMore`)
  carries `role="status"`/`aria-live="polite"` with an `sr-only` "Loading more
  rows…" text, so a screen-reader user is told a fetch is in flight without
  having to notice the animated placeholder.

## Known limitations

- **Column reordering (`enableColumnReordering`) is pointer-only.** It is native
  HTML5 drag-and-drop on the header cells, with no keyboard equivalent — a
  keyboard-only user cannot reorder columns. Resizing (arrow keys on the handle)
  and sorting (Enter/Space on the header button) are unaffected, and the reorder
  hint in the header tooltip describes a gesture only a pointer user can perform.
  Recorded here deliberately: closing the gap needs a designed keyboard model
  (e.g. a move-mode toggle plus arrow-key steps), not a spot fix.

## Contrast

DataTable composes already-themed components; their tokens meet contrast in light
and dark. The wrapper border (`--ui-border-on-surface-border`) and muted
empty-state / pagination text (`--ui-text-on-surface-secondary`) meet the
relevant contrast over the page surface.
