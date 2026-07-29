# CarouselDialog2

**Experimental.** The control row inside a `DialogFooterCarousel2`: a `Back`
button, a dot slide indicator, and a `Next`/call-to-action button. Parallel to
a future carousel primitive — not yet renamed or kept as the permanent API.
Pure controls with no Embla import of its own; the slide count/index/callbacks
are threaded down from `DialogWelcome2`, which owns the carousel engine.

## When to use

- Inside `DialogFooterCarousel2`, which supplies the themed footer bar around
  this row. Not meant to be used standalone.

## When not to use

- A standalone content carousel with no dialog footer chrome.
- A dialog's ordinary action row (Cancel/Save) — use `DialogFooterDefault`.

## Parts

| Part          | Description                                                           |
| ------------- | --------------------------------------------------------------------- |
| boxLeft       | `Back` button. Hidden on the first slide (`variant="first"`).         |
| listIndicator | One dot per slide; clicking a dot jumps to that slide.                |
| boxRight      | `Next` (first/middle slide) or the call-to-action label (last slide). |

## Example

```tsx
import { CarouselDialog2 } from '@acronis-platform/ui-react';

<CarouselDialog2
  variant="middle"
  slideCount={3}
  selectedIndex={1}
  onSelectIndex={setSelectedIndex}
  onBack={() => embla.scrollPrev()}
  onNext={() => embla.scrollNext()}
/>;
```
