# Form — behavior

Form is built on Base UI's Form. It coordinates the ui-react `Field`s it contains
— no react-hook-form. Each Field carries a `name`; Form collects their values by
that name, validates them, and reports errors.

```gherkin
Scenario: Submit collects values by field name
  Given a Form with Fields named "email" and "password"
  And the user fills them in
  When the form is submitted
  Then onFormSubmit is called once with { email, password }
  And the native submit event is preventDefault-ed
```

```gherkin
Scenario: Validation gates submit
  Given a Field with a required control left empty
  When the form is submitted
  Then onFormSubmit is NOT called
  And the field is marked invalid (aria-invalid) and shows its FieldError
```

```gherkin
Scenario: Validation mode
  Given validationMode="onChange"
  Then each field validates on every change instead of only on submit
```

```gherkin
Scenario: Server errors
  Given errors={{ email: "That email is taken." }} (e.g. after a failed submit)
  Then the Field named "email" shows that message in its FieldError
  And the field is marked invalid
```

```gherkin
Scenario: Imperative validation
  Given an actionsRef on the Form
  When actionsRef.current.validate() is called
  Then all fields validate (or a single field when a name is passed)
```
