---
'@acronis-platform/ui-react': minor
---

`DateRangePicker`: swap its internal dual-month `Calendar` for `CalendarPanel` (`variant="range"`), adopting its Cancel/Apply footer in place of the component's own Reset/Apply footer and start/end text fields.

**Behavior change:** the editable start/end date text fields, the "Reset to default" action, and the Apply-disabled-while-unchanged guard have been removed in favor of `CalendarPanel`'s own footer. No prop or export was removed, but the labelled `Start date`/`End date` inputs are gone from the DOM with no deprecation path — an e2e or a11y test that targets them (e.g. `getByLabelText('Start date')`) will break.

`DateRangePicker` now forwards `CalendarPanel`'s localization (`monthLabel`, `yearLabel`, `cancelLabel`, `applyLabel`, `locale`, `formatMonthLabel`) and navigation/constraint props (`disabledDays`, `min`, `max`, `showOutsideDays`, `weekStartsOn`, `fromYear`, `toYear`), and auto-detects the ambient text direction (`useDocDir()`) so the popup calendar's keyboard arrow-key navigation mirrors correctly under RTL — including when `DateRangePicker` is composed inside another component's portaled content, since it reads `document.documentElement` rather than doing a DOM `dir`-ancestor lookup off the trigger.

`locale` also now reaches the trigger itself: its `MMM d, yyyy` display translates the month name (e.g. `es` renders "jul 1, 2026"), though the day/year order stays fixed — full locale-aware reordering isn't supported yet.
