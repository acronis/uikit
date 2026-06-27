# Field — behavior

Field is built on Base UI's Field primitive. It wires a control to its label,
description, and error automatically, and pairs with the _bare_ controls
(`InputBox`, plus the self-labeling `Checkbox` / `Switch` / `RadioGroup` for
grouping) — not the self-contained `InputText` / `InputSearch` fields.

```gherkin
Scenario: Label associates with the control
  Given a Field with a FieldLabel and a FieldControl render={<InputBox />}
  Then the label's htmlFor matches the control's id (no manual wiring)
  And clicking the label focuses the control
```

```gherkin
Scenario: Description is announced
  Given a Field with a FieldDescription
  Then the control's aria-describedby references the description
```

```gherkin
Scenario: Error on invalid
  Given a Field marked invalid (or failing validation)
  Then data-invalid is set, the control gets aria-invalid
  And a FieldError message is shown (always, when match is forced on)
```

```gherkin
Scenario: Orientation
  Given orientation="horizontal"
  Then the label and control lay out in a row
  And orientation="responsive" stacks until the @md container width, then rows
```

```gherkin
Scenario: Group related fields
  Given a FieldSet with a FieldLegend and a FieldGroup of fields
  Then the legend names the group and the fields stack with consistent spacing
```

```gherkin
Scenario: Group self-labeling controls
  Given a FieldSet of Checkboxes that each carry their own label
  Then the set provides the legend + spacing and each control names itself
```

```gherkin
Scenario: Separate fields
  Given a FieldSeparator with text between two fields
  Then a divider renders with the text centered over the rule
```
