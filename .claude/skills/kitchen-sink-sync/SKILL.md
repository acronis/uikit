---
name: kitchen-sink-sync
description: Audit and update the kitchen-sink app (apps/kitchen-sink) so it represents every ui-react component (with its real variants/sizes/states/props) and every brand tokens-pd ships. Use when components are added or re-themed, when token tiers or brands are added/renamed, or when asked to "update the kitchen sink", "show all components", or check the kitchen sink for drift. Cross-checks ui-react exports + cva keys + ui-spec + tokens-pd brands against what the page renders, and verifies every --ui-* token ref still resolves.
argument-hint: '[ComponentName | all]'
---

# Skill: /kitchen-sink-sync

Keep `apps/kitchen-sink` a faithful, **complete** visual reference for
`@acronis-platform/ui-react`: every exported component, each with its real
variants / sizes / states, wired to **live** `--ui-*` tokens.

Read the workspace contract first — it overrides anything here on conflict:
[apps/kitchen-sink/AGENTS.md](../../../apps/kitchen-sink/AGENTS.md). Repo-wide
rules live in [context/conventions.md](../../../context/conventions.md) and
[context/commits.md](../../../context/commits.md).

## Why this skill exists (the failure mode it prevents)

Three silent drifts make the kitchen sink lie:

1. **Missing components.** A new ui-react export (e.g. `SidebarPrimary`) is never
   added to `src/sections/components.tsx`, so the page silently under-represents
   the library. (Also missed: new variants and content-slot props on components
   that _are_ shown — see Phase 2.)
2. **Missing brands.** tokens-pd ships a new override brand (e.g. `deep-sky`) but
   the header brand `<select>` / `applyBrand` never gain it, so the page can only
   preview the default brand — see Phase 4.
3. **Dead token references.** `components.tsx` hardcodes token names in inline
   styles — notably the `forcedStyle` / `forcedIconStyle` helpers that force a
   button cell into a hover/active/focus state by referencing
   `--ui-button-<variant>-container-color-<state>` etc. When a token sync renames
   a tier (the recurring `-color-` infix rename:
   `--ui-button-primary-container-idle` → `…-container-color-idle`), **nothing
   fails** — `var(--missing)` just falls back to transparent/inherited, so the
   matrix renders blank cells. The component itself may already be fixed; these
   hand-written token strings drift independently and must be re-checked.

This skill is the audit + fix loop for all three. **Pure additive/QA work on a
private app** — no published-package or token changes.

## Invocation

```
/kitchen-sink-sync [ComponentName | all]
```

`all` (default) audits the whole page; a `ComponentName` scopes to one component.

## Phase 1 — Inventory: exports vs. coverage

```bash
# Every exported component (the source of truth for "all available components")
sed -n 's#.*/components/ui/\([a-z-]*\).*#\1#p' packages/ui-react/src/index.ts | sort -u
# What the page already renders (component identifiers used in the section)
grep -oE '<[A-Z][A-Za-z]+' apps/kitchen-sink/src/sections/components.tsx | sort -u
```

Any exported component dir with no corresponding render is **missing** — add it
in Phase 3. (Composable components export many parts; match on the root name.)

## Phase 2 — Per-component variants / sizes / states (the props to show)

For each component, the real axes come from the **cva keys** and the **prop
interface**, mirrored by the ui-spec contract — never guess:

```bash
# cva variant/size keys actually implemented:
sed -n '/cva(/,/^);/p' packages/ui-react/src/components/ui/<name>/<name>.tsx
# the framework-agnostic contract (variant/size enums, boolean state props):
cat packages/ui-spec/components/<name>/api.yaml          # if a spec exists
# OPTIONAL CONTENT-SLOT PROPS — easy to miss; grep the prop interface directly:
grep -nE '\b(label|description|icon|render|placeholder)\??:' \
  packages/ui-react/src/components/ui/<name>/<name>.tsx
```

Three distinct axes to render — **all three**, not just cva:

1. **cva `variant` / `size`** — every key (e.g. ButtonIcon's `ghost` _and_
   `secondary`; Tag's 7 variants incl. `ai`). A re-theme often **adds** a variant.
2. **States** — `idle / hover / active / disabled / focus` for interactive
   controls (forced via the matrix helpers); prop-driven states for the rest
   (`checked`, `indeterminate`, `disabled`, `aria-invalid`, `selected`, `open`).
3. **Optional content-slot props** — `label`, `description`, `icon`, `render`.
   These are **first-class things to show**, not just cva variants: a component
   that gained a `label` / `description` (the field-style Checkbox/Switch) looks
   complete in the box-only matrix yet under-represents its real API. Add a
   dedicated row for each (a "With label", "With label & description" row, …).
   This is where coverage gaps most often hide — check it on every run.

Mirror the existing matrix style: `STYLES` × `STATES` grid for the buttons, `Row`
lists for the rest (use `alignItems: 'flex-start'` for taller field rows that
carry a description).

## Phase 3 — Token-resolution check (do this every run — it's the silent bug)

Every `--ui-*` reference that the page **hardcodes** (inline styles, the
`forced*Style` template strings) must resolve against the **current** generated
tier. Missing vars fail silently, so grep-verify:

```bash
# 1) Each component's tier must be injected in tokens.ts (per-component CSS is
#    NOT bundled by ui-react/styles — see AGENTS.md).
grep -oE "css/[A-Za-z]+/acronis.css" apps/kitchen-sink/src/lib/tokens.ts | sort -u

# 2) Every --ui-* token string the section references must exist in some tier.
#    (Template-literal refs like `--ui-button-${token}-container-color-${cs}`
#    can't be grepped literally — expand them mentally to concrete names and
#    check a representative one, plus check the static refs:)
for t in $(grep -oE 'ui-[a-z-]+(-[a-z]+)*' apps/kitchen-sink/src/sections/components.tsx | sort -u); do
  grep -qhrF -- "--$t" packages/tokens-pd/css && echo "OK   --$t" || echo "CHECK --$t"
done
```

For the **button matrices specifically**, confirm the dynamic names the helpers
build are real. The forced state strings must match the tier exactly:
`--ui-button-<variant>-container-color-<state>`,
`--ui-button-<variant>-label-color-<state>`,
`--ui-button-<variant>-container-border-color-<state>` (border keeps its own
`-color-`), and ButtonIcon's `--ui-button-icon-global-{container,icon}-color-<state>`.
Spot-check one concrete name against the tier:

```bash
grep -o "ui-button-primary-container-color-idle" packages/tokens-pd/css/Button/acronis.css
```

If a referenced tier isn't injected in `tokens.ts`, add its
`import x from '@acronis-platform/tokens-pd/css/<Tier>/acronis.css?raw'` and wire
it into the injected list (so both rendering and the colors-section enumeration
see it).

## Phase 4 — Brand & scheme switchers (keep the header in sync with tokens-pd)

The header must expose **every brand tokens-pd ships**, not just the ones wired
when it was last touched (a new brand is as easy to miss as a new component).
Brands are the root CSS files: `acronis` is the base; every other root file is an
**override-only** brand layered on top.

```bash
# Brands tokens-pd actually ships (each non-acronis root file is an override brand):
ls packages/tokens-pd/css/*.css | sed 's#.*/##; s/\.css$//'      # e.g. acronis, deep-sky
# Brands the kitchen sink exposes — the Brand union + applyBrand + the <select>:
grep -nE "type Brand|DEEP_SKY|applyBrand|'[a-z-]+'" apps/kitchen-sink/src/lib/tokens.ts
grep -n "<option value=" apps/kitchen-sink/src/App.tsx
```

Any shipped brand missing from the `Brand` union / `applyBrand` override blob /
the `App.tsx` `<select>` is a gap. To wire a new override brand `<b>`:

- `find packages/tokens-pd/css -name '<b>.css'` — an override file exists only
  where the brand diverges, so the set may be smaller than the acronis set.
- In `tokens.ts`: `import … '@acronis-platform/tokens-pd/css/<Tier>/<b>.css?raw'`
  for the semantic root + each component tier that has a `<b>.css`; concatenate
  them into the brand's override blob; extend the `Brand` union; make `applyBrand`
  swap that blob into the override `<style>` (kept **last** in `<head>`).
- In `App.tsx`: add an `<option value="<b>">…</option>`.

Override brands carry no `color-scheme` shell, so they inherit light/dark from the
acronis base via the existing scheme toggle — **no per-brand scheme wiring**. The
scheme toggle is one mechanism (`applyTheme`) and needs no per-brand audit.

## Phase 5 — Implement

Edit `apps/kitchen-sink/src/sections/components.tsx`:

- Add missing components (lift a minimal, representative composition from the
  component's `__stories__/<name>.stories.tsx` — those are known-good).
- For new variants/states on existing components, extend the matrix/row.
- Layout-filling components (sidebars) need a bounded shell:
  `<div style={{ display: 'flex', gap: 16, height: 440 }}>…</div>`.
- Keep the page's house style: inline styles + `var(--ui-*)` tokens, **no
  Tailwind here**, no hardcoded hex.
- Update the `components.tsx` bullet in `apps/kitchen-sink/AGENTS.md` to list
  what's now shown.

## Phase 6 — Verify (build from dist + look at it)

The app imports the libraries by package name from their **built `dist`**, so
build deps first:

```bash
pnpm --filter "@acronis-platform/kitchen-sink^..." build   # ui-react, icons-react, deps
pnpm --filter @acronis-platform/kitchen-sink typecheck
pnpm --filter @acronis-platform/kitchen-sink lint
pnpm --filter @acronis-platform/kitchen-sink build
```

**Always look at the result** — the whole point is visual correctness, and the
token-drift bug is invisible to typecheck/lint/build:

```bash
pnpm --filter @acronis-platform/kitchen-sink exec vite preview --port 4180 &
```

Open `http://localhost:4180/#components`, scroll to the changed sections, and
screenshot (Chrome DevTools MCP, or manually). Confirm **light and dark** (the
header toggle) — tokens are `light-dark()`, so a blank/oddly-colored cell in one
scheme is the dead-token signature — and switch to at least one **non-default
brand** (the brand `<select>`): the components should re-theme (override-only, so
some variants legitimately stay put), and switching back to `acronis` clears it.
Stop the preview when done.

## Output checklist (done = all green)

- [ ] Every `ui-react` export renders in `components.tsx` (Phase 1 diff empty).
- [ ] Each component shows its real cva variants × sizes, meaningful states, and
      optional content-slot props (`label` / `description` / `icon` / `render`).
- [ ] Every hardcoded `--ui-*` ref resolves against the current tier; each used
      tier is imported in `tokens.ts`.
- [ ] Every brand tokens-pd ships is selectable (the `Brand` union, `applyBrand`'s
      override blob, and the `App.tsx` `<select>` all agree with `css/*.css`).
- [ ] `AGENTS.md` component list updated.
- [ ] typecheck · lint · build pass (deps built first).
- [ ] Visually verified in the browser — light **and** dark, default brand **and**
      at least one override brand.

## Notes

- This app is **private** — no changeset, no VR baselines (it isn't in the
  Storybook VR suite).
- **The audit one-liners must stay POSIX** — this repo runs on macOS (BSD `sed`),
  which has no `\U` / `\L` case transforms. Don't normalize PascalCase↔kebab with
  `sed -E 's/.../\U&/'` to auto-diff the export/render lists: BSD `sed` emits a
  literal `U`/`L`, silently turning every entry into a false "missing". Compare
  the two `sort -u` lists **by eye**, or match each export's PascalCase tag with a
  plain `grep "<Pascal"` loop (no case folding).
- **Commit headers must be ≤ 100 chars** (commitlint rejects longer). With the
  `feat(kitchen-sink): …` prefix that leaves ~80 chars — list the components
  added, not every variant (e.g. `feat(kitchen-sink): add ButtonIcon secondary,
Switch/Checkbox labels, Tag ai`).
- Don't fix component/token bugs _here_: if a token is genuinely missing upstream
  (not just renamed), or a component renders wrong, that's a ui-react / tokens-pd
  fix (use `/figma-component`), not a kitchen-sink patch.
