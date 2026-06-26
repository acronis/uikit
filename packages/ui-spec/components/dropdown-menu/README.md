# DropdownMenu

A menu of actions anchored to a trigger, opened on demand. Composable from a
rich set of parts; built on the Base UI Menu primitive.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `DropdownMenu`. No `--ui-menu-*` token tier
> yet, so it themes from the shared semantic tokens (surface `bg-background`,
> highlighted item `bg-accent`, separator `bg-border`, shortcut
> `text-muted-foreground`); enter/exit animations use `tw-animate-css`. Reconcile
> with `/figma-component DropdownMenu <url> --update` once a mockup lands.

## When to use

- A compact list of **actions** triggered from a button (row actions, account
  menu, "more" overflow).
- Toggle/choice options (checkbox / radio items) grouped under a trigger.

## When not to use

- For selecting a value into a field — use `InputSelect` / `Select`.
- For secondary content or a form — use a `Popover`.
- For primary page navigation — use a nav, not a menu.

## Parts

| Part                                                                    | Element                   | Purpose                           |
| ----------------------------------------------------------------------- | ------------------------- | --------------------------------- |
| `DropdownMenu`                                                          | — (Root)                  | Owns the open state.              |
| `DropdownMenuTrigger`                                                   | `button`                  | Opens the menu.                   |
| `DropdownMenuContent`                                                   | `div[role=menu]`          | The portaled, positioned popup.   |
| `DropdownMenuItem`                                                      | `div[role=menuitem]`      | An action row (`inset` to align). |
| `DropdownMenuCheckboxItem`                                              | `[role=menuitemcheckbox]` | A toggle row with a check.        |
| `DropdownMenuRadioGroup` / `DropdownMenuRadioItem`                      | `[role=menuitemradio]`    | Single-choice rows.               |
| `DropdownMenuLabel`                                                     | `div`                     | A section heading.                |
| `DropdownMenuSeparator`                                                 | `div[role=separator]`     | A divider.                        |
| `DropdownMenuShortcut`                                                  | `span`                    | Right-aligned shortcut hint.      |
| `DropdownMenuSub` / `DropdownMenuSubTrigger` / `DropdownMenuSubContent` | —                         | A nested submenu.                 |
| `DropdownMenuGroup` / `DropdownMenuPortal`                              | —                         | Grouping / portal wrappers.       |

## Example

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  Button,
} from '@acronis-platform/ui-react';

<DropdownMenu>
  <DropdownMenuTrigger
    render={<Button variant="secondary">Open menu</Button>}
  />
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>My account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```
