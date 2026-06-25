# @acronis-platform/ui-react

The next-generation Acronis React component library — a **Base UI**
implementation, themed by [`@acronis-platform/tokens-pd`](../tokens-pd)
(generated from [`@acronis-platform/design-tokens`](../design-tokens)).

> Early days: this package is being built out component by component. See
> [`AGENTS.md`](./AGENTS.md) for conventions.

## Install

```sh
pnpm add @acronis-platform/ui-react react react-dom
```

## Usage

```tsx
import '@acronis-platform/ui-react/styles';
import { Button, Switch } from '@acronis-platform/ui-react';

export function Example() {
  return (
    <div>
      <Button variant="default">Save</Button>
      <Switch defaultChecked />
    </div>
  );
}
```

`@acronis-platform/ui-react/styles` loads the `acronis` token base. To switch
theme at runtime:

```css
/* base brand */
@import '@acronis-platform/ui-react/styles';

/* optional: layer another brand override on top */
@import '@acronis-platform/tokens-pd/css/deep-sky.css';
```

```html
<!-- light/dark mode -->
<html data-theme="dark"></html>
```

Light/dark is driven by `light-dark()` + `color-scheme`; `dark:` utilities are
wired to `[data-theme='dark']`.

## Fonts

The design tokens use **Inter** as the default family, and the generated CSS
emits a graceful fallback stack (`font-family: Inter, system-ui, sans-serif`).
The library deliberately **does not bundle the font** — loading it is the
consumer's choice, so you control hosting, subsets, and weights.

To render in Inter, self-host it (recommended — no third-party CDN, GDPR-safe).
[`@fontsource/inter`](https://fontsource.org/fonts/inter) (SIL Open Font
License) is the simplest route:

```sh
pnpm add @fontsource/inter
```

```tsx
// Load only the weights you use (the typography scale uses 400/500/600/700).
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@acronis-platform/ui-react/styles';
```

> The static `@fontsource/inter` registers the family as `Inter`, which matches
> the token output. The variable package `@fontsource-variable/inter` registers
> `Inter Variable` instead, so it won't match `font-family: Inter` without an
> extra alias — prefer the static package unless you add that mapping yourself.

If you skip this step, text falls back to `system-ui` / the platform sans-serif.

## Develop

```sh
pnpm --filter @acronis-platform/ui-react storybook   # explore components
pnpm --filter @acronis-platform/ui-react test        # Vitest + RTL
pnpm --filter @acronis-platform/ui-react build       # library bundle + types
```
