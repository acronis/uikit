# Form

A native `<form>` with consolidated validation, built on
[Base UI's Form](https://base-ui.com/react/components/form). It collects values by
each `Field`'s `name`, validates the fields on submit (or per `validationMode`),
surfaces server `errors` keyed by field name, and calls `onFormSubmit(values)`
when every field is valid.

> **Design-pending v1.** Ported from the legacy shadcn-uikit `form`, which wrapped
> [react-hook-form](https://react-hook-form.com). This version **drops that
> dependency** and composes the ui-react `Field` directly on Base UI's validation.
> If you need react-hook-form / TanStack Form, use them around plain `Field`s —
> Form is the lightweight, dependency-free default.

## When to use

- Any short-to-medium form where Base UI's built-in validation is enough.
- You want native submit semantics with per-field errors and no extra form-state
  library.

## When not to use

- Complex form state (arrays, wizards, cross-field logic) better served by a
  dedicated form library — compose that with the `Field` parts directly.

## Parts

Form is a single component. Compose it with the `Field` family:

| Export | Purpose                                                          |
| ------ | ---------------------------------------------------------------- |
| `Form` | The `<form>` wrapper that coordinates validation and submission. |

## Example

```tsx
import {
  Form,
  Field,
  FieldLabel,
  FieldControl,
  FieldError,
  InputBox,
  Button,
} from '@acronis-platform/ui-react';

<Form onFormSubmit={(values) => save(values)} errors={serverErrors}>
  <Field name="email">
    <FieldLabel>Email</FieldLabel>
    <FieldControl render={<InputBox type="email" required />} />
    <FieldError />
  </Field>
  <Button type="submit">Save</Button>
</Form>;
```
