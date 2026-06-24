# CardFilter — Behavior

## Rendering

**Given** a CardFilter with `label` and `value`
**When** it renders with the default `variant="static"`
**Then** the label appears above the value, the value uses the static idle color,
and the card is a presentational `<div>` (no interaction states).

**Given** `variant="static-empty"`
**When** it renders
**Then** no icon is shown and the value is a muted em-dash (`–`) regardless of the
`value` prop — the empty-state placeholder.

**Given** an `icon`
**When** the variant is `static` or `clickable`
**Then** the icon (16px) is rendered before the value with an 8px gap. The icon is
ignored for `static-empty`.

## Interaction (clickable only)

**Given** `variant="clickable"`
**When** it renders
**Then** the card is a native `<button>`, the value uses the link color, and the
card exposes hover, active, and focus-visible treatments.

**Given** a clickable CardFilter
**When** the pointer hovers / presses it
**Then** the container fill and border shift to their `*-hover` / `*-active` tokens.

**Given** a clickable CardFilter
**When** it receives keyboard focus
**Then** a 3px `--ui-focus-primary` ring is painted flush to the edge and the
border takes its focused token; the ring is suppressed for pointer focus.

**Given** a clickable CardFilter
**When** it is activated (click, Enter, or Space)
**Then** a `click` event fires.

**Constraint:** `static` and `static-empty` are non-interactive — they have no
state other than idle (mirrors the Figma constraint).

## Composition

**Given** a `render` prop (e.g. `<a href>`)
**When** the CardFilter renders
**Then** it renders as that element with the card's classes and props merged on —
e.g. a clickable filter that navigates as a link.
