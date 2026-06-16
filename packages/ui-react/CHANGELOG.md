# @acronis-platform/ui-react

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
