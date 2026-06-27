# Grid — behavior

```gherkin
Scenario: Responsive columns
  Given a Grid with cols={4}
  Then cells lay out in up to 4 columns at large widths, stepping down to fewer
  columns at smaller breakpoints
```

```gherkin
Scenario: Gap
  Given a gap value
  Then a consistent gap is applied between rows and columns
```
