# DialogFooterCarousel2

**Experimental.** A bottom action bar for a multi-step (carousel) dialog: a
`Back` button, a dot slide indicator, and a `Next`/call-to-action button.
Parallel to a future carousel-dialog-footer primitive — not yet renamed or
kept as the permanent API. Built from scratch alongside `DialogWelcome2`;
does not reuse any existing carousel implementation in this repo.

## When to use

- The footer of a multi-step onboarding/welcome dialog driven by a real
  carousel engine (pair it with `DialogWelcome2`, which owns the Embla
  instance and threads this component's props).

## When not to use

- A dialog's ordinary action row (Cancel/Save) — use `DialogFooterDefault`.
- A standalone content carousel with no dialog chrome — this component is
  footer-shaped only.

## Parts

| Part          | Description                                                           |
| ------------- | --------------------------------------------------------------------- |
| boxLeft       | `Back` button. Hidden on the first slide (`variant="start"`).         |
| listIndicator | One dot per slide; clicking a dot jumps to that slide.                |
| boxRight      | `Next` (first/middle slide) or the call-to-action label (last slide). |

## Example

```tsx
import { DialogFooterCarousel2 } from '@acronis-platform/ui-react';

<DialogFooterCarousel2
  variant="middle"
  slideCount={3}
  selectedIndex={1}
  onSelectIndex={setSelectedIndex}
  onBack={() => embla.scrollPrev()}
  onNext={() => embla.scrollNext()}
/>;
```
