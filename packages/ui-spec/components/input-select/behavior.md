# InputSelect — Behavior

## Rendering

**Given** a label
**When** the field renders
**Then** the label appears above the trigger and is auto-associated with it (Base UI
`Select.Label`), so clicking the label focuses the trigger and screen readers announce
the field name.

**Given** `required`
**When** the field renders
**Then** a `*` marker is appended after the label.

**Given** a description and no error
**Then** the helper text shows below the trigger; **given** the trigger is
`aria-invalid` with an error message, the error replaces the description and the
trigger takes the error border.

## Opening / selecting (single)

**Given** the trigger
**When** it is pressed (or Space / Enter / ArrowDown with focus)
**Then** the popup opens (`data-popup-open`, chevron rotates 180°) and emits
`open-change(true)`.

**Given** an open popup
**When** an item is clicked or activated with Enter
**Then** the value updates (emits `value-change`), the selected row tints and shows a
trailing check, the trigger shows the resolved label, and the popup closes.

## Multiple selection

**Given** `multiple`
**When** the popup is open and items are toggled
**Then** each item shows a leading checkbox reflecting its selected state, the row
background stays the unselected color, and the popup **stays open** so several items
can be picked.

## Search / sections / status

**Given** an in-dropdown search row
**When** the consumer wires its `value`/`change`
**Then** it filters the items the consumer renders (the row is presentational).

**Given** a section with a label
**Then** its items render under a heading, divided from the previous section by a top
border.

**Given** a status row (`loading` / `empty` / `error`)
**When** rendered instead of items
**Then** it shows the matching icon and message (and, for `error`, an optional retry
action).

## Interaction

**Given** the trigger
**When** the pointer hovers / it receives keyboard focus
**Then** the box border shifts to its hover token and keyboard focus paints a 3px ring —
`--ui-focus-primary` normally, `--ui-focus-error` while `aria-invalid`.

**Given** the field is `disabled`
**Then** the trigger is inert (does not open) and uses the disabled token set.
