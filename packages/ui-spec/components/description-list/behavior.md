# DescriptionList — behavior

DescriptionList is presentational: it has no internal state. The value cell
adapts to whatever is composed into it.

```gherkin
Scenario: Plain key/value
  Given a DescriptionListItem with a label and a text value
  Then the row shows the label (left) and value (right), divided from the row above
```

```gherkin
Scenario: Status value
  Given a value with a leading status icon, a value, and a value-description
  Then the icon (status color) sits before the value, with the muted description below
```

```gherkin
Scenario: Action value
  Given a value containing a DescriptionListActions row of links
  Then the action links render in a wrapped row (e.g. "Action to fix" / "View alert")
```

```gherkin
Scenario: Full-bleed dividers
  Given items inside a padded card
  Then each row's top divider spans the full width while the content stays inset
```
