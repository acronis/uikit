# ProgressCircle

A circular (radial) progress indicator — an SVG ring whose arc fills with the
value and whose color tracks the level.

> **Status: draft (design-pending v1).** Built from the Cyber-Compliance
> "Compliance %" design and the Vue kit's `AvProgressRadial`. Reuses the shared
> status colors — no `--ui-progress-circle-*` tier. Reconcile with
> `/figma-component ProgressCircle <url> --update` once the component master node
> is confirmed.

## When to use

- A compact, at-a-glance completion/score in a table cell, card, or widget
  (e.g. compliance %, usage, health).

## When not to use

- A full-width determinate bar — use the linear `Progress`.
- An indeterminate "busy" state — use `Loading`.

## Example

```tsx
import { ProgressCircle } from '@acronis-platform/ui-react';

<ProgressCircle value={75} size="md" showValue />
<ProgressCircle value={25} size="sm" />           {/* arc auto-colors to danger */}
<ProgressCircle value={100} size="lg" showIcon /> {/* success check in center */}
```

In a table cell, compose the ring with an external label:

```tsx
<div className="flex items-center gap-2">
  <ProgressCircle value={81} size="sm" />
  <span className="text-sm">81%</span>
</div>
```
