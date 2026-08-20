# Link — Behavior

## Rendering

**Given** an `href` and a label
**When** the link renders
**Then** it is an `<a role="link">` with the label in `--ui-link-normal-text-color-idle` (semibold,
no underline).

**Given** `external`
**Then** a trailing external-link icon is appended (`--ui-link-normal-external-icon-color-*`).

## Surface (`variant`)

**Given** no `variant`
**Then** the link uses the `normal` surface — the `--ui-link-normal-*` token set.

**Given** `variant="inverse"`
**When** the link renders on a backdrop/scrim or dark brand surface
**Then** every state resolves its text color against
`--ui-link-inverse-text-color-{idle,hover,active}` instead. Text decoration and the
focus ring are shared with the `normal` surface (`--ui-link-global-text-decoration-*`,
`--ui-focus-primary`).

**Given** `variant="inverse"` **and** `external`
**When** the link renders
**Then** no external icon is appended — the design defines the icon layer only on the
`normal` surface, so `external` is a no-op here (as it is on an inverse Figma
instance). The link is text-only.

## Interaction

**Given** the link
**When** the pointer hovers
**Then** the text shifts to `--ui-link-normal-text-color-hover` and the
`--ui-link-global-text-decoration-hover` underline appears (the icon shifts to its hover
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
**Then** it uses `--ui-link-normal-text-color-disabled`, drops its `href`, sets
`aria-disabled="true"` and `tabindex="-1"`, and does not navigate or underline.

**Given** `disabled` **and** `variant="inverse"`
**When** the link renders
**Then** `disabled` has no effect whatsoever: the link keeps its `href`, sets no
`aria-disabled`, stays in the tab order, and hovers, underlines and navigates exactly
like an enabled one. The Figma set has only four enabled inverse variants and marks the
fifth unsupported ("disable state not supported onBackdrop"), so the prop is discarded
rather than applied without its color. A link that must be inert on a backdrop should be
omitted from the UI instead.

## Composition

**Given** a `render` prop (e.g. a router link component)
**When** the link renders
**Then** it renders as that element with the Link's classes/props merged on (Base UI
`useRender`), so client-side routing works while keeping the Link styling.
