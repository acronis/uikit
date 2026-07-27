# Timeline

A presentational, chronological list of events — an activity feed, audit log,
status history, or process steps. `Timeline` + `Timeline.Item` render a semantic
`<ol>` with a connector line, status markers, and a timestamp / title /
description hierarchy.

## When to use

- Customer-health contributing events, audit logs, activity feeds, order/status
  history, deployment/CI history.
- Simple process steps (with `current`).

## When not to use

- To plot a metric over time — use a Line / Area / Composed chart / ConfidenceCone.
- As a full stepper/wizard — a dedicated Stepper is a different component.
- To sort, group, paginate, or virtualize — the app does that and passes ordered
  items.

## Usage

```tsx
<Timeline>
  <Timeline.Item
    timestamp={
      <time dateTime="2026-07-24T10:35:00+02:00">24 Jul 2026, 10:35</time>
    }
    title="Backup success rate dropped"
    description="Fell from 96% to 72%"
    status="critical"
    metadata={<Tag>Backup</Tag>}
    actions={<Link href="#details">View details</Link>}
  />
  <Timeline.Item title="P1 support ticket resolved" status="success" />
</Timeline>
```

## Notes

- **Design-pending v1** — no Figma node yet; the marker uses the same status
  palette as `Metric` (`--ui-text-on-status-*` / `--ui-background-status-*-pressed`).
- Status (`neutral | info | success | warning | danger | critical`) tints the
  marker only.
- `size` (`small`/`medium`) and `density` (`compact`/`default`) come from
  `Timeline` via context.
- Compose `Tag` (metadata), `Link`/`ButtonMenu` (actions), and `Accordion`
  (expandable detail) — the kit ships no domain event types or icons.
