# DataTable — behavior

DataTable renders a TanStack react-table over the Table primitives. The grid
state (sorting, filtering, visibility, selection, pagination, expansion) lives in
the component; the companion parts operate on a caller-built `table` instance.

```gherkin
Scenario: Render rows
  Given columns and data
  Then the headers and a row per datum render
```

```gherkin
Scenario: Empty
  Given an empty data array
  Then a single "No results." row spans all columns
```

```gherkin
Scenario: Sort a column
  Given a column whose header is a DataTableColumnHeader
  When the user opens its menu and chooses Asc or Desc
  Then the rows reorder and the header shows the sort direction
```

```gherkin
Scenario: Hide a column
  Given a sortable column header (or the view-options menu)
  When the user chooses Hide / unchecks the column
  Then that column is removed from the grid
```

```gherkin
Scenario: Filter via the toolbar
  Given a DataTableToolbar with searchKey="email"
  When the user types into the search box
  Then only rows whose email matches remain
  And a Reset button clears the filter
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
Scenario: Select rows
  Given a selection column with checkboxes
  When rows are checked
  Then they are tinted and the pagination shows "N of M row(s) selected"
```
