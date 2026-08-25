# ChartWidget — behavior

## Composition, not a container

`ChartWidget` is a `Card` plus two things a card doesn't know about: what the
body shows while there's no plot, and how much height to reserve for it.
Everything else is `Card`'s.

The `header` prop is typed `CardHeaderProps` and spread onto `CardHeader`. That
is the whole header contract — title, description, the `extras` filter chip, the
`actions` ⋯ menu, the drag handle, the switch, the avatar, rename, and the
collapse trigger. None of it is re-declared here, so a header feature added to
`Card` reaches this component without a change, and can't drift out of sync.

The per-type chart components stay **card-less**. They are the plot; the card is
composition. That keeps `<AreaChart>` usable inside a table cell, a popover or a
`Metric`'s sparkline slot, where a card would be wrong.

## No size of its own

The Figma sets carry a `size` axis of `sm` / `md` / `lg`, but measuring all eight
shows it only changes the frame **width** — 288 / 592 / 896. And every card, and
every card body, is `HUG` vertically: the height is whatever the content adds up
to.

So the widget declares no size — it _passes one down_. The dashboard grid gives
the card a height; the card is a full-height flex column; the header is
`shrink-0`; the body takes the rest; and the plot slot takes what the metric row
leaves. A chart given `size-full` therefore occupies the whole remaining card.

`min-h-0` appears at every step of that chain, and it is load-bearing: without
it a flex child refuses to shrink below its content's height, so a tall chart
would push the card past the height the grid gave it instead of fitting inside.

Dropped into a parent with no definite height, `h-full` resolves to `auto` and
the card hugs its content instead — so a standalone widget still works, with the
chart bringing its own height. `bodyClassName` covers the remaining gap: a
placeholder-only widget outside a sized cell, where neither the grid nor the
content can give a height.

An earlier draft of this component reserved a fixed body height per chart type,
reverse-engineered from the mockup frames (252 for area, 205 for funnel, …).
That was wrong: those numbers are what a hug layout happened to produce, not a
design constraint, and hard-coding them would have fought the grid.

## State

`state` renders `ChartState` **instead of** `children`. The header stays.

`state="error"` also maps to `Card`'s `hasError`, so the error border and the
error placeholder come from one prop. A caller can't get one without the other,
which is what the mockups draw.

`ChartState` owns the live-region contract (`role="status"` for loading/empty,
`role="alert"` for error), so the announcement follows the placeholder rather
than being re-declared on the widget.

## Localization

Every string is the caller's: the header's `title` / `description`, the metric's
own labels, `stateMessage`, and the label inside `stateAction`. The only
literals are `ChartState`'s per-state defaults, which `stateMessage` overrides.
