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

`InputSelect` now also resets the in-dropdown search query when a controlled
`open` prop goes from `true` to `false` on its own — the case where an external
toggle button's click handler flips the state directly and Base UI never reports
the transition through `onOpenChange`, which previously left the stale query in
place on the next open. Resets driven by `onOpenChange` are unchanged, including
the existing carve-out for a consumer that calls `eventDetails.cancel()` to keep
the popup open (the pattern an external `anchor` button needs, so its own
pointerdown isn't treated as a dismissing outside press) — that still keeps the
user's typed query.

A new `isPopoverStyled` boolean draws the dropdown's container chrome like
`PopoverContent` — `--ui-popover-container-*` fill / border / radius, no shadow,
and a fade/zoom/slide enter-exit animation — instead of the default
`--ui-input-select-dropdown-container-*` tokens + static `shadow-md`. Only the
container chrome and the transition change: the popup keeps the dropdown's
anchor-width sizing and vertical padding, and every row inside it (search,
sections, items, status) is untouched. Defaults to `false`, keeping the existing
look.
