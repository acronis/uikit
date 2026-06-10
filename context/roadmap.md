# Acronis UI Kit — Roadmap

> Status: **ratified & on the board** · Owner: Leonid Romanov · Last updated: 2026-06-05
> Tracks GitHub Project [acronis/projects/3](https://github.com/orgs/acronis/projects/3)
> ("User Interface Kit Development"). The 7 epics below are issues **#102–108**;
> ~98 task issues are linked as sub-issues with Status / Phase (P1–P5) / Size set.
> Companion docs: [`backlog-p2-primitives.md`](./backlog-p2-primitives.md) ·
> [`backlog-p3-p4.md`](./backlog-p3-p4.md).

## North star

A single, token-driven UI Kit where **design tokens → theme → components →
icons/assets** form one pipeline, Figma is the upstream source of truth, and
**`@acronis-platform/ui-react` (Base UI) is the one component library teams
build on.** `ui-legacy` (`shadcn-uikit`) moves to **maintenance/freeze** with a
defined deprecation path.

## Decisions locked (2026-06-05)

1. **`ui-react` replaces `ui-legacy`.** Legacy → maintenance/freeze; no new
   features land there. All new work — **including the Table cluster** — targets
   `ui-react`. Legacy gets only security/critical fixes.
2. **Foundational-first buildout.** Components ship bottom-up: primitives before
   composites before data/complex components, so higher-order components always
   have their building blocks.
3. **Theming on the new pipeline.** Brand themes are **generated CSS exports**
   from `design-tokens` → `tokens-pd` (built by `tools/style-dictionary`), paired
   with the new icon/illustration **assets**, not hand-authored SCSS. Brand set
   = the legacy brand family **plus any new brand Figma introduces** — generation
   is data-driven, so a new Figma brand needs no code change.
   _Amended 2026-06-10 (see [`e1-theme-delivery.md`](./e1-theme-delivery.md)):_
   the runtime model is `--ui-*` + `[data-theme]` + `light-dark()` (as already
   shipped in `tokens-pd`), **not** the legacy `--av-*` + class toggle; and
   white-label brands are authored as **full Figma brand modes**, not generated
   by a color-derivation script.
4. **Timeline — Q3 2026 (Jul–Sep).** Consumers need a usable set of base
   components in Q3 2026. `ui-legacy` coexists **until the end of Q3 2026** and is
   **phased out by Q3 2026**; after that it is security-only. **v1 scope** = all
   basic Base UI components + our design-system components + selected complex
   components (Table & friends).

---

## Current state (baseline)

| Area             | Package                                         | Version | Maturity                               |
| ---------------- | ----------------------------------------------- | ------- | -------------------------------------- |
| Legacy lib       | `shadcn-uikit` (`ui-legacy`)                    | 0.36.3  | Mature — 82 components → **freeze**    |
| **Next-gen lib** | `ui-react`                                      | 0.3.0   | **2/82 components** (Button, Switch)   |
| Tokens           | `design-tokens`                                 | 0.4.0   | DTCG JSON, Figma-synced, ajv-validated |
| Token artifacts  | `tokens-pd` (built by `tools/style-dictionary`) | 0.6.0   | Per-brand CSS + Tailwind presets       |
| Icons            | `icons-react`                                   | 0.2.0   | Generated from assets                  |
| Assets           | `design-assets`                                 | 0.3.0   | Manifests + binaries                   |
| Apps             | demo · docs · demos · kitchen-sink              | 0.1–0.4 | Scaffolded showcases                   |

**The gap that defines the plan:** ui-react is ~2/82 components in. The roadmap is
fundamentally "grow ui-react to a usable, then complete, surface — on a solid
token foundation — while legacy is frozen and consumers migrate."

---

## Epics

### E1 — Foundation: tokens & theming · #102 _(enabler — leads everything)_

ui-react components render `--ui-*` custom properties, so the token/theme
contract must be stable before the component ladder accelerates. Implementation
plan: [`e1-theme-delivery.md`](./e1-theme-delivery.md).

- [ ] **Theme delivery (#172)** — `tokens-pd` ships per-brand CSS exports
      (`--ui-*`, `[data-theme]` + `light-dark()`), consumed by `ui-react` via
      `@theme inline` (Tailwind CSS v4 theme directive that maps CSS custom properties into theme tokens at build time; see https://tailwindcss.com/docs/theme#referencing-other-variables).
      Generation is already wired; remaining work is consumer ergonomics + the
      per-brand Storybook switch.
- [ ] **Data-driven brand generation (#173 / #174)** — a new Figma brand mode →
      `values.<brand>` → a generated `<brand>.css`, **no code change** (data-driven
      discovery shipped, PR #258). Brand set = the legacy brand family **plus any
      new brand Figma introduces**; track light/dark per brand. Remaining work is
      authoring the legacy brands as **full Figma modes** + sync.
      See `packages/design-tokens/context/brand-matrix.md`.
- [ ] **White-label fonts per brand** (#101) — brand-scoped font tokens + fallback stack.
- [ ] **New assets wired to themes** (#175) — icon/illustration assets paired per brand.
- [x] **Token contract & versioning** (#176) — define what a breaking token change is; how
      `design-tokens` semver maps to `tokens-pd` and consumers.
      See `packages/design-tokens/context/token-contract.md`.
- [ ] **Style Dictionary hardening** — test coverage for normalization, light-dark,
      gradients, brand scoping (partly done).
- [ ] **Design context → design-grammar package** (#88) — relocate design context.

### E2 — `ui-react` component buildout · #103 _(main thrust, foundational-first ladder)_

Per-component DoD (from `packages/ui-react/AGENTS.md`): Vitest test · Storybook
story (all variants, **light + dark**) · Changeset · optional Figma Code Connect.

- **Tier 0 — done:** Button ✅, Switch ✅
- **Tier 1 — form & overlay primitives** (unblocks most composites)
  - [ ] Input · Label · Field · Textarea
  - [ ] Checkbox · Radio Group · Select
  - [ ] Separator · Popover · Tooltip · Dialog
- **Tier 2 — composites on primitives**
  - [ ] Combobox · Dropdown Menu · Number Field · Slider
  - [ ] Tabs · Accordion · Toggle Group · Collapsible
  - [ ] Avatar · Badge · Chip/Tag · Alert · Progress · Skeleton · Spinner
  - [ ] Toast/Sonner — fix imperative `toast()` export split (#100) when ported
- **Tier 3 — design-system / layout / shell** (proposed below)
- **Tier 4 — complex / data** → see E3, E5

#### Tier 3 — proposed list (the main scope lever)

Grouped; **★ = recommended must-have for v1**, others trimmable if capacity is tight.

- **Layout & structure:** ★Card · ★Stack · ★Grid · ★Section · Aspect Ratio ·
  ★Scroll Area · Resizable
- **App shell & navigation:** ★App Shell · ★Sidebar · Secondary Menu ·
  ★Navigation Menu · ★Breadcrumb · ★Pagination · ★Page Header · ★Page Content ·
  Auth Layout · Dashboard Layout · Split Layout
- **Feedback & status:** ★Empty _(Skeleton/Spinner/Alert/Badge/Chip/Tag/Progress/
  Toast live in Tier 2)_
- **Form composition:** ★Form · Filter
- **Acronis dashboard widgets:** Widget (base) · Widget Alert · Widget Placeholder ·
  Widget Text · Widget Progress (chunks / tiers) · Widget Protection Status ·
  Widget Protection Summary · Widget Table Data

> The **widget family** (8 components) and the three extra layout templates
> (Auth/Dashboard/Split) are the most natural trim candidates — they're composed
> from lower tiers and are app-specific, so consumers can compose them locally if
> v1 slips. Keep them in scope, cut here first if needed.

### E3 — Data components / Table · #104 _(highest value, hardest — now in ui-react)_

Depends on Tier 1–2 primitives (Tooltip, Dropdown, Checkbox, Scroll Area).

- [ ] Table base + scroll-friendly layout primitives (#45, #49)
- [ ] Sticky / frozen columns (#44)
- [ ] Resizable columns (#46)
- [ ] Column header sort — inline-toggle variant, not Dropdown-only (#48)
- [ ] Tooltip portal escape hatch (#47) — port as ui-react Tooltip feature
- [ ] Data Table (composition layer) (#86)
- [ ] **Full complex set in v1:** Calendar · Date Picker · Tree · Chart · Carousel · Command

### E4 — Figma ↔ Code · #105 _(force-multiplier)_

- [ ] Code Connect rollout beyond Button across shipped ui-react components
- [ ] Figma connect template (#87)
- [ ] Document/automate one-way token sync (Figma → `design-tokens`)
- [ ] design-to-code workflow guidance for contributors

### E5 — Icons & assets · #106

- [ ] Complete icon pack generation coverage from `design-assets`
- [ ] Asset manifest validation & per-pack subpath export audit
- [ ] Tree-shaking / bundle-size checks for `icons-react`

### E6 — Docs & adoption · #107

- [ ] **Migration guide: legacy → ui-react** (component mapping + codemods where viable)
- [ ] Deprecation notice + timeline published on `ui-legacy`
- [ ] Docs site (apps/docs) coverage tracks ui-react component ladder
- [ ] kitchen-sink kept as living token/component/icon reference

### E7 — Quality & release engineering · #108

- [ ] CI gates: typecheck + lint + test green per workspace (some in flight)
- [ ] Accessibility testing baseline (keyboard, ARIA, contrast) per component
- [ ] Visual regression (Storybook-based) light + dark
- [ ] Changesets discipline + release pipeline reliability
- [ ] Define **ui-react 1.0 criteria** (which components, a11y bar, stable token contract)

---

## v1 definition (target: end of Q3 2026)

ui-react v1 = **all basic Base UI components** (E2 Tier 1 + Tier 2) **+ our
design-system components** (layout/shell, brand-specific elements — E2 Tier 3)
**+ selected complex components** led by **Table** (E3). Backed by the stable
token/theme contract (E1), a11y baseline and visual regression (E7), and a
migration guide (E6). On v1, `ui-legacy` goes security-only.

## Sequencing (calendar — today is 2026-06-05)

| Phase                    | When          | Focus                                                                                              | Exit criteria                                           |
| ------------------------ | ------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **P1 — Foundation**      | **Jun 2026**  | E1 theme delivery + brand matrix + token contract; freeze legacy + publish deprecation notice (E6) | Brand themes generated from new pipeline; legacy frozen |
| **P2 — Primitives**      | **Jun–Jul**   | E2 Tier 1 + a11y baseline (E7) + Code Connect rollout (E4)                                         | Form/overlay primitives shipped to DoD                  |
| **🎯 Q3 consumer drop**  | **early Jul** | Usable base set (Tier 1 + core Tier 2) published for consuming teams                               | Consumers can build real screens on ui-react            |
| **P3 — Composites + DS** | **Jul–Aug**   | E2 Tier 2 + Tier 3 design-system/layout + E5 icons + migration guide (E6)                          | Composite + layout surface complete                     |
| **P4 — Data/Table**      | **Aug–Sep**   | E3 Table cluster (#44–49, #86) + remaining complex components                                      | Table: sticky/resizable/sort + Data Table               |
| **🎯 v1 GA**             | **end Sep**   | E7 1.0 criteria + visual regression; legacy → security-only                                        | ui-react v1 released; legacy EOL date set               |

> **Reality check.** ui-react is **2/82 components** today; v1 by end-Q3 is
> aggressive. Hitting it needs (a) parallel component work — multiple devs and/or
> the `/ui-kit-pipeline` agent flow per component, (b) the Q3 consumer drop scoped
> to a _usable subset_, not full parity, and (c) E1 truly done first so component
> work doesn't churn on token changes. If capacity is limited, the lever is
> **narrowing the Tier-3 design-system list and the complex-component set**, not
> slipping the date.

---

## Resolved scope (2026-06-05)

- **Brands**: legacy four + any new Figma brand (data-driven generation). ✔
- **Capacity**: **2 full-time + 2 part-time ≈ 3 FTE.** Matches the comfortable
  baseline for end-Q3 v1 including the trim buffer. Aim part-timers at the
  well-scoped S/M tasks (widgets, layout, docs); reserve full-timers for the
  critical path (E1, then Select/Combobox/Table cluster/Chart). ✔
- **Tier-3**: proposed above (★ must-haves; widgets + extra layouts trimmable). ✔
- **Complex set**: full — Table, Calendar, Date Picker, Tree, Chart, Carousel, Command. ✔

## Open decisions — now tracked as issues

To ratify early (they shape APIs/scope); tracked on the board under their epic:

1. **RSC/Next support** → #192 (E2, P2) — settle before primitive detail.
2. **A11y level + browser matrix** → #193 (E7, P2).
3. **Codemods vs manual migration** → #194 (E6, P3).

---

## Issue → epic map

| Issue     | Title                                   | Epic            |
| --------- | --------------------------------------- | --------------- |
| #101      | White-label brand fonts                 | E1              |
| #88       | Move design context to design-grammar   | E1              |
| #100      | sonner toast() imperative API split     | E2 (Tier 2)     |
| #87       | Figma connect template                  | E4              |
| #86       | Complete Table implementation           | E3              |
| #49 / #45 | Scroll-friendly table layout primitives | E3              |
| #48       | Column header inline-toggle sort        | E3              |
| #47       | Tooltip portal escape hatch             | E3 / E2 Tooltip |
| #46       | Resizable columns                       | E3              |
| #44       | Sticky / frozen columns                 | E3              |
| #192      | RSC/Next support                        | E2              |
| #193      | A11y level + browser matrix             | E7              |
| #194      | Codemods vs manual migration            | E6              |
