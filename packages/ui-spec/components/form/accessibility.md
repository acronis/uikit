# Form — accessibility

- Renders a native `<form>`, so browser submit semantics (Enter to submit, the
  submit button, native required validation) work as expected.
- Accessibility of the individual controls is owned by `Field` — label
  associations, `aria-describedby`, and `aria-invalid` are wired there. Form's job
  is to coordinate validation and surface errors on the right field.
- On a failed submit, focus management and the per-field `FieldError`
  (`role="alert"` semantics) announce what went wrong; don't rely on color alone —
  the error text states the problem.
- Give the form an accessible name when there are multiple forms on a page
  (`aria-label` / `aria-labelledby` referencing a heading).

## Contrast

Form adds no color of its own; contrast is governed by the Fields and controls it
composes (see the Field spec). Error text there uses `--ui-text-on-status-danger`,
which meets contrast in light and dark.
