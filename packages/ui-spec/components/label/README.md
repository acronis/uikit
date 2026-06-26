# Label

A caption for a form control — small, medium-weight text tied to an input.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `Label`. No `--ui-label-*` tier; the text
> inherits `text-foreground`. Reconcile with `/figma-component Label <url>
--update` once a mockup lands.

## When to use

- Captioning any form control (input, select, checkbox, switch, …).

## When not to use

- For helper or error text below a field — use the field's description/error
  slot, not a Label.
- For non-interactive headings — use a heading element.

## Example

```tsx
import { Label, Input } from '@acronis-platform/ui-react';

<div className="flex flex-col gap-2">
  <Label htmlFor="email">Email address</Label>
  <Input id="email" placeholder="name@acronis.com" />
</div>;
```
