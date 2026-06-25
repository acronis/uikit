# InputSearch — Behavior

## Rendering

**Given** a `label`
**When** the field renders
**Then** the label appears above the box and is associated with the input via
`htmlFor`/`id` (clicking the label focuses the input), and `Search`'s built-in
`aria-label` is cleared so it doesn't shadow the visible label.

**Given** no `label`
**When** the field renders
**Then** the field falls back to the composed `Search`'s accessible name
(a caller-supplied `aria-label`, otherwise the default "Search").

**Given** `required`
**When** the field renders
**Then** a `*` marker is appended after the label and the input gets
`aria-required="true"`.

## Clear

**Given** a non-empty `value` (controlled or uncontrolled)
**When** the field is not disabled
**Then** the clear (×) button appears inside the box.

**Given** the clear button
**When** it is activated (click, Enter, or Space)
**Then** the field empties, the input refocuses, and `onClear` fires alongside a
native change event with an empty value.

**Given** the field is `disabled`
**Then** the clear button is not shown.

## Interaction

**Given** the box
**When** the pointer hovers / the input receives keyboard focus
**Then** the box border shifts to its hover token and keyboard focus paints a 3px
`--ui-focus-primary` ring (via `:focus-within`).

**Given** any typing
**When** the value changes
**Then** the native `change` event is forwarded to the consumer.
