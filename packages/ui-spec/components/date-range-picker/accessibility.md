# DateRangePicker — accessibility

Accessibility is inherited from the composed primitives: the `InputDatePicker`
trigger, the Base UI `Popover`, and `CalendarPanel`.

## Trigger

- The trigger is a `<button>` with `aria-haspopup="dialog"`; `aria-expanded`
  tracks the open state. A `label` is associated via `htmlFor`/`id`, `required`
  sets `aria-required`, and `error` sets `aria-invalid` and links the message via
  `aria-describedby`.

## Popover

- Opening moves focus into the popover; `Escape` and an outside press close it and
  return focus to the trigger. The popover is a non-modal Base UI `Popover`
  (no `modal` prop is passed), so focus is **not** trapped — Tab can move focus
  outside the popover while it remains open.

## Calendar & footer

- The grid follows the ARIA grid pattern with full keyboard support (arrow keys,
  `Home`/`End`, `PageUp`/`PageDown`, `Enter`/`Space`) — see the `CalendarPanel` spec.
- The footer's "Cancel" and "Apply" buttons are `CalendarPanel`'s own — ordinary
  labelled buttons.
- The month and year dropdowns have no visible label, so their accessible names
  come from `monthLabel` / `yearLabel` (defaulting to "Month" / "Year"); the
  footer buttons' names come from `cancelLabel` / `applyLabel`. All four —
  plus `locale` for weekday names and the day cells' own labels, and
  `formatMonthLabel` for the month names — are props, so a non-English UI has no
  untranslatable text in the popup.
- Arrow Left/Right day-grid roaming follows the ambient text direction: it is read
  from the document (`useDocDir()`) and forwarded to `CalendarPanel`'s `dir`,
  which `react-day-picker` needs directly (it does not inherit direction via
  CSS).

## Contrast

- The trigger uses the `--ui-input-date-picker-*` tier (idle / hover / active /
  error / disabled) so every state is within the palette's contrast budget; the
  popup content contrast is owned by the composed `CalendarPanel`.
