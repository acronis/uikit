# DialogFooterCarousel — Accessibility Requirements

## ARIA Roles and Attributes

### Back / Next / Close (`back` / `next` / `close` parts)

- Each is a native `<button>` (via `Button`) with a visible label (default
  "Back" / "Next" / "Close", overridable via the `backLabel` / `nextLabel` /
  `closeLabel` props — see `api.yaml`) that also serves as its accessible name.
- `close` composes `Button` with `DialogClose` via Base UI's `render` prop,
  so it inherits `DialogClose`'s own dialog-closing behavior and any ARIA it
  contributes.

### Slide position indicator (`dots` part)

| Attribute      | Value                                             | Reason                                                    |
| -------------- | ------------------------------------------------- | --------------------------------------------------------- |
| `role`         | `"list"` (container)                              | Groups the position slots (one per real slide)            |
| `aria-label`   | `positionLabel` prop (default `"Slide position"`) | Names the group for screen readers                        |
| `role`         | `"listitem"` (each dot)                           | Identifies each slot as a list member                     |
| `aria-current` | `"true"` (active slot)                            | Marks which slot reflects the real `selectedScrollSnap()` |

The visible circle inside each slot is `aria-hidden` — it is decorative; the
position information is carried by `aria-current` on the `listitem` slot,
not by the circle's own color.

---

## Keyboard Navigation

| Key         | Element             | Action                           |
| ----------- | ------------------- | -------------------------------- |
| Tab         | Back / Next / Close | Moves focus between the controls |
| Enter/Space | Back / Next / Close | Activates the focused control    |

The dots are not focusable or interactive — they are a status indicator, not
a set of navigation controls (there is no design for clicking a dot to jump
to that slide).

---

## Screen Reader Requirements

1. Back/Next/Close announce their own visible label as their accessible name.
2. The position indicator announces as a list of items (one per real slide),
   with the current one marked via `aria-current`.
3. Closing the dialog is a normal Base UI dialog-close interaction — the
   receiving Dialog owns any close announcement.

---

## Color and Contrast

Back/Next/Close inherit `Button`'s own contrast guarantees (its spec owns the
full state-token set). The dots' active-vs-idle distinction is a color-only
signal on each circle itself (solid vs. dimmer tone) — see `tokens.yaml` for
the two tokens involved; both are drawn from the already-audited `ButtonIcon`
tier.

---

## Testing Checklist

- [ ] First state: no Back button; Next button present; dot at index 0 marked current
- [ ] Middle state: Back and Next both present; dot at the current index marked current
- [ ] Last state: Back and Close present, no Next; dot at the last index marked current
- [ ] The number of `listitem` dots always equals the real slide count
- [ ] Activating Close (last state) closes the ambient Dialog
- [ ] All rendered controls are reachable via Tab and activatable via Enter/Space
