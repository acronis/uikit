# Card

A surface that groups related content and actions into a bordered, rounded
container. Composable from parts; no variants.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `Card`. There is no `--ui-card-*` token tier
> yet, so colors resolve to the shared semantic tokens. Reconcile against Figma
> with `/figma-component Card <url> --update` once a mockup lands.

## When to use

- Grouping related information into a self-contained block (a stat, a summary, a
  settings group, a list item with structure).
- Laying out a header (title + description), a body, and an action footer in a
  consistent surface.

## When not to use

- For a compact single-stat tile with built-in variants/interactivity, use
  **`CardFilter`** instead.
- As a generic layout `<div>` with no visual surface — just use a styled element.
- For modal/overlay surfaces — use the dialog/popover components.

## Parts

| Part              | Element (default) | Purpose                                           |
| ----------------- | ----------------- | ------------------------------------------------- |
| `Card`            | `div`             | The card surface (border, radius, shadow).        |
| `CardHeader`      | `div`             | Top region; stacks title + description.           |
| `CardTitle`       | `div`             | Prominent heading text (render as `<h2>`/`<h3>`). |
| `CardDescription` | `div`             | Muted supporting copy under the title.            |
| `CardContent`     | `div`             | Primary body region for arbitrary children.       |
| `CardFooter`      | `div`             | Bottom region; horizontal action row.             |

All parts accept a `render` prop for polymorphic composition.

## Example

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@acronis-platform/ui-react';

<Card className="w-[350px]">
  <CardHeader>
    <CardTitle render={<h3 />}>Backup status</CardTitle>
    <CardDescription>Last successful run 5 minutes ago.</CardDescription>
  </CardHeader>
  <CardContent>All 24 workloads are protected.</CardContent>
  <CardFooter className="gap-2">
    <Button>View report</Button>
    <Button variant="secondary">Run now</Button>
  </CardFooter>
</Card>;
```
