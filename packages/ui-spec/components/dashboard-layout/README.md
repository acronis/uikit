# DashboardLayout

A layout for dashboard pages — a vertically spaced `DashboardLayout` region holding
one or more responsive `DashboardGrid` widget grids (1–4 columns).

> Design-pending v1, ported from the legacy shadcn-uikit `dashboard-layout`.

## When to use

- Dashboard / overview pages built from a grid of widget cards.

## When not to use

- A general two-dimensional layout — use [`Grid`](/layouts/grid).
- The page frame — use [App Shell](/layouts/app-shell).

## Parts

| Export            | Purpose                                 |
| ----------------- | --------------------------------------- |
| `DashboardLayout` | The vertically spaced dashboard region. |
| `DashboardGrid`   | A responsive widget grid (`cols` 1–4).  |

## Example

```tsx
import { DashboardLayout, DashboardGrid } from '@acronis-platform/ui-react';

<DashboardLayout>
  <DashboardGrid cols={3}>
    {widgets.map((w) => (
      <WidgetPlaceholder key={w.id} {...w} />
    ))}
  </DashboardGrid>
</DashboardLayout>;
```
