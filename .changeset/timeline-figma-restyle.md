---
'@acronis-platform/ui-react': minor
---

Rebuild `Timeline` against the new "ready for dev" Figma widget, and add the
`blue` / `gray` / `green` color schemes to `Avatar`.

The Figma widget is a different component from the design-pending v1, so this is
a **breaking API change** for `Timeline.Item`:

- Each row is now an `Avatar` marker plus a `Card` (title, optional `tag`,
  `timestamp`, `description`, and a body below a divider), connected as a
  **tree**: `level` (1–3) sets the indent, and the root derives the elbow
  joining a row to its parent from the level sequence.
- New on `Timeline`: `variant="tree"`. New on `Timeline.Item`: `expanded`,
  `defaultExpanded`, `onExpandedChange`, `toggleLabel`, `connector`, `tag`,
  `color`, and `initials`.
- Removed: `status`, `current`, `disabled`, `metadata`, and `actions` on
  `Timeline.Item`, and `size` / `density` on `Timeline` — none exist in the
  design. `TimelineStatus` is no longer exported. Move `metadata` / `actions`
  content into an item's `children`, which now renders in the card body.

**Collapsing is the variant, not a per-row flag.** There is no `collapsible`
prop. `variant="default"` never collapses; `variant="tree"` gives every row that
has descendants a disclosure button ahead of its marker, which drops the rows
beneath it — derived from the levels, so no wiring is needed (pass `expanded` to
own the state instead). A branch nobody can collapse would be indistinguishable
from `default` with a wider indent, so the two ways of saying it are unified into
one. A collapsed row keeps its control: "has descendants" is read from the rows
you passed, not the visible ones.

Separately — and **orthogonally** — `Timeline.Item` gains `collapsibleBody`, a
chevron at the trailing edge of a card's header that folds that card's own body
(Figma's `Action Button`), with `bodyExpanded` / `defaultBodyExpanded` /
`onBodyExpandedChange` / `bodyToggleLabel`. It is the card's control, not the
timeline's: same behaviour under both variants, and a `tree` row with descendants
can carry both — the branch button drops the rows below, the header chevron folds
this card. Collapsing a branch never hides a row's own body. This lives on
`Timeline.Item` only until `Card` grows the behaviour itself.

**The whole connector geometry is derived from the level sequence.** A row deeper
than the one above it opens a branch, so the elbow joining it to its parent is
drawn without being declared a second time. A row's descending line is drawn only
when the next visible row is at its own depth or deeper, its marker sits in the
same column, **and** it actually draws that elbow — so a branch's last row, the
list's last row, a row whose descendants were just collapsed, and a collapsed row
followed by a leaf sibling never leave a line dangling or crooked. `connector` and
`branchStart` are escape hatches for the two halves of that join, resolved
together so refusing one drops the other rather than leaving it unattached.

The two disclosure controls default to **distinct** accessible names —
`toggleLabel` is `"Toggle nested events"`, `bodyToggleLabel` is `"Toggle event
details"` — because a `tree` row can carry both, and a shared default would put
two identically-named buttons doing different things in one `<li>`.

Rows must be **direct** children of `Timeline` — wrapping them in a fragment hides
their `level` from the root.

Figma Code Connect is now `COMPLETE` for both the `TimelineItem` and
`TimelineItemTree` component sets.

The design's `components/Timeline/{connectorColor,gap}` variables are not yet
"ready for dev" and have no `--ui-timeline-*` tier. Both are pure aliases in
Figma, identical across all six brand modes, so the implementation consumes their
alias targets (`--ui-border-on-surface-border`, `--ui-gap-16`) directly.
