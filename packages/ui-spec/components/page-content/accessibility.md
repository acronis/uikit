# PageContent — accessibility

PageContent is a `<div>`, not a landmark — it nests inside `AppShellMain` (the
`main` landmark) so a page has exactly one `main`. If you use PageContent without
App Shell, wrap it in your own `<main>`.

## Contrast

No color of its own; content carries its own colors.
