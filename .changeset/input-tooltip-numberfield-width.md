---
'@acronis-platform/ui-react': major
---

**Breaking:** let `InputText`, `InputPassword`, `InputTextArea`,
`InputDatePicker`, `InputSearch`, `InputSelectField`, and `NumberFieldGroup`
follow consumer sizing instead of always stretching to fill their container.

- `InputText`, `InputPassword`, `InputTextArea`, `InputDatePicker`,
  `InputSearch`, `InputSelectField`, and `NumberFieldGroup` no longer hardcode
  `w-full` on their outer wrapper, which previously overrode a narrower
  flex/grid ancestor. A field placed in a constrained flex row (e.g. alongside
  a sibling) now shrinks to its `min-w` instead of being force-stretched to
  evenly split the row. Any layout that relied on this implicit full-width
  stretch (rather than an explicit `w-full` on a wrapper) should add that
  class itself.
- **`className` on `InputText`, `InputPassword`, `InputTextArea`, and
  `InputDatePicker` now targets the field wrapper (label + box + message),
  not the inner `<input>` / `<textarea>` / trigger button.** Consumers
  passing `className` to style the input/textarea/trigger directly (e.g. a
  custom border or background) need to re-target those styles — width
  utilities are the common case and now work as expected on the wrapper.
  `DateRangePicker` forwards its own `className` straight into
  `InputDatePicker`, so this retargeting applies to it too.
- **`style` on `InputText`, `InputPassword`, `InputTextArea`, and
  `InputDatePicker` now targets the field wrapper too — the same DOM node as
  `className` — instead of the inner `<input>` / `<textarea>` / trigger
  button.** Previously the two props landed on different elements, so
  `<InputText className="w-24" style={{ width: 100 }} />` sized two nodes at
  once. Consumers using inline `style` to paint the control itself (border,
  background, height) need to re-target it; sizing works as expected on the
  wrapper.
