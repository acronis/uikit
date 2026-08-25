# ChartWidget

The dashboard card a chart sits in.

Every chart in the Figma library is drawn inside the same card: a header with a
title, an optional filter chip and the ⋯ actions menu, then an optional metric
readout, then the plot. `ChartWidget` is that composition — and only that.

## What it adds

One thing a `Card` legitimately doesn't know about: **what the body shows while
there is no plot.** `state="loading" | "empty" | "error"` renders `ChartState` in
place of the chart, and `error` also gives the Card its error border — one prop,
not two.

## What it doesn't add

A header. `header` is typed `CardHeaderProps` and spread onto `CardHeader`, so
the whole header surface — including the parts this component never mentions
(`isDraggable`, `hasRename`, `isCollapsible`, …) — comes from `Card` and stays
in sync with it.

Nor a chart. The per-type chart components stay card-less, which keeps them
usable outside a widget.

## Why it takes no `size`

The Figma sets carry `size` = `sm` / `md` / `lg`, but it only changes the frame
width (288 / 592 / 896). The height is the dashboard grid's, and the widget
passes it down: the header takes what it needs, and a `size-full` chart fills
the rest of the card. See `behavior.md`.

## Files

| File               | What's in it                                                       |
| ------------------ | ------------------------------------------------------------------ |
| `index.yaml`       | Identity, category, status, `since`.                               |
| `api.yaml`         | The prop contract and the per-framework adapters.                  |
| `anatomy.yaml`     | Parts, the schematic, and the four body states.                    |
| `behavior.md`      | Composition, how the height reaches the plot, state, localization. |
| `accessibility.md` | Roles, the placeholder's live region, header controls.             |
| `tokens.yaml`      | The `--ui-*` tokens the widget references.                         |

## No Figma Code Connect

Deliberately absent. `ChartWidget` has no node of its own: in Figma the shape
lives inside each chart's own component set (ChartArea `8174:22232`, ChartBar
`8700:55606`, …), which wrap the `_CardLegacy` instance — and that maps to
`Card`, which is already connected.

So the connection belongs on the per-type chart components, whose examples
should show `<ChartWidget>` wrapping their plot. A `.figma.tsx` here would have
to point at one arbitrary chart set and would read as if the widget were that
chart.
