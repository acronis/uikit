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
Scenario: Skeleton rows
  Given skeleton is set
  Then skeletonRows placeholder rows (default 5) render instead of the data rows
  And each visible leaf column gets one cell per row holding the default
      Skeleton bar (my-1 h-4 w-full, so the row stays 40px)
  And the rows show no hover tint and are not focusable
  And each cell honors its column's meta.overflow mode
  And no infinite-scroll sentinel or loading-more row renders
```

```gherkin
Scenario: Custom skeleton cell content
  Given skeleton is set and renderSkeletonCell is provided
  Then renderSkeletonCell is called once per visible leaf column in each skeleton
      row, with { column, rowIndex } (rowIndex is 0-based)
  And columns hidden via columnVisibility are skipped
  And it is also called for the kit-rendered __actions column and a consumer-declared
      select column, so the caller branches on column.id
  And its return value replaces only the cell content — DataTable keeps the row
      (no hover tint, not focusable) and the cell (padding, borders, meta.overflow)
  When it returns null or undefined for a column
  Then that cell renders empty — the default Skeleton bar is not used as a fallback
  # Return the exported Skeleton to keep the default for a column. Content should
  # stay ~24px tall so the row stays 40px. Pinning/width styles are not applied
  # to skeleton cells.
```

```gherkin
Scenario: renderSkeletonCell without skeleton
  Given renderSkeletonCell is provided and skeleton is not set
  Then renderSkeletonCell is never called and the data rows render as usual
```

```gherkin
Scenario: Loading-more row is unaffected by renderSkeletonCell
  Given paginationMode="infinite", isLoadingMore is true, and renderSkeletonCell is provided
  And skeleton is not set (the loading-more row never renders while skeleton is set)
  Then the trailing loading-more row renders its own single spanning Skeleton
      (role="status", aria-live="polite", sr-only label)
  And renderSkeletonCell is not called for it
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
Scenario: Keyboard row navigation
  Given a DataTable with data rows
  Then exactly one data row is a Tab stop (roving tabindex)
  When the row itself has focus and the user presses Arrow Down / Arrow Up
  Then focus moves to the next / previous row and that row becomes the Tab stop
  When the row itself has focus, onRowActivate is set, and the user presses Enter
  Then the row is activated (see "Activate a row with Enter" below)
  # Keys pressed while a control inside a cell has focus are left to that control.
```

**Row click and activation.** `onRowClick` and `onRowActivate` are independent of each other and of
`highlightCurrentRow`. Both apply only to DataTable's own row rendering.

```gherkin
Scenario: Click a row
  Given onRowClick is set
  Then every data row shows a pointer cursor
  When the user clicks a data row once
  Then onRowClick is called with that row and the native click event
```

```gherkin
Scenario: Click on an interactive control inside a cell
  Given onRowClick is set
  And a cell renders a button, link, input, select, textarea, label,
      contenteditable element, an element with role button/checkbox/switch/menuitem/link,
      or any other Tab stop
  When the user clicks that control
  Then onRowClick is not called
```

```gherkin
Scenario: Click inside a portaled element opened from the row
  Given onRowClick is set and renderRowActions is provided
  When the user opens the row-actions menu and clicks one of its items
  Then onRowClick is not called
  # React events bubble through portals, so the click reaches the row even though
  # the menu's DOM node is outside it. DataTable ignores any click whose target
  # is not inside the row's DOM.
```

```gherkin
Scenario: Click that ends a text selection
  Given onRowClick is set
  When the user drags across cell text to select it and releases the pointer
  Then onRowClick is not called while the selection is non-empty
```

```gherkin
Scenario: Activate a row with Enter
  Given onRowActivate is set
  And the row itself has focus
  When the user presses Enter
  Then onRowActivate is called with that row and { via: 'keyboard', event }
  And the key's default action is prevented
```

```gherkin
Scenario: Enter from a control inside a cell
  Given onRowActivate is set
  And focus is on a control inside a cell (a button, checkbox, input, …)
  When the user presses Enter
  Then onRowActivate is not called — the control handles the key itself
```

```gherkin
Scenario: Held Enter
  Given onRowActivate is set and the row itself has focus
  When the user holds Enter down so the key repeats
  Then onRowActivate is called only for the first keydown — repeats are ignored
```

```gherkin
Scenario: Activate a row with a double-click
  Given onRowActivate is set
  When the user double-clicks a data row outside any interactive control
  Then onRowActivate is called with that row and { via: 'pointer', event }
  And the text-selection guard does not apply — the browser selects the word
      under the pointer on the second press, so a selection is always present
  But a double-click on an interactive control or a portaled element is ignored,
      as for onRowClick
```

```gherkin
Scenario: Double-click with onRowClick also set
  Given both onRowClick and onRowActivate are set
  When the user double-clicks a data row
  Then the browser dispatches two click events before the dblclick
  And the first click calls onRowClick
  And the second click normally does not, because the browser selected the word
      under the pointer and the text-selection guard skips it
  And then onRowActivate is called with { via: 'pointer' }
  # Don't wire navigation to onRowClick alongside onRowActivate: the first click
  # navigates before the double-click arrives.
```

```gherkin
Scenario: Space does not activate a row
  Given onRowActivate is set and the row itself has focus
  When the user presses Space
  Then onRowActivate is not called
  # Space is reserved for row selection when rowSelection is in use.
```

```gherkin
Scenario: Row callbacks with renderRow
  Given renderRow is provided
  And onRowClick and/or onRowActivate are set
  When the user clicks, double-clicks, or presses Enter on a row
  Then neither callback is called — the caller's renderRow owns that row's
      markup and handlers
```

```gherkin
Scenario: Row click with highlightCurrentRow
  Given highlightCurrentRow and onRowClick are both set
  When the user clicks a data row
  Then the row becomes the current (highlighted) row first
  And then onRowClick is called
  And a click on an interactive control inside a cell still highlights the row
      but does not call onRowClick
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
  Given the view-options menu opened from the trailing settings cog
  When the user unchecks the column
  Then that column is removed from the grid
```

```gherkin
Scenario: Search and group visible columns
  Given columns with meta.label and meta.category values
  When the user opens the trailing settings cog
  Then the visibility menu uses the metadata labels and groups matching categories
  When the user searches
  Then only matching column labels remain in the internally scrolling popup
```

```gherkin
Scenario: Reveal a category
  Given a category with multiple hidden columns
  When the user activates that category's Show all action
  Then every hidden column in that category becomes visible
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
  And the column header shows its active background until pointer release
```

```gherkin
Scenario: Reorder a column by dragging its header
  Given a DataTable with enableColumnReordering
  Then every non-pinned leaf header cell is draggable and shows the grab cursor
      (cursor-grab; cursor-grabbing while pressed)
  And group-label header cells (those spanning multiple leaf columns) are not draggable
  When the user starts dragging a header
  Then the dragged header cell is not dimmed — the browser's native drag image is the feedback
  And during a column reorder drag, each header cell the drag passes over (dragover) gets a data-reorder-target attribute
      (a foreign drag — files, text, another table's header — never sets it)
  And no kit style is attached to data-reorder-target yet (the indicator look is pending design)
  When the reorder drag ends, by a drop or by dragend without a drop
  Then data-reorder-target is removed from every header cell
  When the user drags one header and drops it on another
  Then the dragged column moves to the drop target's position (headers and body cells alike)
  And onColumnOrderChange fires with the new order so a consumer can persist it
  And a pinned column is never draggable — it is anchored to a table edge
  # Pointer-only: there is no keyboard equivalent for the gesture yet.
```

```gherkin
Scenario: Grouped column headers render with correct colSpan
  Given columns defined with TanStack header groups (parent columns with leaf columns nested under them)
  Then each group-label header cell spans its sub-columns (colSpan = number of leaf children)
  And TanStack placeholder cells render as empty <th> elements with no visible content
```

```gherkin
Scenario: Group header cells are non-interactive
  Given a DataTable with enableColumnReordering, enableColumnResizing, and sortable columns
  And columns are arranged in header groups (parent columns spanning multiple leaf columns)
  Then group-label header cells are not draggable and have no grab cursor
  And group-label header cells have no resize handle
  And group-label header cells are not clickable for sorting
  And group-label header cells show no hover tint and no capability tooltip
  And the column-visibility cog appears only in the leaf-column header row, not in group-label rows
  And its menu still lists every hideable leaf column, including leaves nested inside a group
      (never the group labels themselves)
```

```gherkin
Scenario: Column reordering is blocked across header groups
  Given a DataTable with enableColumnReordering and columns in two or more header groups
  When the user drags a leaf column from group A over a leaf column from group B
  Then the drop cursor shows "none" (no-drop)
  And releasing the mouse does not change the column order
  When the user drags a leaf column within the same group
  Then the drop succeeds and the column moves to the drop target's position
  And leaf columns that have no parent group can be freely reordered among each other
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
Scenario: Wrapping column
  Given a column with meta.overflow = 'wrap'
  Then that column's header and cells receive overflow="wrap" and use whitespace-normal
  And their content wraps onto multiple lines
  And the row grows to fit the content
```

```gherkin
Scenario: Clipped column
  Given a column with meta.overflow = 'hidden'
  And the column has a CSS width (size on the column definition, or column resizing)
  Then that column's header and cells receive overflow="hidden"
  And they apply max-w-0 overflow-hidden whitespace-nowrap
  And content is clipped at the column's CSS width
  And ellipsis and tooltip are the inner component's responsibility (the column's cell render)
  # Without a width source, max-w-0 collapses the column — size is required.
```

```gherkin
Scenario: Default column (meta.overflow unset)
  Given a column with no meta.overflow
  Then its header and cells receive no overflow class
  And the browser default (wrapping) applies
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
