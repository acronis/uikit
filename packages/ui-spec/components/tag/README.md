# Tag

A compact label for a status, attribute, or keyword.

## When to use

- Show metadata, a category, or a status on content or an object (e.g. "Active",
  "Beta", "Critical").
- Keep the content short and meaningful.

## When not to use

- As a button or link — a Tag is presentational and non-interactive. Use a
  **Button** / link for actions.
- For long text — the label truncates at 256px.

## Variants

`info` · `success` · `warning` · `critical` · `danger` · `neutral` · `ai` — each
maps to the dedicated `--ui-tag-<variant>-*` tier (container fill / border /
label / icon). `ai` paints a gradient border over a tinted fill. Two sizes:
`default` (24px) and `sm` (20px).

## Examples

```tsx
import { Tag } from '@acronis-platform/ui-react';
import { TriangleWarningIcon } from '@acronis-platform/icons-react/stroke-mono';

<Tag variant="success">Active</Tag>
<Tag variant="info" size="sm">Beta</Tag>
<Tag variant="warning" icon={<TriangleWarningIcon />}>Degraded</Tag>
```

## Parts

| Part    | Element | Purpose                                     |
| ------- | ------- | ------------------------------------------- |
| root    | `span`  | The pill (background, border, radius).      |
| `icon`  | `svg`   | Optional 16px leading icon (Default size).  |
| `label` | text    | The content (children); truncates at 256px. |
