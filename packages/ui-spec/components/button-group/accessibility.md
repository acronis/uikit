# ButtonGroup — Accessibility

- **Roles:** the container is `role="toolbar"` with `aria-orientation="horizontal"`;
  each item is a native `<button>`. The separator is a CSS border rather than an
  element, so it correctly contributes nothing to the accessibility tree (there
  is no `role="separator"` to announce).

- **Accessible name — container:** a toolbar SHOULD be named. Pass `aria-label`
  (or `aria-labelledby`) describing what the actions have in common, e.g.
  `aria-label="View mode"`. The component deliberately supplies **no** default:
  a generic fallback like "button group" would tell a screen reader user
  nothing, and it would hardcode an unlocalizable English string.

- **Accessible name — items:** items are icon-only in the design, so they have
  no text to name them. Each one MUST be given an `aria-label` (or
  `aria-labelledby`). Decorative glyphs inside should stay `aria-hidden`.

- **Keyboard:** the group is a **single Tab stop** with a roving tabindex —
  Tab enters the group and the next Tab leaves it; the arrow keys move between
  items, wrapping at the ends unless `loop-focus` is `false`. Enter and Space
  activate the focused item (native button behavior). Home/End are not
  supported — the underlying Base UI toolbar primitive does not forward its
  `enableHomeAndEndKeys` option.

- **Focus visible:** keyboard focus draws a 3px `--ui-focus-primary` ring
  **inside** the item, via `:focus-visible` (no ring on pointer activation).
  The ring is inset rather than outset for a functional reason: the container
  clips its children, so an outset ring would be cut off. Being an inset
  shadow, it is clipped to the padding edge and so stops short of the
  separator instead of painting over it.

- **Disabled:** a disabled item follows the ARIA Authoring Practices' toolbar
  advice — it stays focusable and is exposed as `aria-disabled="true"`, **not**
  with the native `disabled` attribute. So the arrow keys land on it and it keeps
  its place in the roving sequence, while click and Enter/Space activation are
  suppressed. This differs from the rest of the library, where a disabled control
  drops out of the tab order, and the difference is load-bearing rather than
  stylistic: a roving tabindex parks the group's single `tabindex="0"` on the
  first item, and a browser skips a natively disabled button — so a natively
  disabled _first_ item would leave every item unreachable and strand the whole
  group outside the tab order. Base UI's `Toolbar.Root` offers no way to relocate
  that initial tab stop. A disabled _group_ propagates the state to every item.

- **State is not conveyed by color alone:** hover and active are transient
  pointer/activation feedback, not information. The group carries no selected
  state — if you need one, use a toggle group, whose items expose
  `aria-pressed`.

- **Contrast:** the glyph and per-state fills come from the design tokens,
  which are authored to meet WCAG contrast in both light and dark themes.

- **WCAG:** 2.1.1 (keyboard), 2.4.7 (focus visible), 1.4.3 / 1.4.11 (contrast),
  4.1.2 (name/role/value).
