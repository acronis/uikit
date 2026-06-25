# InputDatePicker — Behavior

## Rendering

**Given** a `label`
**When** the field renders
**Then** the label appears above the trigger and is associated with it via
`htmlFor`/`id`; a `*` follows it when `required` (which also sets `aria-required`).

**Given** `picker-type="date"`
**When** a `value` is set
**Then** the trigger shows the formatted value; otherwise it shows the `placeholder`.

**Given** `picker-type="dateRange"`
**When** `start-date` / `end-date` are set
**Then** the trigger shows `start separator end` (default separator `–`); otherwise
the range `placeholder`.

**Given** a `description` and no `error`
**Then** the helper text shows below the box (associated via `aria-describedby`);
**given** an `error`, it replaces the description and the box takes the error border.

## Interaction

**Given** the trigger
**When** it is activated (click, Enter, or Space)
**Then** `click` fires — the consumer opens its calendar.

**Given** `open` is true (the consumer-owned calendar is shown)
**Then** the box paints the active border and the trigger sets `aria-expanded="true"`.

**Given** the trigger
**When** the pointer hovers / it receives keyboard focus
**Then** the border shifts to its hover / active token; keyboard focus paints a 3px
ring — `--ui-focus-primary` normally, `--ui-focus-error` while in the error state.

**Given** the field is `disabled`
**Then** the trigger is inert (does not open) and uses the disabled token set.

## Scope

The calendar popup itself is **not** part of this component (not in the Figma design
or the token tier). The consumer renders the date `value` / range as formatted
strings and wires their own calendar to `open` / `onClick`.
