---
'@acronis-platform/ui-react': minor
---

Add `DropdownMenu` (initial version ported from ui-legacy). A menu of actions on the Base UI Menu primitive, composed from `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`/`DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, and nested `DropdownMenuSub`/`DropdownMenuSubTrigger`/`DropdownMenuSubContent`. Keyboard nav, typeahead, focus management, and dismissal come from Base UI; `DropdownMenuContent` accepts `side`/`align`/`sideOffset` and `portalContainer`. Themed from the shared semantic tokens (surface/highlight/separator/shortcut); enter/exit animations use `tw-animate-css`. Design-pending until a `--ui-menu-*` tier exists.
