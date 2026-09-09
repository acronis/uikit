---
'@acronis-platform/ui-react': minor
---

feat(dropdown-menu): default to `modal={false}` and drop `modal` from the public props

`DropdownMenu` rendered Base UI's `Menu.Root` with no `modal` override, so it
inherited the primitive's `modal={true}` default: opening the menu locked
document scroll and blocked pointer interaction with everything outside the
popup. It now pins `modal={false}`, the correct default for a menu-like overlay
— non-blocking and light-dismiss, so the page keeps scrolling and content behind
the menu stays interactive.

Two things change, not one:

1. **Runtime behavior.** The scroll-lock and the outside-pointer block are gone.
   Any consumer relying on them will see the difference at runtime.
2. **Public type.** `modal` is removed from `DropdownMenuProps`
   (`Omit<MenuPrimitive.Root.Props, 'modal'>`), so passing it explicitly is now
   a compile-time error.

**Why `minor` and not `patch` or `major`.** Read strictly, `context/releasing.md`
puts both "changed defaults" and "removed exports" in the major bucket, and this
change does both. But `modal` was never part of the surface we actually
published: it is absent from the component's `api.yaml`, has no story, and is
not mentioned on the docs page. Forcing a major version bump for surface that
was never documented is disproportionate. Equally, `patch` understates it —
there is a real behavior change and a real public-type narrowing. `minor` is the
deliberate middle call.
