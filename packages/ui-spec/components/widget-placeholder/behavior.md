# WidgetPlaceholder — behavior

WidgetPlaceholder is a composable empty-state for a dashboard widget. It has no
internal state; the only behavioral switch is the `interactive` prop on the root.

```gherkin
Scenario: Static placeholder
  Given a WidgetPlaceholder without interactive
  Then the root is not focusable (no tabindex) and shows no hover affordance
```

```gherkin
Scenario: Interactive placeholder
  Given a WidgetPlaceholder with interactive
  Then the root is focusable (tabindex=0)
  And it shows a hover surface tint on pointer-over
  And a pressed surface tint while active
  And a focus ring when focused via keyboard
  And clicking it invokes the supplied onClick
```

```gherkin
Scenario: Truncating title
  Given a WidgetPlaceholderTitle whose text overflows the header
  Then the title truncates with an ellipsis rather than wrapping
```

```gherkin
Scenario: Optional footer
  Given a WidgetPlaceholder with a WidgetPlaceholderFooter
  Then a muted metadata line renders below the content
```

## Not `ChartState`

`ChartState` is the placeholder that goes _inside_ a chart's slot: it fills the
slot, renders `loading` / `empty` / `error`, and for `empty` draws the silhouette
the design defines for that chart type. `WidgetPlaceholder` is the composable
skeleton for a whole tile — its own header, footer and action parts, and an
`interactive` affordance — for a widget that isn't a chart, or one still being
set up.

Reach for `ChartState` when a chart has no data; for this when the widget itself
isn't there yet.
