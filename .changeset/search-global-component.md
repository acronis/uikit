---
'@acronis-platform/ui-react': minor
---

Add `SearchGlobal`: a prominent global "search anything" field — a 48px pill with
a gradient brand border (`--ui-search-global-*` token tier), a leading magnifier,
a borderless search input, and a decorative trailing keyboard-shortcut hint (`⌘K`,
hideable via `shortcut={null}`). Border swaps idle/hover/active gradients and shows
a `--ui-focus-primary` ring on focus; forwards a ref to the input for shortcut
wiring.
