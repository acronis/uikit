# Pagination — behavior

Pagination is presentational — it renders the controls; the caller wires
navigation (`href` or `onClick`) and decides which page is active.

```gherkin
Scenario: Mark the current page
  Given a PaginationLink with isActive
  Then it shows aria-current="page" and the selected treatment
```

```gherkin
Scenario: Previous / next
  Given PaginationPrevious / PaginationNext
  Then they render labelled chevron controls the caller wires to navigate
```

```gherkin
Scenario: Skipped range
  Given a gap between page ranges
  Then a PaginationEllipsis stands in for the skipped pages
```
