# ToggleGroup

A set of pressable toggle buttons (single or multiple selection), plus a
standalone `Toggle`. Built on Base UI's Toggle / ToggleGroup.

> Design-pending v1, ported from the legacy shadcn-uikit `toggle-group`.

## When to use

- A small set of mutually-exclusive (or multi-select) view/format options —
  view-mode switchers, text-formatting toolbars.

## When not to use

- Choosing one option from a list / form value — use `RadioGroup` or `InputSelect`.
- A single on/off setting with a label — use `Switch`.

## Parts

| Export            | Purpose                                            |
| ----------------- | -------------------------------------------------- |
| `ToggleGroup`     | The group — tracks the pressed value(s).           |
| `ToggleGroupItem` | A pressable button in the group (needs a `value`). |
| `Toggle`          | A standalone pressable button (same styling).      |

## Example

```tsx
import { ToggleGroup, ToggleGroupItem } from '@acronis-platform/ui-react';

<ToggleGroup defaultValue={['grid']} aria-label="View mode">
  <ToggleGroupItem value="grid" aria-label="Grid view">
    <GridIcon />
  </ToggleGroupItem>
  <ToggleGroupItem value="list" aria-label="List view">
    <ListIcon />
  </ToggleGroupItem>
</ToggleGroup>;
```
