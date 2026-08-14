# DateRangePicker — behavior

It mirrors the draft/commit/revert idiom of `FilterSearchFilters`; the popup's
Cancel/Apply footer is `CalendarPanel`'s own.

## Opening

- **Given** an enabled trigger, **when** the user activates it, **then** the
  popover opens and the applied range is snapshotted into the draft.
- **Given** `disabled`, **when** the user activates the trigger, **then** nothing
  happens (the popover does not open).

## Editing the draft

There are no editable start/end text fields — the draft is only ever changed
by clicking days in the calendar (`CalendarPanel`'s `range` selection mode).

- **When** the draft has no start, **then** clicking a day sets `from` to that
  day; with no `min` set (the default), `to` is also set to that day (a
  single-day draft) — `react-day-picker`'s `addToRange` only leaves `to`
  open-ended (`undefined`) when `min` is greater than 0.
- **When** the draft has a start but no end, **then** clicking a later day
  completes the range (`to` = that day); clicking an earlier day moves the
  start back instead (`from` = that day, `to` stays the previous start).
- **When** the draft is a complete range, **then** clicking a day before the
  start moves the start; clicking a day after the end, or between the two
  ends, moves the end; clicking either existing end again collapses the draft
  to that single day (`from` and `to` both become that day).
- **When** the user clicks the sole day of a single-day draft (`from` and `to`
  are the same day) a second time, **then** the whole draft clears to
  `{ from: undefined, to: undefined }`. This is the only way the draft as a
  whole clears from calendar interaction — there is no way to clear one end
  independently of the other.

## Committing vs. reverting

- **When** the user presses **Apply**, **then** the draft is normalized (start
  and end swapped if inverted) and `onValueChange` fires with the normalized
  range; the applied range updates (uncontrolled) and the popover closes. Apply
  is never disabled, so this also fires when the draft is empty or half-open
  (e.g. the popup was opened and Apply pressed immediately, or only `from` was
  ever clicked) — `onValueChange` can receive `{ from: undefined, to: undefined
}` or `{ from, to: undefined }`.
- **When** the user presses **Cancel**, **then** the draft is discarded,
  `onValueChange` does **not** fire, and the popover closes.
- **When** the user dismisses the popover (outside press / `Escape`), **then** the
  draft is discarded, `onValueChange` does **not** fire, and the trigger keeps
  showing the previously-applied range.

## Controlled vs. uncontrolled

- **Given** `value`, the applied range is owned by the parent; Apply fires
  `onValueChange` and the parent decides whether to update `value`.
- **Given** only `defaultValue` (or nothing), the component owns the applied range
  internally and updates it on Apply.
