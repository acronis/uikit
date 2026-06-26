# DropdownMenu — accessibility

DropdownMenu leans on the Base UI Menu primitive for the WAI-ARIA menu pattern:
roles, roving focus, typeahead, and dismissal.

## Roles & semantics

- The trigger exposes `aria-haspopup="menu"` and `aria-expanded`; the popup has
  `role="menu"`.
- Items are `role="menuitem"`; checkbox items `role="menuitemcheckbox"` with
  `aria-checked`; radio items `role="menuitemradio"` with `aria-checked`.
- Separators are `role="separator"`. A label is a non-interactive heading; the
  shortcut hint is decorative text inside its item.

## Keyboard

- **Enter / Space / Arrow Down** on the trigger opens the menu and moves focus
  to the first item.
- **Arrow Up / Down** move the highlight (roving); **Home / End** jump to
  first / last; **typeahead** jumps to a matching item.
- **Arrow Right** opens a submenu from its trigger; **Arrow Left** / **Escape**
  closes it (Escape closes the whole menu from the root and returns focus to the
  trigger).
- **Enter / Space** activates the highlighted item.

## Screen reader

- Opening announces the menu and its first item ("Profile, menu item 1 of 4").
- Checkbox / radio items announce their checked state; toggling re-announces it.

## Contrast

- The popup uses `--ui-text-on-surface-primary` on
  `--ui-background-surface-primary` with a `--ui-border-on-surface-border` border;
  the highlighted item uses `--ui-background-surface-hover`; shortcuts use
  `--ui-text-on-surface-secondary` — all meeting WCAG AA in light and dark.
  Re-verify against the final palette once a `--ui-menu-*` tier and Figma
  reference exist.
