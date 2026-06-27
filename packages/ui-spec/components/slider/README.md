# Slider

A slider for choosing a number — or a range (two thumbs) — within a min/max by
dragging. Built on Base UI's Slider.

> Design-pending v1, ported from the legacy shadcn-uikit `slider`.

## When to use

- Picking an approximate value across a continuous range (volume, opacity, price).

## When not to use

- Precise numeric entry — use a `NumberField` / `InputText`.
- A small set of discrete choices — use `RadioGroup` or `ToggleGroup`.

## Parts

`Slider` is a single component (the track / indicator / thumb are rendered
internally). Pass an array value for a range.

## Example

```tsx
import { Slider } from '@acronis-platform/ui-react';

<Slider defaultValue={40} aria-label="Volume" />
<Slider defaultValue={[20, 80]} aria-label="Price range" />
```
