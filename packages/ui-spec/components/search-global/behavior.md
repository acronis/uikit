# SearchGlobal — behavior

Given/When/Then scenarios for the global search field.

## Typing updates the value

- **Given** a SearchGlobal,
- **When** the user types,
- **Then** the placeholder is replaced by the typed text and `change` fires on
  each keystroke (controlled or uncontrolled).

## The border reacts to interaction

- **Given** the field at rest (idle gradient border),
- **When** the user hovers it, presses it, or focuses the input,
- **Then** the border swaps to the hover gradient on `:hover`, the active gradient
  on `:active`, and on focus the box keeps the idle gradient and shows a 3px
  `--ui-focus-primary` ring (`:focus-within`).

## The shortcut hint is presentational

- **Given** the default `shortcut` of `⌘K`,
- **When** the field renders,
- **Then** the hint shows at the trailing edge as decorative (`aria-hidden`) text;
  it does not capture focus and does not bind a key on its own — the consumer
  wires the shortcut (e.g. focus the field, or open a command palette).
- **When** `shortcut` is `null`,
- **Then** no hint renders.

## Focus via ref

- **Given** a ref on the component,
- **When** the consumer calls `ref.current.focus()` (e.g. from a ⌘K handler),
- **Then** the input receives focus and the box shows the focus ring.
