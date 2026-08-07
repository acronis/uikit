---
'@acronis-platform/ui-react': minor
---

Rebuild `Timeline` against the new "ready for dev" Figma widget, and add the
`blue` / `gray` / `green` color schemes to `Avatar`.

The Figma widget is a different component from the design-pending v1, so this is
a **breaking API change** for `Timeline.Item`:

- Each row is now an `Avatar` marker plus a `Card` (title, optional `tag`,
  `timestamp`, `description`, and a body below a divider), connected as a
  **tree**: `level` (1–3) sets the indent and `branchStart` draws the elbow
  joining a row to its parent.
- New on `Timeline`: `variant="tree"`. New on `Timeline.Item`: `collapsible`,
  `expanded`, `defaultExpanded`, `onExpandedChange`, `toggleLabel`, `connector`,
  `tag`, `color`, and `initials`.
- Removed: `status`, `current`, `disabled`, `metadata`, and `actions` on
  `Timeline.Item`, and `size` / `density` on `Timeline` — none exist in the
  design. `TimelineStatus` is no longer exported. Move `metadata` / `actions`
  content into an item's `children`, which now renders in the card body.

`Timeline` owns collapsing: it reads its children's `level`s, so a `collapsible`
row hides its body and drops its descendant rows with no wiring from the consumer
(pass `expanded` to control it instead). The disclosure control sits at the
trailing edge of the card header, or ahead of the marker under `variant="tree"` —
the two idioms Figma ships.

Connectors are derived from the same level sequence: a row's descending line is
drawn only when the next visible row is at its own depth or deeper, so a branch's
last row, the list's last row, and a row whose descendants were just collapsed
never leave a line dangling. `connector` only overrides that.

Rows must be **direct** children of `Timeline` — wrapping them in a fragment hides
their `level` from the root.

Figma Code Connect is now `COMPLETE` for both the `TimelineItem` and
`TimelineItemTree` component sets.

The design's `components/Timeline/{connectorColor,gap}` variables are not yet
"ready for dev" and have no `--ui-timeline-*` tier. Both are pure aliases in
Figma, identical across all six brand modes, so the implementation consumes their
alias targets (`--ui-border-on-surface-border`, `--ui-gap-16`) directly.
