# CardFilter

A compact stat/filter card: a caption label above a prominent value, with an
optional leading icon. Use it for dashboard metrics and for clickable filter
chips that summarize a count.

## When to use

- Surfacing a single metric or count with a short label (e.g. "Active filters 3").
- A clickable summary that applies or navigates to a filtered view
  (`variant="clickable"`).
- An empty/placeholder metric slot (`variant="static-empty"`).

## When not to use

- For rich, multi-field content — use a general Card/Panel instead.
- For a primary call to action — use `Button` / `ButtonMenu`.

## Variants

| variant        | Interactive | Value color                                | Notes                          |
| -------------- | ----------- | ------------------------------------------ | ------------------------------ |
| `static`       | no          | `--ui-card-filter-static-value-color-idle` | Default presentational card.   |
| `static-empty` | no          | `…-static-value-color-disabled`            | No icon; shows an em-dash `–`. |
| `clickable`    | yes         | `--ui-card-filter-clickable-value-color`   | Renders a `<button>`.          |

## Examples

```tsx
import { CardFilter } from '@acronis-platform/ui-react';
import { CircleInfoIcon } from '@acronis-platform/icons-react/stroke-mono';

// Static metric
<CardFilter label="Total assets" value="125" icon={<CircleInfoIcon />} />;

// Empty placeholder
<CardFilter variant="static-empty" label="Pending" />;

// Clickable filter
<CardFilter
  variant="clickable"
  label="Active filters"
  value="3"
  icon={<CircleInfoIcon />}
  onClick={applyFilter}
/>;

// Polymorphic: render as a link
<CardFilter
  variant="clickable"
  label="Alerts"
  value="12"
  render={<a href="/alerts" />}
/>;
```

## Parts

| Part    | Element              | Description                                      |
| ------- | -------------------- | ------------------------------------------------ |
| `root`  | `<button>` / `<div>` | Card surface; interactive only for `clickable`.  |
| `label` | `<span>`             | Caption above the value (12px).                  |
| `icon`  | `<svg>`              | Optional 16px leading glyph (hidden when empty). |
| `value` | `<span>`             | Prominent value (24px); colored per variant.     |
