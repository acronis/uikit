# Separator — behavior

Separator is a static divider. It has no props beyond `orientation`, no state,
and no interaction.

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
