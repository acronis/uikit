# DialogWelcome — Accessibility Requirements

DialogWelcome inherits Dialog's accessibility contract for focus trap, scroll
lock, `role="dialog"`, and Esc-to-close — see Dialog's own `accessibility.md`
for that baseline. **Naming does not carry over unchanged**: plain Dialog is
named via a consumer-rendered `DialogTitle`, but DialogWelcome has no header
slot at all (in either layout). **Name the dialog** by passing `aria-label`
(or `aria-labelledby`, referencing an element id rendered inside a slide) —
without one, the dialog has no accessible name. This file covers naming plus
what DialogWelcome adds on top of Dialog: the two layouts and their controls.

## ARIA Roles and Attributes

### Name

- **Required**: `aria-label` or `aria-labelledby`, forwarded to
  `DialogContent`. Neither is set by default.

### Single layout

- The CTA and Close controls are plain `Button`s (one `variant="default"`,
  one `variant="ghost"`) — see Button's own accessibility spec for their
  roles/states.

### Carousel layout (content + footer)

- The slide track is `role="region"` / `aria-roledescription="carousel"`,
  each slide is `role="group"` / `aria-roledescription="slide"` — same as
  Carousel's own spec.
- See `DialogFooterCarousel`'s own `accessibility.md` for its Back/Next/Close
  controls and the position list (one item per real slide).

---

## Keyboard Navigation

| Key         | Element                                  | Action                                     |
| ----------- | ---------------------------------------- | ------------------------------------------ |
| Esc         | Anywhere in the dialog                   | Closes the dialog (Dialog's own behavior)  |
| Tab         | CTA/Close (single) or footer (carousel)  | Moves focus between the visible controls   |
| Enter/Space | Any button                               | Activates the focused control              |
| ArrowLeft   | Anywhere in the Carousel (carousel only) | Scrolls to the previous slide (horizontal) |
| ArrowRight  | Anywhere in the Carousel (carousel only) | Scrolls to the next slide (horizontal)     |

---

## Screen Reader Requirements

1. The dialog announces as a modal dialog **with the name supplied via
   `aria-label`/`aria-labelledby`** — omitting both leaves it announcing as
   an unnamed dialog (WCAG 4.1.2).
2. In the `single` layout, the CTA and Close buttons announce as buttons with
   their visible labels.
3. In the `carousel` layout, the slide track announces its role description
   ("carousel"); each slide announces as a group with the role description
   "slide". The footer's Back/Next/Close controls and position indicator
   announce as described in `DialogFooterCarousel`'s own accessibility spec.
4. DialogWelcome adds no live-region announcement of the current slide index
   beyond what the carousel footer's `aria-current` position indicator
   already provides.

---

## Testing Checklist

- [ ] Opening focuses inside the popup and traps focus (Dialog's own behavior)
- [ ] The dialog has an accessible name when `aria-label`/`aria-labelledby` is passed
- [ ] Esc closes the dialog from anywhere inside it
- [ ] Single layout: the Close button closes the dialog; the CTA button fires
      `onPrimaryAction` without closing it
- [ ] Carousel layout: ArrowLeft/ArrowRight scroll the Carousel when focus is
      inside it
- [ ] Carousel layout: the footer's Close control (last slide, or the only
      slide when there is exactly one) closes the dialog
- [ ] Every rendered control is reachable via Tab and activatable via Enter/Space
