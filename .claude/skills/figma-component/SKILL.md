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

---

## Phase 1 — Read the design (Figma MCP)

Call these (no skill prerequisite for reads):

1. `get_design_context({ nodeId, fileKey })` — reference markup + screenshot.
   Identify states, the part structure, and which layers are icons/instances.
2. `get_variable_defs({ nodeId, fileKey })` — the design variables **the node
   uses** (e.g. `component/Breadcrumb/link-label/color`, `…/list/gap`, font size /
   line height), as resolved `name → value` pairs. This is the right tool for the
   per-component question (it returns only what this node references — not whole
   collections; for a full token-collection sync use `/sync-tokens`). **Caveat:**
   the Figma MCP is **selection-bound** in this setup — both the figma-console
   Desktop Bridge and the official `mcp__figma__*` Dev Mode server reject reads
   with "You currently have nothing selected" even when you pass a valid
   `nodeId`/`fileKey`. The node must be **selected in the Figma desktop app**: ask
   the user to open the node URL in desktop and click the layer, then retry.
   Reconcile each returned Figma variable name to its `--ui-*` token in Phase 2 —
   never copy the resolved hex/number.
3. `get_context_for_code_connect({ nodeId, fileKey })` — **exact** Figma
   property names + variant options. Use this to write Code Connect; never
   guess property names.

Write down, from the design:

- **Variants / states.** Which are real props (map to `variant`/`size`/
  `disabled`) vs. pure interaction states (`:hover`, `:active`,
  `:focus-visible`) vs. structural (e.g. "current page" = a different part).
- **The design variables.** Each `component/<x>/<y>` variable should already
  exist as a `--ui-<x>-<y>` token (see Phase 2).

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
  in `@acronis-platform/design-tokens` → rebuild `tokens-pd`. **Do not
  hand-author hex values** in the component. Flag this to the user.

Wire **each interaction state to its own token** (`hover:` → `*-hover`,
`disabled:` → `*-disabled`) even when the idle value happens to match — brand
overrides only honor the referenced token.

> **On `--update`, re-verify every token ref against the _current_ tokens-pd.**
> A missing CSS var is a **silent** failure — `var(--does-not-exist)` makes the
> property invalid and the element falls back to inherited color; nothing fails
> the build, typecheck, or lint. A token-sync (e.g. the `/sync-tokens` flow) can
> rename tokens out from under a shipped component, leaving it referencing dead
> names. So when updating, grep each ref and confirm it still resolves:
> `for t in $(grep -oE 'ui-[a-z-]+' src/components/ui/<name>/<name>.tsx | sort -u); do grep -qF -- "--$t" packages/tokens-pd/css/<Tier>/acronis.css && echo "OK $t" || echo "MISS $t"; done`
> Don't forget the **spec** (`ui-spec/components/<name>/tokens.yaml` +
> `anatomy.yaml`) and the **tests** — both pin token names and drift the same way.
> (Worked example: the 2025-06 next-gen sync renamed `--ui-breadcrumb-link` →
> `--ui-breadcrumb-link-label-color-idle`; the component kept the old name and
> rendered links uncolored until re-themed.)

> **tokens-pd component tiers are opt-in.** `src/styles/index.css` imports the
> semantic tier (`css/acronis.css`) plus one `@import '…/css/<component>/acronis.css'`
> per shipped component. A new component with its own tier (`--ui-<name>-*`) will
> render **unstyled** until you add its tier import there. Verify the token is
> defined: `grep -rn "<name>" packages/tokens-pd/css/<name>/acronis.css`.

**Primitive.** Prefer a `@base-ui/react` primitive when one exists (check
`node_modules/@base-ui/react/`). For anything stateful/interactive (dialog,
menu, switch, tooltip…) wrap the Base UI primitive. For plain elements that
just need polymorphism (render as `<a>`, a router `Link`, etc.) use Base UI's
`useRender` + `mergeProps` and expose a `render` prop — **never** Radix
`asChild`/`Slot`. If Base UI has no primitive (e.g. breadcrumb), build semantic
HTML (`<nav><ol><li>`) + `useRender` for the polymorphic parts.

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

- `React.forwardRef`; `displayName` on every component.
- Prop interface extends the right HTML attrs (or `ComponentPropsWithoutRef`),
  plus `VariantProps<typeof xVariants>` when using `cva`.
- `cva` for `variant`/`size`; merge with `cn()` from `@/lib/utils`.
- Polymorphism via `useRender({ render, ref, defaultTagName, props:
mergeProps<'tag'>({…}, props) })`.
- Export everything from `index.ts`, then add a line to
  `packages/ui-react/src/index.ts` (keep it alphabetical).

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
provide brand (acronis / deep-sky), light/dark, direction (auto/ltr/rtl), and
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
`test/__snapshots__/`). After adding/updating stories, regenerate the **Linux**
baselines in Docker and review the PNGs before committing them:

```bash
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:update  # regenerate
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker         # check (what CI runs)
```

Never commit baselines rendered on macOS/Windows — they won't match CI's Linux
renderer. CI: `.github/workflows/visual-regression.yml`.

On `--update`, the `:docker:update` run may legitimately rewrite **zero** PNGs —
that happens when you're fixing code to match an already-correct baseline (e.g. a
silent token rename the baselines never captured). Confirm with `git status
test/__snapshots__/`; if nothing changed, run the **check** variant once to prove
the committed baselines still pass, and commit no PNGs.

---

## Output checklist (done = all green)

- [ ] `src/components/ui/<name>/<name>.tsx` — Base UI + `--ui-*` tokens, no hex.
- [ ] `index.ts` + export line in `src/index.ts`.
- [ ] `__tests__/<name>.test.tsx` — render, variants/states, a11y roles, ref,
      `render`-prop composition.
- [ ] `__stories__/<name>.stories.tsx` (hand) + `<name>.generated.stories.tsx`.
- [ ] VR baselines regenerated in Docker (`storybook:test:visual:docker:update`)
      and reviewed; `test/__snapshots__/*.png` committed.
- [ ] `<name>.figma.tsx` — `COMPLETE`, validated by `figma:connect`.
- [ ] `packages/ui-spec/components/<name>/` — 7 files, `ui-spec test` green.
- [ ] Changeset for `@acronis-platform/ui-react`.
- [ ] test / typecheck / lint / build all pass; `pnpm -r typecheck` clean.

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
