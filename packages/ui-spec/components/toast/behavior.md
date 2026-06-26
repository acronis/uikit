# Toast — behavior

Toast is imperative: render one `<Toaster>` region, then push notifications with
the `toast(...)` API from anywhere (including outside React — the manager is
module-level).

```gherkin
Scenario: Show a toast
  Given a mounted <Toaster>
  When toast('Event created', { description: 'Monday at 6:00 PM' }) is called
  Then a card with the title and description appears in the corner stack
  And it auto-dismisses after the timeout (default 5000ms)
```

```gherkin
Scenario: Status variants
  Given toast.success / info / warning / error is called
  Then the card shows the matching status icon (check / info / warning / error)
  Colored by --ui-text-on-status-*
```

```gherkin
Scenario: Loading
  Given toast.loading('Processing…') is called
  Then the card shows a spinner and does NOT auto-dismiss
  And toast.dismiss(id) or toast.promise resolution removes it
```

```gherkin
Scenario: Action
  Given a toast created with action: { label: 'Undo', onClick }
  Then an inline action button renders
  And clicking it invokes onClick
```

```gherkin
Scenario: Manual dismiss
  Given a visible toast
  When the close (✕) button is clicked
  Then the toast animates out and is removed
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
