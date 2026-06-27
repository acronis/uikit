# PageHeader — behavior

```gherkin
Scenario: Title + actions
  Given a PageHeader with a PageHeaderRow of a title and actions
  Then the title sits at the left and the actions at the right edge
```

```gherkin
Scenario: Breadcrumb + description
  Given a PageHeaderBreadcrumb above and a PageHeaderDescription below the title row
  Then the breadcrumb renders above the title and the muted description below
```
