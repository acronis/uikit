# AccordionContainer — accessibility

- Built on Base UI's Collapsible when `collapsible` is true: the trigger is a
  `<button>` with `aria-expanded` and `aria-controls` pointing at the panel,
  toggled with Enter/Space. Focus stays on the trigger.
- The trigger renders only an icon (no text). It falls back to
  `aria-label="Toggle"` when the consumer supplies neither `aria-label` nor
  `aria-labelledby`, so the default rendering always has an accessible name —
  but the consumer composing it into a header should still override it (e.g.
  `aria-labelledby` pointing at the surrounding heading/title) for a
  meaningful name.
- When `collapsible` is false there is no interactive element at all — content
  renders as if there were no disclosure.

## Keyboard

- Enter/Space toggles the trigger when focused.
- No other keyboard behavior is added; focus order follows source order.

## Screen reader

- The trigger's `aria-expanded` state is announced on toggle. The panel's
  content is only reachable via normal document flow (no `aria-hidden`
  toggling beyond what Base UI's Collapsible manages internally).

## Contrast

The trigger's chevron uses `--ui-glyph-on-surface-neutral-dark`, which meets
WCAG AA against a surface background in both light and dark themes.
AccordionContainer adds no other color; contrast for everything else is
governed by whatever the consumer places inside it.
