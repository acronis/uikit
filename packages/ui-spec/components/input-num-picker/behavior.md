# InputNumPicker — Behavior

## Rendering

**Given** a `label`
**When** the field renders
**Then** the label appears above the box and is associated with the value
input via `htmlFor`/`id` (clicking the label focuses the input).

**Given** no `label`
**When** the field renders
**Then** no label element is rendered.

**Given** `required`
**When** the field renders
**Then** a `*` marker is appended after the label and the field is marked
required.

## Stepping

**Given** the increment button
**When** it is activated (click, Enter, or Space)
**Then** the value increases by `step` (default `1`) and `onValueChange`
fires with the new value.

**Given** the decrement button
**When** it is activated
**Then** the value decreases by `step`.

**Given** `min` / `max`
**When** the value reaches either bound
**Then** the corresponding stepper is disabled and further presses in that
direction have no effect.

**Given** the value input has keyboard focus
**When** the user presses Arrow Up / Arrow Down
**Then** the value increases / decreases by `step`; Shift snaps to
`largeStep`.

## Interaction

**Given** the box
**When** the pointer hovers over it, or the value input receives keyboard
focus
**Then** the border shifts to its hover token, and keyboard focus additionally
paints a 3px `--ui-focus-primary` ring.

**Given** the field is `disabled`
**Then** the value input and both steppers are inert and styled with their
disabled tokens.
