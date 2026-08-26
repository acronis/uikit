# PageContent

The page content region — the padded gutter for a page's body. A `<div>` meant to
nest inside `AppShellChatContentBody` (so it doesn't duplicate the `main` landmark).

> Design-pending v1, ported from the legacy shadcn-uikit `page-content`.

## When to use

- Wrapping a page's body inside `AppShellChatContentBody` to get the standard page padding.

## When not to use

- As the scroll container / main landmark — that's `AppShellChatContentBody`.

## Parts

`PageContent` is a single component.

## Example

```tsx
import {
  AppShellChatContentBody,
  PageContent,
  PageHeader,
} from '@acronis-platform/ui-react';

<AppShellChatContentBody>
  <PageContent>
    <PageHeader>…</PageHeader>
    {children}
  </PageContent>
</AppShellChatContentBody>;
```
