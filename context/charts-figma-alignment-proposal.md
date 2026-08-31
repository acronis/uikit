# Charts — Figma alignment proposal

**Status: in progress.** Written 2026-08-24, last revised the same day.

Progress: **step 0b (Card) landed** via PR #673. **Step 1 (palettes) is
shipped** — PR [#685](https://github.com/acronis/uikit/pull/685), two commits.
**Step 2 (`ChartWidget`) is built** on `feature/chart-widget`, stacked on that
PR. Next: **step 5 (`Metric`) has to come before step 3**, because step 2 can't
demo its own metric row until `Metric` stops being a card — see D18.

The `ui-react` Figma library now ships eight "ready-ish" chart component sets
plus the `CardWidget*` family on the Cards page. The shipped `packages/ui-react`
chart suite was built ahead of those mockups (`/chart-component`, "no Figma node
yet"), so it diverges from them in four structural ways. This document is the
plan to close that gap.

Figma file: `lrU3ydIyvPYQNE6ixdsKtJ` (ui-react).

---

## 1. What Figma actually contains today

### 1.1 Chart pages (one page per type)

| Figma page / set | node          | variant axes                                         | maps to ui-react                                        |
| ---------------- | ------------- | ---------------------------------------------------- | ------------------------------------------------------- |
| `ChartArea`      | `8174:22232`  | `size` sm·md·lg, `withProjections`                   | `area-chart`                                            |
| `ChartBar`       | `8700:55606`  | `type` horizontal·vertical, `size`, `hasProjections` | `bar-chart` (vertical) **+** `meter` (horizontal, §1.7) |
| `ChartDonut`     | `8811:172438` | `type` donut·radial, `size`                          | `pie-chart` (donut) **+** `radial-bar-chart`            |
| `ChartFunnel`    | `8811:175244` | `size`                                               | `funnel-chart`                                          |
| `ChartLine`      | `8811:175677` | `size`, `withProjections`                            | `line-chart`                                            |
| `ChartRadar`     | `9005:73086`  | `size`                                               | `radar-chart`                                           |
| `ChartScatter`   | `9005:73829`  | `size`                                               | `scatter-chart`                                         |
| `ChartTreeMap`   | `8999:72012`  | `size`                                               | `treemap`                                               |

**No mockup yet:** `composed-chart`, `histogram`, `sankey-chart`,
`confidence-cone`, full (non-donut) `pie-chart`, `category-bar`.
They are out of scope structurally, but they **do** inherit the palette from
step 1 (§7 D8) — a chart the design hasn't reviewed still must not paint
off-palette colours.

### 1.2 The `size` axis is a width, not a prop

Measured across every set, `size` only changes the frame **width** — the height
is constant per chart type:

| size | width | ChartArea/Line/Donut/Radar/Scatter/TreeMap h | ChartBar h                        | ChartFunnel h |
| ---- | ----- | -------------------------------------------- | --------------------------------- | ------------- |
| `sm` | 288   | 300                                          | 285 (horizontal) / 297 (vertical) | 253           |
| `md` | 592   | 300                                          | 285 / 297                         | 253           |
| `lg` | 896   | 300                                          | 285 / 297                         | 253           |

What visibly differs between sizes is _derived_: axis tick density (`Jan…Jun` at
`lg` vs `Jan/Jun/Dec` at `sm`), legend label truncation, and bar thickness.

**Decided (§7 D1):** `size` is the dashboard grid slot, not a prop. Model it as
width-responsive behavior (container queries + a `resolveTickInterval(width)`
helper) with a documented default height per type, and pin the three widths in
stories/VR baselines.

### 1.3 Every chart is wrapped in a Card

Every variant's tree is identical at the top:

```
COMPONENT (size=md, …)
└─ _CardLegacy                 ← Card
   ├─ _CardLegacyHeader        ← CardHeader: Title Row + Actions slot (Menu Button ⋯)
   └─ Body (SLOT)
      ├─ Content → Total       ← the metric strip (icon badge + value + unit [+ Tag])
      └─ <ChartType>           ← ChartWithLabels + CustomLegend
```

The card comes from the `Card` component set on the **Cards** page
(`10012:195993`), which already has the richer API:
`isCollapsable` (false · true-expanded · true-collapsed), `hasError`,
`hasHeader`, `hasBody`, `hasFooter`, `hasDescription`, `hasRename`,
`isDraggable`, `isSwitchable`, `hasAvatar`, and slots
`actions` / `extras` / `content` / `footer`.

The `_CardLegacy` prefix means the chart sets are still pinned to the **old**
card. Re-pointing them to `Card` is a Figma-side task (§7 Q3).

> **`Card` has been reconciled — PR #673 landed on `main` 2026-08-24.**
> See §1.3.1 for the API this plan now builds on.

#### 1.3.1 What PR #673 landed (merged — no longer a dependency)

`feat(card): reconcile Card with Figma design` brings `Card` in line with the
same Figma node (`10012:195993`) the chart sets wrap, and adds `CardSection`.
Its net effect on this plan is that **step 2 becomes a thin composition instead
of a new shell**:

- `CardHeader` absorbs the whole header: `title`, `description` +
  `hasDescription`, `extras` (inline slot next to the title), `actions` (end
  slot — this is the ⋯ menu the chart mockups show), plus `isDraggable`,
  `isSwitchable`, `hasAvatar`, `hasRename`, `isCollapsible`.
- `Card` (root) gains `hasError` and a `render` prop (Base UI `useRender`).
- **Breaking:** `CardTitle` and `CardDescription` are removed. Anything written
  against them today has to move to `CardHeader` props.
- `isCollapsable` is implemented by composing `CardHeader` +
  `AccordionContainer`, not a bespoke disclosure.
- New `CardSection` — six body-band variants (`slot`, `tag`, `list`,
  `table-actions`, `card-primary`, `card-secondary`) + `hasBottomBorder`.

**Merged** 2026-08-24 12:49 as `5fa81c81`, with two late fixes worth knowing:
`b8979803` bumped the `CardTitle`/`CardDescription` removal to a **major**
changeset, and `f77c3243` corrected stale comments and spec defaults.

Verified against `main`: the shipped API is what this plan assumed, plus a
`render` prop on `CardHeader` and `CardPartProps` (Base UI `useRender`), so
`ChartWidget` can render the header as another element if it ever needs to.
`Card`'s public surface is now `Card` · `CardHeader` · `CardContent` ·
`CardFooter` · `cardVariants` — no `CardTitle`, no `CardDescription`.

`CardSection` shipped with the six variants as planned. Padding is
variant-dependent (`table-actions` is flush; the rest are `px-4 pt-4`), and
`hasBottomBorder` adds `border-b` + `pb-4` off
`--ui-border-on-surface-divider`. That divider is exactly the one under the
mockups' Total row, which settles the open question in step 2: **the metric
strip is a `CardSection variant="slot"` with `hasBottomBorder`**, not a plain
flex row.

**Consequence:** step 2 is unblocked and branches from `main`. Nothing in this
plan waits on another team any more.

Still open: **#675** (`Section`, @madjorr) builds on Card + CardSection. It
doesn't gate any chart work, but a `ChartWidget` that ends up needing a page
section should land after it rather than inventing one.

### 1.4 The metric strip is `CardWidgetText`

`CardWidgetText` (`8982:28464`, 15 variants: `size` sm·md·lg × `trend`
up·stable·down × `color` green·red·gray) is:

```
Card
└─ Body → Stats
   ├─ Text
   │  ├─ Total   → Icon badge (36×36, SquareDashed 16) + Value (24/32 semibold) + unit
   │  ├─ Trend   → ArrowTrendUp/Down/Stable 16 + "20%"
   │  └─ caption → "over 6 months" (12/16, text/onSurface/secondary)
   └─ Container  → sparkline (an inline area chart, no axes)
```

That is exactly `Metric` + `TrendIndicator` + an inline `AreaChart`, inside a
`Card`. The same `Total` frame is reused verbatim as the header strip of
ChartArea / ChartBar / ChartDonut / ChartFunnel.

Naming/enum drift vs the shipped `Metric`:

|       | Figma                                  | ui-react `Metric`                                                |
| ----- | -------------------------------------- | ---------------------------------------------------------------- |
| size  | `sm` · `md` · `lg`                     | `small` · `medium` · `large`                                     |
| tone  | `color`: green · red · gray            | `status`: neutral · info · success · warning · danger · critical |
| trend | `trend`: up · stable · down (own axis) | free-form `trend` slot                                           |

### 1.5 Empty states are now per chart type

Every chart page carries a 288×213 instance of the type's empty state — a Card
with the real header (Title + ⋯) and, in the body, a **chart-type-specific
tinted illustration** over a "Widget description" caption:

| page            | node         | illustration                        |
| --------------- | ------------ | ----------------------------------- |
| ChartArea       | `9893:4515`  | area/curve silhouette               |
| ChartBar        | `9893:18409` | dot + bar rows                      |
| ChartDonut      | `9893:4096`  | ring + legend rows                  |
| ChartFunnel     | `9893:18629` | funnel                              |
| ChartLine       | `9893:19484` | line                                |
| ChartRadar      | `9893:20006` | radar                               |
| ChartScatter    | `9899:21900` | (mis-named `ChartTreeMap` in Figma) |
| ChartTreeMap    | `9899:21844` | tile mosaic                         |
| CardWidgetTable | `9899:21446` | table grid                          |
| CardWidgetText  | `9899:21112` | metric rows                         |

Today `ChartState` renders one generic `InboxIcon` for every type, and
`WidgetPlaceholder` is a separate, unrelated legacy port.

### 1.6 Two legend layouts, not one

- **inline / bottom** — Area, Bar (vertical), Line, Radar: wrapped row of
  `dot + label`. This is what `ChartLegendContent` does today.
- **side list** — Donut, Radial, Funnel: a right-hand column of
  `dot + label: + value`, value right-aligned in link blue
  (`semantics/colors/text/onSurface/link-idle`), label truncated by width.
  **Not implemented.**

TreeMap has no legend (labels are on the cells). ChartBar `type=horizontal` has
no legend either — the label _is_ the row.

### 1.7 `ChartBar type=horizontal` is `Meter`, not a recharts bar chart

It is **N independent rows**, each `label / value / % / its own track + fill`,
tinted with `dataviz/meaningful-status/*`. No legend — the label _is_ the row.

That is exactly the shipped **`Meter`**, whose own source describes it as "one
row — label + `value · %` over a proportional track bar — designed to be
stacked into a ranked breakdown (a _bar list_)" (`meter.tsx:11-17`). Base UI
`Meter` primitive, `role="meter"`.

It is **not** `CategoryBar` — that is one stacked `rounded-full` bar whose
segments share a single track with the label/value/% in a legend below
(`category-bar.tsx:29-40`). Different component, no mockup change.

It is also not `BarChart orientation="horizontal"` (real recharts bars).

**Decided (§7 D2):** `ChartBar type=horizontal` maps to a stack of `Meter`
rows. What is still open is whether the stack needs a container (§7 O1) — the
rows have to agree on `max`, on value formatting, and on palette assignment
across rows, which is container-shaped work, not per-row.

---

## 2. The palette / `type` axis (the big one)

### 2.1 What the design says

The Cyber-Intelligence widget editor exposes a **Color palette** radio group on
the Layout tab with four options, and then one control per series:

- **Categorical** — pick a hue per series from a 16-colour list
  (Blue, Orange, Teal, Pink, Ochre, Red, Green, Sky blue, Yellow, Violet,
  Dark teal, Maroon, Dark blue, Brown, Dark green, Light blue).
- **Sequential** — pick one ramp: Blue / Teal / Orange / Violet gradient.
- **Diverging** — pick one pair: Blue → Orange, Teal → Violet.
- **Status** — pick a status colour per series
  (Red, Orange, Yellow, Green, Blue, Gray).

Crucially, under **Sequential** and **Diverging** the ramp/pair is the _only_
control — there is no per-series picker (confirmed with design). So which stop
of the 8-step ramp each series lands on is **kit logic**, not user input.
`Categorical` and `Status` are the two palettes with a per-series control.

The editor also flags **duplicate colour** selections with a warning icon +
tooltip — that validation lives in the product, but the kit should make the
duplicate detectable (see §4.4).

### 2.2 The tokens already exist

`packages/tokens-pd/css/default.css` (the semantic tier, already imported by
`packages/ui-react/src/styles/index.css:6`) ships all of them:

| palette     | tokens                                                                          | count |
| ----------- | ------------------------------------------------------------------------------- | ----- |
| categorical | `--ui-dataviz-categorical-1 … -16`                                              | 16    |
| sequential  | `--ui-dataviz-sequential-{blue,teal,orange,violet}-1 … -8`                      | 4 × 8 |
| diverging   | `--ui-dataviz-diverging-{blue-orange,teal-violet}-{a1..a3,b1..b3}`              | 2 × 6 |
| status      | `--ui-dataviz-meaningful-status-{info,success,warning,critical,danger,neutral}` | 6     |

All are `light-dark()` pairs, so dark mode is free. **No token work is needed.**

Confirmed bindings in the mockups (via `get_variable_defs`):
ChartArea → `dataviz/categorical/1..2`; ChartDonut → `dataviz/categorical/1..8`;
ChartTreeMap → `dataviz/diverging/blueOrange/{a1..a3,b1..b3}`;
ChartBar horizontal → `dataviz/meaningful-status/*`.

Status naming, resolved by reading the values (`default.css:115-120`):

| editor label | token                                     | value (light)      |
| ------------ | ----------------------------------------- | ------------------ |
| Red          | `--ui-dataviz-meaningful-status-danger`   | `rgb(226 54 54)`   |
| Orange       | `--ui-dataviz-meaningful-status-critical` | `rgb(255 128 0)`   |
| Yellow       | `--ui-dataviz-meaningful-status-warning`  | `rgb(245 184 0)`   |
| Green        | `--ui-dataviz-meaningful-status-success`  | `rgb(41 163 61)`   |
| Blue         | `--ui-dataviz-meaningful-status-info`     | `rgb(23 99 207)`   |
| Gray         | `--ui-dataviz-meaningful-status-neutral`  | `rgb(109 114 120)` |

So **Red → `danger`**, and the editor's list is ordered by descending severity.
The whole semantic tier agrees (`--ui-background-status-critical` is
orange-tinted, `-danger` red-tinted), so this is consistent, not a one-off.

⚠️ Naming tension worth raising with design (not a blocker): a token called
`critical` that is orange and ranks _below_ `danger` reads backwards to most
people. The kit uses the token names; the product keeps its human labels.

### 2.3 What the code does today

Nothing. `ChartConfig` entries carry a hand-written `color` (or a
`theme: {light, dark}` pair) and `ChartStyle` emits them as
`--color-<key>` custom properties scoped to `[data-chart=<id>]`
(`chart.tsx:160-200`). Every story and demo hardcodes its own colours. There is
zero `--ui-dataviz-*` usage anywhere in `packages/ui-react/src`.

---

## 3. Gap summary

| #   | Gap                                                          | Where                                       |
| --- | ------------------------------------------------------------ | ------------------------------------------- |
| G1  | No palette concept; colours are hand-written per series      | `chart.tsx`, every chart, every story       |
| G2  | Charts render bare — no Card, no header, no title, no ⋯ menu | all per-type charts                         |
| G3  | No metric strip integration; `Metric` enums drift from Figma | `metric.tsx`                                |
| G4  | One generic empty state for all types                        | `chart-state.tsx`, `widget-placeholder.tsx` |
| G5  | No side/list legend with values                              | `chart.tsx`                                 |
| G6  | No width-responsive tick/label density                       | `chart-format.ts`                           |
| G7  | Figma-side defects block Code Connect (see §6)               | Figma                                       |

Not a gap: the `Card` chrome. PR #673 covers it, and deliberately themes off the
shared semantic tier rather than a `--ui-card-*` component tier (the design
references plain semantic tokens for surface/border/divider/text). The only
missing token tier is `components/Card/body/section/item/*`, which `CardSection`'s
`list` variant needs — charts don't.

---

## 4. Plan

Sequenced so each PR is independently shippable and reviewable. Steps 0–3 are
the shared foundation; step 4 fans out per chart type.

### Step 0 — Unblock (parallel tracks, none of them ours to code)

**0a. Figma defects — logged, NOT requested, NOT blocking** (§7 D15).

Verified 2026-08-24: the Figma variant-set errors do **not** block anything in
this plan. The plugin API refuses `componentPropertyDefinitions` on the broken
sets, but nothing we need goes through that path:

- The variant matrix is readable from the variant **names**
  (`type=horizontal, size=md, hasProjections=false`) — that is how §1.1 and §1.2
  were derived in the first place.
- Code Connect reaches the nodes fine: `get_code_connect_suggestions` on
  `ChartBar` (`8700:55606`) resolves the component set and its variants. And
  `figma.enum(...)` matches on the property _name_, which is exactly what the
  variant-name strings give us.
- **Most importantly, D1 removed `size` as a prop.** Defects 1 and 3 are both
  about `size` values — we never map `size`, so they cannot reach our API.
- Defect 2 (three `ChartLine` variants missing `withProjections`) is the only
  one touching a real prop, and it degrades correctly: `figma.boolean` returns
  undefined for those variants, the example falls back to its default, and the
  default _is_ "no projections". Right answer by accident.

So: no issue is filed and design is not asked to change anything. The list is
kept below purely so the next person doesn't re-diagnose it:

| defect                                          | impact given D1                                                         |
| ----------------------------------------------- | ----------------------------------------------------------------------- |
| `ChartBar`: 896px duplicate should be `size=lg` | none — `size` is not a prop                                             |
| `ChartScatter`: `size=size2`                    | none — `size` is not a prop                                             |
| `ChartLine`: 3 variants lack `withProjections`  | none — falls back to the correct default                                |
| empty-state instance named `ChartTreeMap`       | none — cosmetic                                                         |
| `withProjections` vs `hasProjections`           | none — two enum keys in two files                                       |
| sets wrap `_CardLegacy`                         | none — `ChartWidget` connects to `Card`, not to the chart set's wrapper |

One thing to watch when PR 10 actually runs `pnpm --filter
@acronis-platform/ui-react figma:connect`: the CLI may warn that
`withProjections` is absent on three `ChartLine` variants. A warning, not a
failure — confirm when we get there rather than pre-empting it.

- `ChartBar` — component set has errors: `type=vertical, size=md` is duplicated
  twice, and `size=lg` is missing for `type=vertical`
  (`componentPropertyDefinitions` throws, so Code Connect can't read the props).
- `ChartLine` — same error: three variants declare only `size`, three declare
  `size` + `withProjections`. Add `withProjections=false` to the first three.
- `ChartScatter` — `size=size2` should be `size=md`.
- Naming: `withProjections` (Area, Line) vs `hasProjections` (Bar) — pick one.
- `ChartScatter`'s empty-state instance is named `ChartTreeMap`.
- Re-point every chart set from `_CardLegacy` to the current `Card` set.

**0b. PR #673 (`Card`) merges** — **done**, 2026-08-24 (§1.3.1). Nothing in this
plan is blocked on anything any more.

No `Card` token tier is needed: #673 establishes that the card chrome themes off
the shared semantic tier (`--ui-background-surface-primary`,
`--ui-border-on-surface-{border,border-error,divider}`,
`--ui-text-on-surface-{primary,secondary}`), matching what the Figma node
actually references. `packages/design-tokens/tiers/components.json` has 42 tiers
and no `Card` — that is correct, not a gap.

### Step 1 — The palette API on the shared `Chart` primitives

One PR. `packages/ui-react/src/components/ui/chart/`.

**New file `chart-palette.ts`:**

```ts
export type ChartPalette =
  | { type: 'categorical' } // auto-assign 1..16
  | { type: 'sequential'; ramp: ChartSequentialRamp } // blue|teal|orange|violet
  | { type: 'diverging'; pair: ChartDivergingPair } // blueOrange|tealViolet
  | { type: 'status' }; // per-series status
```

- `CHART_PALETTE_TOKENS` — a frozen map from palette + index → the
  `var(--ui-dataviz-*)` string. Names come from tokens-pd, not from the
  editor's human labels.
- `resolvePaletteColor(palette, index, total)` — the assignment rule:
  - `categorical` → `categorical-((index % 16) + 1)`, unless the series pins a
    slot.
  - `sequential` → spread `total` series across the ramp's 8 stops
    (`Math.round(1 + (index * 7) / Math.max(1, total - 1))`), so 3 series read
    1 / 4 / 8, not 1 / 2 / 3. **No per-series override** — the editor has no
    control for it (§2.1).
  - `diverging` → walk `a3→a1` then `b1→b3` (the TreeMap mockup's order). Same:
    no per-series override.
  - `status` → each series names its tone; falls back to `neutral` + dev warn.

**The palette is mandatory and closed** (§7 D6). Two consequences for the API:

1. `ChartContainer`'s `palette` prop **defaults to `{ type: 'categorical' }`**.
   There is no "no palette" state.
2. `ChartConfig`'s free-form `color?: string` / `theme?: {light,dark}` are
   **replaced** by a palette-slot reference, so an off-palette colour is not
   expressible:

```ts
type ChartSeriesTone =
  | { slot: number } // pin a stop of the active palette
  | { status: ChartStatusTone } // status palette: info|success|warning|critical|danger|neutral
  | undefined; // auto-assign by series index
```

This is the breaking change of PR 1 and it touches every story and demo in
the repo. It is also the point of the exercise: today nothing stops a
consumer painting a series `#ff00ff`.

_Escape hatch:_ none in the public API. If a real need shows up (a brand
overlay, a non-dataviz reference band), it comes back as an explicit,
named prop on the chart that needs it — not as a generic `color: string`.

**Overriding a series colour within the palette is supported** (§7 D6b). The
auto-assignment is only the _default_; `slot` re-points a series to any other
stop of the palette currently in force:

| palette       | `slot` range | what it picks                          |
| ------------- | ------------ | -------------------------------------- |
| `categorical` | 1–16         | one of the 16 hues                     |
| `sequential`  | 1–8          | one stop of the chosen ramp            |
| `diverging`   | 1–6          | `a3 a2 a1 b1 b2 b3` of the chosen pair |
| `status`      | —            | use `{ status: … }` instead            |

`slot` is validated against the active palette's length: out of range is a type
error where the value is literal, and a dev warning + clamp otherwise. Changing
the palette therefore never yields an off-palette colour — the worst case is a
clamped slot.

The kit allows `slot` on all four palettes; **which of them expose a per-series
picker is the form's call**. Per D5 the current editor only offers one for
`categorical` and `status`, but that is a product decision, not a constraint the
kit should bake in.

**Validation for the product form** — export two pure helpers so the widget
editor can render the duplicate-colour warning from the screenshot without
re-deriving the palette:

- `listPaletteChoices(palette): ChartSeriesTone[]` — what the picker may offer.
- `findDuplicateTones(config): string[][]` — series keys that collide.

Kit-side, `findDuplicateTones` only `console.warn`s in dev. Enforcement is the
form's job; the kit's job is making the off-palette case unrepresentable.

Tests: one per palette × the assignment rule, one for slot pinning, one for
status-without-tone, one for the dedupe helper, one asserting a rejected
free-form colour no longer type-checks (`expectTypeOf`).
Story: `Widgets/Chart` → a `Palettes` story rendering all four in light + dark.

**Deliberately not doing:** a `--ui-chart-*` component tier. The dataviz tokens
are semantic and already correct; a per-component alias layer would be pure
indirection (see `packages/ui-react/context/conventions.md`, "bridge what's
reused").

### Step 2 — `ChartWidget`: the Card composition

One PR, branched from `main` (#673 landed — §1.3.1).
New `packages/ui-react/src/components/ui/chart-widget/`.

Because #673 already gives `CardHeader` the whole header surface
(`title` / `description` / `extras` / `actions` / `hasError`), `ChartWidget`
shrinks to _body-state + reserved height_ — the part Card legitimately doesn't
know about:

```tsx
<ChartWidget
  // forwarded verbatim to CardHeader — no re-declaration, no drift
  header={{ title: 'Active alerts by severity', actions: <ButtonIconMenu … />,
            extras: <CardFilter … /> }}
  variant="area"                   // reserved height + empty illustration
  state="empty"                    // loading | empty | error | undefined
  metric={<Metric … />}            // the Total strip — optional
>
  <AreaChart … />
</ChartWidget>
```

- Composes `Card` + `CardHeader` + `CardContent` from `components/ui/card`.
  **No new container primitive, no re-implemented header.** This is what "el
  container en sí es una card" means concretely.
- `header` is typed as `CardHeaderProps` and spread — so `isCollapsible`,
  `isDraggable`, `hasRename`, … come for free and stay in sync with #673.
- `hasError` on the root maps to `state === 'error'`, so an errored widget gets
  Figma's error border without the caller wiring both.
- When `state` is set, `ChartState` renders **instead of** `children`, keeping
  the header and the reserved body height so the card doesn't jump.
- ~~Fixed body height per `variant`.~~ Dropped — see D17. With no height to set,
  `variant` lost its only job in this step; it returns in step 3, where it picks
  the empty state's illustration.
- The metric strip is a **plain row inside the body** (D16, corrected): the
  mockups draw no divider under it — the card's only stroke is the header's own
  `border-b`, which `CardHeader` already renders.
- **No size, not even a default height** (D17). The card is a full-height flex
  column and the plot fills what the header leaves, so the dashboard grid is the
  only thing that sizes a widget.
- The per-type chart components stay **card-less**. They are the plot; the card
  is composition. This keeps `<AreaChart>` usable inside a `DataTable` cell, a
  `Popover`, or a `Metric` sparkline slot.

Also lands: `ui-spec/components/chart-widget/` (7-file set), tests, stories at
the three Figma widths (288/592/896), a docs page, and Code Connect.

### Step 3 — Per-type empty states

One PR. Extend `ChartState`, retire the duplication with `WidgetPlaceholder`.

- Add `variant?: 'area'|'bar'|'line'|'donut'|'radial'|'funnel'|'radar'|'scatter'|'treemap'|'table'|'text'`
  to `ChartStateProps`.
- New `chart-state-illustrations.tsx`: one inline SVG per variant, drawn with
  `fill="currentColor"` on a container that sets
  `text-[var(--ui-background-status-info)]` (the soft blue tint in the mockups),
  so brand/theme overrides follow. Export the assets from Figma only if the
  hand-drawn SVGs can't match — they are simple geometric silhouettes.
- Add `description?: React.ReactNode` (the "Widget description" caption).
  Keep every string a prop default, never a JSX literal (localisation rule).
- `loading` and `error` keep the current shared treatment (Spinner /
  `CircleWarningIcon`) — Figma only redesigned `empty`.
- `WidgetPlaceholder` **stays** (§7 D9, resolved): several MFEs use it. So this
  step documents the boundary rather than retiring anything —
  `ChartState` is the placeholder _inside_ a chart's slot, sized by whatever
  gives the slot its height; `WidgetPlaceholder` is the composable skeleton with
  its own header/footer parts and an `interactive` affordance, for a widget
  that isn't a chart. Both docs pages should say which is which.

VR: 11 new baselines × light/dark. Regenerated in Docker by Marta.

### Step 4 — Per-chart-type alignment (one PR each, in this order)

Ordered by how much each one is already right:

1. **`area-chart`** — palette wiring + `withProjections` (the mockup's dashed
   translucent tail is already expressible via `areaSettings`; give it a named
   `projectionFrom` prop instead of hand-built settings).
2. **`line-chart`** — same, plus the projection tail.
3. **`bar-chart`** — palette + vertical projections, and **drop the
   `orientation` axis** (D13). With `horizontal` gone the axis has one value
   left, so the CVA variant goes too; `vertical` becomes the only shape and the
   `data-orientation` attribute is removed. Changeset must name `Meter` as the
   replacement.
4. **`meter`** — align with `ChartBar type=horizontal`. Swap the caller-supplied
   `color: string` for the palette tone (step 1), and add the bar-list container
   (D14) that owns `max`, `valueFormatter` and palette order across rows.
   `Meter` itself stays a standalone single-row export — the container is
   additive, not a replacement. `category-bar` is untouched: different component
   (§1.7), palette only.
5. **`pie-chart` (donut)** + **`radial-bar-chart`** — palette + the **side list
   legend** (see below). Both share `ChartDonut`, so land them together.
6. **`funnel-chart`** — palette + side list legend + the `extras` Tag
   ("Last 6 months") wired through `ChartWidget`.
7. **`radar-chart`** — palette + bottom-centred legend (mockup centres it;
   today's is `justify-start`).
8. **`treemap`** — diverging palette by default, on-cell label contrast against
   the resolved token (`semantics/colors/text/onBrand/primary` on dark cells).
9. **`scatter-chart`** — palette only.

**Side list legend** (needed by 5 and 6, lands with item 5): add
`layout?: 'inline' | 'list'` and `valueKey?: string` to
`ChartLegendContentProps`. `list` renders a vertical column,
`label:` + right-aligned value in `text-[var(--ui-text-on-surface-link-idle)]`,
label truncated with the existing `TruncateText`. Placement stays the caller's
job via recharts' `<Legend align="right" layout="vertical">`.

**Width-responsive density** (G6, lands with item 1): add
`resolveTickInterval(width, dataLength)` to `chart-format.ts` and apply it in
the cartesian types via a `ResizeObserver` already available from
`ResponsiveContainer`'s render callback. Three bands keyed to the Figma widths:
`<360` → first/last only, `<640` → every other, else → every tick.

### Step 5 — `Metric` / `CardWidgetText` reconciliation

One PR, last, because it renames a public enum.

- Rename `Metric`'s `size` values `small|medium|large` → `sm|md|lg`. Evidence
  that this is worth the major (§7 D7): `sm|md|lg` is the house convention —
  Figma's own "Acronis Component Tokens Naming Convention" page prescribes
  `sm`/`md` explicitly, every `--ui-*` token uses it, and `category-bar`,
  `spinner` and `tag` follow it. The **only** outliers are `metric` and
  `trend-indicator` (`small|medium|large`) and `dialog`, which is internally
  inconsistent (`sm` + `large`).
- Fold `trend-indicator` into the same PR — it is `Metric`'s companion and the
  second of two outliers, so one rename lands the whole widget family.
  `dialog`'s `large` → `lg` is unrelated to charts: separate PR (§7 O3).
- Keep `status` (6 values) as the tone axis — it is a superset of Figma's
  green/red/gray and already token-backed. Do **not** add a `color` axis.
- Add `trend` as a first-class `'up'|'down'|'stable'` prop that renders a
  `TrendIndicator` internally, keeping the current `trend` slot for the
  override case (rename the slot to `trendSlot`).
- Add a `CardWidgetText`-shaped story/demo: `ChartWidget` + `Metric` +
  a sparkline `AreaChart`, at the three widths. This is composition — it does
  **not** become a new exported component unless design asks for it (§7 Q4).

### Step 6 — Docs, specs, Code Connect

- Every touched component: refresh `packages/ui-spec/components/<name>/`
  (`api.yaml` enums must match the CVA axes, `tokens.yaml` must list the
  `--ui-dataviz-*` tokens), and its `apps/docs/content/docs/components/*.mdx`.
- New `apps/docs` page: **Chart palettes** — the four palettes, the assignment
  rule, and when to pick which (mirrors `dataviz` guidance).
- Code Connect: flip `chart.figma.tsx`, `metric.figma.tsx` and every per-type
  `*.figma.tsx` from `NEEDS_FIGMA_URL` to the real nodes. Not gated on the Figma
  defects (D15) — map the props that exist, skip `size` entirely (D1), and check
  whether `figma:connect` warns about `withProjections` on `ChartLine`.
- Run `/component-readiness all` and `/pre-push-check` before each PR.

---

## 5. Suggested PR sequence

| PR  | Scope                                                                  | Depends on         |
| --- | ---------------------------------------------------------------------- | ------------------ |
| 1   | `feat(chart): dataviz palettes` (step 1)                               | —                  |
| 2   | `feat(chart-state): per-type empty illustrations` (step 3)             | —                  |
| 3   | `feat(chart-widget): card composition for dashboard charts` (step 2)   | 1, 2 (#673 landed) |
| 4   | `feat(chart): width-responsive tick density` + `area`/`line` (4.1–4.2) | 1                  |
| 5   | `feat(bar-chart)` + `feat(category-bar)` (4.3–4.4)                     | 1, Q2              |
| 6   | `feat(chart): list legend` + `pie`/`radial` (4.5)                      | 1                  |
| 7   | `feat(funnel-chart)` + `feat(radar-chart)` (4.6–4.7)                   | 6                  |
| 8   | `feat(treemap)` + `feat(scatter-chart)` (4.8–4.9)                      | 1                  |
| 9   | `feat(metric)!: sm/md/lg + first-class trend` (step 5)                 | —                  |
| 10  | `docs(charts)` + Code Connect (step 6)                                 | all                |

Each PR: Vitest + story + Docker VR baselines + changeset. Steps 0a/0b are
tracked as issues, not PRs in this repo.

---

## 6. Risks

- **VR churn.** Steps 1, 3 and 4 change the pixels of every chart baseline in
  `packages/ui-react/test/__snapshots__/`. Regenerate per-PR, in Docker, and
  review the PNGs — do not batch them into one mega-regen at the end.
- **Palette is opt-in but visually load-bearing.** If `palette` defaults to
  `undefined`, existing consumers keep their hardcoded colours and the kit ships
  two visual languages. Recommend defaulting `ChartContainer` to
  `{ type: 'categorical' }` and treating that as the breaking change of PR 1
  (explicit `color` still wins, so the blast radius is only charts that never
  set one).
- **`Metric` rename is public API.** Bundle it with a release that already has
  a major bump, or accept a standalone major.
- **Not blocked on Figma** (D15). The one external dependency this plan has is
  PR #673, and it is ours.
- ~~**Racing PR #673.**~~ Resolved: merged 2026-08-24. Step 2 branches from
  `main`.
- **`Section` (#675) is still open.** It doesn't gate chart work. If a chart
  widget ends up needing a collapsible card, that behavior already arrives
  through `AccordionContainer` via #673 — do not add a second disclosure
  implementation.

---

## 7. Decisions

Settled 2026-08-24 with @martupi.

| id      | decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------- | --- | ------------------------------------------------------------------------------------- |
| **D1**  | `size` (sm/md/lg) is a **dashboard grid slot**, not a prop. Width-responsive behavior; no `size` axis on any chart. (§1.2)                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **D2**  | `ChartBar type=horizontal` is a stack of **`Meter`** rows, not `CategoryBar` and not `BarChart orientation="horizontal"`. (§1.7)                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **D3**  | Chart widgets adopt the **new `Card`** from PR #673. The header carries at minimum drag handle + title + ⋯ actions; `ChartWidget` forwards `CardHeaderProps` wholesale so the rest follows. (§1.3.1)                                                                                                                                                                                                                                                                                                                                                                                              |
| **D4**  | `CardWidgetText` / `CardWidgetTable` / `CardWidgetCarousel` are **documented compositions** (stories + docs pages), not new exports. (§1.4)                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **D5**  | Series walk the palette **in the order the design defines**. No spreading, no re-ordering, no skipping stops — series 1 takes stop 1, and so on. An earlier draft of this plan invented an even-spread rule; that was wrong and is not what ships. (§2.1, step 1)                                                                                                                                                                                                                                                                                                                                 |
| **D6**  | The palette is **mandatory and closed**: default `categorical`, and free-form `color: string` is removed from `ChartConfig` in favour of palette slots. The kit makes off-palette unrepresentable; the product form does the picking. (step 1) — **partially shipped**: `ChartConfig` is done, the nine per-series `color` props are not (§8 O8).                                                                                                                                                                                                                                                 |
| **D6c** | A series can alias another with `tone: { sameAs }` — same metric drawn twice (a forecast tail, a projection band) must read in one hue, and the alias consumes no palette stop. Needed by `ConfidenceCone` today and by every `withProjections` mockup in step 4.                                                                                                                                                                                                                                                                                                                                 |
| **D6b** | Per-series overrides exist **only on `categorical` (`{ slot }`) and `status` (`{ status }`)**. `sequential` and `diverging` accept none: their stops are a ramp whose colors only mean something in relation to each other, and the widget editor offers no per-series control for them either. An override under those palettes is ignored with a dev warning. (step 1)                                                                                                                                                                                                                          |
| **D7**  | Rename `Metric` **and** `TrendIndicator` `small                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | medium | large`→`sm | md  | lg`. Justified: they are the only two outliers against the house convention. (step 5) |
| **D8**  | Charts without a mockup are structurally out of scope but **do** inherit the palette. (§1.1)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **D9**  | ~~`WidgetPlaceholder` is a deletion candidate.~~ **Resolved 2026-08-24: it stays.** Marta confirmed several MFEs use it. So `ChartState` gaining per-type empties does not retire it — step 3 documents the boundary between the two instead of deleting one.                                                                                                                                                                                                                                                                                                                                     |
| **D10** | Empty-state illustrations are **hand-drawn inline SVG** in this repo, `currentColor`-driven. No `design-assets` round-trip. (step 3)                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **D11** | ~~Wait for PR #673 to merge; do steps 1 + 3 meanwhile.~~ **Resolved** — #673 merged 2026-08-24; step 1 shipped as PR #685 in the meantime, as planned. (§0b)                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **D16** | ~~The metric strip is a `CardSection variant="slot"` with `hasBottomBorder`.~~ **Wrong, corrected while building step 2.** The metric row has _no_ stroke: the only one in the card is `Body`'s `strokeTopWeight: 1`, i.e. the divider between header and body — which `CardHeader` already draws itself. So the metric strip is a plain row inside the body, separated by the 16px gap.                                                                                                                                                                                                          |
| **D17** | `ChartWidget` **declares no size at all** — not even a per-type body height. Every set is `HUG` vertically, so the mockup frame heights (300 / 297 / 285 / 253) are what a hug layout produced, not design constants. The grid sizes the card and the widget passes that height down (`flex h-full flex-col`, header `shrink-0`, body and plot `flex-1 min-h-0`), so a `size-full` chart fills whatever the header leaves. This supersedes the "documented default height per type" wording in D1.                                                                                                |
| **D18** | **`Metric` needs its own PR before step 3.** It is not a de-carding: it renders a `Card` root _and_ a different composition from the mockups — a label row on top (Figma has none; its "Label" is the unit, inline after the value), the trend to the right (Figma puts it below, on its own line), plus a top-right caption Figma doesn't draw. That is step 5's reconciliation, and it is breaking three ways (card removal, layout, the `small\|medium\|large` → `sm\|md\|lg` rename). Until it lands, `ChartWidget`'s `metric` slot ships un-demoed rather than drawing a card inside a card. |
| **D12** | Red → `danger`, Orange → `critical`, Yellow → `warning`, by token value. (§2.2)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **D13** | `BarChart`'s `orientation="horizontal"` is **removed**. Horizontal is `Meter` (D2), so the enum value is deleted and the changeset/docs point at `Meter`. Trade-off accepted: real recharts horizontal bars (with axes, many categories) stop being expressible. (step 4.3)                                                                                                                                                                                                                                                                                                                       |
| **D14** | The `Meter` bar list gets a **container** that owns the cross-row concerns (`max`, value formatting, palette order) — **and `Meter` stays exported and usable standalone**. The container is additive: a single row ("Storage used · 62%") is still one `<Meter>`, no wrapper required. (step 4.4)                                                                                                                                                                                                                                                                                                |
| **D15** | **No Figma changes are requested.** The variant-set defects were verified non-blocking — D1 (no `size` prop) neutralises most of them, and Code Connect reads the nodes fine. Logged in §4 step 0a for reference only.                                                                                                                                                                                                                                                                                                                                                                            |

## 8. Still open

- **O7 — is the Funnel mockup's ramp spacing intentional?** `ChartFunnel size=md`
  paints its four stages `sequential-blue` **2 / 4 / 6 / 8** — an even spread,
  not stops 1–4. Per D5 the code walks 1 / 2 / 3 / 4, so the shipped funnel will
  read paler than the mockup. Either the mockup's spacing is a deliberate rule
  (and D5 needs a documented exception for ramps), or it is one designer's
  manual pick. The `ChartTreeMap` mockup is no help: it paints `a3 a2 b1 b1 b3
b3 b3`, repeating colors and skipping `a1`/`b2`, which is bucketing by value
  rather than assigning per series.
- **O8 — the per-series colour escape hatches are still open.** D6 says
  off-palette must be unrepresentable. `ChartConfig.color` is gone (PR 1), but
  **nine** component-own props still take an arbitrary CSS colour, so a chart
  can still paint outside the palette — just not through `config`:

  | component       | prop                              |                                             |
  | --------------- | --------------------------------- | ------------------------------------------- |
  | `AreaChart`     | `areaSettings[key].color`         | optional                                    |
  | `LineChart`     | `lineSettings[key].color`         | optional                                    |
  | `FunnelChart`   | `stageSettings[key].color`        | optional                                    |
  | `RadarChart`    | `seriesSettings[key].color`       | optional                                    |
  | `PieChart`      | `sliceSettings[key].color`        | optional                                    |
  | `ComposedChart` | `series[].color`                  | optional                                    |
  | `SankeyChart`   | `SankeyChartLink.color`           | optional                                    |
  | `Meter`         | `color`                           | **required**                                |
  | `CategoryBar`   | `CategoryBarTooltipContext.color` | required (render-prop output, not an input) |

  Plus `FunnelChart`'s `gradientColor`.

  Converting each to a palette tone (`{ slot }` / `{ status }` / `{ sameAs }`)
  is the rest of D6. Deliberately **not** done in PR 1: those settings objects
  get reworked anyway in step 4 (projections, per-stage styling, the `Meter`
  bar list), so folding the colour change into each chart's own PR keeps the
  breaking surface reviewable one component at a time.

  `Meter` is the one that can't wait for its own PR to be optional: its `color`
  is required, so step 4.4 has to replace it rather than deprecate it.

- **O4 — token naming** (design, non-blocking).
  `--ui-dataviz-meaningful-status-critical` is orange and ranks _below_
  `danger`, which reads backwards to most people (§2.2). Nothing in this plan
  depends on it — the kit uses the token names either way. It only matters if
  design later renames the tokens, which would be a `design-tokens` change, not
  a ui-react one.

Closed: **O2** → D13. **O3** (`Dialog`'s `sm | large`) → out of scope, not this
team's component. **O5** → D15: verified non-blocking, nothing asked of design.
