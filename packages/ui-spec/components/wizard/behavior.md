# Wizard — behavior

```gherkin
Scenario: Header band above the content column
  Given a Wizard holding a WizardHeader and a WizardBody
  Then the header band renders above the content column
  And the band sits on the secondary surface with a divider along its bottom edge
```

```gherkin
Scenario: Header stays put while a long step scrolls
  Given a WizardBody taller than the viewport
  When the user scrolls the step's content
  Then the WizardHeader stays pinned to the top of the scroll container
  So that the step context and the Cancel/Back/Next actions remain reachable
```

```gherkin
Scenario: Header row order
  Given a WizardHeader
  Then its children stack vertically in the order the consumer wrote them —
  breadcrumb, title row, subtitle, stepper — separated by a single fixed gap
```

```gherkin
Scenario: Title row is PageHeader's, reused
  Given a wizard's title and its Cancel/Back/Next actions
  Then they are composed from PageHeaderRow, PageHeaderTitle and PageHeaderActions
  And Wizard adds no WizardTitle / WizardActions parts of its own, since the row
  is functionally identical to a page header's
```

```gherkin
Scenario: Which actions show on a step
  Given a multi-step flow whose last step submits instead of advancing
  Then the consuming UI block decides which of Cancel / Back / Next / Submit to
  place in PageHeaderActions on each step
  And Wizard neither tracks the step index nor renders or wires any of those
  buttons — it provides only the slot
```

The design brief's own reference pairing (Figma's "Wizard" documentation page,
`node-id=11098-18`) for that per-step decision:

| Flow                     | Buttons                  |
| ------------------------ | ------------------------ |
| Single-step              | `[Cancel] [CTA]`         |
| Multi-step — first step  | `[Cancel] [Next]`        |
| Multi-step — middle step | `[Cancel] [Back] [Next]` |
| Multi-step — final step  | `[Cancel] [CTA]`         |

"CTA" is the flow's submit action (e.g. "Install agent", "Create migration",
"Delete device") — its label is never "Submit" generically. Note the final step
drops `Back` along with `Next`, matching the single-step pairing exactly; only
the middle steps carry three buttons.

```gherkin
Scenario: Optional subtitle
  Given a flow that needs a supporting line under its title
  Then a WizardSubtitle renders it in the muted secondary text color
  And omitting it leaves no empty row in the header band
```

```gherkin
Scenario: Optional stepper
  Given a wizard of two or three steps
  Then the flow may omit the Stepper entirely
  And Wizard neither requires one nor renders a fallback in its place
```

```gherkin
Scenario: Stepper collapses on a narrow viewport
  Given a WizardHeader containing a Stepper
  When the viewport is narrower than 1024px
  Then the Stepper itself swaps its item row for its two-line text summary
  And Wizard's own layout is unchanged — the switch belongs to Stepper
```

```gherkin
Scenario: Content column width
  Given a WizardBody
  Then its content is capped at 1024px and bottom-padded
  And a step needing a different width overrides it through className, since
  there is no width variant
```

```gherkin
Scenario: Step content is a Section
  Given a wizard step's fields
  Then they live inside a Section rendered as WizardBody's child
  And WizardBody itself contributes no titling or padding of its own beyond the
  cap and the bottom pad
```

```gherkin
Scenario: Right-to-left
  Given the wizard renders under dir="rtl"
  Then the header band's padding, the title row, and the content column mirror
  Because Wizard uses only symmetric and logical spacing utilities
```
