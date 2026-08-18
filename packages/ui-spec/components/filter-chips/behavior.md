# FilterChips — behavior

`FilterChips` is a layout composition: it renders whatever chips and actions the
consumer passes in and owns no state of its own. The scenarios below describe
the contract the parts establish together; the chip's own remove button and the
reset button's press feedback are specified in Chip's and Button's behavior docs.

## Layout

**Given** a `FilterChips` root containing a `FilterChipsList`
**When** the list holds several chips
**Then** the chips sit in a single row 8px apart, vertically centered against the
32px row height (the reset button's height), and the root leaves 16px between the
list and any sibling placed beside it.

**Given** a `FilterChipsList` whose chips exceed the available width
**When** the row is laid out
**Then** the chips wrap onto additional lines, keeping the same 8px gap between
lines, and the wrapped lines stay centered against the row (`content-center`).
The component never clips a chip and never scrolls; the row grows taller instead.

**Given** a chip whose label is wider than the space available to it
**When** the row is laid out
**Then** the chip truncates its own label with an ellipsis rather than pushing the
row wider — see Chip's spec.

## Removing a single filter

**Given** a removable `Chip` inside the list
**When** the user presses the chip's × button
**Then** the chip emits `remove`; the consumer drops that filter from its state
and the chip disappears on the next render, with the remaining chips reflowing to
close the gap. `FilterChips` does not remove the chip itself.

## Clearing every filter

**Given** a `FilterChipsReset` composed as the last child of the list
**When** the user presses it
**Then** it emits `click`; the consumer clears its filter state and every chip
disappears on the next render.

**Given** a `FilterChipsReset` with `disabled`
**When** the user presses it
**Then** nothing is emitted and the button shows the ghost variant's disabled
styling.

## Empty state

**Given** a consumer with no applied filters
**When** it renders
**Then** it is the consumer's decision whether to render an empty
`FilterChips` (a 32px-tall empty row) or nothing at all. `FilterChips` renders
whatever it is given and does not hide itself — the design has no empty state.
The data-driven `FilterSearchAppliedFilters` wrapper, which owns the filter
record, is the part that returns nothing when there are no filters.

## Composition

**Given** the reset action
**When** it is composed
**Then** it belongs inside `FilterChipsList`, not beside it — the design measures
8px between the last chip and the button, which is the list's gap, not the root's
16px.

**Given** a `render` prop on the root
**When** it is supplied
**Then** the root renders as that element or component instead of a `<div>`, with
the group role, accessible name and layout classes merged onto it.

## Right-to-left

**Given** an ancestor with `dir="rtl"`
**When** the row is laid out
**Then** the chips and the reset action flow from the right edge and wrap
right-to-left; the chip's × sits at the label's trailing (left) edge. The row
uses no physical directional utilities, so this needs no extra prop.
