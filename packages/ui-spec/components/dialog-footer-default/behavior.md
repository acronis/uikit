# DialogFooterDefault — behavior

DialogFooterDefault is a pure function of its props — no internal state, no
interaction of its own (interactivity lives on the composed `Button`/`Link`
children).

```gherkin
Scenario: Actions only
  Given a DialogFooterDefault with no `description` or `link`
  Then its children render end-aligned (root falls back to justify-end)
```

```gherkin
Scenario: With a description
  Given a DialogFooterDefault with description="Changes are saved automatically as you type."
  Then the description renders truncated (single line, ellipsis) next to the actions
  And the actions no longer need the justify-end fallback (the description's
    flex-1 pushes them to the end)
```

```gherkin
Scenario: With a link
  Given a DialogFooterDefault with link={<Link href="/docs">Learn more</Link>}
  Then the link renders in a 32px-tall row next to the actions, untruncated
```

```gherkin
Scenario: description and link are mutually exclusive
  Given a DialogFooterDefault with both `description` and `link` set
  Then both slots render (the component does not validate mutual exclusivity) —
    callers should pass at most one, matching the single Figma `variant`
```
