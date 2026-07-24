# Spinner

An indeterminate loading indicator — a spinning ring in four sizes.

> **Status: deprecated (internal only).** As of 0.58.0, `Spinner` is
> deliberately **not** exported from `@acronis-platform/ui-react`'s public
> entry point — it's an internal primitive consumed by `Loading` (its icon)
> and `Toast` (a small inline icon). Building a standalone loading state? Use
> [`Loading`](../loading/README.md) instead; it wraps this same ring with a
> label and placement-context container tokens. Ported from the legacy
> `@acronis-platform/shadcn-uikit` `Spinner`. No `--ui-spinner-*` tier; the
> ring defaults to the brand blue (`text-secondary`) and is overridable via a
> `text-*` class.

## When to use

- Nowhere directly — it's not part of the public component set. Compose it
  only from inside another `ui-react` component that needs an icon-scale
  spinning glyph (see `Loading`, `Toast`).

## When not to use

- For an app-facing standalone loading state — use `Loading`.
- For determinate progress — use `Progress`.
- For content placeholders — use a skeleton.

## Example

```tsx
// Internal usage only — Spinner isn't exported for app code.
import { Spinner } from '../spinner';

<Spinner />
<Spinner size="lg" />
<Spinner size="sm" className="text-muted-foreground" />
```
