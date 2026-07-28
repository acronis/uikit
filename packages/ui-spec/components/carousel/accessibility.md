# Carousel — Accessibility Requirements

Loosely follows the [WAI-ARIA carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) —
a region of slides with next/previous navigation. This is a design-pending v1
without autoplay, slide-position announcements, or a "pause" affordance; add
those (and their corresponding ARIA) if autoplay is introduced later.

## ARIA Roles and Attributes

### Root

| Attribute              | Value        | Reason                                            |
| ---------------------- | ------------ | ------------------------------------------------- |
| `role`                 | `"region"`   | Groups the slider as a landmark                   |
| `aria-roledescription` | `"carousel"` | Identifies the region's purpose to screen readers |

### Item (`item` part)

| Attribute              | Value     | Reason                           |
| ---------------------- | --------- | -------------------------------- |
| `role`                 | `"group"` | Groups each slide's content      |
| `aria-roledescription` | `"slide"` | Identifies each group as a slide |

### Previous / next (`previous` / `next` parts)

- Each is a native `<button>` (via `ButtonIcon`) with its own `aria-label`
  (`"Previous slide"` / `"Next slide"`) — no separate prop is required to
  supply an accessible name.
- `disabled` is set from Embla's `canScrollPrev()`/`canScrollNext()`, so an
  edge control is unreachable rather than a no-op when the browser doesn't
  yet support it. This is only correct because the root does **not** loop by
  default (`opts.loop` unset) — with `loop: true`, both stay enabled and the
  disabled state never applies.

---

## Keyboard Navigation

| Key         | Element        | Action                                     |
| ----------- | -------------- | ------------------------------------------ |
| Tab         | Previous/Next  | Moves focus to/from the nav controls       |
| Enter/Space | Previous/Next  | Activates the focused control              |
| ArrowLeft   | Root (focused) | Scrolls to the previous slide (horizontal) |
| ArrowRight  | Root (focused) | Scrolls to the next slide (horizontal)     |

The root captures arrow keys via `onKeyDownCapture` regardless of which
descendant has focus, so arrow-key navigation works once focus is anywhere
inside the carousel — not only when a nav control itself is focused.

---

## Screen Reader Requirements

1. The region announces its role description ("carousel").
2. Each slide announces as a group with the role description "slide".
3. The previous/next controls announce their own label ("Previous slide" /
   "Next slide") and their disabled state at the ends (non-looping mode).
4. Slide content is otherwise announced exactly as authored — Carousel adds
   no live-region announcement of the current slide index in this v1.

---

## Color and Contrast

Carousel itself paints no color (pure layout). The previous/next controls
inherit `ButtonIcon`'s contrast guarantees (icon vs. idle/hover/disabled
background, and the 3px `--ui-focus-primary` focus ring) — see that
component's own accessibility spec. Slide content is responsible for its own
contrast.

---

## Testing Checklist

- [ ] Root has `role="region"` and `aria-roledescription="carousel"`
- [ ] Each item has `role="group"` and `aria-roledescription="slide"`
- [ ] Previous/next controls have distinct accessible names
- [ ] Previous is disabled on the first slide (non-looping); next is disabled
      on the last slide
- [ ] With `loop: true`, neither control is ever disabled
- [ ] ArrowLeft/ArrowRight scroll the track when focus is inside the carousel
- [ ] All nav controls are reachable via Tab and activatable via Enter/Space
