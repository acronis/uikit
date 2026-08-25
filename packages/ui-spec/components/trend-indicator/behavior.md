# TrendIndicator — behavior

## Renders a direction + change

- **Given** `direction="up"`, `value="12%"`
  **When** rendered
  **Then** an up trend arrow precedes `12%`.

- **Given** `direction="flat"`
  **Then** a horizontal arrow glyph is shown (the "no meaningful change" mark).

## Direction is not sentiment

- **Given** `direction="up"`, `sentiment="negative"` (e.g. threats rose)
  **Then** the arrow points up but the color is the negative/danger family — the
  kit does **not** infer good/bad from the arrow.

- **Given** `direction="down"`, `sentiment="positive"` (e.g. MTTR fell)
  **Then** the arrow points down but the color is the positive/success family.

## Value is caller-formatted

- **Given** `value="4.2 h → 2.8 h"` (or `"Improving"`)
  **Then** the text is rendered verbatim — the kit never diffs numbers, rounds,
  adds a sign, or converts units.

## Icon visibility

- **Given** `showIcon={false}`
  **Then** no glyph renders (use sparingly — color alone should not carry
  meaning).

## Tooltip

- **Given** a `tooltip`
  **When** the indicator is hovered or focused
  **Then** the hint appears; the trigger is keyboard-focusable.
