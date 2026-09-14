# SegmentControl

Use SegmentControl to switch among a small number of mutually exclusive views,
filters, or modes when the current choice should remain visible.

## When to use

- Switch between two related views with `variant="hug"`.
- Switch between three or more peer views across an available row with
  `variant="fill"`.
- Show a compact per-view count by enabling `hasCounter` and passing Tag props
  through an item's `counter`.

## When not to use

- A multi-select formatting or filter control — use **ToggleGroup**.
- A long list or form selection needing descriptions — use **RadioGroup** or
  **Select**.
- Navigation that also swaps page panels — use **Tabs**.

## Example (React)

```tsx
import { SegmentControl, SegmentControlItem } from '@acronis-platform/ui-react';
import { SquareDashedIcon } from '@acronis-platform/icons-react/stroke-mono';

<SegmentControl variant="fill" defaultValue="active" aria-label="Status">
  <SegmentControlItem
    value="active"
    hasCounter
    counter={{
      variant: 'neutral',
      size: 'sm',
      icon: <SquareDashedIcon size={16} />,
      children: '7',
    }}
  >
    Active
  </SegmentControlItem>
  <SegmentControlItem value="completed">Completed</SegmentControlItem>
  <SegmentControlItem value="all">All</SegmentControlItem>
</SegmentControl>;
```

Give the group a meaningful accessible name. Each item needs a unique `value`.
