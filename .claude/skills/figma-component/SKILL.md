---
name: figma-component
description: >
  Bring a "ready for dev" component from Figma into the Acronis UI Kit, or
  update an existing one. Drives the full recipe: read the Figma node, map it
  to Base UI + --ui-* tokens, implement in packages/ui-react (component, tests,
  stories, Figma Code Connect), and write/refresh its framework-agnostic spec in
  packages/ui-spec. Invoke with /figma-component <ComponentName> <figma-url>.
---

# Figma → ui-react component

A concrete, repeatable recipe for landing a single component from Figma into
this repo. It produces the **same shape of output** the Button and Breadcrumb
components already have. Use it for new components and for updates.

Read the workspace contracts first — they override anything here on conflict:

- Root: [AGENTS.md](../../../AGENTS.md), [context/conventions.md](../../../context/conventions.md)
- ui-react: [packages/ui-react/AGENTS.md](../../../packages/ui-react/AGENTS.md),
  [packages/ui-react/context/conventions.md](../../../packages/ui-react/context/conventions.md),
  [packages/ui-react/context/figma-code-connect.md](../../../packages/ui-react/context/figma-code-connect.md)
- ui-spec: [packages/ui-spec/AGENTS.md](../../../packages/ui-spec/AGENTS.md)

**Reference implementation to copy patterns from:**
`packages/ui-react/src/components/ui/button/` and
`packages/ui-spec/components/button/`. For a composable, multi-part component,
`…/breadcrumb/` is the worked example.

---

## Invocation

```
/figma-component <ComponentName> <figma-url> [--update]
```

| Arg             | Meaning                                                                |
| --------------- | ---------------------------------------------------------------------- |
| `ComponentName` | PascalCase React name (`Breadcrumb`, `Tooltip`). Files are kebab-case. |
| `figma-url`     | A **node-specific** Figma URL (`…?node-id=1017-2852`).                 |
| `--update`      | Component already exists — refresh it against the current design.      |

Parse the URL: `figma.com/design/:fileKey/…?node-id=1017-2852` →
`fileKey=lrU3ydIyvPYQNE6ixdsKtJ`, `nodeId=1017:2852` (convert `-` to `:`).

---

## Phase 0 — Readiness gate (prerequisite)

Before reading the design, run the [`/component-readiness`](../component-readiness/SKILL.md)
gate. It is **read-only** and catches the silent failures this recipe is most
exposed to — dead `var(--ui-*)` refs and un-imported token tiers (see Phase 2).

```bash
bash .claude/skills/component-readiness/scripts/audit.sh <ComponentName>   # or `all`
```

- **`--update` an existing component:** run the gate on **that component first**.
  A `DRIFT` verdict means the update must include the token rewire (dead names →
  current `tokens-pd` tier, missing `@import` in `styles/index.css`), not just the
  design refresh. Don't layer new work on a silently-broken baseline.
- **New component:** run it on `all` (or skip — there's nothing to audit yet) to
  confirm you're not about to build alongside pre-existing drift you'd be blamed
  for. `INCOMPLETE`/`READY` are fine to proceed on; resolve any `DRIFT` rows or
  flag them to the user.

This gate fills the issue-#297 gap: `ui-spec test` validates token-name _shape_
but never that the names _exist_ in `tokens-pd`, so drift otherwise passes CI.

### tokens-pd freshness

Before reading the design, confirm `tokens-pd` is built from the current
`design-tokens`. We can rebuild it ourselves; the upstream JSON in
`design-tokens` is owned by the design team and must not be edited.

```bash
pnpm --filter @acronis-platform/tokens-pd build
git diff --stat packages/tokens-pd/
```

If `git diff` shows changes, `tokens-pd` was stale — commit the rebuilt output
so the component work targets the latest tokens. If no diff, tokens-pd is
already current.

---

## Phase 1 — Read the design (Figma MCP)

Call these (no skill prerequisite for reads):

1. `get_design_context({ nodeId, fileKey })` — reference markup + screenshot.
   Identify states, the part structure, and which layers are icons/instances.
2. `get_variable_defs({ nodeId, fileKey })` — returns the design variables
   **the node uses**, as `name → value` pairs. **Discard every resolved value
   immediately.** Extract only the variable **names** (the
   `component/<X>/<Y>/<Z>` paths) — these are an inventory of what the
   design references. Each name maps to a `--ui-*` token in Phase 2; the
   token's value comes from `tokens-pd`, never from this response.

   > **Why not use the values?** `get_variable_defs` returns resolved
   > hex/number literals (e.g. `#063679`, `999`). These bypass the
   > `design-tokens → tokens-pd` pipeline and make the component ignore
   > upstream token changes. The pipeline — owned by the design team —
   > is the single source of truth.

   **Caveat:** the Figma MCP is **selection-bound** in this setup — both
   the figma-console Desktop Bridge and the official `mcp__figma__*` Dev
   Mode server reject reads with "You currently have nothing selected"
   even when you pass a valid `nodeId`/`fileKey`. The node must be
   **selected in the Figma desktop app**: ask the user to open the node
   URL in desktop and click the layer, then retry.

3. `get_context_for_code_connect({ nodeId, fileKey })` — **exact** Figma
   property names + variant options. Use this to write Code Connect; never
   guess property names.

### Context frame (portal/overlay components only)

If the target composes a portal/overlay Base UI primitive — Dialog, Popover,
Menu, Tooltip, Toast, Drawer/Sheet, or anything else that renders backdrop,
anchor, or viewport-relative chrome — **the target node alone is not enough.**
Figma commonly documents that shared chrome's contract on an **ancestor**
frame wrapping the component preview (e.g. a dialog's backdrop scrim +
viewport edge-inset, a popover's anchor offset + collision padding, a toast's
safe-area offset + stack gap), not on the content node itself. Reading only
the node you were handed makes that layer invisible — not rejected, just
never seen.

- Call `get_metadata` one level up from the target `nodeId` (the parent, and
  its parent if still ambiguous).
- **Real requirement vs. canvas organization:** an ancestor only matters if it
  has its own fill/padding/effects. If it's an empty grouping frame or a
  label-only artboard, ignore it. If it has real styling, read it with
  `get_design_context` too and extract the structural facts: backdrop
  color/opacity, edge margin/inset, anchor offset + collision padding,
  stacking gap, safe-area.
- These facts almost always resolve to **generic/semantic tokens** already
  used by an existing shared primitive (e.g. `--ui-background-backdrop-screen`
  on `DialogOverlay`) — which is exactly why they're easy to miss: Phase 2's
  token gate only checks that a token _resolves_, not that the _structural
  behavior_ it's part of (an edge-inset, a collision-padding prop) is actually
  implemented anywhere. Carry these facts into Phase 2's parity check below.

Write down, from the design:

- **Variants / states.** Which are real props (map to `variant`/`size`/
  `disabled`) vs. pure interaction states (`:hover`, `:active`,
  `:focus-visible`) vs. structural (e.g. "current page" = a different part).
- **The design variable names** (from `get_variable_defs`). Each
  `component/<x>/<y>` name must map to a `--ui-<x>-<y>` token that
  **exists in `tokens-pd`** — if it doesn't, Phase 2 will hard-stop.
  Never record or use the resolved values alongside these names.

> A node may be a single item even if the frame shows a full assembly (the
> breadcrumb node `1017:2852` is one item with a `state` variant, not the whole
> trail). Confirm via `get_context_for_code_connect`.

---

## Phase 2 — Map design → tokens & primitives (decide before coding)

**Tokens.** Color/spacing must resolve to a generated `--ui-*` token from
`@acronis-platform/tokens-pd`. Check it exists:

```bash
grep -rn "<component>" packages/tokens-pd/css --include="*.css" -i
```

- If the tokens exist (e.g. `--ui-breadcrumb-link-label-color-idle`), reference
  them directly: `text-[var(--ui-breadcrumb-link-label-color-idle)]`, `hover:…`, etc.
- If a **shared** color is missing, bridge a Tailwind name in
  `packages/ui-react/src/styles/index.css` (`@theme inline`).
- If **component-specific** tokens are missing entirely, they belong upstream
  in `@acronis-platform/design-tokens` (owned by the design team — we never
  edit `tiers/*.json`). **Do not hand-author hex values** in the component.
  Escalate to the design team; once they ship the update in Figma, the token
  sync (run outside this monorepo, from the standalone `acronis-tokens-updater`
  project) pulls it into `tiers/*.json` — then rebuild `tokens-pd`.

### Hard gate — tokens-pd resolution (mandatory)

For **every** variable name from Phase 1's `get_variable_defs` inventory,
convert it to its `--ui-*` form and confirm it exists in tokens-pd:

```bash
for name in <list-of-figma-variable-names>; do
  token="--ui-$(echo "$name" | sed -E 's|^components?/||; s|_global/|global-|g' \
    | tr '/' '-' | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')"
  grep -rqF -- "$token" packages/tokens-pd/css/ && echo "OK  $token" || echo "MISS $token"
done
```

**If any token is `MISS`:**

- **Do NOT proceed to Phase 3.**
- **Do NOT fall back to the Figma resolved value.**
- Report the missing token(s) to the user. The token must be added by
  the **design team** in Figma (we never edit `tiers/*.json`).
  Once they ship the update and the token sync (run outside this monorepo) has
  landed it in `tiers/*.json`, rebuild `tokens-pd` and re-run the gate.
- The skill resumes only after the missing tokens exist in `tokens-pd`.

> ⛔ **No fallback rule.** If a design variable has no matching `--ui-*`
> token in tokens-pd, escalate to the design team (they own
> `design-tokens`) — **never** hardcode the Figma value in the component.
> `tokens-pd` is the single source of truth; we can rebuild it but never
> author the upstream JSON.
>
> Rebuilding `tokens-pd` alone won't pick up a new Figma variable — it only
> reads what's already in `tiers/*.json`. Token syncing (Figma → `tiers/*.json`)
> happens outside this monorepo, in the standalone `acronis-tokens-updater`
> project; it has to land there first, then rebuild.

Wire **each interaction state to its own token** (`hover:` → `*-hover`,
`disabled:` → `*-disabled`) even when the idle value happens to match — brand
overrides only honor the referenced token.

> **On `--update`, re-verify every token ref against the _current_ tokens-pd.**
> A missing CSS var is a **silent** failure — `var(--does-not-exist)` makes the
> property invalid and the element falls back to inherited color; nothing fails
> the build, typecheck, or lint. A token sync can
> rename tokens out from under a shipped component, leaving it referencing dead
> names. So when updating, grep each ref and confirm it still resolves:
> `for t in $(grep -oE 'ui-[a-z-]+' src/components/ui/<name>/<name>.tsx | sort -u); do grep -qF -- "--$t" packages/tokens-pd/css/<Tier>/default.css && echo "OK $t" || echo "MISS $t"; done`
> Don't forget the **spec** (`ui-spec/components/<name>/tokens.yaml` +
> `anatomy.yaml`) and the **tests** — both pin token names and drift the same way.
> (Worked example: the 2025-06 next-gen sync renamed `--ui-breadcrumb-link` →
> `--ui-breadcrumb-link-label-color-idle`; the component kept the old name and
> rendered links uncolored until re-themed.)

> **tokens-pd component tiers are opt-in.** `src/styles/index.css` imports the
> semantic tier (`css/default.css`) plus one `@import '…/css/<component>/default.css'`
> per shipped component. A new component with its own tier (`--ui-<name>-*`) will
> render **unstyled** until you add its tier import there. Verify the token is
> defined: `grep -rn "<name>" packages/tokens-pd/css/<name>/default.css`.

### Shared-chrome parity check (portal/overlay components only)

The token-resolution gate above only proves a `--ui-*` name **exists** — it
says nothing about whether the **structural behavior** it's part of is
actually implemented. A generic token used on shared chrome (a backdrop
color, a viewport edge-inset) will pass that gate trivially if it's already
wired into some _other_ component, even if the specific feature you need is
missing everywhere.

For every structural fact captured in Phase 1's "Context frame" step, grep
the actual **shared primitive source** — not the new component you're about
to write — for a real implementation of it:

```bash
grep -n "inset\|backdrop\|collision\|offset\|safe-area" \
  packages/ui-react/src/components/ui/<primitive>/<primitive>.tsx
```

- **Found** → the shared primitive already handles it; your new component
  gets it for free by composing that primitive. Nothing to add.
- **Missing** → this is a **primitive-level gap**, not something to patch
  inside the new component. Fix it once in the shared file (its own
  changeset, since it improves every consumer), then compose it as normal.
  Do not hardcode the missing behavior locally — that fixes one component and
  leaves every other consumer of the same primitive still wrong.

> **Worked example.** `DialogWelcome`'s Figma frame (`variant=carousel`,
> node `6353:6164`) wraps the `Container` node in a
> `bg-[--semantics/colors/background/backdrop/screen] p-[gap-48]` ancestor —
> Figma's convention for previewing a modal against its darkened backdrop
> with a minimum 48px viewport margin. The backdrop color was already correctly wired
> (`DialogOverlay` in `dialog.tsx` uses the equivalent
> `--ui-background-backdrop-screen`), so the token gate found nothing wrong.
> But `dialogContentVariants` in the same file centers the popup with plain
> `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` and no edge-inset
> constraint — so on a narrow viewport the popup can touch the screen edges,
> contradicting the design. This was missed because Phase 1 only read the
> `Container` node (one level below the backdrop frame), and even a full read
> would have passed the old Phase 2 gate, which only checks token existence,
> not this kind of structural completeness.

**Primitive.** Prefer a `@base-ui/react` primitive when one exists (check
`node_modules/@base-ui/react/`). For anything stateful/interactive (dialog,
menu, switch, tooltip…) wrap the Base UI primitive. For plain elements that
just need polymorphism (render as `<a>`, a router `Link`, etc.) use Base UI's
`useRender` + `mergeProps` and expose a `render` prop — **never** Radix
`asChild`/`Slot`. If Base UI has no primitive (e.g. breadcrumb), build semantic
HTML (`<nav><ol><li>`) + `useRender` for the polymorphic parts.

### Primitive behavior audit (mandatory before Phase 3)

Once the primitive (or hand-rolled HTML approach) is chosen, and **before
writing any code, test, or spec prose**, resolve how it actually behaves and
write it down in a scratch note (not a committed file). In this priority order:

- **Repo precedent.** Grep for an existing component composing the same
  primitive:
  `grep -rl "<PrimitiveName>" packages/ui-react/src/components/ui/`.
  If one exists, its behavior is ground truth for this primitive **in this
  repo** — read it and diff your intended usage against it.
- **Primitive source / `.d.ts`.** If there's no precedent, read the primitive's
  own implementation (`node_modules/@base-ui/react/`) for: which sub-element
  each forwarded prop (`ref`, `inputRef`, …) actually reaches; which parts are
  focusable/tabbable and with what `tabindex`; which parts carry which ARIA
  roles/attributes by default.
- **Live render.** If still ambiguous — or the approach is hand-rolled HTML
  with no third party to consult — render it (Storybook or a scratch test) and
  observe directly: Tab through it, inspect the DOM (devtools or
  `screen.debug()`).

The output is a map: **part → actual DOM element → ref target → focusability →
role**. Every downstream phase consults that map instead of re-deriving its own
assumption.

> **Worked example.** `InputNumPicker` wraps Base UI's `NumberField`. Its `ref`
> was forwarded to `NumberField.Root`'s `inputRef`, which Base UI merges into a
> hidden, `aria-hidden`, `tabindex="-1"` `<input type="number">` form shim —
> not the visible `<input type="text">`. The precedent was already in the repo
> (`packages/ui-react/src/components/ui/number-field/number-field.tsx` composes
> the same primitive correctly); nobody grepped for it. The ref test asserted
> only `toBeInstanceOf(HTMLInputElement)`, which the hidden shim also satisfies,
> so it passed. In the spec files the same root cause surfaced three more times:
> `accessibility.md` claimed the stepper buttons are Tab-reachable (Base UI
> hardcodes `tabindex="-1"` on them), `anatomy.yaml` attributed `role: group` to
> the root `div` instead of the element that actually carries it, and
> `tokens.yaml` described focus-ring tokens on parts that structurally can never
> receive focus. Each was written from a generic assumption about what that
> element type "usually" does, because nothing required inspecting the rendered
> DOM first.

**Icons.** Use `@acronis-platform/icons-react/<pack>` (usually `stroke-mono`).
Confirm the icon exists before importing it:

```bash
ls packages/icons-react/src/packs/stroke-mono/icons | grep -i <name>
```

Names are `PascalCase(asset) + Icon` (`chevron-right` → `ChevronRightIcon`).
Pass `size={16}` to match 16px design icons. There is **no** home/house icon
today — check, don't assume.

---

## Phase 3 — Implement in packages/ui-react

Create `packages/ui-react/src/components/ui/<name>/`:

```
<name>.tsx
<name>.figma.tsx          # Figma Code Connect
index.ts
__tests__/<name>.test.tsx
__stories__/<name>.stories.tsx
__stories__/<name>.generated.stories.tsx   # produced in Phase 4
```

Conventions (mirror Button):

- `React.forwardRef`; `displayName` on every component. Place the ref **per the
  Phase 2 behavior-audit map**, not on whichever sub-element seems most obvious
  — multi-part primitives often expose a `ref`/`inputRef` prop that lands on a
  non-visible internal node (see the audit).
- Prop interface extends the right HTML attrs (or `ComponentPropsWithoutRef`),
  plus `VariantProps<typeof xVariants>` when using `cva`.
- `cva` for `variant`/`size`; merge with `cn()` from `@/lib/utils`.
- Polymorphism via `useRender({ render, ref, defaultTagName, props:
mergeProps<'tag'>({…}, props) })`.
- Export everything from `index.ts`, then add a line to
  `packages/ui-react/src/index.ts` (keep it alphabetical).
- **Localization**: any text the component renders on its own (`aria-label`
  fallback, `sr-only` copy, placeholder/empty-state/tooltip strings that the
  design shows as static labels) must be a prop with that string only as its
  default — never inlined in JSX. `children`/other consumer-supplied content
  is fine as-is. See `context/conventions.md#localization--no-hardcoded-labels`.
- **RTL**: use logical Tailwind utilities (`ms-`/`me-`, `ps-`/`pe-`,
  `start-`/`end-`), never physical ones (`ml-`/`mr-`, `pl-`/`pr-`,
  `left-`/`right-`), unless the design genuinely anchors to a physical edge
  regardless of direction (e.g. a `side="left"` variant). Directional icons
  that should flip need an explicit `rtl:`/`ltr:` variant. See
  `context/conventions.md#rtl--bidirectional-layout`.

For a **composable** component, export the full set of parts (see breadcrumb:
`Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`,
`BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`).

**Figma Code Connect** (`<name>.figma.tsx`) — header status comment
(`COMPLETE` once URL + props verified), `figma.connect(Component, url, { props,
example })`. Map variant enums with `figma.enum('<exactPropName>', {…})` using
the names from `get_context_for_code_connect`. Validate:

```bash
pnpm --filter @acronis-platform/ui-react figma:connect
```

---

## Phase 4 — Spec in packages/ui-spec (7-file format)

Create `packages/ui-spec/components/<name>/`. Copy the structure from an
existing spec and from `@uikit/ui-kit/packages/specs/components/<name>` if a
legacy spec exists there (use it as a content source, but **adapt to the React
reality** — the legacy specs describe the Vue API).

| File               | Notes                                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `index.yaml`       | `component` PascalCase, `name` kebab, `status`, `category`, `since`, `figma.node`, `figma.codeConnect`.          |
| `anatomy.yaml`     | `root` (element/role), `parts` (each id used in the `schematic`!), `layout`, `states`.                           |
| `api.yaml`         | `contract` (properties/events/content/methods) + `adapters` (react `implemented`; vue/web-components `planned`). |
| `tokens.yaml`      | **Names only**, `^--ui-…$`. No values/defaults — they live in tokens-pd.                                         |
| `behavior.md`      | Given/When/Then scenarios.                                                                                       |
| `accessibility.md` | ARIA, keyboard, screen reader, contrast.                                                                         |
| `README.md`        | When to use / not use, examples, parts table.                                                                    |

> **Transcribe the Phase 2 audit map — don't restate conventions.** Keyboard
> claims in `accessibility.md`, part→role mappings in `anatomy.yaml`, and token
> `affects` targets in `tokens.yaml` must come from what the audit observed in
> the real DOM, **not** from what a `<button>`/`<div>`/wrapper "usually" does. A
> stepper button that Base UI hardcodes to `tabindex="-1"` is not Tab-reachable;
> a `role` belongs to whichever element actually carries it; a focus-ring token
> can't `affect` a part that can never receive focus.

Hard rules enforced by `__tests__/specs.test.ts`:

- Every `parts[].id` must appear as a substring in `anatomy.schematic`.
- A `states[]` entry with `kind: prop` must reference a real `api.yaml`
  property. `kind: pseudo` needs a `pseudo` selector. `kind: internal` requires
  an `internal_state[]` entry. Structural distinctions (e.g. "current page")
  are **parts, not states**.
- For `cva` components, `api.yaml` `variant`/`size` enums must equal the actual
  `cva` keys in the ui-react source (conformance test).

Validate continuously:

```bash
pnpm --filter @acronis-platform/ui-spec test
```

**Generate the states story** (don't hand-write the `.generated` file):

```bash
pnpm --filter @acronis-platform/ui-spec generate:stories
```

If the component isn't a simple prop-driven element, add a `RENDER` hint for it
in `packages/ui-spec/scripts/generate-stories.ts` (see the `breadcrumb` entry:
`ariaLabel`, `extraImports`, a composed `sample`) so the generated story renders
something real. Hand-write `<name>.stories.tsx` for the rich, demo-quality
stories (Default + each meaningful variation), mirroring `button.stories.tsx`.

**Wide `argTypes` (required).** The hand-written `meta.argTypes` must expose a
control for **every meaningful prop**, not just `variant`/`disabled`. Mirror the
exemplar in `button.stories.tsx` / `input.stories.tsx` / `switch.stories.tsx`:

- Enumerate the real props from the component source — `cva` `variant`/`size`
  keys, booleans, string/content props, callbacks, and the `render` prop. For a
  Base-UI-wrapping component, read the primitive's `.d.ts` for the forwarded
  props (e.g. `Tooltip.Root` has `defaultOpen`/`trackCursorAxis` but **not**
  `delay` — that's on the Provider). Only add props the component's type actually
  accepts, or `satisfies Meta<typeof X>` fails typecheck.
- Control by kind: union/`variant`/`size` → `control: 'select'` with `options`
  equal to the exact `cva` keys; boolean → `control: 'boolean'`; string/ReactNode
  text → `control: 'text'`; number → `control: 'number'`; callbacks, `render`,
  and element-only props → `control: false`.
- Every entry carries a `description` and a `table: { type: { summary }, category }`
  (and `defaultValue` for variants). Categories: `Appearance`, `Content`,
  `State`, `Behavior`, `Events`, `Composition`.
- **VR safety:** enrich `meta.argTypes` freely, but don't change what an existing
  story _renders_ (its baseline) — keep `meta.args` reproducing the current
  default unless you intend a baseline regen.

**Preview toolbars** (`.storybook/preview.ts` + `.storybook/globals.ts`) already
provide brand (default / deep_sky_itkontoret), light/dark, direction (auto/ltr/rtl), and
locale globals — stories get them for free, no per-story wiring. For **localized
demo content**, read the locale global in `render` and pull sample text from
`.storybook/i18n.ts` (the demo-only catalog — ui-react ships no strings). See the
`Localized` story in `button.stories.tsx`:

```tsx
import type { Locale } from '../../../../../.storybook/globals';
import { t } from '../../../../../.storybook/i18n';

export const Localized: Story = {
  render: (args, { globals }) => (
    <Button {...args}>{t((globals.locale as Locale) ?? 'en', 'submit')}</Button>
  ),
};
```

Add a localized story only when a locale-/RTL-sensitive demo is worth a VR
baseline; add any new message keys to `.storybook/i18n.ts` (all six locales).

---

## Phase 5 — Verify & changeset

```bash
pnpm --filter @acronis-platform/ui-react test
pnpm --filter @acronis-platform/ui-react typecheck
pnpm --filter @acronis-platform/ui-react lint
pnpm --filter @acronis-platform/ui-react build      # confirms exports bundle, .figma.tsx excluded
pnpm --filter @acronis-platform/ui-spec test
pnpm -r typecheck                                   # what the pre-commit hook runs
```

Add a changeset for the **published** package only (`ui-react`). Bump by intent:
`minor` for a **new** component, `patch` for an **update/fix** of an existing one
(re-theme, token rename, bug fix). `ui-spec` is private (0.0.0); no changeset:

```
.changeset/<name>-component.md
---
'@acronis-platform/ui-react': minor   # or: patch (update/fix)
---
Add `<Name>`: …
```

Stories must be checked in light **and** dark mode in Storybook
(`pnpm --filter @acronis-platform/ui-react storybook`).

**Visual regression.** Stories are also VR cases (`@storybook/test-runner` +
`jest-image-snapshot`, config in `.storybook/test-runner.ts`; baselines in
`test/__snapshots__/`). CI runs a **light _and_ dark** matrix
(`.github/workflows/visual-regression.yml`), so every story has **two** baselines:
`<id>.png` (light) and `<id>--dark.png` (dark). The plain `:docker:update` writes only
the light baselines — you MUST regenerate **both** modes or the dark CI job fails on the
light-only baselines. Use the `:all` scripts (they run light then the
`STORYBOOK_COLOR_MODE=dark` pass). After adding/updating stories, regenerate the
**Linux** baselines for both modes and review the PNGs before committing:

```bash
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:update:all  # regenerate light + dark
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:all         # check both (what CI runs)
```

(For a single mode, the `:docker:update` / `:docker:update:dark` and `:docker` /
`:docker:dark` variants exist too.)

When you **remove or rename** a story, delete BOTH its baselines (`<id>.png` and
`<id>--dark.png`) — the runner only writes/updates existing stories, leaving orphans.

Never commit baselines rendered on macOS/Windows — they won't match CI's Linux
renderer.

On `--update`, the `:docker:update` run may legitimately rewrite **zero** PNGs —
that happens when you're fixing code to match an already-correct baseline (e.g. a
silent token rename the baselines never captured). Confirm with `git status
test/__snapshots__/`; if nothing changed, run the **check** variant once to prove
the committed baselines still pass, and commit no PNGs.

---

## Phase 6 — Document in apps/docs (components section)

Add a documentation page so the new component shows up in the docs site's
**Components** section in the same style as every other ui-react page. Three
pieces: a **live demo**, an **MDX page**, and a **nav entry**.

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
> first, so `uikit-docs dev`/`build` regenerate it automatically (≈1.5s) — no
> extra step needed here.

---

## Output checklist (done = all green)

- [ ] `src/components/ui/<name>/<name>.tsx` — Base UI + `--ui-*` tokens, no hex.
- [ ] `index.ts` + export line in `src/index.ts`.
- [ ] No component-rendered text hardcoded — self-generated labels are prop
      defaults, not inlined literals.
- [ ] No physical directional utility where a logical one applies; directional
      icons that should mirror under `dir="rtl"` have an explicit variant.
- [ ] For portal/overlay components: context frame (if present) checked for
      shared-chrome structural facts (backdrop, edge-inset, anchor offset,
      collision padding, stacking gap) not owned by this component; each
      verified against the shared primitive's actual implementation, not just
      token resolution.
- [ ] `__tests__/<name>.test.tsx` — render, variants/states, a11y roles, ref,
      `render`-prop composition. The **ref test must assert against the audited
      target specifically** (e.g. that it is not `aria-hidden`, or that it is
      the visible element the Phase 2 audit identified) — not merely
      `toBeInstanceOf(HTMLInputElement)`, which a hidden form shim also
      satisfies.
- [ ] Primitive behavior audit done (repo precedent checked, or primitive
      source/live render inspected) before writing ref placement, tests, or
      spec prose.
- [ ] ref/focus/role claims in code, tests, and
      `accessibility.md`/`anatomy.yaml`/`tokens.yaml` trace to that audit.
- [ ] `__stories__/<name>.stories.tsx` (hand) + `<name>.generated.stories.tsx`.
- [ ] VR baselines regenerated in Docker for **both** light and dark
      (`storybook:test:visual:docker:update:all`) and reviewed; both `<id>.png` and
      `<id>--dark.png` committed (orphans deleted).
- [ ] `<name>.figma.tsx` — `COMPLETE`, validated by `figma:connect`.
- [ ] `packages/ui-spec/components/<name>/` — 7 files, `ui-spec test` green.
- [ ] Changeset for `@acronis-platform/ui-react`.
- [ ] test / typecheck / lint / build all pass; `pnpm -r typecheck` clean.
- [ ] `apps/docs`: `src/components/demos-react/<name>.tsx` (live demo) +
      `content/docs/components/<name>.mdx` (Usage / Examples / API Reference) +
      `meta.json` nav entry; `uikit-docs build` passes.

---

## Worked example: Breadcrumb (node 1017-2852)

- Base UI has **no** breadcrumb primitive → semantic `<nav><ol><li>` + composable
  shadcn-style parts; `BreadcrumbLink`/`Breadcrumb` use `useRender` for the
  `render` prop.
- Tokens (current, next-gen names): `--ui-breadcrumb-link-label-color-{idle,hover,active}`
  (links), `--ui-breadcrumb-page-label-color` (current page),
  `--ui-breadcrumb-separator-icon-color` + `--ui-breadcrumb-separator-icon-size`
  (separator), `--ui-breadcrumb-list-gap` (inter-item gap). These superseded the
  original `--ui-breadcrumb-{link,value,chevron,gap}` names in the 2025-06 next-gen
  token sync — see the `--update` note in Phase 2.
- States: idle/hover/pressed/focus are pseudo-states on the link; `active` =
  the current page = `BreadcrumbPage` (`role="link" aria-current="page"
aria-disabled`), a **part**, not a state.
- Code Connect mapped `figma.enum('state', { active: true })` → render
  `BreadcrumbPage` vs `BreadcrumbLink` + separator.
- ui-spec `breadcrumb/` documents the composable parts; "current page" lives in
  `anatomy.parts`, only the link pseudo-states live in `anatomy.states`.
