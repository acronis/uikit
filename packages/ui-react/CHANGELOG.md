# @acronis-platform/ui-react

## 4.1.0

### Minor Changes

- [#695](https://github.com/acronis/uikit/pull/695) [`084e384`](https://github.com/acronis/uikit/commit/084e384901586898e95c9e6ee7a1d9b50d784741) Thanks [@madjorr](https://github.com/madjorr)! - feat(input-num-picker): add `InputNumPicker`

  A numeric stepper field (label + required marker, decrement/increment
  buttons around the value) built on Base UI's `NumberField`, themed by its own
  `--ui-input-num-picker-*` token tier and reusing `ButtonIconInput` for the
  steppers. Ported from Figma node `8523:5382`. This is a new component,
  independent of the existing `NumberField` (which remains unchanged).

### Patch Changes

- [#701](https://github.com/acronis/uikit/pull/701) [`668d2b9`](https://github.com/acronis/uikit/commit/668d2b9bb85b2230673a13dbe6ad6c19f76f1132) Thanks [@madjorr](https://github.com/madjorr)! - chore(deps): bump dependencies

  Bumps `vite` (6→8), `vitest` (4.1.7→4.1.10), and `@vitejs/plugin-react`
  (5→6), plus `js-yaml`, `ajv`, `style-dictionary`, `svgo`, and `next`
  (apps/docs). Pins remaining vulnerable transitive deps (`form-data`,
  `postcss`, `brace-expansion`, `fast-uri`, `nanoid`, `undici`, `axios`,
  `immutable`, `joi`, `react-router`, `sharp`, `esbuild`, `fast-json-patch`,
  `uuid`) via `pnpm-workspace.yaml` overrides. No published-surface behavior
  change — build output is unaffected (verified with `pnpm -r
{build,typecheck,test}` and VR baselines).

- [#695](https://github.com/acronis/uikit/pull/695) [`bbaf756`](https://github.com/acronis/uikit/commit/bbaf756ab7ea7f41bc7e155c1eaa69daf3a59e3f) Thanks [@madjorr](https://github.com/madjorr)! - fix(input-num-picker): forward the ref to the visible input

  `InputNumPicker` passed its forwarded ref to `NumberField.Root`'s `inputRef`,
  which targets Base UI's hidden `aria-hidden` form-submission `<input
type="number">` shim rather than the visible text input. The ref is now
  attached to `NumberField.Input`, so consumers get the element the user
  actually interacts with (focus, selection, formatted value).

- Updated dependencies [[`668d2b9`](https://github.com/acronis/uikit/commit/668d2b9bb85b2230673a13dbe6ad6c19f76f1132)]:
  - @acronis-platform/icons-react@1.0.1

## 4.0.0

### Major Changes

- [#685](https://github.com/acronis/uikit/pull/685) [`c3135ef`](https://github.com/acronis/uikit/commit/c3135ef130c881cee1d1ed305eed34262487e633) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - feat(chart)!: series colours come from the palette, and only from the palette

  **Breaking.** `ChartConfig` no longer accepts a free-form `color` or a
  `theme: { light, dark }` pair. A chart's **series** cannot paint a hue the
  design system doesn't define.

  Note: certain chart types (`FunnelChart` `stageSettings[].color`, `PieChart`
  per-slice `color`, `ComposedChart` per-bar `color`, `SankeyChart`
  `data.links[].color`) still expose per-element free-form color overrides
  outside of `ChartConfig`. Those are intentional escape hatches for edge cases
  like custom gradient ramps or explicit link tints; they are not controlled by
  `palette` and are not part of this breaking change.

  `ChartContainer`'s `palette` now defaults to `{ type: 'categorical' }` — there
  is no "no palette" state. Series walk the chosen palette in its defined order.

  Migrating: **delete the `color` from each `config` entry.** Most charts used
  those tokens as "some distinct colour per series", which is exactly what the
  default categorical palette does — so deleting is usually the whole migration.

  ```diff
    const config = {
  -   desktop: { label: 'Desktop', color: 'var(--ui-background-brand-secondary)' },
  -   mobile: { label: 'Mobile', color: 'var(--ui-background-status-strong-danger)' },
  +   desktop: { label: 'Desktop' },
  +   mobile: { label: 'Mobile' },
    } satisfies ChartConfig;
  ```

  Where the colour carried meaning, pick the palette and name the tone:

  ```diff
  - const config = {
  -   failed: { label: 'Failed', color: 'var(--ui-background-status-strong-danger)' },
  - } satisfies ChartConfig;
  + const config = {
  +   failed: { label: 'Failed', tone: { status: 'danger' } },
  + } satisfies ChartConfig;
    …
  - <BarChart config={config} … />
  + <BarChart config={config} palette={{ type: 'status' }} … />
  ```

  Other `tone` forms: `{ slot: 7 }` picks another categorical hue, and
  `{ sameAs: 'actual' }` paints whatever another series paints — for a twin
  series (a forecast tail, a projection band) that must not read as a second
  metric. An aliased series doesn't consume a palette stop.

  **Watch out for entries you don't plot.** A stop is assigned by an entry's
  position in `config`, not by which series get drawn, so a config declaring a
  series the chart doesn't render still consumes a colour and shifts the ones
  that follow. That is deliberate — a series keeps its colour when a sibling is
  toggled off — but it means each config should declare exactly what its chart
  plots.

  Also in this change:
  - `CategoryBar` gains the same `palette` prop. It paints plain elements rather
    than a recharts plot, so it resolves the palette itself.
  - `ChartStyle` emits one CSS block instead of a light/dark pair: every palette
    colour is a `light-dark()` token that follows `color-scheme` on its own.
  - New exported type `ResolvedChartConfig` — a `ChartConfig` with every colour
    filled in, which is what `ChartStyle` takes and what the context carries.
  - Every chart's Storybook meta exposes a `palette` select, so the palettes can
    be compared on a real chart from the Controls panel.

- [#689](https://github.com/acronis/uikit/pull/689) [`237efe8`](https://github.com/acronis/uikit/commit/237efe8e1fc5800ffde940f6540bb68874bf54e1) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - feat(chart-state): draw the empty state per chart type

  `empty` is the one state the design draws per chart type — an area silhouette for
  an area chart, a ring for a donut, a funnel for a funnel — so an empty widget
  still says what it _would_ have shown, which a single generic glyph can't.

  ```tsx
  <ChartState state="empty" variant="donut" />
  <ChartWidget header={{ title: 'Conversion' }} variant="funnel" state="empty" />
  ```

  `ChartState` gains:
  - `variant` — `area` · `bar` · `line` · `donut` · `radial` · `funnel` · `radar` ·
    `sankey` · `scatter` · `treemap` · `table` · `text`. `donut` and `radial` share
    one ring: a radial-bar widget with no data has nothing to tell it apart.
  - `description` replaces the previous `message` prop and is now the single text
    control for every state. Each state has a built-in default (`"Data is loading…"` /
    `"No data found"` / `"Something went wrong"`); pass `description` to override.

  `ChartWidget` forwards both (`variant`, `stateDescription`). The previous
  `stateMessage` prop is removed.

  The twelve silhouettes are derived from the Figma empty-state instances rather
  than redrawn, so a curve is the curve the design draws. Every path is
  `currentColor`, with the tone set once on the container, so brand and theme
  overrides reach the artwork.

  Without a `variant` the `empty` state shows no artwork — just the text.
  `loading` and `error` share one treatment and ignore `variant`.

  `WidgetPlaceholder` stays. It is a different job — the composable skeleton for a
  whole tile, with its own header/footer parts and an `interactive` affordance,
  for a widget that isn't a chart. Both docs pages now say which is which.

- [#694](https://github.com/acronis/uikit/pull/694) [`62962b7`](https://github.com/acronis/uikit/commit/62962b7905981f58aacdbd5d1cb4887b15a8be7b) Thanks [@madjorr](https://github.com/madjorr)! - feat(ui-react)!: remove AppShell, AuthLayout, Collapsible and Label

  **Breaking.** Four exports are gone from `@acronis-platform/ui-react`:
  - `AppShell` / `AppShellSidebar` / `AppShellBody` / `AppShellHeader` /
    `AppShellMain` / `AppShellFooter` — superseded by `AppShellChat`, whose Chat
    slot is optional, so the same scaffold serves an ordinary two-column console
    screen. Migrate: `AppShell` → `AppShellChat`, `AppShellSidebar` →
    `AppShellChatSidebar`, `AppShellBody` → `AppShellChatContent`,
    `AppShellHeader` → `AppShellChatContentHeader`, `AppShellMain` →
    `AppShellChatContentBody`. There is no `AppShellFooter` equivalent. Note
    `AppShellMain` rendered a `<main>` landmark; `AppShellChatContentBody` is a
    plain `<div>`, so wrap it in your own `<main>` if you relied on that.
  - `AuthLayout` / `AuthLayoutCard` / `AuthLayoutLogo` / `AuthLayoutFooter` — the
    chrome was product-specific, not a design-system component. Compose it in the
    product from `Card` / `Stack`.
  - `Collapsible` / `CollapsibleTrigger` / `CollapsibleContent` — a thin wrapper
    over Base UI's Collapsible with no consumers. Use `AccordionContainer`, or
    Base UI's `Collapsible` directly.
  - `Label` (and `LabelProps`) — nothing rendered it. Use `Field`'s label part.
    The `labelClassName` constant `Field` consumes is unchanged.

- [#690](https://github.com/acronis/uikit/pull/690) [`054f89d`](https://github.com/acronis/uikit/commit/054f89d06d3fb1f68a71745f09133663253604f7) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - **Breaking changes** — `Metric` and `TrendIndicator`; new `orientation` prop on `ChartWidget`

  ### `Metric`
  - **Card removal.** `Metric` no longer renders its own `Card` wrapper. It is now a plain stats strip (`<div>`). For a standalone card tile, wrap it: `<Card className="p-4"><Metric .../></Card>`. When used inside `ChartWidget`, the card chrome comes from the widget.
  - **Removed props:** `size`, `status`, `label`, `trendSlot`.
  - **New first-class `trend` prop.** `trend?: 'up' | 'down' | 'stable'` renders a `TrendIndicator` automatically below the value. Sentiment follows direction: `up` → positive, `down` → negative, `stable` → neutral. Pair with `trendValue?: ReactNode` for the change text.
  - **Icon badge color fix.** The icon inside the badge now uses `--ui-glyph-on-surface-neutral-dark` (neutral dark gray) instead of `--ui-text-on-status-info`.

  ### `TrendIndicator`
  - **Removed props:** `size`, `variant` (the `badge` variant), `comparisonLabel`.

  ### `ChartWidget`
  - **New `orientation` prop.** `orientation?: 'vertical' | 'horizontal'` (default `'vertical'`). Vertical keeps the existing layout — metric strip above the chart, full width. Horizontal places metric and chart side by side (`flex-1` each), intended for the sm (288px) widget width. Figma: vertical → node 8174:22335, horizontal → node 8982:31681.

- [#688](https://github.com/acronis/uikit/pull/688) [`c0948ee`](https://github.com/acronis/uikit/commit/c0948eeeb17e03292edc744e7fa371b2a21739fa) Thanks [@madjorr](https://github.com/madjorr)! - Rebuild `Section` from its Figma design (node `8262:6179`), replacing the
  draft layout primitive ported from `ui-legacy`. It is now a page-level titled
  band that groups cards — or a table — with four content layouts on the root
  (`column1`, `column2-70-30`, `grid3`, `table`), an optional bottom divider
  (`hasBottomBorder`), and a header carrying the 20px title, an optional
  description, an optional toggle switch, inline extras, and end-aligned
  actions. The root publishes its `variant` through context, so `SectionHeader`
  and `SectionContent` never repeat it, and the `table` variant sits completely
  flush so its rows bleed to the page edges. Collapsing is a composition with
  the shared `AccordionContainer` primitive, the same as `Card`.

  **Breaking:** `SectionTitle` and `SectionDescription` are removed — the title
  and description are now `SectionHeader` props (`title`, `description`,
  `hasDescription`), matching `CardHeader`. Replace
  `<SectionHeader><SectionTitle>…</SectionTitle><SectionDescription>…</SectionDescription></SectionHeader>`
  with `<SectionHeader title="…" description="…" hasDescription />`.

  Note the element also changes: `SectionTitle` rendered an `<h2>`; the `title`
  prop renders a `<p>` instead, since a section's place in the document outline
  depends on the page around it (see the Accessibility section of the
  [`Section` docs](https://acronis.github.io/uikit/docs/components/section)). If you
  relied on the heading for document-outline structure or an `aria-labelledby`
  target, supply your own heading via `SectionHeader`'s `children` slot (not
  `render`, which replaces the entire header row), omit `title`, and point the
  root's `aria-labelledby` at it.

### Minor Changes

- [#688](https://github.com/acronis/uikit/pull/688) [`bb19e2e`](https://github.com/acronis/uikit/commit/bb19e2efed4ed8c0dc9fbb60824354a84e64cd34) Thanks [@madjorr](https://github.com/madjorr)! - `AccordionContainer`'s `Root` now defaults to `display: contents` when
  `collapsible` is true, so it never becomes a box in the consumer's flex/grid
  layout (this is what lets `Section`'s root `gap` apply directly across its
  header and content instead of being silently dropped by the wrapper). The
  default is applied as `contents!` so it also wins over a `render`-prop
  element's own conflicting display class regardless of stylesheet order. Pass
  an important-modified display utility (e.g. `className="flex!"`) if you rely
  on `Root` being a real box — `tailwind-merge` resolves the conflict in your
  favor; a non-important utility (`flex`) won't be deduped against `contents!`
  and loses the cascade to it.

- [#693](https://github.com/acronis/uikit/pull/693) [`6c60156`](https://github.com/acronis/uikit/commit/6c601567ea897e9afc075c2fd6cab006f4195db1) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - feat(charts): Figma-align PieChart & RadialBarChart — list legend always-right
  - Add `variant="list"` to `ChartLegendContent` for the vertical dot-label-value layout; accepts `valueKey` and `valueFormatter` to show per-item values
  - PieChart and RadialBarChart now **always** render as `flex-row`: chart square on the left, list legend on the right — matching the Figma donut/radial widget layout. The `legendPosition` prop is removed; configuring legend position is no longer supported on these charts (cartesian charts keep their bottom legend unchanged)
  - Center-label nudge logic removed from `PieChart` (was compensating for recharts' built-in legend, which is now always external)

- [#687](https://github.com/acronis/uikit/pull/687) [`bed1ddc`](https://github.com/acronis/uikit/commit/bed1ddc7a914732a832c628dd7cf0aee331ea07e) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - feat(chart-widget): add the dashboard card a chart sits in

  Every chart in the design is drawn inside the same card — a header with a title,
  an optional filter chip and the ⋯ actions menu, then an optional metric readout,
  then the plot. `ChartWidget` is that composition.

  ```tsx
  <ChartWidget
    header={{
      title: 'Sessions',
      extras: <Tag variant="info">Last 6 months</Tag>,
      actions: <WidgetMenu />,
    }}
    className="h-[300px] w-[592px]"
  >
    <AreaChart
      config={config}
      data={data}
      dataKeys={['sessions']}
      xKey="month"
      className="size-full"
    />
  </ChartWidget>
  ```

  It adds only the one thing a `Card` doesn't know about: **what the body shows
  while there is no plot.** `state="loading" | "empty" | "error"` renders
  `ChartState` in place of the chart, and `error` also gives the card its error
  border — one prop, not two.

  The header is `Card`'s: `header` is typed `CardHeaderProps` and spread onto
  `CardHeader`, so everything that component takes works here — including the
  parts `ChartWidget` never mentions (`isDraggable`, `hasRename`,
  `isCollapsible`, …). Nothing to keep in sync.

  There is no `size` prop. The Figma `size` axis (`sm`/`md`/`lg`) only changes the
  frame width (288/592/896); the height is the dashboard grid's. So the widget
  declares no size and _passes one down_ — the card is a full-height flex column,
  the header takes what it needs, and the body takes the rest, so a chart given
  `size-full` fills the whole remaining card. In a parent with no definite height
  the card hugs its content instead. `bodyClassName` covers the one remaining gap:
  a placeholder-only widget outside a sized cell.

  The per-type chart components stay card-less, so a chart is still usable outside
  a widget — in a table cell, a popover, or a `Metric`'s sparkline slot.

- [#684](https://github.com/acronis/uikit/pull/684) [`2c2fc01`](https://github.com/acronis/uikit/commit/2c2fc01bdd89e910d2c0f31adccce3ba1f7b4408) Thanks [@madjorr](https://github.com/madjorr)! - feat(stepper): sync with the dedicated `--ui-stepper-*` token tier

  Re-point `Stepper`/`StepperItem` at the dedicated `--ui-stepper-*` token tier shipped by `@acronis-platform/tokens-pd` (superseding the semantic-token placeholders used before that tier existed), add the current step's border, split its container padding into the design's asymmetric left/right values, and add a fourth `state="focus"` look for a completed step.

  **Migrating:** consumers composing their own `Avatar` as a step's marker should now add `className="[box-shadow:none]"` to it — Avatar's default outset ring otherwise shows as an unwanted halo on a filled step container.

- [#671](https://github.com/acronis/uikit/pull/671) [`348b267`](https://github.com/acronis/uikit/commit/348b267c8bd3947f3268e482efd81b5b0ee8452b) Thanks [@madjorr](https://github.com/madjorr)! - Add `useWizard`: an opt-in headless hook that owns a wizard's step index so a
  consumer no longer hand-maintains one `StepperItem` block per step.

  Given `steps` (`{ id, label }`, plus any extra fields of your own, which survive
  on the derived step) and an optional `initialStep` seed (a zero-based index,
  clamped, or a step `id`), it returns the `Stepper` summary props
  (`currentStepNumber` / `stepCount` / `currentStepLabel` / `nextStepLabel` —
  `undefined` on the last step, so the "Next: …" line is dropped rather than
  rendered empty), a derived `steps` array carrying each step's `variant` and
  `Avatar` colour/classes, `isFirstStep` / `isLastStep`, and
  `goToNextStep` / `goToPreviousStep` / `goToStep` (neither boundary wraps; an
  unknown `id` is a no-op).

  Purely additive: `Wizard`, `Stepper` and `StepperItem` are unchanged and still
  own no state, so a consumer already driving them by hand keeps working.

- [#671](https://github.com/acronis/uikit/pull/671) [`3c9ef5b`](https://github.com/acronis/uikit/commit/3c9ef5b4944d96e61c99a8ea01ec490dc2b3629d) Thanks [@madjorr](https://github.com/madjorr)! - Add `Wizard`: the full-page wizard page template, from the Figma "RegionMain"
  frame (node `10511-61418`).

  Four composable parts — `Wizard` (full-height column), `WizardHeader` (the
  sticky header band, on `--ui-background-surface-secondary` with a
  `--ui-border-on-surface-divider` bottom rule, `--ui-gap-16` padding and a
  `--ui-gap-12` inter-row gap), `WizardSubtitle` (optional muted supporting line)
  and `WizardBody` (the step's content column, capped at 1024px).

  It is a composition, not a new primitive: the breadcrumb, the title row
  (`PageHeaderRow` / `PageHeaderTitle` / `PageHeaderActions`, reused from
  `PageHeader`), the step indicator (`Stepper` + `StepperItem`) and the step
  content (`Section`) are all existing components the consumer places as children.
  `Wizard` owns layout and slots only — no step index, no navigation, and no
  button wiring: which of Cancel / Back / Next / Submit shows on a given step is
  the consuming UI block's decision, the same boundary `PageHeader` draws around
  its own actions slot.

### Patch Changes

- [#692](https://github.com/acronis/uikit/pull/692) [`009196c`](https://github.com/acronis/uikit/commit/009196cb49dabe438a0db0100dbd1c75f6e99ef4) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - fix(charts): center legend + gap-24 across all cartesian charts

  `ChartLegendContent` now uses `justify-center gap-x-6` (24 px column gap,
  centred) instead of `justify-start gap-x-4`, matching the Figma spec
  (nodes 8700:55607, 8174:22232, 8811:175677, 9005:73829).
  Row wrap gap (`gap-y-2`) is unchanged.

  Legend markers are now always circular dots, consistent with tooltip row
  indicators. The previous per-series marker logic (square swatch for filled
  series, line/dashed line for stroke series) is removed.

- [#687](https://github.com/acronis/uikit/pull/687) [`07f8c08`](https://github.com/acronis/uikit/commit/07f8c08fbefcd68f3bc80d80f78769f37787b586) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - fix(chart-widget): expose the `render` prop the a11y docs already promised

  `ChartWidget`'s accessibility notes pointed at `render` as the way to give a
  widget a landmark role, but the prop was never on `ChartWidgetProps` — so
  `<ChartWidget render={<section aria-label="Sessions" />}>` failed to type-check
  and there was no supported way to make a widget a landmark.

  The prop is now declared and forwarded to `Card`, with a test that renders the
  documented recipe and asserts the region is really there. The docs also now say
  the part they left out: the accessible name has to come from the caller, because
  the header's `title` is visible text _inside_ the region rather than a name
  for it.

- [#691](https://github.com/acronis/uikit/pull/691) [`ce8ce16`](https://github.com/acronis/uikit/commit/ce8ce162d3bf2f0fbe85be8d6b2e9dca53d7fbda) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add LLM-friendly component reference docs to the published package.

  A new `build:llms` script (also hooked into `build`) reads the framework-agnostic
  specs from `packages/ui-spec` and emits:
  - `dist/llms.txt` — index of all components grouped by category
  - `dist/llms/<name>.md` — self-contained doc per component (props, events, content
    slots, behavior, accessibility, usage examples)

  Consumers can reference these from a project's `CLAUDE.md`:

  ```
  @node_modules/@acronis-platform/ui-react/dist/llms.txt
  @node_modules/@acronis-platform/ui-react/dist/llms/button.md
  ```

  Both entry points are exposed via the package `exports` field.

- [#684](https://github.com/acronis/uikit/pull/684) [`60833a8`](https://github.com/acronis/uikit/commit/60833a863ff509d0b084d3008745398682320c40) Thanks [@madjorr](https://github.com/madjorr)! - fix(stepper-item): show the right avatar per variant in the Code Connect example

  `stepper-item.figma.tsx` composed a single blue numbered `Avatar` for all three
  `type` values, so Figma's Code Connect snippet suggested that markup for
  `completed` (which uses a green `CheckIcon`) and `future` (gray) too, and omitted
  the `text-[var(--ui-stepper-item-*-label-color)]` digit override the stories and
  docs demo rely on. The avatar is now mapped per variant via `figma.enum('type',
…)` with literal JSX values — Code Connect serializes the example body
  statically, so the branching has to live in the props mapping rather than in a
  helper the example calls. The three snippets match `stepper-item.stories.tsx` and
  the docs demo, and the `Avatar`/`AvatarFallback`/`CheckIcon` imports are pinned
  so the published snippet compiles. Code Connect fixtures are excluded from the
  published bundle, so there is no runtime or API change.

- [#684](https://github.com/acronis/uikit/pull/684) [`eb2cc70`](https://github.com/acronis/uikit/commit/eb2cc70225dd157ed9030c18d155ec6ba58681b7) Thanks [@madjorr](https://github.com/madjorr)! - `StepperItem` now references its dedicated container-color tokens for the
  `completed` variant's `idle` state and for the `future` variant, instead of
  implicitly rendering no background. `completed`/`idle` gets a
  `compoundVariants` entry wired to
  `--ui-stepper-item-completed-container-color-idle`, and `future` picks up
  `--ui-stepper-item-future-container-color`.

  No visual change in the shipped brands — both tokens currently resolve to
  `transparent` — but a brand that overrides either one is now honored, matching
  the convention that every variant/state combination is wired to its own token.

- [#684](https://github.com/acronis/uikit/pull/684) [`40fcfa8`](https://github.com/acronis/uikit/commit/40fcfa8b4bcb96a162a24b29b6c4f66389f60a6d) Thanks [@madjorr](https://github.com/madjorr)! - fix(stepper-item): apply the tier's generated text-style class to the step label

  `StepperItem` hand-transcribed part of its
  `.ui-stepper-item-global-container-text-style` tier into utilities (`text-sm
leading-6`) and dropped the tier's `font-weight: 500`, so the step name rendered
  at the inherited default weight of 400 — visibly lighter than the design. The
  base class now applies the generated class by name instead, the way `Alert`,
  `InputOTP`, and the sidebars apply theirs, so the family, size, weight,
  line-height, and letter-spacing all follow the tier and cannot drift out of it.

- [#684](https://github.com/acronis/uikit/pull/684) [`47773ec`](https://github.com/acronis/uikit/commit/47773ec8b9c3e86ab10199185964b55caf36a16b) Thanks [@madjorr](https://github.com/madjorr)! - fix(stepper-item): reserve the container border box on every variant

  `StepperItem` only declared a border on its `current` variant, so — the
  container being an inline-flex box with auto width/height — the current step
  rendered ~2px larger than its `completed`/`future` siblings and pushed the row's
  avatars and labels out of alignment. The border width is now reserved on the
  shared base class with a transparent color (the same shape `Tag` uses), and
  `current` only overrides the border color. No token or public API change.

- [#684](https://github.com/acronis/uikit/pull/684) [`3a216ac`](https://github.com/acronis/uikit/commit/3a216ac55025c4a24bb51e5da8cd107ff46fefbe) Thanks [@madjorr](https://github.com/madjorr)! - fix(stepper-item): mirror the asymmetric container padding under RTL

  `StepperItem` mapped its asymmetric container padding tokens
  (`--ui-stepper-item-global-container-padding-{l,r}`, 8px/16px) with physical
  `pl-`/`pr-` utilities. Because the avatar and label mirror with the flex order
  under `dir="rtl"`, the tighter padding stayed pinned to the visual left, so the
  spacing was inverted relative to the marker. They now use the logical `ps-`/`pe-`
  utilities, so the 8px side always sits next to the avatar in both directions.

- [#671](https://github.com/acronis/uikit/pull/671) [`98fecc7`](https://github.com/acronis/uikit/commit/98fecc76e16ae60ee158b8cbcd94695295e2dd37) Thanks [@madjorr](https://github.com/madjorr)! - Two fixes to `Wizard`'s examples and fixtures. No public API change to
  `Wizard`, `Stepper`, `StepperItem`, or `Section`.

  **Stepper avatar alignment.** `Wizard`'s Stepper examples (stories, Code
  Connect fixture, test composition) now compose their `Avatar` step markers
  the same way `StepperItem` documents: `[box-shadow:none]` switches off
  Avatar's 2px outset ring — built for `AvatarGroup` separation, it otherwise
  shows as a halo on a step's filled container — and the `current`/`future`
  markers recolor their digit to the matching
  `--ui-stepper-item-{current,future}-label-color` token.

  **Section API migration.** The same examples had been left behind by an
  already-released breaking change in `Section`: `SectionTitle` and
  `SectionDescription` no longer exist in this package. Wizard's stories, docs
  demo, and test fixtures now pass `SectionHeader`'s `title` / `description` /
  `hasDescription` props instead. This changes rendered output inside Wizard's
  own examples: the step-body section title is now a styled paragraph rather
  than an `<h2>`, and each example grows roughly 12–14px taller. Copy the
  updated examples if you were mirroring the old composition.

## 3.0.0

### Major Changes

- 7197836: Reconcile `Card` against its Figma design (node `10012-195993`).

  `CardHeader` now owns the title and description directly (`title`/`description`/
  `hasDescription` props) plus the design's full header feature set: a drag
  handle (`isDraggable`), a toggle switch (`isSwitchable` + `switchChecked`/
  `defaultSwitchChecked`/`onSwitchCheckedChange`/`switchDisabled`/`switchLabel`),
  an avatar (`hasAvatar`/`avatarLabel`/`avatar`), a rename button (`hasRename`/
  `onRename`/`renameLabel`), and `extras`/`actions` content slots. `Card` (the
  root) gained `hasError`, which swaps the border to the error token.

  **Breaking:** `CardTitle` and `CardDescription` are removed — their content is
  now `CardHeader`'s `title`/`description` props.

### Minor Changes

- a333f8b: Add `AccordionContainer`: the shared disclosure primitive behind `Card`'s and
  `Section`'s upcoming `isCollapsable` variant. Built directly on Base UI's
  Collapsible — owns open state, the trigger button, chevron rotation, and panel
  animation — while imposing no visual styling beyond what the disclosure
  mechanic itself requires (no padding/background/border on `Root`/`Content`, no
  position/hover opinion on `Trigger` beyond its chevron color). `children`
  accepts a render-prop function receiving the current `{ open }` state, so a
  header rendered outside `Content` can vary by state even when the component
  owns it uncontrolled.
- 18a32a9: Add `variant` (`'text'` / `'icon'`), `label`, and `icon` props to `Avatar` for
  the no-photo case, matching the current Figma component — with no `children`
  composed, `variant="text"` (default) shows `label` (default `'SB'`) and
  `variant="icon"` shows a consumer-supplied `icon`. Composing
  `AvatarImage`/`AvatarFallback` as children still takes precedence over both,
  so existing usage is unaffected — including an explicit `null` child, which
  renders an empty circle rather than falling back to `'SB'`. Also adds the
  missing Figma Code Connect
  mapping for `Avatar` itself (previously only `AvatarGroup` was mapped) and
  fixes its `ui-spec` Figma node reference, which pointed at the group node.
- 4e06c56: Fix two visual bugs in `Card`'s collapsible composition: `CardHeader` no
  longer doubles up its bottom divider against `Card`'s own outer border once
  the panel is collapsed (it now reads the accordion's `open` state via
  `AccordionContainer`'s context instead of a new prop), and the collapsible
  Storybook stories no longer re-center the whole card when the panel's height
  changes. Also exports `useAccordionContainerContext` and
  `AccordionContainerContextValue` from `AccordionContainer`.
- ee6e51d: Add `CardSection`: a band of content that stacks inside a `Card`'s body, below
  `CardHeader`.

  Six variants pick the body shape — `slot` (arbitrary passthrough), `tag` (a
  wrapping tag row, with an example row as its default), `list`
  (title/description key-value rows), `table-actions` (a table rendered flush so
  its rows run edge-to-edge inside the card), and `card-primary` /
  `card-secondary` (a nested `Card` on the primary or secondary surface).

  `hasHeader` adds the section's own 14px mini-header — distinct from
  `CardHeader` — with a title, inline `extras`, and end-aligned `actions`;
  `hasHeader` and `title` form a discriminated union, so turning the header on
  without a title fails to compile. `hasBottomBorder` adds a divider and matching
  bottom padding for stacking several sections in one card body. The root is
  polymorphic via the Base UI `render` prop.

- e624af6: Add `EmptyOverlay`: a full-bleed empty-state overlay — a colored icon badge
  (reusing `Avatar`'s 8-color palette) over a centered title/description, on a
  fade-to-solid backdrop. The developer sizes/positions it (e.g. `absolute
inset-0` over a positioned parent); the component fills whatever box it's
  given.

### Patch Changes

- 010c1f7: Fix `AccordionContainer.Trigger` missing a visible keyboard focus indicator.
  The trigger now gets the same `focus-visible:ring-2` treatment as
  `AccordionTrigger` in the plain `Accordion` component.
- 7f8eea5: Add a `Card` Storybook story showing content that overflows both axes, to
  document the current clip-not-scroll behavior coming from `Card`'s root
  `overflow-hidden`.
- cdc0328: Add a `Card` Storybook story showing how a consumer opts into a scrollable
  body — a bounded, `overflow-y-auto` `CardContent` inside a flex-column
  `Card` — as the counterpart to `OverflowingContent`'s default clip behavior.
- 6404e45: Fix `DataTable`'s `id: 'select'` selection column: it now always renders at a
  fixed 48px width and is never resizable, regardless of `enableColumnResizing`
  or a caller-supplied `size`. Also replaces the drag-reorder cursor's
  hand-authored `--ui-draggable-cursor[-active]` custom properties (now removed
  from `styles/index.css`) with literal `cursor-grab`/`cursor-grabbing`
  Tailwind utilities.
- 603a81a: Fix `DataTable`'s pinned/sticky columns: the leading selection (checkbox)
  column's row-hover background now fades in sync with the row, matching the
  trailing pinned actions column, instead of snapping in abruptly. Adds
  `transition-colors` to the `TableCell` primitive — used by every table cell,
  not just the pinned selection column — and to the `TableSelectCell` primitive
  used by standalone `Table` compositions (`DataTable` itself never renders
  `TableSelectCell`).
- Updated dependencies [aa75f63]
- Updated dependencies [4d82064]
  - @acronis-platform/tokens-pd@2.8.0

## 2.0.0

### Major Changes

- [#655](https://github.com/acronis/uikit/pull/655) [`41f4f2e`](https://github.com/acronis/uikit/commit/41f4f2effcfd6680f2d8ac9d2a5b455d82bb3090) Thanks [@madjorr](https://github.com/madjorr)! - `DataTable`: the trailing sticky action column (column-visibility cog in the header, per-row overflow ellipsis) is now built in rather than something every consumer had to assemble by hand as an extra `ColumnDef` plus `DataTableViewOptions`/`DropdownMenu` wiring.
  - Shown by default. Set `hideActionColumn` to omit it entirely.
  - `renderRowActions={(row) => <DropdownMenuGroup>…</DropdownMenuGroup>}` supplies the ellipsis menu's content — the trigger, `DropdownMenu` wrapper, and bulk-selection suppression (`isBulkSelectionActive`) are `DataTable`'s own. Omit it to render the row without a trigger; the 48px column is still reserved.
  - `rowActionsLabel` / `columnSettingsLabel` localize the two triggers' accessible names.
  - A no-op when an external `table` is passed — build the column into that instance's own `columns` instead, as before.
  - The pinned action cell now mirrors the row's hover tint instead of staying visually idle, and hovering the cell's own trigger no longer bleeds a hover tint onto the rest of the row.

  **Breaking**: a consumer that already built its own trailing `settings`/`id` column with `DataTableViewOptions` (iconOnly) in the header now gets two cog triggers. Drop the hand-rolled column and either rely on the new default, or pass `hideActionColumn` to opt out.

- [#655](https://github.com/acronis/uikit/pull/655) [`41f4f2e`](https://github.com/acronis/uikit/commit/41f4f2effcfd6680f2d8ac9d2a5b455d82bb3090) Thanks [@madjorr](https://github.com/madjorr)! - Move column visibility out of the DataTable toolbar and onto the settings-column
  cog, per the Figma design.
  - **Breaking:** `DataTableToolbar` no longer renders `DataTableViewOptions`.
    With the `Table` primitives, compose the menu into your own trailing
    settings column instead — put `<TableViewOptions iconOnly />` inside a
    `TableSettingsCell`. `DataTable` consumers don't need to do this by hand:
    its built-in trailing action column (see the built-in-action-column
    changeset) already renders `DataTableViewOptions iconOnly` for you. A
    consumer using an _external_ `table` with `DataTableToolbar` and no
    built-in action column (it's suppressed for external tables) loses the
    column-visibility control entirely unless they add `<DataTableViewOptions
table={table} iconOnly />` next to the toolbar themselves.
  - `TableViewOptions`/`DataTableViewOptions` gain `iconOnly` (cog-only trigger
    sized for the 48px settings cell) and `triggerAriaLabel` (default
    `'Column settings'`); `DataTableViewOptions` also forwards `triggerLabel`.
    The default labelled "View" trigger is unchanged.
  - `TableViewOptions` menu rows now render a real `Checkbox` box beside the
    column name instead of a trailing checkmark shown only when checked. The
    accessible contract is unchanged: each row is a `menuitemcheckbox` with
    `aria-checked`.

### Minor Changes

- [#655](https://github.com/acronis/uikit/pull/655) [`41f4f2e`](https://github.com/acronis/uikit/commit/41f4f2effcfd6680f2d8ac9d2a5b455d82bb3090) Thanks [@madjorr](https://github.com/madjorr)! - `DataTableBulkActionsBar`: new selection-aware bulk-actions bar for `DataTable` — a thin TanStack adapter that renders the selected-row count (`table.getSelectedRowModel()`), a Deselect control wired to `table.resetRowSelection()`, and the consumer's bulk actions as `children`.

  It is a separate part rather than an extension of `DataTableToolbar`, and it is **always mounted** rather than swapped in for the toolbar — see `isBulkSelectionActive` below for its two-state behavior. Drive it off its own minimal `useReactTable` instance (just the columns needed for selection) and share state with the grid via `DataTable`'s new `rowSelection` / `onRowSelectionChange` props, so both read one lifted selection state without requiring a single shared `table` instance. Both labels are localizable (`selectedLabel`, `clearLabel`).

  The approved composition is captured in the `data-table-bulk-actions` usage pattern (now `ready`), and demonstrated by the `CoreCapabilities` / `CoreCapabilitiesWithPagination` stories under `UI/DataTable`.

- [#655](https://github.com/acronis/uikit/pull/655) [`41f4f2e`](https://github.com/acronis/uikit/commit/41f4f2effcfd6680f2d8ac9d2a5b455d82bb3090) Thanks [@madjorr](https://github.com/madjorr)! - `DataTableBulkActionsBar` / `TableActionsCell`: move the row-actions ↔ bulk-actions switch point into the components.

  The threshold is now a single shipped predicate, `isBulkSelectionActive(table)` — **one or more rows selected**, including exactly one. It was previously left to each consumer to re-derive.
  - `DataTableBulkActionsBar` is **always mounted** — it doesn't appear and disappear with the selection. It switches between two states on the predicate: with nothing selected its actions are disabled (a native `<fieldset disabled>`) and the trailing side shows the new `loadedLabel` (e.g. `"25 of 1250 items loaded"`); from the first selected row on, the actions enable and the trailing side shows the selection summary plus **Deselect**.
  - `TableActionsCell` takes a `bulkSelectionActive` prop: it keeps its 48px column (no grid reflow) but renders no children and no hover/press tint. Consumers no longer swap in a blank `TableCell` themselves.

  The 32px checkbox column (`TableSelectCell`) is untouched.

  `DataTable` also gains controlled `rowSelection` / `onRowSelectionChange` props (uncontrolled internal state when omitted), the mechanism for lifting selection out to a separately-mounted `DataTableBulkActionsBar`'s own `useReactTable` instance.

- [#655](https://github.com/acronis/uikit/pull/655) [`41f4f2e`](https://github.com/acronis/uikit/commit/41f4f2effcfd6680f2d8ac9d2a5b455d82bb3090) Thanks [@madjorr](https://github.com/madjorr)! - `DataTable`: built-in column drag-to-reorder (`enableColumnReordering`), promoted from a story-only recipe.

  Every non-pinned header cell becomes draggable; dropping it on another header moves that column into the target's position (native HTML5 drag-and-drop over TanStack's `columnOrder` — no new dependency). Pinned columns are excluded, since they're anchored to a table edge by definition, and the resize handle is explicitly non-draggable so both features can be enabled together. The order can be left internal or controlled via `columnOrder` + `onColumnOrderChange` (e.g. to persist the user's order); both are no-ops with an external `table` instance, like `enableColumnResizing`. The reorder helper `reorderColumn(order, from, to)` is exported for callers driving their own order state.

  The grab/grabbing cursors come from new `--ui-draggable-cursor` / `--ui-draggable-cursor-active` custom properties, mirroring how the resize handle uses the generated `--ui-resizable-cursor`. They're hand-authored in `src/styles/index.css` (like `--ui-breakpoint-*`) because the design system has no Figma variable for a grab cursor yet — no component hardcodes `cursor-grab`.

  Resizing a column also sets a `data-ui-column-resizing` attribute on `<html>` for the duration of the drag; a new global rule (`html[data-ui-column-resizing] * { cursor: var(--ui-resizable-cursor) !important; }`) keeps the resize cursor stable over every element the pointer crosses, instead of flickering back to a neighboring header's own `cursor-pointer`.

  The gesture is pointer-only; there is no keyboard equivalent yet (the resize handle's Arrow-key path has no analogue here).

- [#655](https://github.com/acronis/uikit/pull/655) [`41f4f2e`](https://github.com/acronis/uikit/commit/41f4f2effcfd6680f2d8ac9d2a5b455d82bb3090) Thanks [@madjorr](https://github.com/madjorr)! - `DataTable`: header cells now explain their own gestures, and the resize handle highlights while it is grabbed.
  - Hovering (or focusing) a header cell opens a tooltip listing one line per capability that column actually has — `Sort column: Click`, `Reorder column: Drag`, `Resize column: Drag border`. A column with none of the three (e.g. a pinned, non-sortable, non-resizable select column) shows no tooltip.
  - `headerHints` localizes the copy per capability, e.g. `headerHints={{ sort: { label: 'Spalte sortieren', action: 'Klick' } }}`.
  - The column-resize handle now switches from the plain row-border color to `--ui-resizable-border-color-hover` on hover/focus and `--ui-resizable-border-color-active` while resizing, instead of only fading in.
  - While a resize or a column drag is in progress, the capability tooltip is suppressed for the column being interacted with, and a header's own sort hover/press tint no longer fires — the two gestures no longer visually fight each other.

- [#655](https://github.com/acronis/uikit/pull/655) [`41f4f2e`](https://github.com/acronis/uikit/commit/41f4f2effcfd6680f2d8ac9d2a5b455d82bb3090) Thanks [@madjorr](https://github.com/madjorr)! - `DataTable`: rows are now keyboard-focusable via a roving tabindex — exactly one row is a Tab stop at a time (the rest are `tabIndex={-1}` but still focusable by click), so Tab moves into and out of the row group once instead of skipping it. Arrow Up/Down move focus between rows and clamp at the first/last row. Applies to DataTable's default row-rendering path only (skeleton and empty-state rows, and rows rendered via `renderRow`, are unaffected); composes with `highlightCurrentRow`, `selected`, and pinned/sticky columns.

- [#659](https://github.com/acronis/uikit/pull/659) [`2130f76`](https://github.com/acronis/uikit/commit/2130f767f7da334a89edb9a18d6216838d5735aa) Thanks [@madjorr](https://github.com/madjorr)! - Add `Stepper`: the root of a step sequence, composing `StepperItem`. It renders
  both of the design's layouts and lets a real viewport media query pick one — a
  start-aligned, wrapping row of steps at 1024px and above, and a two-line text summary
  ("Step 3 of 5: …" / "Next: …") below it. No `ResizeObserver` and no measuring
  pass: both subtrees stay in the DOM and only one is ever displayed, so exactly
  one is announced to assistive tech. Wrapped lines pack to the top of the row
  rather than being distributed across any leftover container height, so a second
  line sits flush under the first. The "Next: …" line is omitted entirely when
  no `next` step is supplied, and every string the component generates itself
  (`stepLabel`, `ofLabel`, `nextLabel`, `separatorLabel`) is a prop so it can be
  translated.

- [#659](https://github.com/acronis/uikit/pull/659) [`e1a7d61`](https://github.com/acronis/uikit/commit/e1a7d612396e0ef755e112845bcafdb7707d8883) Thanks [@madjorr](https://github.com/madjorr)! - Add `StepperItem`: one step in a stepper — a consumer-composed `Avatar` marker
  plus the step name, with a `variant` for the step's role in the sequence
  (`current` / `completed` / `future`), a `state` for the interaction look (only
  meaningful on a completed step), and Base UI `render`-prop composition so a
  completed step can be a real `<button>` — which then carries the library's
  standard 3px `--ui-focus-primary` focus ring. A future step is `aria-disabled`,
  takes no pointer events, and is removed from the tab order, and on the default
  `<div>` it gets an explicit `role="link"` so `aria-disabled` is actually
  announced.

  The Figma component set has no `--ui-stepper-item-*` token tier yet, so this
  consumes the semantic/generic tokens whose resolved values match the design
  variables exactly (documented in the component source and its ui-spec
  `tokens.yaml`); re-point them once the dedicated tier ships.

### Patch Changes

- [#667](https://github.com/acronis/uikit/pull/667) [`ddd7025`](https://github.com/acronis/uikit/commit/ddd70256a7f9d644caf8af8851dbf65b64d8c883) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Drive `Alert` and `Toast` titles from their own component token tier.

  Both titles borrowed the semantic `ui-typography-headings-lead` class because
  their tiers emitted one only for the description. The tiers now emit a title
  text style too, so each component reads its own — matching what the description
  already did, and letting a brand re-style just the Alert or Toast title. The two
  classes resolve identically today (Inter Regular 18 / 24), so nothing renders
  differently.

- [#655](https://github.com/acronis/uikit/pull/655) [`41f4f2e`](https://github.com/acronis/uikit/commit/41f4f2effcfd6680f2d8ac9d2a5b455d82bb3090) Thanks [@madjorr](https://github.com/madjorr)! - `Checkbox`: fix the checkmark/dash disappearing when a checked box is nested inside an ancestor that sets its own SVG color — e.g. `TableViewOptions`' menu rows, which now put a `Checkbox` inside a `DropdownMenuItem` whose `[&_svg]:text-…` styling was out-specifying the indicator's `text-current`. The indicator icon now forces `text-current` with `!important` so it always tracks the checkbox's own state color regardless of ancestor SVG color rules.

- [#655](https://github.com/acronis/uikit/pull/655) [`41f4f2e`](https://github.com/acronis/uikit/commit/41f4f2effcfd6680f2d8ac9d2a5b455d82bb3090) Thanks [@madjorr](https://github.com/madjorr)! - `DataTable`: Storybook/VR coverage note — `data-table.stories.tsx` was consolidated from ~20 single-variant exports down to `Default`/`CoreCapabilities`/`CoreCapabilitiesWithPagination`, which together exercise sorting, resizing, reordering, selection, the bulk-actions bar, infinite loading, and row actions in composition. `data-table-recipes.stories.tsx` was deleted outright. Its `ColumnReorder` export is not lost but reshaped: reordering is now exercised through the new built-in `enableColumnReordering` prop in the consolidated stories.

  Two coverage gaps result:
  - Five still-public props currently have **no dedicated visual regression coverage**: `striped`, `bordered`, `skeleton`, `emptyLabel`, and `expandable` rows.
  - The deleted recipes file's other patterns — `TreeMode`, `RowGroups`, `VirtualScrolling`, and `ServerDriven` — now have **no** Storybook/VR coverage in `ui-react` at all. (`WithDateRangeFilter`/`WithDateRangeFilterOpen` are unaffected: equivalent stories, with their committed baselines, still live in `table/__stories__/table-full-demo.stories.tsx`.)

  A future change should add targeted stories (+ VR baselines, light/dark) for these before relying on Storybook to catch a visual regression in them.

- [#655](https://github.com/acronis/uikit/pull/655) [`eddc8cc`](https://github.com/acronis/uikit/commit/eddc8cc7d837ae47156139166311e24112aef0ac) Thanks [@madjorr](https://github.com/madjorr)! - fix(data-table): stop row arrow-key navigation from hijacking arrow keys pressed inside a cell's interactive control (number spinner, textarea, native select)

- [#655](https://github.com/acronis/uikit/pull/655) [`41f4f2e`](https://github.com/acronis/uikit/commit/41f4f2effcfd6680f2d8ac9d2a5b455d82bb3090) Thanks [@madjorr](https://github.com/madjorr)! - Reconcile `Table` with its Figma design and complete the Code Connect link.
  - Header cells now theme every interaction state from
    `--ui-table-header-cell-color-{idle,hover,active}`; a sortable `<th>` tints
    the whole cell and owns the focus ring (in the `Table` primitives), rather
    than an inner button doing it. Data cells pick up `--ui-table-data-cell-color-idle`
    (previously unused); the `hover`/`active` pair of that same tier is consumed
    by `TableActionsCell` and `DataTableExpandTrigger` — plain `TableCell` still
    gets its hover tint from the row's `--ui-table-data-row-color-hover`.
  - Replaced the hard-coded `h-10` row height with
    `--ui-table-global-cell-min-height`, added the missing header
    `--ui-table-global-cell-padding-y`, and drove the row divider from
    `--ui-table-global-row-border-{width,style}` instead of a literal `1px`.
  - Added three structural cells the design documents but the library lacked:
    `TableSelectCell` (32px row-selection column, `header` prop for the
    select-all cell), `TableActionsCell` (48px trailing row-actions column) and
    `TableSettingsCell` (48px trailing header column for a column-settings
    trigger).
  - `DataTableColumnHeader`: aligned the focus ring with the kit-wide 3px
    treatment, and made the sort toggle's accessible label localizable via a
    new `sortLabel` prop (was a hard-coded string). The pressed state itself is
    wired on the enclosing `<th>`/header cell, not on this button.
  - `TableRow` now wires the keyboard focus state the design documents on the row
    itself (a full-row 3px ring). Rows aren't focusable by default, so this only
    paints once a consumer sets `tabIndex` on them. Header rows opt out of the
    row-level hover tint, since it doesn't apply to `<thead>`.
  - `DataTableExpandTrigger` lives in a data cell, so it now tints from
    `--ui-table-data-cell-color-{hover,active}` instead of the header tier, uses
    the kit-wide 3px focus ring, and takes `expandLabel` / `collapseLabel` so its
    accessible name can be localized (was hard-coded).
  - Localization: every string `TablePagination` / `DataTablePagination` rendered
    itself is now a prop with the English text as its default —
    `rowsPerPageLabel`, `firstPageLabel`, `previousPageLabel`, `nextPageLabel`,
    `lastPageLabel`, plus the `pageLabel` / `summaryLabel` formatters. `DataTable`
    gains `resizeColumnLabel` and `emptyLabel` for the same reason. Defaults
    reproduce the previous output exactly, so this is not a visual change. A
    custom `summaryLabel` is now also invoked when `selectedRows` is
    `undefined` (previously skipped in that case), per its existing tsdoc.

- [#668](https://github.com/acronis/uikit/pull/668) [`73fe571`](https://github.com/acronis/uikit/commit/73fe571eb6ef9ba54e4e1c261e57b6a01ee71ebd) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Theme `Timeline`'s connector and gap from the `--ui-timeline-*` tier.

  The component consumed the alias targets `--ui-border-on-surface-border` and
  `--ui-gap-16` because the Figma variables it references had no tier of their
  own. That tier now ships, so the connector, the elbow and the marker-to-card
  gap read `--ui-timeline-connector-color` and `--ui-timeline-gap` directly, and
  `src/styles/index.css` imports the tier.

  Figma binds `Timeline/gap` only to the horizontal marker-to-card gap and the
  indent step derived from it; the vertical rhythm between rows and the card
  header's spacing are unbound literals in the design and stay on `--ui-gap-16`.
  Every value resolves the same today, so nothing renders differently — but a
  brand override of the Timeline tokens is now honored.

- Updated dependencies [[`ab6c61e`](https://github.com/acronis/uikit/commit/ab6c61e24998c58472fdab37f5ccdb06be4056bb)]:
  - @acronis-platform/tokens-pd@2.7.0

## 1.0.0

### Major Changes

- [#635](https://github.com/acronis/uikit/pull/635) [`09b7276`](https://github.com/acronis/uikit/commit/09b727602a7cbc3e9921bf015883dd908b40f7ed) Thanks [@madjorr](https://github.com/madjorr)! - **Breaking:** let `InputText`, `InputPassword`, `InputTextArea`,
  `InputDatePicker`, `InputSearch`, `InputSelectField`, and `NumberFieldGroup`
  follow consumer sizing instead of always stretching to fill their container.
  - `InputText`, `InputPassword`, `InputTextArea`, `InputDatePicker`,
    `InputSearch`, `InputSelectField`, and `NumberFieldGroup` no longer hardcode
    `w-full` on their outer wrapper, which previously overrode a narrower
    flex/grid ancestor. A field placed in a constrained flex row (e.g. alongside
    a sibling) now shrinks to its `min-w` instead of being force-stretched to
    evenly split the row. Any layout that relied on this implicit full-width
    stretch (rather than an explicit `w-full` on a wrapper) should add that
    class itself.
  - **`className` on `InputText`, `InputPassword`, `InputTextArea`, and
    `InputDatePicker` now targets the field wrapper (label + box + message),
    not the inner `<input>` / `<textarea>` / trigger button.** Consumers
    passing `className` to style the input/textarea/trigger directly (e.g. a
    custom border or background) need to re-target those styles — width
    utilities are the common case and now work as expected on the wrapper.
    `DateRangePicker` forwards its own `className` straight into
    `InputDatePicker`, so this retargeting applies to it too.
  - **`style` on `InputText`, `InputPassword`, `InputTextArea`, and
    `InputDatePicker` now targets the field wrapper too — the same DOM node as
    `className` — instead of the inner `<input>` / `<textarea>` / trigger
    button.** Previously the two props landed on different elements, so
    `<InputText className="w-24" style={{ width: 100 }} />` sized two nodes at
    once. Consumers using inline `style` to paint the control itself (border,
    background, height) need to re-target it; sizing works as expected on the
    wrapper.

- [#656](https://github.com/acronis/uikit/pull/656) [`48117b4`](https://github.com/acronis/uikit/commit/48117b4e3db20536cac0935a312e9ed16630f9ca) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - **Breaking:** rebuild `Toast` against the Figma redesign (node `7421:126262`) and
  its own `--ui-toast-*` token tier.

  The card is now the `Alert` banner plus a drop shadow — a neutral surface with the
  severity carried by a 1px status-colored border, a 6px status line down the leading
  edge, and a fixed multicolor status icon — with every color, geometry, and spacing
  value coming from the `Toast` tier instead of the previous semantic-token
  approximation (`bg-background` / `border-border` / `shadow-md` and a tinted
  monochrome icon). The delivery mechanism is unchanged: one `<Toaster />` at the app
  root plus the imperative `toast(...)` API.

  Breaking changes:
  - **`toast.error` is gone.** The severity vocabulary now matches the Figma:
    `toast.info` / `success` / `warning` / `critical` / `danger`. Replace
    `toast.error(…)` with `toast.danger(…)`. `toast.critical` is new, and a bare
    `toast(…)` is now `info` (it previously rendered without a status icon).
    `toast.promise`'s failure branch still resolves to the danger visual.
  - **`options.action` is replaced by `options.actions`.** Pass an array of
    `{ label, onClick?, variant? }` descriptors instead of a single
    `{ label, onClick }`. They render as real `Button`s in a wrapping row — the first
    `secondary`, the rest `ghost` — matching the Figma's `actionsList`, instead of the
    previous single text link. Replace `action: { label, onClick }` with
    `actions: [{ label, onClick }]`.
  - `ToastType` gains `critical` and `danger` and loses `error`; `ToastVariant`,
    `ToastAction`, and `toastVariants` are newly exported.

  Also in this change:
  - `options.dismissable` (default `true`) mirrors the Figma's `dismissable` boolean,
    which binds the close ButtonIcon's visibility. Setting it `false` also revokes
    Base UI's swipe-to-dismiss — that is on by default, so hiding the control alone
    would have hidden the affordance while leaving the capability.
  - `<Toaster>` takes `label` and `closeAriaLabel` so the region's and the dismiss
    control's accessible names can be localized — they were hardcoded.
  - The dismiss control is a real ghost `ButtonIcon`, as the Figma specifies.
  - Descriptions clamp to three lines with an ellipsis (the Figma text node's
    truncation), and the enter/exit slide now mirrors under `dir="rtl"`.
  - The `Toast` token tier is imported in `src/styles/index.css`; without it the new
    `--ui-toast-*` references would not resolve.

### Minor Changes

- [#653](https://github.com/acronis/uikit/pull/653) [`079a1db`](https://github.com/acronis/uikit/commit/079a1dbe38579b8739f8925c42f4b96e14ba7f81) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Rebuild `Alert` against the current Figma design (node `7421:125155`) and its own
  `--ui-alert-*` token tier.

  The banner is no longer a pale status-tinted surface. It is now a neutral surface
  whose severity is carried by a status-colored 1px border plus a 6px status line
  down the leading edge (mirrored under `dir="rtl"`), with the geometry, colors, and
  spacing all read from the `Alert` tier — which was present in `tokens-pd` but not
  imported by this package, so none of it was reaching the component.

  **Breaking — `variant` now matches the Figma set exactly:**
  - `destructive` → renamed **`danger`**.
  - `ai` and `neutral` are **removed**; they were invented during the original port
    from `shadcn-uikit` and have no counterpart in the design system's Alert.

  **New:**
  - `AlertClose` — the trailing dismiss control (a ghost `ButtonIcon`). Rendering it
    is what makes an alert dismissable; its `ariaLabel` defaults to `"Close"`.
  - `AlertText` — wraps the title and description. Its vertical padding is what
    aligns the first line of text with the status icon, so move existing
    title/description children inside it.
  - `AlertIcon` now renders the variant's own multicolor status icon when given no
    children, so consumers no longer have to know the icon-per-severity mapping.
    Passing children still overrides it.
  - `alertVariants` and the `AlertVariant` type are exported.

  **Status line:** the 6px leading status line now genuinely covers the 1px border,
  as the design intends. It is positioned to bleed 1px outwards, but `overflow: clip`
  clips at the _padding_ box — the same box that forms an absolutely positioned
  pseudo-element's containing block — so the bleed was silently shaved off and the
  line rendered 5px wide starting inside the border. Since the border and the line
  use different tokens, every variant read as two adjacent stripes. Moving the clip
  edge to the border box (`overflow-clip-margin: border-box`) lets the bleed survive
  while still rounding the line's square corners.

  **`AlertClose`:** `variant` and `render` are removed from `AlertCloseProps`, since
  the control is documented as a fixed ghost `ButtonIcon` and `...props` spread after
  those defaults — `<AlertClose variant="secondary" />` previously type-checked and
  silently won. `aria-label` is dropped from the type too, but because TypeScript
  does not check hyphenated JSX attributes, `ariaLabel` is now also pinned after the
  spread so it stays authoritative.

  **Typography:** the title now uses the generated `ui-typography-headings-lead`
  class (Inter Regular 18 / 24) instead of hand-written `text-base font-medium`
  utilities (Inter Medium 16 / 24), and the description uses the Alert tier's own
  generated description class (same computed values as before). `Toast` shares both,
  so the two banners are typographically identical.

- [#657](https://github.com/acronis/uikit/pull/657) [`2d35342`](https://github.com/acronis/uikit/commit/2d353420ddc8e7acef0b058184a15956fd0f00f3) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `ButtonGroup` / `ButtonGroupItem`: a compact cluster of related icon-only
  actions sharing one hairline-separated box, matching the Figma `ButtonGroup`
  component set. Two container styles (`outlined`, `inlined`) themed by the
  `--ui-button-group-*` token tier, which is now imported by the package
  stylesheet.

  Built on Base UI's Toolbar, so the group follows the WAI-ARIA toolbar pattern:
  one Tab stop with arrow-key roving between items. Item position is derived from
  the DOM rather than exposed as a prop, so the group stays variadic, and the
  separator is an inline-end border so it mirrors under `dir="rtl"`.

- [#658](https://github.com/acronis/uikit/pull/658) [`f4e1762`](https://github.com/acronis/uikit/commit/f4e17628e856e2ac66a118da8fda1543c6ed5af2) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `ButtonIconMenu`: the kebab ("more options") menu trigger from Figma — a 32×32 bordered icon-only button with a fixed 16px ellipsis glyph, across idle, hover, open, disabled, and focus states. It composes `ButtonIcon variant="secondary"` (the design draws it from the same `--ui-button-icon-*` token tier), adds menu-trigger semantics (`aria-haspopup="menu"`, `aria-expanded` from the `open` prop), and takes its accessible name from `ariaLabel`.

- [#663](https://github.com/acronis/uikit/pull/663) [`d2d1061`](https://github.com/acronis/uikit/commit/d2d106106e5cc36481272d496af92aac729c906e) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add the `operational` variant to `Chip` and correct the remove icon's size.
  - `variant="operational"` is a plain action chip from the Figma `type=operational`
    design: `role="button"` with no × and no `aria-pressed`, and a strong-link label
    (semibold, `--ui-chip-operational-label-color`).
  - The remove (×) glyph was rendering ~1.6× too large: it used `TimesIcon`, whose
    mark spans ~85% of the icon box, where the design uses `TimesSmall` (~52%). It
    now renders `TimesSmallIcon` with `size={16}`, which also picks the 16px stroke
    spec (1.6px) instead of scaling the 24px master down to 1.33px. This changes the
    appearance of every `removable` chip, including those inside `FilterSearch` and
    the data-table toolbar.

- [#644](https://github.com/acronis/uikit/pull/644) [`50f1b63`](https://github.com/acronis/uikit/commit/50f1b638b5aea06b877e7fd888dc178b47ea5f1a) Thanks [@madjorr](https://github.com/madjorr)! - `DateRangePicker`: swap its internal dual-month `Calendar` for `CalendarPanel` (`variant="range"`), adopting its Cancel/Apply footer in place of the component's own Reset/Apply footer and start/end text fields.

  **Behavior change:** the editable start/end date text fields, the "Reset to default" action, and the Apply-disabled-while-unchanged guard have been removed in favor of `CalendarPanel`'s own footer. No prop or export was removed, but the labelled `Start date`/`End date` inputs are gone from the DOM with no deprecation path — an e2e or a11y test that targets them (e.g. `getByLabelText('Start date')`) will break.

  `DateRangePicker` now forwards `CalendarPanel`'s localization (`monthLabel`, `yearLabel`, `cancelLabel`, `applyLabel`, `locale`, `formatMonthLabel`) and navigation/constraint props (`disabledDays`, `min`, `max`, `showOutsideDays`, `weekStartsOn`, `fromYear`, `toYear`), and auto-detects the ambient text direction (`useDocDir()`) so the popup calendar's keyboard arrow-key navigation mirrors correctly under RTL — including when `DateRangePicker` is composed inside another component's portaled content, since it reads `document.documentElement` rather than doing a DOM `dir`-ancestor lookup off the trigger.

  `locale` also now reaches the trigger itself: its `MMM d, yyyy` display translates the month name (e.g. `es` renders "jul 1, 2026"), though the day/year order stays fixed — full locale-aware reordering isn't supported yet.

- [#647](https://github.com/acronis/uikit/pull/647) [`f980023`](https://github.com/acronis/uikit/commit/f9800232de2866e9c045cf69765424de9686a605) Thanks [@leonid](https://github.com/leonid)! - feat(dropdown-menu): add `CheckboxItem`, `RadioGroup`, `RadioItem`, `Label`, `Separator`

  Five components present in the shadcn/ui `DropdownMenu` convention were missing
  from the DS, leaving callers that need checkbox or radio selections, section
  labels, or explicit dividers with no DS-native option.

  New exports:
  - **`DropdownMenuCheckboxItem`** — wraps `MenuPrimitive.CheckboxItem`; renders a
    check icon via `MenuPrimitive.CheckboxItemIndicator` when the item is checked.
    Inherits full item styling, plus an in-flow leading indicator slot the same size
    as a menu-item icon, so its label sits on the item gap grid (container padding-x,
    then a 16px glyph, then the item gap) and the glyph centers on the label's first
    line.
  - **`DropdownMenuRadioGroup`** — bare alias for `MenuPrimitive.RadioGroup`; groups
    radio items so only one can be checked at a time.
  - **`DropdownMenuRadioItem`** — wraps `MenuPrimitive.RadioItem`; renders a filled
    circle via `MenuPrimitive.RadioItemIndicator` when selected. Same indicator slot
    as `CheckboxItem`.
  - **`DropdownMenuLabel`** — non-interactive `<div>` section label, styled with the
    `--ui-button-menu-dropdown-item-*` padding and label-color tokens. Accepts an
    `inset` prop that indents it by the indicator slot to align with checkbox/radio
    item labels.
  - **`DropdownMenuSeparator`** — non-interactive `<div role="separator">` that
    draws a horizontal rule using the
    `--ui-button-menu-dropdown-section-container-border-*` tokens for height and
    color, with `my-[--ui-button-menu-dropdown-section-list-gap]` spacing.

  All additions are backwards-compatible: no existing exports changed.

- [#663](https://github.com/acronis/uikit/pull/663) [`7cc2c25`](https://github.com/acronis/uikit/commit/7cc2c259c027ae2995068d74e2d0e083cff124c1) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `FilterChips` — the applied-filter row from Figma (`FilterChips`, node
  `3897-7039`): a wrapping list of removable `Chip`s closed by a ghost
  "Reset filters" action. Three composable parts mirroring the design's
  `ListChips` slot — `FilterChips` (root, `role="group"` named via `ariaLabel`,
  16px gap), `FilterChipsList` (the wrapping chip container, 8px gap in both axes)
  and `FilterChipsReset` (the clear-all action, label defaulting to
  "Reset filters"). Pure layout: it consumes only `--ui-gap-16` / `--ui-gap-8`,
  with everything visible coming from `Chip`'s and `Button`'s own tiers. Both the
  root and the reset action are polymorphic via the `render` prop.

  `FilterSearchAppliedFilters` — shipped as design-pending precisely for this row —
  now renders through those parts instead of repeating the layout, so the design
  lives in one place. Its API is unchanged; the row's inter-chip gap corrects from
  12px to the design's 8px, and it now exposes the `role="group"` name (override
  with `ariaLabel`).

- [#636](https://github.com/acronis/uikit/pull/636) [`ee23ba0`](https://github.com/acronis/uikit/commit/ee23ba0ccf764339ad3c94418a3a3dc0995ea4af) Thanks [@madjorr](https://github.com/madjorr)! - Fix `FilterSearchFilters`'s popover clipping inside a constrained `PortalContainerProvider` (MFE/Shadow DOM) container — `PopoverContent` now defaults to `fixed` positioning whenever a custom portal container is resolved, so the popup escapes a plain overflow-clipping ancestor instead of being clipped at the container's edge, and exposes `portalContainer`, `collisionBoundary`, and `positionMethod` overrides. `FilterSearchFilters` forwards `portalContainer`, `collisionBoundary`, `positionMethod`, `side`, `align`, `sideOffset`, and `contentClassName` for consumers who need to configure the popover directly.

  Also fix the hardcoded "Reset filters" / "Cancel" / "Apply" / "Remove `<key>` filter" action labels on `FilterSearchFilters` and `FilterSearchAppliedFilters` — they're now overridable via `resetFiltersLabel`, `cancelLabel`, `applyLabel`, and `getRemoveFilterLabel` props (English defaults unchanged) so consumers can localize them.

- [#648](https://github.com/acronis/uikit/pull/648) [`1d996a4`](https://github.com/acronis/uikit/commit/1d996a4e23a7933eaee3ddaee8183b07a260596c) Thanks [@leonid](https://github.com/leonid)! - feat(fitted-actions): add `FittedActions` component

  `FittedActions` is a responsive action row with automatic overflow: actions
  render inline in priority order, and trailing items collapse into a "More"
  dropdown menu when the container is too narrow to show them all. The visible
  count is recomputed on every resize via `ResizeObserver`.

  **How it works**

  An off-screen tracing layer renders every action as a ghost-button span plus the
  overflow trigger; the `ResizeObserver` callback reads their `offsetWidth` values
  and calls `computeFittedVisibleCount` — pure math, no DOM — to decide the split.
  All state updates happen inside the callback (never synchronously in the effect),
  so before the first measurement every action is shown.

  **Exports**
  - **`FittedActions`** (`React.forwardRef<HTMLDivElement, FittedActionsProps>`) —
    the main component.
  - **`computeFittedVisibleCount`** — pure helper; exported for unit testing without
    a DOM.
  - **`FittedAction`** — action descriptor interface (`id`, `label`, `icon`,
    `isDisplayed`, `divided`, `disabled`, `onSelect`).
  - **`FittedActionsProps`** — component props interface.

  **Props**

  | Prop            | Default  | Description                                           |
  | --------------- | -------- | ----------------------------------------------------- |
  | `actions`       | `[]`     | Ordered actions; trailing items overflow first        |
  | `showDropdown`  | `true`   | Collapse overflow into the "More" menu                |
  | `moreLabel`     | `"More"` | Label for the overflow trigger                        |
  | `gap`           | `8`      | Inter-item gap in px (reserved when measuring too)    |
  | `onAction`      | —        | Fired for any chosen action, after its own `onSelect` |
  | `renderAction`  | —        | Custom inline action renderer                         |
  | `renderTrigger` | —        | Custom overflow trigger renderer                      |

  All additions are backwards-compatible.

- [#660](https://github.com/acronis/uikit/pull/660) [`63b6b0f`](https://github.com/acronis/uikit/commit/63b6b0fae1360c87ac107930408fa59dc25465df) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add a `variant` prop to `Link` (`normal` | `inverse`), completing the Figma
  `background` axis. `inverse` wires the link's text color to the `--ui-link-inverse-*`
  tokens for links over a backdrop, scrim, or dark brand surface; `normal` stays the
  default and is unchanged.

  The `inverse` surface is text-only and always enabled, matching the design: the Figma set
  carries the external-icon layer only on `normal` and has no disabled inverse variant, so
  both `external` and `disabled` are ignored there — an inverse link stays navigable,
  focusable and hoverable even when `disabled` is passed. Omit the link when it must be
  inert on a backdrop.

- [#646](https://github.com/acronis/uikit/pull/646) [`8cc7acf`](https://github.com/acronis/uikit/commit/8cc7acf9bc4063970fe91323ca26da1bcfccffb8) Thanks [@leonid](https://github.com/leonid)! - feat(scroll-area): add `viewportRef`, `viewportProps`, `isolate`, scrollbar `z-[60]`

  `ScrollArea.Root` is `overflow: hidden` and never scrolls, so its `ref` always
  reports `scrollTop: 0` and `scrollHeight === clientHeight`. Anything that needs
  to measure or drive the scrolling element — a TanStack virtualizer, an
  `IntersectionObserver`, a programmatic `scrollTo` — must reach the `Viewport`
  instead.

  New props on `ScrollAreaProps`:
  - **`viewportRef`** — forwards a `ref` to `ScrollAreaPrimitive.Viewport`
  - **`viewportProps`** — forwards extra props (`onScroll`, `tabIndex`, `data-*`)
    to the `Viewport`; includes a `data-*` index signature so callers can stamp
    the scrolling element without losing type safety

  Additional fixes bundled in the same change:
  - **`isolate`** on `Root` — creates a stacking context so `z-index` values
    inside the scroll area compete only with each other, not with the whole
    document
  - **`z-[60]`** on `ScrollBar` — sticky table headers typically stack to `z-50`;
    the scrollbar must sit above them inside the isolated root or it disappears
    behind the header during scroll

  All changes are additive and backwards-compatible: the two new props default to
  absent (no change in render), `isolate` only affects elements that set
  `z-index` inside the scroll area, and `z-[60]` only matters relative to other
  elements inside the same isolated root.

- [#661](https://github.com/acronis/uikit/pull/661) [`cd8ca56`](https://github.com/acronis/uikit/commit/cd8ca56fd8e85ff19785d9de3a4c9c21e61d6d64) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `Timer`: an elapsed-time readout paired with a hairline-separated cluster of
  icon-only actions, in a single bordered 32px box (Figma node 7987:25477).

  The readout is a `role="timer"` live region rendered with tabular figures, so
  the box keeps its width as the digits change. The actions are `ButtonGroupItem`
  children — `Timer` renders the `ButtonGroup` itself, always in its `inlined`
  style, since its own box already draws the border and radius an `outlined` group
  would duplicate. Omit the actions for a read-only readout: the toolbar and the
  divider then go with them.

  The component holds no clock — it renders whatever `value` it is handed, leaving
  the interval, the format, and the state the actions mutate to the caller.

- [#649](https://github.com/acronis/uikit/pull/649) [`d975acb`](https://github.com/acronis/uikit/commit/d975acbcbac44e3ff0622fb95e32875940aced42) Thanks [@leonid](https://github.com/leonid)! - feat(truncate-text): add `TruncateText` component

  `TruncateText` displays a string with an ellipsis and shows the full value in a
  tooltip **only when it is actually clipped** — no tooltip appears when the text
  fits, so short cells do not get a pointless hover target.

  Two truncation modes:
  - **`'end'`** (default) — CSS `text-overflow: ellipsis` / `-webkit-line-clamp`
    for multi-line. Truncation is detected by comparing `scrollWidth`/`scrollHeight`
    to `clientWidth`/`clientHeight` and re-checked on resize via `ResizeObserver`.
  - **`'middle'`** — canvas `measureText` binary-search that preserves both ends of
    the string, ideal for URLs, paths, and hashes where the tail is the
    distinguishing part. Re-measures on resize via `ResizeObserver`. Applies
    `flex-1` so it fills a flex parent without locking its shrunken width in.

  **Exports**
  - **`TruncateText`** — the main component (`React.forwardRef<HTMLSpanElement, TruncateTextProps>`).
  - **`TruncateTextProps`** — props interface (`children`, `mode`, `side`, `lines`,
    `defaultOpen`, `portalContainer`, `className`).
  - **`middleTruncate`** — pure binary-search helper; exported for unit testing without a DOM.
  - **`MiddleTruncateOptions`** — options interface for `middleTruncate`.
  - **`measureTextWidth`** — canvas-backed text-width measurer; falls back to a
    per-character estimate in environments without `canvas` 2D (jsdom).

  All additions are backwards-compatible.

### Patch Changes

- [#644](https://github.com/acronis/uikit/pull/644) [`50f1b63`](https://github.com/acronis/uikit/commit/50f1b638b5aea06b877e7fd888dc178b47ea5f1a) Thanks [@madjorr](https://github.com/madjorr)! - Fix `InputDatePicker`: wire the label, value, placeholder, separator, description, and icon text colors to their `-hover` token on trigger hover or `open`, matching the Figma design's hover/active treatment (previously only the box border/background switched). No brand currently sets a `-hover` value that differs from `-idle` for these tokens, so the color wiring itself won't change rendering until a brand's token diverges.

  The trigger icon now also sits in a fixed `--ui-input-date-picker-global-icon-box-size` (20px) box instead of a hug-content one, matching the same fixed-box treatment given to `InputSelect` (see the icon-box-size changeset) — this part does change rendering immediately.

- [#552](https://github.com/acronis/uikit/pull/552) [`b86e6f4`](https://github.com/acronis/uikit/commit/b86e6f494ade06be2707fae96a32078a7f544cc6) Thanks [@ivangarbev](https://github.com/ivangarbev)! - fix(input-password): follow the icons-react rename of `EyeCrossedIcon`

  The reveal toggle imported `EyeCrossedIcon`, which the resynced `icons` pack
  renames to `EyeOffIcon`. Internal only — `InputPassword`'s own API is
  unchanged — but the glyph is redrawn as part of the same resync, so the
  rendered toggle is not pixel-identical.

- [#644](https://github.com/acronis/uikit/pull/644) [`50f1b63`](https://github.com/acronis/uikit/commit/50f1b638b5aea06b877e7fd888dc178b47ea5f1a) Thanks [@madjorr](https://github.com/madjorr)! - `InputSelect`: give the chevron trigger icon a fixed `--ui-input-select-global-icon-box-size` box instead of a hug-content one.

- Updated dependencies [[`0a8647b`](https://github.com/acronis/uikit/commit/0a8647b589ac19a0b2d5c45ad49df481c2d008e5), [`ea4cd0d`](https://github.com/acronis/uikit/commit/ea4cd0d705ea9958303483defb3b7b0e27e8e992)]:
  - @acronis-platform/icons-react@1.0.0
  - @acronis-platform/design-assets@1.0.0

## 0.62.0

### Minor Changes

- [#638](https://github.com/acronis/uikit/pull/638) [`92b9236`](https://github.com/acronis/uikit/commit/92b9236f0899fdda098f396c2e57ec8fc2236369) Thanks [@madjorr](https://github.com/madjorr)! - Add `CalendarPanel`: a bordered, elevated date-picker panel built on `react-day-picker`, with `single`, `multiple`, and `range` selection variants (the latter two adding a Cancel/Apply footer), themed by the new `--ui-calendar-*` token tier.

- [#637](https://github.com/acronis/uikit/pull/637) [`affe005`](https://github.com/acronis/uikit/commit/affe005bf6f141308ae621defb6643441bbcf8eb) Thanks [@madjorr](https://github.com/madjorr)! - Add `FilterCards`: a horizontal row container for `CardFilter` items that stretches each child to an equal share of the available width.

### Patch Changes

- [#643](https://github.com/acronis/uikit/pull/643) [`6fda326`](https://github.com/acronis/uikit/commit/6fda3260128f94538becec868ddf48ad60e77f6a) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - fix(resizable): stop `ResizableHandle` from taking up layout space

  The handle's hit area was an in-flow 9px box, so it pushed the panels it
  separates apart and their edges — including their own borders — could never meet.
  Those 9px now overlay the panel boundary instead of sitting between them, leaving
  adjacent panels flush with a single divider line on the boundary. The hit area,
  the divider and hover, drag, focus-ring and cursor behaviour are unchanged.

- Updated dependencies [[`0515dda`](https://github.com/acronis/uikit/commit/0515ddabbe1cb196fc5ff2f981280e57a28bc7f6)]:
  - @acronis-platform/tokens-pd@2.6.0

## 0.61.0

### Major Changes

- [#620](https://github.com/acronis/uikit/pull/620) [`d6c245b`](https://github.com/acronis/uikit/commit/d6c245bb0352324ec094e3e1f70047cbb3be6af2) Thanks [@heygabecom](https://github.com/heygabecom)! - Remove the `SearchGlobal` component — it is no longer part of the design system.

  ### BREAKING CHANGES
  - **Removed export:** `SearchGlobal` (and `SearchGlobalProps`). The component's
    `--ui-search-global-*` token tier is being dropped from
    `@acronis-platform/design-tokens`, so the component can no longer be themed.
    Consumers rendering a search field should use `InputSearch` (aliased as
    `Search`), which has its own `--ui-input-search-*` tier.

  `AppShell` is unaffected — it is a slot-based layout and never depended on
  `SearchGlobal`; only its story and the docs examples referenced it.

### Minor Changes

- [#616](https://github.com/acronis/uikit/pull/616) [`90c421b`](https://github.com/acronis/uikit/commit/90c421b9f3b4aefbf6b83a5b85512ea4fa3bf9bc) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add the bar-styling knobs to `BarChart`.

  **Highlighting a range.** `referenceArea` shades a range of categories (a forecast period, a quarter under review) accents the category ticks beneath it, and optionally marks its leading edge with a dashed `divider`; `barSettings` restyles one series over the same kind of range — `fill`, `opacity`, `dashed`, `shape`, and a per-bar track via `background` (`true` for the full plot height, or a data field name to cap it at that row's value — the headroom between a projection and its upper bound). Both address the range as `{ from, to }`, inclusive, taking either the category's own value or its 0-based row index, with an omitted bound running to that end of the data. Together they make a projection read as provisional — translucent, dashed, over its own track, inside the band — while the rest of the grouped or stacked chart is untouched.

  **Painting.** `barShape` adds `pill`, `gradient` and `pattern` alongside the default `rounded`; a `barSettings` entry can override it for its range, so hatching can set a projection apart without relying on color.

  **Sizing and chrome.** `barSize`, `maxBarSize`, `barGap`, `barCategoryGap` and `minPointSize` forward to recharts; `showBackground` / `backgroundFill` draw a full-height track behind every bar; `showActiveBar` / `activeBar` highlight the bar under the pointer.

  **Legend order.** `BarChart` legend entries now follow the `dataKeys` order instead of the chart library's default alphabetical sort by series name. Charts whose `dataKeys` were already alphabetical are unaffected.

- [#606](https://github.com/acronis/uikit/pull/606) [`dc788eb`](https://github.com/acronis/uikit/commit/dc788eb03885e11e28284ef30b4560982ff31254) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add opt-in entrance animation to every chart component via shared `animate` / `animationDuration` / `animationBegin` / `animationEasing` props (a `resolveAnimation` helper over the shared chart utils). Off by default, so unset charts render identically. `animate` maps to recharts' `isAnimationActive="auto"` rather than a literal `true`, so the animation honors `prefers-reduced-motion` and is skipped during SSR.

- [#606](https://github.com/acronis/uikit/pull/606) [`1e02b9e`](https://github.com/acronis/uikit/commit/1e02b9e99403a2bb05bc083f029ffa35bb53a749) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add opt-in data labels to the Bar, Line, Area, Composed, Radar, RadialBar, and Pie charts via shared `showLabels` / `labelPosition` / `labelFormatter` props (a themed `LabelList` over the shared chart utils, reusing the axis tick formatters). Off by default, so charts without it render unchanged.

  Label placement and colour are resolved per family so the value stays legible: labels drawn on an opaque series fill (any `inside*` position, a stacked bar segment, an on-arc polar placement) use the on-fill text token instead of the on-surface one, area series keep the on-surface token at every position because their fill is translucent, stacked Bar/Area segments centre their value rather than overflowing into the next segment, and Pie/RadialBar accept the polar positions recharts actually honors — Pie defaulting to `outside`. `labelFormatter` no longer coerces a `null` gap into a printed value.

- [#615](https://github.com/acronis/uikit/pull/615) [`c88f052`](https://github.com/acronis/uikit/commit/c88f052c20169265fb40552a1ed91540770699c4) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Give the chart legend and tooltip one marker vocabulary each.

  **Legend.** The shared `ChartLegendContent` lays its entries out from the start edge (they were centred) and marks a series after what it paints: a 10px `rounded-sm` swatch for a filled series (it was an 8px one), or a 16×3px line for a stroke-drawn one — recharts types both `<Line>` and `<Area>` as `line` — painted as a repeating gradient when the series carries a `strokeDasharray`, so a dashed line reads as dashed. A stroke series that should still read as one swatch sets `legendType="rect"`.

  **Tooltip.** Every row keeps a round color dot, whatever marker the legend gives that series. **Breaking:** `ChartTooltipContent`'s `indicator` prop (`'dot' | 'line' | 'dashed'`) is gone along with its vertical-bar and dashed-rule shapes — nothing in the kit used them, and they matched neither the dot nor the legend's line. `hideIndicator` still hides the dot. A caller passing `indicator` should drop the prop; a chart needing a different row marker can render its own `tooltipContent`.

  `CategoryBar` and `SankeyChart` build their own legends; their swatches switch from a circle to the same `rounded-sm` square, while their layouts (a distributed stat row and a two-column grid) stay as they are. Their tooltip dots stay round.

  `ConfidenceCone` now names its metric once in the legend: actual, forecast and the cone band are three recharts series painting one metric, so only the actual series reaches the legend, with a swatch rather than the two line styles listed as separate series. The one-hue rule is enforced rather than incidental — the forecast key's `--color-*` is re-pointed at the actual series' color, so a `config` entry can no longer paint the metric in a second hue through a custom tooltip.

- [#612](https://github.com/acronis/uikit/pull/612) [`d37255b`](https://github.com/acronis/uikit/commit/d37255b7f3b3e0b9f98f601728d65b8d73bb852e) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add an opt-in range brush to the cartesian charts that can carry one — `BarChart`, `LineChart`, `AreaChart` and `ComposedChart` — via shared `showBrush` / `brushHeight` / `brushAriaLabel` props. Dragging a handle (or the selected window) zooms the series into a slice of the data; the category axis and tooltip follow the selection, and it works with the category axis hidden and in either bar orientation. Off by default, so charts without it render unchanged.

  The brush is themed from `--ui-*` tokens rather than recharts' hardcoded `#fff` / `[#666](https://github.com/acronis/uikit/issues/666)` defaults, so the strip, its handles and its range captions read in light and dark alike.

  Its two handles are real controls — focusable `role="slider"` elements driven by the arrow keys — so they are named from `brushAriaLabel` (default `'Chart range selector'`, overridable to localize) instead of recharts' fallback, which reads "Min value: undefined, Max value: undefined" for any data without a `name` field. `ChartContainer` also restores a visible focus indicator on them, which its blanket outline reset would otherwise suppress.

- [#613](https://github.com/acronis/uikit/pull/613) [`4171742`](https://github.com/acronis/uikit/commit/41717422ddb6b0fed460a6c3ca1c888a3fb8839d) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add an opt-in secondary Y axis to `ComposedChart`. A series selects it with `yAxis: 'secondary'`, and the second axis renders on the side opposite the primary one with its own unit, tick formatter, tick count, and domain (`secondaryYUnit`, `secondaryYTickFormatter`, `secondaryYAxisTickCount`, `secondaryYAxisDomain`, `secondaryYAxisLabel`, `showSecondaryYAxis`). This is what a composed chart needs to plot two measures whose units or magnitudes differ — a count next to a rate — where one shared scale flattens the smaller series onto the baseline. `yAxisOrientation` moves the primary axis to the right and mirrors the pair.

  The axis is derived from the series rather than a flag of its own, so a series can't point at an axis that was never declared; and if every series opts into the secondary one, the now-empty primary axis gives up its gutter and the grid follows the axis that has the series, rather than drawing a tickless scale over the plot. A chart where no series opts in keeps the primary axis's implicit recharts id and renders byte-identically — verified by diffing the rendered SVG of every existing `ComposedChart` story before and after. The grid's horizontal lines stay bound to the primary axis; a second set from a different domain would cross the first at meaningless heights.

  `ComposedChart` is the only chart that takes these props: its series already differ in mark type, so a bar read against the left axis and a line against the right can't be mistaken for two marks sharing one scale.

- [#626](https://github.com/acronis/uikit/pull/626) [`f82cace`](https://github.com/acronis/uikit/commit/f82cace32169ff92d9cbfdb1fff845417debc92a) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Extend `ComposedChart` with per-series configuration, stacking and both orientations. Every styling prop on the chart is now the default a `series[]` entry can override by the same name — `color`, `curve`, `strokeWidth`, `strokeDasharray`, `showDots`, `showActiveDots`, `connectNulls`, `barRadius`, `barSize`, `showActiveBar`, `showBackground` and `fillOpacity` — plus per-series `stackId` and `legendType`. Series sharing a `stackId` stack within their mark type (bars with bars, areas with areas; a line ignores it), and only the segment at the top of a stack rounds its corners. The new `orientation` variant (`vertical` · `horizontal`) grows the marks rightward, moving the categories to the y-axis and the values to x — where a secondary value axis becomes a second x-axis along the top edge. `referenceLine` draws a dashed rule at a value, at a series average, or across the categories at one of them, and `referenceArea` shades a band behind a range of categories. A rule belongs to one scale: on a chart with two value axes it is placed against the axis it was measured from — `average` naming a series reads off that series' own axis, `average: true` pools only the series on the axis the rule is drawn against, and a per-rule `yAxis` overrides both. A labelled rule that stands vertical hangs its caption above the plot, so the chart reserves the headroom for it rather than clipping it against the default inset. `yAxisOrientation` is inert under `orientation="horizontal"`, where the value axis is X and has no left/right side to pick. Chart-level `barSize` / `barGap` / `barCategoryGap` / `showBackground` / `backgroundFill` / `showActiveBar` set the bar geometry, `margin` insets the plot, `legendPosition` places the legend, and `tooltipCursor` toggles the hover band. Everything is opt-in, so an existing chart renders unchanged.

  The two range/reference helpers `BarChart` used are now shared by the cartesian charts: `barChartCategoryRange` / `barChartReferenceValue` moved to the `Chart` primitives as `resolveCategoryRange` / `resolveReferenceValue`, and the `BarChartCategoryRange` / `BarChartReferenceLine` types are now `ChartCategoryRange` / `ChartReferenceLine`.

- [#622](https://github.com/acronis/uikit/pull/622) [`839f5d1`](https://github.com/acronis/uikit/commit/839f5d1cc6d7db89d0b30d7fc463b6cf344dc0a3) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - feat(charts): add a legend, gradient coloring, per-stage overrides and advanced labels to FunnelChart

  `FunnelChart` had a `lastShape` variant, `reversed`, and one fixed right-hand name
  label per stage. It now covers the rest of what a funnel needs, all opt-in.

  **Legend.** `showLegend` renders one entry per visible stage — labelled, colored
  and marked like every other chart's legend, because it goes through the shared
  `ChartLegendContent` — and `legendPos` moves it to the top edge. The renderer
  builds no legend payload for a funnel series (unlike bar/line/area/pie/radar), so
  the component synthesizes one from its visible stages; without that a `<Legend>`
  inside a funnel renders empty.

  **Labels.** `labelFormat` says what a label carries — `name` (the default),
  `value`, `percent`, or a `name-value` / `name-percent` / `value-percent` pair —
  where a percentage is the stage's conversion from the widest stage, not a share of
  the sum, because a funnel's stages are nested subsets rather than parts of a
  whole. The base is the largest value rather than the first row, so an unsorted
  funnel still tops out at 100%. `labelPosition` places it beside the segment or on
  it, switching to the on-fill color token so an on-segment label keeps its
  contrast; `labelFill` overrides that, `labelFormatter` formats the value and
  `percentFormatter` the share — separately, so a locale that doesn't write a bare
  `%` can replace only the latter. `showValueLabels` + `valuePosition` add a second
  label, so a stage's name and its number can sit on opposite sides of the funnel;
  `valuePosition` defaults to the side **opposite** `labelPosition`, following the
  names instead of pinning itself to one edge.

  A composite label beside the funnel narrows the **funnel** to make room for
  itself. The renderer word-wraps a label against the gap between its own segment
  and the plot area's edge, so a margin can't create that room — it moves the edge
  inward together with the funnel and leaves the label with less. Narrowing the
  funnel is the lever that works, because the plot area stays put. `margin` reserves
  the side a label list sits on so unwrappable text isn't clipped at the SVG edge,
  and is merged over the defaults per side, so passing one side keeps the others.

  An on-segment (`inside`) label is legible only while every stage is wide enough to
  hold its text; a funnel narrows, so its tail stages often aren't. That's why the
  value labels default to the side opposite the names rather than onto the segments,
  and why `inside` is documented as wanting a short format with the names in the
  legend. A composite **left-hand** label wraps regardless: the widest segment
  always sits flush against the plot area's left edge, so there is no room to free.

  **Coloring.** `colorMode="gradient"` ramps one hue — `gradientColor`, or the first
  visible stage's own color, including a `stageSettings` color set on it — from the
  widest stage to the narrowest, mixing it toward the surface so every segment stays
  opaque. `stageSettings` overrides one stage at a time: `color` wins over both
  `config` and `colorMode`, and `hidden` drops the stage from the funnel, its
  labels, the legend, and the conversions.

  **Segment style.** `stroke` / `strokeWidth` border the segments — `strokeWidth`
  alone pairs with the border token, since the renderer's own default there is a
  hardcoded white the container neutralizes — `funnelWidth` narrows the shape,
  `margin` sets the plot-area inset, and `showActiveShape` outlines the hovered
  segment instead of changing its fill.

  Every prop is opt-in and the defaults are unchanged, so an existing funnel renders
  exactly as before.

- [#625](https://github.com/acronis/uikit/pull/625) [`07eb8c7`](https://github.com/acronis/uikit/commit/07eb8c7d92e1e17f621d5410ea456985d9a38b40) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add the curve set, dot sizing, per-series overrides and reference lines to `LineChart` and `AreaChart`.

  **Curves.** `curve` now takes `natural`, `basis`, `stepBefore` and `stepAfter` alongside `linear`, `monotone` and `step` — from a natural cubic spline (smoother than `monotone`, and free to overshoot a point) to a B-spline that need not pass through the points at all, plus the two one-sided step variants. The default stays `monotone`.

  **Dots.** `dotSize` sets the point radius (3px as before; the hover dot stays 2px larger). `showActiveDot` decouples the hover dot from the static ones — unset it follows `showDots`, so existing charts are unchanged, and setting it gives either a bare line that still emphasizes the hovered point or static dots with no hover emphasis.

  **Per-series overrides.** `lineSettings` / `areaSettings` restyle one series without touching the others, keyed by data key: `color`, `strokeWidth`, `dashed`, `curveType`, `showDots`, `dotSize`, `showLabel` / `labelPosition`, and — on areas — `fillOpacity`. Any field left out falls back to the chart-wide prop. A `color` override also recolors that series' gradient stops on `AreaChart`, and a series listed in `LineChart`'s `comparisonKeys` keeps its dashed, dimmed, dot-less overlay treatment (its `showDots` / `dotSize` entries do not promote it back).

  **Reference lines.** `referenceLine` draws one or more dashed rules across the value axis — a fixed `value`, or the mean of one series or of every plotted series (`average`) — each with an optional caption, in the muted text token. The rule extends the axis domain so a target above the data maximum stays visible. A caption sits at its rule's top right; where that collides with the series, `labelPosition` moves it — on all three charts, `BarChart` included. It is otherwise the same config `BarChart` already accepts; the resolver and styling now live in the shared chart helpers (`ChartReferenceLine`, `resolveChartReferenceValue`, `resolveReferenceLineProps`), and `BarChartReferenceLine` is now an alias of the shared type.

  With all of the new props unset, both charts render exactly as before.

- [#627](https://github.com/acronis/uikit/pull/627) [`efab49d`](https://github.com/acronis/uikit/commit/efab49d6c208b72cd9da666c9f1e562250cab37a) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - feat(charts): plot several metrics in one `ConfidenceCone`, with optional bands, thresholds, dots and styled forecast ticks

  `ConfidenceCone` now takes a `series` array — one entry per metric, each naming
  its own actual / forecast / bound columns and taking its hue from
  `config[actualKey]` — so several forecasts share one axis with independent cones.
  Every synthetic band is stripped from the tooltip and legend, and the legend
  names each metric once. The single-series `actualKey` / `forecastKey` /
  `lowerKey` / `upperKey` props stay as the shorthand for one metric, and one of the
  two forms is required — the props are a union, so a chart naming no columns is a
  compile error rather than an empty plot.

  `lowerKey` / `upperKey` are now optional: omit them for a band-less projection (a
  bare dashed forecast line) when a model gives a point estimate but no interval.

  New props: `actualType` (draw the observed period as a bare `line` instead of the
  default filled `area`, so the cone stays the only shaded region), `referenceLine`
  (one or more dashed horizontal thresholds on the value axis, with an optional
  caption), `showDots` (filled dots on the observed values, hollow ones on the
  projection) and `styleForecastTicks` (italic, metric-colored X ticks over the
  projected period).

  `keepMetricSeries` now takes an array of actual keys instead of a single key.

- [#617](https://github.com/acronis/uikit/pull/617) [`0486070`](https://github.com/acronis/uikit/commit/0486070bfb78c6739815af4d9dff292392d8ef1c) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Extend `PieChart` with the arc geometry, slice labelling and per-slice controls it was missing. `startAngle` / `endAngle` / `minAngle` shape the sweep (semicircles and arcs) and `cornerRadius` rounds each slice. Data labels gain a `labelFormat` preset (`value` · `name-value` · `name-percent` · `percent`, where a percentage is the slice's share of the total to one decimal) and an opt-in `labelLine` that draws a leader line to each label in the slice's own colour. `sliceSettings` overrides one slice at a time — its `color`, whether it carries a label, and that label's format — and a slice whose label is hidden loses its leader line too. `tooltipFormat="value-percent"` covers the value-and-share tooltip without hand-rolling a `tooltipContent`, and `legendPosition` / `margin` place the legend and the plot area. Everything is opt-in, so an existing chart renders unchanged.

- [#621](https://github.com/acronis/uikit/pull/621) [`83fa1a9`](https://github.com/acronis/uikit/commit/83fa1a9c19d919d0461e63d92d747180a6bc5a42) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add the polar axes, geometry, and per-series styling to `RadarChart`. The chart now has a value scale: `showRadiusAxis` draws a `PolarRadiusAxis` (`radiusAxisAngle` / `radiusAxisOrientation` / `radiusAxisTickCount` / `radiusAxisReversed`), and `radiusAxisDomain="fixed"` with `radiusAxisDomainMax` pins the outer ring to a known maximum so the areas read as absolute profiles instead of being stretched to the largest value in the data — that rescaling applies whether or not the scale itself is shown.

  The categorical axis and the web are configurable too (`showAngleAxis`, `angleAxisOrientation`, `angleAxisLine`, `angleAxisLineType`, `angleTickLine`, `angleTickSize`, `radialLines`), as is the geometry (`cx`, `cy`, `startAngle`, `endAngle`, `innerRadius`, `outerRadius`, `margin`). `seriesSettings` overrides colour, outline, and dots for one series while the rest keep the chart-level values; `dotRadius`, `activeDot`, and `legendPosition` cover the remaining chart-level knobs.

  The new props are additive: with all of them unset the rendered output is unchanged.

  One pre-existing behavior is fixed alongside them. A radar area is a translucent fill, so a value label placed on it (`labelPosition="insideEnd"` and the other `inside*` / `center*` positions) now uses the theme-inverting on-surface token instead of the white on-fill one, matching `AreaChart` and the composed chart's areas — the white token was disappearing into the tinted surface in light mode. Labels at the default `top` position are unaffected.

- [#619](https://github.com/acronis/uikit/pull/619) [`37e3391`](https://github.com/acronis/uikit/commit/37e33914864f7989eb2952a2050c2567d9eb2d27) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Extend `RadialBarChart` into a gauge primitive. `valueDomain` scales the arcs against a known range (without it a single value always fills the sweep, so a gauge could not read correctly), `centerLabel` renders a headline value and caption in the hole, and `segments` / `segmentGap` draw a single-value gauge's ring as notched segments — the reached ones in the arc's color, the rest in the muted track. `dataKeys` adds multi-metric mode (one arc per metric, colored and named from `config` keyed by the metric, as on the cartesian charts), `labelFormat` lets a data label read `name-value`, and `cx` / `cy` / `barSize` / `barGap` / `barCategoryGap` / `minAngle` / `margin` / `showPolarGrid` expose the remaining geometry. All additive: with the new props unset the rendered output is unchanged.

- [#628](https://github.com/acronis/uikit/pull/628) [`6908ab2`](https://github.com/acronis/uikit/commit/6908ab2818643b4b97d754d55bb01005da39d3bc) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Rebuild `Timeline` against the new "ready for dev" Figma widget, and add the
  `blue` / `gray` / `green` color schemes to `Avatar`.

  The Figma widget is a different component from the design-pending v1, so this is
  a **breaking API change** for `Timeline.Item`:
  - Each row is now an `Avatar` marker plus a `Card` (title, optional `tag`,
    `timestamp`, `description`, and a body below a divider), connected as a
    **tree**: `level` (1–3) sets the indent, and the root derives the elbow
    joining a row to its parent from the level sequence.
  - New on `Timeline`: `variant="tree"`. New on `Timeline.Item`: `expanded`,
    `defaultExpanded`, `onExpandedChange`, `toggleLabel`, `connector`, `tag`,
    `color`, and `initials`.
  - Removed: `status`, `current`, `disabled`, `metadata`, and `actions` on
    `Timeline.Item`, and `size` / `density` on `Timeline` — none exist in the
    design. `TimelineStatus` is no longer exported. Move `metadata` / `actions`
    content into an item's `children`, which now renders in the card body.

  **Collapsing is the variant, not a per-row flag.** There is no `collapsible`
  prop. `variant="default"` never collapses; `variant="tree"` gives every row that
  has descendants a disclosure button ahead of its marker, which drops the rows
  beneath it — derived from the levels, so no wiring is needed (pass `expanded` to
  own the state instead). A branch nobody can collapse would be indistinguishable
  from `default` with a wider indent, so the two ways of saying it are unified into
  one. A collapsed row keeps its control: "has descendants" is read from the rows
  you passed, not the visible ones.

  Separately — and **orthogonally** — `Timeline.Item` gains `collapsibleBody`, a
  chevron at the trailing edge of a card's header that folds that card's own body
  (Figma's `Action Button`), with `bodyExpanded` / `defaultBodyExpanded` /
  `onBodyExpandedChange` / `bodyToggleLabel`. It is the card's control, not the
  timeline's: same behaviour under both variants, and a `tree` row with descendants
  can carry both — the branch button drops the rows below, the header chevron folds
  this card. Collapsing a branch never hides a row's own body. This lives on
  `Timeline.Item` only until `Card` grows the behaviour itself.

  **The whole connector geometry is derived from the level sequence.** A row deeper
  than the one above it opens a branch, so the elbow joining it to its parent is
  drawn without being declared a second time. A row's descending line is drawn only
  when the next visible row is at its own depth or deeper, its marker sits in the
  same column, **and** it actually draws that elbow — so a branch's last row, the
  list's last row, a row whose descendants were just collapsed, and a collapsed row
  followed by a leaf sibling never leave a line dangling or crooked. `connector` and
  `branchStart` are escape hatches for the two halves of that join, resolved
  together so refusing one drops the other rather than leaving it unattached.

  The two disclosure controls default to **distinct** accessible names —
  `toggleLabel` is `"Toggle nested events"`, `bodyToggleLabel` is `"Toggle event
details"` — because a `tree` row can carry both, and a shared default would put
  two identically-named buttons doing different things in one `<li>`.

  Rows must be **direct** children of `Timeline` — wrapping them in a fragment hides
  their `level` from the root.

  Figma Code Connect is now `COMPLETE` for both the `TimelineItem` and
  `TimelineItemTree` component sets.

  The design's `components/Timeline/{connectorColor,gap}` variables are not yet
  "ready for dev" and have no `--ui-timeline-*` tier. Both are pure aliases in
  Figma, identical across all six brand modes, so the implementation consumes their
  alias targets (`--ui-border-on-surface-border`, `--ui-gap-16`) directly.

- [#624](https://github.com/acronis/uikit/pull/624) [`28b2543`](https://github.com/acronis/uikit/commit/28b25431873d7a29ae1e1c07d3ed0bdd089d16f9) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - feat(charts): add rich cell labels and a legend to Treemap

  `Treemap` labelled each cell with its leaf key, centered, on one line, and had no
  legend at all. It now carries the label block the design asks for, plus the legend
  for the tiles too small to hold one.

  **Labels.** The block is anchored at the tile's bottom start corner, per the design;
  `labelAlign` moves it to the top start corner or centers it (the previous look). Its
  values are named for the start edge rather than a physical corner because they
  mirror under `dir="rtl"`. The
  name shown is the leaf's `config` **label** rather than its raw `nameKey` value:
  that value becomes part of a `--color-<name>` custom property, so it has to be
  CSS-safe, and a leaf whose display name has a space in it is keyed by a slug — the
  slug is not what belongs on the tile. `secondaryKeys` adds a second line built from
  any other fields on the row — a value, a count, or both — joined by
  `secondarySeparator` and formatted by `secondaryFormatter`, which receives each
  field's index so one formatter can cover fields of different kinds. A field a row
  doesn't carry — or that the formatter returns empty for — is skipped instead of
  leaving a dangling separator.

  Both lines degrade with the tile: a cell too short for two lines keeps just its
  name, each line truncates with an ellipsis, and a tile too small for a label at all
  is left blank. The thresholds are measured in rendered line boxes rather than font
  sizes, so a label is never drawn into a tile that would clip it. The title is set in the chart label size at semibold and the second
  line one step down, so the hierarchy is weight and size rather than a second color,
  which the on-strong secondary text token can't provide (it resolves to a dark grey
  in dark mode, over a fill that stays saturated).

  The block is HTML inside a `foreignObject` rather than SVG `<text>`, which is what
  lets it behave like every other label in the kit: `truncate` measures the text
  instead of estimating it, and `text-start` mirrors the block under `dir="rtl"` —
  SVG's `x`/`text-anchor` are physical, so the same label would otherwise need the
  direction read in JS and applied by hand.

  **Cell shape.** Each tile is inset inside its node's rectangle with rounded
  corners, so tiles are separated by the surface showing through instead of by the
  surface-colored stroke they used to carry.

  **Legend.** `showLegend` renders one entry per distinct leaf name — labelled,
  colored and marked like every other chart's legend, because it goes through the
  shared `ChartLegendContent` — and `legendPos` picks its edge. Two things had to be
  worked around. The renderer builds no legend payload for a treemap (unlike
  bar/line/area/pie/radar), so the component synthesizes one from its leaves. And a
  treemap tiles its _whole_ surface rather than a plot area, so a legend drawn inside
  the plot paints over the tiles: it is rendered as a row of its own beside the chart
  instead, where normal flow gives it the height it needs and takes that height off
  the tiled surface. That placement also keeps the tiling correct — a treemap reads
  its container's size exactly once, and a recharts `<Legend>` can only render after
  the chart has a size, so the box it read would always be the one from before its own
  legend existed and the bottom row of tiles would be laid out under the clip.

  **Shared legend.** Two changes to `ChartLegendContent`, both needed by the above and
  useful beyond it:
  - it wraps instead of overflowing — a legend with one entry per tile or per slice is
    wider than the chart on a narrow surface, and a row that can't wrap paints past
    the chart's edge. The column gap is unchanged, so every legend that already fits
    on one row keeps its exact layout.
  - it accepts the series `config` as a prop, so it can render outside its
    `ChartContainer` (where the context doesn't reach). Charts that keep their legend
    inside the plot pass nothing and still read the context; rendering it with neither
    a prop nor a container still throws, as it always did.
  - an entry with no `config` label falls back to the series key, the way the tooltip
    row already did, instead of rendering a marker with no text.

  Existing treemaps keep their behavior except for the label placement, the tile
  shape, and cells now showing their config label; the legend is off by default.

- [#631](https://github.com/acronis/uikit/pull/631) [`f711401`](https://github.com/acronis/uikit/commit/f71140143f4a45b9ea9e218e7d4ce2b7fcdd6772) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Polish pass over the widget set: an RTL fix, two new styling hooks, and four new
  exported axis helpers.

  `ChartContainer` now pins `.recharts-surface` to `direction: ltr`. recharts
  anchors its axis tick text with the direction-relative SVG keywords
  (`text-anchor: start|end`) while placing every mark at a computed physical
  coordinate, so a chart inheriting `dir="rtl"` flipped only its text: `end`-anchored
  Y-axis ticks mirrored about their anchor and landed inside the plot (24–39px),
  rotated ticks shifted ~15px, and a `ReferenceLine` label at the right edge
  overflowed the surface. Pinning the surface keeps the plot's coordinate system
  consistent with the geometry recharts computed for it, and leaves the chrome that
  should mirror — tooltip and legend, which are HTML outside the surface —
  untouched. Verified in a browser against every cartesian story: the pin restores
  LTR geometry under `dir="rtl"` and is a no-op under `dir="ltr"`, so no existing
  visual-regression baseline moved.

  `Treemap` is the one exception, and it is deliberate: its cell labels are HTML in a
  `<foreignObject>` _inside_ the surface, put there precisely so they mirror with the
  page. The pin therefore stops at that boundary and hands the page's direction back,
  so a `labelAlign` start edge still resolves to the tile's right under `dir="rtl"`
  (measured in Chromium on the rendered chart: the label block computes
  `direction: rtl` and its line sits against the tile's right edge, one cell-padding
  in, where under `dir="ltr"` it sits the same distance from the left). A new
  `Widgets/Chart` "Rtl" story renders both halves of the rule — a bar plot that keeps
  its LTR geometry next to a treemap whose labels mirror — so the behaviour has a
  visual-regression baseline instead of resting on a one-off manual measurement.

  `SankeyChart`'s node legend and `ConfidenceCone`'s cone band each gained a
  `data-slot` (`sankey-chart-legend`, `confidence-cone-band`). Both existed only as
  unlabelled markup: the Sankey legend was indistinguishable from the node labels
  in the SVG, and the cone band is a stroke-less `<Area>` painting in the same hue
  at the same opacity as its metric's own area — telling them apart meant relying
  on `stroke-width`, which is an accident of the two elements' props rather than a
  contract. They are addressable now, for styling as well as for tests.

  The axis boilerplate every cartesian chart had copied — the rotated-tick
  `text-anchor` ternary, the X-axis height allowance, and the two axis-title
  objects — is now shared as `resolveRotatedTickAnchor`, `resolveXAxisHeight`,
  `resolveXAxisTitle` and `resolveYAxisTitle`, replacing seven copies of each.
  These four are exported from the `chart` barrel and so are additions to the
  package's public surface, which is what makes this a minor rather than a patch.

  Ten components — the shared `Chart` primitives plus `ComposedChart`, `BarChart`,
  `ConfidenceCone`, `RadarChart`, `PieChart`, `LineChart`, `AreaChart`,
  `CategoryBar` and `Metric` — had their deepest JSX lifted into named pieces. That
  part changes no rendered output: it was verified by diffing the serialized markup
  of several dozen prop combinations per component against the previous
  implementation, and the visual-regression baselines did not move.

### Patch Changes

- [#622](https://github.com/acronis/uikit/pull/622) [`fca8a59`](https://github.com/acronis/uikit/commit/fca8a59a43e2ffaf14ce84bc25b35ddfeb19963c) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - fix(chart): neutralize recharts' hardcoded white outline on funnel segments

  recharts defaults a `Funnel`'s segment stroke to `#fff`. `ChartContainer` already
  undid that hardcoded white on pie/radial sectors and line dots, but not on funnel
  trapezoids — so every `FunnelChart` drew a white hairline between its stages in
  **both** themes, reading as a light outline around each segment in dark mode. The
  container now neutralizes `.recharts-trapezoid[stroke='#fff']` alongside the other
  two. A caller-supplied `stroke` is untouched, so an intentional segment border
  still paints.

- [#617](https://github.com/acronis/uikit/pull/617) [`5dd5f1d`](https://github.com/acronis/uikit/commit/5dd5f1def097e4492f7e84869c34f255c71f06a5) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Put a floor under the gap between a chart tooltip row's name and its value. The shared `ChartTooltipContent` row separated the two with `justify-between` alone, which only spaces them while the tooltip's `min-w-[8rem]` leaves free space to distribute — so a short value (`275`) read fine while a longer one (a currency tick formatter, a `labelFormatter` with units, a value alongside its share) grew the row past that width and left the name and value touching. Affects every chart that renders the default tooltip row.

- [#606](https://github.com/acronis/uikit/pull/606) [`4ab2a1c`](https://github.com/acronis/uikit/commit/4ab2a1c8f0f203f381f7ac34191e4944b9d803c9) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Fix `ComposedChart` so the paint order actually follows the `series` array. recharts 3 assigns graphical items to z-index layers keyed by mark type (area 100, bar 300, line 400), so an area listed after a bar was still painted underneath it, contradicting the documented "later entries sit on top". Each series now gets an explicit z-index from its position in `series`.

- Updated dependencies [[`1f08b72`](https://github.com/acronis/uikit/commit/1f08b72d64bdd197b6c8debd957727272f05df89)]:
  - @acronis-platform/tokens-pd@2.5.0

## 0.60.0

### Minor Changes

- [#605](https://github.com/acronis/uikit/pull/605) [`4253c07`](https://github.com/acronis/uikit/commit/4253c0718538bcf600982516ae5bd8d3b0a58947) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `CategoryBar` — a single horizontal bar split into proportional colored category segments, with an optional count/% legend and per-segment tooltips (initial version; design + data-viz palette reconciliation pending).

- [#605](https://github.com/acronis/uikit/pull/605) [`e9d351a`](https://github.com/acronis/uikit/commit/e9d351a99d3252c352900def525e409bfaaf0706) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `SankeyChart` — a typed Sankey flow-diagram over the shared `Chart`
  primitives (built on recharts' `Sankey`). Renders a `nodes` + `links` graph with
  token-themed node bars and target-tinted link ribbons (width ∝ flow value),
  optional node labels, a tooltip, and geometry props (`nodePadding` / `nodeWidth`
  / `linkCurvature` / `sort`). Initial design-pending v1 — colors borrow existing
  semantic `--ui-*` tokens until the `--ui-chart-*` palette lands; Figma Code
  Connect deferred.

## 0.59.0

### Minor Changes

- [#600](https://github.com/acronis/uikit/pull/600) [`0e0d6c3`](https://github.com/acronis/uikit/commit/0e0d6c35abfaef3448818b965b0576a41a3e8153) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add axis visibility toggles and tick value formatting to the cartesian charts
  (`BarChart`, `LineChart`, `AreaChart`, `ComposedChart`, `ScatterChart`,
  `ConfidenceCone`, `Histogram`). Each now accepts `showXAxis` / `showYAxis`
  (default `true`) to hide either axis, and `xTickFormatter` / `yTickFormatter` to
  format tick values. Ships shared `formatCompactNumber` (thousands/millions),
  `formatPercent`, and a `createTickFormatter(Intl.NumberFormatOptions)` factory
  (for currency, fixed decimals, locales) — any function is also a valid
  formatter. Also adds `xAxisAngle`, `xAxisInterval`, `yAxisTickCount`,
  `yAxisDomain` (`auto`/`dataMin-dataMax`/`zero`), and `gridDashed` /
  `gridHorizontal` / `gridVertical` for tick placement, domain, and grid trim.
  These shared props live on a common `CartesianChartProps` interface (which also
  now carries the previously per-chart `showGrid` / `showTooltip` / `xAxisLabel` /
  `yAxisLabel` / `yUnit` / `tooltipContent`). Defaults preserve existing rendering.

  Notes on the value-axis props:
  - `yAxisDomain="auto"` fits the data at both ends and need not include 0.
    Omitting the prop keeps recharts' default, which is already zero-anchored — so
    `zero` is the explicit form of that default, not a change to it.
  - `yAxisTickCount` / `yAxisDomain` drive whichever axis carries the values: Y for
    most charts, X for `BarChart` with `orientation="horizontal"` (recharts ignores
    both on a category axis).
  - `xAxisInterval`'s numeric form is the number of ticks _skipped_ between two
    rendered ones (recharts `interval`), so `2` shows every third tick.
  - `xAxisAngle` and `xAxisLabel` can be combined; the X axis reserves room for both.
  - The bundled `formatCompactNumber` / `formatPercent` format in `en`; use
    `createTickFormatter(options, locale)` for anything else. Blank and
    whitespace-only tick values pass through all three unchanged.

- [#598](https://github.com/acronis/uikit/pull/598) [`614b1e9`](https://github.com/acronis/uikit/commit/614b1e9484d6b0473bb9df4f437af60e0c920262) Thanks [@madjorr](https://github.com/madjorr)! - Add `DialogWelcome`, a two-layout onboarding dialog (`carousel` — a multi-slide
  feature tour driven by a real Embla carousel engine — and `single`), with its
  `DialogFooterCarousel` footer. Also fixes the shared `Dialog`/`DialogContent`
  popup to keep the Figma-defined 48px minimum viewport edge-inset, which
  affects every `Dialog` consumer.

- [#592](https://github.com/acronis/uikit/pull/592) [`cad9c83`](https://github.com/acronis/uikit/commit/cad9c83a78b99c9dd4f3cf590eafeb8b152ea0bb) Thanks [@madjorr](https://github.com/madjorr)! - Publicly export `BREAKPOINT_LG/XL/2XL/3XL/4XL`, `ROOT_FONT_SIZE_PX`, and `getViewportWidth` from `src/lib/breakpoints.ts`, and add hand-authored `--ui-breakpoint-*` CSS custom properties for sizing elements outside `@media`/`@container` conditions (which can't read custom properties). Breakpoints were previously internal-only despite being usable by consumers. `ROOT_FONT_SIZE_PX` assumes the default, unoverridden `html { font-size }` (16px) — this package sets none.

### Patch Changes

- [#597](https://github.com/acronis/uikit/pull/597) [`1c484bc`](https://github.com/acronis/uikit/commit/1c484bca3170edd9dffff35f9fd0c40da7c83297) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Fix `Calendar`'s `Chevron` override forwarding `react-day-picker`'s numeric `size` onto the icon, which overrode the intended `size={16}` for the dropdown (`captionLayout="dropdown"`) caption chevron (rendering it at 18px). `react-day-picker`'s `size` is now dropped, so all calendar chevrons render at the fixed design size (16) — aligning with `@acronis-platform/icons-react`'s strict `16 | 24` size axis.

- [#604](https://github.com/acronis/uikit/pull/604) [`a1fe171`](https://github.com/acronis/uikit/commit/a1fe1715a3f9b902b7abee4e79d990f7068a965b) Thanks [@madjorr](https://github.com/madjorr)! - Correct stale comments on `InputBox`/`index.ts` that described it as an unexported internal primitive — it is exported for pairing with `Field` (`<FieldControl render={<InputBox />} />`). No behavior or API change.

- [#607](https://github.com/acronis/uikit/pull/607) [`e8d5839`](https://github.com/acronis/uikit/commit/e8d5839b0b7f5631f045a107f54d992ef37c3762) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - fix(toolbar): carry the disabled state to the overflow menu through React

  `ToolbarActionList` learned that its ancestor `Toolbar` had become disabled by
  running a `MutationObserver` over the `<fieldset>`'s `disabled` attribute. That
  resolved a render late — the portalled overflow menu stayed interactive for a
  beat after the toolbar was disabled — and the resulting `setState` landed
  outside React's own scheduling, where it could be dropped entirely, leaving an
  open menu enabled indefinitely. The state now comes from the `Toolbar` via
  context and gates the menu's `open` prop, so it closes in the same commit.

- Updated dependencies [[`43c6085`](https://github.com/acronis/uikit/commit/43c608573c6d008ef380363ef673f914ce4a28de), [`43c6085`](https://github.com/acronis/uikit/commit/43c608573c6d008ef380363ef673f914ce4a28de), [`ef714a6`](https://github.com/acronis/uikit/commit/ef714a65fd8fd0a94b9bd853b4a66fa98f8fab9f)]:
  - @acronis-platform/design-assets@0.4.1
  - @acronis-platform/icons-react@0.6.0
  - @acronis-platform/tokens-pd@2.4.0

## 0.58.0

### Major Changes

- [#578](https://github.com/acronis/uikit/pull/578) [`5bd88e2`](https://github.com/acronis/uikit/commit/5bd88e2253f1ecc454e6f299f713e821b8cb06d0) Thanks [@madjorr](https://github.com/madjorr)! - Add `Dialog`, a variant-driven dialog recipe built on an internal, non-exported
  composable primitive. A single `variant` prop selects one of eight canned
  use-cases (`default`, `rename`, `save changes`, `reset password`, `discard
changes`, `accept`, `read-only`, `wide`) — each with its own title, body copy,
  and footer buttons; `children` overrides the body slot, `hasLoading` shows a
  loading overlay across the body + footer, and `hasHeader`/`hasFooter` (both
  default `true`) hide the header and/or footer for a body-only dialog (the
  title still renders off-screen for accessibility when the header is hidden).

  Localize or override canned copy with `title`, `secondaryLabel`,
  `primaryLabel`, `closeLabel`, `objectName` (interpolated into the `rename`/
  `discard changes`/`accept` variants' copy), and `objectNameLabel` (the
  `rename` field's accessible name). Attach behavior to the primary footer
  button with `onPrimaryAction` — the dialog does not close automatically;
  pair it with `open`/`onOpenChange`. The `wide` variant takes a `footer` prop
  for free-form footer content instead of canned buttons, and defaults
  `size` to `"large"` (832px, no design token); the default `size="sm"`
  (512px) resolves to the `--ui-dialog-*`/`--ui-footer-*` token tier.

  Only `Dialog` and `DialogClose` (required by `wide`'s custom-footer escape
  hatch) are exported for building dialogs — the composable primitive parts
  are an internal implementation detail.

  **Migration:** build dialogs with `Dialog` and its `variant` prop. If you
  were importing dialog primitive parts (`DialogContent`, `DialogTrigger`,
  `DialogHeader`, `DialogFooter`, `DialogBody`, `DialogDescription`,
  `DialogCloseButton`, etc.) directly via a deep import, those are no longer
  exported from the package root.

- [#584](https://github.com/acronis/uikit/pull/584) [`66d6eb9`](https://github.com/acronis/uikit/commit/66d6eb96a4c42275b04a34e554b04be55f5ef4fd) Thanks [@madjorr](https://github.com/madjorr)! - Add `Loading` and `DialogFooterDefault`; **`Spinner` is no longer exported** from the package's public entry point.

  `Loading` is the new app-facing, composite loading indicator (spinner + optional label) with four placement-context variants (`inline`, `onSurfacePrimary`, `onSurfaceSecondary`, `onScreen`), themed by the new `--ui-loading-*` tier. `DialogFooterDefault` is a bottom action bar (panel/dialog/sheet footer) with end-aligned actions and an optional start slot (a truncated description, or a `Link`), themed by the new `--ui-footer-*` tier.

  **Breaking change:** `Spinner` becomes an internal-only primitive (mirroring the existing `InputBox`/`SearchBox` pattern) — it's no longer re-exported from `@acronis-platform/ui-react`, though it still exists internally as `Loading`'s icon and `Toast`'s small inline icon. `SheetDetails`'s loading content state now renders `Loading` instead of a bare `Spinner`.

  Migrate direct `Spinner` usage to `Loading`:

  ```diff
  - import { Spinner } from '@acronis-platform/ui-react';
  - <Spinner size="lg" />
  + import { Loading } from '@acronis-platform/ui-react';
  + <Loading variant="onSurfacePrimary" />
  ```

  `Loading`'s three larger icon sizes (16 / 32 / 48px) line up with `Spinner`'s `sm` / `lg` / `xl`; pass `hasLabel={false}` to drop the visible label while keeping it announced via `aria-label`.

### Minor Changes

- [#568](https://github.com/acronis/uikit/pull/568) [`0deda5c`](https://github.com/acronis/uikit/commit/0deda5c1a62038cf827844979e5c097749c3b583) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `AreaChart` — a typed recharts composition over the shared `Chart` primitives, with `layout` (single / stacked) and `fill` (solid / gradient) variants, a `curve` control, per-point dots, null-gap bridging, and a themed tooltip/legend/axes/grid with caller-supplied series colors. Single vs multi area follows from the number of `dataKeys`. Initial version ported from the apps/demo `AreaChartPlayground`; design + data-viz palette reconciliation pending.

- [#583](https://github.com/acronis/uikit/pull/583) [`22a0068`](https://github.com/acronis/uikit/commit/22a006811e0f359e841819462da561eaca222957) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - `BarChart`: add a `referenceLine` prop — one or more dashed reference/average lines on the value axis (Y for vertical bars, X for horizontal). Pass a single config or an array. Each is driven by a fixed `value`, or a computed `average` (the mean of one series by key, or of every plotted series when `true`), with an optional `label` caption. Themed from the existing `--ui-text-on-surface-secondary` token.

- [#587](https://github.com/acronis/uikit/pull/587) [`f3607ce`](https://github.com/acronis/uikit/commit/f3607ce8764082c5b5014f701db2c3920e978a3c) Thanks [@madjorr](https://github.com/madjorr)! - Add `ButtonIconInput` — a smaller icon-only button (20×20, 16px glyph) meant to live inside an input's box, with `normal`/`error` variants that mirror the field it's embedded in. Themed by the dedicated `--ui-button-icon-input-*` token tier; used internally by `InputPassword`'s show/hide toggle.

- [#570](https://github.com/acronis/uikit/pull/570) [`eb83efc`](https://github.com/acronis/uikit/commit/eb83efcc92c5b3d05e004ffc4ba44bc98e01888e) Thanks [@madjorr](https://github.com/madjorr)! - Add a controlled `selected` prop to `CardFilter` (`variant="clickable"` only), matching `Chip`'s pattern. Sets `aria-pressed`/`data-selected` on the rendered button and applies the existing hover/active container tokens when selected — no new tokens.

- [#588](https://github.com/acronis/uikit/pull/588) [`53f0349`](https://github.com/acronis/uikit/commit/53f034991dc3dbe1cb5c6ac92c1aa2898cf47424) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Expose axis-title and unit props on the cartesian charts. `BarChart`,
  `LineChart`, `AreaChart`, `ComposedChart`, `ScatterChart`, `ConfidenceCone` and
  `Histogram` now accept `xAxisLabel` / `yAxisLabel` (forwarded to recharts' native
  axis `label`) and a `unit` suffix on their numeric axes (`yUnit`, plus `xUnit`
  where the x-axis is numeric — `ScatterChart` and horizontal `BarChart`). Axis
  titles inherit the theme token via a `.recharts-label` fill selector, so they
  stay legible in light and dark.

- [#588](https://github.com/acronis/uikit/pull/588) [`de2ab26`](https://github.com/acronis/uikit/commit/de2ab2634c7d31022e955e5bbe9ef606d6c454e5) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Let consumers customize chart tooltips without composing recharts. `BarChart`,
  `LineChart`, `AreaChart`, `ComposedChart`, `ScatterChart`, `PieChart`,
  `RadarChart`, `RadialBarChart`, `FunnelChart`, `Treemap`, `ConfidenceCone` and
  `Histogram` now accept a `tooltipContent` prop — pass a configured
  `ChartTooltipContent` (imported from this library) with a `formatter` /
  `labelFormatter` / `indicator` to control formatting, per-series rows, and extra
  fields. For `LineChart` (delta bands) and `ConfidenceCone` (the prediction
  cone), the synthetic range series is filtered out of the payload before a custom
  tooltip sees it. Defaults are unchanged.

- [#576](https://github.com/acronis/uikit/pull/576) [`bdd9a1f`](https://github.com/acronis/uikit/commit/bdd9a1f924a410f439d56f94efad4225da1421d5) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `ChartState` — a shared loading / empty / error placeholder for the chart types, rendered in place of a chart inside the same sized slot. A compact status block: a leading glyph (the shared `Spinner` / `InboxIcon` / `CircleWarningIcon`) over a centered label, with an optional retry `action` for the error state and a per-state `message` override. Ported from the Figma InputSelect dropdown states and kept visually in step with the shipped `InputSelectStatus`; themes from existing semantic `--ui-*` tokens (no `--ui-chart-*` tier yet).

- [#572](https://github.com/acronis/uikit/pull/572) [`8c0e072`](https://github.com/acronis/uikit/commit/8c0e072954398ba40f73b57519c363b1ace904f8) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `ComposedChart` — a typed recharts composition over the shared `Chart` primitives. Plots a `series` list over one shared category axis where each entry picks its own render `type` (bar / line / area), in the caller's order (later entries paint on top). Shared `curve` / `barRadius` / `fillOpacity` controls and a themed tooltip/legend/axes/grid with caller-supplied series colors. No CVA variants (the mix is data-driven via `series[].type`). Initial version ported from the apps/demo `ComposedChartPlayground`; design + data-viz palette reconciliation pending.

- [#586](https://github.com/acronis/uikit/pull/586) [`1b8175e`](https://github.com/acronis/uikit/commit/1b8175e55f420ed823b3abae96117e7beeb7823b) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `ConfidenceCone` — a forecast chart over the shared `Chart` primitives, shown as one metric in one color: a solid line + filled area over the actual period, a dashed line over the forecast, and a shaded prediction band (the "cone") between a lower and upper bound that widens with the horizon. A dashed divider and a subtle shaded region set the forecast off from the actuals (`showForecastRegion`). Composes over recharts' `ComposedChart`; the synthetic band range series is filtered out of the tooltip and legend, and the areas never mark points. Distinct from the conversion `FunnelChart`. Design-pending v1 — metric color caller-supplied via `config` (no `--ui-chart-*` palette yet), Code Connect deferred.

- [#572](https://github.com/acronis/uikit/pull/572) [`188f4a9`](https://github.com/acronis/uikit/commit/188f4a993120280e8c8c928a1924057b5122cdef) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `FunnelChart` — a typed recharts composition over the shared `Chart` primitives. Plots a single series of stages (rows) as stacked, narrowing segments, with per-stage `Cell` colors from a `nameKey`-keyed `config`, on-chart stage labels, and a themed tooltip (no legend — the inline labels name every stage). One `lastShape` variant (triangle / rectangle) plus a `reversed` toggle. Initial version ported from the apps/demo `FunnelChartPlayground`; design + data-viz palette reconciliation pending.

- [#586](https://github.com/acronis/uikit/pull/586) [`44075e9`](https://github.com/acronis/uikit/commit/44075e90faea99ecec725f9114ec4d4579766ce6) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `Histogram` — a frequency histogram over the shared `Chart` primitives. Takes raw `values` and bins them into `binCount` equal-width ranges (with an optional fixed `domain`), plotting the count of each as contiguous bars. Distinct from `BarChart`: the binning is the component's own job via a pure, unit-tested helper. Design-pending v1 — bar color is caller-supplied via `config` (no `--ui-chart-*` palette yet), Code Connect deferred.

- [#587](https://github.com/acronis/uikit/pull/587) [`f3607ce`](https://github.com/acronis/uikit/commit/f3607ce8764082c5b5014f701db2c3920e978a3c) Thanks [@madjorr](https://github.com/madjorr)! - Add `InputOTP` — a bare row of single-character boxes for entering a one-time code, with auto-advance between slots, Backspace-to-previous, and paste-to-fill-all support. `length` controls the slot count (default 6); `error`/`disabled`/`autoFocus`/`onComplete` round out the API. Themed by the `--ui-input-otp-*` token tier.

- [#587](https://github.com/acronis/uikit/pull/587) [`f3607ce`](https://github.com/acronis/uikit/commit/f3607ce8764082c5b5014f701db2c3920e978a3c) Thanks [@madjorr](https://github.com/madjorr)! - Add `InputPassword` — a single-line password field (label / required / description / error, matching `InputText`'s conventions) with a built-in show/hide toggle rendered via `ButtonIconInput`. Has its own `--ui-input-password-*` token tier down to the box fill/border, rather than building on the bare `Input` primitive.

- [#583](https://github.com/acronis/uikit/pull/583) [`c72d584`](https://github.com/acronis/uikit/commit/c72d5847ba0df3453bb73472060e51d8f5589217) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - `LineChart`: add QoQ/YoY trend-comparison support — `comparisonKeys` renders a subset of `dataKeys` as dashed, dimmed, dot-less overlays (e.g. a previous quarter or year) keeping each series' own `config` color, and `deltaBands` shades the gap between `[current, comparison]` pairs with a dimmed area (the delta) behind the lines. (Internally the chart now composes over recharts' `ComposedChart` so lines and the band coexist.)

- [#568](https://github.com/acronis/uikit/pull/568) [`96fe81a`](https://github.com/acronis/uikit/commit/96fe81a46539820c0355382e24505dbf764920ab) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `LineChart` — a typed recharts composition over the shared `Chart` primitives, with `curve` (linear / monotone / step) and `lineStyle` (solid / dashed) variants, per-point dots, null-gap bridging, and a themed tooltip/legend/axes/grid with caller-supplied series colors. Single vs multi line follows from the number of `dataKeys`. Initial version ported from the apps/demo `ChartPlayground`; design + data-viz palette reconciliation pending.

- [#586](https://github.com/acronis/uikit/pull/586) [`eafec97`](https://github.com/acronis/uikit/commit/eafec97d6a481fa61247434bf5a21d87e5775840) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `Meter` — a labelled proportional bar for a value within a known range (a fractional value / share), built on Base UI's `Meter` (`role="meter"`, like the HTML `<meter>` element), as opposed to `Progress`/`ProgressCircle` which track a task over time. One row: label + `value · %` over a track bar, with a chart-style hover tooltip (light card); stack several sharing one `max` to build a ranked breakdown (a "bar list"). Fill color is caller-supplied per row. Design-pending v1 — no `--ui-chart-*` palette yet, Code Connect deferred.

- [#591](https://github.com/acronis/uikit/pull/591) [`08dee19`](https://github.com/acronis/uikit/commit/08dee1995a70b5591514c07d549320e54c223ccf) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `Metric` — a presentational dashboard metric card modelled on the MetricCard
  design: a label (+ optional caption) over a primary value with an optional
  status-tinted icon badge, unit, and trend, plus optional supporting text and a
  composable `children` body (a chart, a `Meter` breakdown, a `Separator`, an
  insight line). It is a Card and composes `TrendIndicator` for the trend slot;
  `size` scales the typography, `status` subtly tints the icon badge, and `loading`
  shows a skeleton. Purely presentational — the consumer passes a ready-formatted
  value and resolved status; the kit never computes, formats, or interprets the
  data. Initial version (design + token-tier reconciliation pending).

- [#583](https://github.com/acronis/uikit/pull/583) [`9696497`](https://github.com/acronis/uikit/commit/969649771ce9279e81b798fecd0283cadfa609e7) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - `PieChart`: add a `centerLabel` prop for the donut hole — a headline `value` and an optional `label`, rendered as centered SVG text (donut shape only; ignored for a filled pie). The block stays centered on the donut whether or not a legend is shown. Themed from the existing `--ui-text-on-surface-primary` / `--ui-text-on-surface-secondary` tokens (`text-foreground` / `text-muted-foreground`).

- [#568](https://github.com/acronis/uikit/pull/568) [`bb593d3`](https://github.com/acronis/uikit/commit/bb593d368a2eeb9496bc7fdddfbe4c46b9b920f4) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `PieChart` — a typed recharts composition over the shared `Chart` primitives, with a `shape` (pie / donut) variant, per-slice `Cell` colors from a `nameKey`-keyed `config`, adjustable `innerRadius` / `outerRadius` / `paddingAngle`, and a themed tooltip/legend. Initial version ported from the apps/demo `PieChartPlayground`; design + data-viz palette reconciliation pending.

- [#582](https://github.com/acronis/uikit/pull/582) [`55eaedd`](https://github.com/acronis/uikit/commit/55eaedd10c49a5aa98f5c52098a2c85341ec62b8) Thanks [@madjorr](https://github.com/madjorr)! - Theme `Popover`'s container from the new `--ui-popover-container-*` tokens (color, border, radius, min/max width) per Figma node 6364:17907, and add optional `PopoverBody`/`PopoverFooter` parts for the body-rhythm (`--ui-popover-body-*`) and default action-row footer (`--ui-footer-*`) recipe shown in that node.

  `PopoverContent` no longer hardcodes `w-72`, `p-4`, or `shadow-md` — width now comes from the token-driven min/max width above, and the flat container no longer renders a shadow. Consumers relying on the old fixed width/padding/shadow should wrap their content in the new `PopoverBody` (and `PopoverFooter` for an action row) to restore the equivalent spacing.

- [#575](https://github.com/acronis/uikit/pull/575) [`cea473c`](https://github.com/acronis/uikit/commit/cea473c865c3e95aa441fdd5cde241ccf7138ac2) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `RadarChart` — a typed recharts composition over the shared `Chart` primitives (the first polar chart type). Plots a set of series `dataKeys` over one shared angular axis (`angleKey`) with a polar grid, spoke labels, tooltip, and legend; caller-supplied series colors. One `gridType` variant (polygon / circle), plus `fillOpacity` / `strokeWidth` / `showDots` controls. Scopes the polar angle-axis labels to the muted-foreground token locally (the shared container themes only cartesian ticks — a tracked primitives gap). Initial version ported from the apps/demo `RadarChartPlayground`; design + data-viz palette reconciliation pending.

- [#575](https://github.com/acronis/uikit/pull/575) [`4cebb8c`](https://github.com/acronis/uikit/commit/4cebb8c752e3a49b010d951aed9e71af10784cdd) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `RadialBarChart` — a typed recharts composition over the shared `Chart` primitives (a polar/radial type). Plots each data row as a concentric arc sized by `dataKey`, colored per `nameKey`, with an optional muted background track, tooltip, and legend; caller-supplied arc colors. No CVA variants — the sweep (`startAngle` / `endAngle`) and radii are plain geometry props (full ring or gauge). Rows are stamped with `fill` so a real hover resolves the arc color in the tooltip. Initial version ported from the apps/demo `RadialChartPlayground`; design + data-viz palette reconciliation pending.

- [#572](https://github.com/acronis/uikit/pull/572) [`ec3272e`](https://github.com/acronis/uikit/commit/ec3272e565502583a9d7082afd85518f50ac6b48) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `ScatterChart` — a typed recharts composition over the shared `Chart` primitives. Plots a `series` list (each with its own point array) on numeric `xKey` / `yKey` axes, with an optional `zKey` for bubble sizing, a `shape` marker prop, and a themed tooltip/legend/axes/grid with caller-supplied series colors. No CVA variants (scatter's expressiveness is in the data mapping). Initial version ported from the apps/demo `ScatterChartPlayground`; design + data-viz palette reconciliation pending.

- [#591](https://github.com/acronis/uikit/pull/591) [`5754be7`](https://github.com/acronis/uikit/commit/5754be71ebad0e1ad76fe02ad5adc223c00e33e6) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `Timeline` — a presentational, chronological event list (`Timeline` +
  `Timeline.Item`) for activity feeds, audit logs, and status history. Renders a
  semantic `<ol>`/`<li>` with a connector line, status markers (a dot, or an icon
  in a status-tinted badge), and a timestamp / title / description hierarchy, plus
  optional metadata, actions, and expandable `children`. `size` and `density` come
  from `Timeline` via context; `status`
  (neutral/info/success/warning/danger/critical) tints only the marker; `current`
  rings it and `disabled` dims the item. Purely presentational — it never sorts,
  groups, fetches, or interprets events, and ships no domain event types or icons.
  Composes with Tag / Link / Accordion. Initial version (design + token-tier
  reconciliation pending).

- [#575](https://github.com/acronis/uikit/pull/575) [`1365e93`](https://github.com/acronis/uikit/commit/1365e93a0c991c4edf5cef64830825ab4372e1bc) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `Treemap` — a typed recharts composition over the shared `Chart` primitives. Tiles a flat set of leaves into rectangles sized by `dataKey` and colored per `nameKey`, with on-cell labels and a tooltip (no axes, grid, or legend). Themed through a custom cell renderer (recharts' default has no token hooks); rows are stamped with `fill` so a real hover resolves the cell color. No CVA variants — `aspectRatio` is a plain prop and nesting is out of v1 scope. On-cell labels use the `--ui-text-on-status-strong-neutral` token over the saturated series colors. Initial version ported from the apps/demo `TreemapChartPlayground`; design + data-viz palette reconciliation pending.

- [#591](https://github.com/acronis/uikit/pull/591) [`cb51082`](https://github.com/acronis/uikit/commit/cb5108226534fdf061abedfd5e03e472ee898632) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `TrendIndicator` — a small presentational primitive showing how a metric
  changed (a direction glyph + a caller-formatted value + an optional comparison
  label). It separates `direction` (up/down/flat) from `sentiment`
  (positive/negative/neutral) so the kit never assumes up = good; renders inline or
  as a compact status-tinted badge in two sizes, with an optional tooltip and an
  `ariaLabel` for a full accessible sentence. Purely presentational — never
  computes or formats the trend (initial version; design + data-viz reconciliation
  pending).

### Patch Changes

- [#594](https://github.com/acronis/uikit/pull/594) [`650d057`](https://github.com/acronis/uikit/commit/650d0573e07c4195f82d07ed9ff392b69510f28e) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Fix `ButtonMenu` missing a pointer cursor on hover. `cursor-pointer` now lives on the shared base class (matching `Button`), so the trigger shows `cursor: pointer` when hovered and reverts to the default cursor while disabled via `disabled:pointer-events-none`.

- [#570](https://github.com/acronis/uikit/pull/570) [`12da069`](https://github.com/acronis/uikit/commit/12da069a24f0defef303ef1deba448e870b6bb81) Thanks [@madjorr](https://github.com/madjorr)! - Fix `CardFilter` (`variant="clickable"`) setting `type="button"`/`aria-pressed` even when composed via `render` onto a non-button element, producing invalid ARIA/HTML on the rendered element (e.g. `render={<a href="/alerts" />}`). Both attributes now only apply to the default `<button>` root; `data-selected` continues to apply regardless of the rendered element.

- [#570](https://github.com/acronis/uikit/pull/570) [`6966931`](https://github.com/acronis/uikit/commit/696693101c9a551a64ecc395aacd0f6814981cb8) Thanks [@madjorr](https://github.com/madjorr)! - Fix `Chip` missing a pointer cursor on the `removable` variant and its remove button. `cursor-pointer` now lives on the shared base class (covering `removable` too, not just `selectable`) and is set explicitly on the remove button, since native buttons reset cursor via the UA stylesheet.

- [#565](https://github.com/acronis/uikit/pull/565) [`2db668a`](https://github.com/acronis/uikit/commit/2db668a744b0e66e0d82ac8c2fb0e9964cf74ae2) Thanks [@heygabecom](https://github.com/heygabecom)! - Sync design tokens with Figma.

  Adds `red_home_pl` brand primitives (8 new ButtonPrimary/SidebarPrimary tokens), `units.size.76` and `units.size.320`, and 6 new semantic tokens (`colors.glyph.onStatusStrong.primary`, `colors.glyph.onSurface.neutral-dark`, `colors.text.onBrand/onStatus/onSurface.link-idle`, `typography.headings.display-numeric`); removes 3 deprecated `*.link` semantic tokens. Updates 155 semantic color and 4 gradient mode values, restructures the Link component (24 new / 18 removed tokens), and applies structural and mode-value updates across 22 components (Avatar, Breadcrumb, Button, ButtonIcon, ButtonMenu, CardFilter, Checkbox, Chip, InputDatePicker, InputSearch, InputSelect, InputText, InputTextArea, Radio, Resizable, SearchGlobal, SidebarPrimary, SidebarSecondary, Switch, Table, Tag, Tooltip).

  Regenerates `@acronis-platform/tokens-pd` from the updated tiers and re-themes the affected `@acronis-platform/ui-react` components to the renamed tokens: Link (`--ui-link-*` now split into `normal`/`global`/`inverse`; only `normal`/`global` are wired), Table + DataTable (`--ui-table-global-row-color-*` → `--ui-table-data-row-color-*`, `--ui-table-global-cell-border-color` → `--ui-table-global-row-border-color`, `--ui-table-header-cell-padding-x` → `--ui-table-global-cell-padding-x`), and the InputSearch/InputText clear buttons (their dropped clear-icon token now uses the ghost ButtonIcon glyph token `--ui-button-icon-global-icon-color-idle`). The Table selected-row active background value changes as part of the sync.

- [#594](https://github.com/acronis/uikit/pull/594) [`8ed0d77`](https://github.com/acronis/uikit/commit/8ed0d776206544f810e33d48db41000999420a83) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Fix the cascade (submenu) chevron in `DropdownMenuSubTrigger` sitting too high. The menu item row is `items-start`, so the 16px chevron pinned to the top of the label's 24px line box; it now uses `self-center` to align vertically against the label.

- [#593](https://github.com/acronis/uikit/pull/593) [`3464ae2`](https://github.com/acronis/uikit/commit/3464ae2d211f43c0b1b61476376f9e5174f8d541) Thanks [@madjorr](https://github.com/madjorr)! - Fix three low-risk bugs: `Link`'s hover underline position no longer diverges from `ButtonGhost` (removed a stray `text-underline-position` override); `FilterSearchFilters` forwards passthrough props (e.g. `data-testid`) to its trigger button again; and a global `font-family` fallback prevents shadow-DOM consumers from rendering with a serif UA default.

- [#570](https://github.com/acronis/uikit/pull/570) [`9ded1b0`](https://github.com/acronis/uikit/commit/9ded1b070b91548f296af31d9f8255c30839ce29) Thanks [@madjorr](https://github.com/madjorr)! - Fix the clear (×) button on `InputSearch`/`Search` and `InputText` missing hover/active background treatments (`InputText`'s was also missing `cursor-pointer`). Both now reuse the existing `--ui-button-icon-global-container-color-hover/active` tokens and size the button to `size-5` so the background pill has room around the icon.

- [#590](https://github.com/acronis/uikit/pull/590) [`c013e6f`](https://github.com/acronis/uikit/commit/c013e6f7a3a45e07b559daa93071bb33f5b54b41) Thanks [@madjorr](https://github.com/madjorr)! - Fix `InputSelect`'s Figma Code Connect mapping rendering the search field's placeholder example even when the design's `hasSearch` boolean is `false`. `hasSearch` (and the data variant's `hasRecent`) now resolve directly to the example element via `figma.boolean`'s true/false map instead of a truthy render gate on the raw boolean.

- Updated dependencies [[`2db668a`](https://github.com/acronis/uikit/commit/2db668a744b0e66e0d82ac8c2fb0e9964cf74ae2), [`4724a08`](https://github.com/acronis/uikit/commit/4724a08fac134432ed3467111bcdfed95e87b08f), [`b5ab04c`](https://github.com/acronis/uikit/commit/b5ab04c0f355c0778bfea88e0b22382da025f8ff), [`c8308cd`](https://github.com/acronis/uikit/commit/c8308cdd317bdf20c45193c972deea822918054c), [`b0dbbe0`](https://github.com/acronis/uikit/commit/b0dbbe093aab49adb0fc0fda8c0f76109a4a6541)]:
  - @acronis-platform/tokens-pd@2.3.0

## 0.57.1

### Patch Changes

- Republish — `0.57.0` was published to npm without its `dist/` build output. No functional changes.

## 0.57.0

### Minor Changes

- [#563](https://github.com/acronis/uikit/pull/563) [`cdb19f4`](https://github.com/acronis/uikit/commit/cdb19f47ee45d67a451600f57d43cac9256fbdae) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `BarChart` — a typed recharts composition over the shared `Chart` primitives, with `orientation` (vertical / horizontal) and `layout` (grouped / stacked) variants, a themed tooltip/legend/axes/grid, and caller-supplied series colors. Initial version ported from the apps/demo `BarChartPlayground`; design + data-viz palette reconciliation pending.

- [#553](https://github.com/acronis/uikit/pull/553) [`aeb71d8`](https://github.com/acronis/uikit/commit/aeb71d834e8e6302295db208ca6677a41daad075) Thanks [@madjorr](https://github.com/madjorr)! - `DataTable` gains five additive, opt-in props for server-driven usage — no
  existing call site needs to change:
  - `table` — render from an externally-built TanStack `table` instance instead
    of DataTable's own, so it composes with a caller's manual sorting/filtering/
    pagination/row models or a shared toolbar instance.
  - `manualSorting` + controlled `sorting`/`onSortingChange` — a lightweight
    opt-out of client-side sorting without needing a full external instance.
  - `renderRow` — bypass the default per-cell rendering path for a custom
    (independently memoizable) row component.
  - `renderEmptyState` — replace the default "No results." row with custom,
    filter-aware content (`hasFilters` in context). Also fixes the empty-state
    `colSpan` to use the visible column count instead of the full column count.
  - `paginationMode="infinite"` + `onLoadMore`/`hasNextPage`/`isLoadingMore` — a
    sentinel row + `IntersectionObserver` for non-virtualized infinite scroll.

  Also exports `getCellStyle`/`getPinnedStyle`/`getColumnWidth` from
  `data-table.tsx` and adds a new `useIntersectionObserver` hook to `@/hooks`.

- [#554](https://github.com/acronis/uikit/pull/554) [`bbc9903`](https://github.com/acronis/uikit/commit/bbc99037da1e5a32d2b962dfc24d0e80a0228784) Thanks [@madjorr](https://github.com/madjorr)! - Update `PageHeader` to match the current Figma "PageHeader" component
  (node 2905-7678): the title row gains an optional tags slot
  (`PageHeaderTags`) and grows the title to the design's 24px/regular style;
  the description moves into its own row (`PageHeaderDescriptionRow`) capped
  at 512px. The title and description edit affordance seen in full-page
  wizards (e.g. Create Dashboard) is a plain `ButtonIcon` placed as a sibling
  — no dedicated part for it.

  **Breaking**: `PageHeaderBreadcrumb` is removed. In the current design the
  breadcrumb is a separate sibling above `PageHeader`, not one of its parts —
  render a `Breadcrumb` above it instead.

- [#554](https://github.com/acronis/uikit/pull/554) [`7989cdc`](https://github.com/acronis/uikit/commit/7989cdc7de9742334aaec0960a7fe64971d3d85b) Thanks [@madjorr](https://github.com/madjorr)! - `PageHeaderTags` and `PageHeaderActions` now collapse on overflow, per the
  Figma "Breakpoints" page's two hard requirements: tags collapse to the first
  tag plus a "+#" tag (a tooltip lists the hidden labels on hover), and
  secondary-variant action buttons fold under a single "More" `ButtonIcon`
  menu — primary buttons are never hidden. Both are all-or-nothing collapses,
  not a partial "however many fit" reflow.

  Also fixes `PageHeaderDescriptionRow` to use `items-start` instead of
  `items-center`, so the edit pencil sits flush with the first line of a
  wrapped description instead of floating mid-paragraph, matching Figma.

- [#557](https://github.com/acronis/uikit/pull/557) [`b4208c8`](https://github.com/acronis/uikit/commit/b4208c89ae4dfc3c822b4539cfca34acad7f4585) Thanks [@madjorr](https://github.com/madjorr)! - Add `Toolbar`: a horizontal action row — list actions, an optional overflow
  control, and an optional trailing area (a status text, or a selection
  counter + action) — for use above/below a list or table when rows are
  selected or bulk actions are available.
  - `disabled` cascades to every nested Button/ButtonMenu via a native
    `<fieldset disabled>` — no prop-drilling into arbitrary children.
  - `ToolbarActionList` renders an `actions` array as ghost Buttons and
    auto-collapses the trailing ones into a "More actions" `ButtonMenu` +
    `DropdownMenu` once they no longer fit the row, re-measuring on resize. The
    row is a single Tab stop, with arrow-key roving-tabindex between visible
    actions and the overflow trigger, via Base UI's `Toolbar.Root`/
    `Toolbar.Button` (`@base-ui/react/toolbar`) — matching the WAI-ARIA toolbar
    pattern.
  - `ToolbarActions` is a right-aligned trailing slot (8px gap) that grows to
    fill leftover row space without shrinking below its own content's natural
    width, so its text never wraps or overlaps the action row.
  - No dedicated token tier — every action brings its own tokens; the 16px/8px
    gaps are un-tokenized, same precedent as `FilterSearch`.

### Patch Changes

- [#562](https://github.com/acronis/uikit/pull/562) [`21d59a8`](https://github.com/acronis/uikit/commit/21d59a859fd3047ce54ea4eda26b7d8199eeab4b) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Align the Chart tooltip chrome with the design system. The tooltip now uses the
  Tooltip tier's shape tokens (`--ui-tooltip-container-border-radius` /
  `-padding-x` / `-padding-y`) and the kit's standard `shadow-md`, and drops the
  `font-mono` numeric style — removing the `rounded-lg` / `shadow-xl` / monospace
  outliers that appeared nowhere else in the library. Radius, padding, shadow, and
  the numeric font change in both modes; the surface colors (`bg-background` /
  `text-foreground`) and the two-tone label/value hierarchy are unchanged.

- [#554](https://github.com/acronis/uikit/pull/554) [`ae49633`](https://github.com/acronis/uikit/commit/ae496330b87d81fc14e4e2b6acae7b5b835bce43) Thanks [@madjorr](https://github.com/madjorr)! - `PageHeaderActions` no longer folds a `variant="secondary"` action into the
  "More" menu unless it's a plain `Button`. A trigger-style component (e.g.
  `ButtonMenu`) opens its own menu rather than firing a single click action, so
  it has nothing for the fold to reduce to a "Menu Item" label — it now stays
  visible and unfolded instead of silently becoming an inert menu item.

- [#523](https://github.com/acronis/uikit/pull/523) [`719517c`](https://github.com/acronis/uikit/commit/719517c4aa563b8cc80b52d35a67f4bacd7e0841) Thanks [@heygabecom](https://github.com/heygabecom)! - Sync design tokens with Figma.

  Replaces the `Chips` component token group with the new `Chip` structure
  (`_global` box/border/icon geometry + colors, per-variant label colors). Migrates
  the ui-react `Chip` component (and its spec/tests) off the old `--ui-chips-*`
  tokens onto the new `--ui-chip-*` names — a like-for-like rename with no rendered
  change.

- [#529](https://github.com/acronis/uikit/pull/529) [`896d9fd`](https://github.com/acronis/uikit/commit/896d9fd34afda7d66736d5b5acb47843fb0e74e2) Thanks [@heygabecom](https://github.com/heygabecom)! - Sync design tokens with Figma.
  - **Avatar**: moves `_global.borderRadius` into `_global.avatar.border.borderRadius` (aligns token path with the component structure).
  - **Checkbox**: renames `marginX` to `marginY`.
  - **Radio**: renames `marginX` to `marginY`.

  Regenerates tokens-pd and migrates the ui-react consumers (Avatar → `--ui-avatar-global-avatar-border-border-radius`, Checkbox → `--ui-checkbox-global-box-margin-y`) and their specs — like-for-like renames, no rendered change.

- Updated dependencies [[`2584da5`](https://github.com/acronis/uikit/commit/2584da58f2ecc692446971144c45f2263f8932d6), [`deae803`](https://github.com/acronis/uikit/commit/deae803e14d94243d5c3109a0d576eaca1e5ba49), [`719517c`](https://github.com/acronis/uikit/commit/719517c4aa563b8cc80b52d35a67f4bacd7e0841), [`896d9fd`](https://github.com/acronis/uikit/commit/896d9fd34afda7d66736d5b5acb47843fb0e74e2)]:
  - @acronis-platform/tokens-pd@2.2.0

## 0.56.1

### Major Changes

- [#549](https://github.com/acronis/uikit/pull/549) [`d01f9ab`](https://github.com/acronis/uikit/commit/d01f9ab44089b3a8dd9927b94cdaf129c677a032) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - DropdownMenu: align with Figma design (ButtonMenuDropdown)

  ### BREAKING CHANGES
  - **Removed exports:** `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`,
    `DropdownMenuRadioGroup`, `DropdownMenuLabel`, `DropdownMenuSeparator` —
    not present in the Figma design. Consumers using these must migrate:
    - `DropdownMenuLabel` → remove or use a plain styled `<div>`.
    - `DropdownMenuSeparator` → use multiple `DropdownMenuGroup`s (non-first
      groups render a top-border separator automatically).
    - `DropdownMenuCheckboxItem` → use `DropdownMenuItem` with a visual
      checkmark (see `TableViewOptions` for the pattern).
    - `DropdownMenuRadioItem` / `DropdownMenuRadioGroup` → use
      `DropdownMenuItem` with custom selection state.
  - **`TableViewOptions`:** removed the `menuLabel` prop. The Figma design has no
    menu heading, so the dropdown no longer renders one — the prop is gone rather
    than silently ignored.

  ### Additions
  - Theme the entire component with `--ui-button-menu-dropdown-*` tokens from
    `@acronis-platform/tokens-pd` (replacing shared semantic tokens).
  - Add `DropdownMenuGroup` (Figma `Section`): non-first groups render a
    top-border separator automatically.
  - Add item active state (`data-[highlighted]:active`) and keyboard-only
    focus ring (`focus-visible:not(:hover)`, 3px inset, `--ui-focus-primary`).
  - Add `DropdownMenuShortcut` (Figma `ItemExtras` variant=shortcut) and
    cascade chevron color token for submenu triggers.

  ### Internal
  - Update `TableViewOptions` to use `DropdownMenuItem` with visual checkmark
    instead of removed checkbox sub-component.
  - Stories now use `ButtonMenu` as the trigger (matching Figma pattern).

### Minor Changes

- [#551](https://github.com/acronis/uikit/pull/551) [`24f0096`](https://github.com/acronis/uikit/commit/24f0096ae19b2613077dd02bee8f582b3e6d2b7d) Thanks [@madjorr](https://github.com/madjorr)! - Add `AppShellChat` — a 3-section, horizontally resizable application scaffold
  (sidebar rail | Content | Chat). Content and Chat resize against each other via a
  drag handle on Chat's start border (mirroring `SidebarSecondary`'s resize
  interaction, flipped for the end-of-row panel); sidebar interactions reflow
  Content only, never Chat. Chat is resize-only: dragging down to its floor width
  switches its header to an icon-only rail, and dragging up can take it to full
  width (Content shrinks to 0) since the resize ceiling is measured from the
  actual available space rather than a fixed cap. Composable parts:
  `AppShellChat`, `AppShellChatSidebar`, `AppShellChatContent`,
  `AppShellChatContentHeader`, `AppShellChatContentBody`, `AppShellChatChat`,
  `AppShellChatChatHeader`, `AppShellChatChatBody`. RTL-safe via CSS logical
  properties. Distinct from the existing `AppShell` component.

- [#551](https://github.com/acronis/uikit/pull/551) [`e199d0e`](https://github.com/acronis/uikit/commit/e199d0e672c763bb88e140c0341e5a7c3a3a3759) Thanks [@madjorr](https://github.com/madjorr)! - `AppShellChat`'s Chat panel now has a breakpoint-responsive width: 512px at
  1680px+, 448px from 1280-1679px, and the 48px icon-rail floor below 1280px.
  This is genuinely LIVE — driven by plain responsive Tailwind classes
  (`w-12 xl:w-md 3xl:w-lg`), reflowing on every browser resize — until the
  user drags the resize handle or nudges it with the arrow keys, at which
  point that explicit choice wins until double-click/Home resets it.

  Also exports `useAppShellChatInitialLayout` (and the pure
  `getAppShellChatInitialLayout` helper) so consumers can wire the sidebars'
  breakpoint-appropriate INITIAL layout into `SidebarPrimary`/
  `SidebarSecondary`'s `defaultExpanded` prop. Unlike Chat's width, this is
  resolved ONCE from the viewport width at mount and frozen after that (the
  sidebars have their own manual collapse/expand controls, so their state
  should not fight a live viewport change): at 1680px+ both sidebars start
  open; below that the primary sidebar starts closed (secondary stays open).

- [#550](https://github.com/acronis/uikit/pull/550) [`9fe95f9`](https://github.com/acronis/uikit/commit/9fe95f9d3529c357432e1d767139cf6b7a515ab5) Thanks [@madjorr](https://github.com/madjorr)! - Pin the design team's viewport breakpoint scale in `src/styles/index.css`'s `@theme`
  block, replacing Tailwind's stock `lg`/`xl`/`2xl` values and adding new `3xl`/`4xl`
  steps:

  | Breakpoint | Before (Tailwind default) | After              |
  | ---------- | ------------------------- | ------------------ |
  | `lg`       | 1024px                    | 1024px (unchanged) |
  | `xl`       | 1280px                    | 1280px (unchanged) |
  | `2xl`      | 1536px                    | **1440px**         |
  | `3xl`      | n/a                       | **1680px** (new)   |
  | `4xl`      | n/a                       | **1920px** (new)   |

  **Breaking for consumers relying on Tailwind's default `2xl` (1536px)**: any
  `2xl:`-prefixed utility, and the built-in `.container` utility's `2xl` step, now
  activates at 1440px instead of 1536px. `sm`/`md` are unchanged. A
  `Foundations/Breakpoints` Storybook story documents the full scale.

- [#547](https://github.com/acronis/uikit/pull/547) [`d504bcd`](https://github.com/acronis/uikit/commit/d504bcdc0f5f42fc96c2760bc206e573c646a251) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - **InputSelect: functional in-dropdown search, tree/hierarchy support, and Figma Code Connect for the dropdown.**

  New public API:
  - `InputSelectExpander` — a non-selectable expand/collapse row for tree groups.
  - `useInputSelectFilter` — reads the live search query so hierarchical (tree)
    dropdowns can filter themselves in place, without flattening.
  - `InputSelectItem` gains an `icon` prop (leading icon, colored by
    `--ui-input-select-dropdown-item-global-icon-tenant`), a `textValue` prop to
    override the text matched against the search query, and an `indent` prop.

  In-dropdown search now works:
  - `InputSelectSearch` drives a filter context — flat `InputSelectItem`s auto-hide
    when their label doesn't match the query.
  - Fixes a bug where Base UI's typeahead swallowed the typed keys, so the query
    never appeared. Only printable keys are now intercepted, so Arrow / Enter /
    Escape still navigate and dismiss the list from the search box.
  - Passing `value`/`onChange` controls the query externally: the internal filter
    the items match against now stays synced to the controlled value, so a
    prop-driven change (a "clear" button, a debounced value) that fires no
    `onChange` no longer leaves items hidden against a stale query.

  Tree/hierarchy layout:
  - `indent` (on `InputSelectItem` and `InputSelectExpander`) reserves a leading
    nesting spacer matching the Figma tenant tree: 16 / 40 / 64 px for levels 1–3
    (`16 + (level − 1) × 24`). Expander chevrons are tucked right-aligned into that
    reserved space so tenant icons stay aligned across rows.

  Token / Figma alignment:
  - The single-select check indicator now uses
    `--ui-input-select-dropdown-item-global-icon-checked`.
  - `InputSelectStatus`'s hardcoded `min-h` is replaced with
    `--ui-input-select-dropdown-container-status-width-min`.
  - Icon colors match Figma: the search magnifier and loading spinner use
    `--ui-glyph-on-surface-primary`, the empty icon `--ui-glyph-on-status-info`,
    and the error icon `--ui-glyph-on-status-warning`.
  - Adds Figma Code Connect for the `InputSelectDropdown` (2885-2373) and
    `InputSelectDropdownTenants` (3064-21461) component sets.

### Patch Changes

- [#544](https://github.com/acronis/uikit/pull/544) [`494f5a3`](https://github.com/acronis/uikit/commit/494f5a357642a5ea92953041939f5ec71e6b49cd) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Button: remove `inverted` variant (no longer in Figma) and make the AI icon optional (consumer-provided, not auto-injected)

- [#521](https://github.com/acronis/uikit/pull/521) [`07e9c24`](https://github.com/acronis/uikit/commit/07e9c24d301df0711c9acbd1fc54c150c00e239b) Thanks [@heygabecom](https://github.com/heygabecom)! - Migrate Dialog and Sheet off the removed `--ui-background-overlay-primary` token. Dialog's overlay now uses `--ui-background-backdrop-screen`; Sheet no longer renders a backdrop by default (sheets open on top of the page), though the `SheetOverlay` / `DetailsOverlay` export is retained for drop-in compatibility.

- Updated dependencies [[`f9c28af`](https://github.com/acronis/uikit/commit/f9c28af09ec180013642a929b058274c179903bf), [`99562f8`](https://github.com/acronis/uikit/commit/99562f83b216f8ee777e04cb4d73de7b474c200d), [`88b73be`](https://github.com/acronis/uikit/commit/88b73be4f8e1edcf11628be7bc876844eef4a73b), [`92c325e`](https://github.com/acronis/uikit/commit/92c325ef755689523fa8c186bb96dd083fe23a58), [`07e9c24`](https://github.com/acronis/uikit/commit/07e9c24d301df0711c9acbd1fc54c150c00e239b)]:
  - @acronis-platform/tokens-pd@2.1.0

## 0.56.0

### Minor Changes

- [#546](https://github.com/acronis/uikit/pull/546) [`20f6c46`](https://github.com/acronis/uikit/commit/20f6c468ad91c03dfdbc490213d3fc24361e191d) Thanks [@madjorr](https://github.com/madjorr)! - Add `Calendar` and `DateRangePicker` (initial versions ported from ui-legacy;
  design reconciliation pending). `Calendar` wraps `react-day-picker` with the UI
  Kit's semantic tokens (single / range / multiple selection, multi-month layouts);
  `DateRangePicker` composes the `InputDatePicker` trigger with a dual-month range
  calendar, editable start/end fields, and a Reset / Apply footer using a
  draft/commit idiom. `Calendar` defaults to a Monday week start (`weekStartsOn={1}`),
  overridable per instance.

  **Migrating from `@acronis-platform/shadcn-uikit`'s `calendar`/`date-picker`**:
  both are `'use client'` shadcn components built on the same underlying
  `react-day-picker` and Base UI `Popover` foundation, so the selection/keyboard
  model is unchanged — what moves is composition and theming.
  - `import { Calendar } from '@acronis-platform/shadcn-uikit'` →
    `import { Calendar } from '@acronis-platform/ui-react'`. Same `mode`/`selected`/
    `onSelect`/`numberOfMonths`/`disabled` props (all passed through to
    `DayPicker`). Legacy's `buttonVariant` prop is gone — ui-react's `Calendar`
    themes its own nav/day buttons off `--ui-*` semantic tokens instead of
    `buttonVariants`, so there's nothing to pass. Legacy defaulted to
    `weekStartsOn={0}` (Sunday, `react-day-picker`'s own default); ui-react
    defaults to `weekStartsOn={1}` (Monday) — pass `weekStartsOn={0}` explicitly
    to keep the old default.
  - Legacy's `date-picker.tsx` was a **local demo composition**
    (`Popover` + `Button` trigger + `Calendar mode="single"`), not an exported
    library component — there is no 1:1 import migration for it. For a single
    date, compose `Calendar` + `Popover` + `InputDatePicker`
    (`pickerType="date"`) yourself, mirroring `DateRangePicker`'s internals. For
    a **range**, use the new `DateRangePicker` directly — it replaces that
    hand-rolled composition end-to-end (trigger, dual-month calendar, editable
    start/end fields, Reset/Apply), minus preset ranges (`Last 7 days`, etc.),
    which are intentionally out of scope for this v1 and are expected to compose
    alongside it (e.g. inside `FilterSearchFilters`) rather than be built into
    the picker itself.
  - Legacy's `bg-primary`/`bg-accent`/opacity-modifier styling (`data-[range-middle=true]:bg-accent`,
    etc.) is now driven by `--ui-*` semantic tokens (no `--av-*`, no component
    token tier yet) — if you were overriding legacy's `classNames`/`className`
    directly, re-check against ui-react's token names rather than porting class
    strings verbatim.

- [#536](https://github.com/acronis/uikit/pull/536) [`33731fe`](https://github.com/acronis/uikit/commit/33731fe00eeb064e09e2aa3e8e40728ed66916e6) Thanks [@madjorr](https://github.com/madjorr)! - Extend `DataTable` with advanced grid features built on native TanStack APIs:
  - **Column resizing** — opt in with `enableColumnResizing`; a drag handle renders at the trailing edge of each resizable header (`header.getResizeHandler()`). Optional `onColumnSizingChange` passthrough persists widths.
  - **Sticky columns** — a `ColumnDef.meta.pin: 'left' | 'right'` flag drives TanStack's native column pinning (`column.pin()`), applying `position: sticky` with the computed offset and an opaque row-token background.
  - **`DataTableExpandTrigger`** — a chevron toggle cell helper wired to `row.getCanExpand()` / `getIsExpanded()` / `toggleExpanded()`, so the expand affordance can live in a real column rather than only via a whole-row click.
  - **Per-column filtering in `DataTableToolbar`** — the bare `InputText` filter is replaced by composition of `FilterSearchFilters` + `FilterSearchAppliedFilters`; pass filter-field children (keyed by column id via `useFilterSearchFilters`) and the toolbar wires them to the table's `columnFilters` state. The plain-text `searchKey` search remains a separate concern.

  `DataTableViewOptions` is now a thin TanStack adapter over the primitive-only `TableViewOptions`.

  **Migrating from Vue2 `table`**: column `sortable`/`sortBy`/`sortMethod` map to
  `DataTable`'s TanStack `ColumnDef.enableSorting`/`sortingFn` (or `Table`'s new
  `useSortState` hook for the primitives-only path). `resizable` →
  `enableColumnResizing` (TanStack's native column-resizing; no more manual
  `header-dragend` math). `fixed: true/'left'/'right'` → `ColumnDef.meta.pin`
  (TanStack column pinning) instead of the old CSS/IE-polyfill approach. The
  `type="expand"` column → `DataTableExpandTrigger` in a column `cell`.
  Column-level filtering → filter-field children composed into
  `DataTableToolbar` via `FilterSearchFilters`/`FilterSearchAppliedFilters`.
  There is no Vue2 equivalent for the new URL-bookmarkable state (see the
  companion `Table` primitives changeset) — this is `ui-react`-only
  functionality with no migration mapping needed. `colReorderable` and
  `rowGroups`/`<el-table-rows-group>` are **not covered by this release** —
  they're scoped as separate follow-up tasks; when those ship, their own
  changesets will carry the `colReorderable` → TanStack `columnOrder`-based
  reordering and `rowGroups`/`getRowGroupData` → TanStack
  `getGroupedRowModel`-based grouping migration notes.

- [#536](https://github.com/acronis/uikit/pull/536) [`af50fcb`](https://github.com/acronis/uikit/commit/af50fcb4016d8d941504908dac79404288bced4a) Thanks [@madjorr](https://github.com/madjorr)! - Fix several `Table`/`DataTable` bugs and add a controlled column-visibility
  API for composing `DataTable` with an external toolbar:
  - **`DataTable`**: column pinning now un-pins when `ColumnDef.meta.pin` is
    removed dynamically (previously only pinned, never un-pinned).
  - **`DataTable`**: the column-resize handle is now keyboard-operable
    (WCAG 2.1.1) — focusable, `aria-value{now,min,max}`, and Arrow
    Left/Right (Shift = larger step) resize via a new exported
    `getResizeKeyboardStep` helper. Ignores Ctrl/Alt/Meta so it doesn't hijack
    browser/OS shortcuts, and clamps fully to `[minSize, maxSize]` regardless of
    which bound the current size started outside of.
  - **`DataTable`**: added a controlled `columnVisibility` /
    `onColumnVisibilityChange` prop pair (mirrors the existing `columnSizing`
    passthrough) so a `DataTable` composed with an external `DataTableToolbar`
    can share one visibility state instead of two independently-owned,
    out-of-sync `useReactTable` instances — fixes the toolbar's "View" menu
    silently no-oping when paired with a self-contained `DataTable`.
  - **`DataTable`/`Table`**: `DataTableColumnHeader` and `Table`'s sortable
    header button now show a pointer cursor on the button itself (previously
    missing, or set on an ancestor `<th>` that a native `<button>` doesn't
    inherit cursor from).
  - **`DataTable`**: the resize handle's cursor now references the same
    `--ui-resizable-cursor` token the `Resizable` primitive uses, instead of a
    hardcoded `cursor-col-resize`.
  - **`DataTableExpandTrigger`**: now shows a pointer cursor, and its
    expand/collapse chevron rotates (`ChevronDownIcon` + `transition-transform`)
    instead of swapping between two icon components, matching
    `SidebarSecondary`'s section-trigger pattern.
  - **`use-table-url-state`**: multiple state setters called synchronously in
    one handler (e.g. a filter change that also resets the page) now produce a
    single browser-history entry instead of two.

  No breaking changes — every fix above is backward compatible, and
  `columnVisibility`/`onColumnVisibilityChange` are optional (uncontrolled
  internal state when omitted, same as before).

  **Migration (optional)**: if you compose `DataTable` with an external
  toolbar and currently work around the visibility bug by manually filtering
  the `columns` array you pass to `DataTable` (based on your own external
  `columnVisibility` state), you can drop that workaround — pass
  `columnVisibility`/`onColumnVisibilityChange` straight through instead:

  ```diff
  - <DataTable columns={visibleColumns} data={rows} />
  + <DataTable
  +   columns={allColumns}
  +   data={rows}
  +   columnVisibility={columnVisibility}
  +   onColumnVisibilityChange={setColumnVisibility}
  + />
  ```

  **Heads up**: `DataTableExpandTrigger`'s collapsed state now renders a
  rotated `ChevronDownIcon` instead of a separate `ChevronRightIcon` — same
  accessible name/behavior, but a different `<svg>` shape when collapsed. If
  you maintain your own visual-regression snapshots covering this component,
  expect a diff there.

- [#536](https://github.com/acronis/uikit/pull/536) [`33731fe`](https://github.com/acronis/uikit/commit/33731fe00eeb064e09e2aa3e8e40728ed66916e6) Thanks [@madjorr](https://github.com/madjorr)! - Add a `ColumnDef.meta.wrap` flag to `DataTable`. When `true`, the column's
  header and cells render with `whitespace-normal` and drop the fixed row height
  so long content grows the row instead of being clipped — mirroring the `wrap`
  prop the `Table` primitives already expose on `TableHead`/`TableCell`.

- [#534](https://github.com/acronis/uikit/pull/534) [`abd485e`](https://github.com/acronis/uikit/commit/abd485ed5f9c3d06bd92721e1b5d1043fd0dceb1) Thanks [@madjorr](https://github.com/madjorr)! - Add `FilterSearchFilters` (filter popover: fields + Reset/Cancel/Apply) and `FilterSearchAppliedFilters` (removable applied-filter chips + a top-level Reset filters) to `FilterSearch`, replacing the standalone `MultiSearch` component (never released; retired in favor of living alongside the toolbar it always appeared next to). Design-pending — no Figma node yet for the two new parts.

- [#537](https://github.com/acronis/uikit/pull/537) [`09a4110`](https://github.com/acronis/uikit/commit/09a4110c27e2e8aa1a3bca900e88637c656ccfaa) Thanks [@madjorr](https://github.com/madjorr)! - SidebarPrimary, SidebarSecondary: fix several UX bugs and unify the two components' collapse-trigger and tooltip behavior

  **Breaking:**
  - `SidebarPrimaryMenuItem.icon` is now required by default (rail mode is icon-only, so an icon-less row is a UX bug) — pass `noIcon` to explicitly opt out for the rare row that has none
  - `SidebarSecondaryCollapseTrigger.expandIcon` removed — both `SidebarPrimaryCollapseTrigger` and `SidebarSecondaryCollapseTrigger` now take a single `icon` that rotates 180° between expanded/collapsed instead of swapping icon elements

  **Fixes:**
  - `SidebarPrimaryCollapseTrigger`'s row (and its extras) now shows a pointer cursor — the shared cva was missing `cursor-pointer` that `SidebarSecondary`'s already had
  - `SidebarPrimaryHeader`'s logo/padding now animate alongside the rail's width transition instead of snapping instantly. The row's height is also now pinned to the larger of the two states' `padding×2 + logo-height` sums — `logo`/`collapsedLogo` are two separate elements swapped by a JS conditional (not one element whose size CSS-transitions), so the incoming logo mounts at its final size instantly while padding is still mid-transition; without the pinned height the row briefly overshot/undershot its resting height and the rest of the menu visibly jumped
  - Truncated-label tooltips on `SidebarPrimaryMenuItem`, `SidebarSecondaryMenuItem`, `SidebarSecondarySectionLabel`, and both `CollapseTrigger`s now open to the side (right in LTR, left in RTL) instead of on top, and are anchored to the full row instead of the shrinking label span — so they align flush with the sidebar's edge instead of drifting inward when a row also has `extras`
  - Collapsed/rail-mode icon-only rows now always show their label as a tooltip on hover — previously the tooltip trigger was the `sr-only` label itself, which can never receive a real hover
  - `SidebarPrimaryMenuItem` (an anchor) now activates on Space in addition to Enter, matching native button behavior and `SidebarSecondaryMenuItem`
  - `SidebarPrimaryMenuItem`'s required-`icon` union now rejects `icon={undefined}` without `noIcon` — previously it typechecked (since `React.ReactNode` already includes `undefined`) and silently rendered an icon-less row

  **Added:**
  - `TooltipContent` (`@/components/ui/tooltip`) gained an `anchor` prop — overrides what the popup positions against, independent of what triggers it open. Needed for the row-anchoring fix above; also usable directly by consumers with a similar narrow-trigger/wide-anchor layout.

  **Migration:**
  - Every `SidebarPrimaryMenuItem` without an `icon` now fails to typecheck. Add an `icon`, or `noIcon` for the rare row that intentionally has none:

    ```diff
    - <SidebarPrimaryMenuItem href="/settings">General settings</SidebarPrimaryMenuItem>
    + <SidebarPrimaryMenuItem href="/settings" noIcon>General settings</SidebarPrimaryMenuItem>
    ```

  - Drop `expandIcon` from any `SidebarSecondaryCollapseTrigger` — the single `icon` now rotates automatically:

    ```diff
    - <SidebarSecondaryCollapseTrigger icon={<ChevronsLeftIcon />} expandIcon={<ChevronsRightIcon />} />
    + <SidebarSecondaryCollapseTrigger icon={<ChevronsLeftIcon />} />
    ```

- [#536](https://github.com/acronis/uikit/pull/536) [`33731fe`](https://github.com/acronis/uikit/commit/33731fe00eeb064e09e2aa3e8e40728ed66916e6) Thanks [@madjorr](https://github.com/madjorr)! - Extend the `Table` primitives with TanStack-independent parts and hooks:
  - **`TablePagination`** — a plain-props twin of `DataTablePagination`
    (first/prev/next/last + rows-per-page select + page-count text) driven by
    `pageIndex`/`pageCount`/`pageSize`/`onPageIndexChange`/`onPageSizeChange`, with
    no `@tanstack/react-table` dependency.
  - **`TableViewOptions`** — a router/grid-agnostic show/hide-columns dropdown
    driven by a plain `{ id, label, hidden }[]` + `onToggle(id)`.
  - **`useSortState`** — headless client-side sort state for the primitives
    (default natural alphanumeric comparator, optional per-column custom
    comparator) wired to `TableHead`'s `sortable`/`sortDirection`/`onSort`.
  - **`useTableUrlState`** — router-agnostic hook that syncs controlled table
    state (pagination/sorting/columnFilters) to and from the URL query string via
    `history.pushState`/`popstate`, with namespaced `tbl_*` keys, so a view is
    bookmarkable. Ships `parseTableUrlState`/`serializeTableUrlState` helpers.
  - **`TableCell`/`TableHead` `wrap` prop** — swaps the fixed row height for
    `whitespace-normal`, letting a cell wrap onto multiple lines and the row grow
    to fit its content.

  There is no Vue2 equivalent for the URL-bookmarkable state — this is
  `ui-react`-only functionality.

### Patch Changes

- [#543](https://github.com/acronis/uikit/pull/543) [`fb43b1d`](https://github.com/acronis/uikit/commit/fb43b1d4549154fe479fa6e0903559dbfdf5f84f) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Fix `Avatar` rendering at 28px instead of the designed 32px (PLTFRM-92393). The
  2px separator stroke was a CSS `border`, drawn inside the 32px border-box, so the
  visible circle shrank to 28px. Figma draws the stroke with `strokeAlign: OUTSIDE`,
  so it is now an outset `box-shadow` ring that leaves the colored circle at the full
  32px without inflating the layout box — keeping the `AvatarGroup` overlap step
  (32px − 6px gap) intact.

- [#538](https://github.com/acronis/uikit/pull/538) [`e8f613d`](https://github.com/acronis/uikit/commit/e8f613d83b073502b9c9ad79a61916e7168c4126) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Fix `Breadcrumb` link states to match the Figma design: the pressed
  (`:active`) state no longer keeps the hover underline, and keyboard focus now
  shows a 3px focus-ring (`--ui-focus-primary`) flush to the label with no
  underline (previously a 2px offset ring plus an underline).

- [#540](https://github.com/acronis/uikit/pull/540) [`3fc266c`](https://github.com/acronis/uikit/commit/3fc266cfbec209981d6c40a708c5fb5b03a201a8) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Fix `Button` states to match Figma: the `ghost` variant now underlines its
  label on hover (wired to the `--ui-button-ghost-label-text-decoration-*`
  tokens, dropped again on `:active`), and every variant shows a `pointer`
  cursor.

- [#542](https://github.com/acronis/uikit/pull/542) [`267507f`](https://github.com/acronis/uikit/commit/267507fcf47f8778444202c3dc9729327b87a352) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Fix `Checkbox` focus ring width to 3px (`ring-[3px]`) to match the Figma
  design — it was 2px.

- [#539](https://github.com/acronis/uikit/pull/539) [`999efc8`](https://github.com/acronis/uikit/commit/999efc8c9b3221e579da3a284b304cc8c94c9691) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Set a global `text-underline-offset: 3px` so underlined text (links, hovered
  breadcrumbs, …) matches the Figma underline offset instead of the tighter
  browser default.

- [#546](https://github.com/acronis/uikit/pull/546) [`20f6c46`](https://github.com/acronis/uikit/commit/20f6c468ad91c03dfdbc490213d3fc24361e191d) Thanks [@madjorr](https://github.com/madjorr)! - Fix `InputDatePicker` trigger cursor: show `cursor: pointer` on hover when
  enabled (Tailwind v4's Preflight does not set a pointer cursor on `<button>`),
  while keeping `cursor: not-allowed` when disabled.

- [#532](https://github.com/acronis/uikit/pull/532) [`da18636`](https://github.com/acronis/uikit/commit/da186363bd8be271358575cbd3ef7bea76bfc007) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - SidebarSecondary, Resizable, ButtonIcon, Tooltip: UX polish fixes

  **Cursor styles:**
  - Add `cursor-pointer` to menu items, collapse triggers, and expandable section labels
  - Add `cursor-pointer` to `ButtonIcon` base styles globally

  **Keyboard accessibility:**
  - Space key now activates focused anchor menu items (native `<a>` only responds to Enter)
  - Resize edge: Space toggles expand/collapse, ArrowRight expands when collapsed

  **Resize edge:**
  - Widen hit area from 9px to 17px for easier targeting
  - Add `trackCursorAxis="y"` to resize edge tooltip so it follows the pointer vertically
  - Render own focus ring via `after` pseudo (CSS border + box-shadow) instead of sidebar container ring
  - Sidebar container `:has()` styles now target `border-inline-end-color` only (no outer ring)

  **Resizable:**
  - `ResizableHandle` divider line now uses a CSS border (`border-inline-start`) instead of `width` + `background` so the browser pixel-snaps the 1px line on fractional positions
  - Focus ring rendered as `box-shadow` on the `after` pseudo, auto-centered on the line

  **Focus retention:**
  - CollapseTrigger now keeps stable DOM structure (Tooltip wrapper always present, disabled when expanded) so focus is preserved across state changes

  **Tooltip delay:**
  - `TooltipProvider` now defaults `delay` to 300ms (down from Base UI's 600ms)

  **Stories:**
  - Operations section items show per-item counters (12, 10)
  - External link items use `target="_blank" rel="noopener noreferrer"`
  - Section action `ButtonIcon` wrapped in `Tooltip`

- Updated dependencies [[`8580171`](https://github.com/acronis/uikit/commit/8580171c47a17be69f7dcb6ff028f2b271c443c7), [`62a9f38`](https://github.com/acronis/uikit/commit/62a9f389de16f911a0f4b042bd1d91c260405211), [`eb8b0f9`](https://github.com/acronis/uikit/commit/eb8b0f9eb2d222c6b2aa85d46a29c264282b6c5c)]:
  - @acronis-platform/tokens-pd@2.0.0

## 0.55.0

### Minor Changes

- [#505](https://github.com/acronis/uikit/pull/505) [`7433791`](https://github.com/acronis/uikit/commit/743379150993bf055e55175dda05bc9420276a41) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Add `FilterSearch`: a composable toolbar layout for data tables (search + filters + tenant switcher + action buttons). Designed to complement the existing `DataTableToolbar` — use `FilterSearch` as a standalone toolbar above any data table, or `DataTableToolbar` when working within the `DataTable` composition. Also fixes `InputSearch` to apply `className` to the outer container so width-sizing (`className="w-56"`) works correctly.

- [#512](https://github.com/acronis/uikit/pull/512) [`3e68b28`](https://github.com/acronis/uikit/commit/3e68b28392a7735fbe54cde75207031b9dd076f2) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - feat: add `PortalContainerProvider` for shadow-DOM MFE portal redirection (PLTFRM-91950)

  New exports: `PortalContainerProvider`, `usePortalContainer`.

  Wrap a subtree in `<PortalContainerProvider container={element}>` and every
  portaling component (`Popover`, `DropdownMenu`, `Tooltip`, `Dialog`, `Sheet`,
  `InputSelect`/`Select`, `Combobox`, `Toaster`) will mount its popup inside the
  given container instead of `document.body`. An explicit `portalContainer` prop
  on an individual component still takes precedence.

  This is the recommended pattern for rendering `@acronis-platform/ui-react`
  inside a shadow-DOM MFE: adopt the library's CSS onto the shadow root and wrap
  the React tree in `PortalContainerProvider` pointing at a `<div>` inside the
  shadow root. Portaled popups will then render inside the shadow boundary, fully
  styled, with zero global style leakage.

- [#506](https://github.com/acronis/uikit/pull/506) [`caae190`](https://github.com/acronis/uikit/commit/caae190a0622d4d21101c81b29279e472c507c86) Thanks [@madjorr](https://github.com/madjorr)! - Add `logo` and `collapsedLogo` props to `SidebarPrimaryHeader` so consumers can render distinct graphics per rail state (e.g. a full brand lockup when expanded vs. a monogram when collapsed) instead of resizing or hiding a single node via CSS. `children` still works unchanged when only one representation is needed.

- [#501](https://github.com/acronis/uikit/pull/501) [`d9e5d4e`](https://github.com/acronis/uikit/commit/d9e5d4eb9184dd61b3e9812f0a111b68c04342e2) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - SidebarSecondary: resizable sidebar, auto breadcrumb, Resizable handle redesign

  **Resizable sidebar (Figma 4449:21298):**
  - New `resizable` prop enables a draggable edge on the right border
  - Drag to resize between 256–512px; drag past 128px threshold to collapse
  - Click edge to collapse/expand; double-click to reset to 256px default
  - Width persists across collapse/expand cycles

  **Collapsed breadcrumb auto-wiring:**
  - `SidebarSecondaryCollapsedBreadcrumb` is now rendered automatically by the
    root — consumers no longer need to place it manually
  - Labels auto-derived from `SidebarSecondaryHeader` and selected
    `SidebarSecondaryMenuItem` via context
  - Removed from the public API (internal implementation detail)

  **Resizable handle redesign (Figma 4649:6681):**
  - Remove grab-bar pill (`withHandle` prop dropped)
  - Idle border via `--ui-border-on-surface-border`, highlights on hover/active
  - 9px hit area (1px line + 4px padding per side)

  **i18n — no hardcoded English in published components:**
  - New `resizeAriaLabel`, `resizeTooltipExpanded`, `resizeTooltipCollapsed` props
    on `SidebarSecondary` (default to English)
  - New `expandTooltip` prop on `SidebarSecondaryCollapseTrigger` (default `'Expand'`)
  - New `extras` prop on `SidebarSecondaryCollapseTrigger` (trailing slot for shortcut hints, etc.)
  - New "Localized resize labels (es)" Storybook story demonstrates usage

  **Storybook:**
  - Interactive controls wired to Default story
  - `resizable` prop exposed in argTypes; `width`/`onWidthChange` hidden

  **Migration:**
  1. **`SidebarSecondaryCollapsedBreadcrumb` removed from public API** — the collapsed breadcrumb is now rendered automatically by `SidebarSecondary`. Remove any manual `<SidebarSecondaryCollapsedBreadcrumb />` placement:

  ```diff
  -import { SidebarSecondary, SidebarSecondaryContent, SidebarSecondaryCollapsedBreadcrumb } from '@acronis-platform/ui-react';
  +import { SidebarSecondary, SidebarSecondaryContent } from '@acronis-platform/ui-react';

   <SidebarSecondaryContent>
  -  <SidebarSecondaryCollapsedBreadcrumb />
     {children}
   </SidebarSecondaryContent>
  ```

  2. **`SidebarSecondaryMenuSub*` components removed** — `SidebarSecondaryMenuSub`, `SidebarSecondaryMenuSubTrigger`, `SidebarSecondaryMenuSubContent`, and `SidebarSecondaryMenuSubItem` have been removed from the public API. Use `SidebarSecondarySection` with `expandable` instead for collapsible groups of items.

  3. **`SidebarSecondaryCollapseTrigger` now takes an `extras` prop** — if you were passing `SidebarSecondaryMenuItemExtras` (or a raw shortcut/tag node) as a second child alongside the label — commonly with the label wrapped in `<span style={{ flex: 1 }}>...</span>` to push the extras to the row's edge — move it to the new `extras` prop and drop the manual flex wrapper:

  ```diff
  -<SidebarSecondaryCollapseTrigger icon={<PanelLeftCloseIcon />}>
  -  <span style={{ flex: 1 }}>Collapse menu</span>
  -  <SidebarSecondaryMenuItemExtras variant="shortcut" shortcut="⌘[" />
  -</SidebarSecondaryCollapseTrigger>
  +<SidebarSecondaryCollapseTrigger
  +  icon={<PanelLeftCloseIcon />}
  +  extras={<SidebarSecondaryMenuItemExtras variant="shortcut" shortcut="⌘[" />}
  +>
  +  Collapse menu
  +</SidebarSecondaryCollapseTrigger>
  ```

  4. **`Resizable` `withHandle` prop dropped** — the grab-bar pill is replaced by a border-line affordance. Remove any `withHandle` usage:

  ```diff
  -<Resizable withHandle>
  +<Resizable>
  ```

### Patch Changes

- [#494](https://github.com/acronis/uikit/pull/494) [`b783b3d`](https://github.com/acronis/uikit/commit/b783b3dd53a8bfa021daef9d4ec1c1d2b7a4525e) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Apply font-smoothing reset (`-webkit-font-smoothing: antialiased`,
  `-moz-osx-font-smoothing: grayscale`) to all elements via `@layer base`.

- [#495](https://github.com/acronis/uikit/pull/495) [`9f20cfa`](https://github.com/acronis/uikit/commit/9f20cfaad86243df2e83ed25b195d8dc8bce6cf5) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Replace physical CSS properties with logical equivalents for RTL support across
  avatar, breadcrumb, chip, data-table, dropdown-menu, input-date-picker,
  input-select, input-text, resizable, sidebar-primary, sidebar-secondary, switch,
  table, tabs, toast, and widget-placeholder components. Layouts now render
  correctly in both LTR and RTL directions.

  Add `unicode-bidi: plaintext` to truncated label spans in sidebar-primary and
  sidebar-secondary so text-overflow ellipsis clips from the correct end regardless
  of layout direction.

  Add overflow tooltip to sidebar-secondary menu items, section labels, and
  collapse trigger — the tooltip shows the full label only when the text is
  actually clipped (matching the existing sidebar-primary behaviour).

  Ensure sidebar-secondary section labels truncate with ellipsis instead of
  wrapping to multiple lines.

- [#510](https://github.com/acronis/uikit/pull/510) [`6ce0de7`](https://github.com/acronis/uikit/commit/6ce0de79d4ee1e915a9324f487ab2d0f2f0d681c) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Fix double border when SidebarSecondary is used with resizable, and fix RTL text direction in sidebar labels.
  - **SidebarSecondary**: remove the `after:` divider from the resize edge; the sidebar's own `border-e` now changes color via `:has()` on hover/active/focus of the resize handle, eliminating the double border.
  - **SidebarPrimary / SidebarSecondary**: remove `unicode-bidi:plaintext` from menu-item, section-label, header, and collapse-trigger labels so text direction follows the document's RTL/LTR setting correctly.

- [#506](https://github.com/acronis/uikit/pull/506) [`4d82705`](https://github.com/acronis/uikit/commit/4d827051ba97d9744d33b70038ff7c6c73e6de2d) Thanks [@madjorr](https://github.com/madjorr)! - Fix `SidebarPrimaryMenuItem` and `SidebarPrimaryCollapseTrigger` not hiding their `extras` slot in collapsed/rail mode when passed a raw node instead of `SidebarPrimaryMenuItemExtras` — the collapse-aware hiding now lives in the parent, so it applies regardless of what's passed as `extras`.

- [#506](https://github.com/acronis/uikit/pull/506) [`4a39149`](https://github.com/acronis/uikit/commit/4a39149a88e34826ffab0c9b6ccc3a15fad8b33c) Thanks [@madjorr](https://github.com/madjorr)! - Fix `SidebarPrimary` menu labels overflowing instead of truncating with an ellipsis when expanded. Two causes: the label `<span>` was missing `min-w-0` (a prior refactor dropped it, breaking `truncate` inside the flex row), and `SidebarPrimaryContent`'s `ScrollArea` sizes its content to `min-width: fit-content` internally (needed for horizontal-overflow detection), which let any wide row grow past the rail and defeat truncation entirely — now overridden for this vertical-only scroll area.

  `SidebarPrimaryMenuItem` and `SidebarPrimaryCollapseTrigger` labels also show a tooltip with the full text when — and only when — the label is actually clipped; hovering the icon or `extras` never opens it.

- [#506](https://github.com/acronis/uikit/pull/506) [`8d83296`](https://github.com/acronis/uikit/commit/8d83296ca1dcc415f221b6ca4633610dbb8b1a2f) Thanks [@madjorr](https://github.com/madjorr)! - Fix `SidebarPrimary` layout drift from Figma: the first `SidebarPrimarySection` no longer gets an extra top padding/divider (only the last-section-style bottom padding, matching Figma), `SidebarPrimaryFooter` no longer double-pads its rows on top of each item's own padding, and `SidebarPrimaryCollapseTrigger`'s icon now rotates 180° between expanded and collapsed rail states.

  Also fixes `SidebarPrimaryMenuItem` and `SidebarPrimaryCollapseTrigger` rendering their trailing affordance nested inside the label's truncating span instead of as a flex sibling, which cramped the shortcut/tag/external-link extras against the label text. Both now take an explicit `extras` prop (a `SidebarPrimaryMenuItemExtras` element) rendered alongside the label. Also adds Figma Code Connect for the `Section` and `MenuItem` sub-components.

  **Migration:** if you were passing `SidebarPrimaryMenuItemExtras` (or a raw shortcut/tag node) as a second child alongside the label — commonly with the label wrapped in `<span style={{ flex: 1 }}>...</span>` to push the extras to the row's edge — move it to the new `extras` prop and drop the manual flex wrapper:

  ```diff
  -<SidebarPrimaryMenuItem icon={<CircleHelpIcon />}>
  -  <span style={{ flex: 1 }}>Auth layout demo</span>
  -  <SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘H" />
  -</SidebarPrimaryMenuItem>
  +<SidebarPrimaryMenuItem
  +  icon={<CircleHelpIcon />}
  +  extras={<SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘H" />}
  +>
  +  Auth layout demo
  +</SidebarPrimaryMenuItem>
  ```

  The same applies to `SidebarPrimaryCollapseTrigger`. Without this change the extras render inline right after the label instead of right-aligned, since the label+extras wrapper is intentionally not a flex container.

## 0.54.0

### Minor Changes

- [#480](https://github.com/acronis/uikit/pull/480) [`79b5e65`](https://github.com/acronis/uikit/commit/79b5e650d5646097f8a5a971d0f9173ecbdd948f) Thanks [@leonid](https://github.com/leonid)! - Add `ScrollArea` (and `ScrollBar`): a scrollable region with a custom overlay
  scrollbar built on Base UI's Scroll Area. The bar floats over the content and
  reserves no layout space, so full-bleed content is never cropped by a scrollbar
  gutter on any OS/browser; it is hidden at rest and revealed on hover/scroll.
  Supports `orientation` (`vertical` | `horizontal` | `both`). Initial version
  ported from ui-legacy; design reconciliation pending.

### Patch Changes

- [#481](https://github.com/acronis/uikit/pull/481) [`e947aff`](https://github.com/acronis/uikit/commit/e947aff18abbcf28acbb32e377e51ddb19093a56) Thanks [@leonid](https://github.com/leonid)! - SidebarSecondary group headers (`SidebarSecondarySectionLabel`) are now at least
  36px tall with the label vertically centered, matching the Figma spec
  (node 4011-4472).

- [#477](https://github.com/acronis/uikit/pull/477) [`3d6d6dc`](https://github.com/acronis/uikit/commit/3d6d6dcc7c5d2eda19a0823f2a23a7e9737d124d) Thanks [@leonid](https://github.com/leonid)! - SidebarPrimary and SidebarSecondary now scroll their section list inside a
  `ScrollArea`, so the overlay scrollbar floats over the content and reserves no
  gutter — the full-bleed selected row is no longer cropped (on any OS), and the
  bar is revealed on hover/scroll instead of always shown.

## 0.53.0

### Minor Changes

- [#474](https://github.com/acronis/uikit/pull/474) [`609740c`](https://github.com/acronis/uikit/commit/609740cfd31f4f43e4d636efb73be34431bae1ba) Thanks [@leonid](https://github.com/leonid)! - feat(grid): add container-query mode

  Grid gains a `container` prop — columns respond to the grid's own width (container
  queries via a `@container/grid` wrapper) instead of the viewport. Ideal for widget
  grids inside variable-width areas like App Shell main. (DashboardLayout was dropped
  as redundant with Stack + Grid; "dashboard" is now an App Shell + container-Grid
  pattern.)

## 0.52.0

### Minor Changes

- [#469](https://github.com/acronis/uikit/pull/469) [`d7358ca`](https://github.com/acronis/uikit/commit/d7358ca5312722510082d1297d4884d189833267) Thanks [@leonid](https://github.com/leonid)! - feat(app-shell): add AppShell layout scaffold (from Figma)

  The full-page application scaffold — a slot-based layout (AppShell / AppShellSidebar
  / AppShellBody / AppShellHeader / AppShellMain / AppShellFooter) for dropping
  SidebarPrimary / SidebarSecondary / SearchGlobal and page content into. Mapped to
  the App Shell Figma (node 2782-1495) with a COMPLETE Code Connect. Establishes a
  dedicated "Layouts" docs section (App Shell + Stack/Grid/Section) and an App Shell
  composition pattern.

- [#471](https://github.com/acronis/uikit/pull/471) [`7c6eb81`](https://github.com/acronis/uikit/commit/7c6eb81d6dc8d5054cba19153b98d31aad83268d) Thanks [@leonid](https://github.com/leonid)! - feat(auth-layout): add AuthLayout (from Figma)

  A centered-card layout for authentication flows (sign-in / sign-up /
  forgot-password / 2FA) — AuthLayout / AuthLayoutCard / AuthLayoutLogo /
  AuthLayoutFooter. Mapped to the Main-menu-improvements Figma (node 4906-362342)
  with a COMPLETE Code Connect. Token fixes vs legacy: card uses bg-background
  (legacy bg-card is unbridged) + border-border. Joins the Layouts docs section.

- [#467](https://github.com/acronis/uikit/pull/467) [`69c54ae`](https://github.com/acronis/uikit/commit/69c54ae53a89a5e198cb9b1d6098c61048806a94) Thanks [@leonid](https://github.com/leonid)! - feat(stack,grid,section): add layout primitives (ported from ui-legacy)
  - **Stack** — a flexbox primitive (direction / gap / align / justify / wrap).
  - **Grid** — a responsive CSS-grid primitive (cols / gap, stepping down at smaller breakpoints).
  - **Section** — a titled content block (Section / Header / Title / Description / Content).

  Layout-only (no color except Section's muted description). Design reconciliation pending.

- [#470](https://github.com/acronis/uikit/pull/470) [`86422a0`](https://github.com/acronis/uikit/commit/86422a06403be6dffdbaa114eac9a866917b42cf) Thanks [@leonid](https://github.com/leonid)! - feat(page-header,page-content): add Page Header and Page Content layout components
  - **PageHeader** — the page header region (breadcrumb, title row with actions, description),
    mapped to the shadcn-uikit Figma (node 2850-701) with a COMPLETE Code Connect.
  - **PageContent** — the padded gutter for a page body; a <div> that nests inside
    AppShellMain (no duplicate main landmark).

  Both join the Layouts docs section (category: layout). Design reconciliation pending for PageContent.

- [#466](https://github.com/acronis/uikit/pull/466) [`834a3a1`](https://github.com/acronis/uikit/commit/834a3a1279d9a96055bc103ad1510a4b335526f4) Thanks [@leonid](https://github.com/leonid)! - feat(pagination): add Pagination (ported from ui-legacy)

  Navigation for paged content — previous/next controls, numbered page links with an
  aria-current marker, and an ellipsis for skipped ranges. Markup-only; page links
  styled with semantic tokens (foreground numbers, active surface for the current
  page). Use DataTablePagination inside a DataTable. Design reconciliation pending.

- [#465](https://github.com/acronis/uikit/pull/465) [`2933909`](https://github.com/acronis/uikit/commit/2933909fd1b46832e08cc3bf0bb1a907135d43ca) Thanks [@leonid](https://github.com/leonid)! - feat(toggle-group): add ToggleGroup and Toggle (ported from ui-legacy)

  A set of pressable toggle buttons (single/multiple selection) plus a standalone
  Toggle, on Base UI's Toggle / ToggleGroup. Semantic tokens: transparent idle, the
  hover surface on hover, and the active surface + foreground when pressed. Design
  reconciliation pending.

## 0.51.0

### Minor Changes

- [#461](https://github.com/acronis/uikit/pull/461) [`f58b48f`](https://github.com/acronis/uikit/commit/f58b48ff6475da25f0501996ba92fcd68cb86859) Thanks [@leonid](https://github.com/leonid)! - feat(accordion,collapsible): add Accordion and Collapsible (ported from ui-legacy)
  - **Collapsible** — a disclosure primitive (trigger toggles a height-animating
    panel) on Base UI's Collapsible; the primitive behind Accordion and the sidebars.
  - **Accordion** — a vertical set of disclosure sections (header trigger + panel),
    single or `multiple` open, on Base UI's Accordion.

  Design reconciliation pending.

- [#463](https://github.com/acronis/uikit/pull/463) [`c60861f`](https://github.com/acronis/uikit/commit/c60861f5a33d3e145a642a0095cccce5159787e2) Thanks [@leonid](https://github.com/leonid)! - feat(number-field): add NumberField (ported from ui-legacy)

  A numeric input with decrement / increment steppers, min/max/step, and keyboard
  stepping, built on Base UI's NumberField. The field box reuses the --ui-input-text-\*
  token tier so it matches InputBox / InputText; steppers default to minus/plus icons.
  Design reconciliation pending.

- [#462](https://github.com/acronis/uikit/pull/462) [`8ae5750`](https://github.com/acronis/uikit/commit/8ae5750ab5058857b3f3e0c688e25439aff12d91) Thanks [@leonid](https://github.com/leonid)! - feat(slider): add Slider (ported from ui-legacy)

  A slider for choosing a number — or a range (array value, two thumbs) — within a
  min/max by dragging, built on Base UI's Slider. The filled indicator and thumb
  border use the brand action blue (--ui-background-brand-secondary). Design
  reconciliation pending.

## 0.50.0

### Minor Changes

- [#459](https://github.com/acronis/uikit/pull/459) [`12578c5`](https://github.com/acronis/uikit/commit/12578c50b271e8c47961a5493388acfd9149f0e3) Thanks [@leonid](https://github.com/leonid)! - feat(combobox): add Combobox (searchable select on Base UI)

  A real, reusable searchable select built on Base UI's Combobox primitive — a
  typeable input that filters a list of items in a dropdown — replacing the legacy
  hardcoded Popover + cmdk demo. Parts: Combobox / ComboboxInput / ComboboxContent /
  ComboboxList / ComboboxItem / ComboboxEmpty / ComboboxGroup / ComboboxGroupLabel.
  Themed with the existing --ui-input-select-\* tokens so it matches InputSelect.
  Design reconciliation pending.

## 0.49.0

### Minor Changes

- [#457](https://github.com/acronis/uikit/pull/457) [`f89b7aa`](https://github.com/acronis/uikit/commit/f89b7aa88881c02cdb96d8932ed888ad1bf3a5ff) Thanks [@leonid](https://github.com/leonid)! - feat(alert,skeleton): add Alert and Skeleton (ported from ui-legacy)
  - **Alert** — a status banner (`role="alert"`) with seven severity variants
    (info / success / warning / critical / destructive / ai / neutral) and
    composable `AlertIcon` / `AlertContent` / `AlertTitle` / `AlertDescription`
    parts. Each variant maps to the `--ui-*` status tokens.
  - **Skeleton** — a pulsing placeholder box for loading states; shape/size via
    className.

  Design reconciliation pending.

- [#456](https://github.com/acronis/uikit/pull/456) [`f80f3ca`](https://github.com/acronis/uikit/commit/f80f3ca5566b1aec5db7b4a296cb4f4f4ef269e8) Thanks [@leonid](https://github.com/leonid)! - feat(form): add Form (initial version ported from ui-legacy)

  A native `<form>` with consolidated validation, rebuilt on Base UI's Form: it
  collects values by each `Field`'s name, validates on submit (or per
  `validationMode`), surfaces server `errors` keyed by field name, and calls
  `onFormSubmit(values)` when every field is valid. The legacy form wrapped
  react-hook-form; this version drops that dependency and composes the ui-react
  `Field` directly. Design reconciliation pending.

## 0.48.0

### Minor Changes

- [#454](https://github.com/acronis/uikit/pull/454) [`6870a94`](https://github.com/acronis/uikit/commit/6870a9427a20c728bf0e5f32a7e6b2e53a5deb0f) Thanks [@leonid](https://github.com/leonid)! - feat(field): add Field (initial version ported from ui-legacy)

  A form-field wrapper rebuilt on Base UI's Field primitive: `Field` / `FieldLabel`
  / `FieldControl` / `FieldDescription` / `FieldError` auto-wire the
  label↔control↔description↔error associations and validity state, plus structural
  parts (`FieldSet`, `FieldLegend`, `FieldGroup`, `FieldContent`, `FieldTitle`,
  `FieldSeparator`) for composing and grouping fields. Also exports the bare
  `InputBox` primitive (the control you render through `FieldControl`). Design
  reconciliation pending.

## 0.47.0

### Minor Changes

- [#452](https://github.com/acronis/uikit/pull/452) [`ed63db5`](https://github.com/acronis/uikit/commit/ed63db55e7c447ecf3a10d368953f60edf47731a) Thanks [@leonid](https://github.com/leonid)! - feat(chart): add Chart (initial version ported from ui-legacy)

  A theming layer over recharts: `ChartContainer` supplies per-series colors and
  themes recharts' internals with the semantic token vocabulary, plus
  `ChartTooltipContent` / `ChartLegendContent` chrome (and `ChartTooltip` /
  `ChartLegend` re-exports). recharts is externalized from the bundle and resolved
  as a dependency. Design reconciliation pending.

- [#451](https://github.com/acronis/uikit/pull/451) [`080d486`](https://github.com/acronis/uikit/commit/080d486590dcc4a0fcc8d35318245cf0469bf4aa) Thanks [@leonid](https://github.com/leonid)! - feat(data-table): single-click column sorting

  `DataTableColumnHeader` now sorts in a single click. The dropdown menu
  (Asc / Desc / Hide) is replaced by a toggle button whose trailing arrow shows the
  sort state — an up or down arrow in the brand blue when sorted, a muted up/down
  arrow when unsorted — matching the `Table` primitive's sortable header. Column
  hiding remains available via the toolbar's `DataTableViewOptions` menu.

## 0.46.0

### Minor Changes

- [#448](https://github.com/acronis/uikit/pull/448) [`69243eb`](https://github.com/acronis/uikit/commit/69243eb996d891322c04e1dd41d91382cd8fcbbe) Thanks [@leonid](https://github.com/leonid)! - feat(progress-circle): add ProgressCircle — circular/radial progress

  A compact circular progress ring — an SVG arc that fills with `value` and whose
  color tracks the level (danger → critical → warning → success), with an optional
  numeric or icon center. Wraps the Base UI Progress primitive for
  `role="progressbar"` semantics. Sizes `tiny` / `sm` / `md` / `lg`; status
  derived from value (overridable). The sibling of the linear `Progress`, for
  at-a-glance scores in table cells, cards, and widgets. Implements [#446](https://github.com/acronis/uikit/issues/446);
  design-pending v1 on the shared status tokens (no new tier).

## 0.45.0

### Minor Changes

- [#444](https://github.com/acronis/uikit/pull/444) [`a5f4dbf`](https://github.com/acronis/uikit/commit/a5f4dbf4e41c8b2ed3d43feab250943cdd892ce8) Thanks [@leonid](https://github.com/leonid)! - feat(description-list): add DescriptionList — key/value data list

  A composable, semantic `<dl>` for key/value data: rows of label → value, where
  the value can be plain text, a status (leading icon + value + a muted
  description), or action links. Parts: `DescriptionList`, `DescriptionListItem`,
  `DescriptionListLabel`, `DescriptionListValue`, `DescriptionListValueDescription`,
  `DescriptionListActions`. Built from the Cyber-Compliance "Service status" design
  (Figma node 3001-20448, COMPLETE Code Connect); composes the shared semantic
  tokens — no new tier. `SheetDetails` and the `sheet-detail-panel` pattern now
  render their property list through it instead of an ad-hoc grid.

- [#442](https://github.com/acronis/uikit/pull/442) [`53c5207`](https://github.com/acronis/uikit/commit/53c52078797643c0f21e78c497b5e0352999b6f9) Thanks [@leonid](https://github.com/leonid)! - feat(sheet): add the SheetDetails preset (sheet-detail-panel pattern)

  `SheetDetails` is the "easy path that is the pattern" for the sheet-detail-panel
  recipe: a right-anchored Sheet whose header (title + close), body, and optional
  footer are driven by props. The body switches by `contentState` —
  `loading` → Spinner, `empty`/`error` → Empty, else a key/value `properties` list
  or custom children. Composes the existing `Sheet*` parts; reach for those
  directly only for layouts the preset doesn't cover.

## 0.44.0

### Minor Changes

- [#439](https://github.com/acronis/uikit/pull/439) [`4d0e568`](https://github.com/acronis/uikit/commit/4d0e56852c5d51753bb6fcbfcb6797fc51857eab) Thanks [@leonid](https://github.com/leonid)! - feat(sheet): add Sheet (modal side panel) + Details alias

  A modal side panel anchored to a screen edge, built on the Base UI Dialog
  primitive (the same one `Dialog` uses) with a slide transition. Composable parts:
  `Sheet`, `SheetTrigger`, `SheetContent` (with a `side` prop — `top`/`right`/
  `bottom`/`left`, default `right`), `SheetHeader`, `SheetTitle`, `SheetCloseButton`,
  `SheetBody`, `SheetDescription`, `SheetFooter`, `SheetClose`. Design-pending v1
  ported from the legacy library; themed on the shared semantic tokens like the
  Dialog family (no `--ui-sheet-*` tier yet).

  The Vue UI kit called this `Details`, so the full part family is also re-exported
  under `Details*` aliases (`Details`, `DetailsContent`, …) for a 1:1 migration.

## 0.43.1

### Patch Changes

- [#435](https://github.com/acronis/uikit/pull/435) [`3569de6`](https://github.com/acronis/uikit/commit/3569de6a64fae4acdacc5af10d067d0e09b2b977) Thanks [@leonid](https://github.com/leonid)! - refactor(checkbox): center the checkbox box inline (align-middle)

  Move `align-middle` onto the `Checkbox` root so the box stays vertically centered
  whenever it sits inline next to text (it previously defaulted to the text
  baseline and sat high). This replaces the table-scoped
  `[&_[role=checkbox]]:align-middle` rule added in the cell-alignment fix — the
  Table no longer needs it, and any inline checkbox now centers everywhere, not
  just in tables. No visual change to existing baselines (the computed alignment is
  identical; just declared on the component instead of the cell).

- Updated dependencies [[`981200c`](https://github.com/acronis/uikit/commit/981200c12a00ffea797446b2c716aef58db93123)]:
  - @acronis-platform/icons-react@0.5.0

## 0.43.0

### Minor Changes

- [#430](https://github.com/acronis/uikit/pull/430) [`2f4ed53`](https://github.com/acronis/uikit/commit/2f4ed53381a440623a36a93e24ec7d7866f4ec94) Thanks [@leonid](https://github.com/leonid)! - feat(data-table): add striped / bordered / current-row / skeleton flags

  Borrow presentational features from the Vue `AvTable` onto `DataTable`:
  - `striped` — alternating row backgrounds.
  - `bordered` — vertical borders between columns (rows already have horizontal).
  - `highlightCurrentRow` — highlight the row the user last clicked.
  - `skeleton` (+ `skeletonRows`) — placeholder loading rows.

  All reuse the existing `--ui-table-*` tier (current row = the active-row color,
  stripes/skeleton = the secondary surface) — no new tokens. Behavioral features
  (sorting, filtering, selection, expansion, pagination) already come from TanStack;
  selection-driven bulk actions are documented as a new **data-table-bulk-actions**
  usage pattern rather than a monolithic feature-flag prop.

### Patch Changes

- [#432](https://github.com/acronis/uikit/pull/432) [`83820c5`](https://github.com/acronis/uikit/commit/83820c5fb73e1647d5dbccf15b12939bdaba7686) Thanks [@leonid](https://github.com/leonid)! - fix(data-table,table): align header padding + center checkbox/cell contents
  - `DataTableColumnHeader`: the sort button used the legacy `-ml-3`, which (with
    ui-react's 0-padding ghost button) pulled the header label 12px left of the
    body cells. Now `-ml-2 px-2`, so the label sits flush at the same horizontal
    padding as the cells below it.
  - `Table`: cells gave checkboxes the default `baseline` vertical alignment, so
    they sat high relative to the centered text/tags. Header and body cells now
    apply `align-middle` to any `[role=checkbox]`, vertically centering checkboxes
    with the rest of the row content.

## 0.42.0

### Minor Changes

- [#428](https://github.com/acronis/uikit/pull/428) [`eaaba11`](https://github.com/acronis/uikit/commit/eaaba116195e110fc7f30bd78ec63e2424cac7fa) Thanks [@leonid](https://github.com/leonid)! - feat(data-table): add DataTable (TanStack data grid)

  A data grid built on TanStack react-table v8, composed over the Table primitives —
  sorting, filtering, column visibility, row selection, pagination, and optional row
  expansion. Ported from the legacy library. Exports `DataTable` plus the companion
  parts `DataTableColumnHeader`, `DataTableToolbar`, `DataTablePagination`, and
  `DataTableViewOptions` (which operate on a TanStack `table` instance). Adds
  `@tanstack/react-table` as a dependency. Design-pending v1: it reuses the Table
  component's `--ui-table-*` tokens (the wrapper border matches the cell borders)
  and composes the already-themed Button / ButtonIcon / Checkbox / DropdownMenu /
  InputSelect / InputText components.

- [#427](https://github.com/acronis/uikit/pull/427) [`a84fe67`](https://github.com/acronis/uikit/commit/a84fe670c104d0ee14f0f2fe6703368df3f765c5) Thanks [@leonid](https://github.com/leonid)! - feat(toast): add Toast (Toaster + imperative toast API)

  Transient corner-stack notifications. Render one `<Toaster />` near the app root
  and trigger toasts imperatively from anywhere with `toast(title, options)` —
  including `toast.success` / `info` / `warning` / `error` / `loading`,
  `toast.dismiss`, and `toast.promise`. Rebuilt on the Base UI toast manager (no
  Sonner dependency), replacing the legacy `sonner` wrapper. Each toast shows a
  status-colored icon, title, optional description, optional action button, and a
  close button; auto-dismisses after `timeout` (default 5000ms), with `loading`
  toasts persisting until updated or dismissed. Design-pending v1 on semantic
  tokens (no `--ui-toast-*` tier yet). `Toaster` accepts `timeout`, `limit`, and
  `portalContainer`.

## 0.41.0

### Minor Changes

- [#423](https://github.com/acronis/uikit/pull/423) [`fa6d61e`](https://github.com/acronis/uikit/commit/fa6d61ea4b184ba91ab7f3fe228f4c6a7e910ab7) Thanks [@leonid](https://github.com/leonid)! - feat(label,progress,badge): add Label and Progress components, alias Badge to Tag
  - **Label** — a caption for a form control (native `<label>`, small
    medium-weight type, `peer-disabled:` dimming). Design-pending v1 ported from
    the legacy library; inherits `text-foreground` (no `--ui-label-*` tier yet).
  - **Progress** — a determinate/indeterminate progress bar wrapping the Base UI
    Progress primitive. Design-pending v1; track uses `bg-input`, the indicator the
    brand blue (`bg-secondary`), with a sliding `indeterminate-progress` animation
    when `value` is `null`.
  - **Badge** — re-exported as an alias of `Tag`. The generic legacy shadcn Badge
    is replaced by the design-system-native `Tag` (its own `--ui-tag-*` token tier,
    icon slot, and sizes); `import { Badge }` returns `Tag`.

- [#425](https://github.com/acronis/uikit/pull/425) [`93eb023`](https://github.com/acronis/uikit/commit/93eb02326571a95738179f953b890e531248c435) Thanks [@leonid](https://github.com/leonid)! - feat(widget-placeholder): add WidgetPlaceholder component

  A composable empty-state for a dashboard widget — a bordered card with a header
  (icon + title), a centered illustration / message / action, and an optional
  footer. The root takes an `interactive` prop that makes the whole card focusable
  and clickable (hover/active surface tints + a focus ring). Design-pending v1
  ported from the legacy library; themed on semantic tokens (no
  `--ui-widget-placeholder-*` tier yet — the icon/action use the brand action blue,
  the illustration a muted placeholder tone). Parts: `WidgetPlaceholder`,
  `WidgetPlaceholderHeader`, `WidgetPlaceholderIcon`, `WidgetPlaceholderTitle`,
  `WidgetPlaceholderContent`, `WidgetPlaceholderImage`, `WidgetPlaceholderText`,
  `WidgetPlaceholderAction`, `WidgetPlaceholderFooter`.

## 0.40.0

### Minor Changes

- [#421](https://github.com/acronis/uikit/pull/421) [`b9df0c2`](https://github.com/acronis/uikit/commit/b9df0c288100503b6f67fb41b55e76270574c7f7) Thanks [@leonid](https://github.com/leonid)! - Add `Separator` and `Spinner` (initial versions ported from ui-legacy).
  - `Separator` — a 1px divider (`horizontal` / `vertical`) on the Base UI Separator primitive, using the shared `bg-border` token (replacing the legacy `bg-primary/10` hack).
  - `Spinner` — a CSS loading ring (`role="status"`) in four sizes (`sm`/`md`/`lg`/`xl`), defaulting to the brand blue via `currentColor` and overridable with a `text-*` class.

  Both are design-pending until dedicated token tiers exist.

## 0.39.0

### Minor Changes

- [#420](https://github.com/acronis/uikit/pull/420) [`17498f6`](https://github.com/acronis/uikit/commit/17498f6545fe38f6a33c46823cd6bac21ce62bf6) Thanks [@leonid](https://github.com/leonid)! - Add `DropdownMenu` (initial version ported from ui-legacy). A menu of actions on the Base UI Menu primitive, composed from `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`/`DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, and nested `DropdownMenuSub`/`DropdownMenuSubTrigger`/`DropdownMenuSubContent`. Keyboard nav, typeahead, focus management, and dismissal come from Base UI; `DropdownMenuContent` accepts `side`/`align`/`sideOffset` and `portalContainer`. Themed from the shared semantic tokens (surface/highlight/separator/shortcut); enter/exit animations use `tw-animate-css`. Design-pending until a `--ui-menu-*` tier exists.

- [#419](https://github.com/acronis/uikit/pull/419) [`ae5867e`](https://github.com/acronis/uikit/commit/ae5867ee726a9d196582d497abfd948e97ad1336) Thanks [@leonid](https://github.com/leonid)! - Add `Empty` (initial version ported from ui-legacy). A centered empty-state placeholder composed from parts — `Empty`, `EmptyIcon`, `EmptyHeader`, `EmptyTitle`, `EmptyDescription`, `EmptyActions`, `EmptyLinks`. Themed from the shared semantic text tokens (emphasized `text-foreground` title over a muted `text-muted-foreground` description/icon); a `--ui-empty-*` tier is deferred to a Figma pass.

- [#416](https://github.com/acronis/uikit/pull/416) [`6407723`](https://github.com/acronis/uikit/commit/6407723e3ab704f1544beb729a92acbc45658edf) Thanks [@leonid](https://github.com/leonid)! - Add `Popover` (initial version ported from ui-legacy). A floating panel anchored to a trigger — `Popover`, `PopoverTrigger`, `PopoverContent` (+ `PopoverPortal`) — built on the Base UI Popover primitive (positioning, focus management, outside-press / Esc dismissal). `PopoverContent` accepts `side` / `align` / `sideOffset`, `portal`, and `portalContainer` (for isolated-style mounts). Themed from the shared semantic surface tokens (`bg-background` / `text-foreground` / `border-border`); enter/exit animations use `tw-animate-css`. Design-pending until a `--ui-popover-*` tier exists.

- [#415](https://github.com/acronis/uikit/pull/415) [`f95bde5`](https://github.com/acronis/uikit/commit/f95bde5385b60ef7ff4c510bcabc7d4d8b60a4a9) Thanks [@leonid](https://github.com/leonid)! - Add `Tabs` (initial version ported from ui-legacy). A bordered segmented-control tab group — `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` — built on the Base UI Tabs primitive (roving focus, arrow-key navigation, ARIA). Themed from the shared brand tokens: idle triggers are outlined in the `secondary` brand blue (the same blue Button uses), and the active trigger fills with that blue and a pure-white `text-primary-foreground` label. Sorting/selection of content is the consumer's; design-pending until a `--ui-tabs-*` tier exists.

## 0.38.0

### Minor Changes

- [#411](https://github.com/acronis/uikit/pull/411) [`c1adde9`](https://github.com/acronis/uikit/commit/c1adde90beff0f887fd83b2abcf1566a67b4a42c) Thanks [@leonid](https://github.com/leonid)! - Add `Card` (initial version ported from ui-legacy; design reconciliation pending). A composable surface — `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` — built on Base UI `useRender` with a `render` prop on every part. Colors resolve to the shared semantic tokens (`bg-background` / `text-foreground` / `border-border` / `text-muted-foreground`); a `--ui-card-*` tier will be wired in once a Figma reference exists.

- [#412](https://github.com/acronis/uikit/pull/412) [`e2b3335`](https://github.com/acronis/uikit/commit/e2b3335a4e33ba3892f08b63e0d4bad02d682871) Thanks [@leonid](https://github.com/leonid)! - Add `Dialog` (initial version ported from ui-legacy; design reconciliation pending). A modal overlay built on the Base UI Dialog primitive, composed from `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogCloseButton`, `DialogBody`, `DialogDescription`, `DialogFooter`, plus the lower-level `DialogOverlay` / `DialogPortal` / `DialogClose` parts. Focus trap, scroll lock, and `Esc`/outside-press dismissal come from Base UI; `DialogContent` accepts a `size` prop (six widths — `xs`/`sm`/`md`/`lg`/`xl`/`2xl`, 464–1136px, default `sm`) and `portalContainer` for isolated-style mounts. Colors resolve to the shared semantic tokens (overlay/surface/text/border); enter/exit animations use `tw-animate-css` (overlay fade, popup fade + zoom); a `--ui-dialog-*` token tier is deferred to a Figma pass.

- [#413](https://github.com/acronis/uikit/pull/413) [`4e713d4`](https://github.com/acronis/uikit/commit/4e713d46c36aa8de8506e2b18f1357cb288f8fd6) Thanks [@leonid](https://github.com/leonid)! - Add `Table` (initial version ported from ui-legacy, informed by the pre-release Table design). Composable from native table parts — `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` — with **sortable column headers** (`sortable` + `sortDirection` + `onSort`, with a sort icon and `aria-sort`) and a **selectable** `TableRow` (`selected`). Themed by the existing `--ui-table-*` token tier (now imported in ui-react's styles). Sorting/selection logic stays with the consumer; a TanStack-backed `DataTable` over these primitives is a planned follow-up.

- [#412](https://github.com/acronis/uikit/pull/412) [`e2b3335`](https://github.com/acronis/uikit/commit/e2b3335a4e33ba3892f08b63e0d4bad02d682871) Thanks [@leonid](https://github.com/leonid)! - Add `tw-animate-css` to ui-react's stylesheet, enabling enter/exit animation utilities (`animate-in` / `animate-out` / `fade-*` / `zoom-*` / `slide-*`) — the same library the legacy package uses. Components wrapping Base UI primitives can now animate against the `data-[open]` / `data-[closed]` state attributes (e.g. `Dialog`'s overlay fade and popup fade + zoom). VR-safe: the visual-regression runner screenshots with animations disabled, so baselines capture the settled end state.

## 0.37.0

### Minor Changes

- [#407](https://github.com/acronis/uikit/pull/407) [`2239301`](https://github.com/acronis/uikit/commit/2239301d72ed2aa3f08ab95b4c851207f8a3d48d) Thanks [@leonid](https://github.com/leonid)! - **Breaking:** `Input` and `Search` are now aliases of the full field components
  `InputText` and `InputSearch`. Previously they were the bare input/search boxes.

  The bare boxes are now internal primitives (`InputBox` / `SearchBox`) consumed by
  the field components and are no longer exported. Consumers that used `Input` /
  `Search` as a plain control now get the labelled field (a wrapping element, with
  optional label/clear/error furniture). To keep a bare control, compose the field
  without a `label`, or migrate to `InputText` / `InputSearch` directly (same
  components). `InputProps` / `SearchProps` now alias `InputTextProps` /
  `InputSearchProps`.

- [#408](https://github.com/acronis/uikit/pull/408) [`cda0168`](https://github.com/acronis/uikit/commit/cda016837931ae927b114b7474b035935bb83c16) Thanks [@leonid](https://github.com/leonid)! - Add a `Textarea` alias (and `TextareaProps`) for `InputTextArea`, mirroring the
  `Input` / `Search` aliases of `InputText` / `InputSearch`. `InputTextArea`
  remains the canonical export; `Textarea` is an additional name for discovery.

## 0.36.0

### Minor Changes

- [#404](https://github.com/acronis/uikit/pull/404) [`9c7bffb`](https://github.com/acronis/uikit/commit/9c7bffb1ef8edba94e5de8e69bda281218fcbe5f) Thanks [@leonid](https://github.com/leonid)! - Add `Chip`: a compact interactive label with two variants — `removable` (a
  trailing × remove button that emits `onRemove`) and `selectable` (a toggle that
  shows the active style when `selected`, exposed as `role="button"` +
  `aria-pressed`). Supports an optional leading icon and is themed by the
  `--ui-chips-*` token tier.

### Patch Changes

- Updated dependencies [[`c686666`](https://github.com/acronis/uikit/commit/c686666ff880d8adc647c7c5b47c3b01bce2c88d)]:
  - @acronis-platform/tokens-pd@1.9.0

## 0.35.1

### Patch Changes

- [#398](https://github.com/acronis/uikit/pull/398) [`d9dfac1`](https://github.com/acronis/uikit/commit/d9dfac1b0e4a2ef4fe229aaa17648c5604ec637f) Thanks [@leonid](https://github.com/leonid)! - Declare `"sideEffects": ["**/*.css"]` in package.json. This lets bundlers
  tree-shake unused component modules (the JS is side-effect-free) while still
  preserving the stylesheet entry (`@acronis-platform/ui-react/styles`), which
  must not be dropped. Consumers importing a subset of components now get a
  smaller bundle with no configuration.

## 0.35.0

### Minor Changes

- [#396](https://github.com/acronis/uikit/pull/396) [`051f91c`](https://github.com/acronis/uikit/commit/051f91ce89129acc1e572925a152637477f82b1e) Thanks [@leonid](https://github.com/leonid)! - Add an optional `portalContainer` prop to `InputSelectContent` (mirroring
  `TooltipContent`). It forwards to the underlying Base UI `Select.Portal`'s
  `container`, so the dropdown can be portaled into a scoped root (e.g. a shadow
  root) and inherit styles defined there instead of always mounting on
  `document.body`.

## 0.34.0

### Minor Changes

- [#394](https://github.com/acronis/uikit/pull/394) [`071934c`](https://github.com/acronis/uikit/commit/071934c11ac0b9dc100a7190ae9b008944a03dac) Thanks [@leonid](https://github.com/leonid)! - Fix `SidebarPrimaryMenuItem` / `SidebarSecondaryMenuItem` trailing-extras layout: tags, shortcuts, and external-link icons passed as children are now split from the label and pinned to the right edge of the row (`shrink-0`), while the title takes the remaining width and truncates with an ellipsis (`min-w-0`). Previously the extras flowed inline after the label, so a long title pushed them off the row instead of truncating.

  Fix the `SidebarSecondary` collapsed rail: the breadcrumb labels now read vertically (`writing-mode: vertical-rl`, separator chevron turned to point down) so they run down the ~48px rail instead of clipping into single letters, and `SidebarSecondaryHeader` is hidden when collapsed (the breadcrumb's parent label carries the section context), matching the Figma collapsed design. The footer is now pinned to the bottom of the rail in the collapsed state, and `SidebarSecondaryCollapseTrigger`'s chevron auto-flips 180° when collapsed so a chevron-left ("collapse") becomes a chevron-right ("expand").

  Add an optional `shortcut` prop to `SidebarSecondaryCollapseTrigger` — a right-aligned keyboard-shortcut hint (e.g. `⌘J`) that is hidden alongside the label in the collapsed rail.

## 0.33.1

### Patch Changes

- [#389](https://github.com/acronis/uikit/pull/389) [`f4ed1f8`](https://github.com/acronis/uikit/commit/f4ed1f83e587ed103a8135dc63ff08fdfd54ca92) Thanks [@leonid](https://github.com/leonid)! - Fix `SidebarPrimaryMenuItem` / `SidebarSecondaryMenuItem` trailing-extras layout: tags, shortcuts, and external-link icons passed as children are now split from the label and pinned to the right edge of the row (`shrink-0`), while the title takes the remaining width and truncates with an ellipsis (`min-w-0`). Previously the extras flowed inline after the label, so a long title pushed them off the row instead of truncating.

## 0.33.0

### Minor Changes

- [#382](https://github.com/acronis/uikit/pull/382) [`18d39e4`](https://github.com/acronis/uikit/commit/18d39e434605bac39ad484b66d691b227e6d701c) Thanks [@leonid](https://github.com/leonid)! - Add `Link`: an inline text link (semibold) that underlines on hover, with an optional trailing external-link icon (`external`). Polymorphic via Base UI `useRender` (`render` prop) to render a router link instead of the default `<a>`; `disabled` makes it inert (disabled color, removed from the tab order, no navigation). Themed by the `--ui-link-*` tier (text color / text decoration / external-icon color per state) + a 3px `--ui-focus-primary` focus ring.

## 0.32.0

### Minor Changes

- [#380](https://github.com/acronis/uikit/pull/380) [`71c5b42`](https://github.com/acronis/uikit/commit/71c5b4220b768d2aba7ec547d1f1a3b32f544701) Thanks [@leonid](https://github.com/leonid)! - Add `InputDatePicker`: the date-field trigger — a button box that displays a formatted date (or a `start – end` range via `pickerType="dateRange"`) and a trailing calendar icon, with the field furniture (`label` + required `*`, `description` / `error`). The box border is wired per state (idle / hover / open / focus + ring / disabled), and `error` (or `aria-invalid`) switches to the error border + `--ui-focus-error` ring. Themed by the `--ui-input-date-picker-*` tier. Scope is the trigger only — the consumer formats dates and wires their own calendar popup to `open` / `onClick` (the calendar is not designed/tokenized yet).

## 0.31.0

### Minor Changes

- [#377](https://github.com/acronis/uikit/pull/377) [`734775c`](https://github.com/acronis/uikit/commit/734775caa5befeb382a3cde3c74ef1b30099070b) Thanks [@leonid](https://github.com/leonid)! - `InputTextArea`: expand into a full field and link it to Figma. It now renders the field furniture — an optional `label` (with an optional required `*`), and an optional `description` or `error` message below the textarea — mirroring `InputText`. Passing `error` switches the field to its error treatment, and the error state now paints the red `--ui-input-text-area-error-msg-box-border-color-*` border (previously only the focus ring changed). `ref` and `className` still target the underlying `<textarea>`, so the bare usage (`<InputTextArea placeholder=… />`) is unchanged. Adds the Figma Code Connect mapping (node 2797-2876).

## 0.30.0

### Minor Changes

- [#374](https://github.com/acronis/uikit/pull/374) [`3289f94`](https://github.com/acronis/uikit/commit/3289f9439dbc61506fefda1e90d7770454f1fb1b) Thanks [@leonid](https://github.com/leonid)! - Add `InputSelect`: the next-gen select field, composing Base UI `Select` and the `--ui-input-select-*` token tier. It ships the full field furniture (`InputSelectField`/`InputSelectLabel` with required marker/`InputSelectDescription`/`InputSelectError`), the themed trigger (`InputSelectTrigger`/`InputSelectValue` with an `aria-invalid` error treatment), and the dropdown machinery (`InputSelectContent`, in-dropdown `InputSelectSearch`, `InputSelectSection`/`InputSelectSectionLabel`, single + multiple `InputSelectItem`, and `InputSelectStatus` for loading/empty/error).

  `Select` is now an alias of the `InputSelect*` parts — this re-points it off the deleted `--ui-form-*` tier (which left it rendering with unresolved colors) onto `--ui-input-select-*`, resolving [#333](https://github.com/acronis/uikit/issues/333). The composable `Select*` API is unchanged.

## 0.29.0

### Minor Changes

- [#367](https://github.com/acronis/uikit/pull/367) [`837f174`](https://github.com/acronis/uikit/commit/837f1747fa83edc7bdf02f3fc1b0e716f0ecbbb5) Thanks [@leonid](https://github.com/leonid)! - Add `InputSearch`: a full search field that composes the bare `Search` box and adds an optional label (with an optional required marker) above it. The label is associated via `htmlFor`/`id` and clears `Search`'s default `aria-label` so it doesn't shadow the visible label; all other props (`placeholder`, `value`, `disabled`, `onClear`, …) pass through to `Search`. Themed by the `--ui-input-search-*` token tier.

## 0.28.0

### Minor Changes

- [#361](https://github.com/acronis/uikit/pull/361) [`c62ec0a`](https://github.com/acronis/uikit/commit/c62ec0a8c8b5516e00f413a96ec10883b5706c7e) Thanks [@leonid](https://github.com/leonid)! - Add `InputText`: a full single-line text field built around the bare `Input`
  primitive — an optional `label` (with an optional `required` marker), the input
  box, an optional clear (✕) button (`clearable` + `onClear`), and an optional
  `description` or `error` message. Passing `error` switches the field to its error
  treatment (red box border via `aria-invalid` + red message). Label/description/error
  are wired with `htmlFor`/`aria-describedby`/`aria-required` for accessibility, and
  all colors come from the `--ui-input-text-*` token tier.

## 0.27.0

### Minor Changes

- [#359](https://github.com/acronis/uikit/pull/359) [`dff869e`](https://github.com/acronis/uikit/commit/dff869e61e6a03a2d68687be08f44be9d74aa1e0) Thanks [@leonid](https://github.com/leonid)! - Add `CardFilter`: a compact stat/filter card — a caption `label` above a prominent
  `value`, with an optional leading `icon`. Three variants: `static` (presentational),
  `static-empty` (placeholder with an em-dash, no icon), and `clickable` (renders an
  interactive `<button>` with hover / active / focus states and a link-colored value).
  Themed entirely by the `--ui-card-filter-*` tokens; focus is a 3px `--ui-focus-primary`
  ring flush to the edge. Supports Base UI `render`-prop composition (e.g. render a
  clickable filter as a link).

## 0.26.0

### Minor Changes

- [#357](https://github.com/acronis/uikit/pull/357) [`a79abf1`](https://github.com/acronis/uikit/commit/a79abf17387b6e43fb2fd67fab5601c9a590411a) Thanks [@leonid](https://github.com/leonid)! - **Breaking:** rename `ButtonDropdown` → `ButtonMenu` to match the Figma component
  set (named "ButtonMenu") and its `--ui-button-menu-*` token tier. The exports
  `ButtonDropdown`, `ButtonDropdownProps`, and `buttonDropdownVariants` are now
  `ButtonMenu`, `ButtonMenuProps`, and `buttonMenuVariants`; update imports
  accordingly. The API (props, variants, behavior) is otherwise unchanged.

  Also fixes the focus ring to match the current Figma design — was a 2px
  `--ui-focus-brand` ring with a 2px offset; now a 3px `--ui-focus-primary` ring
  flush to the button edge (no offset), matching `Button` and `ButtonIcon`.

## 0.25.2

### Patch Changes

- [#355](https://github.com/acronis/uikit/pull/355) [`20ebf63`](https://github.com/acronis/uikit/commit/20ebf63008ed3b64afc10a71470436f1df4866b6) Thanks [@leonid](https://github.com/leonid)! - `ButtonIcon`: fix the focus ring to match the Figma design — was a 2px
  `--ui-focus-brand` ring with a 2px offset; now a 3px `--ui-focus-primary` ring
  flush to the button edge (no offset), matching the Figma focus state (same fix as
  `Button`). Also drops the blanket transparent `border` so only the `secondary`
  variant draws one (the Figma `ghost` has no border); the centered icon's geometry
  is unchanged.

## 0.25.1

### Patch Changes

- [#353](https://github.com/acronis/uikit/pull/353) [`5b430b1`](https://github.com/acronis/uikit/commit/5b430b17123176c1d279aaaaff6e69d9f2c778b8) Thanks [@leonid](https://github.com/leonid)! - `Button`: fix the focus ring and horizontal padding to match the Figma design.
  - **Focus ring**: was a 2px `--ui-focus-brand` ring with a 2px offset; now a 3px
    `--ui-focus-primary` ring flush to the button edge (no offset), matching the
    Figma focus state.
  - **Horizontal padding**: the blanket transparent `border` was insetting the
    content of borderless variants (primary / ghost / destructive / ai) by 1px, so
    their effective padding was 13px instead of the design's 12px. The 1px border is
    now applied only to the variants that actually have one (`secondary` /
    `inverted`), so every variant's `px` matches the design.

## 0.25.0

### Minor Changes

- [#350](https://github.com/acronis/uikit/pull/350) [`d9d19a7`](https://github.com/acronis/uikit/commit/d9d19a7ed8bda545a801d5dbe494df6185529eee) Thanks [@leonid](https://github.com/leonid)! - `SidebarSecondary`: add **expandable sections**. `SidebarSecondarySection` gains
  an `expandable` prop (plus `open` / `defaultOpen` / `onOpenChange`) that turns the
  section into a Base UI Collapsible — the `SidebarSecondarySectionLabel` becomes a
  chevron toggle and the `SidebarSecondaryMenu` its collapsible panel. The label
  also accepts an `actions` slot (e.g. a ghost `ButtonIcon`, kept outside the toggle)
  and an `unreadRollup` badge shown only while the section is collapsed. Item-level
  submenus (`SidebarSecondaryMenuSub`) nest inside expandable sections. Static
  sections are unchanged.

## 0.24.0

### Minor Changes

- [#346](https://github.com/acronis/uikit/pull/346) [`769a142`](https://github.com/acronis/uikit/commit/769a142e1ebe20e60207eac43d3407f0068a18c3) Thanks [@leonid](https://github.com/leonid)! - Add `SearchGlobal`: a prominent global "search anything" field — a 48px pill with
  a gradient brand border (`--ui-search-global-*` token tier), a leading magnifier,
  a borderless search input, and a decorative trailing keyboard-shortcut hint (`⌘K`,
  hideable via `shortcut={null}`). Border swaps idle/hover/active gradients and shows
  a `--ui-focus-primary` ring on focus; forwards a ref to the input for shortcut
  wiring.

## 0.23.0

### Minor Changes

- [#344](https://github.com/acronis/uikit/pull/344) [`01a4ae9`](https://github.com/acronis/uikit/commit/01a4ae9da2b0623a844509e0700a7afdb62ea8d1) Thanks [@leonid](https://github.com/leonid)! - Add `Resizable`: a panel-group component (`ResizablePanelGroup` / `ResizablePanel`
  / `ResizableHandle`) wrapping `react-resizable-panels`, themed with the
  `--ui-resizable-*` token tier. The handle is a draggable divider with an optional
  grab-bar grip (`withHandle`); supports horizontal and vertical orientation,
  min/max sizes, collapsible and nested panels. Keyboard-resizable, with the handle
  exposed as an ARIA `separator`.

## 0.22.3

### Patch Changes

- Updated dependencies [[`0492758`](https://github.com/acronis/uikit/commit/04927588678c058275a3911579a476b73eba12bf)]:
  - @acronis-platform/tokens-pd@1.8.1

## 0.22.2

### Patch Changes

- Updated dependencies [[`62e2a0d`](https://github.com/acronis/uikit/commit/62e2a0df33293b5efd946af2e68ad38757964e69)]:
  - @acronis-platform/tokens-pd@1.8.0

## 0.22.1

### Patch Changes

- [#338](https://github.com/acronis/uikit/pull/338) [`6ac0cc9`](https://github.com/acronis/uikit/commit/6ac0cc9f7ca1af368be43e8e87912513d495f123) Thanks [@leonid](https://github.com/leonid)! - Storybook dev experience: add brand (acronis / deep-sky), light/dark,
  direction (auto / ltr / rtl), and locale toolbars driven by the tokens-pd
  delivery model (`[data-theme]` + `color-scheme` for dark mode, injected
  override CSS for brand), enrich every hand-authored story's `argTypes` with
  full controls + descriptions, and add a demo-only i18n message catalog so the
  locale toolbar can render localized (and RTL) sample content. Also adds the
  conventional `vite/client` type reference the package was missing. No change to
  the published component API.

## 0.22.0

### Minor Changes

- [#334](https://github.com/acronis/uikit/pull/334) [`fc1cb92`](https://github.com/acronis/uikit/commit/fc1cb92d406186b3a422c2a2ef3118f9631c7c73) Thanks [@leonid](https://github.com/leonid)! - Add `Avatar`: a circular user/entity badge showing an image or initials, in five
  color schemes (`teal` / `violet` / `red` / `yellow` / `orange`), themed by the
  `--ui-avatar-*` token tier. Ships `Avatar`, `AvatarImage`, `AvatarFallback`
  (Base UI Avatar under the hood), and `AvatarGroup` for an overlapping row.

### Patch Changes

- Updated dependencies [[`fc1cb92`](https://github.com/acronis/uikit/commit/fc1cb92d406186b3a422c2a2ef3118f9631c7c73)]:
  - @acronis-platform/tokens-pd@1.7.0

## 0.21.2

### Patch Changes

- Updated dependencies [[`878689b`](https://github.com/acronis/uikit/commit/878689b7fe7d62ba297381857249fe1e9c4cef88)]:
  - @acronis-platform/tokens-pd@1.6.0

## 0.21.1

### Patch Changes

- Updated dependencies [[`0d66857`](https://github.com/acronis/uikit/commit/0d66857127ac07df5ae5cbe95fbad6c7bc81e76d)]:
  - @acronis-platform/tokens-pd@1.5.0

## 0.21.0

### Minor Changes

- [#314](https://github.com/acronis/uikit/pull/314) [`360d80e`](https://github.com/acronis/uikit/commit/360d80efc543e9d4b1c1e4b8bd5b4d52312175cb) Thanks [@leonid](https://github.com/leonid)! - Rewire components to the next-gen token tiers shipped by the Figma sync and add a
  multiline text-area.

  ### Fixed — components were binding to `--ui-*` variables that no longer exist
  - **Radio** — rewired from the legacy `--ui-form-*` tier (never shipped) to the
    dedicated `--ui-radio-*` tier, with each box/icon state wired to its own token
    (mirrors Checkbox).
  - **Search** — rewired from `--ui-form-*` to `--ui-input-search-*`.
  - **Input** — remapped from the old `--ui-input-{global,normal,content,error}-*`
    names to `--ui-input-text-*` (incl. `content-value` → `global-value-color`,
    `content-placeholder` → `global-placeholder-color`, `error-*` → `error-msg-*`).
  - **SidebarSecondary** — re-themed for the redesigned tier: the per-state
    menu-item icon/label colors collapsed to single `…-color-color` tokens,
    `container-height` → `container-height-min`, section-header padding renamed; the
    removed inter-section divider and dedicated level-2 indent tokens are dropped
    (the level-2 indent is now derived from surviving tokens).

  `Radio` and `InputSearch` token tiers are now imported in `src/styles/index.css`
  so their custom properties resolve.

  ### Added
  - **InputTextArea** — new multiline text-area component themed by the
    `--ui-input-text-area-*` tier.

  ### Known gap
  - **Select** still binds to the legacy `--ui-form-*` tier; `tokens-pd` ships no
    `--ui-select-*` tier yet, so it is left stranded and documented in-source until
    those tokens land.

## 0.20.1

### Patch Changes

- Updated dependencies [[`6d9bf1a`](https://github.com/acronis/uikit/commit/6d9bf1ae0ca447ae7ed5ee6d1e91b776edff6bde)]:
  - @acronis-platform/tokens-pd@1.4.0

## 0.20.0

### Minor Changes

- [#300](https://github.com/acronis/uikit/pull/300) [`7782af7`](https://github.com/acronis/uikit/commit/7782af7c4ea61728edc65b6c2d6d3b19e720ec63) Thanks [@leonid](https://github.com/leonid)! - Add `ButtonDropdown`: a button that opens a dropdown menu — a label followed by a
  chevron that flips up while `open`. Two variants (`primary` solid / `secondary`
  bordered) across idle, hover, open, and disabled states, wired to the
  `--ui-button-dropdown-*` tokens. The `open` prop drives the chevron direction,
  the open (`*-active`) treatment, and `aria-expanded`; compose it with a menu
  trigger via the `render` prop.

### Patch Changes

- Updated dependencies [[`7782af7`](https://github.com/acronis/uikit/commit/7782af7c4ea61728edc65b6c2d6d3b19e720ec63)]:
  - @acronis-platform/tokens-pd@1.3.0

## 0.19.0

### Minor Changes

- [#305](https://github.com/acronis/uikit/pull/305) [`431b331`](https://github.com/acronis/uikit/commit/431b3317636131fd85a24b5fb7501986529767ce) Thanks [@leonid](https://github.com/leonid)! - `Tag`: migrate to the dedicated `--ui-tag-*` component tier and add an `ai`
  variant. Each variant now wires its container fill, border, label, and icon to
  `--ui-tag-<variant>-*` (previously the shared `--ui-background-status-*` /
  `--ui-border-on-status-*` / `--ui-text-on-status-*` semantic tokens), and
  geometry (radius, border width, gap, padding, max/min width, heights, icon size)
  comes from `--ui-tag-global-*`. The new `ai` variant paints a gradient border
  over a tinted fill. `size` now only changes the height; padding is uniform.

## 0.18.0

### Minor Changes

- [#303](https://github.com/acronis/uikit/pull/303) [`53fe8ef`](https://github.com/acronis/uikit/commit/53fe8ef946f4486bad3bea68551d13a81d96dcbf) Thanks [@leonid](https://github.com/leonid)! - Re-theme `Switch` against the next-gen tokens and add an optional `label`.
  - Fixed dead token refs: the track and thumb fills referenced
    `--ui-switch-{off,on}-box-{state}` / `--ui-switch-global-tick-{state}`, which
    were renamed to `*-box-color-{state}` / `*-tick-color-{state}` — so the track
    and thumb silently fell back to inherited colors. Now wired to the current
    `--ui-switch-*` tokens.
  - Added an optional `label` prop. When provided, the toggle and its label
    compose a clickable `<label>` row (wired via aria-labelledby) using
    `--ui-switch-global-{container-gap,label-color}`. With no label, the bare
    toggle renders as before — name it with `aria-label`.
  - Corrected Code Connect to the real Figma props (variant/state/label).

## 0.17.0

### Minor Changes

- [#301](https://github.com/acronis/uikit/pull/301) [`9a20554`](https://github.com/acronis/uikit/commit/9a205544dea2f16a3091828d2955d0175d6e2917) Thanks [@leonid](https://github.com/leonid)! - Re-theme `Checkbox` against the next-gen tokens and grow it into the full Figma
  field.
  - Fixed dead token refs: the box fill and glyph referenced `--ui-checkbox-*-box-{state}`
    / `--ui-checkbox-*-icon-{state}`, which were renamed to `*-box-color-{state}` /
    `*-icon-color-{state}` — so fills and glyphs silently fell back to inherited
    colors. Every state (unchecked / checked / indeterminate × idle / hover / active
    / disabled) is now wired to its current `--ui-checkbox-*` token.
  - Added optional `label` and `description` props. When provided, the box, label,
    and description compose a clickable `<label>` row (wired via aria-labelledby /
    aria-describedby) using the `--ui-checkbox-global-{label,description,container}-*`
    tokens. With neither, the bare box renders as before — name it with `aria-label`.

## 0.16.4

### Patch Changes

- [#294](https://github.com/acronis/uikit/pull/294) [`2acfc52`](https://github.com/acronis/uikit/commit/2acfc52d686114c9a97a560b8ce4db4b393f64d5) Thanks [@leonid](https://github.com/leonid)! - Fix `Button` colors: wire every variant's container fill, label, and icon to the
  renamed `--ui-button-*-color-*` tokens (the next-gen token sync added a `-color-`
  segment — e.g. `--ui-button-primary-container-idle` → `…-container-color-idle`).
  The component still referenced the old names, which no longer exist in
  `@acronis-platform/tokens-pd`, so every variant rendered with no fill/text color.
  Border, geometry, and padding tokens were already correct and are unchanged.

## 0.16.3

### Patch Changes

- [#296](https://github.com/acronis/uikit/pull/296) [`77b1c3c`](https://github.com/acronis/uikit/commit/77b1c3c7110d58dbb5850f84b17bc4f508f32e38) Thanks [@leonid](https://github.com/leonid)! - Re-theme `ButtonIcon` against the next-gen Figma tokens. The component referenced
  renamed color tokens (`--ui-button-icon-global-container-idle` →
  `…-container-color-idle`, same for the icon color) that no longer existed, so
  fills and glyph colors silently fell back to inherited values. Each state is now
  wired to its current `--ui-button-icon-global-*` token.

  Adds a `variant` prop: `ghost` (borderless, the default — unchanged from the
  previous look) and `secondary` (a 1px container border from the
  `--ui-button-icon-secondary-container-border-color-*` tokens).

## 0.16.2

### Patch Changes

- Updated dependencies [[`cfd9945`](https://github.com/acronis/uikit/commit/cfd99452a21786ebdaa54e1138f231579895ad27)]:
  - @acronis-platform/tokens-pd@1.2.1

## 0.16.1

### Patch Changes

- [#289](https://github.com/acronis/uikit/pull/289) [`2488240`](https://github.com/acronis/uikit/commit/2488240bd78243d59626e45a958a34d86ef70757) Thanks [@leonid](https://github.com/leonid)! - Fix `Breadcrumb` link colors: wire link/ellipsis text to the renamed
  `--ui-breadcrumb-link-label-color-{idle,hover,active}` tokens (previously
  referenced the stale `--ui-breadcrumb-link-label-{idle,hover,active}` names,
  which no longer exist in `@acronis-platform/tokens-pd`, so links rendered with
  no color).

## 0.16.0

### Minor Changes

- [#283](https://github.com/acronis/uikit/pull/283) [`31cc6e7`](https://github.com/acronis/uikit/commit/31cc6e73168df4cd792e460b64eea17d60f83944) Thanks [@leonid](https://github.com/leonid)! - Add `SidebarPrimary` and `SidebarSecondary` — composable, next-gen sidebar
  components themed by the `--ui-sidebar-primary-*` / `--ui-sidebar-secondary-*`
  token tiers.

  Both are multi-part component families (mirroring the `Breadcrumb` pattern) with
  an `expanded` / `collapsed` model exposed as a controlled **and** uncontrolled
  prop (`expanded` / `defaultExpanded` / `onExpandedChange`), driven by a dedicated
  `…CollapseTrigger` part (the Figma "Collapse menu" affordance). The rail reflows
  width/padding/logo between states via the per-state metric tokens; collapsed-mode
  labels stay in the DOM as `sr-only` so icon-only rows keep an accessible name.
  - **`SidebarPrimary`** — `SidebarPrimary`, `…Header`, `…Content`, `…Footer`,
    `…Section`, `…Menu`, `…MenuItem` (cva `variant: selected | unselected`,
    recoloring container + icon + label per state), `…MenuItemExtras` (shortcut +
    external-link icon), `…CollapseTrigger`.
  - **`SidebarSecondary`** — adds a `…CollapsedBreadcrumb` (shown in rail mode),
    a `…SectionLabel`, and an expandable disclosure group (`…MenuSub` /
    `…MenuSubTrigger` / `…MenuSubContent` / `…MenuSubItem`) built on the Base UI
    `Collapsible` primitive, with a Level-2 indent. Its menu-item cva swaps only the
    container fill; icon/label use the shared global state tokens.

  Polymorphic link parts use Base UI `useRender` + `mergeProps` (no Radix
  `asChild`). Tokens-only (no hardcoded colors); the focus ring reuses
  `--ui-focus-brand`. `ui-react/styles` imports the two new
  `@acronis-platform/tokens-pd/css/Sidebar{Primary,Secondary}/acronis.css` tiers.
  Includes unit tests, Storybook stories (+ generated state stories), Figma Code
  Connect, ui-spec specs, and Docker visual-regression baselines.

## 0.15.4

### Patch Changes

- Updated dependencies [[`4e13963`](https://github.com/acronis/uikit/commit/4e139630719ebb51eedc99494b351aa657a75c78), [`4e13963`](https://github.com/acronis/uikit/commit/4e139630719ebb51eedc99494b351aa657a75c78)]:
  - @acronis-platform/tokens-pd@1.2.0

## 0.15.3

### Patch Changes

- [#273](https://github.com/acronis/uikit/pull/273) [`1ef2702`](https://github.com/acronis/uikit/commit/1ef27023038cbc4194dac666b4f020e105670b91) Thanks [@leonid](https://github.com/leonid)! - Refresh design tokens from Figma and migrate the component tier to the next-gen Figma component architecture.

  **Primitives / semantic (breaking, pre-1.0):** rename semantic `status-inverted.*` → `status-strong.*`, `inverted-surface.*` → `inverted.*`, and `border.on-status.*-dark` → `*-strong`. Add the `ink` palette, `units.size-20`, a `transparent.clear` stop, semantic `glyph.on-status.ai`, the `status-strong` background family, `background.status.ai{,-hover,-pressed}`, `background.brand.primary-focus`, and `typography.link.default` / `link.default-underline`. The `brand-b` mode is removed (its values were dropped upstream in Figma); `tokens-pd` no longer emits `brand-b.css` / `brand-b` presets.

  **Component tier (breaking, pre-1.0):** the component tokens now source the next-gen `brand.components` Figma tier instead of the retired `componentLegacy` group. Components emitted: `breadcrumb`, `button`, `button-icon`, `checkbox`, `input`, `menu-item`, `sidebar-primary`, `sidebar-secondary`, `switch`, `tag`, `tooltip` (plus `icon` / `tree`, retained from legacy — no next-gen equivalent yet). This replaces the previous `chip` / `form` / `sidebar` / `item` components.

  Naming follows the next-gen contract ("Option A — faithful"): PascalCase component → kebab (`ButtonIcon` → `button-icon`), camelCase leaf → kebab (`borderRadius` → `border-radius`, `paddingX` → `padding-x`), `_global` → `global`, and the redundant `color` property word is dropped for color tokens only (`Button/ai/container/color/idle` → `--ui-button-ai-container-idle`; compound names like `borderColor` keep their suffix → `border-color`). The token shape is deeply nested: `<component>-<variant|global>-<role>-<property>[-<state>]`.

  The `colors.background.ai.*` gradients keep their intended **horizontal** (`90deg`) orientation; component AI references (`button.ai.*`, `tag.ai.*`) resolve to them via an alias rewrite (`{semantics.gradients.ai.*}` → `colors.background.ai.*`). `textStyle` literals resolve to `typography.*`.

  **Known gaps (warned, not fatal):** 8 `$type:string` component tokens are skipped because the token schema has no `string` type — `Button.*.container.borderStyle` (`"solid"`), `Switch._global.box.borderStyle`, and `Button.ghost.label.textDecoration.*` (`"underline"`/`"none"`); consumers hard-code these for now. Fully-transparent `#FF00FF00` stops inline as `rgb(255 0 255 / 0)` (hue irrelevant at alpha 0).

  Regenerated all `tokens-pd` artifacts (CSS, DTCG, Tailwind presets). The Tailwind preset builder skips unroutable component-tier color/gradient tokens with a warning instead of failing the build (semantic tokens still must route), so deeply-nested component roles (`box`, `tick`, `container`) stay in the CSS/tiers — consumers bind `var(--ui-*)` directly — but are omitted from the Tailwind preset.

  `ui-react`: re-theme the `Switch` and `Tooltip` components to the next-gen token names. `Tooltip` moves to `--ui-tooltip-container-border-radius`. `Switch` moves to the new `box`/`tick` model — track fill wired per checked-state (`--ui-switch-off-box-idle` / `--ui-switch-on-box-idle`, green), disabled to `--ui-switch-{on,off}-box-disabled` + `--ui-switch-global-tick-disabled` with a 1px inset `--ui-switch-global-box-border-color-disabled` border; the thumb is the single `--ui-switch-global-tick-*` color regardless of on/off (hover/active stops equal idle, so no hover color change). `ui-react/styles` swaps its dead `css/form` import for `css/input` + `css/checkbox` and adds `css/button-icon`.

  `ui-react` (continued): re-theme `Button`, `ButtonIcon`, `Breadcrumb`, `Checkbox`, and `Input` to the next-gen component tokens — they previously referenced dead token names (the retired `componentLegacy` / `--ui-form-*` tiers) and rendered unstyled. `Button` maps `background` → `container`, keeps `label`, adds per-state `icon` colors, and now only `secondary` / `inverted` carry a container border (others are borderless); geometry is tokenized via `--ui-button-global-container-*` and per-variant `padding-x` / `width-min` (`ghost` has 0 padding-x and no min-width). `ButtonIcon` moves to the borderless `--ui-button-icon-global-*` container/icon tokens. `Breadcrumb` moves to `link-label-<state>` (now darkening on hover/active), `page-label-color`, `separator-icon-{color,size}`, and `list-gap`. `Checkbox` moves to the dedicated `--ui-checkbox-{unchecked,checked,indeterminate}-box[-border-color]-<state>` + `-icon-` tiers with `global-box-*` geometry. `Input` moves to `--ui-input-{global-box,normal-box-border-color,error-box-border-color,content-value,content-placeholder}-*`. Visual-regression baselines regenerated in Docker for all re-themed components. Still pending: `Radio`, `Search`, `Select` remain on the removed `--ui-form-*` tier (Figma has no next-gen tokens for them yet) — a design prerequisite, tracked separately.

- Updated dependencies [[`1ef2702`](https://github.com/acronis/uikit/commit/1ef27023038cbc4194dac666b4f020e105670b91)]:
  - @acronis-platform/tokens-pd@1.1.0

## 0.15.2

### Patch Changes

- Updated dependencies [[`d95fc1e`](https://github.com/acronis/uikit/commit/d95fc1e809f3f4fe0c62f0c92d0f48b81976765d)]:
  - @acronis-platform/tokens-pd@1.0.0

## 0.15.1

### Patch Changes

- Updated dependencies [[`9ce1b45`](https://github.com/acronis/uikit/commit/9ce1b4585571aa96c136d200489d0939749b2ece)]:
  - @acronis-platform/icons-react@0.4.0

## 0.15.0

### Minor Changes

- [#262](https://github.com/acronis/uikit/pull/262) [`78fe4ff`](https://github.com/acronis/uikit/commit/78fe4ff0699510e787ac32a299864d7c80c09e1c) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Add ui-react Tooltip controlled/delay coverage and a portal container escape hatch on `TooltipContent` via the new `portalContainer` prop.

## 0.14.0

### Minor Changes

- [#255](https://github.com/acronis/uikit/pull/255) [`c11f987`](https://github.com/acronis/uikit/commit/c11f9878b8920259223a4622dd0efc96d6a83d2a) Thanks [@leonid](https://github.com/leonid)! - **Button: removed the `size` prop.** The Figma button has a single size, so
  `Button` no longer accepts `size` (`sm` / `default` / `lg`) — it always renders
  the 32px-tall size (`h-8 px-3`). This is a breaking change for any consumer
  passing `size`; drop the prop. `ButtonIcon` is unaffected.

## 0.13.0

### Minor Changes

- [#253](https://github.com/acronis/uikit/pull/253) [`1a9281b`](https://github.com/acronis/uikit/commit/1a9281b69e4fe763fb742fcf9a802b87a76e1169) Thanks [@leonid](https://github.com/leonid)! - Add `Tooltip`: a contextual hint shown on hover/focus, built on the Base UI
  Tooltip primitive and themed with the `--ui-tooltip-*` tokens (dark bubble,
  light label, no arrow). Exports `Tooltip`, `TooltipTrigger`, `TooltipContent`,
  and `TooltipProvider` (shared open/close delays); `TooltipContent` takes
  `side` / `align` / `sideOffset` for placement.

## 0.12.0

### Minor Changes

- [#251](https://github.com/acronis/uikit/pull/251) [`e5ce3de`](https://github.com/acronis/uikit/commit/e5ce3de0d53d9c3bad17c1dba03a6a23777a115b) Thanks [@leonid](https://github.com/leonid)! - Add `Tag`: a compact status/category label with six variants (`info`,
  `success`, `warning`, `critical`, `danger`, `neutral`) across two sizes
  (`default`, `sm`) and an optional leading icon. Colors reference the shared
  semantic status tokens; the label truncates at the 256px max width.

  (The Figma "AI" variant is not included yet — its background tint has no design
  token, pending an upstream `--ui-background-status-ai` sync.)

### Patch Changes

- [#250](https://github.com/acronis/uikit/pull/250) [`d3541f9`](https://github.com/acronis/uikit/commit/d3541f9c40c5d12f1c464ad68bf42709b89948e5) Thanks [@leonid](https://github.com/leonid)! - Fix the AI background gradient to run **left-to-right** (90deg) instead of
  top-to-bottom, matching the Figma design. The `background.ai` gradient transform
  in design-tokens carried a stale vertical matrix (`[[0,1,0],[-1,0,1]]` → 180deg);
  it is now identity (`[[1,0,0],[0,1,0]]` → 90deg), and `tokens-pd` is regenerated.

  The AI `Button` variant now always leads with the `Sparkles` icon before its
  label, matching the Figma "Ai" button, and sets `bg-origin-border` so the
  gradient covers the full button box (previously a 1px sliver of the gradient's
  opposite end showed on the left and right border edges).

- Updated dependencies [[`d3541f9`](https://github.com/acronis/uikit/commit/d3541f9c40c5d12f1c464ad68bf42709b89948e5)]:
  - @acronis-platform/tokens-pd@0.7.3

## 0.11.1

### Patch Changes

- [#246](https://github.com/acronis/uikit/pull/246) [`4520292`](https://github.com/acronis/uikit/commit/4520292e06b6e4f6ca022c30ac96ed843f7e1ed1) Thanks [@leonid](https://github.com/leonid)! - Re-theme `Switch` to the design's `--ui-switch-*` token tier. It now matches the
  Figma component: a 32×16 track with a 12px circle, green `--ui-switch-background-active`
  (on) / `--ui-switch-background-inactive` (off) / dedicated disabled tokens
  (replacing the placeholder shadcn `bg-primary`/`bg-input` colors and
  `opacity-50` disabled), with a 3px `--ui-focus-primary` focus ring. No API
  change. Also completes the Figma Code Connect mapping.

## 0.11.0

### Minor Changes

- [#245](https://github.com/acronis/uikit/pull/245) [`0e5760d`](https://github.com/acronis/uikit/commit/0e5760d80ac4728826e20e7a0d64571a44a3c86b) Thanks [@leonid](https://github.com/leonid)! - Add `Select`: a composable select control built on the Base UI Select primitive
  and themed with the shared `--ui-form-*` token tier. Exports `Select`,
  `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, and
  `SelectGroupLabel`, with single/multiple selection, keyboard support, and a
  trigger matching the Figma "Select" states (idle / hover / open+focus /
  disabled).

## 0.10.0

### Minor Changes

- [#242](https://github.com/acronis/uikit/pull/242) [`fa22177`](https://github.com/acronis/uikit/commit/fa2217700b5dae6105c9c63c7d2e973d752d09a9) Thanks [@leonid](https://github.com/leonid)! - Add `Search`: a search field — a leading magnifier (`SearchIcon`), a borderless
  text input, and a clear (×) button that appears once there's a value. Themed by
  the shared `--ui-form-*` token tier; the box owns the visual state via
  `focus-within` (active border + 3px `--ui-focus-primary` ring), with hover and
  disabled wired to their own tokens. The clear button empties the field (firing
  `onChange` with an empty value plus `onClear`) and refocuses the input. Includes
  tests, Storybook stories, visual-regression baselines, and a Figma Code Connect
  mapping.

### Patch Changes

- Updated dependencies [[`a85d629`](https://github.com/acronis/uikit/commit/a85d6291933854a99af8825b985c325bfb80725c)]:
  - @acronis-platform/design-assets@0.4.0
  - @acronis-platform/icons-react@0.3.0

## 0.9.0

### Minor Changes

- [#240](https://github.com/acronis/uikit/pull/240) [`dbdc2fc`](https://github.com/acronis/uikit/commit/dbdc2fcb566b8aaf1f5ddb91d9d977051b65e9e7) Thanks [@leonid](https://github.com/leonid)! - Add `RadioGroup` and `Radio`: a mutually-exclusive option group wrapping Base
  UI's RadioGroup / Radio primitives. The group owns the selected value; each
  `Radio` takes a `value`. Themed by the shared `--ui-form-*` token tier from
  `@acronis-platform/tokens-pd` — the 16px circle uses idle / hover / active /
  disabled border + background, the 8px dot uses `--ui-form-circle-active` (and
  `--ui-form-circle-disabled` when disabled), and the focus ring uses
  `--ui-focus-primary`; the checked fill is scoped with `not-data-[disabled]` so
  disabled wins. Includes tests, Storybook stories, visual-regression baselines,
  and a Figma Code Connect mapping. Labels are composed by the consumer (a Field
  component is future work).

## 0.8.0

### Minor Changes

- [#237](https://github.com/acronis/uikit/pull/237) [`f0f4ab6`](https://github.com/acronis/uikit/commit/f0f4ab676513d1e4ec4d1014ce15a8ae0cf0b8c6) Thanks [@leonid](https://github.com/leonid)! - Add `Input`: a single-line text input themed by the shared `--ui-form-*` token
  tier from `@acronis-platform/tokens-pd`. Each state is wired to its own token —
  idle / hover / focus (active border + a 3px `--ui-focus-primary` ring) /
  disabled — and the error state is driven by `aria-invalid` (red border, and a
  `--ui-focus-error` ring on focus) scoped so it wins over the hover/focus border.
  Includes tests, Storybook stories, visual-regression baselines, and a Figma
  Code Connect mapping. Label / description / error message are composed by the
  consumer (a Field component is future work).

## 0.7.0

### Minor Changes

- [#235](https://github.com/acronis/uikit/pull/235) [`4fb8b2f`](https://github.com/acronis/uikit/commit/4fb8b2f3c0df84f49def85fa7cba7ee3d062ef66) Thanks [@leonid](https://github.com/leonid)! - Add `Checkbox`: a Base UI checkbox wrapper supporting checked, unchecked, and
  indeterminate states (check / minus glyphs). Colors and geometry are wired to
  the shared `--ui-form-*` token tier from `@acronis-platform/tokens-pd`, with the
  glyph tinted by `--ui-glyph-on-brand-primary` and the focus ring by
  `--ui-focus-primary`; the disabled state always wins over the checked /
  indeterminate fill. Includes tests, Storybook stories, visual-regression
  baselines, and a Figma Code Connect mapping. The `form` token tier is now
  imported in `src/styles/index.css`.

## 0.6.1

### Patch Changes

- [#233](https://github.com/acronis/uikit/pull/233) [`13fb696`](https://github.com/acronis/uikit/commit/13fb6960f699288ccb749d383e342a3dae7b62ab) Thanks [@leonid](https://github.com/leonid)! - Fix unstyled components: `src/styles/index.css` only imported the semantic
  token tier from `@acronis-platform/tokens-pd`, so the per-component token tiers
  (opt-in) were never loaded and every `--ui-button-*` / `--ui-button-icon-*` /
  `--ui-switch-*` / `--ui-breadcrumb-*` reference resolved to nothing. Import the
  `button`, `switch`, and `breadcrumb` component tiers so the shipped library CSS
  (`@acronis-platform/ui-react/styles`) actually carries the component tokens.

## 0.6.0

### Minor Changes

- [#231](https://github.com/acronis/uikit/pull/231) [`f16d691`](https://github.com/acronis/uikit/commit/f16d691de54cec590b095b639da303e5b5cd3d20) Thanks [@leonid](https://github.com/leonid)! - Add `Breadcrumb`: a composable set of breadcrumb primitives (`Breadcrumb`,
  `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`,
  `BreadcrumbSeparator`, `BreadcrumbEllipsis`). Links are polymorphic via the
  Base UI `render` prop (e.g. a router `Link`); the current page is marked with
  `aria-current="page"`. Colors are wired to the `--ui-breadcrumb-*` tokens from
  `@acronis-platform/tokens-pd`, and the separator uses the 16px chevron-right
  icon. Includes tests, Storybook stories, and a Figma Code Connect mapping.

## 0.5.1

### Patch Changes

- Updated dependencies []:
  - @acronis-platform/tokens-pd@0.7.2

## 0.5.0

### Minor Changes

- [#210](https://github.com/acronis/uikit/pull/210) [`6d188d2`](https://github.com/acronis/uikit/commit/6d188d21e719a5af7ad7589f3f5227b32cfb4f53) Thanks [@leonid](https://github.com/leonid)! - Align Button with the Figma design and add a dedicated ButtonIcon component.

  **Button** now wires every style and interaction state directly to the
  dedicated `--ui-button-*` component tokens (from `@acronis-platform/tokens-pd`)
  instead of borrowing shared semantic tokens:
  - Disabled states use the design's explicit per-variant disabled colors instead
    of a blanket `opacity-50`.
  - The focus ring uses the `--ui-focus-*` tokens.
  - Secondary now uses its dedicated border/background/label tokens (previously a
    generic `border-border` + surface-hover), and Ghost is a plain colored-text
    button (the underline-on-hover was removed to match the design).

  **ButtonIcon** is a new icon-only button (32×32, 16px glyph) mirroring the Figma
  `ButtonIcon` component, wired to the `--ui-button-icon-*` tokens.

  **Breaking changes:**
  - Removed the non-design Button variants `outline`, `link`, and `translucent`.
    The supported variants are now `default` (Primary), `secondary`, `ghost`,
    `destructive`, `ai`, and `inverted`.
  - Removed the Button `size="icon"` option — use the new `ButtonIcon` component
    for icon-only buttons.

## 0.4.2

### Patch Changes

- Updated dependencies [[`8a72145`](https://github.com/acronis/uikit/commit/8a721459e35a405bdf9ef11489e86f68b61a821c), [`beae4ff`](https://github.com/acronis/uikit/commit/beae4ffd3dd4cd8742300c8906e7e18cef8693ee)]:
  - @acronis-platform/tokens-pd@0.7.1

## 0.4.1

### Patch Changes

- Updated dependencies [[`bd63c2a`](https://github.com/acronis/uikit/commit/bd63c2ae80bcab09acb1bc558d01951e2c38af83)]:
  - @acronis-platform/tokens-pd@0.7.0

## 0.4.0

### Minor Changes

- [#198](https://github.com/acronis/uikit/pull/198) [`8cbe6cf`](https://github.com/acronis/uikit/commit/8cbe6cfb891cf59a2fe3c006a0ef8a08d06806ee) Thanks [@heygabecom](https://github.com/heygabecom)! - Rename `@acronis-platform/design-theme` → `@acronis-platform/tokens-pd` and rebuild it from the Style Dictionary pipeline.

  **`@acronis-platform/tokens-pd` (was `@acronis-platform/design-theme`) — breaking:**
  - **Package renamed.** Update the dependency and all import specifiers from
    `@acronis-platform/design-theme` to `@acronis-platform/tokens-pd`.
  - **Homegrown build retired.** The package no longer runs its own Style
    Dictionary script; it is now the published home for the output of
    `@acronis-platform/style-dictionary`, which is generated and committed.
  - **Exports replaced.** The `./css`, `./scss`, and `./js` exports are removed.
    Output is grouped into `css/`, `tailwind/`, and `dtcg/` dirs.
    - `./css` → `./css/acronis.css` (semantic tier, default brand) and, per
      component, `./css/<component>/acronis.css`.
    - Non-default brands ship as **override-only** files (`./css/brand-b.css`,
      `./css/<component>/brand-b.css`) — import the base then the override (last wins).
    - `./scss` and `./js` (the `tokens`/`groups`/`TokenName` map) are dropped.
    - New: `./tailwind/<brand>.js` (Tailwind presets, baked values, via `@config`)
      and `./dtcg/*.json` (the DTCG intermediate).
  - **Custom-property naming changed.** The `--av-*` prefix is gone. Names now drop
    the `colors` tier segment and use a `--ui-*` prefix:
    `--av-colors-background-surface-primary` → `--ui-background-surface-primary`.
  - **Theming mechanism changed.** Light/dark is driven by `light-dark()` +
    `color-scheme`, toggled with the `[data-theme]` attribute (`<html
data-theme="dark">`) instead of a `.dark` class. Brands are bare `:root`
    overrides (no `.brand-b` class) — one brand per app.
  - **Gradients** are now emitted (`--ui-background-ai-*`), and typography ships as
    `.ui-typography-*` utility classes.

  **`@acronis-platform/ui-react`:**
  - Now themed by `@acronis-platform/tokens-pd` (was `@acronis-platform/design-theme`).
  - The `@theme inline` bridge maps onto the new `--ui-*` names; the `dark:` variant
    now keys off the `[data-theme="dark"]` attribute instead of the `.dark` class.
    Consumers that previously toggled a `.dark` class must switch to `data-theme`.
  - The `ai` button variant's gradient (`--ui-background-ai-*`) is now defined.

### Patch Changes

- Updated dependencies [[`8cbe6cf`](https://github.com/acronis/uikit/commit/8cbe6cfb891cf59a2fe3c006a0ef8a08d06806ee)]:
  - @acronis-platform/tokens-pd@0.6.0

## 0.3.1

### Patch Changes

- Updated dependencies []:
  - @acronis-platform/design-theme@0.5.1

## 0.3.0

### Minor Changes

- [#94](https://github.com/acronis/uikit/pull/94) [`9e418d6`](https://github.com/acronis/uikit/commit/9e418d6fb7e4e52182e96dc26418daf82fde8c25) Thanks [@leonid](https://github.com/leonid)! - Add Figma Code Connect support to `ui-react` and align the Button with the
  Figma "Button" component.
  - **`ui-react`**: new Figma Code Connect setup (`figma.config.json`,
    co-located `*.figma.tsx` files, `figma:connect*` scripts) linking
    components to their Figma counterparts. The `Button` is fully connected and
    its variants now match the Figma `Style` set: added `ai` (gradient) and
    `inverted` variants, and re-pointed `default` / `secondary` / `ghost` /
    `destructive` to the colors used in the mockup via button-local
    `--color-btn-*` token bridges (the shared `--color-*` tokens are unchanged).
    The legacy-only `outline` / `link` / `translucent` variants are retained for
    parity with the shared demos.
  - **`design-tokens`**: added the `colors.background.inverted-surface` semantic
    tokens (idle / hover / active / disabled) that back the inverted button.
  - **`design-theme`**: emits the new
    `--av-colors-background-inverted-surface-*` custom properties.

### Patch Changes

- Updated dependencies [[`9e418d6`](https://github.com/acronis/uikit/commit/9e418d6fb7e4e52182e96dc26418daf82fde8c25)]:
  - @acronis-platform/design-theme@0.5.0

## 0.2.3

### Patch Changes

- Updated dependencies [[`61fe683`](https://github.com/acronis/uikit/commit/61fe68389b42f482fe9f7a07ab0f14ebad6c12d1)]:
  - @acronis-platform/design-theme@0.4.0

## 0.2.2

### Patch Changes

- Updated dependencies [[`61fe683`](https://github.com/acronis/uikit/commit/61fe68389b42f482fe9f7a07ab0f14ebad6c12d1)]:
  - @acronis-platform/design-theme@0.3.0

## 0.2.1

### Patch Changes

- [#84](https://github.com/acronis/uikit/pull/84) [`3b3fe78`](https://github.com/acronis/uikit/commit/3b3fe7852bbff8c50009648fe49fccbda9526bf2) Thanks [@leonid](https://github.com/leonid)! - Add `@acronis-platform/icons-react` — React icon components generated from
  `@acronis-platform/design-assets`. Ships all four packs via subpath exports
  (`./stroke-mono`, `./solid-mono`, `./stroke-multi`, `./solid-multi`) as
  tree-shakeable per-icon named exports plus an `icons` registry + `IconName`
  type per pack.
  - **mono** packs collapse to `currentColor` (inherit text color); **multi**
    packs keep their authored colors (gradient/clip ids are namespaced per icon
    to avoid collisions).
  - The design-assets scale + stroke rules are baked into a `size` prop, so a
    single 24px master renders at any size with the designed stroke weight
    (1.6px @16, 2px @24, 2.5px @32).

  `@acronis-platform/ui-react` now depends on it so components and stories can
  compose icons (e.g. `<Button><PlusIcon /> Add</Button>`).

- Updated dependencies [[`3b3fe78`](https://github.com/acronis/uikit/commit/3b3fe7852bbff8c50009648fe49fccbda9526bf2)]:
  - @acronis-platform/icons-react@0.2.0

## 0.2.0

### Minor Changes

- [#80](https://github.com/acronis/uikit/pull/80) [`1687cc9`](https://github.com/acronis/uikit/commit/1687cc9336de74d53521d8e6ef9097763a0a9bb0) Thanks [@leonid](https://github.com/leonid)! - Introduce two new published packages:
  - `@acronis-platform/design-theme` — generates consumable CSS / SCSS / JS theme
    artifacts from `@acronis-platform/design-tokens` via Style Dictionary, resolving
    the per-scheme (light/dark) and per-brand token matrix into `--av-*` CSS
    custom properties.
  - `@acronis-platform/ui-react` — the next-generation Acronis React
    component library built on Base UI (`@base-ui/react`) and themed by
    `@acronis-platform/design-theme`. Ships `Button` and `Switch` with tests and
    Storybook stories as the reference pattern.

### Patch Changes

- Updated dependencies [[`1687cc9`](https://github.com/acronis/uikit/commit/1687cc9336de74d53521d8e6ef9097763a0a9bb0)]:
  - @acronis-platform/design-theme@0.2.0
