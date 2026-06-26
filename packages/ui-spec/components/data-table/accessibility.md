# DataTable — accessibility

- Renders a real `<table>` via the Table primitives, so column headers and cells
  carry native table semantics for assistive tech.
- Sort controls are real buttons inside a menu (DropdownMenu) with keyboard
  support; the sort direction is conveyed by the header icon — pair it with a
  text title (DataTableColumnHeader always renders the title).
- Pagination controls are icon buttons with explicit labels ("Go to next page",
  etc.); the rows-per-page control is a labelled select.
- Selection checkboxes need an `aria-label` ("Select row" / "Select all") since
  they have no visible label in the cell.
- The view-options and column menus are keyboard-navigable (Base UI menu).

## Contrast

DataTable composes already-themed components; their tokens meet contrast in light
and dark. The wrapper border (`--ui-border-on-surface-border`) and muted
empty-state / pagination text (`--ui-text-on-surface-secondary`) meet the
relevant contrast over the page surface.
