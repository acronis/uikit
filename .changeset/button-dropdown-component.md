---
'@acronis-platform/ui-react': minor
---

Add `ButtonDropdown`: a button that opens a dropdown menu — a label followed by a
chevron that flips up while `open`. Two variants (`primary` solid / `secondary`
bordered) across idle, hover, open, and disabled states, wired to the
`--ui-button-dropdown-*` tokens. The `open` prop drives the chevron direction,
the open (`*-active`) treatment, and `aria-expanded`; compose it with a menu
trigger via the `render` prop.
