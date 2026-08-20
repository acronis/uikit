# Section — behavior

Section is a compound component: `Section` (root) + `SectionHeader` +
`SectionContent`. Either part may be omitted; the root has no minimum
composition. `SectionHeader` owns most of the interactive surface described
below.

## Composition

```gherkin
Scenario: A fully composed section
  Given a Section wrapping a SectionHeader and a SectionContent
  When the section renders
  Then the header and content appear in source order

Scenario: Parts are optional
  Given a Section wrapping only a SectionContent
  When the section renders
  Then the section renders with just the content region
  And no header spacing is reserved
```

## Root — variant

```gherkin
Scenario: Default layout
  Given a Section with variant unset (or "column1")
  When the section renders
  Then the root insets its children (px-4 pt-4) with a 12px gap between
    the header and content
  And the content stacks its children as a plain block column

Scenario: Two-column layout
  Given a Section with variant set to "column2-70-30"
  When the content renders two children
  Then they lay out as a 3-column grid
  And the first child spans two of the three columns

Scenario: Three-column grid layout
  Given a Section with variant set to "grid3"
  When the content renders children
  Then they lay out as a plain 3-column grid

Scenario: Flush table layout
  Given a Section with variant set to "table"
  When the section renders
  Then the root has no horizontal padding or gap of its own
  And the header (if present) re-applies its own px-4 pt-4 pb-3 inset
  And the content bleeds edge-to-edge inside the section
```

## Root — hasBottomBorder

```gherkin
Scenario: No border by default
  Given a Section with hasBottomBorder unset (or false)
  When the section renders
  Then no bottom divider appears

Scenario: Border on a padded variant
  Given a Section with variant "column1" (or "column2-70-30" / "grid3") and
    hasBottomBorder set to true
  When the section renders
  Then a bottom divider appears using the on-surface-divider token
  And the root gains matching 16px bottom padding

Scenario: Border on the table variant
  Given a Section with variant "table" and hasBottomBorder set to true
  When the section renders
  Then a bottom divider appears
  And no extra bottom padding is added, since the root has no padding to extend
```

## Header — title & description

```gherkin
Scenario: Default title
  Given a SectionHeader with no title prop
  When the header renders
  Then the title reads "Section Title"

Scenario: Description hidden by default
  Given a SectionHeader with a description prop but hasDescription unset
  When the header renders
  Then the description text does not appear

Scenario: Description shown
  Given a SectionHeader with a description prop and hasDescription set to true
  When the header renders
  Then the description appears below the title row
```

## Header — switch

```gherkin
Scenario: Switch hidden by default
  Given a SectionHeader with isSwitchable unset
  When the header renders
  Then no switch appears

Scenario: Switch shown and toggled
  Given a SectionHeader with isSwitchable set to true
  When the user activates the switch
  Then onSwitchCheckedChange fires with the new checked value
```

## Header — icon

```gherkin
Scenario: Icon hidden by default
  Given a SectionHeader with no icon prop
  When the header renders
  Then no icon appears at the start of the header

Scenario: Icon shown alongside the switch
  Given a SectionHeader with both isSwitchable set to true and an icon node
  When the header renders
  Then the switch appears first, followed by the icon, then the title
```

## Header — extras & actions

```gherkin
Scenario: Extras render next to the title
  Given a SectionHeader with an extras node
  When the header renders
  Then the extras node appears immediately after the title

Scenario: Actions render at the end of the header
  Given a SectionHeader with an actions node
  When the header renders
  Then the actions node appears at the end of the header row
```

## Header — collapsible

```gherkin
Scenario: Collapse trigger hidden by default
  Given a SectionHeader with isCollapsible unset
  When the header renders
  Then no collapse trigger appears

Scenario: Collapse trigger has no effect outside a collapsible AccordionContainer
  Given a SectionHeader with isCollapsible set to true, rendered with no
    ancestor AccordionContainer
  When the header renders
  Then no collapse trigger appears

Scenario: Collapse trigger shown and operated inside a collapsible AccordionContainer
  Given a Section composed as: AccordionContainer(collapsible) wrapping a
    SectionHeader with isCollapsible set to true, and an
    AccordionContainer.Content wrapping SectionContent
  When the user activates the collapse trigger
  Then the AccordionContainer's onOpenChange fires with the new open value
  And AccordionContainer.Content's children (SectionContent) are hidden
    when closed and shown when open
  And the header itself remains visible in both states
```

## Pass-through

```gherkin
Scenario: Native attributes pass through
  Given a Section with an id, data-* attribute, and aria-label
  When the section renders
  Then those attributes appear on the root element

Scenario: A custom className is merged, not replaced
  Given a Section with className="w-[640px]"
  When the section renders
  Then the root carries both "w-[640px]" and the section's base classes
```

## Polymorphism

```gherkin
Scenario: Rendering the root as a semantic element
  Given a Section with render={<section />}
  When the section renders
  Then it renders as a <section> element
  And it keeps the section's layout classes
```
