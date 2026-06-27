# Accordion — behavior

```gherkin
Scenario: Expand a section
  Given an Accordion with items
  When the user clicks a section's trigger
  Then its panel animates open and the chevron rotates
```

```gherkin
Scenario: Single (default)
  Given the default (single) mode
  When the user opens another section
  Then the previously open section closes
```

```gherkin
Scenario: Multiple
  Given multiple is set
  When the user opens several sections
  Then they all stay open until individually toggled
```

```gherkin
Scenario: Initially open
  Given defaultValue lists item value(s)
  Then those sections render open on mount
```
