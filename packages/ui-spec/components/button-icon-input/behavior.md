# ButtonIconInput — Behavior

## Rendering

### Renders a compact icon-only button

**Given** a ButtonIconInput with a single icon child
**When** it renders
**Then** it is a 20×20 square with the icon centered at 16px
**And** background, glyph, and (for `error`) container/glyph tone resolve from
`--ui-button-icon-input-*` for the current variant and state.

## Interaction states

### Tracks each state from its own token, per variant

**Given** the button is idle, hovered, or activated
**When** it renders
**Then** background and glyph each resolve from the matching `*-idle` /
`*-hover` / `*-active` token **for the current `variant`** (`normal` or
`error` — they don't share a token tier).

### Disabled always uses the `normal` disabled tokens

**Given** a ButtonIconInput with `disabled`, regardless of `variant`
**When** it renders
**Then** background and glyph resolve from
`--ui-button-icon-input-normal-container-color-disabled` /
`-normal-icon-color-disabled` — the design defines no separate disabled
treatment for `error`.

### Disabled suppresses click

**Given** a ButtonIconInput with `disabled`
**When** the user activates it
**Then** no `click` is emitted.

## Composition

### Renders as another element

**Given** a `render` prop (React)
**When** it renders
**Then** the classes/props merge onto that element (e.g. an `<a>`).
