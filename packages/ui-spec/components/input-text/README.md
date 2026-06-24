# InputText

A full single-line text field: a label, the input box, an optional clear button,
and an optional description or error message. It composes the bare
[`Input`](../input/README.md) primitive and adds the surrounding field furniture.

## When to use

- Any labelled single-line text entry in a form (email, name, search term…).
- When you need built-in label / description / error wiring and an optional clear
  affordance.

## When not to use

- For a bare input with no label/description (e.g. inside a custom layout) — use
  the `Input` primitive directly.
- For multi-line text — use `InputTextArea`.
- For a search field with a leading icon — use `Search` / `SearchGlobal`.

## Examples

```tsx
import { InputText } from '@acronis-platform/ui-react';

// Basic field with helper text
<InputText
  label="Email"
  placeholder="you@example.com"
  description="We never share it"
/>;

// Required
<InputText label="Email" required />;

// Error
<InputText
  label="Email"
  value={value}
  error="Enter a valid email"
  onChange={onChange}
/>;

// Clearable (controlled)
<InputText
  label="Search"
  value={value}
  clearable
  onChange={(e) => setValue(e.target.value)}
  onClear={() => setValue('')}
/>;
```

## Parts

| Part          | Element    | Description                                           |
| ------------- | ---------- | ----------------------------------------------------- |
| `label`       | `<label>`  | Field label (associated via `htmlFor`/`id`).          |
| `required`    | `<span>`   | Required `*` marker (decorative; `aria-hidden`).      |
| `input`       | `<input>`  | The text box (the `Input` primitive).                 |
| `clear`       | `<button>` | Optional clear (✕) button; calls `onClear`.           |
| `description` | `<p>`      | Helper text (normal state).                           |
| `error`       | `<p>`      | Error message; replaces the description when `error`. |
