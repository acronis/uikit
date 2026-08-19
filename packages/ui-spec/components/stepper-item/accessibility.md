# StepperItem — accessibility

- **Presentational by default.** The step renders a `<div>`: no role, no tab
  stop. That is correct for the current and future steps, which are not actions.
- **A completed step is usually a control** — compose it with `render` as a real
  `<button>` (or a link, if it changes the URL). Doing so gives it keyboard focus,
  Enter/Space activation, and a native accessible name for free. Never fake it
  with a click handler on the default `<div>`.
- **Keyboard focus is visible.** The step carries the library's standard 3px
  `--ui-focus-primary` `focus-visible` ring (the same one `CardFilter` and
  `BreadcrumbLink` use), so a step composed as a control is never focused
  invisibly. The default `<div>` is not focusable, so the ring never shows there.
- **The accessible name comes from the content you pass.** The step's name is the
  `label`; the marker contributes whatever text the caller's avatar renders (a
  number, initials). If the marker's digit would be noise, mark that avatar
  `aria-hidden` in your own composition — the step cannot decide that for you.
- **A future step is `aria-disabled`, not `disabled`.** It stays in the reading
  order so a screen-reader user can see the whole sequence, but it announces as
  unavailable. Three things make that true rather than aspirational:
  - On the default rendering it also carries **`role="link"`**. `aria-disabled` on
    an element with no widget role is not announced (ARIA 1.2), and the default
    rendering is a plain `<div>` — so without a role the flag would be inert. This
    is the same fix `BreadcrumbPage` applies to the non-navigable current page: a
    destination that is in the sequence but cannot be gone to. The role is
    **omitted** when the step is composed via `render`, because the element the
    consumer supplies brings its own (more accurate) role.
  - It is removed from the tab order (**`tabindex="-1"`**), so a step composed as
    a real `<button>` cannot be tabbed to or activated with Enter/Space.
  - It receives no pointer events, so it cannot be clicked.

  What this does **not** give you is the native `disabled` guarantee: a
  programmatic `.focus()` + `.click()` on a composed control still fires its
  handler. Skip future steps in your own navigation logic too.

- **Ships no strings.** Every piece of text is consumer-supplied (`label`, the
  avatar's content), so there is nothing to localize inside the component and no
  default English copy to override.
- **`state` is not a live interaction state.** It is a declarative look, so a
  step forced to `hover` or `active` conveys nothing to assistive tech. Never use
  it as the only signal of the step a user is on — that is `variant="current"`,
  and the application should also expose the position in text ("Step 2 of 3").
- **Sequence semantics belong to the container.** A single step is not a list. If
  the whole stepper should announce as an ordered sequence, wrap the steps in an
  `<ol>`/`<li>` (or a `role="list"`) at the application layer, and mark the
  current step with `aria-current="step"` on the element you compose.
- **RTL**: the marker, label, padding, and gap all use logical properties, so the
  whole step mirrors under `dir="rtl"` with no extra work.

## Contrast

The step name uses the primary surface-text token on the light surface fills, and
the disabled surface-text token when the step is in the future. Because neither is
a Stepper-owned token yet (see `tokens.yaml`), contrast is inherited from the semantic scale and holds
in both light and dark. Re-check it when the dedicated `--ui-stepper-item-*` tier
ships, since a brand may then define distinct values.
