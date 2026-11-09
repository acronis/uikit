# DropdownMenu

A menu of actions anchored to a trigger, opened on demand. Composable from
a set of parts — trigger, content, group (section), item, shortcut, submenu —
built on the Base UI Menu primitive. Themed by the `--ui-button-menu-dropdown-*`
token tier from `@acronis-platform/tokens-pd`.

## When to use

- A compact list of **actions** triggered from a `ButtonMenu` (row actions,
  account menu, "more" overflow).
- The menu is non-modal by default, so the rest of the page remains scrollable
  and interactive. Set `modal` to `true` when the page should be blocked while
  the menu is open.

## When not to use

- For selecting a value into a field — use `InputSelect` / `Select`.
- For secondary content or a form — use a `Popover`.
- For primary page navigation — use a nav, not a menu.

## Parts

| Part                                                                    | Element              | Purpose                                            |
| ----------------------------------------------------------------------- | -------------------- | -------------------------------------------------- |
| `DropdownMenu`                                                          | — (Root)             | Owns the open state.                               |
| `DropdownMenuTrigger`                                                   | `button`             | Opens the menu (compose with `ButtonMenu`).        |
| `DropdownMenuContent`                                                   | `div[role=menu]`     | The portaled, positioned popup.                    |
| `DropdownMenuGroup`                                                     | `div`                | A section of items (auto border-top on non-first). |
| `DropdownMenuItem`                                                      | `div[role=menuitem]` | An action row (`inset` to align).                  |
| `DropdownMenuShortcut`                                                  | `span`               | Right-aligned shortcut hint.                       |
| `DropdownMenuSub` / `DropdownMenuSubTrigger` / `DropdownMenuSubContent` | —                    | A nested submenu.                                  |
| `DropdownMenuPortal`                                                    | —                    | Portal wrapper.                                    |

## Example

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  ButtonMenu,
} from '@acronis-platform/ui-react';

<DropdownMenu>
  <DropdownMenuTrigger
    render={<ButtonMenu variant="secondary">Actions</ButtonMenu>}
  />
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuItem>
        Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>;
```
