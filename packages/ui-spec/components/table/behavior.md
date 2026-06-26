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
