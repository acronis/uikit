# Table — accessibility

Table renders native table semantics (`<table>`/`<thead>`/`<tbody>`/`<tr>`/
`<th>`/`<td>`/`<caption>`), so assistive tech announces rows, columns, and
headers natively. Use the parts as their elements intend.

## Roles & semantics

- The root is a native `<table>` (role `table`); `<th>` are column headers
  (role `columnheader`), `<td>` are cells (role `cell`).
- Provide a `TableCaption` (or an `aria-label`/`aria-labelledby` on the table)
  so the table has an accessible name.
- For row/column header association in complex tables, set `scope="col"` /
  `scope="row"` on the relevant `<th>` (passes through as a native attribute).

## Sorting

- A `sortable` `TableHead` sets **`aria-sort`** on the `<th>`: `none` when
  unsorted, `ascending` / `descending` when sorted — so screen readers announce
  the current sort.
- The sort affordance is a real **`<button>`**, so it is reachable by Tab and
  activates with **Enter / Space**; it shows a `--ui-focus-primary` focus ring.

## Selection

- Selection is expressed by rendering a `Checkbox` in a leading cell; label it
  (`aria-label`) and use an `aria-label="Select all"` checkbox in the header.
- A selected `TableRow` sets `data-state="selected"` for styling — pair it with
  the checkbox's checked state so the visual and programmatic states agree.

## Contrast

- Cell text uses `--ui-table-data-value-color-idle`, headers
  `--ui-table-header-label-color`, dividers `--ui-table-global-cell-border-color`;
  row hover/active use `--ui-table-global-row-color-{hover,active}`. These meet
  WCAG AA against the page surface in light and dark themes. Re-verify against
  the final palette once the design is confirmed ready for dev.
