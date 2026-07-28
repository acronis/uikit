# Carousel

A scrollable, paged sequence of slides with previous/next navigation, built on
[Embla](https://www.embla-carousel.com/). Composable from parts; no variants.

> **Status: draft (design-pending v1). Internal — not exported from the
> package.** Ported from the legacy `@acronis-platform/shadcn-uikit`
> `Carousel`. There is no `--ui-carousel-*` token tier yet — the track/item
> carry no color at all, and the previous/next controls reuse the
> already-tokenized `ButtonIcon` rather than inventing a carousel-specific
> palette. `Carousel`/`CarouselContent`/`CarouselPrevious`/`CarouselNext`/
> `useCarousel` aren't part of `@acronis-platform/ui-react`'s public API — only
> `DialogWelcome`'s `carousel` layout composes them (`CarouselItem` and the
> `CarouselApi` type are re-exported for building its slides). Reconcile against Figma with
> `/figma-component Carousel <url> --update` once a mockup lands, and revisit
> whether to make this public then.

## When to use

- Stepping through a small set of self-contained items (cards, images, tips)
  one (or a few) at a time, where the user drives navigation.
- Horizontal or vertical paging where only a handful of items are visible at
  once and total item count is known ahead of render.

## When not to use

- For an unbounded, filterable, or sortable list — use **Table**/**DataTable**.
- For a single overlay presenting one thing at a time — use **Dialog**/**Sheet**.
- For continuous, unpaged scrolling of overflow content — use **ScrollArea**.
- If autoplay, slide-position indicators, or drag-to-swipe are required —
  this v1 supports none of them (Embla plugins can add them; not wired here).

## Parts

| Part               | Element (default)       | Purpose                                                    |
| ------------------ | ----------------------- | ---------------------------------------------------------- |
| `Carousel`         | `div`                   | Root — owns the Embla instance, orientation, keyboard nav. |
| `CarouselContent`  | `div`                   | The scrollable track wrapping the items.                   |
| `CarouselItem`     | `div`                   | A single slide; holds arbitrary content.                   |
| `CarouselPrevious` | `button` (`ButtonIcon`) | Scrolls to the earlier slide; disabled at the start.       |
| `CarouselNext`     | `button` (`ButtonIcon`) | Scrolls to the later slide; disabled at the end.           |

## Example

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  Card,
  CardContent,
} from '@acronis-platform/ui-react';

<Carousel className="w-full max-w-xs">
  <CarouselContent>
    {items.map((item) => (
      <CarouselItem key={item.id}>
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
            {item.label}
          </CardContent>
        </Card>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>;
```

Multiple items per view: add a basis utility to each `CarouselItem`
(`className="md:basis-1/2"`) and a matching negative-margin/padding pair on
`CarouselContent`/`CarouselItem` (see the `MultipleItems` story). Looping:
pass `opts={{ loop: true }}` on the root.
