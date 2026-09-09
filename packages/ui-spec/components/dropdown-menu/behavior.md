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
Scenario: Dismissing with Escape
  Given an open menu
  When the user presses Escape
  Then the menu closes and focus returns to the trigger
```

```gherkin
Scenario: Dismissing with an outside press
  Given an open menu
  When the user presses outside the popup
  Then the menu closes
  And focus returns to the trigger only if the press did not land on a
    focusable element — otherwise focus stays where the user put it
```

```gherkin
Scenario: The menu is non-modal
  Given an open menu
  Then the page behind it stays scrollable
  And content outside the popup stays interactive
  And a press on that content dismisses the menu (light dismiss)
```

## Keyboard

```gherkin
Scenario: Roving navigation and typeahead
  Given an open menu
  When the user presses Arrow keys
  Then highlight moves between items (data-[highlighted])
  And typing characters jumps to the matching item
```

## Submenus

```gherkin
Scenario: Opening a submenu
  Given a DropdownMenuSubTrigger
  When the user highlights it (hover or ArrowRight)
  Then the submenu (data-[popup-open]) opens beside it
```
