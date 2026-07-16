# DateRangePicker — behavior

Design-pending v1 ported from `@acronis-platform/shadcn-uikit` (`date-picker`,
extended to a range). It mirrors the draft/commit/revert idiom of
`FilterSearchFilters`.

## Opening

- **Given** an enabled trigger, **when** the user activates it, **then** the
  popover opens and the applied range is snapshotted into the draft.
- **Given** `disabled`, **when** the user activates the trigger, **then** nothing
  happens (the popover does not open).

## Editing the draft

- **When** the user selects days in the calendar, **then** the draft range updates
  and the start/end fields reformat to match.
- **When** the user types a valid `MMM d, yyyy` date into the start or end field,
  **then** the corresponding end of the draft range updates (and the calendar
  reflects it). Invalid/partial input leaves the draft unchanged.

## Committing vs. reverting

- **When** the user presses **Apply**, **then** `onValueChange` fires with the
  draft range, the applied range updates (uncontrolled) and the popover closes.
- **When** the user dismisses the popover (outside press / `Escape`), **then** the
  draft is discarded, `onValueChange` does **not** fire, and the trigger keeps
  showing the previously-applied range.
- **When** the user presses **Reset to default**, **then** the draft reverts to
  `defaultValue` (or clears if none). The action is disabled while the draft
  already equals the default.
- **Apply** is disabled while the draft equals the applied range (nothing to
  commit).

## Controlled vs. uncontrolled

- **Given** `value`, the applied range is owned by the parent; Apply fires
  `onValueChange` and the parent decides whether to update `value`.
- **Given** only `defaultValue` (or nothing), the component owns the applied range
  internally and updates it on Apply.
