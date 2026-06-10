# Checkbox — Accessibility Requirements

Implements the [WAI-ARIA Checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)
via Base UI's Checkbox primitive.

## ARIA Roles and Attributes

| Attribute       | Value                        | Reason                                       |
| --------------- | ---------------------------- | -------------------------------------------- |
| `role`          | `"checkbox"`                 | Identifies the control                       |
| `aria-checked`  | `"true" / "false" / "mixed"` | Reflects checked / unchecked / indeterminate |
| `aria-disabled` | present when disabled        | Conveyed via the disabled state              |

The control must have an **accessible name** — provide a visible `<label>`
associated with it, or an `aria-label` / `aria-labelledby` when used standalone.

## Keyboard Navigation

| Key   | Action                        |
| ----- | ----------------------------- |
| Tab   | Moves focus to / from the box |
| Space | Toggles checked / unchecked   |

The box is focusable in its enabled state and removed from the tab order when
disabled.

## Screen Reader Requirements

1. Announced as a checkbox with its accessible name.
2. Announces "checked", "not checked", or "mixed" from `aria-checked`.
3. The glyph (check / minus) is decorative — it carries no separate semantics.

## Color and Contrast

| Element                  | Minimum Ratio | Standard               |
| ------------------------ | ------------- | ---------------------- |
| Box border vs background | 3:1           | WCAG 1.4.11 (non-text) |
| Glyph vs active fill     | 3:1           | WCAG 1.4.11 (non-text) |
| Focus indicator          | 3:1           | WCAG 1.4.11            |

State is not conveyed by color alone — the check / minus glyph and
`aria-checked` distinguish checked, indeterminate, and unchecked.

## Testing Checklist

- [ ] `role="checkbox"` with `aria-checked` reflecting true / false / mixed
- [ ] Has an accessible name (label / `aria-label`)
- [ ] Space toggles; Tab reaches it; disabled removes it from the tab order
- [ ] Focus ring meets 3:1; border and glyph meet 3:1
- [ ] `checked-change` does not fire while disabled
