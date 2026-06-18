---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
---

## design-tokens

### Added

| Token                              | $type        | Notes                                                          |
| ---------------------------------- | ------------ | -------------------------------------------------------------- |
| `typography.headings.title-accent` | `typography` | Inter Semi Bold 24px / 32px line-height (new Figma text style) |

### Changed

| Token                          | Change                                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `font.letter-spacing.0-3`      | Added `$extensions.com.figma.variableId` (`VariableID:1727:2408`) and `com.figma.scopes` — no value change (0.3 px) |
| `font.letter-spacing.1`        | Added `$extensions.com.figma.variableId` (`VariableID:1727:2410`) and `com.figma.scopes` — no value change (1 px)   |
| `colors.focus.brand`           | `com.figma.scopes`: removed `EFFECT_COLOR`                                                                          |
| `colors.focus.error`           | `com.figma.scopes`: removed `EFFECT_COLOR`                                                                          |
| `colors.focus.primary`         | `com.figma.scopes`: removed `EFFECT_COLOR`                                                                          |
| `colors.focus.secondary`       | `com.figma.scopes`: removed `EFFECT_COLOR`                                                                          |
| `colors.glyph.onSurface.brand` | `com.figma.scopes`: `ALL_SCOPES` → `[SHAPE_FILL, STROKE_COLOR]`                                                     |

## components

### Added

**InputSelect** (81 tokens — new component)

| Group                           | Tokens | $type(s)                           |
| ------------------------------- | ------ | ---------------------------------- |
| `InputSelect._global.*`         | 25     | `color`, `dimension`, `typography` |
| `InputSelect.Dropdown.*`        | 17     | `color`, `dimension`, `typography` |
| `InputSelect.DropdownItem.*`    | 14     | `color`, `dimension`               |
| `InputSelect.DropdownSection.*` | 8      | `color`, `dimension`, `typography` |
| `InputSelect.error.*`           | 7      | `color`, `typography`              |
| `InputSelect.normal.*`          | 10     | `color`, `typography`              |

**InputDatePicker** (49 tokens — new component)

| Group                       | Tokens | $type(s)                           |
| --------------------------- | ------ | ---------------------------------- |
| `InputDatePicker._global.*` | 31     | `color`, `dimension`, `typography` |
| `InputDatePicker.error.*`   | 9      | `color`, `typography`              |
| `InputDatePicker.normal.*`  | 9      | `color`, `typography`              |

**ButtonMenu sub-groups** (25 new tokens added to existing component)

| Group                          | Tokens |
| ------------------------------ | ------ |
| `ButtonMenu.Dropdown.*`        | 7      |
| `ButtonMenu.DropdownExtras.*`  | 3      |
| `ButtonMenu.DropdownItem.*`    | 10     |
| `ButtonMenu.DropdownSection.*` | 5      |

### Renamed

| Was                            | Now            | Notes                                                                   |
| ------------------------------ | -------------- | ----------------------------------------------------------------------- |
| `ButtonDropdown.*` (32 tokens) | `ButtonMenu.*` | All values and aliases unchanged — top-level key renamed to match Figma |

## Migration

If you reference `--ui-ButtonDropdown-*` CSS custom properties, rename them to `--ui-ButtonMenu-*`. Token values and aliases are identical.
