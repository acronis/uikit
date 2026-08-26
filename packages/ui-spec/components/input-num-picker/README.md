# InputNumPicker

A numeric stepper field: an optional label (with an optional required
marker), and a bordered box with decrement/increment buttons around the
numeric value. Built on Base UI's `NumberField`; the steppers reuse the
already-themed [`ButtonIconInput`](../button-icon-input/README.md).

## When to use

- A small, labelled numeric input where the primary interaction is
  incrementing/decrementing by a fixed step (quantity pickers, counters).

## When not to use

- For a bare numeric field with no label/steppers — use Base UI's
  `NumberField` primitives directly.
- For free-form numeric or text entry without stepping — use `InputText`.

## Examples

```tsx
import { InputNumPicker } from '@acronis-platform/ui-react';

// Basic field
<InputNumPicker label="Quantity" defaultValue={1} min={0} max={10} />;

// Required
<InputNumPicker label="Quantity" required />;

// Controlled
<InputNumPicker label="Quantity" value={value} onValueChange={setValue} />;

// Disabled
<InputNumPicker label="Quantity" disabled defaultValue={3} />;
```

## Parts

| Part        | Element    | Description                                        |
| ----------- | ---------- | -------------------------------------------------- |
| `label`     | `<label>`  | Field label (associated via `htmlFor`/`id`).       |
| `required`  | `<span>`   | Required `*` marker (decorative; `aria-hidden`).   |
| `box`       | `<div>`    | The bordered box wrapping the steppers + value.    |
| `decrement` | `<button>` | Decrement (−) stepper; a themed `ButtonIconInput`. |
| `value`     | `<input>`  | The numeric value, centered.                       |
| `increment` | `<button>` | Increment (+) stepper; a themed `ButtonIconInput`. |
