# Timeline

A presentational, chronological tree of events — an activity feed, audit log, or
status history. `Timeline` + `Timeline.Item` render a semantic `<ol>` in which
each row pairs an Avatar marker with a Card carrying the title, an optional tag,
the timestamp, and a description. Rows join their parent through an elbow and
their next sibling through a vertical connector.

## When to use

- Customer-health contributing events, audit logs, activity feeds, order/status
  history, deployment/CI history.
- Hierarchical event trails, where a top-level event expands into the steps that
  produced it (up to three levels).

## When not to use

- To plot a metric over time — use a Line / Area / Composed chart / ConfidenceCone.
- As a full stepper/wizard — a dedicated Stepper is a different component.
- As a real tree widget — nesting here is visual only, and is not exposed to
  assistive tech.
- To sort, group, paginate, or virtualize — the app does that and passes ordered
  rows. (Branch collapsing _is_ owned here: `variant="tree"` derives it from the
  levels. Pass `expanded` if you want to own it instead.)

## Usage

```tsx
<Timeline>
  <Timeline.Item
    icon={<CircleInfoIcon />}
    title="Retention policy applied"
    tag={<Tag variant="warning">Warning</Tag>}
    timestamp={
      <time dateTime="2026-12-22T08:30:00+01:00">Dec 22, 08:30 AM</time>
    }
    description="Weekly archives pruned"
  />
  <Timeline.Item
    level={2}
    icon={<CircleCheckIcon />}
    color="green"
    title="Archive pruned"
    timestamp="Dec 22, 08:31 AM"
    description="14 recovery points removed"
  />
</Timeline>
```

Collapsing is the variant, not a per-row flag — there is no `collapsible` prop.
`variant="default"` never collapses; `variant="tree"` gives every row that has
descendants a button ahead of its marker that drops the rows beneath it, with no
wiring needed:

```tsx
<Timeline variant="tree">
  <Timeline.Item title="Retention policy applied" />
  <Timeline.Item level={2} title="Archive pruned" />
  <Timeline.Item level={2} title="Index rebuilt" />
  <Timeline.Item title="Next root event" />
</Timeline>
```

Pass `expanded` + `onExpandedChange` to own the state instead, and
`defaultExpanded={false}` to start collapsed. Items must be **direct** children —
a fragment hides their `level` from the root.

Separately, `collapsibleBody` gives a row's _card_ a chevron in its header that
folds that card's body. It is orthogonal to `variant` — same behaviour in both, and
a tree row can carry the branch button and the card chevron at once:

```tsx
<Timeline.Item collapsibleBody title="Nightly protection plan failed">
  <BodySection />
</Timeline.Item>
```

## Parts

| Part                                          | Notes                                                              |
| --------------------------------------------- | ------------------------------------------------------------------ |
| `item`                                        | One `<li>` — marker column, card, connector geometry.              |
| `toggle`                                      | Branch disclosure `ButtonIcon`; `tree` rows with descendants only. |
| `body-toggle`                                 | Card-body chevron in the header; `collapsibleBody` rows only.      |
| `marker`                                      | The `Avatar` holding `icon` or `initials`, tinted by `color`.      |
| `connector`                                   | Vertical line to the next row. Derived — never dangles.            |
| `elbow`                                       | Right angle joining a branch's first row to its parent. Derived.   |
| `card`                                        | The bordered `Card` holding the row's content.                     |
| `title` / `tag` / `timestamp` / `description` | The card header content.                                           |
| `body`                                        | The item's `children`, below a divider. Hidden while collapsed.    |

## Notes

- `level` (1-3) drives the indent and the connector geometry: a row deeper than the
  one above it opens a branch and draws the elbow (Figma's `Nesting` `-First`).
  `branchStart` overrides that, and is ignored at level 1.
- Connectors are derived from the same level sequence, so a branch's last row, the
  list's last row, and a just-collapsed row never leave a dangling line — and a
  level jump always draws both halves of the join. `connector` / `branchStart`
  exist only to override that.
- The indent step is the marker column plus the gap, so `variant="tree"` indents
  further per level than `default` — every level still aligns.
- `toggleLabel` and `bodyToggleLabel` default to distinct English strings — a tree
  row can carry both controls, so a shared name would be ambiguous. Pass localized
  values, and keep them distinct.
- The marker takes an `icon` or `initials` (icon wins). Avatar's outset ring is
  switched off here, matching the design's strokeless marker.
- The Figma variables `components/Timeline/{connectorColor,gap}` are not yet
  "ready for dev" and have no `--ui-timeline-*` tier. Both are pure aliases,
  identical across all six brands, so the implementation consumes the alias
  targets (`--ui-border-on-surface-border`, `--ui-gap-16`) directly.
- Composes `Avatar` (marker), `Card` (container), and `ButtonIcon` (disclosure);
  compose `Tag` into `tag` and anything you like into `children`. The kit ships no
  domain event types or icons.
