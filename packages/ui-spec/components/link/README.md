# Link

An inline text link (semibold) that underlines on hover, with an optional trailing
external-link icon. Navigates via `href` or composes a router link through `render`.
Themed by the `--ui-link-*` token tier.

## When to use

- Inline navigation within prose or UI — to another page, a section, or an external
  resource (`external`).

## When not to use

- For a primary/secondary **action** (submit, open dialog) — use `Button` (its
  borderless `ghost`/link-style variant reads like a link but is a real button).
- For breadcrumb trails — use `Breadcrumb`.

## Examples

```tsx
import { Link } from '@acronis-platform/ui-react';

// Internal
<Link href="/docs">Documentation</Link>;

// External (trailing icon)
<Link
  href="https://acronis.com"
  external
  target="_blank"
  rel="noopener noreferrer"
>
  Acronis
</Link>;

// Polymorphic — render a router link, keep the Link styling
<Link render={<RouterLink to="/settings" />}>Settings</Link>;

// Disabled (inert)
<Link href="/docs" disabled>
  Documentation
</Link>;
```

## Parts

| Part    | Element | Description                                        |
| ------- | ------- | -------------------------------------------------- |
| `label` | text    | The link text (children).                          |
| `icon`  | `<svg>` | Optional trailing external-link icon (`external`). |
