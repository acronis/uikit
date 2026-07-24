# TrendIndicator

A small presentational primitive that shows **how a metric changed** versus a
reference — a direction glyph, an already-formatted change value, and an optional
comparison label.

## When to use

- Next to a [Metric](../metric/README.md) value ("↑ 12% vs last quarter").
- In a Data Table cell to show per-row movement.
- In compact headers/summaries as a tinted `badge`.

## When not to use

- To plot a trend over time — use a Line / Area / Composed chart or
  ConfidenceCone.
- To compute a delta — the consumer computes `direction`, `sentiment`, and the
  formatted `value`; this component only renders them.

## Key idea: direction ≠ sentiment

`direction` is the maths (up / down / flat); `sentiment` is whether that's good
(positive / negative / neutral). The kit can't assume up = good — revenue ↑ is
positive, threats ↑ is negative, MTTR ↓ is positive. Always pass both.

```tsx
<TrendIndicator direction="up" sentiment="positive" value="8%" comparisonLabel="revenue QoQ" />
<TrendIndicator direction="up" sentiment="negative" value="35%" comparisonLabel="threats" />
<TrendIndicator direction="down" sentiment="positive" value="1.4 h" comparisonLabel="MTTR" />
```

## Notes

- **Design-pending v1** — no Figma node yet; sentiment colors reuse the semantic
  status tokens.
- Value may be numeric or qualitative (`"Improving"`, `"4.2 h → 2.8 h"`).
- Pass `ariaLabel` for a full accessible sentence; the glyph is decorative.
