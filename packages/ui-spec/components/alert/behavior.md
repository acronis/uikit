# Alert — behavior

```gherkin
Scenario: Announce a status
  Given an Alert with a title and description
  Then it renders with role="alert" so assistive tech announces it
```

```gherkin
Scenario: Severity variant
  Given variant="success" (or info / warning / critical / danger)
  Then the container border and the leading status line take that severity's color
  And the surface stays neutral, identical across every severity
  And AlertIcon renders that severity's own icon
```

```gherkin
Scenario: Override the status icon
  Given an AlertIcon with children
  Then the supplied glyph replaces the variant's default icon
```

```gherkin
Scenario: Title-only alert
  Given an AlertText containing only an AlertTitle
  Then the title's first line stays aligned with the status icon
```

```gherkin
Scenario: Actions below the text
  Given an AlertActions inside AlertContent, after AlertText
  Then the buttons flow below the description
  And the row wraps onto further lines when it runs out of width
```

```gherkin
Scenario: Dismiss
  Given an AlertClose with an onClick handler
  When the control is activated by pointer or keyboard
  Then the handler fires and the consumer removes the alert
  # The component never removes itself — visibility is the consumer's state.
```

```gherkin
Scenario: Not dismissable
  Given an Alert with no AlertClose
  Then no dismiss control renders and the content column takes that width
```

```gherkin
Scenario: Right-to-left
  Given dir="rtl" on an ancestor
  Then the status line sits on the right edge and the dismiss control on the left
  And the status icons are not mirrored (they are direction-agnostic)
```
