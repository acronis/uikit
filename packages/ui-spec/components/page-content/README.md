# PageContent

The page content region — the padded gutter for a page's body. A `<div>` meant to
nest inside `AppShellMain` (so it doesn't duplicate the `main` landmark).

> Design-pending v1, ported from the legacy shadcn-uikit `page-content`.

## When to use

- Wrapping a page's body inside `AppShellMain` to get the standard page padding.

## When not to use

- As the scroll container / main landmark — that's `AppShellMain`.

## Parts

`PageContent` is a single component.

## Example

```tsx
import {
  AppShellMain,
  PageContent,
  PageHeader,
} from '@acronis-platform/ui-react';

<AppShellMain>
  <PageContent>
    <PageHeader>…</PageHeader>
    {children}
  </PageContent>
</AppShellMain>;
```
