# SegmentControl — Behavior

## Selection

**Given** a SegmentControl with items
**When** a user clicks an enabled item, presses `Space`, or navigates with an
arrow key
**Then** that item becomes the only selected item
**And** the group emits `value-change` with its value.

**Given** controlled `value`
**When** a user selects another item
**Then** the component emits `value-change`
**And** the visual selection changes only when the consumer updates `value`.

## Layout

**Given** one or two items
**When** `variant` is `hug` (the default)
**Then** the control takes only the width its content needs.

**Given** three or more items in an available row
**When** `variant` is `fill`
**Then** the control fills that row and direct items share its available width.

## Counter and disabled items

**Given** an item with `hasCounter` set to `true`
**When** it renders
**Then** its configured Tag follows the label within the item.

**Given** `counter` configuration without `hasCounter`
**When** the item renders
**Then** no Tag is rendered.

**Given** a disabled group or item
**When** the user attempts to select it
**Then** its value does not change and no value-change event is emitted.
