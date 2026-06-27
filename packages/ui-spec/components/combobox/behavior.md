# Combobox — behavior

Combobox is built on Base UI's Combobox. The root holds the `items` and the
selected value and filters the items by the input text. The list children may be a
function `(item) => …` mapped over the filtered items.

```gherkin
Scenario: Open and list
  Given a Combobox with items
  When the user focuses the input (or clicks the chevron)
  Then the dropdown opens and lists the items as options
```

```gherkin
Scenario: Filter by typing
  Given the dropdown is open
  When the user types into the input
  Then only items matching the text remain
```

```gherkin
Scenario: Empty
  Given the typed text matches no items
  Then the ComboboxEmpty message is shown
```

```gherkin
Scenario: Select
  Given the dropdown is open
  When the user clicks an item (or presses Enter on the highlighted one)
  Then onValueChange fires with that item's value
  And the input shows the item's label and the dropdown closes
```

```gherkin
Scenario: Clear
  Given a clearable input with a value
  When the user activates the clear (✕) button
  Then the value is cleared
```
