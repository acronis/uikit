# Timer — Accessibility

- **Roles:** the readout is `role="timer"` — a live-region role for a numeric
  counter of elapsed or remaining time. The action cluster is the ButtonGroup's
  `role="toolbar"`. The container itself carries no role; it is a box, not a
  widget. The divider is a CSS border rather than an element, so it correctly
  contributes nothing to the accessibility tree.

- **Live-region politeness:** `role="timer"` is implicitly `aria-live="off"`,
  which is the right default: a per-second announcement would flood a screen
  reader and drown out everything else on the page. Do **not** raise it to
  `polite` for a ticking clock. If a milestone matters (a limit reached, a
  session about to expire), announce that event from a separate status region
  rather than making the timer itself chatty.

- **Accessible name — readout:** optional. The value speaks for itself in most
  contexts; where several timers appear together, name each one by putting
  `aria-labelledby` on the container's own visible label, or pass `aria-label`
  through to the container.

- **Accessible name — action cluster:** supplied by `actions-label`, which
  defaults to the English string `Timer actions`. Translate it. The property
  exists precisely because the caller cannot reach the toolbar element directly.

- **Accessible name — actions:** each action is icon-only, so it has no text to
  name it. Every one MUST be given an `aria-label` (or `aria-labelledby`);
  decorative glyphs inside stay `aria-hidden`. A play/pause action's name must
  track its current function ("Pause" while running, "Resume" while paused), not
  its icon.

- **Keyboard:** the timer adds no key handling of its own. The action cluster is
  a **single Tab stop** with a roving tabindex — Tab enters it and the next Tab
  leaves; the arrow keys move between actions; Enter and Space activate. See the
  ButtonGroup spec for the full pattern, including how a disabled action stays
  focusable.

- **Focus visibility:** an action's focus ring is drawn inset, so the
  container's clipping cannot shave it off at the rounded corners.

- **Contrast:** the readout uses `--ui-timer-value-color` on
  `--ui-timer-container-color` and the action glyphs use
  `--ui-glyph-on-surface-primary`; both pairs meet WCAG AA in the light and dark
  themes of every shipped brand. The divider and the container border are
  decorative hairlines and are not held to a text-contrast ratio.

- **Text sizing:** the readout is 18px with a 24px line-height inside a 32px
  box. It scales with the user's font size; the container's height token is the
  design's fixed 32px, so a large browser zoom scales the whole box rather than
  clipping the digits.

- **Motion:** none. The value updates are plain text changes with no transition,
  so nothing here is affected by `prefers-reduced-motion`.
