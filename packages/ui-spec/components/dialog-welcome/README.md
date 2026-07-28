# DialogWelcome

A second Dialog "recipe" alongside `Dialog` (DialogDefault): headerless, its
body is an image plus a centered title/description. The layout defaults to
being derived from slide count, but can be forced via the optional `variant`
prop (a real Figma component property):

- **Exactly one** `<DialogWelcomeSlide>` child renders the `single` layout —
  a call-to-action button and a "Close" button, stacked below the text.
- **2–5** children render the `carousel` layout — each slide keeps its own
  image/text, and navigation is the existing `DialogFooterCarousel`
  (Back/Next/Close + a one-dot-per-slide position indicator).
- Pass `variant="carousel"` or `variant="single"` to force that layout
  regardless of slide count — e.g. keep the carousel chrome for a single
  step in a multi-step flow. Forcing `single` with more than one real slide
  silently drops the rest.

## When to use

- A welcome/onboarding splash or a short feature-announcement modal, with or
  without multiple steps.

## When not to use

- For a dialog with a header/title bar, or one whose body is arbitrary
  content — use `Dialog` directly.
- If slide position needs to be a URL param — the `carousel` layout stays
  routing-agnostic; wire it yourself via `setApi` + `opts.startIndex`.
- No autoplay, no looping — this v1 supports neither.
- For more than 5 steps — DialogWelcome caps at 5 slides (renders only the
  first 5 beyond that).

## Slide count

`children` should resolve to between 1 and 5 `<DialogWelcomeSlide>`s — exactly
one selects the `single` layout, 2 or more select the `carousel` layout (whose
footer dot indicator renders exactly one dot per slide). Zero real slides
renders nothing; above 5, only the first 5 reach the Carousel.

## Parts

| Part                                | Purpose                                                                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------------------- |
| `DialogRoot`/`DialogContent`        | Modal chrome — overlay, focus trap, scroll lock (Dialog's own primitive parts; no header).         |
| `DialogWelcomeSlide`                | A slide's image + centered title/description.                                                      |
| CTA + Close buttons                 | `single` layout only — a primary call-to-action button and a ghost "Close" link, stacked/centered. |
| `Carousel` + `DialogFooterCarousel` | `carousel` layout only — the slide track and its Back/Next/Close + dot-indicator footer.           |

## Example

```tsx
import { DialogWelcome, DialogWelcomeSlide } from '@acronis-platform/ui-react';

// single layout
<DialogWelcome
  open
  onOpenChange={setOpen}
  aria-label="Welcome"
  onPrimaryAction={getStarted}
>
  <DialogWelcomeSlide
    image={<img src="/welcome.png" alt="" />}
    title="Welcome to the new dashboard"
    description="Here's a quick look at what's new."
  />
</DialogWelcome>;

// carousel layout
<DialogWelcome open onOpenChange={setOpen} aria-label="Onboarding tour">
  <DialogWelcomeSlide
    image={<img src="/step-1.png" alt="" />}
    title="Step one"
    description="…"
  />
  <DialogWelcomeSlide
    image={<img src="/step-2.png" alt="" />}
    title="Step two"
    description="…"
  />
  <DialogWelcomeSlide
    image={<img src="/step-3.png" alt="" />}
    title="Step three"
    description="…"
  />
</DialogWelcome>;
```
