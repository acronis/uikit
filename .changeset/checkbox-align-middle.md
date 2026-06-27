---
'@acronis-platform/ui-react': patch
---

refactor(checkbox): center the checkbox box inline (align-middle)

Move `align-middle` onto the `Checkbox` root so the box stays vertically centered
whenever it sits inline next to text (it previously defaulted to the text
baseline and sat high). This replaces the table-scoped
`[&_[role=checkbox]]:align-middle` rule added in the cell-alignment fix — the
Table no longer needs it, and any inline checkbox now centers everywhere, not
just in tables. No visual change to existing baselines (the computed alignment is
identical; just declared on the component instead of the cell).
