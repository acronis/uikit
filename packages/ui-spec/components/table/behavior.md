# Table — behavior

Table is a composable, presentational data grid. It holds no sorting or
selection _logic_ — the consumer owns that and drives the relevant props. The
scenarios below describe the affordances the parts provide.

## Sorting

```gherkin
Scenario: A sortable header exposes its state
  Given a TableHead with sortable = true and sort-direction = false
  Then it renders an inactive sort icon and aria-sort = "none"
```

```gherkin
Scenario: Activating a sortable header
  Given a sortable TableHead with an onSort handler
  When the user clicks it (or focuses it and presses Enter / Space)
  Then the sort event fires
  And the consumer updates sort-direction, which swaps the icon (↑ asc / ↓ desc)
  and sets aria-sort to "ascending" / "descending"
```

## Selection

```gherkin
Scenario: A selected row
  Given a TableRow with selected = true
  Then it carries data-state="selected" and the active row background token
```

```gherkin
Scenario: Row selection is consumer-driven
  Given a checkbox rendered inside a leading cell
  When the user toggles it
  Then the consumer updates the row's selected prop (Table does not manage it)
```

## Layout

```gherkin
Scenario: Overflow scrolls horizontally
  Given a table wider than its container
  When it renders
  Then the wrapping container scrolls horizontally, keeping the page intact
```

```gherkin
Scenario: Hover feedback
  Given a row in the body
  When the pointer is over it
  Then it takes the hover background token (unless selected, which wins)
```

```gherkin
Scenario: A wrapping cell grows the row
  Given a TableCell (or TableHead) with wrap = true holding multi-line content
  When it renders
  Then it uses whitespace-normal and drops the fixed row height
  And the row grows to fit the content instead of truncating it
```

## Pagination (TablePagination)

TablePagination is a controlled, TanStack-independent bar. It renders from plain
props and never holds page state itself.

```gherkin
Scenario: Page controls report the range
  Given a TablePagination with page-index, page-count, page-size
  Then it shows "Page {page-index + 1} of {page-count}"
  And first/prev are disabled on the first page, next/last on the last page
```

```gherkin
Scenario: Changing the page
  Given a TablePagination
  When the user clicks first / prev / next / last
  Then the page-index-change event fires with the target zero-based index
  When the user picks a rows-per-page option
  Then the page-size-change event fires with that size
```

```gherkin
Scenario: Selection summary
  Given a TablePagination with total-rows and selected-rows
  Then it shows "{selected-rows} of {total-rows} row(s) selected."
```

## View options (TableViewOptions)

```gherkin
Scenario: Toggling column visibility
  Given a TableViewOptions with a { id, label, hidden }[] of columns
  When the user toggles a column's checkbox in the dropdown
  Then the toggle event fires with that column's id
  And the consumer updates the column's hidden flag
```

## Headless state hooks

```gherkin
Scenario: useSortState drives a sortable header
  Given useSortState({ data })
  When a header calls toggleSort(columnId)
  Then the sort cycles none → asc → desc → none
  And sortedData reflects the current column + direction (alphanumeric by default)
  And getSortDirection(columnId) returns the value for TableHead's sort-direction
```

```gherkin
Scenario: useTableUrlState writes to the URL
  Given useTableUrlState()
  When the consumer advances the page via setPagination
  Then the namespaced tbl_page param is pushed onto the URL (history.pushState)
```

```gherkin
Scenario: useTableUrlState restores from the URL
  Given a URL that already carries tbl_page / tbl_sort params
  When the hook mounts
  Then it seeds its initial state from those params
  And a browser back/forward (popstate) re-syncs the state to the URL
```
