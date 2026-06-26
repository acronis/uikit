# Card — behavior

Card is a presentational container assembled from composable parts. It has no
variant props, no internal state, and no interaction behavior of its own — it is
a pure function of its composition. The scenarios below describe composition and
pass-through behavior.

## Composition

```gherkin
Scenario: A fully composed card
  Given a Card wrapping a CardHeader (with a CardTitle and CardDescription),
        a CardContent, and a CardFooter
  When the card renders
  Then the header, title, description, content, and footer appear in source order
  And the root carries the rounded border, surface background, and shadow
```

```gherkin
Scenario: Parts are optional
  Given a Card wrapping only a CardContent
  When the card renders
  Then the card surface renders with just the content region
  And no header or footer spacing is reserved
```

## Pass-through

```gherkin
Scenario: Native attributes pass through
  Given a Card with an id, data-* attribute, and aria-label
  When the card renders
  Then those attributes appear on the root element
```

```gherkin
Scenario: A custom className is merged, not replaced
  Given a Card with className="w-[350px]"
  When the card renders
  Then the root carries both "w-[350px]" and the card's base classes
```

## Polymorphism

```gherkin
Scenario: Rendering a part as a semantic element
  Given a CardTitle with render={<h2 />}
  When the title renders
  Then it renders as an <h2> heading
  And it keeps the title's typography classes
```
