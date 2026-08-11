# FilterCards

A horizontal row container (the Figma `FilterCards` component) for
`CardFilter` items — Figma's nested `ListCards` slot maps to the `children`
you pass in. It stretches each child to an equal share of the available width
and owns the 16px gap between them — pure layout, no visual styling of its
own.

## When to use

- A row of stat/filter cards summarizing counts across a dashboard (e.g.
  "Total assets", "Active filters", "Pending").
- Any number of `CardFilter` children — the row redistributes width evenly as
  the count changes.

## When not to use

- For a single metric with no siblings — render a bare `CardFilter` instead.
- For a wrapping grid of cards — `FilterCards` is a single row, not a grid;
  use `Grid`/`Stack` for a wrapping layout.

## Examples

```tsx
import { FilterCards, CardFilter } from '@acronis-platform/ui-react';
import { SquareDashedIcon } from '@acronis-platform/icons-react/stroke-mono';

<FilterCards>
  <CardFilter label="Total assets" value="125" icon={<SquareDashedIcon />} />
  <CardFilter
    variant="clickable"
    label="Active filters"
    value="3"
    icon={<SquareDashedIcon />}
  />
  <CardFilter variant="static-empty" label="Pending" />
</FilterCards>;
```

## Overflow

Cards shrink to fill the row, but never below their own content's natural
width — a card's label/value is never clipped. If there are enough cards that
they no longer fit at that natural width, the row overflows its container.
`FilterCards` adds no scroll or wrap of its own — wrap the row in a
horizontally scrollable container if that's the desired behavior:

```tsx
<div className="overflow-x-auto">
  <FilterCards>{/* many cards */}</FilterCards>
</div>
```

## Parts

| Part   | Element | Description                                                                                       |
| ------ | ------- | ------------------------------------------------------------------------------------------------- |
| `root` | `<div>` | The row itself — flex, 16px gap, equal-width children.                                            |
| `card` | (any)   | Consumer-supplied children (typically `CardFilter`), stretched to fill an equal share of the row. |
