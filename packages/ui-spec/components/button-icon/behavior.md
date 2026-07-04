# ButtonIcon — Behavior

## Rendering

### Renders a square icon-only button

**Given** a ButtonIcon with a single icon child
**When** it renders
**Then** it is a 32×32 square with the icon centered at 16px
**And** background, glyph, and border resolve from `--ui-button-icon-*` for the
current state.

## Interaction states

### Tracks each state from its own token

**Given** the button is idle, hovered, activated, or disabled
**When** it renders
**Then** background, glyph, and border each resolve from the matching
`*-idle` / `*-hover` / `*-active` / `*-disabled` token (brand/theme overrides
honored per state).

### Disabled suppresses click

**Given** a ButtonIcon with `disabled`
**When** the user activates it
**Then** no `click` is emitted and the disabled tokens apply (not opacity).

## Composition

### Renders as another element

**Given** a `render` prop (React)
**When** it renders
**Then** the classes/props merge onto that element (e.g. an `<a>`).
