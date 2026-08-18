# StepperItem — accessibility

- **Presentational by default.** The step renders a `<div>`: no role, no tab
  stop. That is correct for the current and future steps, which are not actions.
- **A completed step is usually a control** — compose it with `render` as a real
  `<button>` (or a link, if it changes the URL). Doing so gives it keyboard focus,
  Enter/Space activation, and a native accessible name for free. Never fake it
  with a click handler on the default `<div>`.
- **The accessible name comes from the content you pass.** The step's name is the
  `label`; the marker contributes whatever text the caller's avatar renders (a
  number, initials). If the marker's digit would be noise, mark that avatar
  `aria-hidden` in your own composition — the step cannot decide that for you.
- **A future step is `aria-disabled`, not `disabled`.** It stays in the reading
  order so a screen-reader user can see the whole sequence, but it announces as
  unavailable. It also receives no pointer events, so a stray `render` control
  cannot be clicked.
- **Ships no strings.** Every piece of text is consumer-supplied (`label`, the
  avatar's content), so there is nothing to localize inside the component and no
  default English copy to override.
- **`state` is not a live interaction state.** It is a declarative look, so a
  step forced to `hover` or `active` conveys nothing to assistive tech. Never use
  it as the only signal of the step a user is on — that is `variant="current"`,
  and the application should also expose the position in text ("Step 2 of 3").
- **The connecting line is decorative** (`aria-hidden`) — it carries no meaning
  beyond "these steps are one sequence".
- **Sequence semantics belong to the container.** A single step is not a list. If
  the whole stepper should announce as an ordered sequence, wrap the steps in an
  `<ol>`/`<li>` (or a `role="list"`) at the application layer, and mark the
  current step with `aria-current="step"` on the element you compose.
- **RTL**: the marker, label, padding, and the connecting line all use logical
  properties, so the whole step mirrors under `dir="rtl"` with no extra work.

## Contrast

The step name uses the primary surface-text token on the light surface fills, and
the disabled surface-text token when the step is in the future; the connecting
line uses the shared border token. Because none of these are Stepper-owned tokens
yet (see `tokens.yaml`), contrast is inherited from the semantic scale and holds
in both light and dark. Re-check it when the dedicated `--ui-stepper-item-*` tier
ships, since a brand may then define distinct values.
