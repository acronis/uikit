# Separator

A thin rule that divides content, horizontally or vertically.

> Ported from the legacy `@acronis-platform/shadcn-uikit` `Separator`; matched
> to Figma's `DividerHorizontal` component set (node 788:15147). Uses the
> shared `--ui-border-on-surface-divider` token directly (no `--ui-separator-*`
> tier).

## When to use

- To separate groups of content or controls (sections, toolbar items, menu groups).

## When not to use

- As spacing alone — use margins/padding.
- Inside a menu — group items into `DropdownMenuGroup`s instead; non-first
  groups render a top-border separator automatically.

## Example

```tsx
import { Separator } from '@acronis-platform/ui-react';

<Separator className="my-4" />

<div className="flex h-5 items-center gap-4">
  <span>Backup</span>
  <Separator orientation="vertical" />
  <span>Recovery</span>
</div>

{/* size (S1/S2/S3, Figma default S1) applies built-in surrounding spacing */}
<Separator size="S2" />
```
