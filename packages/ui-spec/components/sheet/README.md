# Sheet

A modal side panel anchored to a screen edge — for showing or acting on detailed
information without leaving the page.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `Sheet` (the same Base UI Dialog primitive the
> `Dialog` component uses, edge-anchored). Themes on the shared semantic tokens
> like the Dialog family — no `--ui-sheet-*` tier yet. Reconcile with
> `/figma-component Sheet <url> --update` (Cyber-Compliance node 3442-31542).

## `Details` is an alias

The Vue UI kit called this side panel **`Details`**. For a 1:1 migration the full
part family is re-exported under `Details*` (`Details`, `DetailsContent`,
`DetailsHeader`, `DetailsTitle`, `DetailsBody`, `DetailsFooter`, …). New code
should prefer `Sheet`.

## When to use

- Inspecting or editing the details of a selected item (a row, a workload) beside
  its list.
- A focused, dismissible task that shouldn't navigate away from the page.

## When not to use

- A centered confirmation or short form — use `Dialog`.
- Persistent, non-modal page chrome — use a sidebar (`SidebarSecondary`), not a
  modal sheet.

## Parts

| Part               | Element | Purpose                                     |
| ------------------ | ------- | ------------------------------------------- |
| `Sheet`            | —       | Root; owns open state (`Details`).          |
| `SheetTrigger`     | button  | Opens the sheet (polymorphic via `render`). |
| `SheetContent`     | div     | The portaled panel; `side` picks the edge.  |
| `SheetHeader`      | div     | Title + close bar.                          |
| `SheetTitle`       | h2      | Accessible name.                            |
| `SheetCloseButton` | button  | Dismiss (×) button.                         |
| `SheetBody`        | div     | Scrollable content region.                  |
| `SheetDescription` | p       | Supporting text.                            |
| `SheetFooter`      | div     | Right-aligned action bar.                   |
| `SheetClose`       | button  | Any element that dismisses (polymorphic).   |

## Example

```tsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetCloseButton,
  SheetBody,
  SheetDescription,
  SheetFooter,
} from '@acronis-platform/ui-react';

<Sheet>
  <SheetTrigger render={<Button variant="secondary">Open details</Button>} />
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Workload details</SheetTitle>
      <SheetCloseButton />
    </SheetHeader>
    <SheetBody>
      <SheetDescription>Inspect the selected workload.</SheetDescription>
    </SheetBody>
    <SheetFooter>
      <Button>Edit</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>;
```
