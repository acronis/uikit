# Link — Accessibility

- **Role:** a native `<a>` with an `href` exposes `role="link"` and is keyboard
  focusable / activatable by default.
- **Accessible name:** comes from the link text (the children). For icon-only or
  ambiguous links, provide `aria-label`. The external icon is decorative and inherits
  the text color.
- **External links:** when `external`, also set `target="_blank"` +
  `rel="noopener noreferrer"` as appropriate; consider announcing "opens in a new tab"
  in the label or an `aria-label` for screen-reader users.
- **Keyboard:** Tab focuses the link; Enter activates it (native anchor behavior).
- **Focus visible:** keyboard focus paints a 3px `--ui-focus-primary` ring; `:focus`
  is not suppressed without a visible alternative.
- **Disabled:** `disabled` removes the link from the tab order (`tabindex="-1"`), sets
  `aria-disabled="true"`, and drops the `href` so it is not navigable — state is not
  conveyed by color alone (the control is inert).
- **Decoration:** underline is reserved for hover/affordance; the semibold weight +
  link color distinguish the link at rest. Within body copy, prefer a persistent
  underline for the clearest affordance.
- **Contrast:** link / hover / active / disabled colors come from the design tokens,
  authored to meet WCAG contrast against the surface.
- **WCAG:** 1.4.3 / 1.4.11 (contrast), 2.1.1 (keyboard), 2.4.4 (link purpose), 2.4.7
  (focus visible), 4.1.2.
