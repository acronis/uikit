# Label — behavior

Label is a caption for a form control. It has no internal state.

```gherkin
Scenario: Associating with a control
  Given a Label with htmlFor="email"
  And an input with id="email"
  When the user clicks the label
  Then focus moves to the input
```

```gherkin
Scenario: Disabled peer
  Given a disabled control marked with the `peer` class
  And a Label following it in the DOM
  Then the label dims (opacity 70) and shows a not-allowed cursor
```

```gherkin
Scenario: Custom styling
  Given a Label with a text-* className
  Then the className overrides the inherited text color
```
