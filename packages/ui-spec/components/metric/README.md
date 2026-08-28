# Metric

A presentational metric / statistic **card**, modelled on the Figma MetricCard
node: a label + optional caption over a primary value (with an optional
status-tinted icon badge, unit, and trend), plus an optional body for a chart,
breakdown, or insight.

## When to use

- A dashboard KPI tile: a headline number with a trend and a small visual.
- Any "value + context" surface (health score, coverage, ARR, MTTR, at-risk
  count, …).

## When not to use

- To plot a series over time — use a Line / Area / Composed chart (compose it as
  the Metric body).
- To compute the value or the trend — the consumer passes a ready-formatted
  `value` and a resolved `status`; Metric never does maths or business rules.

## Anatomy

```
GROSS MARGIN                 [Last 30 days]   ← label + caption
[◐] 73 %              ↘ 5% vs prev 30d         ← icon badge + value + unit · trend
——————————————————————————————————————         ← (children body: chart / divider / insight)
```

## Composition

Metric is a Card. Put the trend in the `trend` slot (a `TrendIndicator`), a
timeframe in `caption` (a `Tag`), and drop a chart / `Meter` breakdown /
divider / insight line into `children`:

```tsx
<Metric
  label="At-risk customers"
  status="critical"
  icon={<ChartPieIcon />}
  caption={<Tag>Now</Tag>}
  value="3"
  trend={
    <TrendIndicator
      direction="up"
      sentiment="negative"
      value="1"
      size="small"
    />
  }
>
  <Meter
    label="Healthy"
    value={46}
    max={54}
    color="var(--ui-background-status-strong-success)"
  />
  <p>+3 customers predicted at-risk within 30 days.</p>
</Metric>
```

## Notes

- **Design-pending v1** — the Figma node is a reference, not a published
  component; no dedicated `--ui-metric-*` token tier yet.
- Value may be numeric or a ReactNode; the kit never formats it.
- `status` (`neutral | info | success | warning | danger | critical`) tints the
  icon badge only (subtle) — the `--ui-background-status-<status>-pressed` fill +
  the `--ui-text-on-status-<status>` icon color — never a full color fill, so
  many metrics stay calm together.
