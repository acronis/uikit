# StepperItem

One step in a stepper: a consumer-composed avatar marker followed by the step
name. `variant` says where the step sits in the sequence (`current`,
`completed`, `future`) and drives the container fill and the label color;
`state` is the interaction look, and it only changes anything on a completed
step. An optional trailing connecting line chains a row of steps together.

## When to use

- A wizard / checkout / onboarding progress indicator, one `StepperItem` per step.
- Any short, ordered sequence where the user needs to see what is done, where they
  are, and what is still ahead — and can jump back to a completed step.

## When not to use

- To show progress as a single quantity — use `Progress` or `ProgressCircle`.
- For a chronological log of things that already happened — use `Timeline`.
- As the whole stepper: there is no `Stepper` root yet. The application lays the
  steps out in a row, decides each step's `variant`, and owns the navigation.

## Usage

```tsx
<div className="flex items-center gap-4">
  <StepperItem
    variant="completed"
    label="Create an account"
    avatar={
      <Avatar color="green">
        <CheckIcon size={16} />
      </Avatar>
    }
    connectingLine
    render={<button type="button" onClick={() => goToStep(1)} />}
  />
  <StepperItem
    variant="current"
    label="Choose a plan"
    avatar={
      <Avatar color="blue">
        <AvatarFallback>2</AvatarFallback>
      </Avatar>
    }
    connectingLine
  />
  <StepperItem
    variant="future"
    label="Confirm and pay"
    avatar={
      <Avatar color="gray">
        <AvatarFallback>3</AvatarFallback>
      </Avatar>
    }
  />
</div>
```

The marker is entirely yours: color scheme, initials vs. icon vs. image, size
overrides. The step renders the element verbatim and never restyles it.

Only five `variant` x `state` combinations exist in the design, and the component
reproduces exactly that: `current` is always highlighted, `future` is always
disabled, and only `completed` reads `state`.

## Parts

| Part              | Element | Notes                                                                   |
| ----------------- | ------- | ----------------------------------------------------------------------- |
| container (root)  | `div`   | Polymorphic via `render`; carries the fill and the `aria-disabled` flag |
| `avatar-slot`     | —       | Required; the caller's `Avatar`, rendered verbatim                      |
| `label`           | `span`  | The step name; truncates                                                |
| `connecting-line` | `span`  | Decorative, opt-in via `connectingLine`; mirrors under RTL              |

## Design status

The Figma component has no `--ui-stepper-item-*` token tier yet. The
implementation consumes semantic/generic tokens whose resolved values match the
design variables exactly — see `tokens.yaml` for the mapping and the one value
(the 8px container radius) left as a static utility because tokens-pd has no
generic radius scale to point at.
