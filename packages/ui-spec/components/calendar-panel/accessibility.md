# CalendarPanel — accessibility

The day grid's roles, keyboard model and selection semantics are **inherited from
`react-day-picker`** — none of it is custom. This component replaces two of the
library's rendered parts (`MonthCaption` → the `InputSelect` header,
`DayButton` → the styled day cell) and adds the footer; everything else, the
grid semantics included, is the library's.

## Roles & semantics (inherited from react-day-picker)

- Each month's grid is a `<table role="grid">`, with a weekday header row of
  column headers and one row per week.
- Each day cell is a `gridcell` containing a focusable `<button>`; the selected
  state is exposed via `aria-selected` on the cell.
- `multiple` and `range` grids additionally carry `aria-multiselectable` on the
  grid — the only announced difference between the variants' grids.
- Days matched by `disabled` render as disabled buttons — out of the tab order
  and not activatable.
- Outside days (the adjacent months' filler days) are rendered but only
  visually de-emphasized — react-day-picker exposes them via a `data-outside`
  hook on the cell with no additional ARIA state (no `aria-hidden`, no
  `aria-disabled`). They stay mouse-clickable and selectable, but
  react-day-picker excludes them from the roving-tabindex focus target, so
  they can never be reached via Tab or arrow-key roaming — pointer-only, not
  "ordinary" day buttons.
- The day button additionally carries `data-day`, `data-active` (a selected day
  or either range endpoint) and `data-range-middle` (a day between the
  endpoints). These are styling hooks, not a11y state — `aria-selected` remains
  the announced source of truth.

## The month / year dropdowns

- The header is **not** react-day-picker's `captionLayout="dropdown"` native
  `<select>` pair — it is two real `InputSelect` instances, so they inherit
  `InputSelect`'s listbox semantics, typeahead and keyboard model.
- Neither dropdown has a visible label in the design, so the component supplies
  the accessible name itself: `monthLabel` (default `'Month'`) and `yearLabel`
  (default `'Year'`) are applied as the trigger's `aria-label`. Both are props —
  override them to localize.
- The month dropdown's option text comes from `formatMonthLabel`, so the
  announced month names localize with it.

## Keyboard

| Key                            | Element               | Action                                                                                                                                     |
| ------------------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Tab / Shift+Tab                | panel                 | Moves between the month dropdown, the year dropdown, the grid, and the footer buttons                                                      |
| Arrow Left / Right             | day grid              | Moves focus one day back / forward; mirrors under `dir="rtl"` (inherited, but only when `dir` is passed to the panel — see the `dir` prop) |
| Arrow Up / Down                | day grid              | Moves focus one week back / forward (inherited)                                                                                            |
| Home / End                     | day grid              | Moves focus to the first / last day of the week (inherited)                                                                                |
| Page Up / Page Down            | day grid              | Moves focus to the previous / next month (inherited)                                                                                       |
| Shift+Arrow Left / Right       | day grid              | Moves focus to the same weekday in the previous / next month (inherited)                                                                   |
| Shift+Arrow Up / Down          | day grid              | Moves focus to the same date in the previous / next year (inherited)                                                                       |
| Shift+Page Up / Page Down      | day grid              | Moves focus to the previous / next year (inherited)                                                                                        |
| Enter / Space                  | focused day           | Selects the focused day (inherited)                                                                                                        |
| Enter / Space, Arrow Up / Down | month / year dropdown | Opens the dropdown and moves through options (InputSelect)                                                                                 |
| Escape                         | open dropdown         | Closes the dropdown without changing the month (InputSelect)                                                                               |
| Enter / Space                  | Cancel / Apply        | Activates the footer action                                                                                                                |

The grid is a single tab stop with arrow-key roaming (the roving-tabindex
day-grid model), so Tab does not walk 28–42 individual day buttons. When
react-day-picker marks a day as focused, the day button pulls DOM focus to
itself so the roaming stays in sync.

`CalendarPanel` renders a **panel**, not a modal dialog — it has no
`role="dialog"`, no focus trap and no Escape-to-close. Wrap it in a `Popover`
or `Dialog` when those semantics are wanted; that wrapper owns them.

## Focus indication

- The focused day cell shows a 3px focus ring in `--ui-focus-primary`, raised
  above its neighbours (`z-index`) so the ring is not clipped by the adjacent
  flat cells.
- The dropdowns and footer buttons use their own components' focus rings, which
  resolve to the same `--ui-focus-primary` token.

## Screen reader

1. Moving into the grid announces the focused date and, when selected, its
   selected state.
2. Disabled days are announced as unavailable.
3. Choosing a month or year re-renders the grid; the newly focused date is
   announced on the next arrow-key move.
4. The footer buttons announce their visible labels (`cancelLabel` /
   `applyLabel`).

## Color and contrast

| Element                                 | Minimum ratio | Standard               |
| --------------------------------------- | ------------- | ---------------------- |
| Day number vs cell background           | 4.5:1         | WCAG 1.4.3 (AA)        |
| Selected day number vs active cell fill | 4.5:1         | WCAG 1.4.3 (AA)        |
| Weekday abbreviation vs panel surface   | 4.5:1         | WCAG 1.4.3 (AA)        |
| Panel / divider borders vs surface      | 3:1           | WCAG 1.4.11 (non-text) |
| Focus indicator                         | 3:1           | WCAG 1.4.11            |

Disabled days use `--ui-calendar-value-color-disabled` and are exempt from the
text-contrast minimum (WCAG 1.4.3 excludes inactive controls).

Outside days (the adjacent months' filler days — see above) share that same
`--ui-calendar-value-color-disabled` token even though they remain
mouse-clickable and selectable, not inactive controls in the ARIA sense —
they are simply unreachable by keyboard (see "Roles & semantics" above).
Measured against `--ui-calendar-container-color`, this renders at 2.13:1
(light) / 2.31:1 (dark) — below the 4.5:1 minimum this table requires
elsewhere. This is a known, accepted design trade-off (visual de-emphasis of
adjacent-month days takes priority over AA contrast for that one element),
not a WCAG exemption — unlike disabled days, no exclusion in the standard
actually applies to them.

Regardless of contrast, selection is never conveyed by color alone —
`aria-selected` carries it for assistive tech.

## Testing checklist

- [ ] Each month renders a `role="grid"` table with a weekday header row
- [ ] Day cells are `gridcell`s and expose `aria-selected`
- [ ] Arrow keys roam the grid; Tab does not enter every day button
- [ ] Enter/Space on the focused day selects it
- [ ] The month and year dropdowns have accessible names from `monthLabel` /
      `yearLabel`, and both are overridable
- [ ] The focused day shows the `--ui-focus-primary` ring, unclipped
- [ ] Disabled days are not focusable or selectable
- [ ] Outside days are not focusable via Tab or arrow-key roaming, but remain
      mouse-clickable and selectable
- [ ] Cancel / Apply announce `cancelLabel` / `applyLabel`, and are absent for
      `variant="single"`
- [ ] The panel renders correctly under `dir="rtl"`, including the `range`
      divider (an inline-end border, so it mirrors)
- [ ] With `dir="rtl"` passed to the panel, Arrow Left/Right roaming direction
      also mirrors (it only flips when `dir` reaches the day grid directly)
