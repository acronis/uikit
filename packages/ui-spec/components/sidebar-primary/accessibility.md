# SidebarPrimary — Accessibility Requirements

A list of navigation links presented as an app rail. It is a `navigation`
landmark, **not** a `menu` / `menubar` widget — interaction is native tab order,
not arrow-key roving.

## ARIA Roles and Attributes

### Root (`nav`)

| Attribute    | Value                  | Reason                                                         |
| ------------ | ---------------------- | -------------------------------------------------------------- |
| `<nav>`      | —                      | Exposes the rail as a navigation landmark                      |
| `aria-label` | `"Primary"` (default)  | Distinguishes it from other `nav` landmarks (override per app) |
| `data-state` | `expanded`/`collapsed` | Reflects the width state; drives token switching               |

### Menu / items

- Each menu is an unordered list (`<ul>`) of `<li>` rows.
- Each row renders a native `<a>` (or the element supplied via `render`, e.g. a
  router `Link` or a `<button>`).
- The selected row carries `aria-current="page"`.

### Collapsed (icon rail)

When the rail is collapsed, labels are **visually** hidden but remain in the DOM
as `sr-only` text — so each icon-only row keeps an accessible name. Labels are
never `display:none`. Trailing extras (shortcut / external-link / tag) are
decorative trailing affordances and are hidden when collapsed.

---

## Keyboard Navigation

| Key       | Element   | Action                           |
| --------- | --------- | -------------------------------- |
| Tab       | Menu item | Moves focus to the next item     |
| Shift+Tab | Menu item | Moves focus to the previous item |
| Enter     | Menu item | Activates / navigates            |

There is no roving tabindex or arrow-key model — this is a list of links, not a
`menu`/`menubar`. (Arrow-key roving would be a different component.)

---

## Focus

A keyboard-focused menu item shows a visible focus ring using the shared
`--ui-focus-brand` token (no dedicated sidebar focus token exists). The ring is
inset so it stays inside the 48px collapsed rail.

---

## Screen Reader Requirements

1. The navigation landmark is announced with its label.
2. Each row announces its label as a link.
3. The selected row announces `aria-current="page"`.
4. In collapsed mode, rows still announce their (sr-only) label.

---

## Color and Contrast

| Element                       | Minimum Ratio | Standard               |
| ----------------------------- | ------------- | ---------------------- |
| Menu-item label vs container  | 4.5:1         | WCAG 1.4.3 (AA)        |
| Menu-item icon vs container   | 3:1           | WCAG 1.4.11 (non-text) |
| Selected container vs rail bg | 3:1           | WCAG 1.4.11            |
| Focus indicator               | 3:1           | WCAG 1.4.11            |

---

## Testing Checklist

- [ ] `<nav>` root with a distinguishing `aria-label`
- [ ] Menus are `<ul>` of `<li>` rows; rows are links
- [ ] Selected row has `aria-current="page"`; others do not
- [ ] `data-state` reflects expanded/collapsed
- [ ] Collapsed rows keep an accessible name (sr-only label, not removed)
- [ ] All rows reachable via Tab; focus ring meets 3:1
