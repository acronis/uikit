---
'@acronis-platform/ui-react': minor
---

feat(dropdown-menu): add `CheckboxItem`, `RadioGroup`, `RadioItem`, `Label`, `Separator`

Five components present in the shadcn/ui `DropdownMenu` convention were missing
from the DS, leaving callers that need checkbox or radio selections, section
labels, or explicit dividers with no DS-native option.

New exports:

- **`DropdownMenuCheckboxItem`** — wraps `MenuPrimitive.CheckboxItem`; renders a
  check icon via `MenuPrimitive.CheckboxItemIndicator` when the item is checked.
  Inherits full item styling, plus an in-flow leading indicator slot the same size
  as a menu-item icon, so its label sits on the item gap grid (container padding-x,
  then a 16px glyph, then the item gap) and the glyph centers on the label's first
  line.
- **`DropdownMenuRadioGroup`** — bare alias for `MenuPrimitive.RadioGroup`; groups
  radio items so only one can be checked at a time.
- **`DropdownMenuRadioItem`** — wraps `MenuPrimitive.RadioItem`; renders a filled
  circle via `MenuPrimitive.RadioItemIndicator` when selected. Same indicator slot
  as `CheckboxItem`.
- **`DropdownMenuLabel`** — non-interactive `<div>` section label, styled with the
  `--ui-button-menu-dropdown-item-*` padding and label-color tokens. Accepts an
  `inset` prop that indents it by the indicator slot to align with checkbox/radio
  item labels.
- **`DropdownMenuSeparator`** — non-interactive `<div role="separator">` that
  draws a horizontal rule using the
  `--ui-button-menu-dropdown-section-container-border-*` tokens for height and
  color, with `my-[--ui-button-menu-dropdown-section-list-gap]` spacing.

All additions are backwards-compatible: no existing exports changed.
