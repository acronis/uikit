# DateRangePicker

A range date field: an `InputDatePicker` trigger opens a popover with a dual-month
range `CalendarPanel`, whose own Cancel/Apply footer commits or reverts the draft.

> It owns no token tier of its own — the trigger uses
> `--ui-input-date-picker-*` and the popup is themed by the composed
> `CalendarPanel` (`--ui-calendar-*`). Popover contributes only positioning,
> portaling and dismissal — its own container chrome is neutralized so
> CalendarPanel's chrome shows through instead.

## When to use

- Picking a start–end date range with an explicit Apply step (so an in-progress
  selection never leaks out until confirmed).

## When not to use

- For a single date, use `InputDatePicker` + `Calendar` (or a single-mode
  date-picker composition).
- A preset list ("Last 7 days", "This month", …) — not currently implemented
  by any component in this repo; this component doesn't render presets.

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

// Uncontrolled with a default
<DateRangePicker
  label="Period"
  defaultValue={{ from: new Date(2026, 6, 1), to: new Date(2026, 6, 15) }}
  onValueChange={(next) => console.log(next)}
/>;
```

Localized, with the calendar constrained to selectable days — every string the
popup renders on its own is a prop, and the calendar constraints are forwarded
to the composed `CalendarPanel`:

```tsx
import { es } from 'react-day-picker/locale';

<DateRangePicker
  label="Período"
  locale={es}
  monthLabel="Mes"
  yearLabel="Año"
  cancelLabel="Cancelar"
  applyLabel="Aplicar"
  disabledDays={{ after: new Date() }}
  max={31}
  onValueChange={setRange}
/>;
```

## Parts

| Part       | Element                    | Notes                                      |
| ---------- | -------------------------- | ------------------------------------------ |
| `trigger`  | `InputDatePicker`          | Shows the applied range + calendar icon    |
| `popup`    | Popover content            | Portaled panel                             |
| `calendar` | dual-month `CalendarPanel` | `variant="range"`, own Cancel/Apply footer |
| `cancel`   | `CalendarPanel`'s footer   | Reverts the draft, closes the popup        |
| `apply`    | `CalendarPanel`'s footer   | Commits the draft, closes the popup        |

Edits stay in a draft until **Apply**; **Cancel** or dismissing the popover reverts them.

## Notes

- **Calendar pass-throughs.** `disabledDays`, `min`, `max`, `showOutsideDays`,
  `weekStartsOn`, `fromYear`, `toYear`, `locale`, `monthLabel`, `yearLabel`,
  `formatMonthLabel`, `cancelLabel` and `applyLabel` are forwarded verbatim to
  the popup's `CalendarPanel` — see its spec for their semantics and defaults.
  `disabledDays` is the only rename (`CalendarPanel`'s `disabled`), since
  `disabled` here disables the trigger.
- **`locale` also reaches the trigger.** Unlike the other pass-throughs,
  `locale` is also read by the trigger's own date formatter to translate the
  month name — the day/year order stays fixed at `MMM d, yyyy` regardless of
  `locale`; true locale-aware reordering isn't supported.
- **No `dir` prop.** The ambient text direction is read from the document
  (`useDocDir()`) and passed to `CalendarPanel`'s `dir`, which the day grid
  needs directly for Arrow Left/Right roaming. Set `dir` on the document (or
  an ancestor) as usual.
