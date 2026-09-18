---
name: figma-brand-sync
description: >
  Wire new brand modes from a Figma variable export into
  @acronis-platform/design-tokens, rebuild @acronis-platform/tokens-pd, and
  wire the result into the ui-react Storybook brand toolbar for visual
  verification — end to end. Input is a Figma "export variables" zip/folder
  for the Brand collection (one fully-resolved DTCG file per brand mode, e.g.
  from Figma's native per-collection Variables export). Use when the user has
  exported Figma brand variables and wants them turned into a working brand
  theme, or when a bug report says a brand/color-scheme silently falls back to
  default because its `values.<brand>` data was never wired in. Never reads
  Figma directly — the export is a file the user already produced.
argument-hint: '<path-to-unzipped-Brand-export-dir> [brand1,brand2,...]'
---

# Skill: /figma-brand-sync

Turns a Figma "Brand" variable-collection export into a shipped brand theme:
`design-tokens` tiers → validated → `tokens-pd` rebuilt → wired into
Storybook's brand toolbar → smoke-tested. Read this file in full before
starting; don't skip phases.

## Why this exists, and its one hard rule

A brand is **data**, not code: `tools/style-dictionary`'s `discoverBrands()`
(`tools/style-dictionary/src/tokens.ts`) already derives the brand set from
the union of `values.<brand>` keys in `packages/design-tokens/tiers/
{semantics,components}.json` — adding a brand there needs **zero code
change** to emit `tokens-pd/css/<brand>.css` etc. The gap this skill closes is
purely: translating a Figma export into those `values.<brand>` entries
correctly.

`packages/design-tokens/AGENTS.md` says tier refreshes normally come from an
external project (`acronis-tokens-updater`), not from code in this repo — this
skill exists for the case where that path isn't available and someone has a
Figma export in hand. **Never hand-fabricate a token value.** Every value this
skill writes must trace back to something in the Figma export (an alias to an
existing primitive, or a decoded mocked value) — never a guessed/invented
color.

## Pre-flight

1. Confirm the input is the unzipped **Brand** collection export: a directory
   of `<mode>.tokens.json` files, one per brand mode, plus `default.tokens.json`.
   (If the user gives a `.zip`, unzip it first — one dir per collection if
   they exported multiple: `Brand.zip`, `Theme.zip`, `Units.zip`, `Font.zip`.
   Only `Brand/` is this skill's input; the others should already be reflected
   in `primitives.json` — if `primitives.json` doesn't have a `branding.<brand>`
   group for a target brand yet, stop and say so: that means the palette
   itself hasn't been synced, which is out of this skill's scope.)
2. List the brand files present (`ls <dir>/*.tokens.json`, excluding
   `default.tokens.json`) and cross-reference against
   `packages/design-tokens/tiers/primitives.json` → `branding.*` — every
   target brand should have a matching `branding.<brand>` palette already.
   Flag any brand file with no matching `branding.*` group; don't proceed with
   it (Phase 1's translation depends on it for `Branding/<brand>/...` alias
   resolution).
3. Determine the target brand set: the user's explicit list (skill argument),
   or default to every export brand not yet wired (the script auto-discovers
   this — see Phase 2).

## Phase 1 — Regression-check the translator (mandatory, never skip)

Before touching any new brand, prove the translation rules are still correct
against brands that are **already committed** (known-good ground truth):

```bash
node .claude/skills/figma-brand-sync/scripts/sync-brands.mjs check <brandDir>
```

This auto-discovers which brands in `<brandDir>` are already wired (by
filename matching an existing `values.<brand>` key) and diffs the script's
translation against the committed data. It exits non-zero if there's any
mismatch.

- **Zero mismatches** → the rules hold; proceed to Phase 2.
- **Any mismatch** → STOP. Read `/tmp/sync-brands-check-mismatches.json`, find
  the pattern (a new palette group name Figma introduced that isn't in
  `NAME_MAP`, a new unit-key shape, a new mocked-value type), fix
  `scripts/sync-brands.mjs`, and re-run this check until clean. **Never**
  proceed to Phase 2 with unexplained mismatches — there's no independent way
  to catch a translation bug on brand-new data once it's in the tier files.
  See "Known translation rules" below for the shapes already handled and
  where to extend them.
- If `<brandDir>` has **no** brand that's already wired (e.g. this repo has
  zero brands so far), skip this check but say so explicitly, and be extra
  careful reviewing Phase 3's diff by hand.

## Phase 2 — Apply to the target brands

```bash
node .claude/skills/figma-brand-sync/scripts/sync-brands.mjs apply <brandDir> [brand1,brand2,...]
```

Omit the brand list to target every export brand not already wired. This
writes `values.<brand>` for **every** leaf in `semantics.json`/`components.json`
that has a `values` dict (every existing brand always has one — there is no
override-only diffing at the JSON level, only at the generated-CSS level; see
`packages/design-tokens/context/manifest.md`).

## Phase 3 — Inspect the diff

```bash
git diff --stat packages/design-tokens/tiers/semantics.json packages/design-tokens/tiers/components.json
```

Sanity checks:

- Leaf **count** must be unchanged (`grep -c '"values"'` before/after, or a
  quick Python/Node deep-walk) — this pass must never add or remove a token
  path, only new brand keys on existing ones.
- No existing brand's value should have changed (diff the JSON for the
  previously-wired brand keys specifically) — if Phase 1 passed, this should
  hold automatically, but verify on a big diff.
- Warnings (`/tmp/sync-brands-warnings.json`) should only contain the known,
  understood fallback cases (see below) — anything new is worth a second look
  before proceeding.

Run Prettier on the two files — the script's own formatter approximates but
isn't guaranteed byte-identical to the house style for deeply nested arrays:

```bash
npx prettier --write packages/design-tokens/tiers/semantics.json packages/design-tokens/tiers/components.json
```

## Phase 4 — Validate

```bash
pnpm --filter @acronis-platform/design-tokens validate
```

Fix ajv failures before continuing (most likely a malformed alias from an
uncovered translation case — see Phase 1's guidance).

## Phase 5 — Rebuild tokens-pd

```bash
pnpm --filter @acronis-platform/style-dictionary build
```

Then confirm the **drift guard**: every already-shipped brand's generated
output must be byte-identical (no modifications, only additions):

```bash
git status --porcelain packages/tokens-pd/ | grep '^ M'   # must be empty
```

Run the style-dictionary test suite too:

```bash
pnpm --filter @acronis-platform/style-dictionary test
```

## Phase 6 — Wire into the ui-react Storybook brand toolbar

This is the visual-verification entry point
(`packages/ui-react/.storybook/globals.ts` + `preview.ts`) — it swaps in
`tokens-pd/bundles/<brand>.css` wholesale via a toolbar, exactly the delivery
model brand data follows. For each new brand, in `globals.ts`:

1. Add `import bundle<PascalName> from '@acronis-platform/tokens-pd/bundles/<brand>.css?raw';`
2. Add `'<brand>'` to the `Brand` union type.
3. Add `<brand>: bundle<PascalName>,` to `BRAND_BUNDLES`.

In `preview.ts`, add `{ value: '<brand>', title: '<Human Title>' }` to the
`brand` toolbar's `items` array. Pick a human title from context (partner
name, color family) — check `context/e1-theme-delivery.md`'s brand matrix or
the brand's `branding.<brand>` primitive group for hints if the raw key isn't
self-explanatory.

Then:

```bash
pnpm --filter @acronis-platform/ui-react typecheck
npx prettier --write packages/ui-react/.storybook/globals.ts packages/ui-react/.storybook/preview.ts
```

## Phase 7 — Smoke-test

```bash
pnpm --filter @acronis-platform/ui-react storybook:build --quiet
```

Must succeed with no import-resolution errors. Optionally grep the built
output for a token value unique to one new brand to confirm it actually made
it into the bundle (e.g. a distinctive `rgb(...)` from that brand's
`--ui-background-brand-primary`), then delete the build artifact
(`storybook-static/`) — it's not meant to be committed.

## Phase 8 — Changeset

```bash
pnpm changeset
```

Minor bump for `@acronis-platform/design-tokens` and
`@acronis-platform/tokens-pd`. Summary: which brands were added, leaf counts
touched, confirmation that no existing brand's data changed. Follow the
`.changeset/design-tokens-*.md` precedent already in the repo for tone/format.

## Phase 9 — Report

Summarize: brands wired, brands intentionally skipped (no `branding.*`
primitive yet → needs a separate palette-sync pass first; or explicitly
excluded), and any warning categories that needed the "used default fallback"
path (list them — they're a real per-leaf gap, just an already-accepted one
inherited from every existing brand, not something this pass introduced).

## Scope boundary

This skill **never** pushes, commits, or opens a PR, and never writes to
Jira/Confluence/Bitbucket/Figma via any MCP tool. It stops at a clean working
tree the user can review and commit themselves, unless they explicitly ask for
a commit.

## Known translation rules (what `sync-brands.mjs` already handles)

Figma's per-brand export is a fully-resolved, single-mode DTCG tree per file
(not a `modes`-dict snapshot). Each leaf may be:

- A `{semantics.…}` / `{components.…}` self-reference string → strip the tier
  prefix. If it doesn't resolve against our tree (Figma nests one extra group
  ours doesn't), retry with each middle path segment removed in turn.
- A leaf with `$extensions.com.figma.aliasData.targetVariableName`:
  - `Branding/<brand>/<rest>` → `{branding.<brand>.<rest, dot-joined>}`.
  - `gap|size|radius|stroke/<prefix>-<key>` → `{units.<section>.<key>}` —
    strip the leading alpha prefix (not just digits!) so sentinels like
    `radius-full` → `full` and signed values like `gap-neg-6` → `neg-6`
    survive.
  - Anything else → a palette reference, via `mapPaletteParts` (Figma group
    name → our `primitives.palette` group, e.g. `Blue/Blue-13-Brand` →
    `{palette.blue.13}`). **Extend `NAME_MAP` here** when validate/build
    reports an unresolved palette alias for a new Figma color-ramp name (this
    happened for `ElectricBlue` during initial development).
- A literal color object with `alpha === 0` and **no** aliasData → the CSS
  keyword `"transparent"`. (If aliasData exists, the alias takes precedence —
  Figma sometimes backs a technically-transparent literal with a real
  `Transparent/Clear` alias.)
- A literal color object with a `hex` field → converted to our DTCG HSL form.
- A `$type: "string"` value matching `shadow-<name>` → `{shadow.<name>}` (no
  primitive shadow tier exists; `semantics.shadow` is the composite root
  directly).
- A bare dotted string with no `{}` → a typography reference
  (`link.default` → `{typography.link.default}`), with a hyphen-as-dot
  fallback lookup for cases like `title.accent` → `{typography.headings.title-accent}`.
- A raw `linear-gradient(...)` CSS string (mocked gradient pattern, no native
  Figma gradient variable type) → parsed into a `{color, position}[]` stop
  array.
- Anything genuinely **absent** from the export (today: `shadow.*`, which has
  no Figma Variable backing at all, and `colors.background.transparent`) →
  falls back to copying `values.default` forward, with a warning. This is
  correct as long as that leaf is brand-invariant across every currently
  wired brand — verify that assumption still holds if a new such gap appears.

If a genuinely new mocked-value shape or palette-group name shows up (Phase 1
will catch it as an unexplained mismatch, or Phase 4's `validate` will reject
an unresolved alias), extend `translateLeafValue` / `NAME_MAP` in
`scripts/sync-brands.mjs` rather than hand-patching the tier JSON — keep the
translation logic reusable for the next brand batch.
