# InputPassword

A single-line password field: a label, a themed value box with a built-in
show/hide toggle, and an optional description or error message. Unlike
[`InputText`](../input-text/README.md), the box isn't the bare `Input`
primitive — it has its own `--ui-input-password-*` token tier, and the toggle
is a [`ButtonIconInput`](../button-icon-input/README.md).

## When to use

- Any password / secret entry field that should let the user reveal what
  they've typed.

## When not to use

- A general single-line text field — use `InputText`.
- A one-time verification code — use `InputOTP`.

## Examples

```tsx
import { InputPassword } from '@acronis-platform/ui-react';

// Basic field with helper text
<InputPassword label="Password" description="At least 8 characters" />;

// Required
<InputPassword label="Password" required />;

// Error
<InputPassword
  label="Password"
  value={value}
  error="Enter at least 8 characters"
  onChange={onChange}
/>;

// Localized toggle labels
<InputPassword
  label="Contraseña"
  showPasswordLabel="Mostrar contraseña"
  hidePasswordLabel="Ocultar contraseña"
/>;
```

## Parts

| Part          | Element    | Description                                                      |
| ------------- | ---------- | ---------------------------------------------------------------- |
| `label`       | `<label>`  | Field label (associated via `htmlFor`/`id`).                     |
| `required`    | `<span>`   | Required `*` marker.                                             |
| `box`         | `<div>`    | The themed container (border, fill) around the input + toggle.   |
| `input`       | `<input>`  | The borderless value input; toggles `type="password" \| "text"`. |
| `toggle`      | `<button>` | Show/hide button (`ButtonIconInput`).                            |
| `description` | `<p>`      | Helper text (normal state).                                      |
| `error`       | `<p>`      | Error message; replaces the description when `error`.            |
