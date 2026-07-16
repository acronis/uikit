# DateRangePicker — accessibility

Accessibility is inherited from the composed primitives: the `InputDatePicker`
trigger, the Base UI `Popover`, and the `react-day-picker` `Calendar`.

## Trigger

- The trigger is a `<button>` with `aria-haspopup="dialog"`; `aria-expanded`
  tracks the open state. A `label` is associated via `htmlFor`/`id`, `required`
  sets `aria-required`, and `error` sets `aria-invalid` and links the message via
  `aria-describedby`.

## Popover

- Opening moves focus into the popover; `Escape` and an outside press close it and
  return focus to the trigger. Focus is trapped within the popover while open
  (Base UI).

## Calendar

- The grid follows the ARIA grid pattern with full keyboard support (arrow keys,
  `Home`/`End`, `PageUp`/`PageDown`, `Enter`/`Space`) — see the Calendar spec.

## Fields & footer

- The start/end inputs are labelled ("Start date" / "End date") so the draft can
  be edited without the calendar. The footer buttons ("Reset to default",
  "Apply") are ordinary labelled buttons and expose their disabled state via the
  `disabled` attribute.

## Contrast

- The trigger uses the `--ui-input-date-picker-*` tier (idle / hover / active /
  error / disabled) so every state is within the palette's contrast budget; the
  popup content contrast is owned by the composed Calendar / Button / InputText.
