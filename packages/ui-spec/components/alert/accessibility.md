# Alert — accessibility

- The root carries `role="alert"`, so screen readers announce its content when it
  appears. Use it for important, time-sensitive messages; for non-urgent status,
  pass `role="status"` so it is announced politely instead of assertively.
- `role="alert"` implies `aria-live="assertive"`, which interrupts the user. Do
  not render a batch of alerts at once, and do not re-mount one on every keystroke.
- Don't rely on color alone to signal severity. Each variant pairs its color with
  a distinct icon **shape** (circle-info, circle-check, triangle, circle-warning,
  diamond) and the title text carries the meaning in words.
- The status icons are decorative — the title and description carry the message —
  so they contribute no accessible name. Supply your own labelled glyph via
  `AlertIcon` children if it conveys something the text doesn't.

## Keyboard

| Key               | Action                                                                     |
| ----------------- | -------------------------------------------------------------------------- |
| `Tab`             | Moves through the action buttons, then the dismiss control (source order). |
| `Enter` / `Space` | Activates the focused action or dismiss control.                           |

The banner itself is not focusable — only its controls are.

## Screen reader

- The whole banner's text is announced on insertion, so keep the title short and
  put detail in the description.
- `AlertClose` needs an accessible name; it defaults to `"Close"` and is
  overridable via the `ariaLabel` prop for localization.

## Contrast

Text sits on the neutral surface (`--ui-alert-global-container-background`) using
the shared title/description colors, so contrast does not vary by severity. The
severity colors are used only on the border and the status line — both
non-text, so they are held to the 3:1 non-text contrast requirement rather than
4.5:1. The status line's 6px width also makes severity distinguishable without
reading color at all.
