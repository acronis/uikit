# Stepper

The root of a step sequence. It renders the sequence **two ways** and lets CSS
pick one:

- **At 1024px and above** — the `StepperItem` children you pass, in a
  start-aligned row that wraps.
- **Below 1024px** — a two-line text summary instead: "Step 3 of 5: Choose a
  plan" and "Next: Confirm and pay". No step items at all.

Both subtrees are always in the DOM; a real viewport media query (Tailwind's
`lg:`) displays one and hides the other. So you supply **both** the children and
the summary props — the component cannot derive one from the other.

## When to use

- Any wizard / checkout / onboarding flow that has to stay usable on a narrow
  viewport, where a row of steps would not fit.
- Whenever you would otherwise lay `StepperItem`s out by hand: this is that row,
  plus the compact fallback.

## When not to use

- For a single step in isolation — that is `StepperItem`.
- To show progress as one quantity — use `Progress` or `ProgressCircle`.
- For a chronological log of things that already happened — use `Timeline`.

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
      <Avatar color="green">
        <CheckIcon size={16} />
      </Avatar>
    }
  />
  <StepperItem
    variant="current"
    label="Choose a plan"
    avatar={
      <Avatar color="blue">
        <AvatarFallback>2</AvatarFallback>
      </Avatar>
    }
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
</Stepper>
```

On the **last** step, omit `next` — the whole "Next: …" line is then left out
rather than rendered empty.

Every string the component generates itself is a prop so it can be translated —
`stepLabel` ("Step"), `ofLabel` ("of"), `nextLabel` ("Next:"), and
`separatorLabel` (": ", the punctuation before the step's name). Everything else
it renders is yours.

## Parts

| Part           | Element | Notes                                                  |
| -------------- | ------- | ------------------------------------------------------ |
| root           | `div`   | Full width; holds both layouts                         |
| `summary`      | `div`   | The compact layout, displayed below 1024px             |
| `current-line` | `p`     | "Step N of M: {current}", two-tone                     |
| `next-line`    | `p`     | "Next: {next}"; absent when `next` is omitted          |
| `items-row`    | `div`   | The `StepperItem` children, displayed at 1024px and up |

## Breakpoint boundary

Figma names the two variants `0-1024` and `>1025`, which leaves 1024px itself
ambiguous. The implementation uses the kit's pinned `lg` breakpoint — exactly
1024px (64rem) — so **1024px renders the wide row**, one pixel lower than the
Figma label implies. That is a deliberate choice to stay on the shared
breakpoint scale rather than mint a bespoke `1025px` query for one component;
the repo documents equivalent roundings elsewhere (see
`src/stories/breakpoints-demo.stories.tsx`).

## Design status

The Figma component has no `--ui-stepper-*` token tier yet. This v1 consumes the
semantic tokens whose resolved values match the design variables exactly
(`--ui-gap-4`, `--ui-gap-8`, `--ui-text-on-surface-{secondary,primary}`) and will
be re-pointed at the dedicated tier once design ships it — the same treatment
`StepperItem` already carries.
