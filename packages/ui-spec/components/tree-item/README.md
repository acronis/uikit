# TreeItem

One flat row of a tree or nested-list UI: an optional expand chevron, an optional
checkbox, an optional leading icon, the row title, and an optional trailing
extras slot. It is deliberately **one row** — it renders no nested list, owns no
expand state, and selects nothing. You compose the rows, indent them, hold the
open/selected state, and supply the ARIA tree semantics.

## When to use

- A file tree, a workload/resource hierarchy, a nested navigation panel — one
  `TreeItem` per row.
- A multi-select hierarchy: turn on `hasCheckbox` and drive the box through
  `checkboxProps`.

## When not to use

- For a flat, non-hierarchical secondary nav — use
  [`SidebarSecondary`](../sidebar-secondary/README.md).
- For a path back to the current location — use
  [`Breadcrumb`](../breadcrumb/README.md).
- For collapsible **content** panels rather than a hierarchy of rows — use
  `Accordion` / `AccordionContainer`.
- As the whole tree. There is no `Tree` container component today; the row is the
  primitive and the tree is assembled in the application.

## Usage

```tsx
import { TreeItem } from '@acronis-platform/ui-react';

const [open, setOpen] = React.useState(true);

<ul role="tree" aria-label="Workloads">
  <TreeItem
    render={<li role="treeitem" aria-expanded={open} aria-level={1} />}
    expanded={open}
    hasIcon
    icon={<FolderIcon size={16} />}
    title="All workloads"
    onClick={() => setOpen((v) => !v)}
  >
    <Tag variant="info">24</Tag>
  </TreeItem>

  {open && (
    <ul role="group" className="ps-4">
      <TreeItem
        render={<li role="treeitem" aria-level={2} aria-selected />}
        isExpandable={false}
        hasIcon
        selected
        title="Cloud applications"
      />
      <TreeItem
        render={<li role="treeitem" aria-level={2} />}
        isExpandable={false}
        hasIcon
        title="Unmanaged workloads"
      />
    </ul>
  )}
</ul>;
```

Three things the row hands back to you on purpose:

- **`isExpandable` and `expanded` are artwork, not behavior.** The first draws
  the chevron, the second rotates it a quarter turn to point down. Neither
  expands anything, and there is no change event: the Figma node's expandable
  slot has no interaction either. Pass `expanded` from the same boolean that
  feeds your `aria-expanded`, so the affordance and the announced state agree.
- **`selected` is a look you drive.** The row never selects itself on click; it
  only reflects the flag. Figma's `state=active` swatch paints the same fill,
  which is why `active` is not wired to CSS `:active`.
- **The ARIA tree is yours.** No `role="treeitem"`, no tab stop by default — see
  [`accessibility.md`](./accessibility.md) for why a role on an orphan row would
  make the tree invalid rather than accessible.

## Parts

| Part       | Element | Notes                                                                                             |
| ---------- | ------- | ------------------------------------------------------------------------------------------------- |
| row (root) | `div`   | Polymorphic via `render`; carries the hover / `selected` fill and focus ring                      |
| `expander` | `span`  | Optional (`isExpandable`, default on); `aria-hidden` chevron, flips in RTL, rotates on `expanded` |
| `checkbox` | `span`  | Optional (`hasCheckbox`); the shared `Checkbox`, `aria-label` defaults to title                   |
| `icon`     | `span`  | Optional (`hasIcon`); falls back to the design's square-dashed placeholder                        |
| `title`    | `span`  | The row label; takes the remaining width and truncates                                            |
| `extras`   | `span`  | Optional (`hasExtras`, default on); the trailing `children` slot                                  |

## Design status

**No dedicated token tier.** `tokens-pd` ships no `Tree` tier: the Figma node's
variables still sit in the pre-next-gen `componentLegacy/tree/*` and
`componentLegacy/sidebar/*` namespaces, which the `brand.components` migration
has not reached. Every colour the row paints therefore comes from the semantic
tier, and the layout numbers (8px gap/padding, 128px minimum row width, 4px slot
inset, 16px minimum extras well) are plain utilities matching the design's pixel
values — see [`tokens.yaml`](./tokens.yaml) for the full reasoning. Re-point both
when a `--ui-tree-item-*` tier lands.

**Deviation from the Figma frame — the extras well.** Figma measures the trailing
slot as `min-w-[16px] w-[24px]`; the 24px is the resolved width of its
placeholder content in a hug-content frame, not a constraint. The implementation
keeps the 16px minimum and lets the slot grow, because a hard 24px would clip the
action buttons and count badges the slot exists to hold.
