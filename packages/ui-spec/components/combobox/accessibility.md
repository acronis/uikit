# Combobox — accessibility

- Built on Base UI's Combobox, which implements the WAI-ARIA combobox pattern:
  the input has `role="combobox"` with `aria-expanded` / `aria-controls`, the list
  is a `listbox`, and items are `option`s. Keyboard support (↑/↓ to move, Enter to
  select, Esc to close, typeahead) and focus management come from the primitive.
- Pair the field with a label — wrap it in a `Field` with a `FieldLabel`, or set
  `aria-label` on the `ComboboxInput`.
- The clear and chevron controls have accessible labels ("Clear" / "Toggle").
- Don't rely on the highlight color alone — the selected item also shows a check.

## Contrast

Combobox reuses the `--ui-input-select-*` tokens, which meet contrast in light and
dark for the field box, dropdown surface, item text, and the highlighted/selected
item backgrounds.
