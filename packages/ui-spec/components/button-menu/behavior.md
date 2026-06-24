# ButtonMenu — Behavior

## Rendering

### Renders a label and a trailing chevron

**Given** a ButtonMenu with label content
**When** it renders
**Then** it shows the label followed by a chevron icon (16px)
**And** background, label, icon, and — for `secondary` — border resolve from
`--ui-button-menu-*` for the current variant and state.

## Open / closed

### Chevron reflects the open state

**Given** `open` is `false` (or unset)
**When** it renders
**Then** the chevron points **down** and `aria-expanded` is absent.

**Given** `open` is `true`
**When** it renders
**Then** the chevron points **up**, the container takes its `*-active` treatment,
and `aria-expanded="true"`.

## Interaction states

### Tracks each state from its own token

**Given** the button is idle, hovered, pressed, open, or disabled
**When** it renders
**Then** the container fill (and `secondary`'s label/icon/border) resolve from
the matching `*-idle` / `*-hover` / `*-active` / `*-disabled` token (brand/theme
overrides honored per state). `primary` keeps a single label/icon color.

### Disabled suppresses click

**Given** a ButtonMenu with `disabled`
**When** the user activates it
**Then** no `click` is emitted and the disabled tokens apply (not opacity).

## Composition

### Renders as another element

**Given** a `render` prop (React)
**When** it renders
**Then** the classes/props merge onto that element (e.g. a menu trigger), so the
button can drive a Base UI menu while keeping its visual contract.
