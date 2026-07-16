# DateRangePicker

A range date field: an `InputDatePicker` trigger opens a popover with a dual-month
range `Calendar`, editable start/end fields, and a Reset / Apply footer.

> **Design-pending v1.** Ported from `@acronis-platform/shadcn-uikit` before a
> "ready for dev" Figma node exists. It owns no token tier of its own — the
> trigger uses `--ui-input-date-picker-*` and the popup is themed by the composed
> Calendar / Popover / Button / InputText. Reconcile with
> `/figma-component DateRangePicker <url> --update` once mockups land.

## When to use

- Picking a start–end date range with an explicit Apply step (so an in-progress
  selection never leaks out until confirmed).

## When not to use

- For a single date, use `InputDatePicker` + `Calendar` (or a single-mode
  date-picker composition).
- The preset list (All / Last 24 hours / Last 7 days / Custom range) belongs to the
  outer `FilterSearchFilters` composition, **not** this component.

## Examples

```tsx
import { DateRangePicker } from '@acronis-platform/ui-react';

// Controlled
const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({});
<DateRangePicker
  label="Period"
  placeholder="Select a date range"
  value={range}
  onValueChange={setRange}
/>;

// Uncontrolled with a default (Reset reverts here)
<DateRangePicker
  label="Period"
  defaultValue={{ from: new Date(2026, 6, 1), to: new Date(2026, 6, 15) }}
  onValueChange={(next) => console.log(next)}
/>;
```

## Parts

| Part                        | Element               | Notes                                   |
| --------------------------- | --------------------- | --------------------------------------- |
| `trigger`                   | `InputDatePicker`     | Shows the applied range + calendar icon |
| `popup`                     | Popover content       | Portaled panel                          |
| `calendar`                  | dual-month `Calendar` | `mode="range"`, `numberOfMonths={2}`    |
| `field-start` / `field-end` | `InputText`           | Editable draft ends (`MMM d, yyyy`)     |
| `reset`                     | `Button` (ghost)      | Reverts the draft to `defaultValue`     |
| `apply`                     | `Button` (default)    | Commits the draft, closes the popup     |

Edits stay in a draft until **Apply**; dismissing the popover reverts them.
