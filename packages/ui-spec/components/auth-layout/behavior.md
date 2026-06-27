# AuthLayout — behavior

```gherkin
Scenario: Centered auth card
  Given an AuthLayout with a card of a logo, form, and footer
  Then the card is centered on the full-height page surface at a small max-width
```

```gherkin
Scenario: Flows
  Given different children (sign-in / sign-up / 2FA forms)
  Then the same centered-card chrome frames each flow
```
