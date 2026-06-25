# InputDatePicker

The date-field **trigger**: a button box that displays a formatted date (or a
`start – end` range when `pickerType="dateRange"`) and a trailing calendar icon,
with a label (and optional required marker) and an optional description or error.
Themed by the `--ui-input-date-picker-*` token tier.

> **Scope:** this is the trigger field only. The calendar popup is not part of the
> Figma design or the token tier yet — the consumer formats the date `value` / range
> as strings and wires their own calendar to `open` / `onClick` (e.g. a popover).

## When to use

- A labelled date or date-range entry that opens a calendar, where you bring your own
  calendar/popover and date formatting.

## When not to use

- For free text — use `InputText`; for choosing from a fixed list — use `InputSelect`.
- If you need a built-in calendar grid — that's a separate, not-yet-designed component.

## Examples

```tsx
import { InputDatePicker } from '@acronis-platform/ui-react';
import { format } from 'date-fns';

// Single date
<InputDatePicker
  label="Due date"
  placeholder="Pick a date"
  value={selected && format(selected, 'MMM d, yyyy')}
  open={open}
  onClick={() => setOpen(true)}
  description="When the task is due"
/>;

// Range
<InputDatePicker
  label="Period"
  pickerType="dateRange"
  startDate={start && format(start, 'MMM d')}
  endDate={end && format(end, 'MMM d')}
/>;

// Error
<InputDatePicker label="Due date" error="Pick a valid date" />;
```

## Parts

| Part          | Element    | Description                                               |
| ------------- | ---------- | --------------------------------------------------------- |
| `label`       | `<label>`  | Field label (associated via `htmlFor`/`id`).              |
| `required`    | `<span>`   | Required `*` marker (decorative; `aria-hidden`).          |
| `trigger`     | `<button>` | The box; opens the calendar; `aria-invalid` → error look. |
| `value`       | `<span>`   | Selected date / range, or the placeholder.                |
| `separator`   | `<span>`   | The `–` between range dates.                              |
| `icon`        | `<span>`   | Trailing calendar icon.                                   |
| `description` | `<p>`      | Helper text (normal state).                               |
| `error`       | `<p>`      | Error message; replaces the description.                  |
