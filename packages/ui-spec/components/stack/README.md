# Stack

A flexbox layout primitive — arrange children in a row or column with a chosen
gap, alignment, justification, and wrapping.

> Design-pending v1, ported 1:1 from the legacy shadcn-uikit `stack`.

## When to use

- Quick one-dimensional layouts (toolbars, button rows, vertical form stacks)
  without hand-writing flex utilities.

## When not to use

- Two-dimensional layouts — use `Grid`.

## Parts

`Stack` is a single component.

## Example

```tsx
import { Stack } from '@acronis-platform/ui-react';

<Stack direction="horizontal" gap="sm" align="center">
  <Button>Save</Button>
  <Button variant="ghost">Cancel</Button>
</Stack>;
```
