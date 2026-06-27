# NumberField

A numeric input with decrement / increment steppers, min/max/step, and keyboard
stepping. Built on Base UI's NumberField; the box reuses the InputText token tier
so it matches the other inputs.

> Design-pending v1, ported from the legacy shadcn-uikit `number-field`.

## When to use

- Entering a bounded number where stepping by a fixed amount helps (quantity,
  retention days, counts).

## When not to use

- An approximate value across a range — use `Slider`.
- Free text — use `InputText`.

## Parts

| Export                 | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `NumberField`          | Root — holds the value / min / max / step. |
| `NumberFieldGroup`     | The bordered box.                          |
| `NumberFieldDecrement` | − stepper (defaults to a minus icon).      |
| `NumberFieldInput`     | The numeric input.                         |
| `NumberFieldIncrement` | + stepper (defaults to a plus icon).       |

## Example

```tsx
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldDecrement,
  NumberFieldInput,
  NumberFieldIncrement,
} from '@acronis-platform/ui-react';

<NumberField defaultValue={3} min={0} max={99}>
  <NumberFieldGroup>
    <NumberFieldDecrement aria-label="Decrease" />
    <NumberFieldInput aria-label="Quantity" />
    <NumberFieldIncrement aria-label="Increase" />
  </NumberFieldGroup>
</NumberField>;
```
