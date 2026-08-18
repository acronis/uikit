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

**Given** items that are each wrapped in another element
**When** they render without an explicit `order`
**Then** every divider disappears, because each item is the last child of its
own wrapper. Passing `order` on each item restores them: `first` and `middle`
draw a divider unconditionally and `last` draws none, replacing the positional
derivation rather than layering on top of it.

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
token, and ignores both clicks and Enter/Space activation.

**Given** focus on the item before a disabled one
**When** Right Arrow is pressed
**Then** focus lands **on** the disabled item rather than skipping it. Per the
WAI-ARIA toolbar pattern a disabled item stays focusable (it is exposed as
`aria-disabled`, not the native disabled attribute) so a keyboard user can still
discover that the action exists and is unavailable.

**Given** a group whose **first** item is disabled
**When** Tab moves focus into it
**Then** focus lands on that first, disabled item and the group is reachable as
normal. This is the reason the item is never natively disabled: the roving
tabindex parks its single `tabindex="0"` on the first item, and a browser skips
a natively disabled button — which would leave every item unreachable and drop
the entire group out of the tab order.

**Given** the container with `disabled`
**When** the group renders
**Then** every item is disabled and marked as such for styling, whether or not
it sets `disabled` itself.
