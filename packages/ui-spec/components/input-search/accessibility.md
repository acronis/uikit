# InputSearch — Accessibility

- **Label association:** the `label` is a real `<label htmlFor>` tied to the
  input's `id` (auto-generated when not supplied), so clicking it focuses the
  input and screen readers announce the field name. When a visible label is
  present, the composed `Search`'s default `aria-label` is cleared so the
  accessible name matches the visible label (WCAG 2.5.3, label in name).
- **Unlabelled fallback:** with no `label`, the field keeps `Search`'s accessible
  name — a caller-supplied `aria-label`, or the default "Search".
- **Required:** `required` sets `aria-required="true"` on the input; the visual `*`
  marker is `aria-hidden` (decorative — the required semantics come from the
  attribute).
- **Search semantics:** the input is a native `<input type="search">`
  (`role="searchbox"`).
- **Clear button:** a native `<button>` with `aria-label="Clear search"`; reachable
  by Tab and activated by Enter / Space, after which focus returns to the input.
- **Keyboard:** the input is a native search field; the clear button is a separate
  tab stop after it.
- **Focus visible:** keyboard focus paints a 3px `--ui-focus-primary` ring flush to
  the box (via `:focus-within`).
- **Disabled:** native `disabled` removes the input (and clear button) from the tab
  order; the field is also inert, so state is not conveyed by color alone.
- **Contrast:** label / value / placeholder / icon / border pairs come from the
  design tokens, authored to meet WCAG contrast.
- **WCAG:** 1.3.1 (info/relationships), 2.1.1 (keyboard), 2.4.7 (focus visible),
  2.5.3 (label in name), 1.4.3 / 1.4.11 (contrast), 3.3.2 (labels), 4.1.2.
