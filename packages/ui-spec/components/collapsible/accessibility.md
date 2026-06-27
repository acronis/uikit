# Collapsible — accessibility

- Built on Base UI's Collapsible: the trigger is a `<button>` with
  `aria-expanded` and `aria-controls` pointing at the panel, toggled with
  Enter/Space. Focus stays on the trigger.
- Give the trigger a clear text label describing what it reveals.

## Contrast

Collapsible adds no color of its own; contrast is governed by the content the
caller places inside it.
