# Stack — behavior

```gherkin
Scenario: Arrange children
  Given a Stack with direction / gap / align / justify
  Then its children lay out as a flex row or column with that spacing and alignment
```

```gherkin
Scenario: Wrap
  Given wrap is set
  Then children wrap onto multiple lines when they overflow
```
