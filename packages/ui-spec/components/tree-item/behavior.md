# TreeItem — behavior

## Renders one row

- **Given** no props
  **Then** the row renders the expand chevron (`isExpandable` defaults to true),
  the default `title`, and an empty extras slot — exactly the Figma default.
- **Given** a `title`
  **Then** it renders in the row's remaining width and truncates rather than
  wrapping or widening the row.
- **Given** `hasIcon`
  **Then** the leading icon slot renders, using `icon` if supplied and the
  design's square-dashed placeholder otherwise.
- **Given** an `icon` **but not** `hasIcon`
  **Then** nothing renders — `hasIcon` is the gate, matching the Figma boolean.
- **Given** `hasCheckbox`
  **Then** the shared `Checkbox` renders before the icon, unlabelled, with its
  `aria-label` defaulting to `title`.
- **Given** `checkboxProps`
  **Then** they are forwarded verbatim to that checkbox, including an
  `aria-label` that overrides the `title` default. The row itself keeps no
  checked state.
- **Given** `isExpandable={false}`
  **Then** the chevron is not rendered and the row reads as a leaf.
- **Then** the slot order is always chevron, checkbox, icon, title, extras.

## The extras slot is gated, not hidden

- **Given** `children` **and** `hasExtras` (the default)
  **Then** the trailing slot renders them, reserving a 16px minimum so an empty
  slot still keeps a column of rows aligned.
- **Given** `children` **and** `hasExtras={false}`
  **Then** the slot and the children are removed from the DOM entirely — a
  button in there is not merely invisible, it does not exist, so it cannot be
  tabbed to.

## Selection is a prop, not an interaction

- **Given** `selected={false}` (the default)
  **Then** the row background is transparent.
- **Given** the pointer over the row
  **Then** the background takes the hover token — regardless of `selected`,
  since the design draws hover as its own swatch.
- **Given** `selected`
  **Then** the background takes the highlighted `--ui-background-surface-active`
  fill persistently, and the row carries `data-selected` so a consumer can key
  off it. This is the same fill the Figma `state=active` swatch previews.
- **Given** a click
  **Then** `onClick` fires and nothing else changes: the row does not select
  itself. Selection belongs to the tree the consumer composes.

## Expansion is not implemented here

- **Given** a click on the chevron
  **Then** nothing expands. The chevron is `aria-hidden` artwork; the row renders
  no nested list and emits no expand event, matching the Figma node, whose
  expandable slot has no interaction either.
- The consumer owns the expand state, renders the child level itself, and puts
  `aria-expanded` on the element it supplies through `render`.

## Focus

- **Given** the default rendering
  **Then** the row is not in the tab order — it sets no `tabIndex` and no role.
- **Given** a consumer-supplied `tabIndex` (or a composed focusable element)
  **Then** keyboard focus paints the library's standard 3px `--ui-focus-primary`
  ring, flush to the row's 2px radius. Mouse focus does not, because it is a
  `:focus-visible` ring.

## RTL

- **Given** `dir="rtl"`
  **Then** the whole row mirrors: the slot order, the gap, and the padding are
  all logical, and the chevron artwork itself flips via an explicit
  `rtl:rotate-180` — logical layout alone would leave it pointing the wrong way.

## Composition

- **Given** a `render` prop
  **Then** the rendered element is replaced (e.g. by `<li role="treeitem">`) and
  the row's props, classes, and data attributes merge onto it.
- **Given** native `<div>` attributes (`onClick`, `tabIndex`, `aria-*`,
  `className`)
  **Then** they pass through, and `className` merges with the row's own classes.

## Not owned here

- The tree: its `role="tree"` owner, indentation, `aria-level`, keyboard roving,
  and type-ahead. The consumer composes rows and supplies all of it.
- Expand/collapse state and the nested list.
- Selection state, single vs. multi-select, and the checkbox's checked value.
