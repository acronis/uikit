# AccordionContainer — behavior

```gherkin
Scenario: Not collapsible
  Given an AccordionContainer with collapsible=false
  When it renders
  Then no Trigger renders
  And Content renders its children directly, with no panel wrapper
```

```gherkin
Scenario: Toggle (uncontrolled)
  Given a collapsible AccordionContainer with a Trigger and Content
  When the user activates the Trigger
  Then the Content panel animates open (and closed on the next activation)
  And the Trigger's chevron rotates 90° to reflect the open state
```

```gherkin
Scenario: Initially open (uncontrolled)
  Given collapsible is true and defaultOpen is set
  Then the panel renders open on mount
```

```gherkin
Scenario: Controlled
  Given collapsible is true, open is passed explicitly, and onOpenChange is provided
  When the user activates the Trigger
  Then AccordionContainer does not change its own open state
  And onOpenChange fires with the next open value
  And the panel only reflects the new state once the consumer updates `open`
```

```gherkin
Scenario: Render-prop children receive the open state
  Given a collapsible AccordionContainer whose children is a function
  When the panel's open state changes (controlled or uncontrolled)
  Then the function is called with the current { open } value
  And content outside Content (e.g. a header) can vary based on it
```
