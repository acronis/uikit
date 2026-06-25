# InputTextArea — Accessibility Requirements

## ARIA Roles and Attributes

| Attribute           | Value                       | Reason                                       |
| ------------------- | --------------------------- | -------------------------------------------- |
| native `<textarea>` | —                           | Exposes `role="textbox"` (multiline)         |
| `aria-invalid`      | `"true"` when invalid       | Conveys the error state to assistive tech    |
| `aria-describedby`  | id of the error/description | Associates the message text with the field   |
| `aria-disabled`     | implied by `disabled`       | Disabled fields are skipped in the tab order |

**Always provide an accessible name** — the built-in `label` prop (preferred,
auto-associated via `htmlFor`/`id`) or `aria-label` / `aria-labelledby` for the
bare usage. The placeholder is **not** a label; it disappears on input and fails
contrast as a label.

## Keyboard Navigation

| Key        | Action                          |
| ---------- | ------------------------------- |
| Tab        | Moves focus to / from the field |
| Enter      | Inserts a line break (native)   |
| Text keys  | Edit the value                  |
| Home / End | Move the caret (native)         |

Disabled fields are removed from the tab order.

## Screen Reader Requirements

1. Announced as a multiline edit/text field with its accessible name.
2. Announces the current value (or placeholder when empty).
3. When `aria-invalid="true"`, announces "invalid"; the message referenced by
   `aria-describedby` is read.

## Color and Contrast

| Element                          | Minimum Ratio | Standard               |
| -------------------------------- | ------------- | ---------------------- |
| Value text vs field background   | 4.5:1         | WCAG 1.4.3 (AA)        |
| Placeholder text vs background   | 4.5:1         | WCAG 1.4.3 (AA)        |
| Border vs surrounding background | 3:1           | WCAG 1.4.11 (non-text) |
| Focus ring                       | 3:1           | WCAG 1.4.11            |

Error is not signalled by color alone — pair `aria-invalid` with a visible,
associated error message.

## Testing Checklist

- [ ] Has an accessible name (label / `aria-label`)
- [ ] `aria-invalid="true"` + `aria-describedby` wired for errors
- [ ] Reachable via Tab; disabled removes it from the tab order
- [ ] Value / placeholder text meet 4.5:1; border + focus ring meet 3:1
- [ ] Placeholder is not used as the only label
