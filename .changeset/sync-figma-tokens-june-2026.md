---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
---

## design-tokens

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
