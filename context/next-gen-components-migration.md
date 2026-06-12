# Migration plan — next-gen component token tier

**Status:** IN PROGRESS — token layer (emitter + `tokens-pd`) and the Switch /
Tooltip consumers + kitchen-sink are **done & committed** on branch
`chore/sync-tokens-figma`; the rest of the ui-react re-theme is tracked as a
follow-up (see §9). Design intent below is unchanged.
**Owner workspace of the core change:** `packages/design-tokens` (emitter) +
`tools/style-dictionary` (router/partition) → ripples into `packages/tokens-pd`
(generated) and `packages/ui-react` (consumers).
**Date:** 2026-06-12.

This plan describes how the Acronis UI Kit adopts the Figma **next-gen component
token tier** (`brand.components`, PascalCase, 447 leaves) and retires the
flattened legacy tier (`brand.componentLegacy`, now 27 leaves: `icon`, `tree`).
It is grounded in the live snapshot at
`packages/design-tokens/.tmp/figma-tokens/variables.tokens.json` and the current
pipeline code; every claim below cites the file it came from.

---

## 0. Current state and why this is mid-flight (read first)

The snapshot has **already migrated** in Figma:

- `brand.componentLegacy` → only `icon`, `tree` (27 leaves).
- `brand.components` → the new source of truth: `Breadcrumb, Button, ButtonIcon,
Checkbox, Input, MenuItem, SidebarPrimary, SidebarSecondary, Switch, Tag,
Tooltip` (447 leaves).

But the emitter has **not** migrated. `packages/design-tokens/.tmp/scripts/figma-to-components.mjs`
line 63 still sources `source.brand?.componentLegacy`. Consequently the
committed `packages/design-tokens/tiers/components.json` in the working tree
**already contains only `icon` and `tree`** — every other component's `--ui-*`
tokens have effectively been dropped. A `tokens-pd` rebuild against this snapshot
would delete the `button`, `switch`, `tag`, `breadcrumb`, `tooltip`,
`menu-item`, `sidebar` CSS dirs (`packages/tokens-pd/css/*`), breaking every
`packages/ui-react` component that binds `var(--ui-<component>-*)`.

So this is **not** a green-field addition; it is a forced re-platform of the
component tier. Until the emitter is reworked, the token pipeline is in a broken
intermediate state. That framing drives the phasing in §7 — the emitter rework
is the unblock, not an enhancement.

`888b665` ("update 'acronis' values to use higher palette shades") is the
mid-migration commit on `main` that left this gap; PR #266 is built on the
pre-migration emitter and is now stale against the migrated snapshot (see §6.3).

---

## 1. The naming-contract decision (the crux)

### What the two shapes look like

Next-gen Figma path (from the snapshot, `figma-to-components.mjs` walks this):

```
Button / ai / label / color / active        [color]  → {semantics.colors.text.on brand.primary}
Button / ai / container / color / idle       [color]  → {semantics.gradients.ai.idle}
Switch / _global / box / borderColor / idle  [color]  → {semantics.colors.border.transparent}
Switch / on / box / color / idle             [color]  → {semantics.colors.background.status.on}
Tag / _global / md / container / height      [dim]    → {size.size-24}
```

`<Component>/<variant|_global>/<role>/<property>[/<state>]` with an optional
size tier (`md`/`sm`) wedged between `_global` and `role` (Tag).

Today's `--ui-*` surface (from `packages/ui-react/src/components/ui/button/button.tsx`)
is the **flattened** legacy shape — the current emitter already collapses
`role`+`property` and lifts state to the tail:

```
--ui-button-ai-label-active            (today)   vs   --ui-button-ai-label-color-active   (faithful next-gen)
--ui-button-primary-background-idle    (today)   vs   --ui-button-primary-container-color-idle
--ui-switch-container-color-active     (today)   vs   --ui-switch-on-box-color-active
--ui-switch-toggle-color-on            (today)   vs   --ui-switch-_global-tick-color-...  (no longer "on/off" terminal)
```

### Option A — faithfully reflect the next-gen structure

`--ui-button-ai-container-color-idle`, `--ui-switch-on-box-color-active`,
`--ui-tag-md-container-height`. Emitter is mostly a structural pass-through
(PascalCase→kebab, camelCase→kebab, mode/state ordering).

- **Pro:** emitter is simpler and round-trips Figma 1:1; no hand-maintained role
  collapse table; new Figma roles flow through without emitter edits; the
  property word (`color` vs `borderColor` vs `paddingX`) disambiguates tokens
  that the flat shape conflates.
- **Con:** **every** `--ui-*` component name changes — a total re-theme of every
  `ui-react` component regardless. The Tailwind router (§3) sees role words it
  doesn't map (`box`, `tick`, `container`-as-segment), and the key would carry
  redundant `color`/`container` words (`bg-button-ai-container-color-idle`).

### Option B — normalize to a flatter/legacy-compatible shape

Keep the current emitter posture: extract `_global`, drop the `color` property
word for color tokens, collapse `container`→nothing (the default surface),
regroup `<role>-<state>`. Produces `--ui-button-ai-background-idle`-style names
close to today's.

- **Pro:** smallest diff to the existing `--ui-*` contract and to the Tailwind
  router; some `ui-react` bindings survive unchanged; matches the mental model
  consumers already have.
- **Con:** requires a hand-maintained, per-component normalization table
  (`container`→drop, `box`→keep, `label`+`color`→`label`, `tick`→`toggle`
  rename) that must track Figma; lossy where two next-gen properties collapse to
  one name; the new richer geometry (`paddingX`/`paddingY`/`widthMin`/`marginT`/
  `borderStyle`/`borderWidth`) has no legacy equivalent, so it can't be
  "compatible" anyway — Option B is only partially backward-compatible.

### Recommendation: **Option A (faithful), with two bounded normalizations.**

Rationale (trade-off): the migration is breaking for `ui-react` **either way**
(§5) — there is no shape that preserves the current bindings, because the
next-gen tier adds geometry roles (`paddingX`, `widthMin`, `borderStyle`,
`marginT`, …) and renames states (`inactive`→`off`, `toggle`→`tick`) that have
no legacy name. Given that the re-theme cost is fixed, optimize for the _durable_
property — a thin, structural emitter that doesn't carry a hand-maintained
collapse table that silently rots as designers add roles. Option B's only real
win (some surviving bindings) is small and fragile.

The two bounded normalizations that keep Option A's names readable without a
per-component table:

1. **Case + separator only**: `PascalCase`→kebab (`ButtonIcon`→`button-icon`,
   `SidebarPrimary`→`sidebar-primary`), `camelCase`→kebab (`borderRadius`→
   `border-radius`, `widthMin`→`width-min`, `paddingX`→`padding-x`). Pure
   mechanical, no semantic table.
2. **Drop the literal `color` property word for `$type:color` tokens only**, so a
   color token reads `--ui-button-ai-label-idle` not `--ui-button-ai-label-color-idle`.
   This is safe and unambiguous because `color` is the _only_ color-valued
   property in the next-gen model (siblings are `borderColor`, which keeps its
   word). It removes the single most redundant segment and recovers most of the
   familiarity Option B promised, without a per-component map.

Everything else passes through faithfully: `box`, `tick`, `container` stay in the
name; `_global` continues to sort to the front and is **stripped from the
`--ui-*` name** (it's a grouping device, not a path segment — the router already
does `normalizeSegment` `replace(/^_+/, '')`).

Net contract examples after Option A + the two normalizations:

```
--ui-button-ai-label-idle              (was --ui-button-ai-label-idle — unchanged by luck)
--ui-button-ai-container-idle          (was --ui-button-ai-background-idle — renamed)
--ui-button-ai-container-border-radius (new)
--ui-switch-on-box-active              (was --ui-switch-container-color-active — renamed)
--ui-switch-tick-idle                  (was --ui-switch-toggle-color-on/off — renamed + restructured)
--ui-tag-md-container-height           (new)
```

This is a **breaking** change to `tokens-pd`'s `--ui-*` surface (§6).

---

## 2. Emitter rework — `figma-to-components.mjs` + `lib/`

The current emitter (read in full) is built around the legacy flat shape. The
parts that survive vs. change:

### Survives

- `loadDtcg`, `makeMetaFor`, the alias-translate/validate loop
  (`resolveModeValue` → `aliasMap.translate` → `aliasMap.has`), raw-literal
  inlining (`inlineRawColor`/`inlineRawDimension`), DTCG output shape
  (`values`/`platforms`/`$extensions`), `formatDtcgJson`.
- `lib/alias-map.mjs` **already** accepts `semantics.colors.*` (line 44 handles
  the `semantic`→`semantics` rename) — the coupled rename issue is already done
  for colors.

### Must change

1. **Source group** (line 63): `source.brand?.componentLegacy` →
   `source.brand?.components`. The legacy `icon`/`tree` tokens still exist under
   `componentLegacy`; decide whether they keep flowing from there (a second walk)
   or are dropped (§4). Recommend: **keep a second pass** over `componentLegacy`
   for `icon`/`tree` so those `--ui-icon-*`/`--ui-tree-*` tokens don't vanish in
   the same change — scope the breakage to the migrated components only.

2. **Key normalization** (line 76, `normalizeKey = k => k.replace(/\s+/g,'-')`):
   replace with a real case-aware kebab transform that handles PascalCase
   component/variant names (`ButtonIcon`, `SidebarPrimary`, `MenuItemExtras`,
   `Content`, `Link`, `Page`, `Separator`) **and** camelCase leaf names
   (`borderRadius`, `paddingX`, `widthMin`, `textStyle`, `heightDescriptionMin`,
   `marginT`, `paddingL`). Note mixed casing within one component (Breadcrumb has
   `Link`/`Page`/`Separator` **and** `list`; Input has `Content` **and**
   `error`/`normal`) — the transform must be uniform, not per-token.

3. **Role/property/state nesting + the `color`-word drop.** The next-gen tree is
   already nested (`variant/role/property/state`), so the elaborate
   `regroupStates` / `_global`-extraction / `reorderByList` machinery (lines
   170–289) that _reconstructed_ nesting from flat kebab keys is **largely
   obsolete** and should be deleted, not ported. Replace with:
   - A faithful recursive walk that lowercases/kebabs each segment.
   - The single rule from §1.2: for a `$type:color` leaf whose parent segment is
     `color`, drop the `color` segment from the emitted path.
   - State ordering: extend `STATE_ORDER` to include **`focus`** (present on
     `MenuItem` and `Input` — terminals analysis) and the variant-level states
     `on`/`off`/`checked`/`unchecked`/`indeterminate` (these are _variants_, not
     terminal states — they sit at the variant position, so no special tail
     handling needed; just don't assume the legacy 4-state set).

4. **`textStyle` → typography handling.** `textStyle` leaves are `$type:string`
   literals, and the values are **inconsistent in Figma** (distinct literals
   observed): `"typography.body.strong"`, `"body.default"` (no prefix),
   `"caption/strong"` (slash separator), `"typography.link.default"`. The current
   emitter _skips_ unmodeled string literals (lines 128–133). Decision needed
   (§8): the emitter must **normalize these to a reference into the typography
   tier** (e.g. `{typography.body.strong}`) so the token actually carries a
   usable value, rather than skipping. This requires: a normalizer that strips a
   leading `typography.` prefix, converts `/` to `.`, and validates the target
   exists (reuse `makeTypographyMap` from `lib/typography-map.mjs`, or add a
   `typography` branch to `alias-map.mjs`'s `has()`). Flag the Figma data
   inconsistency back to design (§8). Note `typography.link.*` was **removed** in
   PR #266 but `Button/ghost/label/textStyle` and others may reference it —
   reconcile.

5. **New `$type:string` properties that are NOT typography:** `borderStyle`
   (`"solid"`), `textDecoration` (`"underline"`/`"none"`). These are legitimate
   CSS-valued string tokens. The emitter currently can't model string leaves at
   all. Add a passthrough for these as `$type:string` with the literal value
   (the style-dictionary scalar transform already renders strings — see §3).

6. **New `$type:dimension` properties:** `paddingX/Y`, `paddingL/B`, `widthMin/
Max`, `heightMin`, `heightDescriptionMin`, `marginT`, `borderWidth`, `gap`,
   `size`, `height`, `width`, `borderRadius`. These are already `dimension` and
   alias `{gap.*}`/`{size.*}`/`{radius.*}`/`{stroke.*}` which `alias-map.mjs`
   already translates — they flow through with no new alias rules.

7. **`semantics.gradients.*` references — coupled blocker.** `Button/ai/container/
color/*` (×4) and `Tag/ai/container/borderColor` reference
   `{semantics.gradients.ai.*}`. But `figma-to-semantic.mjs` emits the AI
   gradients under `colors.background.ai` (`$type:gradient`), **not** under a
   `gradients` group — `tiers/semantic.json` has **no** `gradients` key
   (verified). So `aliasMap.has('{gradients.ai.idle}')` will fail and the build
   errors. Two fixes possible (§8 decision): (a) add a translation rule mapping
   `{semantics.gradients.ai.X}` → `{colors.background.ai.X}` in `alias-map.mjs`
   (cheapest — reuses the existing emitted gradient), or (b) re-emit a real
   `gradients` group in semantic. Recommend (a).

8. **Transparent literal colors:** `Button/inverted/container/borderColor/*`
   carry literals `#FF00FF00` and `#FFFFFF00` (8-digit). Confirm channel order
   with `lib/color.mjs` `hexToHslValue` — Figma may emit `#RRGGBBAA` or `#AARRGGBB`;
   these are fully-transparent values, so the emitter must produce a transparent
   token (alpha 0), not a magenta one. Add an alpha-aware path or map known
   transparent literals to the `colors.border.transparent` semantic that
   `Switch/_global/box/borderColor` already uses.

9. **`GLOBAL_SCOPE` and `reorderByList` tables (lines 178–289)** reference legacy
   component names (`chip`, `form`, `menubar`, `sidebar`, `tree`) — delete or
   rebuild for the next-gen set. With faithful nesting these are mostly
   unnecessary; keep only a `reorderByList` for variant display order per
   component if a deterministic order is wanted (e.g. Button `primary, secondary,
ghost, destructive, inverted, ai`).

### Modes

The snapshot has **only `Acronis`** in `brand.components` (verified — no Brand B
in the next-gen tier yet). The data-driven mode loop (line 135) already iterates
whatever modes exist, so this needs no code change, but it means **next-gen
component tokens will have no `brand-b` override** until Figma adds the Brand B
mode. The `tokens-pd` brand-override diff (which diffs brand-b against acronis)
will therefore emit empty/near-empty `css/<component>/brand-b.css` for the
migrated components. Flag in §8 — is shipping acronis-only next-gen components
acceptable for v1?

---

## 3. tokens-pd / style-dictionary impact

The router is `tools/style-dictionary/src/tailwind.ts` (`routeColor`, lines
116–135) and partition is by `token.path[0]` (`sliceOf`, line 26).

1. **`routeColor` new role words.** `PURE_ROLE` (line 84) maps `background`,
   `border`, `text`, `label`, `color`, `icon`, `glyph`; `DESC_ROLE` (line 94)
   maps `circle`, `divider`, `chevron`, `link`, `value`, `title`. The next-gen
   tier introduces **`box`** (Switch/Checkbox/Input), **`tick`** (Switch),
   **`container`** (everywhere), **`description`** (Checkbox/Input). With Option
   A + the `color`-word drop:
   - A color token like `switch/on/box/active` ends in a state, with `box` as the
     role-ish segment — `routeColor` scans right-to-left for a role word and will
     **not** find one (`box` is unmapped), so it throws → caught by the
     `isSemanticColor` guard (line 185) → **skipped from the Tailwind preset with
     a warning** (kept in CSS/tiers). That is the current safety valve and it
     means most next-gen component colors silently won't get Tailwind utilities.
   - Decision (§8): either (a) **extend `PURE_ROLE`/`DESC_ROLE`** with `box`→
     backgroundColor, `tick`→backgroundColor, `description`→textColor, and treat
     `container` as the default-surface PURE role → backgroundColor; or (b)
     **stop generating component Tailwind utilities** for the next-gen tier and
     have `ui-react` consume the `--ui-*` CSS custom properties via arbitrary
     values (`bg-[var(--ui-...)]`) as it already does (the button/switch/tag grep
     shows `ui-react` binds `var(--ui-*)` directly, **not** `bg-button-*`
     utilities). **Recommend (b):** the component-tier Tailwind presets appear
     largely unused by `ui-react` today (consumers use arbitrary `var()` values);
     dropping component utilities removes the router-extension burden entirely and
     the `box`/`tick`/`container` problem disappears. Verify utility usage in
     `apps/kitchen-sink` before committing to (b).

2. **`borderStyle`/`textDecoration` string tokens.** `buildThemeExtend` (line 173) handles `color`/`gradient`/`typography`/`dimension` only — a `$type:
string` token falls through and is silently dropped from the preset. For CSS
   output, confirm `hooks/transforms/scalar/css` renders a bare string token to
   `--ui-...-border-style: solid;`. If string tokens aren't currently emitted to
   CSS at all, add a scalar/string emission path (these are needed by
   `ui-react`).

3. **CSS naming + per-component partitioning.** `sliceOf` / `name/ui` partition by
   `path[0]` — that still works (each PascalCase→kebab component is a root). New
   per-component dirs appear: `css/button-icon/`, `css/checkbox/`, `css/input/`,
   `css/menu-item/`, `css/sidebar-primary/`, `css/sidebar-secondary/`,
   `css/tag/`, etc., and the old `css/chip/`, `css/form/`, `css/menu-item/`(legacy
   shape), `css/tree/` change content or disappear (§4). The `name/ui` transform
   drops a leading `colors` segment only — component roots are untouched, so
   `--ui-<component>-<rest>` falls out naturally.

4. **Drift gate.** `tokens-pd` generated output is committed and CI fails on
   drift. The PR that lands the emitter rework MUST also regenerate and commit all
   of `packages/tokens-pd/{css,tailwind,dtcg}/**` in the same change.

---

## 4. Component-set delta

| Next-gen Figma component              | Maps to `ui-react` dir           | Status                                                                  |
| ------------------------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| `Button`                              | `button/`                        | re-theme (rename)                                                       |
| `ButtonIcon`                          | `button-icon/`                   | re-theme; component exists                                              |
| `Breadcrumb`                          | `breadcrumb/`                    | re-theme                                                                |
| `Checkbox`                            | `checkbox/`                      | re-theme; **new dedicated tier** (was under legacy `form`)              |
| `Input`                               | `input/`, possibly `search/`     | re-theme; new dedicated tier                                            |
| `MenuItem`                            | `select/`? (no `menu-item/` dir) | **gap** — no 1:1 `ui-react` dir; route to where menu items render       |
| `SidebarPrimary` / `SidebarSecondary` | none                             | **new** — no `ui-react` sidebar yet; tokens land ahead of the component |
| `Switch`                              | `switch/`                        | re-theme; states `inactive`→`off`, `toggle`→`tick`                      |
| `Tag`                                 | `tag/`                           | re-theme; mostly uses **semantic** tokens today, see note               |
| `Tooltip`                             | `tooltip/`                       | re-theme; no `_global` group (roles at root)                            |

**Dropped from `componentLegacy` (next-gen has no equivalent):** `chip`, `form`,
`menubar`, `item`, and the legacy flat `sidebar`/`menu-item` shapes. Per the
token-contract doc, **removing a `--ui-*` token is breaking**. Consumers of
dropped tokens:

- `chip` — confirm no `ui-react` component binds `--ui-chip-*` (no `chip/` dir in
  the component list — likely safe, verify in `apps/kitchen-sink` and
  `apps/demo`).
- `form` — its tokens (input/text/switch) are superseded by dedicated `Input`,
  `Checkbox`, `Switch` next-gen components; rebind those consumers.
- `item` — already removed in PR #266.

**Kept via `componentLegacy` second pass (recommended §2.1):** `icon`, `tree`.

**Tag note:** `tag.tsx` binds `--ui-background-status-*` / `--ui-text-on-status-*`
/ `--ui-border-on-status-*` — **semantic** tokens, not `--ui-tag-*`. The next-gen
`Tag` tier (`Tag/critical/container/color` → `{semantics.colors.background.status.
critical}`) is a thin indirection over the same semantics. Decide whether Tag
re-themes onto `--ui-tag-*` component tokens or keeps binding semantics directly
(low-value indirection). This is the cheapest component to leave as-is.

---

## 5. ui-react consumer migration

Per-component re-theme work (every component re-themes under Option A; the grep
in research confirms direct `var(--ui-*)` binding in `button.tsx`, `switch.tsx`,
`tag.tsx`, etc.):

1. **Per component:** update every `var(--ui-<component>-*)` reference to the new
   names; add bindings for the new geometry tokens that previously were hardcoded
   Tailwind (`padding-x`, `width-min`, `border-width`, `border-style`,
   `margin-t`, etc.) where the design now tokenizes them. Switch needs the
   `inactive→off` / `toggle→tick` rename and the new `box.border-*` tokens.
2. **Tests:** each component has `__tests__/*.test.tsx` that assert on `--ui-*`
   names (e.g. `switch.test.tsx`, `button.test.tsx` reference `var(--ui-`) —
   update assertions in lockstep. `__stories__/*.stories.tsx` likewise.
3. **New components without a counterpart:** `SidebarPrimary`/`SidebarSecondary`
   tokens ship before the components exist — that's fine (tokens are additive to
   `ui-react`); no consumer work until those components are built (roadmap).
4. **Figma Code Connect:** components touched by `/figma-component` need their
   `.figma.ts` re-validated against the next-gen Figma nodes.
5. **VR baselines:** regenerate visual-regression baselines after re-theme.
   **Caveat (known landmine):** Apple-Silicon local rendering diverges from CI
   x86 — **regenerate baselines in Docker (x86)**, not on the dev mac. Watch
   shadow/blur-sensitive components (**tooltip** especially — it has shadow/blur)
   for sub-pixel diffs that look like real changes.

This is the largest blast-radius phase and should be **one PR per component**
(§7) so each is independently reviewable and revertable.

---

## 6. token-contract / changeset implications

1. **Breaking.** Per `packages/design-tokens/context/token-contract.md`, removing
   or renaming a `--ui-*` token is **breaking**, and removing a component entry
   point (`css/<x>.css`) is breaking. This migration renames the entire component
   `--ui-*` surface and removes `chip`/`form` entry points → a **breaking** bump
   on both `@acronis-platform/design-tokens` and `@acronis-platform/tokens-pd`.
   Pre-1.0, that's a **minor** per the repo's convention (PR #266 uses the same
   `!`/minor framing). Use a `!`-marked conventional commit + changesets for both
   packages, with a migration note enumerating the rename map.
2. **`ui-react`** also needs a changeset (its component styling changes), even
   though the visual result is intended to be stable — the internal token
   bindings change.
3. **Provide a rename map** in the changeset body (old `--ui-*` → new `--ui-*`)
   so external consumers can migrate. Generate it mechanically by diffing the old
   vs new `tokens-pd/css` custom-property names.

### 6.3 PR #266 — recommendation (human decides)

PR #266 (`feat/tokens-figma-refresh`) is built on the **pre-migration** emitter
(it explicitly "sources from the renamed `componentLegacy` Figma group") and its
"no drift" validation was against a snapshot where `componentLegacy` still held
all components. Against the current migrated snapshot, #266's emitter produces the
near-empty `components.json` we see in the tree. Options:

- **(Recommended) Land #266's non-component parts first, drop its component
  story.** #266 carries valuable independent work: the `status-strong`/`inverted`
  semantic renames, `ink` palette, `units.size-20`, the new semantic glyph/status
  tokens, the Tailwind router safety-valve, and `.prettierignore` protection.
  Re-scope #266 to **semantic + primitives + tooling only**, merge it, then build
  this next-gen component migration on top. This sequences cleanly: §7 Phase 1
  depends on the semantic renames being in.
- **(Alternative) Supersede #266 entirely** with one combined branch. Riskier —
  bundles a large semantic refresh with the component re-platform into one
  un-bisectable change.

This is a human/lead call; the plan assumes the recommended path (semantic parts
of #266 land first).

---

## 7. Phasing

Each phase is an independently reviewable PR (or PR set). `→` = hard dependency;
phases on the same indent level can parallelize.

**Phase 0 — Figma prerequisites (design, blocks everything color-related).**

- Resolve the `semantics.gradients.ai.*` reference target (either re-localize as
  a real `gradients` group, or accept the emitter alias-rewrite in §2.7).
- Normalize the `textStyle` literal inconsistency (`typography.x.y` vs `x.y` vs
  `x/y`) at the source, or accept emitter normalization (§2.4).
- Confirm whether Brand B mode will be added to `brand.components` for v1, or
  acronis-only ships (§8).
- Decide fate of the transparent-border literals (`#FF00FF00`) — prefer aliasing
  to `border.transparent`.

**Phase 1 — Land #266 semantic/primitive/tooling parts** (§6.3). →

**Phase 2 — Emitter rework** (`design-tokens`). The unblock.

- Rewrite `figma-to-components.mjs` per §2 (source switch, case-aware kebab,
  faithful nesting, `color`-word drop, `textStyle`→typography, string
  passthrough, gradient alias rewrite, transparent-literal handling, second pass
  for `icon`/`tree`).
- Update `lib/alias-map.mjs` (gradient + typography `has()` branches),
  `lib/typography-map.mjs` reuse, delete dead `GLOBAL_SCOPE`/regroup machinery.
- Re-emit `tiers/components.json`; `validate` green. PR includes the regenerated
  tier only (no tokens-pd yet, to keep the diff reviewable) **or** combine with
  Phase 3 if reviewers prefer one buildable unit. → depends on Phase 1.

**Phase 3 — tokens-pd / style-dictionary** (`tools/style-dictionary` + committed
`tokens-pd`).

- Decide component-Tailwind-utility fate (§3.1 — recommend drop). Add string-token
  CSS emission (§3.2). Regenerate and commit all of `tokens-pd/{css,tailwind,
dtcg}`. Drift gate green. → depends on Phase 2.

**Phase 4 — ui-react per-component re-theme** (one PR per component; parallelizable
across people). Suggested order by risk/value: `button`, `switch`, `tag`,
`tooltip`, `breadcrumb`, `button-icon`, `checkbox`, `input`. `MenuItem`/`Sidebar*`
deferred (no/partial component). Each PR: re-theme + tests + stories + Code
Connect. → depends on Phase 3.

**Phase 5 — kitchen-sink + VR baselines.**

- Update `apps/kitchen-sink` token showcase; regenerate VR baselines **in Docker
  (x86)**, scrutinize tooltip/shadow diffs (§5). → depends on Phase 4 (can run
  per-component as each lands).

**Phase 6 — docs + changesets finalize.**

- `apps/docs` token/component pages; the rename-map migration note; ensure
  changesets on `design-tokens`, `tokens-pd`, `ui-react`. → trails Phase 4/5.

Parallelization: Phase 0 (design) runs alongside Phase 1. Within Phase 4, every
component PR is independent. Phase 5 can begin per-component.

---

## 8. Open questions / risks (need a human/designer decision before coding)

1. **Naming contract (the crux):** approve **Option A faithful + `color`-word
   drop** (§1), or prefer Option B's flatter shape? Everything downstream keys off
   this.
2. **`semantics.gradients.ai.*` target (Phase 0 blocker):** fix in Figma as a real
   `gradients` group, or accept the emitter alias-rewrite to `colors.background.ai`
   (§2.7)? Without one, the emitter hard-errors on Button/ai + Tag/ai.
3. **`textStyle` source inconsistency:** the snapshot has three literal formats
   (`typography.body.strong`, `body.default`, `caption/strong`). Normalize in
   Figma, or in the emitter (§2.4)? Also reconcile references to the
   `typography.link.*` styles that PR #266 removed.
4. **Component Tailwind utilities:** keep generating per-component Tailwind presets
   (requires extending `routeColor` for `box`/`tick`/`container`) or drop them and
   rely on `ui-react`'s existing `var(--ui-*)` arbitrary-value binding (§3.1,
   recommended drop)? Verify `apps/kitchen-sink` doesn't use `bg-button-*`-style
   component utilities first.
5. **Brand B coverage:** `brand.components` is **acronis-only** in the snapshot.
   Is acronis-only acceptable for the next-gen components in v1, or must Figma add
   the Brand B mode before this ships (so `css/<component>/brand-b.css` isn't
   empty)? (§2 Modes.)
6. **Dropped components (`chip`, `form`, `menubar`):** confirm no live consumer
   binds `--ui-chip-*`/`--ui-form-*`/`--ui-menubar-*` (grep `apps/*` +
   `ui-legacy`). The contract treats removal as breaking — need the consumer
   inventory before deleting.
7. **Tag indirection:** re-theme Tag onto `--ui-tag-*` component tokens, or keep
   it binding semantic `--ui-background-status-*` directly (the cheaper status
   quo)? (§4.)
8. **`MenuItem` / `Sidebar*` landing ahead of components:** ship the tokens now
   (additive, harmless) and build components later, or hold the tokens until the
   components exist? Recommend ship-now.
9. **Transparent border literals (`#FF00FF00`/`#FFFFFF00`):** confirm Figma hex
   channel order with `lib/color.mjs` and prefer aliasing to
   `colors.border.transparent` over inlining a transparent literal (§2.8).
10. **PR #266 disposition** (§6.3): confirm the recommended split (land semantic
    parts first, drop #266's component story) vs. one combined branch.

---

## 9. Execution status & remaining backlog (as of 2026-06-12)

This section records what actually shipped on branch `chore/sync-tokens-figma`
and the precise remaining work, superseding the §7 phasing where they differ
(the work was compressed onto one branch rather than one-PR-per-phase).

### Done & committed (this branch)

- **Phase 2 — emitter rework** (`a478fd9`). `figma-to-components.mjs` now sources
  `brand.components`; Option A faithful naming via new `lib/segment-case.mjs`;
  `lib/alias-map.mjs` gained the `{semantics.gradients.ai.*}` → `colors.background.ai.*`
  rewrite and `textStyle` → `typography.*` normalization. `tiers/components.json`
  re-emitted: **466 leaves**, 11 next-gen components + retained `icon`/`tree`.
- **Phase 3 — tokens-pd** (`a478fd9`). All `css/`, `tailwind/`, `dtcg/` regenerated.
  `brand-b` dropped entirely (its semantic values were removed upstream in
  `a34581f`) — no `brand-b.css` / presets emitted anymore. Tailwind builder skips
  unroutable deep component roles (`box`/`tick`/`container`) with a warning;
  `tools/style-dictionary/src/tailwind.ts` got the gradient-branch safety valve.
- **Phase 4 (partial) — Switch + Tooltip** (`2800583`). Re-themed to the next-gen
  names (Switch → `box`/`tick` model; Tooltip → `container-border-radius`) + tests.
- **Phase 5 (partial) — kitchen-sink** (`2800583`). Dropped brand-b + the brand
  switcher; component CSS sources updated to the next-gen set. `ui-react/styles`
  swapped its dead `css/form` import for `css/input` + `css/checkbox` + `css/button-icon`.

### Remaining ui-react re-theme (the follow-up — NOT done)

Every component below binds `var(--ui-<component>-*)` directly and currently
references **dead** token names → renders unstyled (builds still pass; missing
CSS vars don't error). Inventory from a token-ref audit on this branch:

| Component    | Dead refs                                  | Migrates to                                                                                     | Notes                                                       |
| ------------ | ------------------------------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `Button`     | 44 (`<variant>-background/border-<state>`) | `<variant>-container[-border-color]-<state>` + `-label-/-icon-` + `global-container-*` geometry | flagship; `ghost` has no container fill token (transparent) |
| `ButtonIcon` | 12 (`-background/border/icon-<state>`)     | `-global-container-<state>` + `-global-icon-*`                                                  | single (no variants)                                        |
| `Breadcrumb` | 4 (`chevron/gap/link/value`)               | `link-label-<state>`, `list-gap`, `page-label-color`, `separator-icon-{color,size}`             |                                                             |
| `Checkbox`   | `--ui-form-*` (removed tier)               | `--ui-checkbox-{checked,unchecked}-box[-border-color]-<state>` + `-icon-` (43 tokens)           |                                                             |
| `Input`      | `--ui-form-*` (removed tier)               | `--ui-input-{content,box,error}-*` (35 tokens)                                                  |                                                             |

Each follow-up unit (one PR per component per §5/§7) = re-theme + update
`__tests__` token assertions + `__stories__` + Code Connect + **regenerate VR
baselines in Docker (x86), not on the dev mac** (§5 landmine). `Tag` needs **no**
work — it binds semantic `--ui-*-on-status-*`, not the component tier.

### ⚠️ Blocker — Radio / Search / Select are stranded (no next-gen tokens)

`Radio`, `Search`, `Select` all bind the removed `--ui-form-*` tier, but Figma's
next-gen `brand.components` set has **no** radio/search/select tokens — only
`checkbox` + `input` came out of the old `form` umbrella. So these three have
**nowhere to migrate**: they will be unstyled until either (a) Figma adds
`Radio`/`Search`/`Select` to `brand.components`, or (b) a decision is made to
keep emitting legacy form tokens for them in the interim. This is a **Figma /
design prerequisite**, not just code — escalate before the follow-up PRs.
