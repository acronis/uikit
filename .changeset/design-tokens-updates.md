---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
---

## design-tokens

### Added

| Token                                   | `$type`     |
| --------------------------------------- | ----------- |
| `units.gap.gap-6`                       | `dimension` |
| `units.size.size-96`                    | `dimension` |
| `font.letter-spacing.letter-spacing-03` | `dimension` |
| `font.letter-spacing.letter-spacing-1`  | `dimension` |

### Deleted

| Token                            | Was                                  |
| -------------------------------- | ------------------------------------ |
| `palette.transparent.inverted.6` | `{palette.grayscale.6}` (alpha 0.06) |
| `palette.transparent.inverted.8` | `{palette.grayscale.8}` (alpha 0.08) |

### Changed

| Token                                        | Change                                                              |
| -------------------------------------------- | ------------------------------------------------------------------- |
| `palette.grayscale.0`                        | `scopes`: `[ALL_SCOPES]` → `[]`; `hiddenFromPublishing`: `true`     |
| `palette.grayscale.14`                       | `scopes`: `[ALL_SCOPES]` → `[]`; `hiddenFromPublishing`: `true`     |
| `palette.transparent.clear`                  | `hiddenFromPublishing`: `true`; Figma export representation updated |
| `semantics.colors.border.onStatus.ai-strong` | `scopes`: `[ALL_SCOPES]` → `[]`                                     |
| `semantics.gradients.ai.active`              | `scopes`: `[ALL_SCOPES]` → `[]`                                     |
| `semantics.gradients.ai.disabled`            | `scopes`: `[ALL_SCOPES]` → `[]`                                     |
| `semantics.gradients.ai.hover`               | `scopes`: `[ALL_SCOPES]` → `[]`                                     |
| `semantics.gradients.ai.idle`                | `scopes`: `[ALL_SCOPES]` → `[]`                                     |

## components tier

### Added

New components with full token sets:

| Component        | Tokens | Notes                                                       |
| ---------------- | ------ | ----------------------------------------------------------- |
| `ButtonDropdown` | 32     | Primary / secondary variants, `_global` dimensions          |
| `InputSearch`    | 32     | Box, icon, label, placeholder, value, required slots        |
| `InputTextArea`  | 34     | Box, label, placeholder, value, description, required slots |
| `Radio`          | 33     | Checked / unchecked box, icon, label, description           |

New tokens on existing components:

| Token                                               | `$type`     |
| --------------------------------------------------- | ----------- |
| `InputText._global.placeholder.color.disabled`      | `color`     |
| `InputText._global.placeholder.color.hover`         | `color`     |
| `InputText.normal.description.color.disabled`       | `color`     |
| `InputText.normal.description.color.hover`          | `color`     |
| `SidebarSecondary._global.containerHeader.paddingX` | `dimension` |
| `SidebarSecondary._global.containerHeader.paddingY` | `dimension` |
| `SidebarSecondary.Section.containerHeader.gap`      | `dimension` |
| `SidebarSecondary.Section.containerHeader.minWidth` | `dimension` |
| `SidebarSecondary.Section.iconArrow.color`          | `color`     |

### Deleted

`SidebarSecondary` sidebar logic changed; the following tokens were removed as the hover/active states and layout structure were redesigned:

| Token                                                         | Was                                |
| ------------------------------------------------------------- | ---------------------------------- |
| `SidebarSecondary.MenuItem._global.icon.color.active`         | `{colors.glyph.onSurface.primary}` |
| `SidebarSecondary.MenuItem._global.icon.color.hover`          | `{colors.glyph.onSurface.primary}` |
| `SidebarSecondary.MenuItem._global.label.color.active`        | `{colors.text.onSurface.primary}`  |
| `SidebarSecondary.MenuItem._global.label.color.hover`         | `{colors.text.onSurface.primary}`  |
| `SidebarSecondary.MenuItem._global.level2.container.paddingL` | `{units.gap.40}`                   |
| `SidebarSecondary.Section.container.borderColor`              | `{colors.border.onSurface.border}` |
| `SidebarSecondary.Section.container.borderWidth`              | `{units.stroke.1}`                 |

## Migration

`palette.transparent.inverted.6` and `palette.transparent.inverted.8` have been removed.

If you reference `--ui-sidebar-secondary-*` CSS variables for `SidebarSecondary` `MenuItem` hover/active icon or label colors, or `Section` border color/width, update your usage — these tokens no longer exist.

`InputTextarea` is now named `InputTextArea` (capital A, matching Figma). Update any `--ui-input-text-area-*` CSS var references accordingly.
