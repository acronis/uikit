# AGENTS.md — `packages/icons-react`

`@acronis-platform/icons-react` — React icon components **generated from**
[`@acronis-platform/design-assets`](../design-assets). Published.

Repo-wide rules live in the repo root's `./context/`. This file documents
only what's specific to this workspace.

## Icons are generated, not authored

`scripts/generate-icons.ts` reads the design-assets pack manifests + 24px
SVG masters + scaling rules and emits per-icon React components under
`src/packs/<pack>/` — **gitignored**, regenerated on `build` / `typecheck`
/ `test` / `storybook`. Don't hand-edit anything under `src/packs/`; change
the upstream asset or the generator.

The hand-written code is small:

- `src/lib/svg-icon.tsx` — the shared `<SvgIcon>` renderer (size → width/
  height, `currentColor`, rule-driven stroke width, a11y).
- `scripts/generate-icons.ts` — the generator.
- `scripts/packs.ts` — the **single source of truth** for which packs are
  built. Add a pack here (and a matching `exports` subpath + Vite entry).

## How the design-assets model maps to components

- One 24px master SVG per icon (the `default: true` variant). 16/32 are
  `$rules`-derived in the manifest; **no per-size SVGs exist**.
- The scale + stroke rules (`scale-16`, `stroke-1-6`, …) are resolved at
  generation time into a `size → stroke-width` map baked into each pack's
  `icon.tsx`, applied at runtime via the `size` prop. So one master renders
  at any size with the designed stroke weight (1.6px @16, 2px @24, 2.5px @32).
- **mono** packs → `stroke`/`fill` become `currentColor` (inherit text
  color). **multi** packs → authored colors (incl. gradients) are kept
  verbatim; gradient/clip `id`s are namespaced per icon (`<asset>-<id>`) so
  they don't collide when multiple icons render on one page. Stroke packs
  still take their stroke width from the rules even when multicolor.

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

All four design-assets icon packs are generated (see `scripts/packs.ts`):
`stroke-mono` (40), `solid-mono` (3), `stroke-multi` (12), `solid-multi` (1).
Counts grow as the upstream `@acronis-platform/design-assets` packs do — no
code change needed. `@acronis-platform/ui-react` depends on this package so
components/stories can compose icons.

## When you change anything

1. Tests live in `src/__tests__/` (Vitest + RTL), stories in
   `src/__stories__/` (both import from the generated `src/packs/*`).
2. Add a Changeset: `pnpm changeset` (from repo root).

See `../../context/releasing.md` for the Changesets / publish flow.
