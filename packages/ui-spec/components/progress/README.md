# Progress

A horizontal bar showing the completion of a known-length task, or an
indeterminate sliding bar when the length is unknown.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `Progress`. No `--ui-progress-*` tier yet; the
> track uses `bg-input` and the indicator the brand blue (`bg-secondary`).
> Reconcile with `/figma-component Progress <url> --update` once a mockup lands.

## When to use

- Showing measurable progress of an operation (upload, install, multi-step flow).
- An indeterminate bar (`value={null}`) for an in-progress operation of unknown
  length.

## When not to use

- For a small inline busy indicator — use `Loading`.
- For a status that isn't progress (e.g. a count) — use a different component.

## Parts

| Part        | Element | Purpose                                                        |
| ----------- | ------- | -------------------------------------------------------------- |
| `root`      | div     | `role="progressbar"`; owns the ARIA value range.               |
| `track`     | div     | The full-width rail.                                           |
| `indicator` | div     | The fill; width follows `value`, or slides when indeterminate. |

## Example

```tsx
import { Progress } from '@acronis-platform/ui-react';

<Progress value={40} />
<Progress value={null} /> {/* indeterminate */}
```
