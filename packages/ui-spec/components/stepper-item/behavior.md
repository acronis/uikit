# StepperItem — behavior

## Renders a marker and a name

- **Given** an `avatar`
  **Then** it renders first inside the container, exactly as passed — the step
  never sizes, tints, or recolors it.
- **Given** a `label`
  **Then** it renders after the marker and truncates rather than wrapping.
- **Given** no `label`
  **Then** only the marker renders; the container keeps its padding.
- **Given** `children`
  **Then** they render last, after the label.

## Variant drives the step's role

- **Given** `variant="current"`
  **Then** the container is filled and bordered with the current-step tokens
  and the name uses the current-step label color — regardless of `state`,
  because the design draws the current step in exactly one look.
- **Given** `variant="completed"`
  **Then** the name uses the completed-step label color and the container is
  filled only according to `state`.
- **Given** `variant="future"`
  **Then** the name uses the future-step label color, the container has no
  fill, the element is marked `aria-disabled`, it is removed from the tab order
  (`tabindex="-1"`), and it receives no pointer events — again regardless of
  `state`. On the default `<div>` it also carries `role="link"`, without which
  `aria-disabled` would not be announced at all (see `accessibility.md`).

## State is only observable on a completed step

- **Given** `variant="completed"` **and** `state="idle"`
  **Then** the container has no fill.
- **Given** `variant="completed"` **and** `state="hover"`
  **Then** the container is filled with the hover token.
- **Given** `variant="completed"` **and** `state="active"`
  **Then** the container is filled with the active token.
- **Given** `variant="completed"` **and** `state="focus"`
  **Then** the container is filled with the focus-ring token.
- **Given** any `state` **and** `variant` of `current` or `future`
  **Then** nothing changes. `state` is not silently dropped from the contract: it
  still appears as a data attribute, so a consumer can key off it.

## RTL

- **Given** `dir="rtl"`
  **Then** the whole step mirrors: the marker/label order, the container padding,
  and the gap are all logical, with no physical directional utility to correct.

## Composition

- **Given** a `render` prop
  **Then** the rendered element is replaced (e.g. by a `<button>`) and the step's
  props, classes, and data attributes merge onto it.
- **Given** a `render` of a focusable control
  **Then** focusing it by keyboard shows the library's 3px `--ui-focus-primary`
  ring. The default `<div>` never focuses, so the ring never appears on it.
- **Given** `variant="future"` **and** a `render` of a real control
  **Then** the control still renders, but it is `aria-disabled`, inert to pointer
  input, and removed from the tab order — so it cannot be tabbed to or activated
  from the keyboard. It is **not** the native `disabled` attribute, so a
  programmatic `.focus()` + `.click()` still works; the application should also
  skip the step in its own navigation.

## Not owned here

- The row layout and the narrow-viewport summary — that is `Stepper`, which these
  steps are meant to be composed inside.
- The step sequence, its order, numbering, and which step is current — the
  application decides and passes `variant` per step.
- The marker's content and appearance — the caller composes the avatar.
- Hover and press detection: `state` is declarative, so the consumer decides when
  a step looks hovered, pressed, or focused (`Stepper` does not — it owns no
  step state).
