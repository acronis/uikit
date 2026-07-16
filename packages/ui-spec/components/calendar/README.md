# Calendar

A day-grid for picking dates, built on
[`react-day-picker`](https://daypicker.dev/) and re-themed to the Acronis UI Kit's
semantic tokens.

> **Design-pending v1.** Ported from `@acronis-platform/shadcn-uikit` before a
> "ready for dev" Figma node exists. It is themed off the shared semantic
> vocabulary (no `--ui-calendar-*` token tier yet); reconcile against the real
> design with `/figma-component Calendar <url> --update` once mockups land.

## When to use

- Selecting a single date, a set of dates, or a start–end range in place.
- As the grid inside a date-field popover (see `DateRangePicker`, `InputDatePicker`).

## When not to use

- For a compact date **field** with a popover trigger, compose `InputDatePicker`
  (single) or `DateRangePicker` (range) instead of embedding the bare grid.

## Examples

```tsx
import { Calendar } from '@acronis-platform/ui-react';

// Single date
const [date, setDate] = React.useState<Date>();
<Calendar mode="single" selected={date} onSelect={setDate} />;

// Two-month range
<Calendar
  mode="range"
  numberOfMonths={2}
  selected={range}
  onSelect={setRange}
/>;

// Disabled weekends + specific dates
<Calendar
  mode="single"
  disabled={[{ dayOfWeek: [0, 6] }, new Date(2026, 6, 4)]}
/>;
```

## Parts

| Part      | Element             | Notes                                          |
| --------- | ------------------- | ---------------------------------------------- |
| `nav`     | `<button>` pair     | Previous / next, at the outer edges of the row |
| `caption` | `<div>`             | "Month Year" label per month                   |
| `weekday` | `<div>`             | Weekday column header                          |
| `grid`    | `<table role=grid>` | One per month                                  |
| `day`     | `<button>`          | Selectable day                                 |
| `outside` | `<button>`          | Adjacent-month filler day (optional)           |

Selection mode, month count, and every other `react-day-picker` prop pass through.
