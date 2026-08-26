# TenantSearchPopover — Behavior

## Opening / closing

**Given** a closed panel
**When** the user activates the `trigger` (click, or Space / Enter while it has focus)
**Then** the popover opens, positioned by the popover positioner (`side="bottom"`,
`align="start"`, `sideOffset={4}` by default), emits `open-change(true)`, and focus
moves into the panel.

**Given** an open panel
**When** the user presses Escape or presses outside the panel
**Then** it closes, emits `open-change(false)`, and focus returns to the `trigger`.

**Given** a controlled `open`
**When** the user activates the `trigger`
**Then** the internal value does not change on its own — `open-change` fires and the
consumer must update `open`. Open state belongs to the popover root, not to the panel
content.

## Sections

**Given** `items` and no `recent-items` (or an empty array)
**Then** only the browse `section` renders — one `section-label` ("Browse" by default)
and one `tree` beneath it.

**Given** a non-empty `recent-items`
**Then** a recent `section` renders **above** browse, with its own `section-label`
("Recent") and its own sibling `tree`. Keyboard roving spans both trees as one
sequence, top to bottom.

## Searching

**Given** the `search` row and an uncontrolled `query`
**When** the user types
**Then** `query-change(text)` fires, and both sections re-filter: a node is kept when
its own label contains the query case-insensitively, or when any descendant matches —
in which case the ancestors on the path to that match are kept so it stays reachable.
A node that matches itself keeps its whole subtree.

**Given** an active query
**Then** every remaining node counts as expanded regardless of the user's own
`expanded` set, so matches are visible without any further interaction. Clearing the
query restores the set the user had built by hand.

**Given** a controlled `query`
**When** the user types
**Then** the panel renders the prop verbatim and only emits `query-change`; the
consumer owns the text.

## Expanding / collapsing

**Given** an `item` with a non-empty `children` array
**Then** it renders as an `expander` row — the whole row surface is the toggle, and it
is **not** selectable.

**Given** a collapsed `expander`
**When** the user clicks it, or presses Enter / Space / Arrow Right on it
**Then** `aria-expanded` becomes `true` and the child `group` mounts below it.

**Given** an expanded `expander`
**When** the user clicks it again, or presses Arrow Left on it
**Then** the `group` unmounts. Collapsing never changes the selection.

**Given** an expanded `expander` with focus
**When** the user presses Arrow Right
**Then** focus moves to the first row inside its `group` (expand first, descend
second).

## Selecting

**Given** a leaf `item` (no children)
**When** the user clicks it, or presses Enter / Space on it
**Then** `value-change(id)` fires with that item's `id`.

**Given** `value` equals a leaf row's `id`
**Then** that row carries `data-selected`, takes the selected container tint, and shows
the trailing check `indicator`. Selection is single — setting a new `value` clears the
previous row's indicator.

**Given** an `expander` row
**When** it is clicked or activated
**Then** `value-change` never fires — see "Documented limitations".

## Status regions

**Given** `status="loading"`
**Then** the sections are replaced by the `status` block: a spinner plus
`loading-label` ("Data is loading…"). The `search` row stays mounted above it.

**Given** `status="empty"`
**Then** the `status` block shows the blue inbox badge plus `empty-label`
("No data found").

**Given** `status="error"`
**Then** the `status` block shows the yellow warning badge, `error-label`
("Something went wrong.") and the `retry` action labelled `retry-label`
("Try again").

**Given** `status="idle"` (the default, Figma's `data` variant)
**Then** the sections render.

**Given** `status="idle"` and a query that matches nothing in either section
**Then** the `status` block renders in its **empty** form using `empty-label`, because
"no rows to show" is the same surface whatever produced it. This is runtime behavior
inferred from the design, not a variant the Figma node draws.

**Given** `status` is anything other than `idle`
**Then** it wins over the query — an explicit `loading` or `error` is never overridden
by the filter result.

## Retry

**Given** the `error` status and an `on-retry` handler
**When** the user activates the `retry` action (click, or Enter / Space — it is a real
button)
**Then** `retry` fires. The panel does not change `status` itself; the consumer
re-fetches and moves `status` to `loading` and then `idle` or `error` again.

**Given** the `error` status and **no** `on-retry` handler
**Then** the action still renders and is focusable but does nothing — supply the
handler whenever the state is reachable.

## Documented limitations

- **Only leaves are selectable.** A node with `children` is a toggle, never a
  selection target, so a tenant that both has sub-tenants and should be pickable
  cannot be expressed in this version. Model it as a leaf (drop `children`) or wait
  for a selectable-parent follow-up.
- **The expander chevron does not mirror in RTL.** See
  [accessibility.md](./accessibility.md).
