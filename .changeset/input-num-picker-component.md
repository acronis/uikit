---
'@acronis-platform/ui-react': minor
---

feat(input-num-picker): add `InputNumPicker`

A numeric stepper field (label + required marker, decrement/increment
buttons around the value) built on Base UI's `NumberField`, themed by its own
`--ui-input-num-picker-*` token tier and reusing `ButtonIconInput` for the
steppers. Ported from Figma node `8523:5382`. This is a new component,
independent of the existing `NumberField` (which remains unchanged).
