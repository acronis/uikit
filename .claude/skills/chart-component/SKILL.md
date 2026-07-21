---
name: chart-component
description: >
  Land a first version of a per-type chart component (BarChart, LineChart,
  AreaChart, PieChart, ScatterChart, ComposedChart, RadarChart, FunnelChart,
  RadialBarChart, Treemap) into packages/ui-react by porting the matching
  apps/demo recharts playground, for when a "ready for dev" Figma mockup does not
  exist yet. The new component is a typed recharts composition that CONSUMES the
  shared Chart primitives (ChartContainer / ChartTooltip / ChartLegend) and never
  modifies them — with CVA variants (orientation, layout, …), a ui-spec, tests,
  stories (including an open-tooltip VR story), and an apps/docs page. Uses
  existing --ui-* semantic tokens only (the dedicated --ui-chart-* palette is a
  pending upstream design pass); Figma Code Connect is deferred. Invoke with
  /chart-component <ChartName> [playground-name] [--update].
---

# recharts playground → ui-react chart component (design-pending v1)

A repeatable recipe for landing a **first version** of a **per-type chart
component** into `packages/ui-react`, for when finished Figma mockups don't exist
yet. It produces the **same shape of output** every other ui-react component has
— component, tests, stories, VR baselines, a 7-file ui-spec, and an `apps/docs`
page — and is a **chart-specialized sibling** of
[`/legacy-component`](../legacy-component/SKILL.md). Where this file is silent,
`/legacy-component`, [`/figma-component`](../figma-component/SKILL.md), and the
workspace contracts govern.

**Why a dedicated skill (vs `/legacy-component`):** a chart type is **not** a Base
UI primitive. It's a **recharts composition** that wraps the shared `Chart`
theming primitives. So five things differ from the generic recipe:

1. **Source is an `apps/demo` recharts playground**, not a Base UI component.
2. **Composition is recharts + the shared `Chart` primitives** — no `@base-ui/react`,
   no `useRender`/`mergeProps`, no Radix.
3. **It CONSUMES the shared `Chart` primitives and MUST NOT modify them.** It
   imports `ChartContainer` / `ChartTooltip` / `ChartTooltipContent` /
   `ChartLegend` / `ChartLegendContent` from `../chart`. This keeps every chart
   type independent (no cross-type or shared-primitive conflicts).
4. **No new tokens.** Series colors are caller-supplied via `config` referencing
   **existing semantic `--ui-*` tokens**; chart chrome inherits the shared
   primitives' tokens. The dedicated `--ui-chart-*` data-viz palette is a pending
   upstream design deliverable — do not hand-author it.
5. **An open-tooltip VR story is mandatory** — the tooltip is hover-only and is
   never captured by a static snapshot otherwise (see Phase 6).

Read the workspace contracts first — they override anything here on conflict:

- Root: [AGENTS.md](../../../AGENTS.md), [context/conventions.md](../../../context/conventions.md)
- ui-react: [packages/ui-react/AGENTS.md](../../../packages/ui-react/AGENTS.md),
  [packages/ui-react/context/conventions.md](../../../packages/ui-react/context/conventions.md)
- ui-spec: [packages/ui-spec/AGENTS.md](../../../packages/ui-spec/AGENTS.md)

**Reference implementations to copy patterns from:**

- The shared primitives you consume: `packages/ui-react/src/components/ui/chart/chart.tsx`
  and its spec `packages/ui-spec/components/chart/`.
- The recharts source you port from: `apps/demo/src/components/<X>ChartPlayground.tsx`.
- General ui-react component shape (forwardRef, CVA, index, tests, stories):
  `packages/ui-react/src/components/ui/button/`.

---

## Invocation

```
/chart-component <ChartName> [playground-name] [--update]
```

| Arg               | Meaning                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| `ChartName`       | PascalCase React name for the new component (`BarChart`, `AreaChart`). kebab files (`bar-chart/`).                 |
| `playground-name` | The `apps/demo` playground basename if it differs from the default (`<ChartName>Playground`). See the table below. |
| `--update`        | Component already exists in ui-react — refresh it against the playground.                                          |

### Chart-type quick reference

| ChartName        | recharts primitives                  | `apps/demo` playground             | Typical CVA variants                            |
| ---------------- | ------------------------------------ | ---------------------------------- | ----------------------------------------------- |
| `BarChart`       | `BarChart`, `Bar`, `XAxis`/`YAxis`   | `BarChartPlayground.tsx`           | `orientation` v/h · `layout` grouped/stacked    |
| `LineChart`      | `LineChart`, `Line`                  | `ChartPlayground.tsx` (demo lines) | `curve` linear/monotone/step · `dots` on/off    |
| `AreaChart`      | `AreaChart`, `Area`                  | `AreaChartPlayground.tsx`          | `layout` single/stacked · `fill` solid/gradient |
| `PieChart`       | `PieChart`, `Pie`, `Cell`            | `PieChartPlayground.tsx`           | `shape` pie/donut                               |
| `ScatterChart`   | `ScatterChart`, `Scatter`            | `ScatterChartPlayground.tsx`       | (series) — usually none                         |
| `ComposedChart`  | `ComposedChart`, `Bar`+`Line`+`Area` | `ComposedChartPlayground.tsx`      | (per-series `type`)                             |
| `RadarChart`     | `RadarChart`, `Radar`, `PolarGrid`   | `RadarChartPlayground.tsx`         | (series)                                        |
| `FunnelChart`    | `FunnelChart`, `Funnel`              | `FunnelChartPlayground.tsx`        | (orientation if present)                        |
| `RadialBarChart` | `RadialBarChart`, `RadialBar`        | `RadialChartPlayground.tsx`        | (stacked)                                       |
| `Treemap`        | `Treemap`                            | `TreemapChartPlayground.tsx`       | (aspectRatio)                                   |

Confirm the exact variant set from the playground in Phase 1 — the table is a
starting point, not a contract.

---

## Phase 0 — Readiness gate (prerequisite)

Run the read-only [`/component-readiness`](../component-readiness/SKILL.md) audit
first. Audit **`Chart`** (the primitives you'll consume must be sound) and, on
`--update`, the target chart too:

```bash
bash .claude/skills/component-readiness/scripts/audit.sh Chart          # primitives you depend on
bash .claude/skills/component-readiness/scripts/audit.sh <ChartName>    # on --update only
```

A brand-new chart legitimately reports `INCOMPLETE` (no Figma node / no
`COMPLETE` Code Connect) — expected, **not** a blocker. A `DRIFT` verdict on
`Chart` is a blocker: fix the primitives first (that's a `Chart`/B1-type change,
not this component's job).

---

## Phase 1 — Read the playground (instead of a Figma node)

The `apps/demo` playground is the canonical inventory of what this chart type
does. Read it plus the shared primitives' story:

```bash
cat apps/demo/src/components/<ChartName>Playground.tsx        # or the name from the table
cat packages/ui-react/src/components/ui/chart/__stories__/chart.stories.tsx   # how the primitives compose
```

Extract, and **write down before coding**:

- **Variants** — the toggles the playground exposes (orientation, stacked vs
  grouped, donut vs pie, curve type, dots, …). These become the component's
  **`cva` keys** and the spec's `api.yaml` enums.
- **recharts primitives** — exactly which `<XChart>` + series (`<Bar>`/`<Line>`/…)
  - axes/grid/polar parts are used, and their props (`radius`, `stackId`,
    `type`, `dataKey`, `nameKey`, `innerRadius`, …).
- **Data shape** — the array-of-objects the chart consumes, and the `config`
  (series `key → { label, color }`). This drives the component's `data` /
  `config` prop types.
- **Chrome usage** — whether it renders `ChartTooltip`/`ChartLegend` and with
  what content, so the new component wires the same shared primitives.

> **Adapt, don't transliterate.** The playground hand-composes recharts inside a
> `ChartContainer`. Your component **encapsulates** that composition behind a
> typed `data`/`config` API + CVA variants — the consumer no longer hand-writes
> recharts children.

---

## Phase 2 — Design the API, tokens & composition (decide before coding)

### 2a. Component API

A chart component takes **data + config + variant props**, and renders the shared
`ChartContainer` with the recharts chart inside. Shape (adapt per type):

```ts
export interface BarChartProps
  extends
    Omit<React.ComponentProps<'div'>, 'children'>,
    VariantProps<typeof barChartVariants> {
  data: ReadonlyArray<Record<string, string | number>>;
  config: ChartConfig; // series key → { label, color }, from ../chart
  dataKeys: string[]; // which series to plot
  xKey: string; // category axis key
  showLegend?: boolean;
  showTooltip?: boolean;
}
```

`ChartConfig` and the primitives are **imported from `../chart`** — do not
redefine them. CVA (`barChartVariants`) carries the visual variants
(`orientation`, `layout`, …). Expose them via `VariantProps` (Button is the shape
reference).

### 2b. Tokens — existing semantic only, no new tier

- **Chart chrome** (tooltip/legend/axes/grid) is already themed by the shared
  primitives — you get it for free by rendering `ChartContainer` + `ChartTooltip`
  - `ChartLegend`. Don't restyle it.
- **Series colors** are **caller-supplied** via `config` and flow through the
  primitives' `--color-<key>` mechanism. In the component's **own stories/demo**,
  reference **existing semantic `--ui-*` tokens** (e.g.
  `--ui-background-brand-secondary`, `--ui-background-status-strong-*`) — never a
  new token, never hex.
- **There is no `--ui-chart-*` palette yet.** Flag in the spec + to the user that
  a dedicated data-viz palette is a pending upstream design deliverable. **Known
  caveat to document:** borrowed brand/semantic tokens are **brand-dependent**
  (e.g. `--ui-background-brand-secondary` is blue in `default` but a neutral grey
  in `deep_sky_itkontoret`), so demo series colors are not brand-stable until the
  real palette lands. Prefer `--ui-background-status-strong-*` (chromatic in both
  brands) for demo series over `brand-secondary` where a stable color matters.

Verify every `--ui-*` you reference resolves:

```bash
grep -oE '\-\-ui-[a-z0-9-]+' packages/ui-react/src/components/ui/<name>/ -r | sort -u
# each must exist:
grep -qrF -- "--ui-…" packages/tokens-pd/css/ && echo OK || echo MISS
```

### 2c. Composition — consume, never modify

- Import `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`,
  `ChartLegendContent`, and `type ChartConfig` from `../chart`.
- **Never edit `../chart/chart.tsx`.** If the primitives are missing something
  this type needs, stop and raise it as a `Chart`-primitives change (separate
  task) — do not fork or inline the primitives here.
- recharts primitives come from `recharts` (already a dependency). Set
  `isAnimationActive={false}` on series (matches the existing stories; keeps VR
  deterministic).

---

## Phase 3 — Implement in packages/ui-react

Create `packages/ui-react/src/components/ui/<name>/`:

```
<name>.tsx
<name>.figma.tsx          # Code Connect — NEEDS_FIGMA_URL skeleton
index.ts
__tests__/<name>.test.tsx
__stories__/<name>.stories.tsx
__stories__/<name>.generated.stories.tsx   # produced in Phase 4
```

Conventions (mirror Button): `React.forwardRef` + `displayName`; props interface

- `VariantProps`; `cva` for the visual variants merged with `cn()`. Render the
  shared `ChartContainer` with the recharts chart + series built from `dataKeys` +
  `config`. Export from `index.ts`, then add an **alphabetical** line to
  `src/index.ts`. **No new `@import`** in `src/styles/index.css` (you add no token
  tier; the shared primitives + semantic tiers are already loaded).

**Start the file with `'use client';`.** A chart type instantiates raw recharts
elements (`<XChart>`, `<Bar>`/`<Line>`, axes, grid) **outside** the shared
`chart.tsx` boundary, and recharts is hook-driven (`ResponsiveContainer`,
`Tooltip`), so the composition needs its own client boundary — `chart.tsx`'s
directive doesn't cover the parts you construct. recharts ships no `'use client'`
of its own, so a bare Server Component importing this chart would break without
it. (The broader "which ui-react components should carry the directive" question
is a separate, package-wide design call — charts are the clear-cut case.)

**Code Connect — deferred.** Write `<name>.figma.tsx` with the `NEEDS_FIGMA_URL`
status marker, real prop mappings, placeholder URL (identical to
`/legacy-component` Phase 3).

---

## Phase 4 — Spec in packages/ui-spec (7-file format)

Create `packages/ui-spec/components/<name>/` — same 7-file format and hard rules
as `/legacy-component` Phase 4:

| File               | Chart-specific notes                                                                                                                                                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.yaml`       | `status: draft`, **no `figma:` block**, `category: Data Display`.                                                                                                                                                                  |
| `anatomy.yaml`     | `root` = the chart container; `parts` = plot area, axes, grid, series, legend, tooltip (each id must appear in `schematic`).                                                                                                       |
| `api.yaml`         | `contract` (data/config/dataKeys/variants/events) + adapters (react `implemented`). `variant` enums must equal the `cva` keys.                                                                                                     |
| `tokens.yaml`      | Names only. The semantic `--ui-*` tokens the component/stories reference (series + any chrome it overrides). No `--ui-chart-*`.                                                                                                    |
| `behavior.md`      | Given/When/Then (renders series from data/config; tooltip on hover/`defaultIndex`; empty-data state).                                                                                                                              |
| `accessibility.md` | recharts `accessibilityLayer` is **on by default** (v3); pair the chart with a text alternative / `aria-label`; don't rely on color alone (legend + tooltip carry labels). Note recharts issue #4809 on heavily-customized charts. |
| `README.md`        | When to use / not use; note it's a design-pending v1 (palette pending).                                                                                                                                                            |

Validate continuously: `pnpm --filter @acronis-platform/ui-spec test`.
Generate the states story: `pnpm --filter @acronis-platform/ui-spec generate:stories`
(a data-driven chart usually needs a `RENDER` hint in
`packages/ui-spec/scripts/generate-stories.ts` — an `extraImports` + `sample`
composing the chart with sample data; see the legacy-component note on the
whitespace churn + `git checkout --` the unrelated siblings).

Hand-write `<name>.stories.tsx` mirroring the playground: **one story per
variant** (orientation/layout/shape/…), plus the mandatory open-tooltip story
(Phase 6). Wide `argTypes` for every meaningful prop.

**Mandatory themed-surface decorator.** The `ChartContainer` is transparent by
design — it inherits the surface it sits on (usually a `Card`). Without a
backdrop, dark-mode VR flips the token-driven text/grid but leaves the chart on
an unthemed (white) backdrop, so the dark baseline looks broken. Wrap **every**
story via a meta-level `decorators` entry on a themed surface (mirror the shared
`chart.stories.tsx`), so both the light and dark baselines are legible:

```tsx
decorators: [
  (Story) => (
    <div className="rounded-lg border border-border bg-background p-6 text-foreground">
      <Story />
    </div>
  ),
],
```

---

## Phase 5 — Document in apps/docs

Identical to `/legacy-component` Phase 5: a live demo
(`apps/docs/src/components/demos-react/<name>.tsx`, `'use client'`, network-free),
an MDX page (`apps/docs/content/docs/components/<name>.mdx` — Usage / Examples /
`<AutoTypeTable>`), and a `meta.json` nav entry under **Data Display**. Verify:

```bash
pnpm --filter @acronis-platform/uikit-docs typecheck
pnpm --filter @acronis-platform/uikit-docs build
```

---

## Phase 6 — Verify, VR & changeset

```bash
pnpm --filter @acronis-platform/ui-react test
pnpm --filter @acronis-platform/ui-react typecheck
pnpm --filter @acronis-platform/ui-react lint
pnpm --filter @acronis-platform/ui-react build
pnpm --filter @acronis-platform/ui-spec test
pnpm -r typecheck
```

Changeset for the **published** package only (`ui-spec` is private):

```
.changeset/<name>-component.md
---
'@acronis-platform/ui-react': minor   # patch on --update
---
Add `<Name>` (initial version ported from the apps/demo playground; design + data-viz palette reconciliation pending).
```

### Visual regression — including the mandatory open-tooltip story

Every story is a VR case with **light + dark** baselines. **The tooltip is
hover-only**, so a normal story never snapshots the tooltip surface. Add a story
that opens it statically so the tooltip chrome is covered (recharts v3
`defaultIndex`):

```tsx
export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[300px] w-[500px]">
      <BarChart data={data}>
        {/* …axes/grid/series… */}
        <ChartTooltip defaultIndex={2} content={<ChartTooltipContent />} />
      </BarChart>
    </ChartContainer>
  ),
};
```

Regenerate **both** modes and review the PNGs (open the `--tooltip-open.png` and
confirm the tooltip is actually visible; if blank, add `active` alongside
`defaultIndex`):

```bash
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:update:all
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:all
```

Never commit macOS/Windows-rendered baselines. Delete both baselines when you
remove/rename a story.

**Cover the chrome toggles with a VR story, not a unit test.** recharts only
paints its SVG once `ResponsiveContainer` has real dimensions, which the unit env
(happy-dom) never provides — so a Vitest test **cannot** assert that
`showGrid`/`showTooltip`/`showLegend` actually removed anything (the grid/legend
are never in the DOM there). Add a `NoChrome` story with those toggles off (and a
squared `barRadius`/no dots) so a toggle silently becoming a no-op changes a real
baseline; keep a unit test only to exercise the prop paths (renders without
crashing).

---

## Output checklist (done = all green)

- [ ] `src/components/ui/<name>/<name>.tsx` — **starts with `'use client';`**;
      recharts composition wrapping the **imported** `ChartContainer`/tooltip/legend;
      `forwardRef`; CVA variants; **no edit to `../chart/chart.tsx`**;
      **no new token / no `--av-*` / no hex**.
- [ ] `index.ts` + alphabetical export line in `src/index.ts`.
- [ ] `__tests__/<name>.test.tsx` — renders series from data/config, variant
      classes/props, chrome-toggles-off path, empty-data, ref.
- [ ] `__stories__/<name>.stories.tsx` (one story per variant + **`TooltipOpen`** + a chrome-off **`NoChrome`**), wrapped by the **themed-surface `decorators`**
      entry so dark VR is legible.
- [ ] VR baselines (light + dark) for **every** story incl. `TooltipOpen`,
      regenerated in Docker and reviewed; orphans deleted.
- [ ] `<name>.figma.tsx` — `NEEDS_FIGMA_URL` skeleton with real prop mappings.
- [ ] `packages/ui-spec/components/<name>/` — 7 files, `status: draft`, no
      `figma:` block, `ui-spec test` green.
- [ ] `apps/docs`: live demo + MDX + `meta.json` nav (Data Display); `uikit-docs build` passes.
- [ ] Changeset for `@acronis-platform/ui-react` (`minor`).
- [ ] test / typecheck / lint / build pass; `pnpm -r typecheck` clean.
- [ ] User told: design-pending v1; series colors use borrowed semantic tokens
      (brand-dependent) until the `--ui-chart-*` palette lands.

---

## What this skill deliberately does NOT do

- **Never modifies the shared `Chart` primitives** (`chart.tsx`). It imports them.
  A primitives gap is a separate `Chart` task.
- **No new tokens / no `--ui-chart-*` palette.** Series colors are borrowed
  existing semantic tokens; the data-viz palette is a pending upstream deliverable.
- **No Figma reads, no `COMPLETE` Code Connect, no `figma:` block.** Filled in by
  `/figma-component <Name> <url> --update` once mockups land.
- **No Base UI / Radix.** Charts are recharts compositions, not interactive primitives.
