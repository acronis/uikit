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
  **Then** they render after the label, before the connecting line.

## Variant drives the step's role

- **Given** `variant="current"`
  **Then** the container is filled with the active surface and the name uses the
  primary surface text — regardless of `state`, because the design draws the
  current step in exactly one look.
- **Given** `variant="completed"`
  **Then** the name uses the primary surface text and the container is filled only
  according to `state`.
- **Given** `variant="future"`
  **Then** the name uses the disabled surface text, the container has no fill, the
  element is marked `aria-disabled`, and it receives no pointer events — again
  regardless of `state`.

## State is only observable on a completed step

- **Given** `variant="completed"` **and** `state="idle"`
  **Then** the container has no fill.
- **Given** `variant="completed"` **and** `state="hover"`
  **Then** the container is filled with the hover surface.
- **Given** `variant="completed"` **and** `state="active"`
  **Then** the container is filled with the active surface — the same fill the
  current step carries.
- **Given** any `state` **and** `variant` of `current` or `future`
  **Then** nothing changes. `state` is not silently dropped from the contract: it
  still appears as a data attribute, so a consumer can key off it.

## Connecting line

- **Given** `connectingLine`
  **Then** a decorative 1px line is drawn trailing the container's inline-end
  edge, spanning the gap to the next step.
- **Given** `connectingLine` on the last step in a row
  **Then** the line dangles — omit it there; the component cannot see its siblings.
- **Given** `dir="rtl"`
  **Then** the line mirrors to the other edge, because it is positioned with
  logical properties rather than a baked asset.

## Composition

- **Given** a `render` prop
  **Then** the rendered element is replaced (e.g. by a `<button>`) and the step's
  props, classes, and data attributes merge onto it.
- **Given** `variant="future"` **and** a `render` of a real control
  **Then** the control still renders, but it is `aria-disabled` and inert to
  pointer input — the application should also skip it in its own navigation.

## Not owned here

- The step sequence, its order, numbering, and which step is current — the
  application decides and passes `variant` per step.
- The marker's content and appearance — the caller composes the avatar.
- Hover and press detection: `state` is declarative, so the consumer (or a future
  `Stepper` root) decides when a step looks hovered or pressed.
