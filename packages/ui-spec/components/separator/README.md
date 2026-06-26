# Separator

A thin rule that divides content, horizontally or vertically.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `Separator`; uses the shared `bg-border`
> divider token (no `--ui-separator-*` tier). Reconcile with
> `/figma-component Separator <url> --update` once a mockup lands.

## When to use

- To separate groups of content or controls (sections, toolbar items, menu groups).

## When not to use

- As spacing alone — use margins/padding.
- Inside a menu — use `DropdownMenuSeparator`.

## Example

```tsx
import { Separator } from '@acronis-platform/ui-react';

<Separator className="my-4" />

<div className="flex h-5 items-center gap-4">
  <span>Backup</span>
  <Separator orientation="vertical" />
  <span>Recovery</span>
</div>
```
