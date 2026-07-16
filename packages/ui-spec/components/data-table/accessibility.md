# DataTable — accessibility

- Renders a real `<table>` via the Table primitives, so column headers and cells
  carry native table semantics for assistive tech.
- The sort control is a real `<button>` that toggles the sort on a single click
  (and Enter/Space); it carries an `aria-label` ("Sort by <title>") and the sort
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
  vertical and an "Resize column" label (`enableColumnResizing`).
- Per-column filter fields live in a keyboard-navigable `FilterSearchFilters`
  popover; each applied-filter chip below the toolbar removes its own filter.

## Contrast

DataTable composes already-themed components; their tokens meet contrast in light
and dark. The wrapper border (`--ui-border-on-surface-border`) and muted
empty-state / pagination text (`--ui-text-on-surface-secondary`) meet the
relevant contrast over the page surface.
