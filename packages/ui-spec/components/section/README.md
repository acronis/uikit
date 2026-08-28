# Section

A titled band that groups content on a page. Where `Card` owns a single surface
and `CardSection` divides a card's body, `Section` is the layer above both: it
labels a run of cards — or a table — and separates it from the next run.

## When to use

- A page that reads as **several labelled bands** ("General", "Protection",
  "Danger zone"), each holding one or more cards.
- A **row of cards** that needs a shared title and a consistent three-column
  grid (`grid3`).
- A **primary/secondary split** where a wide main area is paired with a narrow
  companion column (`column2-70-30`).
- A **full-bleed table** with a page-level title above it (`table`).

## When not to use

- Inside a card. Use `CardSection` — it is card chrome, with the smaller 14px
  header and the card's own inset rhythm.
- As a bare layout wrapper with no title. Use `Grid`; a section with
  no header adds a band with no meaning.
- As a surface. `Section` paints no background of its own; the page surface
  shows through.

## Parts

| Part             | Element   | Notes                                                                       |
| ---------------- | --------- | --------------------------------------------------------------------------- |
| `Section`        | `section` | Owns `variant` + `hasBottomBorder` and publishes the layout to its parts.   |
| `SectionHeader`  | `div`     | Optional. Switch, title, description, extras, `children`, actions, trigger. |
| `SectionContent` | `div`     | The body. Its layout comes from the root's `variant`.                       |

## Layouts

| `variant`       | Body                                                        |
| --------------- | ----------------------------------------------------------- |
| `column1`       | One full-width area (default).                              |
| `column2-70-30` | 3-column grid; children span 2, `secondaryContent` spans 1. |
| `grid3`         | 3-column grid the children flow into.                       |
| `table`         | Flush — no root padding, so rows bleed to the page edges.   |

## Examples

A row of cards under one title:

```tsx
<Section variant="grid3">
  <SectionHeader title="Recent activity" />
  <SectionContent>
    <Card>…</Card>
    <Card>…</Card>
    <Card>…</Card>
  </SectionContent>
</Section>
```

A 70/30 split:

```tsx
<Section variant="column2-70-30">
  <SectionHeader
    title="Storage"
    description="Usage across every connected location."
    hasDescription
  />
  <SectionContent secondaryContent={<QuotaCard />}>
    <LocationsCard />
  </SectionContent>
</Section>
```

A full-bleed table:

```tsx
<Section variant="table">
  <SectionHeader
    title="Workloads"
    actions={
      <ButtonIcon aria-label="More actions">
        <EllipsisIcon size={24} />
      </ButtonIcon>
    }
  />
  <SectionContent>
    <WorkloadsTable />
  </SectionContent>
</Section>
```

Collapsible — a composition with the shared disclosure primitive, not a prop:

```tsx
<Section variant="grid3">
  <AccordionContainer collapsible defaultOpen>
    <SectionHeader
      title="Protection"
      isCollapsible
      collapseLabel="Toggle protection section"
    />
    <AccordionContainer.Content>
      <SectionContent>…</SectionContent>
    </AccordionContainer.Content>
  </AccordionContainer>
</Section>
```

## Notes

- **No bottom padding without `hasBottomBorder`.** Stacked unbordered sections
  would otherwise double their vertical gap, since the next one already opens
  with its own top inset. Set `hasBottomBorder` on every section but the last
  when you want visible separators.
- **The `table` variant is flush on purpose.** It has no padding on any side so
  its rows reach the page edges; only the header re-applies the horizontal
  inset. `hasBottomBorder` adds the divider without reintroducing padding.
- **`variant` is set once, on the root.** The header and content parts read it
  from context, so there is nothing to keep in sync.
- **Collapsing lives in `AccordionContainer`.** `isCollapsible` only renders the
  trigger; the open/closed state, ARIA wiring, and height animation belong to
  the container — the same split `Card` uses.
- **Override `collapseLabel` / `switchLabel`** whenever a page stacks several
  collapsible or switchable sections; the defaults are generic by necessity.
