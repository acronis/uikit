# Link — Behavior

## Rendering

**Given** an `href` and a label
**When** the link renders
**Then** it is an `<a role="link">` with the label in `--ui-link-color-idle` (semibold,
no underline).

**Given** `external`
**Then** a trailing external-link icon is appended (`--ui-link-external-icon-color-*`).

## Interaction

**Given** the link
**When** the pointer hovers
**Then** the text shifts to `--ui-link-color-hover` and the
`--ui-link-text-decoration-hover` underline appears (the icon shifts to its hover
color).

**Given** the link
**When** it is pressed (`:active`)
**Then** the text/icon shift to their `-active` color.

**Given** the link
**When** it receives keyboard focus
**Then** a 3px `--ui-focus-primary` ring is shown.

**Given** the link
**When** activated (click / Enter)
**Then** the native `click` fires and the browser navigates to `href`.

## Disabled

**Given** `disabled`
**When** the link renders
**Then** it uses `--ui-link-color-disabled`, drops its `href`, sets
`aria-disabled="true"` and `tabindex="-1"`, and does not navigate or underline.

## Composition

**Given** a `render` prop (e.g. a router link component)
**When** the link renders
**Then** it renders as that element with the Link's classes/props merged on (Base UI
`useRender`), so client-side routing works while keeping the Link styling.
