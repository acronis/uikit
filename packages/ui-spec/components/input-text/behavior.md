# InputText — Behavior

## Rendering

**Given** a `label`
**When** the field renders
**Then** the label appears above the input and is associated with it via
`htmlFor`/`id` (clicking the label focuses the input).

**Given** `required`
**When** the field renders
**Then** a `*` marker is appended after the label and the input gets
`aria-required="true"`.

**Given** a `description`
**When** no `error` is set
**Then** the helper text shows below the input, associated via `aria-describedby`.

## Error

**Given** `error` is set
**When** the field renders
**Then** the input shows the error border (via `aria-invalid`), the error message
replaces the description below the input, and the message is associated via
`aria-describedby`.

## Clear

**Given** `clearable` and a non-empty (controlled) `value`
**When** the field is not disabled
**Then** a clear (✕) button appears inside the box.

**Given** the clear button
**When** it is activated (click, Enter, or Space)
**Then** `onClear` fires (the consumer clears the value).

**Given** the field is `disabled`
**Then** the clear button is not shown.

## Interaction

**Given** the input
**When** the pointer hovers / it receives keyboard focus
**Then** the box border shifts to its hover token and keyboard focus paints a 3px
ring — `--ui-focus-primary` normally, `--ui-focus-error` while in the error state.

**Given** any typing
**When** the value changes
**Then** the native `change` event is forwarded to the consumer.
