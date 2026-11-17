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

```gherkin
Scenario: Staying visible in a resolved portal container
  Given a dropdown in a resolved portal-container inside a scrolling,
    overflow-clipped panel
  When the panel scrolls while the dropdown is open
  Then fixed positioning keeps the dropdown visible and aligned to the input
```

```gherkin
Scenario: Keeping the platform default without a resolved target
  Given no portal-container prop and no PortalContainerProvider
  When the dropdown opens in its default portal
  Then it uses the platform default positioning
```
