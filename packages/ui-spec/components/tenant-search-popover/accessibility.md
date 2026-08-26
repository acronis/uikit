# TenantSearchPopover — Accessibility

## Roles & structure

- The panel `root` is the popover popup — `role="dialog"`, with the `trigger`
  associated via `aria-haspopup` / `aria-expanded` / `aria-controls` (managed by the
  popover primitive). Non-modal: focus moves in on open, background content stays
  reachable.
- The `search` input has no visible label, so it takes its accessible name from
  `search-label` ("Search tenants" by default) — localize it alongside
  `search-placeholder`.
- **Two trees, not one.** Each `section` holds its own `role="tree"`, named by
  `aria-labelledby` pointing at that section's `section-label` ("Recent", "Browse").
  They are independent hierarchies, so merging them under a single tree would imply a
  relationship that doesn't exist. Keyboard roving still walks both in visual order.
- Every row is `role="treeitem"` with `aria-level` reflecting its 1-based depth. Leaf
  rows carry `aria-selected`; rows with children carry `aria-expanded`.
- An expanded row's children live in a sibling `role="group"` wired to the row with
  `aria-owns`. The row is a `<button>`, so the group cannot be its DOM descendant —
  `aria-owns` restores the parent/child relationship for assistive technology.
- Rows are reached by a **roving tabindex**: exactly one row is tabbable at a time. If
  the remembered row is filtered or collapsed away, the first visible row becomes the
  tab stop.
- The `status` block is informational content inside the dialog. The `retry` action is
  a real `<button>` (rendered through `Link`), so it is a normal tab stop with a focus
  ring.

## Why every row has an explicit `aria-label`

Rows are named with `aria-label={label}` rather than from their content. An expanded
row `aria-owns` its child `group`; with name-from-content, that owned subtree would be
concatenated into the parent's accessible name, so "Northwind Traders" would announce
as "Northwind Traders EMEA APAC …". The explicit label pins each row's name to its own
text. Consequence: any additional visible text placed in a row would not be announced
unless it is folded into `label`.

## Keyboard

| Key                   | Where                 | Action                                                                            |
| --------------------- | --------------------- | --------------------------------------------------------------------------------- |
| Enter / Space         | `trigger`             | Opens the panel                                                                   |
| Escape                | anywhere in the panel | Closes the panel, returns focus to the `trigger`                                  |
| Arrow Down            | `search`              | Moves focus into the first visible row                                            |
| Arrow Down / Arrow Up | any row               | Moves to the next / previous visible row, across both trees; stops at the ends    |
| Home / End            | any row               | Moves to the first / last visible row                                             |
| Arrow Right (LTR)     | collapsed `expander`  | Expands the node                                                                  |
| Arrow Right (LTR)     | expanded `expander`   | Moves focus to its first child row                                                |
| Arrow Right (LTR)     | leaf `item`           | No-op                                                                             |
| Arrow Left (LTR)      | expanded `expander`   | Collapses the node                                                                |
| Arrow Left (LTR)      | collapsed row / leaf  | Moves focus to the parent row, if any                                             |
| Enter / Space         | leaf `item`           | Selects it — emits `value-change`                                                 |
| Enter / Space         | `expander`            | Toggles the subtree; never selects                                                |
| Tab                   | anywhere in the panel | Moves through `search` → the single tabbable row → `retry`, then out of the panel |

**RTL:** the horizontal pair swaps. Under `dir="rtl"` (read from the computed
direction of the list container, so an ancestor `dir` is honored), **Arrow Left**
expands / descends and **Arrow Right** collapses / ascends. The panel's own side
placement flips too, since the popover positioner resolves logical sides.

## Screen reader

- Opening announces the dialog. Moving into the list announces each row's tree
  position — its label, level, expanded state, and selected state.
- Typing in `search` changes which rows exist; the row count announced on the next
  arrow press reflects the filtered set.
- When the query matches nothing, the tree is replaced by the empty `status` text, so
  the user is told there is nothing rather than landing in an empty tree.

## Known limitations

- **The expand chevron does not visually flip under `dir="rtl"`.** It is inherited
  as-is from `InputSelect`'s expander view
  (`packages/ui-react/src/components/ui/input-select/input-select-list.tsx`) and left
  consistent with it rather than patched in this component alone. The keyboard
  direction _does_ mirror correctly, so the arrow that expands a node is the one the
  RTL user expects — only the glyph points the wrong way. Fixing it belongs in the
  shared expander.
- **Nodes with children are not selectable.** There is no way to both expand a tenant
  and choose it; assistive-technology users get `aria-expanded` on those rows and no
  `aria-selected`, which is an accurate description of the current behavior but does
  limit what the picker can express.
- The `status` block is not a live region. A consumer that flips `status`
  asynchronously while the panel is open should announce the change themselves if the
  transition needs to be heard.

## Contrast

Row label, tenant icon, check indicator, section heading, status text and the retry
link all resolve to `--ui-input-select-dropdown-*` / `--ui-link-*` / `--ui-avatar-*`
tokens over `--ui-popover-container-color`, authored to meet WCAG AA in light and
dark. Selection is conveyed by the check `indicator` as well as the row tint, not by
color alone.

**WCAG:** 1.3.1, 1.4.3 / 1.4.11, 2.1.1, 2.4.3, 2.4.7, 4.1.2.
