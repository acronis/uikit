# Loading — behavior

Loading is a pure function of its props — no internal state, no interaction.
It renders continuously (via `Spinner`) while mounted.

```gherkin
Scenario: Default variant
  Given a Loading with no props
  Then it renders the inline variant with a 16px spinner and a visible label
  And the label reads "Data is loading…"
```

```gherkin
Scenario: Card variants
  Given a Loading with variant="onSurfacePrimary" (or "onSurfaceSecondary")
  Then it renders a rounded, padded chip with a 32px spinner stacked above the label
```

```gherkin
Scenario: On-screen variant
  Given a Loading with variant="onScreen"
  Then it renders a higher-contrast dark chip with a 48px white spinner and white label,
    suited to placement over busy/photo/video surfaces
```

```gherkin
Scenario: Custom label
  Given a Loading with label="Uploading files…"
  Then the visible label (or, when hasLabel is false, the root's aria-label) reads that text
```

```gherkin
Scenario: Label hidden but still accessible
  Given a Loading with hasLabel={false}
  Then no visible label renders
  And the root carries aria-label equal to `label`, so assistive tech still announces it
```

```gherkin
Scenario: Reduced motion
  Given a user with prefers-reduced-motion
  Then the platform animation honors that preference (the ring is still shown)
```
