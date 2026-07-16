---
'@acronis-platform/ui-react': minor
---

**InputSelect: functional in-dropdown search, tree/hierarchy support, and Figma Code Connect for the dropdown.**

New public API:

- `InputSelectExpander` — a non-selectable expand/collapse row for tree groups.
- `useInputSelectFilter` — reads the live search query so hierarchical (tree)
  dropdowns can filter themselves in place, without flattening.
- `InputSelectItem` gains an `icon` prop (leading icon, colored by
  `--ui-input-select-dropdown-item-global-icon-tenant`), a `textValue` prop to
  override the text matched against the search query, and an `indent` prop.

In-dropdown search now works:

- `InputSelectSearch` drives a filter context — flat `InputSelectItem`s auto-hide
  when their label doesn't match the query.
- Fixes a bug where Base UI's typeahead swallowed the typed keys, so the query
  never appeared. Only printable keys are now intercepted, so Arrow / Enter /
  Escape still navigate and dismiss the list from the search box.

Tree/hierarchy layout:

- `indent` (on `InputSelectItem` and `InputSelectExpander`) reserves a leading
  nesting spacer matching the Figma tenant tree: 16 / 40 / 64 px for levels 1–3
  (`16 + (level − 1) × 24`). Expander chevrons are tucked right-aligned into that
  reserved space so tenant icons stay aligned across rows.

Token / Figma alignment:

- The single-select check indicator now uses
  `--ui-input-select-dropdown-item-global-icon-checked`.
- `InputSelectStatus`'s hardcoded `min-h` is replaced with
  `--ui-input-select-dropdown-container-status-width-min`.
- Icon colors match Figma: the search magnifier and loading spinner use
  `--ui-glyph-on-surface-primary`, the empty icon `--ui-glyph-on-status-info`,
  and the error icon `--ui-glyph-on-status-warning`.
- Adds Figma Code Connect for the `InputSelectDropdown` (2885-2373) and
  `InputSelectDropdownTenants` (3064-21461) component sets.
