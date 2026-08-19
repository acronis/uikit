# FilterChips

A wrapping row that summarises the filters currently applied to a data set: one
removable chip per filter, closed by a ghost "Reset filters" action that clears
them all at once.

It is pure layout. The only thing it owns is the two gaps the design specifies —
16px between the root's children and 8px between the items in the chip list. The
chips are `Chip`s you pass in, and the reset action is a ghost `Button`.

## When to use

- Below a filter toolbar, to show which filters are currently narrowing a table,
  list or dashboard, and to let a user drop them individually.
- Wherever a filter selection needs to stay visible after the popover or panel
  that produced it has closed.
- When you want the composition under your control — you decide what each chip's
  label says, whether it carries a leading icon, and whether a reset action is
  offered at all.

## When not to use

- **To offer the filters themselves.** This row reports a selection; it does not
  make one. Use `FilterSearchFilters` (a filter popover) or the appropriate input
  for that.
- **When you just want the row wired to a filter record.** Use
  `FilterSearchAppliedFilters`, which renders through these parts and derives the
  chips from a `filters` object, including hiding itself when the object is empty.
- **For a single chip, or for chips that select rather than remove.** Use `Chip`
  directly (`variant="selectable"` / `variant="operational"`).
- **As a general tag row.** The group is named "Applied filters" and the reset
  action is a clear-all; a row of non-filter tokens should compose `Chip` itself.

## Examples

### Applied filters with a clear-all

```tsx
import {
  Chip,
  FilterChips,
  FilterChipsList,
  FilterChipsReset,
} from '@acronis-platform/ui-react';

<FilterChips>
  <FilterChipsList>
    {applied.map((filter) => (
      <Chip
        key={filter.id}
        removeLabel={`Remove ${filter.id} filter`}
        onRemove={() => removeFilter(filter.id)}
      >
        {filter.label}
      </Chip>
    ))}
    <FilterChipsReset onClick={resetFilters} />
  </FilterChipsList>
</FilterChips>;
```

### Chips with a leading icon

```tsx
<FilterChips>
  <FilterChipsList>
    <Chip icon={<TagIcon size={16} />} removeLabel="Remove type filter">
      Type: Server
    </Chip>
    <Chip icon={<TagIcon size={16} />} removeLabel="Remove OS filter">
      OS: Linux
    </Chip>
    <FilterChipsReset />
  </FilterChipsList>
</FilterChips>
```

### No reset action

Omit `FilterChipsReset` when the surrounding UI already offers a way to clear the
filters.

```tsx
<FilterChips ariaLabel="Applied workload filters">
  <FilterChipsList>
    <Chip removeLabel="Remove type filter">Type: Server</Chip>
    <Chip removeLabel="Remove OS filter">OS: Linux</Chip>
  </FilterChipsList>
</FilterChips>
```

### A localized reset label

Every string in the row is consumer-supplied. `FilterChipsReset`'s "Reset filters"
is only a default; pass your own translated label as its children, and override
the region's name with `ariaLabel`.

```tsx
<FilterChips ariaLabel={t('appliedFilters')}>
  <FilterChipsList>
    <Chip removeLabel={t('removeTypeFilter')}>{t('filterType')}</Chip>
    <FilterChipsReset>{t('resetFilters')}</FilterChipsReset>
  </FilterChipsList>
</FilterChips>
```

## Parts

| Part               | Element                   | Notes                                                                                                                                                    |
| ------------------ | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FilterChips`      | `div` (`role="group"`)    | Root row. Carries the region's accessible name (`ariaLabel`, default "Applied filters") and the 16px gap between its children. Polymorphic via `render`. |
| `FilterChipsList`  | `div`                     | The wrapping chip container — 8px gap in both axes, wrapped lines centered. Maps to the Figma `ListChips` slot.                                          |
| `FilterChipsReset` | `button` (ghost `Button`) | The clear-all action. Label is `children`, defaulting to "Reset filters". Composed as the **last child of the list**, not beside it.                     |

`Chip` is not a part of this component — the chips are your children. Use
`variant="removable"` (Chip's default) and give each one a `removeLabel` that
names the filter it drops.

## Notes

- **The reset action belongs inside the list.** The design measures 8px between
  the last chip and the button, which is the list's gap. Placing it as a sibling
  of the list would render it 16px away and wrap independently of the chips.
- **No empty state.** The row renders whatever it is given, including nothing;
  the design defines no empty appearance. Deciding not to render the row when no
  filters are applied is the consumer's call —
  `FilterSearchAppliedFilters` makes that call for you.
- **Theming.** No `--ui-filter-chips-*` tier exists and none is needed. The row
  consumes `--ui-gap-16` and `--ui-gap-8`; everything visible comes from
  `--ui-chip-*` and `--ui-button-ghost-*`.
