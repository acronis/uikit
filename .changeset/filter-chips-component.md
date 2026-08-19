---
'@acronis-platform/ui-react': minor
---

Add `FilterChips` — the applied-filter row from Figma (`FilterChips`, node
`3897-7039`): a wrapping list of removable `Chip`s closed by a ghost
"Reset filters" action. Three composable parts mirroring the design's
`ListChips` slot — `FilterChips` (root, `role="group"` named via `ariaLabel`,
16px gap), `FilterChipsList` (the wrapping chip container, 8px gap in both axes)
and `FilterChipsReset` (the clear-all action, label defaulting to
"Reset filters"). Pure layout: it consumes only `--ui-gap-16` / `--ui-gap-8`,
with everything visible coming from `Chip`'s and `Button`'s own tiers. Both the
root and the reset action are polymorphic via the `render` prop.

`FilterSearchAppliedFilters` — shipped as design-pending precisely for this row —
now renders through those parts instead of repeating the layout, so the design
lives in one place. Its API is unchanged; the row's inter-chip gap corrects from
12px to the design's 8px, and it now exposes the `role="group"` name (override
with `ariaLabel`).
