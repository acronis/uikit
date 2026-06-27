# AppShell

The full-page application scaffold: a sidebar column beside a body column of a
sticky header over the scrolling main content. A **slot-based layout** — drop
`SidebarPrimary` / `SidebarSecondary` into the sidebar, `SearchGlobal` into the
header, and your page into main.

Mapped to the App Shell Figma (node `2782-1495`).

## When to use

- The top-level frame of an authenticated app screen.

## When not to use

- A marketing / auth page — use the (future) Auth Layout.
- A sub-region of a page — use `Section` / `Stack` / `Grid`.

## Parts

| Export            | Element  | Purpose                                         |
| ----------------- | -------- | ----------------------------------------------- |
| `AppShell`        | `div`    | The full-height row.                            |
| `AppShellSidebar` | `aside`  | Left nav column (SidebarPrimary [+ Secondary]). |
| `AppShellBody`    | `div`    | The body column filling the rest.               |
| `AppShellHeader`  | `header` | Sticky top bar (global search + actions).       |
| `AppShellMain`    | `main`   | Scrolling page content.                         |
| `AppShellFooter`  | `footer` | Optional bottom bar.                            |

## Example

```tsx
import {
  AppShell, AppShellSidebar, AppShellBody, AppShellHeader, AppShellMain,
} from '@acronis-platform/ui-react';

<AppShell>
  <AppShellSidebar><SidebarPrimary … /></AppShellSidebar>
  <AppShellBody>
    <AppShellHeader><SearchGlobal … /></AppShellHeader>
    <AppShellMain>{children}</AppShellMain>
  </AppShellBody>
</AppShell>;
```

See the **App Shell** pattern for the full slot assembly.
