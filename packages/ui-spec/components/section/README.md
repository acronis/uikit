# Section

A titled content block — a `<section>` with an optional header (title +
description) and a content area.

> Design-pending v1, ported 1:1 from the legacy shadcn-uikit `section`.

## When to use

- Grouping a page area under a heading + description (settings groups, dashboard
  regions).

## When not to use

- Pure spacing/layout with no heading — use `Stack` / `Grid`.

## Parts

| Export               | Purpose                         |
| -------------------- | ------------------------------- |
| `Section`            | The `<section>` block.          |
| `SectionHeader`      | Groups the title + description. |
| `SectionTitle`       | The `<h2>` heading.             |
| `SectionDescription` | Muted supporting text.          |
| `SectionContent`     | The body.                       |

## Example

```tsx
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
} from '@acronis-platform/ui-react';

<Section>
  <SectionHeader>
    <SectionTitle>Backup plans</SectionTitle>
    <SectionDescription>
      Manage how your workloads are backed up.
    </SectionDescription>
  </SectionHeader>
  <SectionContent>{children}</SectionContent>
</Section>;
```
