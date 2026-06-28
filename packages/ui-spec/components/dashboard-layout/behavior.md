# DashboardLayout — behavior

```gherkin
Scenario: Widget grid
  Given a DashboardGrid with cols={3}
  Then widgets lay out in up to 3 columns at large widths, stepping down at smaller breakpoints
```

```gherkin
Scenario: Stacked sections
  Given a DashboardLayout with multiple grids/sections
  Then they stack with consistent vertical spacing
```
