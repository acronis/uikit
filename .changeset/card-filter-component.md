---
'@acronis-platform/ui-react': minor
---

Add `CardFilter`: a compact stat/filter card — a caption `label` above a prominent
`value`, with an optional leading `icon`. Three variants: `static` (presentational),
`static-empty` (placeholder with an em-dash, no icon), and `clickable` (renders an
interactive `<button>` with hover / active / focus states and a link-colored value).
Themed entirely by the `--ui-card-filter-*` tokens; focus is a 3px `--ui-focus-primary`
ring flush to the edge. Supports Base UI `render`-prop composition (e.g. render a
clickable filter as a link).
