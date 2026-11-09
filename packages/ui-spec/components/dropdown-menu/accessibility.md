# DropdownMenu — accessibility

DropdownMenu leans on the Base UI Menu primitive for the WAI-ARIA menu pattern:
roles, roving focus, typeahead, and dismissal.

## Roles & semantics

- The trigger exposes `aria-haspopup="menu"` and `aria-expanded`; the popup has
  `role="menu"`.
- Items are `role="menuitem"`. The shortcut hint is decorative text inside its
  item. Groups (`DropdownMenuGroup`) visually section items; non-first groups
  render a top-border separator.
- Disabled items expose `aria-disabled="true"`, remain in keyboard menu
  navigation, and cannot be activated.
- To explain a disabled action, prefer attaching the tooltip trigger to the
  disabled menu item itself. This keeps the menu item as the single keyboard
  focus target instead of adding another interactive control inside a menu item.
- A tooltip is supplemental visual information. Keep the disabled reason in the
  trigger's accessible name or description as well.

## Keyboard

- **Enter / Space / Arrow Down** on the trigger opens the menu and moves focus
  to the first item.
- **Arrow Up / Down** move the highlight (roving); **Home / End** jump to
  first / last; **typeahead** jumps to a matching item.
- **Arrow Right** opens a submenu from its trigger; **Arrow Left / Escape**
  closes it (Escape closes the whole menu from the root and returns focus to the
  trigger).
- **Enter / Space** activates the highlighted enabled item. A disabled item
  stays focusable but its action does not run.
- If the tooltip trigger is the disabled menu item, keyboard navigation focuses
  the trigger and opens the tooltip.
- **Focus ring** (`--ui-focus-primary`, 3px inset) appears only on keyboard
  navigation (`focus-visible:not(:hover)`), not on pointer interaction.

## Screen reader

- Opening announces the menu and its first item ("Profile, menu item 1 of 4").
- The disabled reason is available in the menu item's accessible name or
  description; the visual tooltip supplements that text.

## Contrast

- The popup uses `--ui-button-menu-dropdown-item-label-color` on
  `--ui-button-menu-dropdown-container-color` with a
  `--ui-button-menu-dropdown-container-border-color` border; the highlighted
  item uses `--ui-button-menu-dropdown-item-container-color-hover`; shortcuts
  use `--ui-button-menu-dropdown-extras-shortcut-label-color` — all meeting
  WCAG AA in light and dark.
