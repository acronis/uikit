# Skeleton

A pulsing placeholder box for loading states. Shape and size come from the
caller's `className`.

> Design-pending v1, ported from the legacy shadcn-uikit `skeleton`.

## When to use

- Reserve layout space while content loads, reducing layout shift.

## When not to use

- Indeterminate work with no known shape — use `Spinner`.
- Determinate progress — use `Progress` / `ProgressCircle`.

## Parts

| Export     | Purpose                          |
| ---------- | -------------------------------- |
| `Skeleton` | The pulsing placeholder `<div>`. |

## Example

```tsx
import { Skeleton } from '@acronis-platform/ui-react';

<div className="flex items-center gap-4">
  <Skeleton className="size-12 rounded-full" />
  <div className="flex flex-col gap-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>;
```
