# FilterCards — Behavior

## Layout

**Given** a `FilterCards` with two or more children
**When** it renders
**Then** the children lay out in a single horizontal row with a 16px gap
(`--ui-gap-16`) and each child stretches to an equal share of the row's
width via `flex: 1 1 0%` — except a child whose own content exceeds that
share, which takes more (see the min-content overflow scenario below).

**Given** a single `FilterCards` child
**When** it renders
**Then** that child fills the entire row width (equal share of one).

**Given** a `CardFilter` child with its own fixed 224px width
**When** it is composed inside `FilterCards`
**Then** the row's `flex-1` stretching overrides that fixed width — matching
the "fill container" sizing Figma applies to each `CardFilter` instance inside
this composition.

**Given** enough children that their combined natural (min-content) width
exceeds the row
**When** `FilterCards` renders
**Then** each card only shrinks down to its own content's natural width — no
card's label/value is ever clipped — and the row overflows its container
instead. `FilterCards` adds no scroll or wrap of its own; the consumer is
responsible for giving the row a scrollable container (e.g.
`overflow-x-auto`) when that degradation is undesired. There is no design
spec for this case — Figma only documents the exact-fit composition.

**Constraint:** `FilterCards` owns no state of its own — it is a pure function
of its `children`. Any interaction state (hover, selected, …) lives entirely
on the child (see `CardFilter`'s own spec).

## Composition

**Given** a `render` prop (e.g. `<section />`)
**When** `FilterCards` renders
**Then** it renders as that element with the row's classes and props merged
on.

**Given** children other than `CardFilter`
**When** `FilterCards` renders
**Then** they lay out identically — `FilterCards` does not constrain the
child type, only its layout.
