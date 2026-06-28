# Proposal: Kit Consistency & Screen Audit System

- **Status:** Proposed (not yet adopted)
- **Date:** 2026-06-28
- **Owner:** Leonid Romanov
- **Affects:** `packages/ui-spec`, `packages/ui-react`, `packages/tokens-pd`,
  the `ui-kit-pipeline` workflow, and the AI skill set.
- **Builds on:** `packages/ui-spec/context/component-specs-proposal.md`
  (the framework-agnostic specs + grammar proposal already on file).
- **Reference implementations:** the Acronis Vue kit `@uikit/ui-kit` packages
  `grammar` and `screens` (separate repo) — we borrow their shapes, not their code.

---

## 1. Problem

New UI kits ship with **subtle inconsistencies** that no current check catches.
Our existing automation is **per-component and self-referential**:

- VR baselines compare a component story to **its own** prior screenshot — they
  never notice that Button is 36px but Input is 40px, or that two components use
  two different "danger" reds.
- `ui-spec` conformance checks that a spec matches **its own** implementation
  (cva keys ↔ `api.yaml`, token refs resolve) — not that components agree with
  **each other**.
- `component-readiness` (`audit.sh`) is a static per-component pre-flight.
- Code review is the only place where "does this look right **next to** the
  other components, on a real screen?" is asked — and humans miss subtle drift.

Nothing checks the two things that actually make a kit feel coherent:

1. **Cross-component consistency** — every component obeys the same spacing grid,
   control height, radius, focus ring, token vocabulary, density, and a11y
   contract.
2. **Whole-screen composition** — when real components are assembled into a real
   product screen, they align, share rhythm, don't fight for the same job, and
   look intentional together.

This session is itself the evidence: the App Shell review surfaced a left-aligned
search, a scrollbar that cropped the selected row, a grey-ribbon collapsed state,
and a 2px group header — all **composition** defects invisible to per-component
VR, found only by eyeballing the assembled screen. We want those found
**automatically**, and we want each finding to **harden the kit** so it can't
recur.

## 2. Goals / non-goals

**Goals**

- A machine-readable **catalog of cross-component rules** (the "grammar") with
  severity tiers, wired to specs, tokens, and screens.
- A **canonical checklist** of common kit inconsistencies, each mapped to an
  automated detector (or flagged as human-only) and a severity.
- A **complete-screen consistency audit**: render real screens from real
  `ui-react` components and run structural + visual detectors **and** an AI
  visual reviewer.
- **Reference-implementation diffing** (legacy, Vue kit, Figma) to catch missing
  variants / drifted tokens / missing rules.
- A **self-improving loop**: every audit finding becomes a fix **and** a new
  permanent check, so component quality ratchets up over time.
- **AI- and human-compatible**: every layer is structured data (TS/YAML
  registries) plus human docs (MD); reports and proposed fixes in both.
- New **AI skills** that make all of the above one command.

**Non-goals**

- Re-implementing tokens (we have `tokens-pd`) or replacing VR (we extend it).
- Importing the Vue kit's code or Vue-specific shape — we adopt the _model_.
- Pixel-perfect Figma parity enforcement (we diff and report, not block on it).

## 3. The four-layer model

We already have layers 1–2 and a partial 3. This proposal completes 3 and adds 4.

| Layer       | Question                            | Today                                    | This proposal                      |
| ----------- | ----------------------------------- | ---------------------------------------- | ---------------------------------- |
| **Tokens**  | what values                         | `tokens-pd` (`--ui-*`)                   | unchanged                          |
| **Specs**   | what a component is                 | `ui-spec/components/*` (7-file)          | unchanged                          |
| **Grammar** | how components must agree & compose | `ui-spec/patterns/*` (compositions only) | **add a rule registry**            |
| **Screens** | how a product is assembled          | —                                        | **add screen descriptors + audit** |

The Vue kit proves the shape: `grammar` ships **31 typed rules** (6 categories,
`must/should/may`, with `tokens`, `wcag`, `relatedRules`) + **14 composition
patterns** + an **override** mechanism; `screens` ships a 6-level descriptor
(`ProductDescriptor → ScreenDescriptor → ScreenRegion → ComponentInstance` +
state machines + navigation flows) with `$bind`/`$token` prop values and Figma
mapping. We borrow both, adapted to `--ui-*` and our React reality.

---

## 4. The canonical inconsistency checklist

This is the heart of the request: a **taxonomy of common kit inconsistencies**,
each with a detection method and severity. It lives as
`packages/ui-spec/grammar/CHECKLIST.md` (human) and is **mirrored by the rule
registry** (machine). `D` = detection: `lint` (static AST/CSS), `spec`
(ui-spec conformance test), `screen` (rendered-screen detector), `vr` (visual
baseline), `ai` (AI visual reviewer), `ref` (reference diff), `human` (review
only). `S` = default severity (`must`/`should`/`may`).

### 4.1 Tokens & color

| #   | Inconsistency                                                                            | D          | S      |
| --- | ---------------------------------------------------------------------------------------- | ---------- | ------ |
| T1  | Hard-coded hex/hsl/rgb instead of a `--ui-*` token                                       | lint       | must   |
| T2  | Bridged Tailwind name with **no** ui-react bridge → silent invalid (e.g. `bg-card`)      | lint       | must   |
| T3  | Opacity-modifier color hack (`bg-primary/90`) instead of a state token                   | lint       | should |
| T4  | Interaction state wired to the wrong token (`hover:` not using `*-hover`)                | lint+spec  | should |
| T5  | One semantic role rendered by **different tokens** across components (two "danger" reds) | ref+screen | must   |
| T6  | Dangling `var(--ui-*)` (already covered)                                                 | spec       | must   |

### 4.2 Spacing & sizing

| #   | Inconsistency                                                                       | D           | S      |
| --- | ----------------------------------------------------------------------------------- | ----------- | ------ |
| Z1  | Off-grid spacing (not a 4px multiple / not a spacing token)                         | lint        | should |
| Z2  | **Control-height drift** — Button/Input/Select/Combobox heights disagree in one row | screen      | must   |
| Z3  | Border-radius drift between sibling controls                                        | screen+lint | should |
| Z4  | Padding-tier drift (same role, different padding)                                   | screen      | should |
| Z5  | Touch target below the kit minimum                                                  | lint+screen | must   |
| Z6  | Icon-size drift within a row/cluster (16 next to 20)                                | screen      | should |

### 4.3 Typography

| #   | Inconsistency                                           | D        | S      |
| --- | ------------------------------------------------------- | -------- | ------ |
| Y1  | Off-scale font size                                     | lint     | should |
| Y2  | Line-height off the type ramp                           | lint     | should |
| Y3  | Font-weight outside the allowed set                     | lint     | should |
| Y4  | Label casing/format drift (Title Case vs sentence case) | ai+human | may    |

### 4.4 Anatomy & state treatment

| #   | Inconsistency                                                      | D           | S      |
| --- | ------------------------------------------------------------------ | ----------- | ------ |
| A1  | Focus-ring drift (token, width, offset differ across components)   | lint+screen | must   |
| A2  | Disabled treatment drift (opacity vs token vs nothing)             | screen+spec | should |
| A3  | Bare `border` (transparent in ui-react) instead of `border-border` | lint        | should |
| A4  | Missing part vs spec anatomy                                       | spec        | must   |
| A5  | Missing empty / loading / error state for a data component         | spec+screen | should |
| A6  | Empty-state / skeleton composition drift                           | screen+ai   | should |

### 4.5 Interaction & accessibility

| #   | Inconsistency                                   | D            | S      |
| --- | ----------------------------------------------- | ------------ | ------ |
| I1  | Interactive element with no accessible name     | lint+screen  | must   |
| I2  | Escape-close / focus-trap missing on an overlay | spec+screen  | must   |
| I3  | Hover/transition timing drift                   | lint         | may    |
| I4  | Tab order ≠ visual order                        | screen+human | should |
| I5  | Contrast below WCAG for text / UI               | screen       | must   |

### 4.6 Composition (screen-level — the new frontier)

| #   | Inconsistency                                                                 | D           | S      |
| --- | ----------------------------------------------------------------------------- | ----------- | ------ |
| C1  | Vertical-rhythm drift between sections                                        | screen+ai   | should |
| C2  | Misaligned baselines / left edges across adjacent components                  | screen      | should |
| C3  | Components not sharing the layout/alignment grid                              | screen+ai   | should |
| C4  | **Variant mismatch** — the primary action looks different across screens      | ref+ai      | must   |
| C5  | Z-index / layering violation                                                  | lint+screen | must   |
| C6  | Two components solving the same job differently on one screen                 | ai+human    | should |
| C7  | Density mismatch (compact table beside a roomy form)                          | screen+ai   | may    |
| C8  | Reserved-gutter / clipping defects (e.g. scrollbar cropping a full-bleed row) | screen      | should |

### 4.7 Cross-implementation drift

| #   | Inconsistency                                     | D   | S      |
| --- | ------------------------------------------------- | --- | ------ |
| X1  | ui-react variant set ≠ legacy ≠ Figma ≠ Vue spec  | ref | should |
| X2  | Token **value** drift (Figma vs `tokens-pd`)      | ref | must   |
| X3  | Component present in a reference but missing here | ref | may    |

The checklist is **append-only by the feedback loop** (§8): every new audit
finding that isn't already covered adds a row + a detector.

---

## 5. Part A — Grammar layer (rule registry)

Create `packages/ui-spec/grammar/` mirroring the Vue kit's shape, adapted:

```
packages/ui-spec/grammar/
├── rules/                # typed registry, one file per category
│   ├── tokens.ts  spacing.ts  typography.ts  anatomy.ts
│   ├── interaction.ts  accessibility.ts  composition.ts
│   └── index.ts          # allRules, getRule(), getRulesByCategory(), getMandatory()
├── overrides/            # project/component-scoped, approved deviations
│   └── schema.ts         # validateOverrides()
├── CHECKLIST.md          # §4, human-readable, 1:1 with the registry
└── __tests__/grammar.spec.ts
```

Rule shape (borrowed, `--ui-*`-native):

```ts
interface KitRule {
  id: string; // 'spacing/4px-grid', 'tokens/no-hardcoded-color'
  title: string;
  category:
    | 'tokens'
    | 'spacing'
    | 'typography'
    | 'anatomy'
    | 'interaction'
    | 'accessibility'
    | 'composition';
  severity: 'must' | 'should' | 'may';
  rule: string; // imperative, 1–2 sentences
  rationale: string;
  checklist: string; // back-link to the §4 row id (e.g. 'Z2')
  detector?: string; // id of the automated check that enforces it (or 'human')
  tokens?: string[]; // --ui-* it governs
  wcag?: string[];
  relatedRules?: string[];
}
```

Seed with the `must` rows from §4 (the cheap, high-value ones: hard-coded color,
control-height parity, focus-ring parity, accessible-name, contrast, variant
parity). `should`/`may` follow. The registry is the single source the lint, the
screen audit, and the AI reviewer all read — so a rule is defined **once**.

**Overrides** are how intentional deviations stay legal (e.g. the compact device
table): an approved, scoped, dated entry that the audit treats as a pass, not a
defect.

---

## 6. Part B — Static automated checks (`kit-lint`)

A new `pnpm --filter @acronis-platform/ui-react kit-lint` (and a ui-spec
counterpart) runs the **static** detectors over source + the **computed** token
vocabulary. It extends, not replaces, `ui-spec test` and `audit.sh`.

What it adds beyond today:

- **T1/T2/T3** — scan `.tsx` for hex/hsl/rgb literals, bridged names absent from
  the `@theme inline` block, and `/<number>` opacity hacks on color utilities.
- **T5 (static half)** — build a **role→token map** across all components; flag a
  role mapped to >1 token (e.g. two danger backgrounds).
- **Z1/Y1/Y2/Y3** — flag arbitrary values that aren't tokens or grid multiples.
- **A1/A3** — focus-ring class shape parity; bare `border`.
- **C5** — z-index literals outside the layer scale.
- Emit a single report keyed by checklist id + severity; `must` fails CI.

This is pure AST/string analysis — fast, no build, CI-friendly, same tier as the
existing `audit.sh`.

---

## 7. Part C — Screens layer + the complete-screen audit (centerpiece)

### 7.1 Screen descriptors

Create `packages/ui-spec/screens/` borrowing the Vue kit's hierarchy, trimmed to
what we can render today:

```
packages/ui-spec/screens/
├── products/<product>.yaml      # ProductDescriptor: screens[], flows[], entryScreen, grammar overrides
├── screens/<screen>.yaml        # ScreenDescriptor: regions[], components[], stateMachine, figma
└── __tests__/screens.spec.ts    # registry + reachability + ref-integrity checks
```

A `ScreenDescriptor` names **regions**, the **real `ui-react` components** in each
(by export name + props, with `$bind`/`$token` values), a **state machine**
(idle/loading/loaded/empty/error/…), and grammar **pattern/rule** refs. This is
the "screen spec" the request asks for, and `ProductDescriptor` (screens + flows

- entry) is the "app description".

### 7.2 The audit — reuse the infra we already have

The key realization: our Docker VR harness **already** renders stories in
Playwright and runs `page.evaluate` + `page.screenshot` with a tolerance
(`.storybook/test-runner.ts`). The screen audit is the same mechanism pointed at
**assembled screens** with **cross-component detectors** instead of self-diff.

> Proof-of-concept from this very session: I drove the running Storybook with
> `page.evaluate` to measure that the header search centered at x=551 vs the
> header's true center x=791 (C2/C3), and that the collapsed rail reserved an
> 11px scrollbar gutter cropping the selected row to right=37 instead of 48 (C8).
> Those are exactly the detectors below — already demonstrated, just not yet
> codified.

**Step 1 — render the screen.** Generate a `*.screen.stories.tsx` from each
descriptor (like `generate-stories.ts` does for component states), composing the
real components per region. The App Shell stories are already de-facto screens;
this generalizes them.

**Step 2 — structural detectors** (`page.evaluate`, deterministic, no AI):

- **Control-height parity (Z2):** collect computed heights of all interactive
  controls in a region; flag >1 height class.
- **Alignment grid (C2/C3):** collect left/right edges and text baselines of
  region children; flag edges that nearly-but-don't align (off by 1–6px).
- **Rhythm (C1):** gaps between sections vs the spacing scale.
- **Token usage on computed styles (T1/T5):** read `getComputedStyle` colors and
  map back to `--ui-*`; flag any color with no token origin, or a role using a
  second token.
- **Focus ring (A1):** focus each control, diff the ring.
- **Contrast (I5):** sample fg/bg pairs, compute ratio.
- **Reserved gutter / clipping (C8):** `offsetWidth − clientWidth`, element
  right-edge vs container.
- **Accessible name (I1):** every interactive node has a computed name.

Each detector emits findings keyed by checklist id + severity; `must` fails CI.

**Step 3 — visual baseline (existing VR).** The whole screen also gets a
light+dark baseline so unintended visual change is caught as today.

**Step 4 — AI visual review (`screen-audit` skill).** Feed the screenshot(s) +
the descriptor + the grammar rules to an agent that returns structured findings
for the **judgment** rows (C4/C6/C7/Y4/A6) the detectors can't measure —
"the secondary action competes with the primary", "this empty state doesn't match
the others". AI proposes; findings are filed, not auto-applied.

---

## 8. Part D — Reference-implementation diffing

A `kit-diff` report (skill-driven) compares our specs/grammar/screens against:

- **`ui-legacy`** — variant/prop coverage parity (X1, X3).
- **Figma** (Code Connect nodes + `get_variable_defs`) — token **value** drift
  (X2) and variant parity (X1/C4). Uses the same Figma MCP we already use.
- **The Vue `@uikit/ui-kit`** specs/grammar — missing rules or components (X3).

Output: a per-component diff table (what exists where, what drifted), feeding the
backlog and the feedback loop.

---

## 9. Part E — The self-improving loop (the most important part)

Every finding is recorded in a **discrepancy ledger**
(`packages/ui-spec/grammar/LEDGER.md` + a small registry) with: id, screen/
component, checklist row, severity, status, and **resolution**. The rule that
makes the system ratchet:

> **A finding is not "done" when the pixel is fixed. It's done when a permanent
> check exists so it can never recur.**

So each finding resolves into **one of**:

1. an existing detector already covers it → just fix + add a regression screen
   story/baseline;
2. it's a **new** cross-component rule → AI drafts a `KitRule` + a detector + a
   `CHECKLIST.md` row; a **human ratifies the severity**; it merges and now runs
   in CI forever;
3. it's an intentional deviation → an approved **override** entry.

AI is allowed to **propose** new rules/detectors and severities; a human owns the
`must` tier (only a person can make something block CI). This keeps it
self-improving **and** AI+human-compatible. Over a few months the checklist and
grammar are no longer guesses — they're the distilled history of every real
defect the kit ever shipped.

---

## 10. Part F — New AI skills

| Skill                               | Purpose                                                                                                                                                               |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/screen-spec <name>`               | Author/refresh a `ScreenDescriptor` (+ product flows) from an **app description** + Figma + existing component specs. Validates refs.                                 |
| `/screen-audit <screen\|all>`       | Render the screen, run the structural detectors **and** the AI visual review, emit a report + proposed grammar rules/fixes. The "complete screens consistency audit". |
| `/kit-consistency [component\|all]` | Cross-component static sweep: `kit-lint` + grammar `must` rules + role→token map + reference diff. The fast "is the kit coherent?" pass.                              |
| `/grammar-rule <id>`                | Add/curate a `KitRule` (usually born from an audit finding): registry entry + detector stub + `CHECKLIST.md` row + test. Human ratifies severity.                     |

**Workflow integration.** Add a **Screen Audit gate** to `ui-kit-pipeline` after
Review: a component PR that touches shared tokens/anatomy/variants triggers
`/kit-consistency`; a screen/feature PR triggers `/screen-audit`. The pipeline's
final Review thus _improves component quality_ because it judges each component
**in assembled context**, files defects into the ledger, and hardens checks — the
exact loop the request describes.

---

## 11. Rollout

- **Phase 0 (seed, ~1 PR):** `grammar/` registry + `CHECKLIST.md` with the §4
  `must` rows; encode the role→token map test in `ui-spec`.
- **Phase 1 (`kit-lint`):** static detectors (T/Z/Y/A static rows) + CI wiring;
  `/kit-consistency` skill.
- **Phase 2 (screens):** descriptor schema + 2–3 real screens (App Shell variants
  are ready-made), `*.screen.stories.tsx` generation.
- **Phase 3 (screen audit):** structural detectors in the test-runner +
  `/screen-audit` skill (detectors first, AI review second).
- **Phase 4 (reference diff + ledger):** `kit-diff`, the ledger, and the
  feedback-loop discipline baked into the pipeline gate.

Each phase is independently useful and ships behind its own PR + changeset where
it touches a published package.

## 12. Open questions

- Does `grammar/screens` live in `ui-spec` (private) or a new private package?
  (Recommend `ui-spec` — it already owns specs + patterns + the generator.)
- How strict is CI day one — `must` blocks, `should` warns? (Recommend yes.)
- Token value drift (X2): block, or report-only? (Recommend report-only until the
  Figma sync pipeline is the source of truth.)
- Reuse the Vue kit's `grammar` as a dependency, or fork the shape? (Recommend
  fork — it's `--av-*`/Vue-shaped; ours is `--ui-*`/React.)

## 13. References

- `packages/ui-spec/context/component-specs-proposal.md` — the specs+grammar
  proposal this extends.
- `packages/ui-spec/__tests__/specs.test.ts` — existing conformance checks to
  build on.
- `packages/ui-react/.storybook/test-runner.ts` — the Playwright `page.evaluate`
  - screenshot harness the screen audit reuses.
- `.claude/skills/component-readiness/` — the existing static audit pattern.
- Reference: `@uikit/ui-kit` `packages/grammar` (31 rules + 14 patterns +
  overrides) and `packages/screens` (ProductDescriptor → ScreenDescriptor →
  regions/components/state-machine/flows).
