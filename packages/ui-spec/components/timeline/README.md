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
- To sort, group, paginate, or virtualize, or to own expand/collapse state — the
  app does that and passes ordered rows.

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
    branchStart
    icon={<CircleCheckIcon />}
    color="green"
    title="Archive pruned"
    timestamp="Dec 22, 08:31 AM"
    description="14 recovery points removed"
  />
</Timeline>
```

A `collapsible` row gets a disclosure control. Its scope follows the variant:
`variant="tree"` puts a button ahead of the marker that drops the rows beneath it
— no wiring needed — while `default` puts a chevron in the card header that hides
only that row's own body:

```tsx
<Timeline variant="tree">
  <Timeline.Item collapsible title="Retention policy applied" />
  <Timeline.Item level={2} branchStart title="Archive pruned" />
  <Timeline.Item level={2} title="Index rebuilt" />
  <Timeline.Item title="Next root event" />
</Timeline>
```

Pass `expanded` + `onExpandedChange` to own the state instead, and
`defaultExpanded={false}` to start collapsed. Items must be **direct** children —
a fragment hides their `level` from the root.

## Parts

| Part                                          | Notes                                                               |
| --------------------------------------------- | ------------------------------------------------------------------- |
| `item`                                        | One `<li>` — marker column, card, connector geometry.               |
| `toggle`                                      | Disclosure `ButtonIcon`; `collapsible` rows only.                   |
| `marker`                                      | The `Avatar` holding `icon` or `initials`, tinted by `color`.       |
| `connector`                                   | Vertical line to the next row. Derived — never dangles.             |
| `elbow`                                       | Right angle joining a nested row to its parent. `branchStart` only. |
| `card`                                        | The bordered `Card` holding the row's content.                      |
| `title` / `tag` / `timestamp` / `description` | The card header content.                                            |
| `body`                                        | The item's `children`, below a divider. Hidden while collapsed.     |

## Notes

- `level` (1-3) drives the indent only; `branchStart` (Figma's `Nesting` `-First`)
  draws the elbow. The two are orthogonal, and `branchStart` is ignored at level 1.
- Connectors are derived from the level sequence, so a branch's last row, the
  list's last row, and a just-collapsed row never leave a dangling line. `connector`
  exists only to override that.
- The indent step is the marker column plus the gap, so `variant="tree"` indents
  further per level than `default` — every level still aligns.
- `toggleLabel` defaults to an English string; pass a localized value.
- The marker takes an `icon` or `initials` (icon wins). Avatar's outset ring is
  switched off here, matching the design's strokeless marker.
- The Figma variables `components/Timeline/{connectorColor,gap}` are not yet
  "ready for dev" and have no `--ui-timeline-*` tier. Both are pure aliases,
  identical across all six brands, so the implementation consumes the alias
  targets (`--ui-border-on-surface-border`, `--ui-gap-16`) directly.
- Composes `Avatar` (marker), `Card` (container), and `ButtonIcon` (disclosure);
  compose `Tag` into `tag` and anything you like into `children`. The kit ships no
  domain event types or icons.
