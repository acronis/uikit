# ButtonIconMenu — Behavior

## Rendering

### Renders a bordered square carrying the ellipsis glyph

**Given** a ButtonIconMenu
**When** it renders
**Then** it shows a 32×32 button with a 1px border and a centered 16px ellipsis
glyph
**And** background, glyph, and border resolve from the `--ui-button-icon-*`
tokens for the current state.

### The glyph is fixed

**Given** a consumer that needs a different icon
**When** they reach for this component
**Then** it offers no content slot — the design pins the ellipsis. Use
**ButtonIcon** instead.

## Open / closed

### Open applies the active treatment

**Given** `open` is `false` (or unset)
**When** it renders
**Then** the idle tokens apply and `aria-expanded` is absent.

**Given** `open` is `true`
**When** it renders
**Then** the container fill, glyph, and border take their `*-active` tokens and
`aria-expanded="true"`.

## Interaction states

### Tracks each state from its own token

**Given** the button is idle, hovered, pressed, open, or disabled
**When** it renders
**Then** the container fill, glyph color, and border color resolve from the
matching `*-idle` / `*-hover` / `*-active` / `*-disabled` token, so brand and
theme overrides are honored per state. Pressed and open share the `*-active`
tokens, as the design does.

### Disabled suppresses click

**Given** a ButtonIconMenu with `disabled`
**When** the user activates it
**Then** no `click` is emitted and the disabled tokens apply (not opacity).

## Composition

### Renders as another element

**Given** a `render` prop (React)
**When** it renders
**Then** the classes and props merge onto that element (e.g. a Base UI menu
trigger), so the button can drive a real menu while keeping its visual contract.
