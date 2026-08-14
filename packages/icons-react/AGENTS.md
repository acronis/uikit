# AGENTS.md — `packages/icons-react`

`@acronis-platform/icons-react` — React icon components **generated from**
[`@acronis-platform/design-assets`](../design-assets). Published.

Repo-wide rules live in the repo root's `./context/`. This file documents
only what's specific to this workspace.

## Icons are generated, not authored

`scripts/generate-icons.ts` reads design-assets' `packs/icons.json` —
per-pack `assetsGroups`, each asset pointing at its flat 24px master SVG via
`values.24.$file` — and emits per-icon React components under
`src/packs/<pack>/` — **gitignored**, regenerated on
`build` / `typecheck` / `test` / `storybook`. Don't hand-edit anything under
`src/packs/`; change the icon in design-assets (re-run its Figma sync) or the
generator. `scripts/generate-legacy-map.ts` also reads design-assets
(`metadata.legacyNames`) to emit the committed `legacy-map`.

The hand-written code is small:

- `src/lib/svg-icon.tsx` — the shared `<SvgIcon>` renderer: picks the artwork
  for the requested `size` from a per-size `sizes` map, sets width/height, lifts
  a uniform stroke width to the root, and handles a11y (`title` → `role="img"`).
- `scripts/generate-icons.ts` — the generator.
- `scripts/packs.ts` — the **single source of truth** for which packs are built
  (the four subpaths). Add a pack here (and a matching `exports` subpath + Vite
  entry). Sizes/strokes/colors are NOT configured here — they come from
  design-assets.

## How the design-assets model maps to components

- **design-assets is the source of truth; this package mirrors it.** Anything
  not expressible from design-assets (e.g. an arbitrary render size) is out; a
  discrepancy is fixed in design-assets, never compensated here.
- The generator reuses the canonical resolver + executor from
  `@acronis-platform/style-dictionary/assets` (the same code the token/asset
  build uses — never a reimplementation): `expandStyles` turns the `icons`
  pack's four `assetsGroups` into flat styles (one per pack here, 1:1 by name),
  `resolveAsset` resolves each asset's per-size variants (`values.<size>` merged
  from pack ⊕ group `$values` ⊕ asset), and `executeSvg` applies that size's
  ordered rules (`scale`/`stroke`/`color`) to the leaf SVG.
- **Size axis = whatever design-assets declares** (today `16` and `24`, `24`
  canonical); `size` is typed `16 | 24`. There is no 32. Stroke widths are the
  executor's output of the design `stroke-*` rules — not a constant. (The
  stroke-mono `16` variant applies `scale-16` + `stroke-1-6`: `scale-16`
  compensates the 24→16 downscale so the 1.6px design stroke renders as 2.4 user
  units, matching Figma's `sm/stroke` = 1.6px and stroke-multi.)
- **Per-size artwork.** The generator emits one entry in each component's
  `SIZES` map per design-defined variant; identical geometry is deduped into a
  shared constant, so today (single 24 master + rule-derived 16) each icon has
  one geometry + per-size stroke width. If design-assets ever gives a size its
  own `$file`/`$from` (distinct artwork), that size renders its own geometry —
  `<SvgIcon>` selects by `size`, never the canonical scaled.
- Icon keys: design-assets keys each icon in **PascalCase** (`ChevronDown`); the
  generator kebab-cases it (`chevron-down`) for the registry key / file name /
  id slug, so the public names are exactly what the library has always exposed.
- **mono** packs (a group whose rules include `current-color`) → the executor
  recolors to `currentColor`, which the generator lifts to the root `<svg>`.
  **multi** packs → authored colors (incl. gradients) are kept verbatim.

## Public API

- Per-pack subpath exports: `@acronis-platform/icons-react/{stroke,solid}-{mono,multi}`.
- Per-icon **named exports** (`BanIcon`, `ChevronDownIcon`) — tree-shakeable.
  Naming is `PascalCase(asset) + "Icon"`; numeric-leading asset names take an
  `Icon` prefix instead (`365-sync` → `Icon365Sync`) so the identifier stays
  valid. See `src/lib/naming.ts` (a build-time helper, unit-tested, not shipped).
- A pack `icons` registry + `IconName` type for dynamic lookup (importing
  `icons` pulls the whole pack; prefer named imports for bundle size).
- Root `.` export ships the `SvgIcon` base + `IconProps` for advanced use.

## Packs

All four design-assets icon `assetsGroups` are generated (see `scripts/packs.ts`):
`stroke-mono` (392), `solid-mono` (69), `stroke-multi` (15), `solid-multi` (1).
Counts grow as the design-assets set does — no code change needed.
`@acronis-platform/ui-react` depends on this package so components/stories can
compose icons.

design-assets is a curated, validated source (its `validate` gate runs in the
sync), so generated names are stable; a rename or removal
there changes the public API and must ship a matching (major) Changeset. Fix
the icon in design-assets and re-sync rather than hand-editing.

## When you change anything

1. Tests live in `src/__tests__/` (Vitest + RTL), stories in
   `src/__stories__/` (both import from the generated `src/packs/*`).
2. Add a Changeset: `pnpm changeset` (from repo root).

See `../../context/releasing.md` for the Changesets / publish flow.
