# CalendarPanel — Behavior Scenarios

Selection, month navigation and day-grid keyboard roaming are
`react-day-picker`'s; this component supplies the panel chrome, the
`InputSelect`-backed month/year header, and the Cancel/Apply footer.

## Structure

### Renders the bordered panel

**Given** a CalendarPanel with no props
**When** it renders
**Then** the root is a `<div data-slot="calendar-panel">` with
`data-variant="single"`
**And** it draws the `--ui-calendar-container-*` border, radius and surface plus a
shadow

### `single` renders one month and no footer

**Given** `variant="single"`
**When** the panel renders
**Then** exactly one month column is shown
**And** no footer is rendered — there is no Cancel or Apply button anywhere in
the panel

### `multiple` renders one month and the footer

**Given** `variant="multiple"`
**When** the panel renders
**Then** exactly one month column is shown
**And** a footer with a secondary Cancel button and a primary Apply button is
rendered below the grid

### `range` renders two months sharing one footer

**Given** `variant="range"`
**When** the panel renders
**Then** two month columns are shown side by side, the second showing the month
after the first
**And** each column has its own month/year header
**And** the first column draws the vertical divider as its inline-end border, so
the rule sits between the columns and mirrors under `dir="rtl"`
**And** a single footer spans the whole panel below both columns

---

## Single-date selection

### Selects a date

**Given** `variant="single"`
**When** a day cell is clicked
**Then** that day gets `data-active="true"` and takes the active cell
background + active value color
**And** the select event fires with the clicked `Date` and the trigger date

### Replaces the previous date

**Given** `variant="single"` with a day already selected
**When** a different day is clicked
**Then** only the newly clicked day carries `data-active="true"`
**And** the select event fires with the new `Date`

### Commits immediately

**Given** `variant="single"`
**When** a day is clicked
**Then** the selection is final — there is no footer to confirm it with

---

## Multi-date selection

### Adds and removes dates

**Given** `variant="multiple"`
**When** several day cells are clicked in turn
**Then** each clicked day carries `data-active="true"`
**And** the select event fires each time with the full `Date[]`
**And** clicking an already-selected day removes it from the array

### Honors `max`

**Given** `variant="multiple"` with `max={3}` and three dates already selected
**When** a fourth day is clicked
**Then** the selection does not grow past three dates
**And** removing one of the selected days frees a slot again

### Honors `min`

**Given** `variant="multiple"` with `min={2}` and exactly two dates selected
**When** one of the selected days is clicked to deselect it
**Then** the selection is not reduced below two dates

---

## Range selection

### Picks a start, then an end

**Given** `variant="range"` with nothing selected
**When** a day is clicked
**Then** it becomes the range start and carries `data-active="true"`
**And** the select event fires with `{ from }` only
**When** a later day is then clicked
**Then** it becomes the range end and also carries `data-active="true"`
**And** the select event fires with `{ from, to }`

### Highlights the days between the endpoints

**Given** a completed range
**When** the grid renders
**Then** every day strictly between the endpoints carries
`data-range-middle="true"` and takes the hover-tier fill with the primary value
color
**And** those days do **not** carry `data-active` — the two attributes are
mutually exclusive, so the endpoint and in-range backgrounds never compete
**And** no cell is rounded: endpoints get no "pill" treatment in this design

### Spans both months

**Given** `variant="range"`
**When** the start is picked in the first month column and the end in the second
**Then** the in-range highlighting continues across both grids

### Honors `min` / `max`

**Given** `variant="range"` with `max={7}`
**When** an end date more than seven days after the start is clicked
**Then** the range is not accepted beyond the allowed length

---

## Month / year navigation

### Navigates by month

**Given** `variant="single"` or `variant="multiple"`, or the **first** column
of `variant="range"`
**When** a month is chosen in that column's month dropdown
**Then** the grid re-renders on that month of the same year
**And** the month-change event fires with the new month

**Given** the **second** column of `variant="range"`
**When** a month is chosen in that column's month dropdown
**Then** both columns re-render, the second showing the chosen month
**And** the month-change event fires with the month **one before** the chosen
one — `month` is always the first displayed month, so choosing month M in the
second column reports M − 1

### Navigates by year

**Given** `variant="single"` or `variant="multiple"`, or the **first** column
of `variant="range"`
**When** a year is chosen in that column's year dropdown
**Then** the grid re-renders on the same month of that year
**And** the month-change event fires with the new month

**Given** the **second** column of `variant="range"`
**When** a year is chosen in that column's year dropdown
**Then** both columns re-render, the second showing the chosen year
**And** the month-change event fires with the month one before the chosen
column's month, in the chosen year (same asymmetry as month navigation above)

### There are no prev/next chevrons

**Given** any variant
**When** the panel renders
**Then** no previous/next month buttons exist — the two dropdowns are the only
navigation affordance, per the design

### Year window is configurable

**Given** `fromYear={2020}` and `toYear={2030}`
**When** the year dropdown is opened
**Then** it lists exactly 2020 through 2030
**And** with neither prop it spans the current year ±50

### Year window also clamps grid navigation

**Given** `fromYear={2020}` and `toYear={2030}`
**When** the grid is navigated past that window — a controlled `month`
outside the range, or Shift+PageUp/PageDown repeated past an edge
**Then** the displayed month does not move past January 2020 or December 2030
**And** this clamp applies even though the year dropdown's option list is a
separate concern from grid navigation

### Month names are formattable

**Given** a `formatMonthLabel` returning abbreviated or localized names
**When** the month dropdown renders
**Then** its items and its displayed value use those strings

### Uncontrolled vs controlled month

**Given** `defaultMonth` set and no `month`
**When** the panel renders and a dropdown is used
**Then** the panel starts on `defaultMonth` and then manages the displayed month
itself

**Given** `month` supplied
**When** a dropdown is used
**Then** the month-change event fires but the grid only moves once the consumer
passes a new `month` back

---

## Footer actions

### Cancel

**Given** `variant="multiple"` or `"range"`
**When** the Cancel button is pressed
**Then** the cancel event fires
**And** the panel neither reverts the selection nor closes itself — the caller
decides what "cancel" means

### Apply

**Given** `variant="multiple"` or `"range"`
**When** the Apply button is pressed
**Then** the apply event fires
**And** the panel stays mounted and keeps its selection — the caller commits and
dismisses the surrounding surface

### No footer events for `single`

**Given** `variant="single"` with cancel and apply handlers supplied
**When** the user interacts with the panel
**Then** neither handler can ever fire — no footer is rendered

### Footer labels are overridable

**Given** `cancelLabel` and `applyLabel`
**When** the footer renders
**Then** the buttons use those strings as their visible (and accessible) names

---

## Disabled and outside days

### Disabled days cannot be selected

**Given** `disabled={{ before: today }}`
**When** the grid renders
**Then** every day before today renders in the disabled value color and takes no
pointer events
**And** clicking one changes nothing and fires no select event

### Outside days

**Given** `showOutsideDays` left at its default
**When** the grid renders
**Then** the leading/trailing days of the adjacent months fill the first and last
week rows, in the disabled value color
**And** they stay clickable and selectable — unlike a `disabled` day, they are
only visually de-emphasized, not blocked from pointer interaction; they are
excluded only from keyboard focus (Tab / arrow-key roaming can never land on
one)

**Given** `showOutsideDays={false}`
**When** the grid renders
**Then** those cells are empty instead

---

## Controlled vs uncontrolled selection

### Uncontrolled

**Given** `selected` supplied without a select handler
**When** days are clicked
**Then** the panel starts from `selected` and then manages the selection itself

### Controlled

**Given** both `selected` and the select handler supplied
**When** a day is clicked
**Then** the event fires with the next value
**And** the highlighting only changes once the consumer passes the new `selected`
back — a handler that ignores the value leaves the grid unchanged

---

## Week start

### Starts on Monday by default

**Given** neither `weekStartsOn` nor `locale`
**When** the grid renders
**Then** the weekday row begins with Monday, per the design

**Given** `weekStartsOn={0}`
**When** the grid renders
**Then** the weekday row and every week begin with Sunday

### Follows the locale when `weekStartsOn` is unset

**Given** a `locale` with its own week start (e.g. `enUS` → Sunday) and no
`weekStartsOn`
**When** the grid renders
**Then** the weekday row begins on that locale's first day, not Monday

**Given** both `locale` and `weekStartsOn`
**When** the grid renders
**Then** the explicit `weekStartsOn` wins over the locale

---

## Text direction

### `dir` mirrors keyboard roaming, not just layout

**Given** `dir="rtl"` passed to the panel
**When** the day grid renders
**Then** the `range` divider and the panel's own layout already mirror via
logical CSS properties, regardless of `dir`
**And**, additionally, Arrow Left/Right roaming direction flips — because
`dir` is forwarded to the underlying day grid explicitly, which only mirrors
its own keyboard handling when `dir` reaches it directly

**Given** an ancestor sets `dir="rtl"` but the panel's own `dir` prop is left
unset
**When** the day grid renders
**Then** the panel's layout still mirrors (inherited via logical properties)
**But** Arrow Left/Right roaming direction does **not** flip
