# Spinner

An indeterminate loading indicator — a spinning ring in four sizes.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `Spinner`. No `--ui-spinner-*` tier yet; the
> ring defaults to the brand blue (`text-secondary`) and is overridable via a
> `text-*` class. Reconcile with `/figma-component Spinner <url> --update` once a
> mockup lands.

## When to use

- Indicating an in-progress, indeterminate operation (loading data, submitting).

## When not to use

- For determinate progress — use `Progress`.
- For content placeholders — use a skeleton.

## Example

```tsx
import { Spinner } from '@acronis-platform/ui-react';

<Spinner />
<Spinner size="lg" />
<Spinner size="sm" className="text-muted-foreground" />
```
