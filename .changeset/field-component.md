---
'@acronis-platform/ui-react': minor
---

feat(field): add Field (initial version ported from ui-legacy)

A form-field wrapper rebuilt on Base UI's Field primitive: `Field` / `FieldLabel`
/ `FieldControl` / `FieldDescription` / `FieldError` auto-wire the
label↔control↔description↔error associations and validity state, plus structural
parts (`FieldSet`, `FieldLegend`, `FieldGroup`, `FieldContent`, `FieldTitle`,
`FieldSeparator`) for composing and grouping fields. Also exports the bare
`InputBox` primitive (the control you render through `FieldControl`). Design
reconciliation pending.
