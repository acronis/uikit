# Popover — behavior

Popover shows a floating panel anchored to a trigger. It owns the open state (or
the consumer controls it via `open`).

## Opening & closing

```gherkin
Scenario: Toggling from the trigger
  Given a closed popover
  When the user activates the trigger
  Then the popup opens, positioned per side/align, and receives focus
  And open-change(true) fires
```

```gherkin
Scenario: Dismissing
  Given an open popover
  When the user presses Escape, or presses outside the popup
  Then the popover closes and open-change(false) fires
  And focus returns to the trigger
```

## Controlled vs uncontrolled

```gherkin
Scenario: Uncontrolled with default-open
  Given a Popover with default-open = true and no open prop
  When it mounts
  Then it renders open and the user can dismiss it without consumer code
```

```gherkin
Scenario: Controlled
  Given a Popover with a fixed open prop
  When the user attempts to toggle it
  Then internal state does NOT change on its own
  And open-change fires so the consumer can update open
```

## Positioning

```gherkin
Scenario: Side and alignment
  Given a PopoverContent with side="right" and align="start"
  When it opens
  Then the popup renders to the right of the trigger, aligned to its start edge
  And it flips/shifts to stay within the viewport when space is tight
```

## Positioning inside a constrained portal container

```gherkin
Scenario: Escaping a constrained portal container's clipping
  Given a PopoverContent portaled (default) into a resolved portal-container
    that constrains overflow (e.g. a small or offset MFE/Shadow DOM mount)
  When it opens
  Then it uses 'fixed' positioning by default, with collision-boundary left at
    the platform default ('clipping-ancestors')
  And it is not clipped at the portal container's own edge, since 'fixed'
    already drops that overflow-clipping ancestor from its clipping chain
```

```gherkin
Scenario: Overriding the computed defaults
  Given the same constrained-container setup
  When a consumer passes an explicit collision-boundary or position-method
  Then that value overrides the computed default
```

```gherkin
Scenario: Non-portaled content is unaffected
  Given a PopoverContent rendered without a portal (inline usage), even when
    a portal-container is resolved from context
  When it opens
  Then it keeps the platform's default positioning and collision boundary —
    the computed defaults only apply when this component's own `portal` prop
    is true. If a consumer supplies their own ancestor Portal targeting a
    constrained container, `portal={false}` content can still end up inside
    that container's containing block and clip; pass `position-method`
    explicitly in that case.
```
