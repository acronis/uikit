# @acronis-platform/design-tokens

## 1.9.0

### Minor Changes

- [#405](https://github.com/acronis/uikit/pull/405) [`c686666`](https://github.com/acronis/uikit/commit/c686666ff880d8adc647c7c5b47c3b01bce2c88d) Thanks [@leonid](https://github.com/leonid)! - Add the `Chips` component token tier: the design-tokens source plus the
  generated tokens-pd output (per-brand `--ui-chips-*` CSS, Tailwind presets, and
  DTCG). Consumed by the new `Chip` component in `@acronis-platform/ui-react`.

## 1.8.0

### Minor Changes

- [#337](https://github.com/acronis/uikit/pull/337) [`62e2a0d`](https://github.com/acronis/uikit/commit/62e2a0df33293b5efd946af2e68ad38757964e69) Thanks [@heygabecom](https://github.com/heygabecom)! - ## design-tokens

  ### Added — Primitives

  **ElectricBlue palette** (15 new tokens, light mode only; dark mode deferred):

  | Token                     | $type   |
  | ------------------------- | ------- |
  | `palette.electricBlue.0`  | `color` |
  | `palette.electricBlue.1`  | `color` |
  | `palette.electricBlue.2`  | `color` |
  | `palette.electricBlue.3`  | `color` |
  | `palette.electricBlue.4`  | `color` |
  | `palette.electricBlue.5`  | `color` |
  | `palette.electricBlue.6`  | `color` |
  | `palette.electricBlue.7`  | `color` |
  | `palette.electricBlue.8`  | `color` |
  | `palette.electricBlue.9`  | `color` |
  | `palette.electricBlue.10` | `color` |
  | `palette.electricBlue.11` | `color` |
  | `palette.electricBlue.12` | `color` |
  | `palette.electricBlue.13` | `color` |
  | `palette.electricBlue.14` | `color` |

  **New units:**

  | Token                 | $type       | Value             |
  | --------------------- | ----------- | ----------------- |
  | `units.gap.gap-neg-6` | `dimension` | negative gap step |
  | `units.size.size-7`   | `dimension` | new size step     |

  **New font letter-spacing:**

  | Token                                   | $type       |
  | --------------------------------------- | ----------- |
  | `font.letter-spacing.letter-spacing-03` | `dimension` |
  | `font.letter-spacing.letter-spacing-1`  | `dimension` |

  ### Deleted — Primitives

  **Entire `palette.ink.*` swatch removed** (10 tokens):

  | Token           | Was     |
  | --------------- | ------- |
  | `palette.ink.0` | `color` |
  | `palette.ink.1` | `color` |
  | `palette.ink.2` | `color` |
  | `palette.ink.3` | `color` |
  | `palette.ink.4` | `color` |
  | `palette.ink.5` | `color` |
  | `palette.ink.6` | `color` |
  | `palette.ink.7` | `color` |
  | `palette.ink.8` | `color` |
  | `palette.ink.9` | `color` |

  If you reference `--pd-palette-ink-*` CSS variables, migrate to the appropriate `--pd-palette-grayscale-*` or `--pd-palette-blue-*` stop.

  ### Changed — Semantics

  Info-status tokens now reference the new ElectricBlue palette:

  | Token                                 | From                       | To                                 |
  | ------------------------------------- | -------------------------- | ---------------------------------- |
  | `colors.background.status.info`       | `palette.blue.*` reference | `palette.electricBlue.*` reference |
  | `colors.background.statusStrong.info` | `palette.blue.*` reference | `palette.electricBlue.*` reference |
  | `colors.border.onStatus.info`         | `palette.blue.*` reference | `palette.electricBlue.*` reference |
  | `colors.glyph.onStatus.info`          | `palette.blue.*` reference | `palette.electricBlue.*` reference |

  On-brand tokens updated:

  | Token                                 | Change        |
  | ------------------------------------- | ------------- |
  | `colors.border.onBrand.border-active` | Value updated |
  | `colors.glyph.onBrand.disabled`       | Value updated |

  Typography:

  | Token                                                                           | Change             |
  | ------------------------------------------------------------------------------- | ------------------ |
  | `typography.headings.title-accent` (derived from `headings/title-accent` style) | Font style updated |

  ### Added — Components

  **New component token groups** (6 components synced for the first time):

  | Component      | Token count                                       |
  | -------------- | ------------------------------------------------- |
  | `Avatar`       | ~25 tokens (colors, sizes, border, typography)    |
  | `ButtonMenu`   | full set                                          |
  | `CardFilter`   | full set                                          |
  | `InputSelect`  | full set (includes DropdownItem, DropdownSection) |
  | `Resizable`    | full set                                          |
  | `SearchGlobal` | full set                                          |

  ### Deleted — Components

  **`ButtonDropdown` removed** from the token tier (component retired from design system):

  All `components.ButtonDropdown.*` tokens deleted. If you reference `--ui-button-dropdown-*` CSS variables, migrate to `Button` + `ButtonMenu` tokens.

  ### Changed — Components

  | Component          | Token                    | Change                             |
  | ------------------ | ------------------------ | ---------------------------------- |
  | `ButtonIcon`       | `_global.icon.size`      | 16 → 24 px                         |
  | `ButtonIcon`       | `_global.padding`        | 8 → 4 px                           |
  | `InputSearch`      | label `textStyle`        | `body.default` → `body.form-label` |
  | `InputText`        | label `textStyle`        | `body.default` → `body.form-label` |
  | `SidebarSecondary` | padding (deep-sky brand) | value updated                      |

  ## tokens-pd

  CSS custom properties regenerated for all updated tiers. New per-component CSS files added: `Avatar/`, `ButtonMenu/`, `CardFilter/`, `InputSelect/`, `Resizable/`, `SearchGlobal/`. `ButtonDropdown/` CSS files removed.

  ## Migration
  - **`palette.ink.*`** → migrate to `palette.grayscale.*` (neutral grays) or `palette.blue.*` depending on usage.
  - **`ButtonDropdown` CSS** (`--ui-button-dropdown-*`) → migrate to `Button` + `ButtonMenu` component tokens.
  - **`ButtonIcon` size/padding** changed: icon grew from 16→24 px, padding shrank from 8→4. Verify icon-only button visual sizing in your UI.
  - **Info-status colors** (`--pd-color-background-status-info`, `--pd-color-glyph-on-status-info`, etc.) now use ElectricBlue instead of Blue. Check if this affects your info alerts/badges.
  - **Dark mode primitives** deferred — dark palette values unchanged in this sync. A follow-up PR will update dark mode.

## 1.7.0

### Minor Changes

- [#334](https://github.com/acronis/uikit/pull/334) [`fc1cb92`](https://github.com/acronis/uikit/commit/fc1cb92d406186b3a422c2a2ef3118f9631c7c73) Thanks [@leonid](https://github.com/leonid)! - Sync tokens from Figma and regenerate `tokens-pd` (`css/<Tier>/*`, Tailwind
  presets, DTCG):
  - **Components**: add the `CardFilter`, `Icon`, `MenuItem`, `SearchGlobal`, and
    `Table` token tiers. Fixes the `CardFilter` value text-style reference
    (`{typography.title.accent}` → `{typography.headings.title-accent}`); the
    components emitter now resolves this hyphen-as-dot typography mismatch so
    re-syncs stay correct.
  - **Primitives**: the internal (hidden) `palette.electricblue.ink-*` stops were
    renamed to `palette.electricblue.blue-*` with refreshed values.
  - **Semantics**: one alias re-pointed to `{palette.transparent.inverted.9}`.

## 1.6.0

### Minor Changes

- [#321](https://github.com/acronis/uikit/pull/321) [`878689b`](https://github.com/acronis/uikit/commit/878689b7fe7d62ba297381857249fe1e9c4cef88) Thanks [@leonid](https://github.com/leonid)! - ## design-tokens

  ### Added

  | Token                              | $type        | Notes                                                          |
  | ---------------------------------- | ------------ | -------------------------------------------------------------- |
  | `typography.headings.title-accent` | `typography` | Inter Semi Bold 24px / 32px line-height (new Figma text style) |

  ### Changed

  | Token                          | Change                                                                                                              |
  | ------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
  | `font.letter-spacing.0-3`      | Added `$extensions.com.figma.variableId` (`VariableID:1727:2408`) and `com.figma.scopes` — no value change (0.3 px) |
  | `font.letter-spacing.1`        | Added `$extensions.com.figma.variableId` (`VariableID:1727:2410`) and `com.figma.scopes` — no value change (1 px)   |
  | `colors.focus.brand`           | `com.figma.scopes`: removed `EFFECT_COLOR`                                                                          |
  | `colors.focus.error`           | `com.figma.scopes`: removed `EFFECT_COLOR`                                                                          |
  | `colors.focus.primary`         | `com.figma.scopes`: removed `EFFECT_COLOR`                                                                          |
  | `colors.focus.secondary`       | `com.figma.scopes`: removed `EFFECT_COLOR`                                                                          |
  | `colors.glyph.onSurface.brand` | `com.figma.scopes`: `ALL_SCOPES` → `[SHAPE_FILL, STROKE_COLOR]`                                                     |

  ## components

  ### Added

  **InputSelect** (81 tokens — new component)

  | Group                           | Tokens | $type(s)                           |
  | ------------------------------- | ------ | ---------------------------------- |
  | `InputSelect._global.*`         | 25     | `color`, `dimension`, `typography` |
  | `InputSelect.Dropdown.*`        | 17     | `color`, `dimension`, `typography` |
  | `InputSelect.DropdownItem.*`    | 14     | `color`, `dimension`               |
  | `InputSelect.DropdownSection.*` | 8      | `color`, `dimension`, `typography` |
  | `InputSelect.error.*`           | 7      | `color`, `typography`              |
  | `InputSelect.normal.*`          | 10     | `color`, `typography`              |

  **InputDatePicker** (49 tokens — new component)

  | Group                       | Tokens | $type(s)                           |
  | --------------------------- | ------ | ---------------------------------- |
  | `InputDatePicker._global.*` | 31     | `color`, `dimension`, `typography` |
  | `InputDatePicker.error.*`   | 9      | `color`, `typography`              |
  | `InputDatePicker.normal.*`  | 9      | `color`, `typography`              |

  **ButtonMenu sub-groups** (25 new tokens added to existing component)

  | Group                          | Tokens |
  | ------------------------------ | ------ |
  | `ButtonMenu.Dropdown.*`        | 7      |
  | `ButtonMenu.DropdownExtras.*`  | 3      |
  | `ButtonMenu.DropdownItem.*`    | 10     |
  | `ButtonMenu.DropdownSection.*` | 5      |

  ### Renamed

  | Was                            | Now            | Notes                                                                   |
  | ------------------------------ | -------------- | ----------------------------------------------------------------------- |
  | `ButtonDropdown.*` (32 tokens) | `ButtonMenu.*` | All values and aliases unchanged — top-level key renamed to match Figma |

  ## Migration

  If you reference `--ui-ButtonDropdown-*` CSS custom properties, rename them to `--ui-ButtonMenu-*`. Token values and aliases are identical.

## 1.5.0

### Minor Changes

- [#317](https://github.com/acronis/uikit/pull/317) [`0d66857`](https://github.com/acronis/uikit/commit/0d66857127ac07df5ae5cbe95fbad6c7bc81e76d) Thanks [@heygabecom](https://github.com/heygabecom)! - ## design-tokens

  ### Added

  | Token                              | $type        | Notes                                                          |
  | ---------------------------------- | ------------ | -------------------------------------------------------------- |
  | `typography.headings.title-accent` | `typography` | Inter Semi Bold 24px / 32px line-height (new Figma text style) |

  ### Changed

  | Token                          | Change                                                                                                              |
  | ------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
  | `font.letter-spacing.0-3`      | Added `$extensions.com.figma.variableId` (`VariableID:1727:2408`) and `com.figma.scopes` — no value change (0.3 px) |
  | `font.letter-spacing.1`        | Added `$extensions.com.figma.variableId` (`VariableID:1727:2410`) and `com.figma.scopes` — no value change (1 px)   |
  | `colors.focus.brand`           | `com.figma.scopes`: removed `EFFECT_COLOR`                                                                          |
  | `colors.focus.error`           | `com.figma.scopes`: removed `EFFECT_COLOR`                                                                          |
  | `colors.focus.primary`         | `com.figma.scopes`: removed `EFFECT_COLOR`                                                                          |
  | `colors.focus.secondary`       | `com.figma.scopes`: removed `EFFECT_COLOR`                                                                          |
  | `colors.glyph.onSurface.brand` | `com.figma.scopes`: `ALL_SCOPES` → `[SHAPE_FILL, STROKE_COLOR]`                                                     |

  ## components

  ### Added

  **InputSelect** (81 tokens — new component)

  | Group                           | Tokens | $type(s)                           |
  | ------------------------------- | ------ | ---------------------------------- |
  | `InputSelect._global.*`         | 25     | `color`, `dimension`, `typography` |
  | `InputSelect.Dropdown.*`        | 17     | `color`, `dimension`, `typography` |
  | `InputSelect.DropdownItem.*`    | 14     | `color`, `dimension`               |
  | `InputSelect.DropdownSection.*` | 8      | `color`, `dimension`, `typography` |
  | `InputSelect.error.*`           | 7      | `color`, `typography`              |
  | `InputSelect.normal.*`          | 10     | `color`, `typography`              |

  **InputDatePicker** (49 tokens — new component)

  | Group                       | Tokens | $type(s)                           |
  | --------------------------- | ------ | ---------------------------------- |
  | `InputDatePicker._global.*` | 31     | `color`, `dimension`, `typography` |
  | `InputDatePicker.error.*`   | 9      | `color`, `typography`              |
  | `InputDatePicker.normal.*`  | 9      | `color`, `typography`              |

  **ButtonMenu sub-groups** (25 new tokens added to existing component)

  | Group                          | Tokens |
  | ------------------------------ | ------ |
  | `ButtonMenu.Dropdown.*`        | 7      |
  | `ButtonMenu.DropdownExtras.*`  | 3      |
  | `ButtonMenu.DropdownItem.*`    | 10     |
  | `ButtonMenu.DropdownSection.*` | 5      |

  ### Renamed

  | Was                            | Now            | Notes                                                                   |
  | ------------------------------ | -------------- | ----------------------------------------------------------------------- |
  | `ButtonDropdown.*` (32 tokens) | `ButtonMenu.*` | All values and aliases unchanged — top-level key renamed to match Figma |

  ## Migration

  If you reference `--ui-ButtonDropdown-*` CSS custom properties, rename them to `--ui-ButtonMenu-*`. Token values and aliases are identical.

## 1.4.0

### Minor Changes

- [#308](https://github.com/acronis/uikit/pull/308) [`6d9bf1a`](https://github.com/acronis/uikit/commit/6d9bf1ae0ca447ae7ed5ee6d1e91b776edff6bde) Thanks [@heygabecom](https://github.com/heygabecom)! - ## design-tokens

  ### Added

  | Token                                   | `$type`     |
  | --------------------------------------- | ----------- |
  | `units.gap.gap-6`                       | `dimension` |
  | `units.size.size-96`                    | `dimension` |
  | `font.letter-spacing.letter-spacing-03` | `dimension` |
  | `font.letter-spacing.letter-spacing-1`  | `dimension` |

  ### Deleted

  | Token                            | Was                                  |
  | -------------------------------- | ------------------------------------ |
  | `palette.transparent.inverted.6` | `{palette.grayscale.6}` (alpha 0.06) |
  | `palette.transparent.inverted.8` | `{palette.grayscale.8}` (alpha 0.08) |

  ### Changed

  | Token                                        | Change                                                              |
  | -------------------------------------------- | ------------------------------------------------------------------- |
  | `palette.grayscale.0`                        | `scopes`: `[ALL_SCOPES]` → `[]`; `hiddenFromPublishing`: `true`     |
  | `palette.grayscale.14`                       | `scopes`: `[ALL_SCOPES]` → `[]`; `hiddenFromPublishing`: `true`     |
  | `palette.transparent.clear`                  | `hiddenFromPublishing`: `true`; Figma export representation updated |
  | `semantics.colors.border.onStatus.ai-strong` | `scopes`: `[ALL_SCOPES]` → `[]`                                     |
  | `semantics.gradients.ai.active`              | `scopes`: `[ALL_SCOPES]` → `[]`                                     |
  | `semantics.gradients.ai.disabled`            | `scopes`: `[ALL_SCOPES]` → `[]`                                     |
  | `semantics.gradients.ai.hover`               | `scopes`: `[ALL_SCOPES]` → `[]`                                     |
  | `semantics.gradients.ai.idle`                | `scopes`: `[ALL_SCOPES]` → `[]`                                     |

  ## components tier

  ### Added

  New components with full token sets:

  | Component        | Tokens | Notes                                                       |
  | ---------------- | ------ | ----------------------------------------------------------- |
  | `ButtonDropdown` | 32     | Primary / secondary variants, `_global` dimensions          |
  | `InputSearch`    | 32     | Box, icon, label, placeholder, value, required slots        |
  | `InputTextArea`  | 34     | Box, label, placeholder, value, description, required slots |
  | `Radio`          | 33     | Checked / unchecked box, icon, label, description           |

  New tokens on existing components:

  | Token                                               | `$type`     |
  | --------------------------------------------------- | ----------- |
  | `InputText._global.placeholder.color.disabled`      | `color`     |
  | `InputText._global.placeholder.color.hover`         | `color`     |
  | `InputText.normal.description.color.disabled`       | `color`     |
  | `InputText.normal.description.color.hover`          | `color`     |
  | `SidebarSecondary._global.containerHeader.paddingX` | `dimension` |
  | `SidebarSecondary._global.containerHeader.paddingY` | `dimension` |
  | `SidebarSecondary.Section.containerHeader.gap`      | `dimension` |
  | `SidebarSecondary.Section.containerHeader.minWidth` | `dimension` |
  | `SidebarSecondary.Section.iconArrow.color`          | `color`     |

  ### Deleted

  `SidebarSecondary` sidebar logic changed; the following tokens were removed as the hover/active states and layout structure were redesigned:

  | Token                                                         | Was                                |
  | ------------------------------------------------------------- | ---------------------------------- |
  | `SidebarSecondary.MenuItem._global.icon.color.active`         | `{colors.glyph.onSurface.primary}` |
  | `SidebarSecondary.MenuItem._global.icon.color.hover`          | `{colors.glyph.onSurface.primary}` |
  | `SidebarSecondary.MenuItem._global.label.color.active`        | `{colors.text.onSurface.primary}`  |
  | `SidebarSecondary.MenuItem._global.label.color.hover`         | `{colors.text.onSurface.primary}`  |
  | `SidebarSecondary.MenuItem._global.level2.container.paddingL` | `{units.gap.40}`                   |
  | `SidebarSecondary.Section.container.borderColor`              | `{colors.border.onSurface.border}` |
  | `SidebarSecondary.Section.container.borderWidth`              | `{units.stroke.1}`                 |

  ## Migration

  `palette.transparent.inverted.6` and `palette.transparent.inverted.8` have been removed.

  If you reference `--ui-sidebar-secondary-*` CSS variables for `SidebarSecondary` `MenuItem` hover/active icon or label colors, or `Section` border color/width, update your usage — these tokens no longer exist.

  `InputTextarea` is now named `InputTextArea` (capital A, matching Figma). Update any `--ui-input-text-area-*` CSS var references accordingly.

## 1.3.0

### Minor Changes

- [#300](https://github.com/acronis/uikit/pull/300) [`7782af7`](https://github.com/acronis/uikit/commit/7782af7c4ea61728edc65b6c2d6d3b19e720ec63) Thanks [@leonid](https://github.com/leonid)! - Sync the `ButtonDropdown` component token tier from Figma.

  ## design-tokens

  ### Added
  - `ButtonDropdown` component tier: global geometry (height, min-width, padding,
    gap, radius, icon size) plus `primary` and `secondary` container / label / icon
    colors and the `secondary` container border, across idle / hover / active /
    disabled.
  - A `96px` size primitive.

  ## tokens-pd

  Generated the `--ui-button-dropdown-*` CSS custom properties (acronis + deep-sky
  brands) from the new tier.

## 1.2.0

### Minor Changes

- [#285](https://github.com/acronis/uikit/pull/285) [`4e13963`](https://github.com/acronis/uikit/commit/4e139630719ebb51eedc99494b351aa657a75c78) Thanks [@heygabecom](https://github.com/heygabecom)! - ## design-tokens

  ### Added

  | Scope                           | What was added                                        |
  | ------------------------------- | ----------------------------------------------------- |
  | `semantics.colors.*`            | `"deep-sky"` mode values for all color tokens         |
  | `semantics.gradients.*`         | `"deep-sky"` mode values for all 4 AI gradient tokens |
  | `components.Breadcrumb.*`       | `"deep-sky"` mode values                              |
  | `components.Button.*`           | `"deep-sky"` mode values                              |
  | `components.ButtonIcon.*`       | `"deep-sky"` mode values                              |
  | `components.Checkbox.*`         | `"deep-sky"` mode values                              |
  | `components.InputText.*`        | `"deep-sky"` mode values                              |
  | `components.SidebarPrimary.*`   | `"deep-sky"` mode values                              |
  | `components.SidebarSecondary.*` | `"deep-sky"` mode values                              |
  | `components.Switch.*`           | `"deep-sky"` mode values                              |
  | `components.Tag.*`              | `"deep-sky"` mode values                              |
  | `components.Tooltip.*`          | `"deep-sky"` mode values                              |

  ## tokens-pd

  ### Added
  - `css/deep-sky.css` — full semantic + component CSS custom properties for the deep-sky brand
  - `css/<Component>/deep-sky.css` — per-component CSS for all allowlisted components
  - `dtcg/semantics-deep-sky.json` — resolved DTCG semantics for deep-sky
  - `dtcg/components-deep-sky.json` — resolved DTCG components for deep-sky
  - `tailwind/deep-sky/tokens.js` — Tailwind preset for deep-sky semantic tokens
  - `tailwind/deep-sky/components/<Component>.js` — per-component Tailwind presets for deep-sky

  Brand-specific tokens (e.g. `background.brand.*`, `text.onSurface.*`) carry hardcoded HSL values for deep-sky; all other tokens alias into the shared semantics layer identical to the `acronis` brand.

- [#285](https://github.com/acronis/uikit/pull/285) [`4e13963`](https://github.com/acronis/uikit/commit/4e139630719ebb51eedc99494b351aa657a75c78) Thanks [@heygabecom](https://github.com/heygabecom)! - ## design-tokens

  ### Deleted

  | Token                                         | Was                                                                      |
  | --------------------------------------------- | ------------------------------------------------------------------------ |
  | `semantics.colors.border.onSurface.border-ai` | Alias to a palette blue color representing the AI brand border treatment |

  ## Migration

  Replace usages of `--ui-border-onSurface-border-ai` with one of the dedicated AI gradient tokens, which now represent the canonical AI border/surface treatment:

  | Replacement token                 | CSS variable                 | Use when                |
  | --------------------------------- | ---------------------------- | ----------------------- |
  | `semantics.gradients.ai.idle`     | `--ui-gradients-ai-idle`     | Default / resting state |
  | `semantics.gradients.ai.hover`    | `--ui-gradients-ai-hover`    | Hover state             |
  | `semantics.gradients.ai.active`   | `--ui-gradients-ai-active`   | Active / pressed state  |
  | `semantics.gradients.ai.disabled` | `--ui-gradients-ai-disabled` | Disabled state          |

## 1.1.0

### Minor Changes

- [#273](https://github.com/acronis/uikit/pull/273) [`1ef2702`](https://github.com/acronis/uikit/commit/1ef27023038cbc4194dac666b4f020e105670b91) Thanks [@leonid](https://github.com/leonid)! - Refresh design tokens from Figma and migrate the component tier to the next-gen Figma component architecture.

  **Primitives / semantic (breaking, pre-1.0):** rename semantic `status-inverted.*` → `status-strong.*`, `inverted-surface.*` → `inverted.*`, and `border.on-status.*-dark` → `*-strong`. Add the `ink` palette, `units.size-20`, a `transparent.clear` stop, semantic `glyph.on-status.ai`, the `status-strong` background family, `background.status.ai{,-hover,-pressed}`, `background.brand.primary-focus`, and `typography.link.default` / `link.default-underline`. The `brand-b` mode is removed (its values were dropped upstream in Figma); `tokens-pd` no longer emits `brand-b.css` / `brand-b` presets.

  **Component tier (breaking, pre-1.0):** the component tokens now source the next-gen `brand.components` Figma tier instead of the retired `componentLegacy` group. Components emitted: `breadcrumb`, `button`, `button-icon`, `checkbox`, `input`, `menu-item`, `sidebar-primary`, `sidebar-secondary`, `switch`, `tag`, `tooltip` (plus `icon` / `tree`, retained from legacy — no next-gen equivalent yet). This replaces the previous `chip` / `form` / `sidebar` / `item` components.

  Naming follows the next-gen contract ("Option A — faithful"): PascalCase component → kebab (`ButtonIcon` → `button-icon`), camelCase leaf → kebab (`borderRadius` → `border-radius`, `paddingX` → `padding-x`), `_global` → `global`, and the redundant `color` property word is dropped for color tokens only (`Button/ai/container/color/idle` → `--ui-button-ai-container-idle`; compound names like `borderColor` keep their suffix → `border-color`). The token shape is deeply nested: `<component>-<variant|global>-<role>-<property>[-<state>]`.

  The `colors.background.ai.*` gradients keep their intended **horizontal** (`90deg`) orientation; component AI references (`button.ai.*`, `tag.ai.*`) resolve to them via an alias rewrite (`{semantics.gradients.ai.*}` → `colors.background.ai.*`). `textStyle` literals resolve to `typography.*`.

  **Known gaps (warned, not fatal):** 8 `$type:string` component tokens are skipped because the token schema has no `string` type — `Button.*.container.borderStyle` (`"solid"`), `Switch._global.box.borderStyle`, and `Button.ghost.label.textDecoration.*` (`"underline"`/`"none"`); consumers hard-code these for now. Fully-transparent `#FF00FF00` stops inline as `rgb(255 0 255 / 0)` (hue irrelevant at alpha 0).

  Regenerated all `tokens-pd` artifacts (CSS, DTCG, Tailwind presets). The Tailwind preset builder skips unroutable component-tier color/gradient tokens with a warning instead of failing the build (semantic tokens still must route), so deeply-nested component roles (`box`, `tick`, `container`) stay in the CSS/tiers — consumers bind `var(--ui-*)` directly — but are omitted from the Tailwind preset.

  `ui-react`: re-theme the `Switch` and `Tooltip` components to the next-gen token names. `Tooltip` moves to `--ui-tooltip-container-border-radius`. `Switch` moves to the new `box`/`tick` model — track fill wired per checked-state (`--ui-switch-off-box-idle` / `--ui-switch-on-box-idle`, green), disabled to `--ui-switch-{on,off}-box-disabled` + `--ui-switch-global-tick-disabled` with a 1px inset `--ui-switch-global-box-border-color-disabled` border; the thumb is the single `--ui-switch-global-tick-*` color regardless of on/off (hover/active stops equal idle, so no hover color change). `ui-react/styles` swaps its dead `css/form` import for `css/input` + `css/checkbox` and adds `css/button-icon`.

  `ui-react` (continued): re-theme `Button`, `ButtonIcon`, `Breadcrumb`, `Checkbox`, and `Input` to the next-gen component tokens — they previously referenced dead token names (the retired `componentLegacy` / `--ui-form-*` tiers) and rendered unstyled. `Button` maps `background` → `container`, keeps `label`, adds per-state `icon` colors, and now only `secondary` / `inverted` carry a container border (others are borderless); geometry is tokenized via `--ui-button-global-container-*` and per-variant `padding-x` / `width-min` (`ghost` has 0 padding-x and no min-width). `ButtonIcon` moves to the borderless `--ui-button-icon-global-*` container/icon tokens. `Breadcrumb` moves to `link-label-<state>` (now darkening on hover/active), `page-label-color`, `separator-icon-{color,size}`, and `list-gap`. `Checkbox` moves to the dedicated `--ui-checkbox-{unchecked,checked,indeterminate}-box[-border-color]-<state>` + `-icon-` tiers with `global-box-*` geometry. `Input` moves to `--ui-input-{global-box,normal-box-border-color,error-box-border-color,content-value,content-placeholder}-*`. Visual-regression baselines regenerated in Docker for all re-themed components. Still pending: `Radio`, `Search`, `Select` remain on the removed `--ui-form-*` tier (Figma has no next-gen tokens for them yet) — a design prerequisite, tracked separately.

## 1.0.0

### Major Changes

- [#272](https://github.com/acronis/uikit/pull/272) [`d95fc1e`](https://github.com/acronis/uikit/commit/d95fc1e809f3f4fe0c62f0c92d0f48b81976765d) Thanks [@heygabecom](https://github.com/heygabecom)! - # `1.0.0` — first stable token release

  This is the first stable (`1.0.0`) release of the published token packages. It
  consolidates the entire `feature/design-tokens-update` line of work into one
  release rather than a chain of pre-`1.0` patch/minor bumps. Treat the prior
  `0.x` token JSON and `tokens-pd` output as superseded: paths, value shapes, and
  generated CSS variable names have all changed since the last published `0.x`.

  The two packages move in lockstep — `tokens-pd` is fully regenerated from
  `design-tokens` by `tools/style-dictionary`, so every `design-tokens` change
  below is reflected in the corresponding `tokens-pd` artifacts.

  ***

  ## `@acronis-platform/design-tokens` (→ `1.0.0`)

  ### Token value shape — native DTCG dimensions (BREAKING)
  - Dimension tokens (`$type: "dimension"` — `units.*`, `font.font-size`,
    `font.line-height`, `font.letter-spacing`, and every component dimension)
    now carry a **native DTCG** `$value: { value, unit }` (unit `px`/`rem`).
  - The custom `$extensions.com.acronis.units` value carrier (and its short-lived
    `{ components, dimensionSpace }` intermediate) is **removed**. Dimensions no
    longer stash their value in `$extensions`.
  - `fontWeight` and `fontFamily` are scalar DTCG types and carry a plain
    `$value` — a `number` for weight, a `string`/array for family — not a
    dimension object.
  - The schema descriptions were updated to native DTCG language to match.

  ### Schema file renamed `tokens.schema.json` → `tier.schema.json` (BREAKING)

  The validating schema moved from `schemas/tokens.schema.json` to
  `schemas/tier.schema.json`. It describes the structure of a whole **tier file**
  (`tiers/*.json`) — how tokens are grouped and nested within a tier, not just a
  single token — so the name now reflects what it validates.
  - The `$schema` value embedded in every tier file is now
    `"../schemas/tier.schema.json"` (the schema enforces this exact string as a
    `const`, so the file and its tier data move in lockstep).
  - The schema's own `$id` is updated to match.
  - Consumers that reference the schema by path (or key off the `$schema`
    discriminator string) must update to `tier.schema.json`. The package's
    `exports` map already exposes `./schemas/*`, so the import subpath simply
    changes filename.

  ### Transparent rule (BREAKING for affected leaves)

  A fully-transparent color (`alpha: 0`) is emitted as the CSS keyword
  `transparent` instead of an HSL object. Figma stores zero-alpha colors with
  arbitrary channels (often a magenta placeholder), so the RGB channels are
  meaningless. This applies to `palette.transparent.*` primitives and any
  component literal color at `alpha: 0`.

  ### Naming — camelCase aligned with Figma (BREAKING)

  Token segment names are kept **verbatim from Figma** (camelCase), no longer
  kebab-converted by the emitter:
  - `on surface` → `onSurface`, `on brand` → `onBrand`, etc. (all `on *` groups).
  - `status-strong` → `statusStrong`.
  - Component/SubComponent names stay PascalCase (e.g. `MenuItemList`).

  Note: the generated CSS custom-property names are unaffected — Style Dictionary
  kebab-cases path segments into variable names, so `--ui-…-on-surface-…` is
  preserved for consumers.

  ### Tiers rebuilt from Figma (BREAKING)
  - **Semantics** (`tiers/semantic.json` → `tiers/semantics.json`, renamed):
    added the build-time `com.acronis.tailwindRoles` routing extension; removed
    the `brand-b` values mode; renamed token paths; deleted obsolete tokens;
    relocated the four AI gradients to a top-level `gradients.*` root, and a
    gradient-valued border (`border.onStatus.ai-strong`) now resolves through a
    proper `{gradients.ai.idle}` alias rather than a literal CSS string.
  - **Components** (`tiers/components.json`): rebuilt from Figma's
    `Brand/components` group; the `Input` component was renamed to `InputText`
    (the entire `input.*` namespace → `input-text.*`); added `breadcrumb`,
    `checkbox`, `switch`, `tag`; component-level typography tokens now correctly
    carry `$type: "typography"` so they render as `.typography-*` utility classes
    (previously emitted as malformed CSS variables).
  - **Primitives** (`tiers/primitives.json`): added the Ink palette ramp and the
    `size-20` unit.

  ### Formatting — emitter owns tier format
  - All tier JSON (`tiers/*.json`) and the `tokens-pd/dtcg/*` mirrors are now
    **fully alphabetically ordered** (numeric keys stay numeric); the emitter's
    formatter matches the prior Prettier line/inline conventions (printWidth 80).
  - `tiers/` is added to `.prettierignore` so the emitter — not Prettier — owns
    the on-disk format.

  ### Sync pipeline

  The `/figma-to-design-tokens` skill (a self-contained pipeline: pull →
  snapshot-build → diff → emit, with a human-reviewable diff gate) replaces the
  legacy temporary pull scripts as the canonical token-sync path.

  ### Context docs — removed `brand-matrix.md`

  `context/brand-matrix.md` is deleted. It carried information that was untrue,
  out of scope for this data-only package, or already owned by another context
  file:
  - **Wrong vocabulary.** It called the `light` / `dark` axis a "Color mode",
    but `glossary.md` defines that axis as **Theme** — reusing an established
    term with a different meaning.
  - **Out-of-scope implementation details.** It referenced the legacy `--av-*`
    CSS prefix and the `oklch` color space; CSS variable names and the output
    color space are the translation tool's concern, not the token data.
  - **Out-of-scope "Delivery model".** Emitted stylesheets, override-only files,
    and `light-dark()` composition belong to
    `@acronis-platform/style-dictionary` → `@acronis-platform/tokens-pd`, not to
    the data package.
  - **Untrue / unmaintained roadmap content.** The "Brand override surface" table
    (keyed by `--ui-*` output variables) and "The matrix" (a speculative list of
    ~22 legacy brands with partner mappings and guessed dark-mode columns) were
    unverified planning material, not properties of the token data.
  - **Misplaced how-to.** "Adding a brand" belongs in `CONTRIBUTING.md`.

  The accurate, in-scope idea — the Brand axis is data-driven and adding a brand
  is purely additive — is already covered by `glossary.md`, `manifest.md`, and
  `token-contract.md`; references within the design-owned packages are updated in
  the same change.

  ***

  ## `@acronis-platform/tokens-pd` (→ `1.0.0`)

  Full regeneration from `@acronis-platform/design-tokens`. All generated CSS,
  Tailwind presets, and the DTCG mirror reflect every change above.
  - **CSS custom properties**: `--ui-input-*` renamed to `--ui-input-text-*`
    (Input → InputText); new per-component artifacts for `breadcrumb`,
    `checkbox`, `switch`, `tag`; component typography now emits `.typography-*`
    classes.
  - **Transparent**: fully-transparent colors render as the `transparent`
    keyword (`light-dark(transparent, transparent)`), never `rgb(… / 0)`.
  - **Native DTCG**: the Style Dictionary preprocessor passes native
    `$value: { value, unit }` through directly (the custom-carrier normalization
    step is gone); the DTCG mirror is written deep-sorted to match the source
    tiers.
  - **Tailwind**: role-restricted presets regenerated; component color roles are
    routed from the leaf via the data-driven `com.acronis.tailwindRoles` map; keys
    are normalized to lowercase kebab-case.
  - **Gradients**: data-driven gradient rebuild (AI gradients sourced from
    `gradients.*`).

  ## Migration
  - Update any reference to `--ui-input-*` CSS variables to `--ui-input-text-*`.
  - If you consumed `design-tokens` JSON directly, re-read dimension values as
    native DTCG `{ value, unit }` objects and font weight/family as scalars; the
    `$extensions.com.acronis.units` carrier no longer exists.
  - The semantic tier file is now `tiers/semantics.json` (was `semantic.json`),
    and AI gradients live under the top-level `gradients.*` root.

## 0.6.1

### Patch Changes

- [#250](https://github.com/acronis/uikit/pull/250) [`d3541f9`](https://github.com/acronis/uikit/commit/d3541f9c40c5d12f1c464ad68bf42709b89948e5) Thanks [@leonid](https://github.com/leonid)! - Fix the AI background gradient to run **left-to-right** (90deg) instead of
  top-to-bottom, matching the Figma design. The `background.ai` gradient transform
  in design-tokens carried a stale vertical matrix (`[[0,1,0],[-1,0,1]]` → 180deg);
  it is now identity (`[[1,0,0],[0,1,0]]` → 90deg), and `tokens-pd` is regenerated.

  The AI `Button` variant now always leads with the `Sparkles` icon before its
  label, matching the Figma "Ai" button, and sets `bg-origin-border` so the
  gradient covers the full button box (previously a 1px sliver of the gradient's
  opposite end showed on the left and right border edges).

## 0.6.0

### Minor Changes

- [#221](https://github.com/acronis/uikit/pull/221) [`848c600`](https://github.com/acronis/uikit/commit/848c60036c7591cf1d1ab01996147660c3cca7d5) Thanks [@heygabecom](https://github.com/heygabecom)! - Rename the token-source directory `tokens/` to `tiers/`.

  The three token files now live under `tiers/` instead of `tokens/`, matching
  the "Tier" vocabulary (primitives / semantics / components) used throughout the
  package docs and glossary. Nothing about the token data, shape, or values
  changed — this is purely the directory name and the paths that point at it.

  **BREAKING (subpath exports):** the package `exports` subpaths moved with the
  directory. Update any imports:
  - `@acronis-platform/design-tokens/tokens/primitives.json` → `@acronis-platform/design-tokens/tiers/primitives.json`
  - `@acronis-platform/design-tokens/tokens/semantic.json` → `@acronis-platform/design-tokens/tiers/semantic.json`
  - `@acronis-platform/design-tokens/tokens/components.json` → `@acronis-platform/design-tokens/tiers/components.json`

  A translation tool that globs the package (e.g. Style Dictionary
  `source: ['node_modules/@acronis-platform/design-tokens/tiers/*.json']`) must
  point at `tiers/` and match the new path in any file-pattern parser
  (`/\/tiers\/.*\.json$/`).

  Also updated alongside the rename so the package stays consistent:
  - `package.json` — `files` (`tiers/**`), the `exports` map, and the `validate`
    script's `-d` token-file paths.
  - `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, and `context/*.md` — every
    reference to the source directory and the worked Style Dictionary example.
  - `.tmp/scripts/*.mjs` Figma-sync emitters and `lib/typography-map.mjs` — output
    paths and comments now write/refer to `tiers/` (the `.tmp/figma-tokens/`
    snapshot directory is unaffected).
  - `tools/style-dictionary` (private, not published) — `src/tokens.ts` source
    import paths and its `AGENTS.md` build-trigger table.

## 0.5.0

### Minor Changes

- [#98](https://github.com/acronis/uikit/pull/98) [`23b62d4`](https://github.com/acronis/uikit/commit/23b62d49263276956b46d34cdd084003c9fd566b) Thanks [@heygabecom](https://github.com/heygabecom)! - Full Figma → tokens re-sync. Regenerated `primitives.json`, `semantic.json`, and
  `components.json` from the current Figma state via the documented sync workflow
  (`context/figma-sync.md`). The JSON now mirrors Figma exactly; removed/renamed
  paths were accepted rather than aliased.

  **Added**
  - `components.button.icon.*` (16) — new icon-button color group: `background` /
    `border` / `icon` / `label` × `idle` / `hover` / `active` / `disabled`,
    mirroring the `ghost` group. (Backs the Figma `ButtonIcon` component, which was
    rebound to these variables.)
  - `components.switch.*` (16) — switch promoted to its own top-level component
    (`background` / `border` / `circle` states + `units.*`), moved out of `form`.
  - `components.item.*` (~30) — expanded successor to `sub-item` (adds `gap-x` /
    `gap-y`, `height-min`, `padding-x-small`).
  - `components.form.{background,border,icon,circle,units}.*` (~30) — restructured
    form tokens with a sized scale (`sm` / `md` / `lg` / `xlg`).
  - `colors.focus.{brand,error,primary,secondary}` (4) — new focus-ring colors.
  - `typography.{body.form-label, link.default, link.default-underline, link.strong,
link.strong-underline}` (5).

  **Changed values**
  - **`brand-b` is now authored (teal).** 25 `semantic.colors.*` tokens flipped
    their `brand-b` mode from `{palette.blue.*}` to `{palette.teal.*}`; the
    `acronis` mode is unchanged. Previously `brand-b` mirrored `acronis`; designers
    have now given it its own palette. This also refreshes 29 `components.button.*`
    values that alias those semantics.
  - `palette.blue.7` dark-mode lightness `45.1 → 54.9` (light mode unchanged).
  - `button._global.padding-x` and `button._global.radius` updated.
  - Typography: `note.default` / `note.heading` now alias `{font.font-size.11}`
    instead of an inline `11px`; `headings.display` letter-spacing refreshed.

  **Changed metadata**
  - `units.stroke.3` is now scoped to **`EFFECT_FLOAT`** only
    (`$extensions.com.figma.scopes`); previously it also carried `STROKE_FLOAT`.
    The token value is unchanged — this only affects which Figma properties the
    variable is offered for.

  **Removed / renamed (breaking for consumers of the old paths)**

  These paths no longer exist in Figma. Most are renames — migrate references:
  - `form.input.*` → `form.background` / `form.border` / `form.icon.*` (same values).
  - `form.switch.*` → top-level `switch.*` (same values).
  - `form._global.*` → `form.units.*` — not 1:1; single values replaced by the
    sized scale (e.g. height `32` → `units.height-lg` `48`, radius `4` →
    `units.radius-lg` `24`).
  - `sub-item.*` → `item.*` (values largely identical; some `brand-b` values differ
    due to teal authoring).
  - `typography.body.link`, `typography.body.strong-underlined`,
    `typography.link.primary`, `typography.link.secondary` → renamed under
    `typography.link.{default,default-underline,strong,strong-underline}`.

  No successor (genuinely dropped): `sub-item.gap` (split into `item.gap-x` /
  `item.gap-y`), `sub-item.height-header`, `sub-item.width-collapsed`.

## 0.4.0

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

## 0.3.0

### Minor Changes

- [#79](https://github.com/acronis/uikit/pull/79) [`40d3d53`](https://github.com/acronis/uikit/commit/40d3d535ed21da9b5c80142e7f496bc22e19dde9) Thanks [@heygabecom](https://github.com/heygabecom)! - Rename the design-data packages to disambiguate them as design-only data: `@acronis-platform/tokens` → `@acronis-platform/design-tokens` and `@acronis-platform/assets` → `@acronis-platform/design-assets`. Update your dependencies and imports to the new package names.

## 0.2.0

### Minor Changes

- [#77](https://github.com/acronis/uikit/pull/77) [`bd04411`](https://github.com/acronis/uikit/commit/bd0441158c54f08acbd99f67648a98af025089f1) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Add the `@acronis-platform/design-tokens` design-data package — DTCG-2025.10-conformant design-token JSON (primitives, semantic, components), validated with ajv against `schemas/tokens.schema.json`. Data-only (no build, no runtime API), consumed via its `exports` map.
