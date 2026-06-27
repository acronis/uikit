# Accordion

A vertical set of disclosure sections — each a header trigger over a
height-animating panel. Single open at a time by default; `multiple` allows
several. Built on Base UI's Accordion.

> Design-pending v1, ported from the legacy shadcn-uikit `accordion`.

## When to use

- Condense a long page into expandable sections (e.g. an FAQ, grouped settings).

## When not to use

- A single optional section — use `Collapsible`.
- Navigating between views — use `Tabs`.

## Parts

| Export             | Purpose                                             |
| ------------------ | --------------------------------------------------- |
| `Accordion`        | Root — tracks open items; `multiple` to allow many. |
| `AccordionItem`    | One section (needs a `value`).                      |
| `AccordionTrigger` | The header button (title + chevron).                |
| `AccordionContent` | The height-animating panel.                         |

## Example

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@acronis-platform/ui-react';

<Accordion defaultValue={['a']}>
  <AccordionItem value="a">
    <AccordionTrigger>What is included?</AccordionTrigger>
    <AccordionContent>Backup, recovery, and anti-malware.</AccordionContent>
  </AccordionItem>
</Accordion>;
```
