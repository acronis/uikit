---
'@acronis-platform/ui-react': patch
---

refactor(input-select): extract presentational search/section/row markup into `input-select-list.tsx`

The search-row (magnifier + input), section/section-label, and tree-item row layout previously inlined in `input-select.tsx` are now presentational pieces in a sibling file, with no read of `InputSelectFilterContext`/`InputSelectModeContext` or Base UI Select primitives. `input-select.tsx` delegates to them via props and Base UI's `render` prop. Rendered output is unchanged. The one prop-type change: `InputSelectSection` / `InputSelectSectionLabel` (and their `SelectGroup` / `SelectGroupLabel` aliases) no longer accept `render` — they own the base section classes via that prop, so an override would have silently dropped them.
