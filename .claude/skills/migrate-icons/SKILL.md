---
name: migrate-icons
description: Migrate icon imports/usages from @acronis-platform/shadcn-uikit (legacy Acronis names like EditIcon, CustomerIcon, DangerIcon) to @acronis-platform/icons-react (e.g. PencilIcon, BriefcaseIcon). Resolves names authoritatively from the map SHIPPED with icons-react (@acronis-platform/icons-react/legacy-map) — no guessing, no monorepo checkout. Rewrites imports + JSX, dedupes collisions, and holds colored status icons that have no monochrome equivalent. Reusable in any MFE. Use when asked to migrate, swap, or update Acronis icons to icons-react.
---

# Migrate shadcn-uikit icons → icons-react (common, reusable)

Legacy `@acronis-platform/shadcn-uikit` exports icons under Acronis names
(`EditIcon`, `CustomerIcon`, `SearchIcon`). `@acronis-platform/icons-react` uses
descriptive names (`PencilIcon`, `BriefcaseIcon`, `MagnifierIcon`) on a different
art grid, so names must be **resolved authoritatively, not guessed** (no
SVG-path matching — the grids differ).

This is the **common solution for every MFE**: the authoritative
`legacy → icons-react` map is **generated in the uikit monorepo and shipped with
`@acronis-platform/icons-react`** (`@acronis-platform/icons-react/legacy-map`,
file `legacy-icon-map.json`). Any app resolves from its installed `icons-react` —
no monorepo checkout, no per-MFE mapping table. To use it in a new MFE, copy this
`migrate-icons/` skill folder into that repo's `.claude/skills/`.

## The shipped map

`@acronis-platform/icons-react/legacy-map` → `legacy-icon-map.json`:

```jsonc
{
  "meta": { "defaultVariant": "stroke-mono", "variants": [...], "counts": {...} },
  "icons":   { "EditIcon": { "asset": "Pencil", "source": "edit",
               "variants": { "stroke-mono": "PencilIcon", "solid-mono": null, ... } } },
  "colored": { "CriticalIcon": { "asset": "...", "multi": { "stroke-multi": "CircleWarningOrangeIcon" },
               "note": "colored glyph — no monochrome equivalent ..." } },
  "unresolved": { "BoxIcon": "NOT_IN_ANY_PACK(BoxLogoIcon)" }
}
```

- **`icons`** — safe 1:1 maps. `variants[<pack>]` is the icons-react name, or
  `null` if that icon isn't in that pack.
- **`colored`** — icons that exist only in a **multicolor** pack (baked-in
  red/green/orange status or brand color). No monochrome equivalent — a human
  must decide (see triage). Never silently flatten status color.
- **`unresolved`** — logos/illustrations or assets genuinely absent from the icon
  packs.

Maintainers regenerate it with
`pnpm --filter @acronis-platform/icons-react generate:legacy-map` (also runs as
part of `generate`/`build`); it's deterministic and committed.

## Procedure

1. **Confirm inputs**: source module (`@acronis-platform/shadcn-uikit`), target
   pack (`stroke-mono` unless told otherwise), and that `@acronis-platform/icons-react`
   is installed (with the `legacy-map` export; if the app is on an older version,
   pass `MAP=<path to legacy-icon-map.json>` from a monorepo checkout).
2. **Resolve** — build the app-specific map for the icons it actually imports:
   ```bash
   TARGET=stroke-mono node .claude/skills/migrate-icons/scripts/resolve-map.mjs
   ```
   It inventories `src` (or takes a newline file of names), writes
   `.icon-migration/iconmap.json`, and prints three triage lists.
3. **Triage the leftovers** (do not auto-apply these):
   - **COLORED status/brand icons** (`DangerIcon`, `CriticalIcon`, `SuccessIcon`,
     `UnknownIcon`, …): either keep them on the multicolor pack
     (`@acronis-platform/icons-react/stroke-multi`), or map to a monochrome base
     (`CircleTimesIcon`, `TriangleWarningIcon`, `CircleCheckIcon`, …) **with a
     color className**. Add the chosen entries to `.icon-migration/iconmap.json`
     by hand. Holding them (leaving them on shadcn-uikit) is valid — flag for a
     color-token decision.
   - **Present, but not in TARGET**: the icon exists in another variant. Switch
     `TARGET`, import it per-icon from the listed pack, or pick a TARGET-pack
     alternative.
   - **UNRESOLVED**: hold on the legacy package, or add the asset upstream
     (`icons-svg-next` → re-sync `icons-react`).
4. **Low-confidence 1:1 maps** — a few authoritative maps still warrant a visual
   check (e.g. no plain `Shield` in stroke-mono → `ShieldCheckIcon`;
   `FilterIcon → NodeSlidersIcon`). List them in your summary.
5. **Apply**:
   ```bash
   MAP=.icon-migration/iconmap.json \
   FROM=@acronis-platform/shadcn-uikit \
   TO=@acronis-platform/icons-react/stroke-mono \
     node .claude/skills/migrate-icons/scripts/apply-icons.mjs
   ```
   It rewrites each file's legacy import (splitting icons out from components that
   stay), renames JSX occurrences, routes the renamed icons to the target pack,
   dedupes collisions, and leaves held/unmapped names on the legacy module.
6. **Verify**: `npx tsc -b --noEmit` (icons-react `IconProps` supports
   `size`/`className`/`style`, so `size={16}` type-checks) and the app's tests.
   Re-grep `@acronis-platform/shadcn-uikit` to confirm only intended holds remain.
7. **Commit** as its own step; note held/colored icons and any intentional
   collisions (e.g. `Customer`/`Customers` → `Briefcase`) in the message.

## Scripts (plain Node ESM, no deps, portable)

- `scripts/resolve-map.mjs` — inventory + resolve against the shipped map.
  `TARGET`, `FROM`, `MAP` via env. Writes `.icon-migration/iconmap.json`.
- `scripts/apply-icons.mjs` — apply a reviewed map across `src`. `MAP`, `FROM`,
  `TO` via env.

Both are dependency-free so they run in any MFE. Always review the generated map
before applying, and run on a clean git tree.
