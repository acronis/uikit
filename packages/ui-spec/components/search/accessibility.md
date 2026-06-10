# Search — Accessibility Requirements

## ARIA Roles and Attributes

| Element / Attribute | Value                       | Reason                                        |
| ------------------- | --------------------------- | --------------------------------------------- |
| input `type`        | `"search"`                  | Exposes `role="searchbox"`                    |
| input name          | label / `aria-label`        | The field needs an accessible name            |
| clear `button`      | `aria-label="Clear search"` | Names the icon-only clear control             |
| leading icon        | decorative                  | The magnifier is `aria-hidden` (no semantics) |

Provide an accessible name via a visible `<label>` or `aria-label` — the
placeholder is guidance, not a label.

## Keyboard Navigation

| Key       | Action                                                            |
| --------- | ----------------------------------------------------------------- |
| Tab       | Moves focus to the input, then to the clear button (when present) |
| Text keys | Edit the query                                                    |
| Enter     | Submits within a form (native)                                    |

The clear button is a real `<button>` and is reachable via Tab when shown.

## Screen Reader Requirements

1. The input announces as a search field with its accessible name and value.
2. The clear button announces with its "Clear search" name.
3. The leading magnifier is decorative and not announced.

## Color and Contrast

| Element                        | Minimum Ratio | Standard               |
| ------------------------------ | ------------- | ---------------------- |
| Value text vs box background   | 4.5:1         | WCAG 1.4.3 (AA)        |
| Placeholder text vs background | 4.5:1         | WCAG 1.4.3 (AA)        |
| Box border vs background       | 3:1           | WCAG 1.4.11 (non-text) |
| Icons vs background            | 3:1           | WCAG 1.4.11 (non-text) |
| Focus ring                     | 3:1           | WCAG 1.4.11            |

## Testing Checklist

- [ ] Input is `role="searchbox"` with an accessible name
- [ ] Clear button has an accessible name and is keyboard-reachable when shown
- [ ] Leading magnifier is decorative (`aria-hidden`)
- [ ] Focus ring + border + icons meet 3:1; text meets 4.5:1
- [ ] Disabled removes the input from the tab order and hides the clear button
