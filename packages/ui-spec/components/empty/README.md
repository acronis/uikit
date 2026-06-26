# Empty

A centered empty-state placeholder shown when there is no data or content.
Composable from parts; no variants.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `Empty`. No `--ui-empty-*` token tier yet, so
> it themes from the shared semantic text tokens (title `text-foreground`,
> description/icon `text-muted-foreground`). Reconcile with
> `/figma-component Empty <url> --update` once a mockup lands.

## When to use

- A list, table, or panel that has no items yet (or none match a filter).
- A first-run state inviting the user to create the first item.

## When not to use

- For a loading state — use a spinner/skeleton, not Empty.
- For an error state — show an error with a retry, not a neutral empty.
- For a blocking message — use a Dialog.

## Parts

| Part               | Element | Purpose                                |
| ------------------ | ------- | -------------------------------------- |
| `Empty`            | `div`   | Centered container (max 448px), muted. |
| `EmptyIcon`        | `div`   | Optional 72px illustration/glyph slot. |
| `EmptyHeader`      | `div`   | Groups the title + description.        |
| `EmptyTitle`       | `h3`    | The heading (foreground color).        |
| `EmptyDescription` | `p`     | Supporting copy (muted).               |
| `EmptyActions`     | `div`   | Primary action(s), e.g. a Button.      |
| `EmptyLinks`       | `div`   | Secondary supporting link(s).          |

## Example

```tsx
import {
  Empty,
  EmptyIcon,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyActions,
  Button,
} from '@acronis-platform/ui-react';
import { InboxIcon } from '@acronis-platform/icons-react/stroke-mono';

<Empty>
  <EmptyIcon>
    <InboxIcon />
  </EmptyIcon>
  <EmptyHeader>
    <EmptyTitle>No backups found</EmptyTitle>
    <EmptyDescription>Create your first backup plan.</EmptyDescription>
  </EmptyHeader>
  <EmptyActions>
    <Button>Create backup plan</Button>
  </EmptyActions>
</Empty>;
```
