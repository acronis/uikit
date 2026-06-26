---
name: legacy-component
description: >
  Recreate a first version of a ui-react component from its `packages/ui-legacy`
  counterpart when a "ready for dev" Figma mockup does not yet exist. Drives the
  same recipe as /figma-component — implement in packages/ui-react (component,
  tests, stories), write its framework-agnostic spec in packages/ui-spec, and add
  a docs page in apps/docs — but reads the legacy source instead of a Figma node,
  and maps legacy `--av-*` /
  Radix patterns onto ui-react `--ui-*` tokens + Base UI. Prefers a component's
  own `--ui-<name>-*` token tier when one already exists, otherwise falls back to
  semantic/primitive tokens. The Figma Code Connect link is deferred (no node
  yet). Invoke with /legacy-component <ComponentName> [legacy-name] [--update].
---

# ui-legacy → ui-react component (design-pending v1)

A repeatable recipe for landing a **first version** of a component into
`packages/ui-react` by porting its mature `packages/ui-legacy` counterpart, for
when finished Figma mockups don't exist yet. It produces the **same shape of
output** the Button and Breadcrumb components have — component, tests, stories,
VR baselines, a ui-spec, and an `apps/docs` page — with two deliberate
differences from [`/figma-component`](../figma-component/SKILL.md):

1. **Source is legacy code, not a Figma node.** Variants, parts, props, and a11y
   come from reading `packages/ui-legacy/src/components/ui/<legacy-name>/`.
2. **The Figma link is deferred.** With no "ready for dev" node, the
   `.figma.tsx` Code Connect is a `NEEDS_FIGMA_URL` skeleton (not `COMPLETE`)
   and the spec `index.yaml` ships `status: draft` with **no** `figma:` block.
   Reconcile against the real design later with `/figma-component <Name> <url>
--update` once mockups land.

Everything else — Base UI composition, `--ui-*` token discipline, the 7-file
spec, tests, the light+dark VR baseline matrix, the changeset — is **identical**
to `/figma-component`. Where this file is silent, that recipe and the workspace
contracts govern.

Read the workspace contracts first — they override anything here on conflict:

- Root: [AGENTS.md](../../../AGENTS.md), [context/conventions.md](../../../context/conventions.md)
- ui-react: [packages/ui-react/AGENTS.md](../../../packages/ui-react/AGENTS.md),
  [packages/ui-react/context/conventions.md](../../../packages/ui-react/context/conventions.md)
- ui-legacy (the source): [packages/ui-legacy/AGENTS.md](../../../packages/ui-legacy/AGENTS.md),
  [packages/ui-legacy/context/conventions.md](../../../packages/ui-legacy/context/conventions.md),
  [packages/ui-legacy/context/theming.md](../../../packages/ui-legacy/context/theming.md)
- ui-spec: [packages/ui-spec/AGENTS.md](../../../packages/ui-spec/AGENTS.md)

**Reference implementations to copy patterns from:**
`packages/ui-react/src/components/ui/button/` and
`packages/ui-spec/components/button/`. For a composable, multi-part component,
`…/breadcrumb/` is the worked example. The **legacy** source you port from lives
under `packages/ui-legacy/src/components/ui/<legacy-name>/`.

---

## Invocation

```
/legacy-component <ComponentName> [legacy-name] [--update]
```

| Arg             | Meaning                                                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ComponentName` | PascalCase React name for the **new** ui-react component (`Switch`, `Tabs`). kebab files.                                                                                   |
| `legacy-name`   | kebab name of the source under `ui-legacy/src/components/ui/` if it differs from the new component's kebab name (e.g. `dropdown-menu`). Defaults to `kebab(ComponentName)`. |
| `--update`      | Component already exists in ui-react — refresh it against the legacy source.                                                                                                |

If the new ui-react name and the legacy kebab name match (most cases), omit
`legacy-name`.

---

## Phase 0 — Readiness gate (prerequisite)

Same gate as `/figma-component`. Run the read-only
[`/component-readiness`](../component-readiness/SKILL.md) audit before writing
anything; it catches the silent failures this recipe is most exposed to — dead
`var(--ui-*)` refs and un-imported token tiers (Phase 2).

```bash
bash .claude/skills/component-readiness/scripts/audit.sh <ComponentName>   # or `all`
```

- **New component:** run it on `all` (or skip — there's nothing for the new
  component to audit yet) to confirm you're not building alongside pre-existing
  drift. A draft component legitimately reports `INCOMPLETE` (no Figma node, no
  `COMPLETE` Code Connect) — that's expected here, **not** a blocker.
- **`--update`:** run the gate on that component first. A `DRIFT` verdict means
  the update must include the token rewire, not just the legacy re-port.

---

## Phase 1 — Read the legacy source (instead of a Figma node)

Locate the source. **The legacy layout is mixed** — despite what
`ui-legacy/AGENTS.md` describes, many components are **flat files** with their
stories/tests in **shared** `__stories__/` / `__tests__/` directories, not in a
per-component folder. Find all the pieces both ways:

```bash
# the component (flat file OR folder)
ls packages/ui-legacy/src/components/ui/<legacy-name>.tsx \
   packages/ui-legacy/src/components/ui/<legacy-name>/ 2>/dev/null
# its story / test (shared dir OR co-located) + an optional docs companion
find packages/ui-legacy/src/components/ui -iname "<legacy-name>.stories.tsx" \
  -o -iname "<legacy-name>.test.tsx" -o -iname "<legacy-name>.docs.ts"
```

(A component may have **no** test in legacy — `card` has only a story. That's
fine; you still author a fresh ui-react test in Phase 3.)

Read, in this order:

1. **`<legacy-name>.tsx`** — the implementation. Extract:
   - **Variants & sizes** — the `cva` keys (`variant`, `size`, …). These become
     the ui-react `cva` keys and the spec's `api.yaml` enums verbatim where they
     still make sense; rename only with a stated reason.
   - **Parts** — for a composable component, every exported sub-component
     (`Card`, `CardHeader`, `CardTitle`, …). Each becomes a ui-react part and a
     `anatomy.parts[]` entry.
   - **Props** — the prop interface (HTML attrs extended, booleans, callbacks,
     content/children). Drives `api.yaml` and the story `argTypes`.
   - **States** — which classes are pseudo-states (`hover:`, `active:`,
     `focus-visible:`, `disabled:`, `data-[open]:`) vs. real props.
   - **Composition** — does it use Radix `Slot`/`asChild`? Which `@radix-ui/*`
     or `@base-ui/react` primitive does it wrap? (Mapped in Phase 2.)
2. **`__stories__/<legacy-name>.stories.tsx`** — the canonical demos and which
   variants/states matter enough to picture. Mirror these as the hand-written
   ui-react stories.
3. **`__tests__/<legacy-name>.test.tsx`** — the behaviors worth asserting (roles,
   variant classes, ref, events). Port the intent, not the literal `--av-*`
   class assertions.
4. **`<legacy-name>.docs.ts`** if present — a curated prop/type summary.

Write down the variant/size/part/prop/state inventory before coding — it is the
same artifact `/figma-component` Phase 1 captures from the design, just sourced
from code.

> **Adapt, don't transliterate.** Legacy components are shadcn/Radix-era. Port
> the _contract and behavior_; rebuild the _implementation_ to ui-react
> conventions (Base UI, `--ui-*`, `useRender`). Drop legacy-only baggage
> (`asChild`, `--av-*`, opacity-modifier color hacks like `bg-primary/90`).

---

## Phase 2 — Map legacy → tokens & primitives (decide before coding)

This is the phase that differs most from `/figma-component`. Two translations:
**styling** (legacy `--av-*` / bridged names → ui-react `--ui-*`) and
**composition** (Radix → Base UI).

### 2a. Tokens

ui-react colors must resolve to a generated `--ui-*` token from
`@acronis-platform/tokens-pd`. **Never** reference `--av-*` (that's the legacy
prefix) and **never** hand-author hex/hsl. Pick the token tier in this order:

1. **Component-specific tier, if it already exists.** Check first:

   ```bash
   ls packages/tokens-pd/css/<ComponentName>/ 2>/dev/null && \
     grep -rn "<component>" "packages/tokens-pd/css/<ComponentName>/acronis.css" | head
   ```

   If a `--ui-<name>-*` tier exists (e.g. a token sync already shipped it),
   prefer it — reference the tokens directly with arbitrary values
   (`bg-[var(--ui-<name>-...-idle)]`, `hover:…`) exactly like Button, and add
   its `@import` line to `src/styles/index.css` (see the opt-in note below).

2. **Semantic / primitive tokens (the common case here).** With no Figma
   mockup, most ported components have **no** component tier yet. Map the
   legacy styling onto the **shared semantic vocabulary** instead. This is
   cheap because legacy and ui-react use the **same bridged Tailwind names** —
   so much of the legacy `className` carries over unchanged. Both bridges
   resolve to `--ui-*` (legacy → `--av-*`; ui-react → `--ui-*`), so keep the
   short name and let ui-react's `@theme inline` block do the rest:

   | Bridged Tailwind name (legacy **and** ui-react)  | ui-react `--ui-*` it resolves to (`src/styles/index.css`)              |
   | ------------------------------------------------ | ---------------------------------------------------------------------- |
   | `bg-background`                                  | `--ui-background-surface-primary`                                      |
   | `text-foreground`                                | `--ui-text-on-surface-primary`                                         |
   | `bg-primary` / `text-primary-foreground`         | `--ui-background-brand-primary` / `--ui-glyph-on-brand-primary`        |
   | `bg-secondary` / `text-secondary-foreground`     | `--ui-background-brand-secondary` / `--ui-glyph-on-brand-secondary`    |
   | `bg-destructive` / `text-destructive-foreground` | `--ui-background-status-danger` / `--ui-glyph-on-status-danger`        |
   | `bg-muted` / `text-muted-foreground`             | `--ui-background-surface-secondary` / `--ui-text-on-surface-secondary` |
   | `bg-accent` / `text-accent-foreground`           | `--ui-background-surface-hover` / `--ui-text-on-surface-primary`       |
   | `border-border` / `border-input`                 | `--ui-border-on-surface-border`                                        |
   | `ring-ring`                                      | `--ui-border-on-surface-border-active`                                 |

   > **Verify every bridged name actually exists in ui-react before reusing it.**
   > Legacy bridges some names that ui-react's `@theme inline` block does **not**
   > — e.g. legacy `bg-card` / `text-card-foreground` have **no** ui-react
   > equivalent, so reusing them yields `background-color: var(--color-card)`
   > with `--color-card` undefined → a **silent** invalid property (the same
   > failure mode as a dead `--ui-*`). The bare Tailwind `border` utility is
   > similar — it picks up a default border color in legacy but renders
   > transparent/`currentColor` in ui-react, so always write `border-border`
   > explicitly. Grep the bridge before trusting a name:
   > `grep -oE '\-\-color-[a-z-]+' packages/ui-react/src/styles/index.css | sort -u`.
   > A name not in that list must be remapped to one that is (a card surface →
   > `bg-background`; card text → `text-foreground`) or bridged anew. (Worked
   > example: `card` ported `bg-card`→`bg-background`,
   > `text-card-foreground`→`text-foreground`, bare `border`→`border border-border`.)

   For any legacy color that uses a **raw `--av-*` arbitrary value** or an
   opacity hack (`bg-primary/90`, `bg-accent/10`) with no bridged equivalent,
   pick the nearest semantic `--ui-*` token by **role** — browse the available
   names and choose by intent (a hover surface → `--ui-background-surface-hover`,
   a danger fill → `--ui-background-status-danger`), don't invent a value:

   ```bash
   grep -oE '\-\-ui-[a-z-]+' packages/tokens-pd/css/acronis.css | sort -u   # semantic vocabulary
   ```

   If a shared color you need isn't bridged yet, add it to the `@theme inline`
   block in `src/styles/index.css` (don't reference a one-off `--ui-*` inline
   if it's genuinely shared).

3. **Don't invent a component tier.** If a port really needs per-component
   tokens that don't exist, those belong upstream in
   `@acronis-platform/design-tokens` → rebuild `tokens-pd`. For a design-pending
   v1, **prefer staying on semantic tokens** and flag to the user that the
   component-specific palette is pending a Figma/token pass — don't hand-author
   it here.

Wire **each interaction state to its own token** (`hover:` → `*-hover`,
`disabled:` → `*-disabled`) — never an opacity modifier on the idle color
(legacy's `bg-primary/90` is exactly the pattern to drop). Brand overrides only
honor the referenced token.

> **tokens-pd component tiers are opt-in.** If you do use an existing
> `--ui-<name>-*` tier, add one `@import '@acronis-platform/tokens-pd/css/<Name>/acronis.css';`
> to `src/styles/index.css` or the component renders unstyled. A component built
> on semantic tokens only needs no new import (the semantic tier is always loaded).

> **On `--update`, re-verify every token ref against the _current_ tokens-pd.**
> A missing CSS var is a **silent** failure — `var(--does-not-exist)` makes the
> property invalid and the element falls back to inherited color; nothing fails
> the build, typecheck, or lint:
> `for t in $(grep -oE 'ui-[a-z-]+' packages/ui-react/src/components/ui/<name>/<name>.tsx | sort -u); do grep -qrF -- "--$t" packages/tokens-pd/css/ && echo "OK $t" || echo "MISS $t"; done`
> The **spec** (`tokens.yaml`) and the **tests** pin token names too — drift them together.

### 2b. Composition (primitive mapping)

Translate the legacy primitive to the ui-react convention:

- **Radix `Slot` / `asChild`** (legacy polymorphism) → Base UI **`useRender` +
  `mergeProps`** with a `render` prop. **Never** add `@radix-ui/react-slot` or
  `asChild` to ui-react.
- **A `@radix-ui/react-*` stateful primitive** (dialog, menu, switch, tooltip,
  popover, …) → wrap the **`@base-ui/react`** equivalent. Check it exists:
  `ls node_modules/@base-ui/react/`. Read the primitive's `.d.ts` for the real
  forwarded props (they differ from Radix — don't assume).
- **No Base UI primitive** (e.g. breadcrumb, card) → build semantic HTML +
  `useRender` for the polymorphic parts, exactly like the breadcrumb reference.

### 2c. Icons

Same as `/figma-component`. Use `@acronis-platform/icons-react/<pack>` (usually
`stroke-mono`); confirm the icon exists before importing
(`ls packages/icons-react/src/packs/stroke-mono/icons | grep -i <name>`). Names
are `PascalCase(asset) + Icon`; pass `size={16}` for 16px icons.

---

## Phase 3 — Implement in packages/ui-react

Identical to `/figma-component` Phase 3. Create
`packages/ui-react/src/components/ui/<name>/`:

```
<name>.tsx
<name>.figma.tsx          # Code Connect — NEEDS_FIGMA_URL skeleton (see below)
index.ts
__tests__/<name>.test.tsx
__stories__/<name>.stories.tsx
__stories__/<name>.generated.stories.tsx   # produced in Phase 4
```

Conventions (mirror Button): `React.forwardRef` + `displayName`; prop interface
extends the right HTML attrs (or the Base UI primitive's props) + `VariantProps`
when using `cva`; `cva` for `variant`/`size` merged with `cn()`; polymorphism via
`useRender({ render, ref, defaultTagName, props: mergeProps<'tag'>({…}, props) })`.
Export everything from `index.ts`, then add an alphabetical line to
`src/index.ts`. For a composable component, export the full set of parts.

**Figma Code Connect — deferred.** Because there's no "ready for dev" node yet,
the `.figma.tsx` carries the **`NEEDS_FIGMA_URL`** status marker (props are
mapped correctly from the legacy contract; the node URL is a placeholder). Write
the `figma.connect(Component, 'FIGMA_NODE_URL', { props, example })` with the
real prop mappings you derived in Phase 1, leave the URL as the placeholder, and
set the header status comment to `NEEDS_FIGMA_URL` (see
[context/figma-code-connect.md](../../../packages/ui-react/context/figma-code-connect.md)).
Do **not** run `figma:connect` against a placeholder URL expecting it to pass —
it validates structure, not the (absent) connection. The real URL + `COMPLETE`
status land later via `/figma-component <Name> <url> --update`.

---

## Phase 4 — Spec in packages/ui-spec (7-file format)

Identical to `/figma-component` Phase 4, with two draft-status adjustments.
Create `packages/ui-spec/components/<name>/`. If a legacy spec exists at
`@uikit/ui-kit/packages/specs/components/<name>`, use it as a content source but
**adapt to the React reality** (legacy specs describe the Vue API).

| File               | Notes                                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.yaml`       | `component` PascalCase, `name` kebab, **`status: draft`**, `category`, `since`. **Omit the `figma:` block** (no node yet — it's optional in the schema). |
| `anatomy.yaml`     | `root` (element/role), `parts` (each id used in the `schematic`!), `layout`, `states`.                                                                   |
| `api.yaml`         | `contract` (properties/events/content/methods) + `adapters` (react `implemented`; vue/web-components `planned`).                                         |
| `tokens.yaml`      | **Names only**, `^--ui-…$`. The semantic `--ui-*` tokens you mapped in Phase 2 (and any existing component tier). No values/defaults.                    |
| `behavior.md`      | Given/When/Then scenarios (port from the legacy tests/stories).                                                                                          |
| `accessibility.md` | ARIA, keyboard, screen reader, contrast.                                                                                                                 |
| `README.md`        | When to use / not use, examples, parts table. Note it's a design-pending v1.                                                                             |

Hard rules enforced by `__tests__/specs.test.ts` (unchanged):

- Every `parts[].id` must appear as a substring in `anatomy.schematic`.
- A `states[]` entry with `kind: prop` must reference a real `api.yaml` property;
  `kind: pseudo` needs a `pseudo` selector; `kind: internal` needs an
  `internal_state[]` entry. Structural distinctions are **parts, not states**.
- For `cva` components, `api.yaml` `variant`/`size` enums must equal the actual
  `cva` keys in the ui-react source (conformance test).

Validate continuously: `pnpm --filter @acronis-platform/ui-spec test`.

**Generate the states story** (don't hand-write `.generated`):
`pnpm --filter @acronis-platform/ui-spec generate:stories`. A **composable /
multi-part component renders empty** (just `<Name />`) unless you give it a
`RENDER` hint in `packages/ui-spec/scripts/generate-stories.ts` — an
`extraImports` line importing the sub-parts and a `sample` string composing them.
This is a deliberate edit to the **spec tooling**, outside the component dir; do
it before generating. (Worked examples: the `breadcrumb` and `card` entries — a
component with no `variant`/`size`/`checked`/`disabled` lands in the generator's
final `States` branch and just wraps your `sample` in `<Name>…</Name>`.)

> **`generate:stories` rewrites _every_ component's `.generated.stories.tsx` in
> raw, unformatted JSX** — and the committed copies were Prettier-formatted by
> lint-staged on their original commit. So a run leaves the whole set looking
> "modified" with whitespace-only diffs. Two cleanups: **(1)** `prettier --write`
> your new component's generated file (or just let the pre-commit hook format it),
> and **(2)** `git checkout --` the unrelated siblings the run touched — don't
> sweep their formatting churn into your change. Confirm with
> `git status packages/ui-react/src/components/ui/*/__stories__/*.generated.stories.tsx`.

Hand-write `<name>.stories.tsx`
for the rich demo stories, mirroring `button.stories.tsx` and the legacy stories
you read in Phase 1.

**Wide `argTypes` (required).** The hand-written `meta.argTypes` must expose a
control for **every meaningful prop** — enumerate the real props from the
component source (`cva` keys, booleans, content props, callbacks, `render`).
Control by kind (`select` w/ exact options for unions, `boolean`, `text`,
`number`; `control: false` for callbacks/`render`/element-only). Every entry
carries a `description` + `table: { type, category }`. Preview toolbars (brand,
light/dark, direction, locale) come for free; add a `Localized` story only when a
locale-/RTL-sensitive demo is worth a baseline (add keys to `.storybook/i18n.ts`
for all six locales). **VR safety:** don't change what an existing story renders.

---

## Phase 5 — Document in apps/docs (components section)

Add a documentation page so the new component shows up in the docs site's
**Components** section in the same style as every other ui-react page. Three
pieces: a **live demo**, an **MDX page**, and a **nav entry**.

> **The docs `AGENTS.md` is stale on this point.** It says "ui-react has no live
> demos" — that's no longer true. Essentially every ui-react component page now
> renders a live demo via `<DemoReact>`, which mounts the component inside a
> **shadow root** (`src/components/ShadowDemo.tsx`) that adopts ui-react's
> stylesheet from `/api/ui-react-css` — sidestepping the RSC alias problem the
> note describes. Follow the live-demo pattern below; don't fall back to static-
> only pages.

**1. Live demo** — `apps/docs/src/components/demos-react/<name>.tsx`:

- `'use client'` at the top (the demo uses ui-react's client components).
- Import the component(s) from `@acronis-platform/ui-react` (and icons from
  `@acronis-platform/icons-react/<pack>`), and `export function <Name>Demo()`
  rendering a representative composition — mirror the hand-written story.
- **Network-free**, same rule as the VR stories ([[vr-stories-no-network]]): no
  remote images; data-URI/local only.
- If the component has **portaled overlays** (menu/select/tooltip popups), read
  `useShadowMount()` and pass it as the primitive's `portalContainer` so the
  popup inherits the shadow root's styles (see `demos-react/input-select.tsx`).

**2. MDX page** — `apps/docs/content/docs/components/<name>.mdx`. Mirror an
existing page (`breadcrumb.mdx` for a compound component, `card-filter.mdx` for a
single one):

````mdx
---
title: <Name> # PascalCase
description: <one line> # reuse the spec index.yaml description
---

import { DemoReact } from "@/components/DemoReact";
import { <Name>Demo } from "@/components/demos-react/<name>";

## Usage

\`\`\`tsx
import { <Name> } from '@acronis-platform/ui-react';
\`\`\`

<prose: what it is, the parts, polymorphism via the `render` prop, which tokens
theme it — note it's a design-pending v1 if useful>

## Examples

<DemoReact>
  <<Name>Demo />
</DemoReact>

<one fenced ```tsx``` block per meaningful example, mirroring the hand stories>

## API Reference

<AutoTypeTable
  path="../../packages/ui-react/src/components/ui/<name>/<name>.tsx"
  name="<Name>Props"
/>
````

- `<AutoTypeTable>` is a **global** MDX component — do **not** import it. Its
  `path` is **relative to `apps/docs/`** (`../../packages/ui-react/...`), unlike
  `DemoPreview` paths. `name` is an **exported** prop interface.
- **Compound component:** emit one `<AutoTypeTable>` per distinct exported props
  interface, then a sentence covering the parts that just take native element
  attributes (see `breadcrumb.mdx`). When several parts **share one** interface
  (e.g. Card's `CardPartProps`), one table + a sentence ("all parts accept …")
  is enough.
- If `AutoTypeTable` can't resolve a type (re-exported Base UI props, complex
  generics, a part with no own interface), add a `.docs.ts` companion next to the
  component source and point `path` at that instead.

**3. Nav entry** — add `"<name>"` to the `pages` array in
`apps/docs/content/docs/components/meta.json`, under the right `---Section---`
divider (`Buttons & Actions`, `Inputs & Forms`, `Data Display`,
`Navigation & Layout`, `Overlays`). Pick by category; add a new divider only if
none fits.

**Verify the docs build** (no test suite here — it's build-verified):

```bash
pnpm --filter @acronis-platform/uikit-docs typecheck   # demo .tsx compiles
pnpm --filter @acronis-platform/uikit-docs build       # MDX + AutoTypeTable resolve, page renders
```

A broken `AutoTypeTable` `path`/`name` or a missing demo import fails the build,
not typecheck — so run the build.

> **Live demos need ui-react's _compiled_ CSS — already handled, but know why.**
> `<DemoReact>` mounts the demo in a shadow root that adopts ui-react's compiled
> `dist/ui-react.css` (served by `/api/ui-react-css`), a **gitignored** artifact.
> `apps/docs` has `predev`/`prebuild` hooks that run `pnpm --filter @acronis-platform/ui-react build`
> first, so `uikit-docs dev`/`build` regenerate it automatically (≈1.5s) — replicate
> that if you ever run Next directly, or the previews render unstyled. **Corollary
> for the demo file:** the shadow root adopts _only_ that compiled sheet, which is
> Tailwind-built from ui-react's own source — so a demo may only use utility classes
> ui-react itself ships. A class used solely in the demo (never by a shipped
> component or its story) is tree-shaken out and silently no-ops in the preview;
> prefer inline `style={{…}}` for one-off demo layout.

---

## Phase 6 — Verify & changeset

Identical to `/figma-component` Phase 5.

```bash
pnpm --filter @acronis-platform/ui-react test
pnpm --filter @acronis-platform/ui-react typecheck
pnpm --filter @acronis-platform/ui-react lint
pnpm --filter @acronis-platform/ui-react build      # confirms exports bundle, .figma.tsx excluded
pnpm --filter @acronis-platform/ui-spec test
pnpm -r typecheck                                   # what the pre-commit hook runs
```

Add a changeset for the **published** package only (`ui-react`): `minor` for a
**new** component, `patch` for an **update**. `ui-spec` is private (0.0.0); no
changeset:

```
.changeset/<name>-component.md
---
'@acronis-platform/ui-react': minor   # or: patch (update)
---
Add `<Name>` (initial version ported from ui-legacy; design reconciliation pending).
```

**Visual regression.** Stories are VR cases; CI runs a **light _and_ dark**
matrix, so every story has **two** baselines (`<id>.png` and `<id>--dark.png`).
Regenerate **both** in Docker and review the PNGs before committing:

```bash
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:update:all  # regenerate light + dark
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:all         # check both (what CI runs)
```

When you **remove or rename** a story, delete BOTH its baselines. Never commit
baselines rendered on macOS/Windows — they won't match CI's Linux renderer. (See
the `/figma-component` Phase 5 notes for the single-mode variants and the
"zero PNGs rewritten on `--update`" case.)

---

## Output checklist (done = all green)

- [ ] `src/components/ui/<name>/<name>.tsx` — Base UI + `--ui-*` tokens
      (component tier if it exists, else semantic/primitive), **no `--av-*`, no hex**.
- [ ] `index.ts` + alphabetical export line in `src/index.ts`.
- [ ] If an existing `--ui-<name>-*` tier is used: `@import` added to `src/styles/index.css`.
- [ ] `__tests__/<name>.test.tsx` — render, variants/states, a11y roles, ref,
      `render`-prop composition (intent ported from the legacy tests).
- [ ] `__stories__/<name>.stories.tsx` (hand) + `<name>.generated.stories.tsx`.
- [ ] VR baselines regenerated in Docker for **both** light and dark and reviewed;
      both `<id>.png` and `<id>--dark.png` committed (orphans deleted).
- [ ] `<name>.figma.tsx` — `NEEDS_FIGMA_URL` skeleton with real prop mappings, placeholder URL.
- [ ] `packages/ui-spec/components/<name>/` — 7 files, **`status: draft`**, no
      `figma:` block, `ui-spec test` green.
- [ ] `apps/docs`: `src/components/demos-react/<name>.tsx` (live demo) +
      `content/docs/components/<name>.mdx` (Usage / Examples / API Reference) +
      `meta.json` nav entry; `uikit-docs build` passes.
- [ ] Changeset for `@acronis-platform/ui-react`.
- [ ] test / typecheck / lint / build all pass; `pnpm -r typecheck` clean.
- [ ] User told this is a design-pending v1 — reconcile with `/figma-component
<Name> <url> --update` once mockups exist.

---

## What this skill deliberately does NOT do

- **No Figma reads.** No `get_design_context` / `get_variable_defs` /
  `get_context_for_code_connect`. The source of truth is legacy code.
- **No `COMPLETE` Code Connect** and **no `figma:` block in the spec.** Those
  require a real node; they're filled in by `/figma-component --update` later.
- **No hand-authored component token palette.** When semantic tokens don't
  cover a need, flag it for an upstream `design-tokens` pass — don't guess
  per-component hex values to "match" the legacy look pixel-for-pixel.

---

## Worked example: porting a simple variant component (Button-shaped)

Suppose `<Name>` has no Figma node and no `--ui-<name>-*` tier yet:

1. **Read** `ui-legacy/src/components/ui/<name>/<name>.tsx`: `cva` with
   `variant: { default, outline, ghost }`, `size: { sm, default, lg }`, uses
   `asChild` via Radix `Slot`, classes like
   `bg-primary text-primary-foreground hover:bg-primary/90` and
   `border border-border bg-background hover:bg-accent/10`.
2. **Map tokens:** `bg-primary`/`text-primary-foreground` carry over as-is (both
   bridges resolve to `--ui-background-brand-primary` / `--ui-glyph-on-brand-primary`).
   Replace the opacity hack `hover:bg-primary/90` with the brand hover token
   `hover:bg-secondary` (→ `--ui-background-brand-secondary-hover` family) or the
   nearest semantic hover surface; replace `border-border` → keep (`--ui-border-on-surface-border`),
   `hover:bg-accent/10` → `hover:bg-accent` (`--ui-background-surface-hover`).
3. **Map composition:** drop `Slot`/`asChild`; add a `render` prop via
   `useRender` + `mergeProps`.
4. **Implement** the component, tests, stories; write the `NEEDS_FIGMA_URL`
   `.figma.tsx`; write the 7-file spec with `status: draft` and no `figma:` block;
   add the `apps/docs` page (demo + MDX + nav) and confirm `uikit-docs build`;
   regenerate light+dark VR baselines; add a `minor` changeset.
