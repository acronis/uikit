# Select — accessibility

Provided by the Base UI Select primitive; verify these hold after styling.

## Roles & ARIA

- The trigger has `role="combobox"` with `aria-haspopup="listbox"` and
  `aria-expanded` reflecting the open state.
- The popup has `role="listbox"` (with `aria-multiselectable` when `multiple`).
- Each option has `role="option"` with `aria-selected` reflecting selection;
  a disabled option exposes `aria-disabled`.
- A group uses `role="group"` labelled by its group label.
- Provide an accessible name for the trigger (`aria-label` or a visible label
  associated via `aria-labelledby`); the component ships no built-in label.
- A hidden form input carries `name`/`value` for form submission.

## Keyboard

| Key                                 | Action                                            |
| ----------------------------------- | ------------------------------------------------- |
| Space / Enter / ArrowDown / ArrowUp | Open the popup when the trigger is focused.       |
| ArrowUp / ArrowDown                 | Move the highlight between options while open.    |
| Home / End                          | Highlight the first / last option.                |
| Type-ahead                          | Jump to the option matching the typed characters. |
| Enter / Space                       | Select the highlighted option.                    |
| Escape                              | Close the popup without changing the selection.   |
| Tab                                 | Move focus out (closes the popup).                |

## Focus

- The trigger is the single tab stop. Opening moves focus into the list;
  closing returns focus to the trigger.
- Keyboard focus paints a 3px `--ui-focus-primary` ring on the trigger
  (`:focus-visible`), matching the Figma "Focused" state.

## Contrast

- Trigger value text, placeholder, border, and the chevron all resolve to
  `--ui-form-*` tokens that meet contrast in both light and dark themes.
- The disabled state uses the dedicated disabled tokens (not opacity), keeping
  text legible.
