# DataTable — behavior

DataTable renders a TanStack react-table over the Table primitives. By default
the grid state (sorting, filtering, visibility, selection, pagination,
expansion) lives in the component; the companion parts operate on a
caller-built `table` instance. DataTable can also render from a caller-built
`table` instance itself (see "Render from an external table instance" below),
in which case it owns none of that state.

```gherkin
Scenario: Render rows
  Given columns and data
  Then the headers and a row per datum render
```

```gherkin
Scenario: Empty
  Given an empty data array
  Then a single "No results." row spans only the visible columns
```

```gherkin
Scenario: Custom empty state
  Given renderEmptyState is provided
  When there are no rows to render
  Then renderEmptyState is called with hasFilters (whether a column filter is applied)
  And its return value replaces the default "No results." row
```

```gherkin
Scenario: Render from an external table instance
  Given a `table` instance built by the caller with useReactTable
  When it is passed to DataTable's `table` prop
  Then DataTable renders from that instance and owns no state of its own
  And columnVisibility/onColumnVisibilityChange, onColumnSizingChange,
      enableColumnResizing, getRowCanExpand, manualSorting, sorting,
      onSortingChange, and paginationMode-related props are no-ops
  And DataTable does not drive column pinning from meta.pin on that instance —
      the caller pins/unpins its own columns via TanStack's column.pin()
```

```gherkin
Scenario: Manual (server-side) sorting
  Given manualSorting and controlled sorting/onSortingChange
  When the user clicks a DataTableColumnHeader
  Then onSortingChange fires with the next sort
  And DataTable does not reorder the rows itself (no client-side comparator runs)
```

```gherkin
Scenario: Custom row rendering
  Given renderRow is provided
  Then each row is rendered by calling renderRow(row, rowIndex)
  And DataTable's own per-cell flexRender/pinning/styling path is skipped for that row
  And no expanded-content row is appended even if getRowCanExpand returns true for it —
      the caller must read row.getIsExpanded() and render it themselves inside renderRow
```

```gherkin
Scenario: Infinite scroll
  Given paginationMode="infinite" and hasNextPage is true
  And at least one row is already rendered
  Then a sentinel row renders as the last row of the body
  When the sentinel scrolls into view and isLoadingMore is false
  Then onLoadMore fires
  And no further onLoadMore calls fire while isLoadingMore is true
  When isLoadingMore is true
  Then a trailing loading row renders below the sentinel
```

```gherkin
Scenario: Infinite scroll cannot drive the very first fetch
  Given paginationMode="infinite", data=[], and hasNextPage is true
  Then no sentinel renders (rows.length is 0) — the default "No results." row renders instead
  And onLoadMore never fires
  # The caller must seed the first page itself (e.g. on mount); the sentinel
  # only drives subsequent pages once at least one row exists.
```

```gherkin
Scenario: Prefetching ahead of the literal scroll position
  Given paginationMode="infinite" and loadMoreRootMargin="400px"
  Then the sentinel's IntersectionObserver root margin is expanded by that amount
  And onLoadMore can fire before the sentinel is literally visible in the viewport
  # How far ahead this effectively prefetches also depends on page size — a
  # large margin with small pages can trigger several onLoadMore calls
  # back-to-back as the user scrolls normally; that is expected.
```

```gherkin
Scenario: Sort a column in a single click
  Given a column whose header is a DataTableColumnHeader
  And the column is unsorted (a muted up/down arrow)
  When the user clicks the header once
  Then the rows reorder ascending and the header shows an up arrow in the active blue
  When the user clicks the header again
  Then the rows reorder descending and the header shows a down arrow in the active blue
```

```gherkin
Scenario: Hide a column
  Given the toolbar's view-options menu
  When the user unchecks the column
  Then that column is removed from the grid
```

```gherkin
Scenario: Filter via the toolbar
  Given a DataTableToolbar with searchKey="email"
  When the user types into the search box
  Then only rows whose email matches remain
  And a Reset button clears the filter (when no filter fields are provided)
```

```gherkin
Scenario: Per-column filtering
  Given a DataTableToolbar given filter-field children
  And each field is wired to a column via useFilterSearchFilters() by column id
  When the user sets a field in the filters popover
  Then that column's filter is committed to the table (the text searchKey is preserved)
  And an applied-filter chip appears in the row below the toolbar
  When the user removes the chip
  Then that column's filter clears
```

```gherkin
Scenario: Paginate
  Given a DataTablePagination bound to the table
  When the user clicks next / prev / first / last
  Then the visible page of rows changes
  And the rows-per-page select changes the page size
```

```gherkin
Scenario: Expand a row
  Given getRowCanExpand returns true and renderExpandedRow is provided
  When a row is toggled expanded
  Then a detail row renders beneath it spanning all columns
```

```gherkin
Scenario: Expand from a column trigger
  Given a column whose cell renders a DataTableExpandTrigger
  And getRowCanExpand returns true and renderExpandedRow is provided
  When the user clicks the chevron trigger in that cell
  Then the row toggles expanded (aria-expanded flips) and the detail row renders
  And the trigger renders nothing for a row that can't expand
```

```gherkin
Scenario: Resize a column
  Given a DataTable with enableColumnResizing
  When the user drags the handle at a header's trailing edge
  Then that column's width changes live (columnResizeMode: "onChange")
  And onColumnSizingChange fires so a consumer can persist the widths
```

```gherkin
Scenario: Reorder a column by dragging its header
  Given a DataTable with enableColumnReordering
  Then every non-pinned header cell is draggable and shows the grab cursor
      (--ui-draggable-cursor; --ui-draggable-cursor-active while pressed)
  When the user drags one header and drops it on another
  Then the dragged column moves to the drop target's position (headers and body cells alike)
  And onColumnOrderChange fires with the new order so a consumer can persist it
  And a pinned column is never draggable — it is anchored to a table edge
  # Pointer-only: there is no keyboard equivalent for the gesture yet.
```

```gherkin
Scenario: Row actions vs. bulk actions — the selection threshold
  Given a table with a selection column, per-row TableActionsCell actions, and a
      DataTableBulkActionsBar over the same table instance
  When nothing is selected
  Then every row shows its own actions
  And the bulk-actions bar is mounted in its idle state — the bulk actions are
      disabled (a native <fieldset disabled>) and the trailing side shows
      `loadedLabel` instead of a selection summary
  When exactly one row is selected
  Then the bulk scope is active: the bar's actions enable and its trailing side
      shows the selection summary plus the clear control
  And the per-row actions are suppressed on every row — the cell keeps its 48px
      column but renders no trigger and no hover/press tint
  When further rows are selected, or the header select-all checkbox is checked
  Then nothing changes but the count in the selection summary
  # One predicate owns this: isBulkSelectionActive(table) = one or more rows
  # selected. TableActionsCell takes it as its `bulkSelectionActive` prop; the bar
  # derives it internally. Consumers do not re-derive the threshold.
  # The bar is always mounted — it never renders nothing, it only switches state.
```

```gherkin
Scenario: Sticky (pinned) columns
  Given columns with meta.pin = "left" and/or "right"
  When the grid scrolls horizontally
  Then the pinned columns stay fixed at their edges (position: sticky)
  And their cells keep an opaque row background so scrolled cells don't show through
```

```gherkin
Scenario: Wrapping columns
  Given a column with meta.wrap = true
  Then that column's header and cell content wrap onto multiple lines instead of truncating
```

```gherkin
Scenario: Select rows
  Given a selection column with checkboxes
  When rows are checked
  Then they are tinted and the pagination shows "N of M row(s) selected"
```

```gherkin
Scenario: Selection counts under an active filter — two deliberate scopes
  Given rows are selected and a column filter is then applied that hides some of them
  Then DataTableBulkActionsBar's selection summary still counts the *whole*
      selection, filtered-out rows included (table.getSelectedRowModel())
  And isBulkSelectionActive(table) reads that same unfiltered selection, so the
      per-row actions stay suppressed even if every selected row is filtered out of view
  But DataTablePagination's summary counts only the *currently filtered*
      selection (table.getFilteredSelectedRowModel())
  So the two counts can legitimately disagree while a filter is active
  # By design, not a bug: a bulk action applies to everything the user has
  # selected, not just to what the current filter leaves visible, while the
  # pagination summary describes the page/filter the user is looking at.
```
