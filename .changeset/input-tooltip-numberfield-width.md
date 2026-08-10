---
'@acronis-platform/ui-react': patch
---

Fix `InputText`, `InputPassword`, `InputTextArea`, `InputDatePicker`, and
`NumberFieldGroup` forcing full width via a hardcoded `w-full`, which
overrode a narrower flex/grid ancestor instead of letting the field shrink
to fit it. `Tooltip`'s popup content now also has an explicit width utility
so a consumer-supplied width class takes effect.
