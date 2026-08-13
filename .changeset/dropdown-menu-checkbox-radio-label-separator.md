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
  Inherits full item styling (`indicatorItemClassName`) with `ps-8` inset for the
  icon gutter.
- **`DropdownMenuRadioGroup`** — bare alias for `MenuPrimitive.RadioGroup`; groups
  radio items so only one can be checked at a time.
- **`DropdownMenuRadioItem`** — wraps `MenuPrimitive.RadioItem`; renders a filled
  circle via `MenuPrimitive.RadioItemIndicator` when selected. Same inset
  treatment as `CheckboxItem`.
- **`DropdownMenuLabel`** — non-interactive `<div>` section label, styled with the
  `--ui-button-menu-dropdown-item-*` padding and label-color tokens. Accepts an
  `inset` prop (`ps-8`) to align with indented items.
- **`DropdownMenuSeparator`** — non-interactive `<div role="separator">` that
  draws a horizontal rule using the
  `--ui-button-menu-dropdown-section-container-border-*` tokens for height and
  color, with `my-[--ui-button-menu-dropdown-section-list-gap]` spacing.

All additions are backwards-compatible: no existing exports changed.
