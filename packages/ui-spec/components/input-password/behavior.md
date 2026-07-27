# InputPassword — Behavior

## Rendering

**Given** a `label`
**When** the field renders
**Then** the label appears above the box and is associated with the input via
`htmlFor`/`id` (clicking the label focuses the input).

**Given** `required`
**When** the field renders
**Then** a `*` marker is appended after the label and the input gets
`aria-required="true"`.

**Given** a `description`
**When** no `error` is set
**Then** the helper text shows below the box, associated via
`aria-describedby`.

## Show / hide toggle

**Given** the field
**When** it first renders
**Then** the value is masked (`type="password"`) and the toggle shows the
crossed-eye icon with accessible name `showPasswordLabel` ("Show password").

**Given** the toggle button
**When** it is activated
**Then** the input's `type` flips to `"text"`, the icon becomes the plain eye,
and the accessible name becomes `hidePasswordLabel` ("Hide password").
Activating it again reverts both.

## Error

**Given** `error` is set
**When** the field renders
**Then** the box shows the error border, the toggle switches to its error
tone, the error message replaces the description below the box, and the
message is associated via `aria-describedby`. The input also gets
`aria-invalid="true"`.

## Interaction

**Given** the box
**When** the pointer hovers / the input receives keyboard focus
**Then** the box border shifts to its hover token and keyboard focus paints a
3px ring — `--ui-focus-primary` normally, `--ui-focus-error` in the error
state.

**Given** any typing
**When** the value changes
**Then** the native `change` event is forwarded to the consumer.

## Disabled

**Given** `disabled`
**When** the field renders
**Then** the input and the toggle button are both disabled (native
`disabled`), and the box/label/description use their disabled tokens.
