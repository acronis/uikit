# Section

A titled band that groups `Card`s (or a table) on a page. Composable from
parts (`Section`, `SectionHeader`, `SectionContent`); the root's `variant`
threads through context so the header and content adapt their
layout/padding without repeating it.

> Figma node: `8262:6179`. The design's `isCollapsable` variant
> (expanded/collapsed) is implemented by composing `Section` with
> `AccordionContainer` — see "Collapsible" below.

## When to use

- Grouping a set of `Card`s (or a `Table`) under a shared title/description
  on a dashboard or settings page.
- A header that needs any combination of: a toggle switch, an icon, a title
  with inline extras (tags/badges), and end-aligned actions (e.g. a menu
  button).
- A one-, two-, or three-column arrangement of content — `column1` for a
  single stack, `column2-70-30`/`grid3` for a grid — or a flush `table`
  variant for content (typically a `Table`) that should bleed edge-to-edge.

## When not to use

- For a bordered, self-contained surface with its own background — use
  **`Card`** instead. `Section` draws no surface of its own; it groups
  content on the surrounding page.
- As a generic layout `<div>` with no title — use `Stack` / `Grid`.

## Parts

| Part             | Element (default) | Purpose                                                                                     |
| ---------------- | ----------------- | ------------------------------------------------------------------------------------------- |
| `Section`        | `div`             | The band's root; `variant` selects inset/gap vs. flush, `hasBottomBorder` adds the divider. |
| `SectionHeader`  | `div`             | Title/description + switch, icon, extras, actions.                                          |
| `SectionContent` | `div`             | Body region; layout follows the ancestor `Section`'s `variant`.                             |

`Section` and `SectionContent` accept a `render` prop for polymorphic composition.

## Example

```tsx
import {
  Card,
  Section,
  SectionContent,
  SectionHeader,
} from '@acronis-platform/ui-react';

<Section className="w-full">
  <SectionHeader
    title="Backup plans"
    description="Manage how your workloads are backed up."
    hasDescription
  />
  <SectionContent>
    <Card>…</Card>
  </SectionContent>
</Section>;
```

## Variants

```tsx
// column2-70-30: a 3-column grid whose first child spans two columns.
<Section variant="column2-70-30">
  <SectionHeader title="Overview" />
  <SectionContent>
    <Card>…</Card>
    <Card>…</Card>
  </SectionContent>
</Section>

// grid3: a plain 3-column grid.
<Section variant="grid3">
  <SectionHeader title="Widgets" />
  <SectionContent>
    <Card>…</Card>
    <Card>…</Card>
    <Card>…</Card>
  </SectionContent>
</Section>

// table: the root sits flush so rows bleed edge-to-edge; the header
// re-applies its own inset.
<Section variant="table">
  <SectionHeader title="Workloads" />
  <SectionContent>
    <Table>…</Table>
  </SectionContent>
</Section>
```

## Header features

```tsx
<SectionHeader
  title="Backup policy"
  isSwitchable
  defaultSwitchChecked
  icon={<ShieldIcon />}
  extras={<Badge>Beta</Badge>}
  actions={
    <ButtonIcon aria-label="More actions">
      <EllipsisIcon size={24} />
    </ButtonIcon>
  }
/>
```

- `isSwitchable` renders a real `Switch`; control it with `switchChecked` /
  `defaultSwitchChecked` / `onSwitchCheckedChange`.
- `icon` renders alongside the switch when both are present — additive, with
  no Figma slot counterpart.
- `hasBottomBorder` (on `Section`, not `SectionHeader`) adds a divider below
  the section, plus matching bottom padding on the padded variants.

## Collapsible

Compose `Section` with `AccordionContainer` (the shared disclosure
primitive): wrap `SectionContent` in `AccordionContainer.Content` and set
`SectionHeader`'s `isCollapsible` to render the trigger.

```tsx
import {
  AccordionContainer,
  Section,
  SectionContent,
  SectionHeader,
} from '@acronis-platform/ui-react';

<Section className="w-[420px]">
  <AccordionContainer collapsible defaultOpen>
    <SectionHeader
      title="Backup policy"
      description="Applies to 12 workloads."
      hasDescription
      isCollapsible
      collapseLabel="Toggle backup policy"
    />
    <AccordionContainer.Content>
      <SectionContent>
        All 24 workloads are protected and up to date.
      </SectionContent>
    </AccordionContainer.Content>
  </AccordionContainer>
</Section>;
```

- `isCollapsible` on `SectionHeader` only has an effect when the header
  renders inside a collapsible `AccordionContainer` — it's a no-op
  otherwise.
- The header itself (title, switch, icon, actions, …) stays visible in both
  the open and closed state; only content wrapped in
  `AccordionContainer.Content` is hidden when closed.
