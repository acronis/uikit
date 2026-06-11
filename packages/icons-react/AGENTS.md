# AGENTS.md — `packages/icons-react`

`@acronis-platform/icons-react` — React icon components **generated from**
[`@acronis-platform/icons-svg-next`](../icons-svg-next). Published.

Repo-wide rules live in the repo root's `./context/`. This file documents
only what's specific to this workspace.

## Icons are generated, not authored

`scripts/generate-icons.ts` reads the icons-svg-next name-list manifests
(`src/figma/*.json`) + flat 24px SVG masters (`src/svg/*.svg`) and emits
per-icon React components under `src/packs/<pack>/` — **gitignored**,
regenerated on `build` / `typecheck` / `test` / `storybook`. Don't hand-edit
anything under `src/packs/`; change the upstream icon (re-sync icons-svg-next)
or the generator.

The hand-written code is small:

- `src/lib/svg-icon.tsx` — the shared `<SvgIcon>` renderer (size → width/
  height, `currentColor`, rule-driven stroke width, a11y).
- `scripts/generate-icons.ts` — the generator.
- `scripts/packs.ts` — the **single source of truth** for which packs are
  built and the size/stroke rule (`ICON_SIZES`, `STROKE_WIDTH_PX`). Add a pack
  here (and a matching `exports` subpath + Vite entry).

## How the icons-svg-next model maps to components

- One 24px master SVG per icon, flat in `icons-svg-next/src/svg/`. Each pack's
  icon names come from its manifest(s): a pack reads every manifest named
  `<pack>` or `<pack>-<category>` (so `stroke-mono` merges its six category
  manifests — `stroke-mono-arrows`, `…-shapes`, …) and resolves each name to
  `svg/<name>.svg`. **No per-size SVGs exist.**
- The size/stroke rule is a constant (`STROKE_WIDTH_PX` in `packs.ts`: 1.6px
  @16, 2px @24, 2.5px @32 — matching the Figma "icon components (generated)"
  set). The generator converts it into a `size → stroke-width` (viewBox units)
  map baked into each stroke pack's `icon.tsx`, applied at runtime via the
  `size` prop, so one master renders at any size with the designed stroke.
- **mono** packs → `stroke`/`fill` become `currentColor` (inherit text
  color). **multi** packs → authored colors (incl. gradients) are kept
  verbatim; gradient/clip `id`s are namespaced per icon (`<asset>-<id>`) so
  they don't collide when multiple icons render on one page. Stroke packs
  still take their stroke width from the rule even when multicolor.

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

All four icons-svg-next packs are generated (see `scripts/packs.ts`):
`stroke-mono` (395), `solid-mono` (59), `stroke-multi` (12), `solid-multi` (1).
Counts grow as the upstream `@acronis-platform/icons-svg-next` set does — no
code change needed. `@acronis-platform/ui-react` depends on this package so
components/stories can compose icons.

The icons-svg-next source is a live WIP surface, so generated names can include
collisions (`*-duplicate`) and size-suffixed strays (`agent-qnap--32`) until the
Figma source is cleaned; fix at the source and re-sync rather than hand-editing.

## When you change anything

1. Tests live in `src/__tests__/` (Vitest + RTL), stories in
   `src/__stories__/` (both import from the generated `src/packs/*`).
2. Add a Changeset: `pnpm changeset` (from repo root).

See `../../context/releasing.md` for the Changesets / publish flow.
