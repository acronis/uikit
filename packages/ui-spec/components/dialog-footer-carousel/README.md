# DialogFooterCarousel

The footer bar for `DialogWelcome`'s `carousel` layout: a Back/Next/Close
action pair flanking a slide-position indicator with one dot per real slide. Renders
inside a `<Carousel>` and derives its first/middle/last treatment, and its
dot count/active index, from that Carousel's own context — it takes no
`variant` prop.

> Backed by two real Figma nodes (the wrapping bar and its inner row) — see
> `tokens.yaml` for the full token set, including the footer bar's own
> geometry/fill.

## When to use

- As the footer of `DialogWelcome`'s `carousel` layout — it is normally not
  used standalone.

## When not to use

- For a plain (non-dialog) `Carousel`'s navigation — use `CarouselPrevious`/
  `CarouselNext` instead; this footer's Close action assumes a Dialog
  ancestor.
- If the design calls for clickable position dots (jump-to-slide) — this
  v1's dots are a non-interactive status indicator only.

## Parts

| Part    | Element (default)                   | Purpose                                                                                                                       |
| ------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `back`  | `button` (`Button`)                 | Scrolls to the earlier slide. Hidden on the first slide.                                                                      |
| `dots`  | `div`                               | Slide-position indicator (one dot per slide); the active dot's own circle is solid, idle dots are dimmer — no container fill. |
| `next`  | `button` (`Button`)                 | Scrolls to the later slide. Hidden on the last slide.                                                                         |
| `close` | `button` (`Button` + `DialogClose`) | Closes the ambient Dialog. Shown only on the last slide, in `next`'s place.                                                   |

## Example

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  DialogFooterCarousel,
} from '@acronis-platform/ui-react';

<Carousel opts={{ startIndex: 0 }}>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
    <CarouselItem>Slide 3</CarouselItem>
  </CarouselContent>
  <DialogFooterCarousel />
</Carousel>;
```

Normally you won't reach for this directly — pass 2 or more
`DialogWelcomeSlide` children to `DialogWelcome`, which composes a
`Carousel` and this footer for you.

## Localization

The repo has no i18n library, so this component's own visible/accessible
text is overridable via props rather than baked in: `backLabel`/`nextLabel`/
`closeLabel` (default "Back"/"Next"/"Close") and `positionLabel` (the `dots`
list's `aria-label`, default "Slide position"). See `api.yaml`.

```tsx
<DialogFooterCarousel
  backLabel="Précédent"
  nextLabel="Suivant"
  closeLabel="Fermer"
  positionLabel="Position de la diapositive"
/>
```
