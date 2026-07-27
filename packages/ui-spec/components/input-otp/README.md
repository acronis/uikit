# InputOTP

A bare row of single-character boxes for entering a one-time code (e.g. a
6-digit SMS/authenticator code). Like [`Input`](../input/README.md), it has no
label/description — a `Field` wrapper composes those around it.

## When to use

- Entering a fixed-length numeric one-time code (e.g. an SMS/authenticator
  code), with auto-advance between digits and paste support. Input is
  digit-only — a non-digit keystroke is rejected and non-digit characters are
  stripped from a paste.

## When not to use

- A general single-line text field — use `InputText`.
- A field that needs its own label/description/error message wired in — wrap
  `InputOTP` the same way a future `Field` wraps `Input`.

## Examples

```tsx
import { InputOTP } from '@acronis-platform/ui-react';

// Basic 6-digit code, auto-focused, submits once complete
<InputOTP autoFocus onComplete={(code) => verify(code)} />;

// A shorter code
<InputOTP length={4} />;

// Error (e.g. after a failed verification)
<InputOTP error defaultValue="123456" />;

// Disabled
<InputOTP disabled defaultValue="123456" />;
```

## Parts

| Part   | Element   | Description                                                                                       |
| ------ | --------- | ------------------------------------------------------------------------------------------------- |
| `root` | `<div>`   | The `role="group"` row container for the slots.                                                   |
| `slot` | `<input>` | A single-character box, repeated `length` times; shows its position as a placeholder while empty. |
