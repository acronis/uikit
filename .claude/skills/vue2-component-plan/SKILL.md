---
name: vue2-component-plan
description: >
  Produce a plan-only artifact set — PRD, vue2→React API mapping, and demo/UX
  notes — for a **future** ui-react component whose baseline is a component
  from the external Acronis Vue 2 UI Kit fork (path from the `VUE2_FORK_ROOT`
  env var — ask the user if unset), cross-referenced against a live demo
  screen that shows the target look/UX.
  Writes no source code and no `packages/ui-spec` files (those require a real
  implementation to validate against); the output is meant to be handed to a
  fresh Claude session (or `/legacy-component`-style build) as its Phase 1
  input. Invoke with `/vue2-component-plan <ComponentName> <vue2-package...>
  [demo-ref]`.
---

# Vue 2 → ui-react component plan (research + PRD, no code)

**Target is always `packages/ui-react`.** This skill and its follow-up build
never read from, write to, or plan for the archived `packages/ui-legacy` — that package is
a separate, already-mature, independently-maintained workspace with its own
recipe (`/legacy-component` reads _from_ it as a source, it doesn't build
_into_ it). The overlap here is coincidental naming: this skill's source is
the external **Vue 2** UI Kit fork, a different codebase entirely, and its
only output target is ui-react.

Some ui-react components have no source in this repo to port from (no
`packages/ui-legacy` counterpart, no "ready for dev" Figma node yet), but
**do** have a mature equivalent in the separate Acronis **Vue 2** UI Kit fork,
plus a live product screen that shows the target UX. This skill turns those
two inputs into a **written plan** for a new (or revised) ui-react
component — it does not implement anything. Use it _before_ a build session
when the source is that Vue 2 fork and no Figma mockup exists.

**Why plan-only:** `packages/ui-spec`'s `api.yaml` conformance test checks a
spec's `variant`/`size` enums against the _actual_ `cva` keys in shipped
`ui-react` source (`packages/ui-spec/AGENTS.md`) — a spec for a component that
doesn't exist yet can't pass that, and shouldn't fake it. This skill instead
produces a **pre-spec PRD** under `context/component-plans/`, outside
`packages/ui-spec`, explicitly marked draft. The follow-up build prompt turns
it into real code, then a real `ui-spec` (draft status, no `figma:` block —
same shape `/legacy-component` Phase 4 produces).

Read first — they override anything here on conflict:

- Root: [AGENTS.md](../../../AGENTS.md), [context/conventions.md](../../../context/conventions.md)
- ui-react: [packages/ui-react/AGENTS.md](../../../packages/ui-react/AGENTS.md),
  [packages/ui-react/context/conventions.md](../../../packages/ui-react/context/conventions.md)
- ui-spec: [packages/ui-spec/AGENTS.md](../../../packages/ui-spec/AGENTS.md) —
  read this even though you won't write spec files here; the plan's API
  mapping should already be shaped so a later `api.yaml`/`anatomy.yaml` falls
  out of it with minimal rework.
- Procedural reference (for what happens _after_ this plan — the **recipe
  shape**, not the source): [.claude/skills/legacy-component/SKILL.md](../legacy-component/SKILL.md).
  Its Phase 3–6 (implement in ui-react, spec, docs, verify) is reusable
  verbatim once you have a plan in hand — only its Phase 1–2 (read
  `ui-legacy`, map `--av-*` tokens) don't apply, since the source here is the
  Vue 2 fork, not `ui-legacy`.

---

## Invocation

```
/vue2-component-plan <ComponentName> <vue2-package...> [demo-ref]
```

| Arg               | Meaning                                                                                                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ComponentName`   | PascalCase name for the **future** ui-react component (e.g. `Table`, `DataTable`).                                                                                                                                                                |
| `vue2-package...` | One or more kebab package names under the vue2 fork's `packages/` (e.g. `table table-column table-actions`). The **first** is the primary baseline; the rest are satellites folded into the same plan as parts/patterns, not separate components. |
| `demo-ref`        | Optional. A URL (best-effort fetch, see Phase 2) and/or a path to screenshot(s)/exported HTML the user already saved locally. If omitted, ask the user for it before Phase 2.                                                                     |

Vue2 fork root: read from the `VUE2_FORK_ROOT` env var (not a repo constant —
it's a path on the operator's machine, outside this repo). If the env var
isn't set, ask the user for the path before Phase 0 step 0. Referred to below
as `$VUE2_FORK_ROOT`:

```
$VUE2_FORK_ROOT/packages/<vue2-package>/
```

**Before invoking Phase 1, evaluate feasibility and ask for what's missing.**
Two more inputs are strongly recommended — not mandatory like the Phase 0
working-directory check, but the plan's quality (and the amount of guessing
you'll otherwise do in Phases 1–2) depends heavily on them. Ask for both
up front, in the same turn you'd otherwise jump straight to Phase 1:

- **A link to the vue2 component's public demo/docs page and its public
  Storybook.** These are distinct from the `demo-ref` product screen (which
  shows target UX in a _different_ app) — this is the Vue2 component's own
  reference, useful for confirming prop/event/state behavior straight from
  a live, interactive source instead of static SFC reading. If the user's
  first message doesn't include these, ask before proceeding; if they say
  they don't have them or can't find them, proceed on source + `examples/`
  alone and note the gap in `PLAN.md` Open Questions.
- **A screenshot of the desired ui-react demo page, or a Figma link,**
  showing the target look for the _new_ component. This is a second,
  independent visual reference beyond the `demo-ref` product screen — the
  product screen shows _where_ the component lives and _what it needs to
  do_; this one shows _what it should look like_ once built. If the user
  doesn't have one, that's fine (this skill's output is explicitly
  "design-pending v1" per its own scope note below) — just don't skip
  asking.

**Scope call the user has already made:** the demo is _"just a mockup that
shows how the ui-react app will look"_ — it is UX/requirements reference, not
a literal spec to clone pixel-for-pixel, and not itself the deliverable. The
deliverable is one new ui-react component (optionally composed of parts) whose
**API and architecture may deviate from Vue 2** wherever modern React/Base UI
primitives call for it — mimic the Vue 2 contract only where it doesn't fight
those primitives.

---

## Phase 0 — Confirm inputs, don't guess scope

0. **Mandatory prerequisite: resolve `$VUE2_FORK_ROOT`, and it must be an
   added working directory in the current session, not just present on
   disk.** If the `VUE2_FORK_ROOT` env var isn't set, ask the user for the
   fork root path now rather than guessing or reusing a value from a prior
   session. Reading it as a bare filesystem path outside the session's
   working directories is unreliable (tool sandboxing, path allowlists) —
   the user must add that path as an additional working directory before
   this skill can inventory it. Check the environment context for it; if
   it's absent, **stop immediately** and tell the user to add it (e.g. via
   their client's "add folder"/working directory mechanism), then
   re-invoke. Do not fall back to reading it as an unlisted path — confirm
   existence via `ls` only _after_ it's a working directory, as a sanity
   check, not as a substitute for the check itself.
1. Verify the vue2 package(s) exist:
   ```bash
   ls $VUE2_FORK_ROOT/packages/<pkg>/src
   ```
2. Check whether `ComponentName` already exists in ui-react or has a plan
   already:

   ```bash
   ls packages/ui-react/src/components/ui/ | grep -i <name>
   ls context/component-plans/ 2>/dev/null | grep -i <name>
   ```

   - Exists in ui-react already → this is a **revision** plan, not greenfield.
     Say so explicitly in `PLAN.md`'s summary and diff against the _current_
     ui-react API, not a blank slate.
   - A plan dir already exists → treat this run as a refresh; read the
     existing files first and note what changed instead of starting over.

3. If `demo-ref` is missing or is a bare URL you can't reach (Phase 2 covers
   this), tell the user now what you need rather than inventing UX details.

Do not read Vue2 source or fetch the demo yet — confirm the above first so you
don't do Phase 1/2 work against the wrong package or a stale plan.

---

## Phase 1 — Inventory the Vue 2 baseline

For **each** package passed in, read in this order and write down the
inventory as you go (this becomes `API-MAPPING.md`'s left-hand columns):

1. **`src/<name>.vue`** (or the package's main SFC — check `index.js` for the
   actual export name, it doesn't always match the package dir) — extract:
   - **Props** (`props: {...}`) — name, type, default, validator/enum values.
   - **Events** (`this.$emit(...)` call sites) — name, payload shape.
   - **Slots** (`<slot name="...">`) — default + named, and what data they
     scope (`v-slot:foo="{ row, index }"`).
   - **Public methods** exposed on the instance (anything callable via
     `ref` in the parent — vue2's equivalent of an imperative handle).
   - **Sub-component composition** — does it render other vue2 components
     from this list or elsewhere in `packages/`? (e.g. `table` composing
     `table-column`, `pagination`, `checkbox`).
2. **Mixins** (`mixins: [...]`) — vue2 leans on mixins for shared behavior
   (sortable, selectable, resizable columns, etc. — check `src/mixins/` at the
   fork root). A mixin used by the target component is part of its behavioral
   contract; note what it adds even though it won't map to a React mixin.
3. **Any co-located docs/examples** — `examples/play/prototypes/examples/**`
   and `examples/docs/web/*.md` often have runnable demos of exactly this
   component (e.g. `examples/play/prototypes/examples/tables/**` for `table`).
   These are usually a **richer** behavioral reference than the SFC alone —
   read a handful before concluding the inventory is complete.
4. **The hosted Vue2 demo site + Storybook**, e.g.:
   - `https://uikit.corp.acronis.com/jenkins/uikit/ui-kit/release/<version>/latest/#/web/<component>` (live demo pages)
   - `https://uikit.corp.acronis.com/jenkins/uikit/ui-kit/release/<version>/latest/storybook/?path=/story/<component>--<story>` (Storybook, interactive controls)

   `uikit.corp.acronis.com` is an **internal corp-network host** —
   confirmed unreachable via `WebFetch` from this environment
   (`getaddrinfo ENOTFOUND`), regardless of VPN state on the user's machine,
   since the fetch happens on a tool server outside the corp network. Don't
   retry it. Ask the user to open the relevant `#/web/<component>` demo page
   and/or Storybook story themselves and paste back what you need: the
   rendered controls/props panel, interaction behavior, or a screenshot (which
   you can then read directly). This is the **best live reference for
   confirming prop/event behavior** you're unsure about from source alone —
   prefer asking for it over guessing when the SFC is ambiguous.

5. **Styling/theming hooks** — note only _that_ the component is themable and
   how (SCSS vars, BEM classes) — don't port any values; ui-react tokens are a
   Phase 3 concern, decided independently.

Write the raw inventory (props/events/slots/methods/mixins, one row each) —
this is intermediate work product, not yet the mapping. Keep it until Phase 4.

---

## Phase 2 — Read the demo (UX/requirements reference)

The URL given
(`https://www.acronis.com/cyber-console/demo/assets/devices`, or whatever
`demo-ref` resolves to) is a **live product screen**, not a component
sandbox — treat it as "here's the app screen this component needs to support,"
matching how `packages/ui-spec/screens/*/screen.yaml` describes a real screen
assembled from real components (`packages/ui-spec/AGENTS.md` § Screens) — this
plan is the pre-implementation version of that same idea.

1. **Try a fetch first.** Confirmed in this environment: the bare URL 403s
   (likely gated behind login) — don't assume that's fixed; try again, but
   don't loop on it.
   ```
   WebFetch: https://www.acronis.com/cyber-console/demo/assets/devices
   ```
2. **If it fails, ask the user for the reference directly** rather than
   guessing the UX: a screenshot (or a few — empty/loaded/filtered states),
   an exported HTML/DOM dump, or a written walkthrough. Read any image the
   user provides with the `Read` tool (it's multimodal) and describe what you
   see structurally: layout regions, columns, filters, search, row actions,
   status/tag indicators, pagination, empty/loading/error states, responsive
   behavior if visible.
3. **Cross-reference against the Phase 1 inventory as you go**, not after:
   for every UI element in the demo, note whether the vue2 baseline already
   covers it (which prop/slot), or whether it's a **gap** in either direction:
   - Demo needs something the vue2 component doesn't support → flag as a new
     requirement for the React version (with a note: is this in v1 scope?).
   - Vue2 supports something the demo doesn't exercise → still worth carrying
     if it's cheap and general (e.g. sort direction callback), flag as
     "vue2-only, unconfirmed by demo" if it's exotic — don't silently drop or
     silently keep; the PRD should make each call visible and reversible.

Don't spend more than a couple of fetch/ask round-trips here — if the demo is
genuinely inaccessible and the user has no screenshot to give, say so in
`PLAN.md` under Open Questions and proceed on the vue2 inventory alone; a
partial plan the user can amend beats blocking.

---

## Phase 3 — Check what ui-react already has (don't duplicate or fight it)

Before proposing a React API, confirm what you'd actually be building on:

```bash
ls packages/ui-react/src/components/ui/                       # existing components to reuse as parts
ls packages/ui-react/node_modules/@base-ui/react/              # candidate primitive for the new component
grep -oE '\-\-ui-[a-z-]+' packages/tokens-pd/css/default.css | sort -u   # semantic tokens available
ls packages/tokens-pd/css/ | grep -i <name>                    # existing component-specific tier, if any
```

- If a Base UI primitive exists for this shape (unlikely for `table`, more
  likely for satellite parts like `checkbox`/`select`/`menu` used inside it),
  the plan should say "wrap `@base-ui/react`'s `<X>`", not reinvent it.
- If ui-react already ships components the new one should compose (e.g. an
  existing `Checkbox`/`Tag`/`Pagination`), the plan should reuse them as parts
  instead of re-specifying their behavior — reference, don't restate.
- Note token strategy at a high level only (semantic tokens vs. "needs a new
  component tier, flag upstream") — same rule `/legacy-component` Phase 2a
  follows; don't hand-author values here.

---

## Phase 4 — Write the plan artifacts

Output directory: `context/component-plans/<kebab-name>/` (new — this is
research/PRD material, not a workspace, so it lives at the repo-root
`context/` tier alongside the other proposal docs listed in `AGENTS.md`, not
inside `packages/ui-react` or `packages/ui-spec`).

```
context/component-plans/<kebab-name>/
  PLAN.md
  API-MAPPING.md
  DEMO-NOTES.md         # omit if Phase 2 found nothing beyond what PLAN.md covers
```

### `PLAN.md` — sections, in order

1. **Summary** — one paragraph: what this component is, why now, source
   materials (vue2 package path(s), demo URL/screenshot references).
2. **Scope** — v1 must-haves vs. explicitly deferred (mirror the demo's
   actual needs over the vue2 kit's full feature set — a legacy component
   often supports more than any one product screen uses; don't plan for
   everything vue2 does if the demo doesn't need it and it's not clearly
   cheap to include).
3. **Vue2 baseline summary** — condensed table (full detail lives in
   `API-MAPPING.md`): parts/sub-components involved, and the handful of
   behaviors that most define this component's identity.
4. **Demo → requirements** — the cross-referenced list from Phase 2:
   requirement, source (demo / vue2 / both), v1 or deferred, open question if
   any.
5. **Proposed React architecture** — composition (single component vs. parts,
   e.g. `Table`/`TableHeader`/`TableRow`/`TableCell`/`TableActions`), which
   existing ui-react components or Base UI primitives it builds on (Phase 3),
   polymorphism (`render` prop via `useRender` where it fits, per this repo's
   convention — never `asChild`), and where the API **deliberately diverges**
   from vue2 with a one-line reason each (a mixin-driven vue2 behavior that's
   better expressed as a hook, an event that's better as a controlled-prop
   pair, a slot that's better as a `render` prop or explicit part).
6. **Open questions / risks** — anything Phase 2/3 couldn't resolve (demo
   inaccessible, ambiguous vue2 behavior, missing token tier, an existing
   ui-react component that partially overlaps).
7. **Handoff** — the literal next step: point at `API-MAPPING.md`, and state
   plainly that the build itself is a **separate** prompt/session (this skill
   does not implement). Suggest the shape of that follow-up (e.g. "feed
   `PLAN.md` + `API-MAPPING.md` to a fresh session and drive the `/legacy-component`
   Phase 3–6 recipe using them as the Phase 1 inventory, since there's still no
   Figma node").
8. **Changeset / migration notes** — this plan doesn't ship code, so it can't
   create the changeset itself (per `context/releasing.md`, a changeset is
   added alongside the code change it describes). Instead, spell out as an
   explicit task for the build session: when the new component ships, add a
   `.changeset/*.md` entry whose body includes a short **"Migrating from Vue2
   `<vue2-package>`"** section — the highest-value rows from `API-MAPPING.md`
   (renamed/dropped/added props, event → callback renames, slot → `render`
   prop changes), written for a consumer who knows the Vue2 API and needs the
   React equivalent, not a changelog restating the new component's docs. Draft
   that migration-notes paragraph here in `PLAN.md` (even in rough form) so
   the build session can lift it directly into the changeset instead of
   reconstructing it from `API-MAPPING.md` under time pressure.

### `API-MAPPING.md` — one table, this is the artifact with the most reuse value

| Vue2 (prop/event/slot/method, package) | Proposed React (prop/callback/part/ref) | Kept / Renamed / Dropped / Added | Why |
| -------------------------------------- | --------------------------------------- | -------------------------------- | --- |

Cover every row from the Phase 1 inventory — "Dropped" rows need a reason
(vue2-only, unconfirmed by demo, fights a React idiom), not silence.

### `DEMO-NOTES.md` (optional)

Only if the demo analysis produced more than a couple of the "Demo →
requirements" rows already in `PLAN.md` — e.g. a structural description of
regions/layout, or specifics that would clutter `PLAN.md`. If the demo was
inaccessible and the user gave nothing, skip this file entirely (say so in
`PLAN.md` Open Questions instead of writing an empty placeholder).

---

## What this skill deliberately does NOT do

- **No source code.** Nothing under `packages/ui-react/src` or
  `packages/ui-spec/components/` — a future build prompt does that.
- **No `packages/ui-spec` files.** The conformance test needs real shipped
  `cva` keys to check against; a pre-implementation spec would either fail or
  fake-pass. `API-MAPPING.md` is the pre-spec substitute.
- **No pixel-cloning the demo.** The demo is a requirements/UX reference for
  a component whose visual design in ui-react is still pending its own
  Figma/token pass — same "design-pending v1" posture `/legacy-component`
  takes, just one step earlier (plan, not even code yet).
- **No guessing an inaccessible demo.** If the URL 403s and the user has no
  screenshot, say so in Open Questions rather than inventing UI.

---

## Output checklist (done = all green)

- [ ] Phase 0: confirmed the vue2 fork is an added working directory (not
      just an on-disk path) before reading it; confirmed vue2 package(s)
      exist; checked for an existing ui-react implementation or prior plan
      and adjusted framing accordingly.
- [ ] Asked the user for the vue2 component's public demo/docs + Storybook
      links, and for a screenshot of the desired ui-react demo page or a
      Figma link — proceeded on source alone (with the gap noted) only if
      the user didn't have them.
- [ ] Phase 1: full props/events/slots/methods/mixins inventory for every
      vue2 package passed in, sourced from the SFC(s) + at least a few
      `examples/` demos, not the SFC alone.
- [ ] Phase 2: demo fetched, or explicitly given up on with the reason
      recorded; every demo UI element cross-referenced against the vue2
      inventory (covered / gap / vue2-only).
- [ ] Phase 3: checked existing ui-react components, Base UI primitives, and
      token vocabulary before proposing the architecture.
- [ ] `context/component-plans/<kebab-name>/PLAN.md` — all 8 sections,
      including a drafted Vue2→React migration-notes paragraph for the
      future changeset.
- [ ] `context/component-plans/<kebab-name>/API-MAPPING.md` — every Phase 1
      row accounted for, every "Dropped" row justified.
- [ ] `DEMO-NOTES.md` written only if it earns its own file.
- [ ] User told this is plan-only and pointed at the follow-up build prompt.
