# SidebarSecondary — Accessibility Requirements

A contextual list of navigation links with an optional disclosure level. It is a
`navigation` landmark, **not** a `menu`/`menubar` widget — interaction is native
tab order, not arrow-key roving.

## ARIA Roles and Attributes

### Root (`nav`)

| Attribute    | Value                    | Reason                                           |
| ------------ | ------------------------ | ------------------------------------------------ |
| `<nav>`      | —                        | Exposes the panel as a navigation landmark       |
| `aria-label` | contextual (overridable) | Distinguishes it from other `nav` landmarks      |
| `data-state` | `expanded`/`collapsed`   | Reflects the width state; drives token switching |

### Header

The header renders an `<h2>` so the panel's section title is in the heading
outline.

### Menu / items

- Each menu is a `<ul>` of `<li>` rows; leaves render a native `<a>` (or the
  element supplied via `render`).
- The selected row carries `aria-current="page"`.

### Disclosure (expandable rows)

Base UI `Collapsible` wires the disclosure semantics automatically — the trigger
is a `<button>` with `aria-expanded` and `aria-controls`, and the panel gets a
matching `id` and `hidden` state. This is the primary reason the expandable row
uses the primitive.

### Collapsed (breadcrumb rail)

When collapsed, the section list is hidden and a vertical breadcrumb is shown
(parent → separator → current page). The separator icon is decorative
(`aria-hidden`). Any menu-item labels that remain are kept in the DOM as
`sr-only`, never `display:none`.

---

## Keyboard Navigation

| Key         | Element     | Action                          |
| ----------- | ----------- | ------------------------------- |
| Tab         | Row         | Moves focus to the next row     |
| Shift+Tab   | Row         | Moves focus to the previous row |
| Enter       | Link row    | Activates / navigates           |
| Enter/Space | Sub-trigger | Toggles the disclosure          |

No roving tabindex — this is a list of links plus disclosure buttons, not a
`menu`/`menubar`.

---

## Focus

A keyboard-focused row shows a visible focus ring using the shared
`--ui-focus-brand` token (inset, so it stays inside the 48px collapsed rail).

---

## Screen Reader Requirements

1. The navigation landmark is announced with its label.
2. The header announces as a level-2 heading.
3. Each row announces its label as a link; the selected row announces
   `aria-current="page"`.
4. Disclosure triggers announce expanded/collapsed state.
5. Collapsed rows still announce their (sr-only) label.

---

## Color and Contrast

| Element                        | Minimum Ratio | Standard               |
| ------------------------------ | ------------- | ---------------------- |
| Menu-item label vs container   | 4.5:1         | WCAG 1.4.3 (AA)        |
| Menu-item icon vs container    | 3:1           | WCAG 1.4.11 (non-text) |
| Selected container vs panel bg | 3:1           | WCAG 1.4.11            |
| Breadcrumb separator icon      | 3:1           | WCAG 1.4.11 (non-text) |
| Focus indicator                | 3:1           | WCAG 1.4.11            |

---

## Testing Checklist

- [ ] `<nav>` root with a distinguishing `aria-label`; header is an `<h2>`
- [ ] Menus are `<ul>` of `<li>` rows; rows are links
- [ ] Selected row has `aria-current="page"`; others do not
- [ ] `data-state` reflects expanded/collapsed; breadcrumb shows when collapsed
- [ ] Disclosure trigger exposes `aria-expanded` / `aria-controls`; toggles on click + Enter/Space
- [ ] Level-2 sub-items are indented and reachable via Tab when open
- [ ] Collapsed rows keep an accessible name (sr-only label, not removed)
