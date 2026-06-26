# Empty — behavior

Empty is a presentational placeholder assembled from composable parts. It has no
props, no variants, and no interaction state — it is a pure function of its
composition.

## Composition

```gherkin
Scenario: A full empty state
  Given an Empty wrapping an EmptyIcon, an EmptyHeader (EmptyTitle +
        EmptyDescription), and EmptyActions
  When it renders
  Then the icon, title, description, and actions stack centered in source order
```

```gherkin
Scenario: Parts are optional
  Given an Empty wrapping only an EmptyHeader with an EmptyTitle
  When it renders
  Then just the title shows, centered — no icon or actions space is reserved
```

## Usage

```gherkin
Scenario: Filling a region
  Given a list or table with no rows
  When the consumer renders an Empty in its place
  Then the empty state is centered within that region (the consumer sizes it)
```
