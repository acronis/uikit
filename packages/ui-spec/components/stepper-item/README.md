# StepperItem

One step in a stepper: a consumer-composed avatar marker followed by the step
name. `variant` says where the step sits in the sequence (`current`,
`completed`, `future`) and drives the container fill, border, and the label
color; `state` is the interaction look, and it only changes anything on a
completed step. Compose the steps inside `Stepper`, which lays them out.

## When to use

- A wizard / checkout / onboarding progress indicator, one `StepperItem` per step.
- Any short, ordered sequence where the user needs to see what is done, where they
  are, and what is still ahead — and can jump back to a completed step.

## When not to use

- To show progress as a single quantity — use `Progress` or `ProgressCircle`.
- For a chronological log of things that already happened — use `Timeline`.
- As the whole stepper — that is `Stepper`, which lays the steps out in a row and
  adds the compact, narrow-viewport summary. Don't hand-roll that row. The
  application still decides each step's `variant` and owns the navigation.

## Usage

```tsx
<Stepper
  currentStep={2}
  totalSteps={3}
  current="Choose a plan"
  next="Confirm and pay"
>
  <StepperItem
    variant="completed"
    label="Create an account"
    avatar={
      <Avatar color="green" className="[box-shadow:none]">
        <CheckIcon size={16} />
      </Avatar>
    }
    render={<button type="button" onClick={() => goToStep(1)} />}
  />
  <StepperItem
    variant="current"
    label="Choose a plan"
    avatar={
      <Avatar
        color="blue"
        className="[box-shadow:none] text-[var(--ui-stepper-item-current-label-color)]"
      >
        <AvatarFallback>2</AvatarFallback>
      </Avatar>
    }
  />
  <StepperItem
    variant="future"
    label="Confirm and pay"
    avatar={
      <Avatar
        color="gray"
        className="[box-shadow:none] text-[var(--ui-stepper-item-future-label-color)]"
      >
        <AvatarFallback>3</AvatarFallback>
      </Avatar>
    }
  />
</Stepper>
```

The marker is entirely yours: color scheme, initials vs. icon vs. image, size
overrides. The step renders the element verbatim and never restyles it — with
two caveats the caller applies via `className`, both shown above:

- Figma recolors the digit inside a `current`/`future` avatar to that step's
  own label-color token, overriding `Avatar`'s usual per-scheme color
  (`completed`'s checkmark is a fixed icon, so it needs none).
- `Avatar`'s 2px outset ring (`box-shadow`, meant to separate overlapping
  avatars in an `AvatarGroup`) is switched off with `[box-shadow:none]` —
  Figma's `StepperItem` avatars carry no stroke, and left on, the ring shows
  as an unwanted halo on `current`'s blue fill and on `completed`'s
  hover/active fills. See "Design status" below.

Only six `variant` x `state` combinations exist in the design, and the
component reproduces exactly that: `current` is always highlighted with a
border, `future` is always disabled, and only `completed` reads `state`
(`idle`, `hover`, `active`, `focus`).

## Parts

| Part             | Element | Notes                                                                                                             |
| ---------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| container (root) | `div`   | Polymorphic via `render`; carries the fill, the focus ring, and a future step's `aria-disabled` / `tabindex="-1"` |
| `avatar-slot`    | —       | Required; the caller's `Avatar`, rendered verbatim                                                                |
| `label`          | `span`  | The step name; truncates                                                                                          |

## Design status

The Figma component has a dedicated `--ui-stepper-item-*` token tier as of the
2026-08-24 sync — see `tokens.yaml` for the full list.

**Resolved quirk — `Avatar`'s 2px ring on colored step backgrounds.**
`Avatar` always paints a 2px `--ui-avatar-global-avatar-border-color` ring
(white in light mode), meant to separate overlapping avatars in an
`AvatarGroup`. Figma's own `StepperItem` composition never draws this ring
(verified in the raw reference markup — none of the `current`/`completed`/
`future` avatar instances carry a border/box-shadow class), so it's invisible
where a step's container has no fill but becomes a visible halo on `current`'s
blue background and on `completed`'s hover/active fills. This is a pre-existing
`Avatar`-wide behavior (present anywhere an avatar sits on a colored surface,
e.g. `Timeline`'s marker), not something `StepperItem` introduces or can fix by
itself — `StepperItem` is documented to render the marker verbatim, so the
caller switches the ring off with `className="[box-shadow:none]"` on the
composed `Avatar`, as shown in Usage above (the same pattern `Timeline`'s
marker already used).
