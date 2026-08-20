# Card — behavior

Card is a compound component: `Card` (root) + `CardHeader` + `CardContent` +
`CardFooter`. Any part may be omitted; the root has no minimum composition.
`CardHeader` owns most of the interactive surface described below.

## Composition

```gherkin
Scenario: A fully composed card
  Given a Card wrapping a CardHeader, a CardContent, and a CardFooter
  When the card renders
  Then the header, content, and footer appear in source order
  And the root carries the rounded border and surface background
```

```gherkin
Scenario: Parts are optional
  Given a Card wrapping only a CardContent
  When the card renders
  Then the card surface renders with just the content region
  And no header or footer spacing is reserved
```

## Root — hasError

```gherkin
Scenario: Default border
  Given a Card with hasError unset (or false)
  When the card renders
  Then the root border uses the on-surface-border token

Scenario: Error border
  Given a Card with hasError set to true
  When the card renders
  Then the root border uses the on-surface-border-error token
  And the header divider and text colors are unchanged
```

## Header — title & description

```gherkin
Scenario: Default title
  Given a CardHeader with no title prop
  When the header renders
  Then the title reads "Title"

Scenario: Description hidden by default
  Given a CardHeader with a description prop but hasDescription unset
  When the header renders
  Then the description text does not appear

Scenario: Description shown
  Given a CardHeader with a description prop and hasDescription set to true
  When the header renders
  Then the description appears below the title
```

## Header — drag handle

```gherkin
Scenario: Drag handle hidden by default
  Given a CardHeader with isDraggable unset
  When the header renders
  Then no drag handle appears

Scenario: Drag handle shown
  Given a CardHeader with isDraggable set to true
  When the header renders
  Then a grip icon appears at the start of the header
  And it carries the accessible name from dragHandleLabel (default "Reorder")
```

## Header — switch

```gherkin
Scenario: Switch shown and toggled
  Given a CardHeader with isSwitchable set to true
  When the user activates the switch
  Then onSwitchCheckedChange fires with the new checked value
```

## Header — avatar

```gherkin
Scenario: Default avatar
  Given a CardHeader with hasAvatar set to true and no avatar override
  When the header renders
  Then an avatar with avatarLabel's initials appears before the title

Scenario: Custom avatar
  Given a CardHeader with hasAvatar set to true and an avatar override
  When the header renders
  Then the provided avatar node renders instead of the default initials avatar
```

## Header — rename

```gherkin
Scenario: Rename button shown and activated
  Given a CardHeader with hasRename set to true and an onRename handler
  When the user activates the rename button
  Then onRename fires
```

## Header — extras & actions

```gherkin
Scenario: Extras render next to the title
  Given a CardHeader with an extras node
  When the header renders
  Then the extras node appears immediately after the title (and rename button, if shown)

Scenario: Actions render at the end of the header
  Given a CardHeader with an actions node
  When the header renders
  Then the actions node appears at the end of the header row
```

## Header — collapsible

```gherkin
Scenario: Collapse trigger hidden by default
  Given a CardHeader with isCollapsible unset
  When the header renders
  Then no collapse trigger appears

Scenario: Collapse trigger has no effect outside a collapsible AccordionContainer
  Given a CardHeader with isCollapsible set to true, rendered with no
    ancestor AccordionContainer
  When the header renders
  Then no collapse trigger appears

Scenario: Collapse trigger shown and operated inside a collapsible AccordionContainer
  Given a Card composed as: AccordionContainer(collapsible) wrapping a
    CardHeader with isCollapsible set to true, and an AccordionContainer.Content
    wrapping CardContent/CardFooter
  When the user activates the collapse trigger
  Then the AccordionContainer's onOpenChange fires with the new open value
  And AccordionContainer.Content's children (CardContent, CardFooter) are
    hidden when closed and shown when open
  And the header itself remains visible in both states
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
Scenario: Rendering the root as a semantic element
  Given a Card with render={<article />}
  When the card renders
  Then it renders as an <article> element
  And it keeps the card's surface classes
```
