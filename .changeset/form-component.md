---
'@acronis-platform/ui-react': minor
---

feat(form): add Form (initial version ported from ui-legacy)

A native `<form>` with consolidated validation, rebuilt on Base UI's Form: it
collects values by each `Field`'s name, validates on submit (or per
`validationMode`), surfaces server `errors` keyed by field name, and calls
`onFormSubmit(values)` when every field is valid. The legacy form wrapped
react-hook-form; this version drops that dependency and composes the ui-react
`Field` directly. Design reconciliation pending.
