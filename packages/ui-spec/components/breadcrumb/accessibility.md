# Breadcrumb — Accessibility Requirements

Implements the [WAI-ARIA Breadcrumb pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/).

## ARIA Roles and Attributes

### Root (`nav`)

| Attribute    | Value          | Reason                                                  |
| ------------ | -------------- | ------------------------------------------------------- |
| `<nav>`      | —              | Exposes the trail as a navigation landmark              |
| `aria-label` | `"breadcrumb"` | Distinguishes it from other `nav` landmarks on the page |

### List / items

- The trail is an ordered list (`<ol>`) of `<li>` items — order is meaningful.
- Link items render a native `<a>` (or the element supplied via `render`).

### Current page (`page` part)

| Attribute       | Value    | Reason                                                         |
| --------------- | -------- | -------------------------------------------------------------- |
| `role`          | `"link"` | Exposes the current page as a (disabled) link in the trail     |
| `aria-current`  | `"page"` | Identifies the current page within the trail                   |
| `aria-disabled` | `"true"` | Signals the item is not actionable                             |
| no `href`       | —        | Not navigable; rendered as a `<span>`, so not in the tab order |

### Separator (`separator` part)

| Attribute     | Value            | Reason                                  |
| ------------- | ---------------- | --------------------------------------- |
| `role`        | `"presentation"` | Marks the separator as decorative       |
| `aria-hidden` | `"true"`         | Keeps screen readers from announcing it |

### Ellipsis (`ellipsis` part)

| Attribute     | Value    | Reason                                                           |
| ------------- | -------- | ---------------------------------------------------------------- |
| `aria-hidden` | `"true"` | The icon itself is decorative                                    |
| `sr-only`     | "More"   | Provides an accessible name when collapsed items are represented |

When the ellipsis triggers an interactive menu of hidden items, wrap it in a
focusable control (e.g. a Button/menu trigger) that carries `aria-expanded`,
`aria-haspopup`, and an accessible label.

---

## Keyboard Navigation

| Key       | Element         | Action                           |
| --------- | --------------- | -------------------------------- |
| Tab       | Breadcrumb link | Moves focus to the next link     |
| Shift+Tab | Breadcrumb link | Moves focus to the previous link |
| Enter     | Breadcrumb link | Activates / navigates            |

The current-page item is not a link and is not focusable. Separators are not
focusable.

---

## Screen Reader Requirements

1. The navigation landmark is announced with its "breadcrumb" label.
2. Each link item announces its text as a link.
3. The current page announces with `aria-current="page"`.
4. Separators are not announced.

---

## Color and Contrast

| Element                         | Minimum Ratio | Standard               |
| ------------------------------- | ------------- | ---------------------- |
| Link text vs background         | 4.5:1         | WCAG 1.4.3 (AA)        |
| Current-page text vs background | 4.5:1         | WCAG 1.4.3 (AA)        |
| Separator icon vs background    | 3:1           | WCAG 1.4.11 (non-text) |
| Focus indicator                 | 3:1           | WCAG 1.4.11            |

Links are distinguished by more than color: they underline on hover, and
keyboard focus shows a 3px focus-ring (`--ui-focus-primary`).

---

## Testing Checklist

- [ ] `<nav aria-label="breadcrumb">` on the root
- [ ] Trail is an `<ol>` of `<li>` items
- [ ] Last item is a disabled current-page link (`role="link"`, `aria-current="page"`, `aria-disabled`, no `href`)
- [ ] Separators are `aria-hidden` / `role="presentation"`
- [ ] All link items are reachable via Tab; current page is skipped
- [ ] Ellipsis exposes an accessible "More" name
- [ ] Link / current-page text meet 4.5:1; focus ring meets 3:1
