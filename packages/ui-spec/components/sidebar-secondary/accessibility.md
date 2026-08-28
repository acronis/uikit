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

### Collapse trigger (footer)

`SidebarSecondaryCollapseTrigger` is a `<button>` that toggles the panel width.

| `collapsible` | Exposed as                                                           |
| ------------- | -------------------------------------------------------------------- |
| `true`        | `aria-expanded` mirrors the panel's `expanded` state; button enabled |
| `false`       | **no** `aria-expanded`; button carries the native `disabled`         |

When `collapsible` is `false` the button has no state to expose or flip, so
`aria-expanded` is omitted rather than pinned to a value a user cannot change,
and `disabled` communicates the unavailable action to assistive tech.

### Resize edge

When `resizable`, the panel renders a focusable handle on its inline-end border
with `role="separator"`, `aria-orientation="vertical"`, `tabIndex={0}` and an
overridable `aria-label` (default `'Resize sidebar'`).

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

### Resize edge (`role="separator"`)

Arrow keys follow the writing direction: the **grow** key is `ArrowRight` in LTR
and `ArrowLeft` in RTL; the **shrink** key is the mirror.

| Key         | `collapsible: true`                                    | `collapsible: false`                                    |
| ----------- | ------------------------------------------------------ | ------------------------------------------------------- |
| Grow key    | Expanded: +16px. Collapsed: expands the panel          | Expanded: +16px. Collapsed: **inert**                   |
| Shrink key  | −16px; below the minimum width it collapses the panel  | −16px; **clamps at the minimum width**, never collapses |
| Enter/Space | Toggles expanded/collapsed                             | **Inert**                                               |
| Home        | Expands (if collapsed) and resets to the default width | Resets to the default width; never expands              |

With `collapsible={false}` the edge stays focusable and keeps its accessible
name — resizing is still a real operation, only the collapse transition is
suppressed. In the `collapsible={false}` + permanently-collapsed case every
**expand-triggering** key is inert: the grow key and Enter/Space fire no
`toggleExpanded`, so `data-state` stays `collapsed`. **Home is the exception** —
it still resets the stored width to `defaultWidth` and fires `onWidthChange`,
even though the rail is collapsed and looks unchanged at that moment. The reset
only becomes visible if the panel is later expanded by other means (a controlled
`expanded` prop flip), so a controlled consumer that mirrors `onWidthChange` must
expect a width update while the panel is collapsed.

> **Caveat — tooltip copy.** The resize edge's default hover tooltip still reads
> "**Collapse:** Click" / "**Expand:** Click" when `collapsible={false}`, even
> though clicking is inert. The component does not rewrite it; consumers should
> pass `resizeTooltipExpanded` / `resizeTooltipCollapsed` copy matching the
> gestures that actually apply (or `null` to suppress it). Those strings are
> English by default and must be localized regardless.

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
- [ ] Resize edge is `role="separator"`, focusable, and has an overridable `aria-label`
- [ ] With `collapsible={false}`: the footer collapse trigger is `disabled` and
      exposes no `aria-expanded`; Enter/Space on the resize edge does not change
      `data-state`; the shrink key clamps at the minimum width
- [ ] With `collapsible={false}` while collapsed: Home leaves `data-state`
      `collapsed` but still resets the stored width (`onWidthChange` fires with
      `defaultWidth`)
