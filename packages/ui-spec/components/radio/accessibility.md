# Radio — Accessibility Requirements

Implements the [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
via Base UI's RadioGroup / Radio primitives.

## ARIA Roles and Attributes

| Element / Attribute  | Value                 | Reason                                  |
| -------------------- | --------------------- | --------------------------------------- |
| group `role`         | `"radiogroup"`        | Groups the options for assistive tech   |
| item `role`          | `"radio"`             | Identifies each option                  |
| item `aria-checked`  | `"true"/"false"`      | Reflects whether the option is selected |
| item `aria-disabled` | present when disabled | Disabled items are skipped              |

Give the group an accessible name (`aria-label` / `aria-labelledby`), and give
each item an accessible name via its associated `<label>`.

## Keyboard Navigation

| Key              | Action                                                    |
| ---------------- | --------------------------------------------------------- |
| Tab              | Moves focus into the group (to the selected / first item) |
| Arrow Up/Left    | Selects and focuses the previous item                     |
| Arrow Down/Right | Selects and focuses the next item                         |
| Space            | Selects the focused item                                  |

The group is a single tab stop (roving tab index): Tab enters/leaves it; Arrow
keys move between items.

## Screen Reader Requirements

1. The group is announced with its label and the count/position of options.
2. Each item announces its label and selected state.
3. Disabled items announce as disabled and are skipped by Arrow navigation.

## Color and Contrast

| Element                     | Minimum Ratio | Standard               |
| --------------------------- | ------------- | ---------------------- |
| Circle border vs background | 3:1           | WCAG 1.4.11 (non-text) |
| Dot vs selected fill        | 3:1           | WCAG 1.4.11 (non-text) |
| Focus indicator             | 3:1           | WCAG 1.4.11            |

Selection is not signalled by color alone — the inner dot and `aria-checked`
distinguish selected from unselected.

## Testing Checklist

- [ ] Group has `role="radiogroup"` + an accessible name
- [ ] Items are `role="radio"` with `aria-checked`
- [ ] Arrow keys move + select; group is a single tab stop
- [ ] Disabled items are not selectable and are skipped
- [ ] Border / dot / focus ring meet 3:1
