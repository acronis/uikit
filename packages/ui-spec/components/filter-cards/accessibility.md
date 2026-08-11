# FilterCards — Accessibility

- **Role:** a plain `<div>` (`role="group"` is a reasonable authoring choice,
  not enforced by the component) — pure layout, not a landmark or a list. The
  `render` prop can swap the element.
- **No component-owned interaction:** `FilterCards` renders no interactive
  element itself. All keyboard/focus/ARIA behavior belongs to its children
  (e.g. `CardFilter`'s `clickable` variant) — see that component's own
  accessibility spec.
- **Accessible name:** none required on the row itself; if the group of cards
  needs an accessible label (e.g. "Filter summary"), pass `aria-label` — it
  passes through as a native `<div>` attribute.
- **Reading order:** children read in DOM order, left-to-right in `ltr`,
  mirrored in `rtl` via the browser's default flex-row bidi behavior — no
  logical-vs-physical utility is involved since the row uses `flex` with no
  directional margin/padding.
- **WCAG:** no component-specific requirements beyond what its children
  contribute (1.3.1 structure is satisfied by DOM order).
