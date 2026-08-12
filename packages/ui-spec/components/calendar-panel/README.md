# CalendarPanel

A self-contained date-picker panel: a bordered, elevated day-picker built on
`react-day-picker` and themed by the dedicated `--ui-calendar-*` token tier. One
`variant` prop selects the selection mode _and_ the panel's structure — the
number of month columns and whether a Cancel/Apply footer exists.

Months are navigated through two `InputSelect` dropdowns in each month's header.
There are no prev/next chevrons: that is the design, not an omission.

## When to Use

- A date, a set of dates, or a date range needs to be picked from a **panel with
  its own chrome** — border, rounded corners, shadow.
- The panel is dropped inside a `Popover` or `Dialog` opened from a trigger (a
  date field, a filter button, a "custom range" menu item).
- The picker needs a **commit step** — `multiple` / `range` build a selection
  over several clicks, and the footer gives the user an explicit Apply/Cancel.
- Long-jump navigation matters (e.g. a birthdate 40 years back): the year
  dropdown reaches any year in the `fromYear`…`toYear` window in one interaction.

## When NOT to Use

- **An always-visible embedded calendar** with no panel chrome — a month grid
  sitting flush in a page or card. This component always draws the panel border,
  radius and shadow; use a plain calendar grid for that (see `Calendar`).
- **A text-entry date field.** Use `InputDatePicker`, which owns the field, the
  trigger and its popover.
- **A preset-driven range filter** ("Last 7 days", "This month", …). Use
  `DateRangePicker`, which pairs the presets with a range grid.
- **Modal semantics** (focus trap, Escape to close, `role="dialog"`). This is a
  plain panel — wrap it in `Dialog`/`Popover` and let the wrapper own them.

## Variants

| Variant    | Months | Footer | Selection                                                          |
| ---------- | ------ | ------ | ------------------------------------------------------------------ |
| `single`   | 1      | no     | One `Date`; commits on the click itself                            |
| `multiple` | 1      | yes    | A `Date[]`; clicking toggles a day, bounded by `min` / `max`       |
| `range`    | 2      | yes    | A `{ from, to }` range; first click sets the start, second the end |

The two `range` month columns are divided by a vertical rule drawn as the first
column's **inline-end** border, so it mirrors under `dir="rtl"`.

Every cell — idle, hover, in-range, endpoint — is a flat square. This design has
no corner-radius differentiation, so range endpoints deliberately get no "pill"
rounding.

## Parts

| Part            | Element                              | Role                                                                        |
| --------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `root`          | `<div data-slot="calendar-panel">`   | The bordered, elevated panel; carries `data-variant`                        |
| `month-column`  | `<div>`                              | One 248px month (caption + grid); twice for `range`, and owns the divider   |
| `month-caption` | `<header>`                           | Header bar of one column, holding both dropdowns                            |
| `month-select`  | `InputSelect`                        | Month dropdown, named by `monthLabel`                                       |
| `year-select`   | `InputSelect`                        | Year dropdown over `fromYear`…`toYear`, named by `yearLabel`                |
| `weekdays`      | `<tr>`                               | Weekday abbreviation row, starting at `weekStartsOn`                        |
| `day-grid`      | `<table role="grid">`                | The month's day table                                                       |
| `day`           | `<button>`                           | One date cell (Figma's "CalendarItem"); `data-active` / `data-range-middle` |
| `footer`        | `DialogFooterDefault` + two `Button` | Cancel / Apply; **only** for `multiple` / `range`                           |

## Quick Examples

### Single date

```tsx
import { CalendarPanel } from '@acronis-platform/ui-react';

function DueDate() {
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <CalendarPanel
      variant="single"
      selected={date}
      onSelect={(next) => setDate(next)}
    />
  );
}
```

### Multiple dates, committed via Apply

```tsx
import { CalendarPanel } from '@acronis-platform/ui-react';

function BackupDays({ onClose }: { onClose: () => void }) {
  const [dates, setDates] = React.useState<Date[] | undefined>();

  return (
    <CalendarPanel
      variant="multiple"
      max={5}
      selected={dates}
      onSelect={(next) => setDates(next)}
      onCancel={onClose}
      onApply={onClose}
    />
  );
}
```

### Range, inside a popover

```tsx
import {
  CalendarPanel,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from '@acronis-platform/ui-react';
import type { DateRange } from 'react-day-picker';

function ReportRange() {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<DateRange | undefined>();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<Button variant="secondary">Pick a range</Button>}
      />
      <PopoverContent>
        <CalendarPanel
          variant="range"
          selected={range}
          onSelect={(next) => setRange(next)}
          disabled={{ after: new Date() }}
          onCancel={() => setOpen(false)}
          onApply={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
```

### Localized labels

```tsx
<CalendarPanel
  variant="single"
  monthLabel="Mois"
  yearLabel="Année"
  cancelLabel="Annuler"
  applyLabel="Appliquer"
  formatMonthLabel={(d) => d.toLocaleString('fr', { month: 'long' })}
/>
```

## Notes

- **Controlled vs uncontrolled.** Passing `selected` alone seeds the panel, which
  then manages the selection itself; adding `onSelect` makes `selected` the
  single source of truth (react-day-picker's own contract). The same split
  applies to `defaultMonth` vs `month` + `onMonthChange`.
- **The footer never closes anything.** `onCancel` / `onApply` just report the
  press — the caller reverts, commits and dismisses the surrounding surface.
- **Every rendered string is a prop.** `monthLabel`, `yearLabel`, `cancelLabel`,
  `applyLabel` and `formatMonthLabel` carry their literals only as defaults, so
  consumers localize at their layer.

## Spec Files

| File               | Contents                                                          |
| ------------------ | ----------------------------------------------------------------- |
| `index.yaml`       | Identity, status, category, dependencies, Figma link              |
| `anatomy.yaml`     | Root, parts, layout, internal state, transitions, states          |
| `api.yaml`         | Framework-agnostic contract + framework adapters                  |
| `tokens.yaml`      | `--ui-calendar-*` token references                                |
| `behavior.md`      | Given/When/Then behavior scenarios                                |
| `accessibility.md` | ARIA roles, keyboard map, screen-reader and contrast requirements |
