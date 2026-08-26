---
'@acronis-platform/ui-react': patch
---

fix(input-num-picker): forward the ref to the visible input

`InputNumPicker` passed its forwarded ref to `NumberField.Root`'s `inputRef`,
which targets Base UI's hidden `aria-hidden` form-submission `<input
type="number">` shim rather than the visible text input. The ref is now
attached to `NumberField.Input`, so consumers get the element the user
actually interacts with (focus, selection, formatted value).
