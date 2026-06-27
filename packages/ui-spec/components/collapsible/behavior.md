# Collapsible — behavior

```gherkin
Scenario: Toggle
  Given a Collapsible with a trigger and content
  When the user activates the trigger
  Then the content panel animates open (and closed on the next activation)
```

```gherkin
Scenario: Initially open
  Given defaultOpen is set
  Then the panel renders open on mount
```
