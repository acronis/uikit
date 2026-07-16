---
'@acronis-platform/ui-react': minor
---

Add `Calendar` and `DateRangePicker` (initial versions ported from ui-legacy;
design reconciliation pending). `Calendar` wraps `react-day-picker` with the UI
Kit's semantic tokens (single / range / multiple selection, multi-month layouts);
`DateRangePicker` composes the `InputDatePicker` trigger with a dual-month range
calendar, editable start/end fields, and a Reset / Apply footer using a
draft/commit idiom. `Calendar` defaults to a Monday week start (`weekStartsOn={1}`),
overridable per instance.

**Migrating from `@acronis-platform/shadcn-uikit`'s `calendar`/`date-picker`**:
both are `'use client'` shadcn components built on the same underlying
`react-day-picker` and Base UI `Popover` foundation, so the selection/keyboard
model is unchanged — what moves is composition and theming.

- `import { Calendar } from '@acronis-platform/shadcn-uikit'` →
  `import { Calendar } from '@acronis-platform/ui-react'`. Same `mode`/`selected`/
  `onSelect`/`numberOfMonths`/`disabled` props (all passed through to
  `DayPicker`). Legacy's `buttonVariant` prop is gone — ui-react's `Calendar`
  themes its own nav/day buttons off `--ui-*` semantic tokens instead of
  `buttonVariants`, so there's nothing to pass. Legacy defaulted to
  `weekStartsOn={0}` (Sunday, `react-day-picker`'s own default); ui-react
  defaults to `weekStartsOn={1}` (Monday) — pass `weekStartsOn={0}` explicitly
  to keep the old default.

- Legacy's `date-picker.tsx` was a **local demo composition**
  (`Popover` + `Button` trigger + `Calendar mode="single"`), not an exported
  library component — there is no 1:1 import migration for it. For a single
  date, compose `Calendar` + `Popover` + `InputDatePicker`
  (`pickerType="date"`) yourself, mirroring `DateRangePicker`'s internals. For
  a **range**, use the new `DateRangePicker` directly — it replaces that
  hand-rolled composition end-to-end (trigger, dual-month calendar, editable
  start/end fields, Reset/Apply), minus preset ranges (`Last 7 days`, etc.),
  which are intentionally out of scope for this v1 and are expected to compose
  alongside it (e.g. inside `FilterSearchFilters`) rather than be built into
  the picker itself.

- Legacy's `bg-primary`/`bg-accent`/opacity-modifier styling (`data-[range-middle=true]:bg-accent`,
  etc.) is now driven by `--ui-*` semantic tokens (no `--av-*`, no component
  token tier yet) — if you were overriding legacy's `classNames`/`className`
  directly, re-check against ui-react's token names rather than porting class
  strings verbatim.
