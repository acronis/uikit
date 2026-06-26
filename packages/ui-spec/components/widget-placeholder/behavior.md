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
