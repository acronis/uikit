# ButtonGroup — Behavior

## Container styles

**Given** a button group
**When** `variant` is `outlined` (the default)
**Then** a 1px border and a 4px radius are drawn around the whole cluster, and
the first and last item's fill is clipped to those rounded corners.

**Given** a button group
**When** `variant` is `inlined`
**Then** no container border or radius is drawn, but the items and their
separators are unchanged — including the clipping behavior, which still applies
(there is simply no radius left to clip to).

## Separators

**Given** a group with two or more items
**When** it renders
**Then** every item except the last draws a hairline divider on its inline-end
edge, so exactly one divider sits between each adjacent pair and none is drawn
on the outer edges.

**Given** a group with exactly one item
**When** it renders
**Then** no divider is drawn — the only item is also the last item.

**Given** a group rendered under `dir="rtl"`
**When** it renders
**Then** the dividers move to the items' left edges and the item order mirrors,
because the divider is an inline-end border, not a right border.

## Activation

**Given** an enabled item
**When** it is clicked, or focused and activated with Enter or Space
**Then** its `click` handler fires.

**Given** an item
**When** the pointer hovers it
**Then** its fill changes to the hover fill; **when** it is being activated,
**then** its fill changes to the active fill. Neither state persists after
release — this component expresses transient action feedback, not selection.
For a persistent selected state, use a toggle group instead.

## Keyboard navigation

**Given** a group with three enabled items
**When** Tab moves focus into it
**Then** exactly one item receives focus and the group is a single Tab stop —
a second Tab leaves the group rather than moving to the next item.

**Given** focus on an item
**When** Right Arrow (or Down Arrow) is pressed
**Then** focus moves to the next item; **when** Left Arrow (or Up Arrow) is
pressed, **then** focus moves to the previous item.

**Given** focus on the last item and `loop-focus` left at its default
**When** Right Arrow is pressed
**Then** focus wraps to the first item. **When** `loop-focus` is `false`,
**then** focus stays on the last item.

**Given** focus on an item
**When** Home or End is pressed
**Then** focus does not move. This is a gap in the underlying Base UI toolbar
primitive, which does not forward its `enableHomeAndEndKeys` option — not a
deliberate choice.

## Disabled

**Given** an item with `disabled`
**When** the group renders
**Then** that item keeps its idle fill, dims its glyph to the disabled glyph
token, ignores clicks, and is skipped by both Tab and the arrow keys — arrow
navigation jumps over it to the next enabled item.

**Given** the container with `disabled`
**When** the group renders
**Then** every item is disabled and marked as such for styling, whether or not
it sets `disabled` itself.
