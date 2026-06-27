# Grid

A responsive CSS-grid layout primitive — lay children into a column count that
steps down at smaller breakpoints, with a configurable gap.

> Design-pending v1, ported 1:1 from the legacy shadcn-uikit `grid`.

## When to use

- Card galleries, dashboards, and other two-dimensional layouts.

## When not to use

- One-dimensional rows/columns — use `Stack`.
- Tabular data — use `Table` / `DataTable`.

## Parts

`Grid` is a single component.

## Example

```tsx
import { Grid } from '@acronis-platform/ui-react';

<Grid cols={3} gap="md">
  {items.map((i) => (
    <Card key={i.id} {...i} />
  ))}
</Grid>;
```
