# Alert — behavior

```gherkin
Scenario: Announce a status
  Given an Alert with a title and description
  Then it renders with role="alert" so assistive tech announces it
```

```gherkin
Scenario: Severity variant
  Given variant="success" (or info / warning / critical / destructive / ai / neutral)
  Then the banner uses that status's surface, text, and accent-border colors
```

```gherkin
Scenario: Compose the parts
  Given AlertIcon, AlertContent, AlertTitle, AlertDescription
  Then the icon sits left of the text column with the title above the description
```
