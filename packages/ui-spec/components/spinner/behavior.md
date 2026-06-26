# Spinner — behavior

Spinner is an indeterminate loading indicator. It has no internal state and no
interaction — it spins continuously while mounted.

```gherkin
Scenario: Sizing
  Given a Spinner with size="lg"
  Then it renders a 32px ring (sm 16 · md 24 · lg 32 · xl 48)
```

```gherkin
Scenario: Color
  Given a Spinner with no color override
  Then the ring uses the brand blue (text-secondary via currentColor)
  And a `text-*` className overrides it (e.g. text-muted-foreground on a busy surface)
```

```gherkin
Scenario: Reduced motion
  Given a user with prefers-reduced-motion
  Then the platform animation honors that preference (the ring is still shown)
```
