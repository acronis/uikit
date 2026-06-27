# Skeleton — behavior

```gherkin
Scenario: Placeholder while loading
  Given content is not ready
  Then a Skeleton renders a pulsing box at the caller's size/shape
  When the content arrives
  Then the caller swaps the Skeleton for the real content
```

```gherkin
Scenario: Shape from className
  Given a Skeleton with className="size-12 rounded-full"
  Then it renders a 48px circular placeholder
```
