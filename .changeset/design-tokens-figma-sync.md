---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
'@acronis-platform/ui-react': patch
---

Sync design tokens with Figma.

Adds `red_home_pl` brand primitives (8 new ButtonPrimary/SidebarPrimary tokens), `units.size.76` and `units.size.320`, and 6 new semantic tokens (`colors.glyph.onStatusStrong.primary`, `colors.glyph.onSurface.neutral-dark`, `colors.text.onBrand/onStatus/onSurface.link-idle`, `typography.headings.display-numeric`); removes 3 deprecated `*.link` semantic tokens. Updates 155 semantic color and 4 gradient mode values, restructures the Link component (24 new / 18 removed tokens), and applies structural and mode-value updates across 22 components (Avatar, Breadcrumb, Button, ButtonIcon, ButtonMenu, CardFilter, Checkbox, Chip, InputDatePicker, InputSearch, InputSelect, InputText, InputTextArea, Radio, Resizable, SearchGlobal, SidebarPrimary, SidebarSecondary, Switch, Table, Tag, Tooltip).

Regenerates `@acronis-platform/tokens-pd` from the updated tiers and re-themes the affected `@acronis-platform/ui-react` components to the renamed tokens: Link (`--ui-link-*` now split into `normal`/`global`/`inverse`; only `normal`/`global` are wired), Table + DataTable (`--ui-table-global-row-color-*` → `--ui-table-data-row-color-*`, `--ui-table-global-cell-border-color` → `--ui-table-global-row-border-color`, `--ui-table-header-cell-padding-x` → `--ui-table-global-cell-padding-x`), and the InputSearch/InputText clear buttons (their dropped clear-icon token now uses the ghost ButtonIcon glyph token `--ui-button-icon-global-icon-color-idle`). The Table selected-row active background value changes as part of the sync.
