# DropdownMenu — behavior

DropdownMenu shows a menu of actions anchored to a trigger. It owns the open
state (or the consumer controls it via `open`).

## Opening & closing

```gherkin
Scenario: Opening from the trigger
  Given a closed menu
  When the user activates the trigger (click / Enter / Space / Arrow)
  Then the popup opens, focus moves into it, and open-change(true) fires
```

```gherkin
Scenario: Selecting an item closes the menu
  Given an open menu
  When the user activates an item
  Then the item's action runs and the menu closes (open-change(false))
```

```gherkin
Scenario: Dismissing
  Given an open menu
  When the user presses Escape or presses outside the popup
  Then the menu closes and focus returns to the trigger
```

## Keyboard

```gherkin
Scenario: Roving navigation and typeahead
  Given an open menu
  When the user presses Arrow keys
  Then highlight moves between items (data-[highlighted])
  And typing characters jumps to the matching item
```

## Checkbox & radio items

```gherkin
Scenario: Toggling a checkbox item
  Given a DropdownMenuCheckboxItem with checked = false
  When the user activates it
  Then it toggles and checked-change(true) fires (consumer owns the value)
```

```gherkin
Scenario: Choosing a radio item
  Given a DropdownMenuRadioGroup with a value
  When the user activates a different radio item
  Then value-change fires with that item's value
```

## Submenus

```gherkin
Scenario: Opening a submenu
  Given a DropdownMenuSubTrigger
  When the user highlights it (hover or ArrowRight)
  Then the submenu (data-[popup-open]) opens beside it
```
