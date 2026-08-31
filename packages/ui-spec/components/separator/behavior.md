# Separator — behavior

Separator is a static divider. It has no state and no interaction; its only
props are `orientation` and `size`.

```gherkin
Scenario: Horizontal rule (default)
  Given a Separator with no orientation
  Then it renders a full-width, 1px-tall rule
```

```gherkin
Scenario: Vertical rule
  Given a Separator with orientation="vertical"
  Then it renders a full-height, 1px-wide rule and sets aria-orientation="vertical"
  And it needs a sized (height-bearing) flex/inline context to be visible
```

```gherkin
Scenario: Default size has no built-in spacing
  Given a Separator with no size
  Then it renders with size="S1" and applies no surrounding margin
```

```gherkin
Scenario: S2/S3 apply built-in surrounding spacing
  Given a Separator with size="S2" or size="S3"
  Then it applies --ui-gap-4 or --ui-gap-8 as margin on the axis
    perpendicular to the rule (vertical margin for horizontal, horizontal
    margin for vertical)
```
