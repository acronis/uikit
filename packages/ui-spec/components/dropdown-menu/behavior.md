# DropdownMenu — behavior

DropdownMenu shows a menu of actions anchored to a trigger. It owns the open
state (or the consumer controls it via `open`).

## Opening & closing

```gherkin
Scenario: The menu is non-modal by default
  Given a menu without an explicit modal setting
  When the menu opens
  Then page scrolling and interaction outside the menu remain available
```

```gherkin
Scenario: Opting into modal behavior
  Given a menu configured with modal=true
  When the menu opens
  Then page scrolling and interaction outside the menu are blocked
```

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
  And typing characters jumps to a matching item
```

```gherkin
Scenario: Explaining a disabled action
  Given an open menu with a disabled item and an explanatory tooltip
  When the pointer hovers its tooltip trigger or keyboard focus reaches it
  Then the tooltip opens
  And the item remains disabled and its action does not run
```

## Submenus

```gherkin
Scenario: Opening a submenu
  Given a DropdownMenuSubTrigger
  When the user highlights it (hover or ArrowRight)
  Then the submenu (data-[popup-open]) opens beside it
```
