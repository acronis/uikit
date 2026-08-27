---
'@acronis-platform/ui-react': minor
---

feat(input-select): add `alignOffset`/`collisionAvoidance`/`anchor`/`isPopoverStyled` props to `InputSelectContent`

`InputSelectContent` now forwards `alignOffset`, `collisionAvoidance`, and
`anchor` to Base UI's `Select.Positioner`, so a dropdown can be pinned to an
explicit `side`/`align` instead of being auto-flipped when space is tight —
e.g. `side="right" sideOffset={20} collisionAvoidance={{ side: 'none',
fallbackAxisSide: 'none' }}` keeps the popup to the right of the trigger.
`alignOffset` nudges it along the alignment axis without changing `align`.
`anchor` lets the popup position itself against an element other than
`InputSelectTrigger` — e.g. an external button that drives a hidden trigger.
All three props are optional; omitting them keeps today's behavior (Base UI's
own flip/shift collision handling, anchored to the trigger).

A new `isPopoverStyled` boolean renders the dropdown chrome like
`PopoverContent` (`--ui-popover-container-*` tokens, no shadow, fade/zoom/slide
enter-exit animation) instead of the default
`--ui-input-select-dropdown-container-*` tokens + static `shadow-md`. Defaults
to `false`, keeping the existing look.
