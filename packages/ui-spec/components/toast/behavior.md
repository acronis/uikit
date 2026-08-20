# Toast — behavior

Toast is imperative: render one `<Toaster>` region, then push notifications with
the `toast(...)` API from anywhere (including outside React — the manager is
module-level). The severity is chosen by which method is called, not by a prop.

```gherkin
Scenario: Show a toast
  Given a mounted <Toaster>
  When toast('Event created', { description: 'Monday at 6:00 PM' }) is called
  Then a card with the title and description appears in the bottom-end stack
  And it uses the info severity (the Figma's default variant)
  And it auto-dismisses after the timeout (default 5000ms)
```

```gherkin
Scenario: Severities
  Given toast.info / success / warning / critical / danger is called
  Then the card keeps its neutral surface
  And its border and 6px leading status line take that severity's color
  And it shows that severity's multicolor status icon
```

```gherkin
Scenario: No description
  Given a toast created without a description
  Then only the title renders, and the icon stays aligned with its first line
```

```gherkin
Scenario: Long description
  Given a description longer than three lines
  Then it is clamped to three lines with a trailing ellipsis
```

```gherkin
Scenario: Loading
  Given toast.loading('Processing…') is called
  Then the card shows a spinner in place of the status glyph
  And it borrows the info border and status line (there is no Figma loading variant)
  And it does NOT auto-dismiss
  And toast.dismiss(id) or toast.promise resolution removes it
```

```gherkin
Scenario: Actions
  Given a toast created with actions: [{ label: 'View' }, { label: 'Undo' }]
  Then a wrapping row renders under the text
  And the first action uses the secondary button style, the rest ghost
  When an action is clicked
  Then its onClick runs and the toast stays open
```

```gherkin
Scenario: Promise lifecycle
  Given toast.promise(p, { loading, success, error }) is called
  Then a persistent loading toast appears
  And on fulfilment it becomes a success toast
  And on rejection it becomes a danger toast
```

```gherkin
Scenario: Manual dismiss
  Given a visible toast
  When the close (✕) button is clicked
  Then the toast animates out and is removed
```

```gherkin
Scenario: Not dismissable
  Given a toast created with dismissable: false
  Then no close (✕) button renders
  And swiping it does not dismiss it either
  And it leaves only on its timeout, or via toast.dismiss(id)
```

```gherkin
Scenario: Direction
  Given dir="rtl" on an ancestor
  Then the stack pins to the bottom-left corner
  And the status line sits on the right (leading) edge
  And toasts slide in from the left
  And the status icons do NOT mirror
```

```gherkin
Scenario: Limit
  Given more than `limit` toasts (default 3) are active
  Then the oldest is dropped to make room for the newest
```

```gherkin
Scenario: Update in place
  Given toast(..., { id: 'x' }) is called twice with the same id
  Then the existing toast updates and its auto-dismiss timer resets
```
