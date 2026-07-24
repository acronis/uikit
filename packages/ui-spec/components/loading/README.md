# Loading

A composite loading indicator — a spinning ring plus an optional label — for
four placement contexts.

## When to use

- Indicating an in-progress, indeterminate operation, with a message, in one
  of four contexts: inline in text flow, as a card-like chip over an app
  surface, or as a higher-contrast chip over a busy/photo/video surface.

## When not to use

- For a small inline icon-scale spinner (e.g. inside a `Button` or `Toast`) —
  those compose the internal `Spinner` primitive directly; it isn't part of
  the public component set.
- For determinate progress — use `Progress`.
- For content placeholders — use a skeleton.

## Parts

| Part  | Description                                                        |
| ----- | ------------------------------------------------------------------ |
| icon  | The `Spinner` primitive, sized/colored per variant, `aria-hidden`. |
| label | Optional visible text (`hasLabel`), colored per variant.           |

## Example

```tsx
import { Loading } from '@acronis-platform/ui-react';

<Loading />
<Loading variant="onSurfacePrimary" label="Fetching your data…" />
<Loading variant="onSurfaceSecondary" />
<Loading variant="onScreen" hasLabel={false} />
```
